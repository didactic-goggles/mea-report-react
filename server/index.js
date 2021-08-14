// const moment = require('moment');
const express = require('express');
const path = require('path');
const fs = require('fs');
// const _ = require('lodash');
// const cluster = require('cluster');
// const numCPUs = require('os').cpus().length;
// const fileUpload = require('express-fileupload');
const jsonServer = require('json-server');
const open = require('open');

const middlewares = jsonServer.defaults();
// const fs = require('fs');
const isDev = process.env.NODE_ENV !== 'production';
const router = jsonServer.router(
  path.join(process.cwd(), '/server/data/db.json')
);

const PORT = process.env.PORT || 5000;

const app = express();
app.use(jsonServer.bodyParser);
// Priority serve any static files.
app.use(express.static(path.resolve(__dirname, '../react-ui/build')));

app.use('/db', middlewares, router);

app.post('/multiple/ordersCollection', (req, res) => {
  fs.readFile('server/data/db.json',function(err,content){
    if(err) throw err;
    var parseJson = JSON.parse(content);
    parseJson.orders.push(...req.body);
    fs.writeFile('server/data/db.json',JSON.stringify(parseJson),function(err){
      if(err) throw err;
      res.sendStatus(201);
    })
  })
  // const db = router.db; // Assign the lowdb instance
  // // console.log(req.body);
  // if (Array.isArray(req.body)) {
  //   req.body.forEach((element) => {
  //     insert(db, 'orders', element); // Add a post
  //   });
  // } else {
  //   insert(db, 'orders', req.body); // Add a post
  // }
  // res.sendStatus(200);

  // /**
  //  * Checks whether the id of the new data already exists in the DB
  //  * @param {*} db - DB object
  //  * @param {String} collection - Name of the array / collection in the DB / JSON file
  //  * @param {*} data - New record
  //  */
  // function insert(db, collection, data) {
  //   const table = db.get(collection);
  //   if (_.isEmpty(table.find(data).value())) {
  //     table.push(data).write();
  //   }
  // }
});

// All remaining requests return the React app, so it can handle routing.
app.get('*', function (request, response) {
  response.sendFile(path.resolve(__dirname, '../react-ui/build', 'index.html'));
});

app.listen(PORT, function () {
  console.error(
    `Node ${
      isDev ? 'dev server' : 'cluster worker ' + process.pid
    }: listening on port ${PORT}`
  );
});

// opens the url in the default browser
// open('http://localhost:5000');
