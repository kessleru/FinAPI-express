# FinAPI - Financeira

API financeira simples construída com **Express** para gerenciamento de contas bancárias, depósitos, saques e extratos.

## Tecnologias

- [Node.js](https://nodejs.org/)
- [Express 5](https://expressjs.com/)
- [uuid](https://www.npmjs.com/package/uuid)
- [Nodemon](https://nodemon.io/) (dev)

## Pré-requisitos

- Node.js >= 18
- pnpm (ou npm/yarn)

## Instalação

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/FinAPI-express.git
cd FinAPI-express

# Instale as dependências
pnpm install
```

## Execução

```bash
# Modo desenvolvimento (com hot reload)
pnpm dev

# O servidor estará disponível em http://localhost:5050
```

## Estrutura da conta

| Campo       | Tipo   | Descrição                     |
| ----------- | ------ | ----------------------------- |
| `id`        | UUID   | Identificador único da conta  |
| `cpf`       | string | CPF do cliente                |
| `name`      | string | Nome do cliente               |
| `statement` | array  | Extrato de operações da conta |

## Rotas da API

> Todas as rotas (exceto a criação de conta) exigem o header `cpf` para identificação do cliente.

### Criar conta

```
POST /account
```

**Body:**

```json
{
  "cpf": "12345678900",
  "name": "João Silva"
}
```

**Respostas:**

- `201` — Conta criada com sucesso
- `400` — CPF já cadastrado

---

### Obter dados da conta

```
GET /account
```

**Headers:** `cpf: 12345678900`

**Resposta:** `200` — Objeto da conta

---

### Atualizar conta

```
PUT /account
```

**Headers:** `cpf: 12345678900`

**Body:**

```json
{
  "name": "João S. Silva"
}
```

**Resposta:** `201` — Dados atualizados

---

### Deletar conta

```
DELETE /account
```

**Headers:** `cpf: 12345678900`

**Resposta:** `200` — Retorna lista de contas restantes

---

### Consultar extrato

```
GET /statement
```

**Headers:** `cpf: 12345678900`

**Resposta:** `200` — Array de operações

---

### Consultar extrato por data

```
GET /statement/date?date=2026-02-09
```

**Headers:** `cpf: 12345678900`

**Resposta:** `200` — Array de operações filtradas pela data

---

### Realizar depósito

```
POST /deposit
```

**Headers:** `cpf: 12345678900`

**Body:**

```json
{
  "description": "Salário",
  "amount": 5000
}
```

**Resposta:** `201` — Depósito realizado

---

### Realizar saque

```
POST /withdraw
```

**Headers:** `cpf: 12345678900`

**Body:**

```json
{
  "amount": 1500
}
```

**Respostas:**

- `201` — Saque realizado
- `400` — Saldo insuficiente

---

### Consultar saldo

```
GET /balance
```

**Headers:** `cpf: 12345678900`

**Resposta:** `200` — Valor numérico do saldo

---

## Requisitos

- [x] Deve ser possível criar uma conta
- [x] Deve ser possível buscar o extrato bancário do cliente
- [x] Deve ser possível realizar um depósito
- [x] Deve ser possível realizar um saque
- [x] Deve ser possível buscar o extrato bancário do cliente por data
- [x] Deve ser possível atualizar dados da conta do cliente
- [x] Deve ser possível obter dados da conta do cliente
- [x] Deve ser possível deletar uma conta
- [x] Deve ser possível obter o saldo da conta

## Regras de negócio

- [x] Não deve ser possível cadastrar uma conta com CPF já existente
- [x] Não deve ser possível buscar extrato em uma conta não existente
- [x] Não deve ser possível fazer depósito em uma conta não existente
- [x] Não deve ser possível fazer um saque em uma conta não existente
- [x] Não deve ser possível fazer saque quando o saldo for insuficiente
- [x] Não deve ser possível excluir uma conta não existente
- [x] Não deve ser possível buscar salde de uma conta não existente
