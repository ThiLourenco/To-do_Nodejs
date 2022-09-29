const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers
  const user = users.find(
  user => user.username === username )

  if(!user) {
    return response.status(404).json({ error: 'User not found'
  })
}

request.user = user

next();

}

function checkTodoExists(request, response, next) {
  const { id } = request.params;
  const { user } = request;

  const todo = user.todos.find(t => t.id === id);

  console.log(todo, user);

  if (!todo) {
    return response.status(404).json({ error: 'Todo not found' });
  }

  request.todo = todo;

  return next();
}

app.post('/users', (request, response) => {
  const { name, username } = request.body;

  const userAlreadyExists = users.find( user => user.username === username );

  if(userAlreadyExists) {
    return response.status(400).json({
      error: 'User already exists',
    })
  }

  const user = {
    id: uuidv4(),
    name,
    username,
    todos: []
  }

  users.push(user);

  return response.status(201).json(user)
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  const { user } = request

  return response.json(user.todos).send();
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  const { title, deadline } = request.body
  const { user } = request
  
  const todo = {
    id: uuidv4(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date()
  }

  user.todos.push(todo)
  return response.status(201).json(todo)

});

app.put('/todos/:id', checksExistsUserAccount, checkTodoExists, (request, response) => {
  const { title, deadline } = request.body;
  const { id } = request.params;
  const { user } = request;

  const task = user.todos.find(task => task.id == id);

  if (!task) {
    return response.status(404).json({ error: "Task not found" });
  }

  task.title = title;
  task.deadline = new Date(deadline);

  return response.status(201).json(task);

});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  const { id } = request.params;
  const { user } = request;

  const task = user.todos.find(task => task.id == id);

  if (!task) {
    return response.status(404).json({ error: "Task not found" });
  }
  
  task.done = true;

  return response.status(201).json(task);
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  const { id } = request.params;
  const { user } = request;

  const taskIndex = user.todos.findIndex(task => task.id == id);

  if (taskIndex == -1) {
    return response.status(404).json({ error: "Task not found" });
  }

  user.todos.splice(taskIndex, 1);

  return response.status(204).json()
});

module.exports = app;