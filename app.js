const app = require('express')()
const http = require('http');


//hue
const hueApiPath = 'api/ZwsjmPNHYJ3es6VMmWrP2QN2WdVa4pkAjJ6F3mlr';
const hueRootPath = '192.168.1.12';
const hueFullPath = `http://${hueRootPath}/${hueApiPath}/`

const hackMiddleWare = function(req, res, next)
{
  console.log('Inject date in req.');
  req.requestedTime = new Date();
  next();
}

app.get('/test', 
  hackMiddleWare,
  function(req, res, next)
  {
    new Room().light(true);
    next();
  },
  function(req, res){
    res.send(`Hello world! It\'s ${req.requestedTime}`);
  }
);

app.get('/', function(req, res){
  res.send(`This is home page. It\'s ${req.requestedTime}`);
});

app.listen(3000, function(){
  console.log('Example app listening on port 3000!');
});


const Client = require('node-rest-client').Client;
class Room
{
  constructor(){
    this.client = new Client();
  }

  light(on){
    let requestOptions = {
      "host": `${hueFullPath}groups/1/action`,
      "method": "PUT",
      "headers": {
        "Content-Type": "application/json",
        "Content-Length": 1
      },
      "data": { "on": true }
    };
    const req = http.request(requestOptions, function(res) {
      res.setEncoding("utf8");
      res.on("data", function (chunk) {
        console.log("Response: " + chunk);
      });
    });
  }
}
