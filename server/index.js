const express = require('express');
const path = require('path');
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
const fileUpload = require('express-fileupload');
const jsonServer = require('json-server');
const app = jsonServer.create();
const middlewares = jsonServer.defaults();
const fs = require('fs');
const router = jsonServer.router(path.join(__dirname, '/data/db.json'))

const isDev = process.env.NODE_ENV !== 'production';
const PORT = process.env.PORT || 5000;

// Multi-process to utilize all CPU cores.
if (!isDev && cluster.isMaster) {
  console.error(`Node cluster master ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.error(`Node cluster worker ${worker.process.pid} exited: code ${code}, signal ${signal}`);
  });

} else {
  const app = express();

  // Priority serve any static files.
  app.use(express.static(path.resolve(__dirname, '../react-ui/build')));

  app.use(fileUpload());

  app.post('/upload', function(req, res) {
    if (!req.files || Object.keys(req.files).length === 0)
      return res.status(400).send('No files were uploaded.');
  
    const file = req.files.sampleFile;
    if(file.name.split('.').pop() != 'json')
      return res.status(400).send('This is not a json file');
  
    fs.readFile(__dirname + '/data/db.json', 'utf8', function readFileCallback(err, data) {
      let fileType = 'orders';
      if (err)
        return res.status(500).send(err);
      try {
        const db = JSON.parse(data); //now it an object
        if(fileType == 'orders') {
          db[fileType].push(...JSON.parse(file.data));
          db[fileType] = db[fileType].filter((v,i,a)=>a.findIndex(t=>(t.id === v.id))===i);
        }
        const jsString = JSON.stringify(db);
        fs.writeFile(__dirname + '/data/db.json', jsString, 'utf8', function (err, data) {
          if (err)
            return res.status(500).send(err);
          return res.status(200).send('Successful')
        });
      } catch ( error ) {
        return res.status(400).send('Invalid json file');
      }
    });
  });
  
  app.use('/db', middlewares, router);

  // All remaining requests return the React app, so it can handle routing.
  app.get('*', function(request, response) {
    response.sendFile(path.resolve(__dirname, '../react-ui/build', 'index.html'));
  });

  app.listen(PORT, function () {
    console.error(`Node ${isDev ? 'dev server' : 'cluster worker '+process.pid}: listening on port ${PORT}`);
  });
}
