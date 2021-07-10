// const moment = require('moment');
const express = require('express');
const path = require('path');
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
// const fileUpload = require('express-fileupload');
const jsonServer = require('json-server');
const open = require('open');

const middlewares = jsonServer.defaults();
// const fs = require('fs');
const isDev = process.env.NODE_ENV !== 'production';
const router = jsonServer.router(path.join(process.cwd(), '/server/data/db.json'));

const PORT = process.env.PORT || 5000;

// Multi-process to utilize all CPU cores.
if (!isDev && cluster.isMaster) {
  console.error(`Node cluster master ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.error(
      `Node cluster worker ${worker.process.pid} exited: code ${code}, signal ${signal}`
    );
  });
} else {
  const app = express();

  // Priority serve any static files.
  app.use(express.static(path.resolve(__dirname, '../react-ui/build')));

  app.use('/db', middlewares, router);

  // All remaining requests return the React app, so it can handle routing.

  // All remaining requests return the React app, so it can handle routing.
  app.get('*', function (request, response) {
    response.sendFile(
      path.resolve(__dirname, '../react-ui/build', 'index.html')
    );
  });

  app.listen(PORT, function () {
    console.error(
      `Node ${
        isDev ? 'dev server' : 'cluster worker ' + process.pid
      }: listening on port ${PORT}`
    );
  });
}

// opens the url in the default browser
open('http://localhost:5000');
