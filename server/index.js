
const express = require('express');
const path = require('path');
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
const fileUpload = require('express-fileupload');
const jsonServer = require('json-server');
const middlewares = jsonServer.defaults();

let Queue = require('bull');

const router = jsonServer.router(path.join(__dirname, '/data/db.json'));

const isDev = process.env.NODE_ENV !== 'production';
const PORT = process.env.PORT || 5000;
let REDIS_URL = process.env.REDIS_URL || 'redis://127.0.0.1:6379';

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

  let workQueue = new Queue('work', REDIS_URL);

  // Priority serve any static files.
  app.use(express.static(path.resolve(__dirname, '../react-ui/build')));

  app.use(fileUpload());

  app.post('/upload', async function(req, res) {
    if (!req.files || Object.keys(req.files).length === 0)
      return res.status(400).send('No files were uploaded.');
    
    const file = req.files.file;
    if(file.name.split('.').pop() != 'json')
      return res.status(400).send('This is not a json file');

    const fileType = req.body.fileType;
    let job = await workQueue.add('jobUpload', {file, fileType});
    return res.status(200).send(`Successful job-id: ${job.id}`);
  });
  
  app.use('/db', middlewares, router);

  // All remaining requests return the React app, so it can handle routing.
  app.get('*', function(request, response) {
    response.sendFile(path.resolve(__dirname, '../react-ui/build', 'index.html'));
  });
  
  workQueue.on('global:completed', (jobId, result) => {
    console.log(`Job completed with result ${result}`);
  });

  app.listen(PORT, function () {
    console.error(`Node ${isDev ? 'dev server' : 'cluster worker '+process.pid}: listening on port ${PORT}`);
  });

}
