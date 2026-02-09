const express = require('express');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(express.json());

const port = 5050;
const customers = [];

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

  const balance = getBalance();

  if (balance < amount) {
    return res.status(400).json({ error: 'Insufficient funds!' });
  }

  const statementOperation = {
    amount,
    created_at: new Date(),
    type: 'debit',
  };

  customer.statement.push(statementOperation);
  return response.status(201).send();
});

app.listen(port);
