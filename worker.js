const fs = require('fs');
const moment = require('moment');

let throng = require('throng');
let Queue = require("bull");
// Connect to a local redis instance locally, and the Heroku-provided URL in production
let REDIS_URL = process.env.REDIS_URL || "redis://127.0.0.1:6379";

// Spin up multiple processes to handle jobs to take advantage of more CPU cores
// See: https://devcenter.heroku.com/articles/node-concurrency for more info
let workers = process.env.WEB_CONCURRENCY || 2;

// The maximum number of jobs each worker should process at once. This will need
// to be tuned for your application. If each job is mostly waiting on network 
// responses it can be much higher. If each job is CPU-intensive, it might need
// to be much lower.
let maxJobsPerWorker = 50;

// function sleep(ms) {
//   return new Promise(resolve => setTimeout(resolve, ms));
// }

function start() {
  // Connect to the named work queue
  let workQueue = new Queue('work', REDIS_URL);

  workQueue.process(maxJobsPerWorker, async (job) => {
    // const req = {};
    // req.body = job.data;
    const { file, fileType } = job.data;
    // This is an example job that just slowly reports on progress
    // while doing no work. Replace this with your own job logic.
    fs.readFile(__dirname + '/data/db.json', 'utf8', function readFileCallback(err, data) {
      
      if (err)
        return {
          status: 500,
          message: err 
        };
      try {
        const db = JSON.parse(data); //now it an object
        // if(fileType == 'orders') {
        //   db[fileType].push(...JSON.parse(file.data));
        //   db[fileType] = db[fileType].filter((v,i,a)=>a.findIndex(t=>(t.id === v.id))===i);
        // }
        const uploadedJSON = JSON.parse(file.data);
        if(fileType == 'orders' || fileType == 'payments') {
          uploadedJSON.forEach(item => {
            if(item.ID) {
              item.id = item.ID;
              delete item.ID;
            }
            let compareDate = 'created' in uploadedJSON[0] ? 'created' : 'Created';
            item[compareDate] = moment(item[compareDate]).unix();
          })
        }
        db[fileType].push(...uploadedJSON);
        // let compareKey = 'id' in db[fileType][0] ? 'id' : 'ID';
        // db[fileType] = db[fileType].filter((v,i,a)=>a.findIndex(t=>(t[compareKey] === v[compareKey]))===i);
        db.files.push({
          name: file.name,
          ext: file.name.split('.').pop(),
          fileType: fileType,
          created: new Date,
          size: file.size
        });
        const jsString = JSON.stringify(db);
        fs.writeFile(__dirname + '/data/db.json', jsString, 'utf8', function (err, data) {
          if (err) {
            console.log(error);
            return {
              status: 500,
              message: err 
            };
          }
          return {
            status: 200,
            message: 'Successful' 
          };
        });
      } catch ( error ) {
        // console.log(error);
        console.log(error);
        return {
          status: 400,
          message: 'Invalid json file' 
        };
      }
    });

    // A job can return values that will be stored in Redis as JSON
    // This return value is unused in this demo application.
    return { value: "This will be stored" };
  });
}

// Initialize the clustered worker process
// See: https://devcenter.heroku.com/articles/node-concurrency for more info
throng({ workers, start });
