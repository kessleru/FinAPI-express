const express = require('express');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(express.json());

const port = 5050;
const customers = [];

// Function to obtain account balance
function getBalance(statement) {
  const balance = statement.reduce((acc, operation) => {
    return operation.type === 'credit'
      ? acc + operation.amount
      : acc - operation.amount;
  }, 0);

  return balance;
}

// Middleware
function verifyIfExistsAccountCPF(req, res, next) {
  const { cpf } = req.headers;

  const customer = customers.find((custumer) => custumer.cpf === cpf);

  if (!customer) {
    return res.status(400).json({ error: 'Customer not found' });
  }

  req.customer = customer;

  return next();
}

// Account structure
/**
 * cpf - string
 * name - string
 * id - uuid
 * statement []
 */
// Create an account
app.post('/account', (req, res) => {
  const { cpf, name } = req.body;

  const customerAlreadyExists = customers.some(
    (custumer) => custumer.cpf === cpf
  );

  if (customerAlreadyExists) {
    return res.status(400).json({ error: 'Customer already exists!' });
  }

  customers.push({
    cpf,
    name,
    id: uuidv4(),
    statement: [],
  });

  return res.status(201).send();
});

// Search a statement
app.get('/statement', verifyIfExistsAccountCPF, (req, res) => {
  const { customer } = req;
  return res.json(customer.statement);
});

// Make a deposit to account
app.post('/deposit', verifyIfExistsAccountCPF, (req, res) => {
  const { description, amount } = req.body;
  const { customer } = req;

  const statementOperation = {
    description,
    amount,
    created_at: new Date(),
    type: 'credit',
  };

  customer.statement.push(statementOperation);

  return res.status(201).send();
});

// Make a withdraw
app.post('/withdraw', verifyIfExistsAccountCPF, (req, res) => {
  const { amount } = req.body;
  const { customer } = req;

  const balance = getBalance(customer.statement);

  if (balance < amount) {
    return res.status(400).json({ error: 'Insufficient funds!' });
  }

  const statementOperation = {
    amount,
    created_at: new Date(),
    type: 'debit',
  };

  customer.statement.push(statementOperation);
  return res.status(201).send();
});

// Search for a statement by date
app.get('/statement/date', verifyIfExistsAccountCPF, (req, res) => {
  const { customer } = req;
  const { date } = req.query;

  console.log(`date: ${date}`); // returns 2026-02-09

  const dateFormat = new Date(date + ' 00:00');

  console.log(`dateFormat: ${dateFormat}`); // returns 2026-02-09T03:00:00.000Z
  console.log(`dateFormat.toDateString(): ${dateFormat.toDateString()}`); // returns Sun Feb 09 2026

  const statement = customer.statement.filter((statement) => {
    console.log(
      `statement.created_at.toDateString(): ${statement.created_at.toDateString()}`
    ); // returns Sun Feb 09 2026 (for matching entries)
    return statement.created_at.toDateString() === dateFormat.toDateString();
  });

  return res.json(statement);
});

// Update account data
app.put('/account', verifyIfExistsAccountCPF, (req, res) => {
  const { name } = req.body;
  const { customer } = req;

  customer.name = name;

  return res.status(201).send();
});

// Show account data
app.get('/account', verifyIfExistsAccountCPF, (req, res) => {
  const { customer } = req;

  return res.json(customer);
});

// Delete an account
app.delete('/account', verifyIfExistsAccountCPF, (req, res) => {
  const { customer } = req;

  const customerIndex = customers.indexOf(customer);
  customers.splice(customerIndex, 1);

  return res.status(200).json(customers);
});

// Show account balance
app.get('/balance', verifyIfExistsAccountCPF, (req, res) => {
  const { customer } = req;

  const balance = getBalance(customer.statement);

  return res.json(balance);
});

app.listen(port);
