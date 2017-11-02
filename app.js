const app = require('express')()
const http = require('http');


//hue
const hueApiPath = '/api/ZwsjmPNHYJ3es6VMmWrP2QN2WdVa4pkAjJ6F3mlr';
const hueHost = '192.168.1.12';

const injectDate = function(req, res, next)
{
  req.requestedTime = new Date();
  next();
}

const done = function(req, res, next)
{
  res.send('done.');
}

app.get('/on', 
  function(req, res, next)
  {
    new Room().light(true);
    next();
  },
  done
);

app.get('/off',
  function(req, res, next)
  {
    new Room().light(false);
    next();
  },
  done
)

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
    const req = new HueRequest('groups/1/action', `{"on":${on}}`);
    req.exec(resp => console.log(resp));
  }
}

class HueRequest
{
  constructor(url, data)
  {
    this.data = data;
    this.requestOptions = {
      "hostname": hueHost,
      "method": "PUT",
      "data": data,
      "path": `${hueApiPath}/groups/1/action`,
      "headers": {
        "Content-Type": "application/json"
      }
    };
  }

  exec(callback)
  {
    const req = http.request(this.requestOptions, function(res) {
      let result = '';
      res.setEncoding("utf8");
      res.on("data", chunk => result += chunk);
      res.on('end', () => callback(result));
    });

    req.on('error', e => console.error(`problem with request ${e.message}`));
    req.write(this.data);
    req.end();
  }
}
