const express = require('express');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(express.json());

const port = 5050;
const custumers = [];

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

app.listen(port);
