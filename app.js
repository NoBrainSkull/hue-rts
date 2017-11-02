const app = require('express')()
const http = require('http');


//hue
const hueApiPath = 'api/ZwsjmPNHYJ3es6VMmWrP2QN2WdVa4pkAjJ6F3mlr';
const hueRootPath = '192.168.1.12';
const hueFullPath = `http://${hueRootPath}/${hueApiPath}/`

const hackMiddleWare = function(req, res, next)
{
  req.requestedTime = new Date();
  next();
}

app.get('/test', 
  hackMiddleWare,
  function(req, res, next)
  {
    new Room().light(false);
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
const querystring = require('querystring');
class Room
{
  constructor(){
    this.client = new Client();
  }

  light(on){
    const req = new HueRequest('groups/1/action', {'on': on});
    req.exec(resp => console.log(resp));
  }
}

class HueRequest
{
  constructor(url, data)
  {
    this.data = querystring.stringify(data);
    this.requestOptions = {
      "host": `${hueFullPath}${url}`,
      "method": "PUT",
      "headers": {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(this.data)
      }
    };
  }

  exec(callback)
  {
    const req = http.request(this.requestOptions, function(res) {
      let result = '';
      res.setEncoding("utf8");
      res.on("data", chunk => result += chunk);
      res.on('end', () => callback(result))
    });

    req.on('error', e => console.error(`problem with request ${e.message}`));
    req.write(this.data);
    req.end();
  }
}
