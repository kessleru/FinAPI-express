const express = require('express');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(express.json());

const port = 5050;
const custumers = [];

// Middleware
function verifyIfExistsAccountCPF(req, res, next) {
  const { cpf } = req.headers;

  const custumer = custumers.find((custumer) => custumer.cpf === cpf);

  if (!custumer) {
    return res.status(400).json({ error: 'Customer not found' });
  }

  req.custumer = custumer;

  return next();
}

/**
 * cpf - string
 * name - string
 * id - uuid
 * statement []
 */
app.post('/account', (req, res) => {
  const { cpf, name } = req.body;

  const custumerAlreadyExists = custumers.some(
    (custumer) => custumer.cpf === cpf
  );

  if (custumerAlreadyExists) {
    return res.status(400).json({ error: 'Custumer already exists!' });
  }

  custumers.push({
    cpf,
    name,
    id: uuidv4(),
    statement: [],
  });

  return res.status(201).send();
});

app.get('/statement', verifyIfExistsAccountCPF, (req, res) => {
  const { custumer } = req;
  return res.json(custumer.statement);
});

app.post('/deposit', verifyIfExistsAccountCPF, (req, res) => {
  const { description, amount } = req.body;
  const {custumer} = req;

  const statementOperation = {
    description,
    amount,
    created_at: new Date(),
    type: "credit",
  }

  custumer.statement.push(statementOperation);

  return res.status(201).send();
});

app.listen(port);
