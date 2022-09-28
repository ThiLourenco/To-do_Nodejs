const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers
// console.log(request.headers)
  const user = users.find(
    user => user.username === username )
  // console.log(userAlreadyExists)

  if(!user) {
    return response.status(404).json({ error: 'User not found'
  })
}

request.user = user

next();

}

app.post('/users', (request, response) => {
  const { name, username } = request.body;

  const userAlreadyExists = users.find( user => user.username === username );

  if(userAlreadyExists) {
    return response.status(400).json({
      message: 'User already exists',
    })
  }

  const user = {
    id: uuidv4(),
    name,
    username,
    todos: []
  }

  users.push(user);
  // console.log(users)

  return response.status(201).json(user)
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  const { user } = request
  console.log(user)
  
  console.log(users)
  return response.json(user.todos).send();
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

module.exports = app;