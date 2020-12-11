const express = require('express');
const fileUpload = require('express-fileupload');
const jsonServer = require('json-server');
const app = jsonServer.create();
const middlewares = jsonServer.defaults();
const fs = require('fs');
const path = require('path')
const router = jsonServer.router(path.join(__dirname, '/data/db.json'))

const PORT = process.env.PORT || 3000;
app.use('/form', express.static(__dirname + '/index.html'));

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

app.use(express.static(path.join(__dirname, 'build')));

app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
})
app.listen(PORT, function() {
  console.log('Express server listening on port ', PORT); // eslint-disable-line
});