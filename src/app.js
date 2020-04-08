const express = require("express");
const cors = require("cors");
const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

const checkIdMiddleware = require('./middlewares/checkId')();

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { techs, title, url } = request.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  }

  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", checkIdMiddleware, (request, response) => {
  const { id } = request.params;
  const { techs, title, url } = request.body;

  const repositoryIndex = repositories.findIndex(repo => repo.id === id);

  if(repositoryIndex === -1){
    return response.status(400).json({
      error: 'O repositório com esse ID não existe.',
      params: {
        id
      }
    });
  }

  const { likes } = repositories[repositoryIndex];

  const repository = {
    id,
    title,
    url,
    techs,
    likes
  } 

  repositories[repositoryIndex] = repository;

  return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repo => repo.id === id);

  if(repositoryIndex === -1){
      return response.status(400).json({
          error: 'O repositório com esse ID não existe.',
          params: {
              id
          }
      });
  }

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repo => repo.id === id);

  if(repositoryIndex === -1){
      return response.status(400).json({
          error: 'O repositório com esse ID não existe.',
          params: {
              id
          }
      });
  }

  repositories[repositoryIndex].likes += 1;

  return response.json(repositories[repositoryIndex]);
});

module.exports = app;
