require('../common');

var assert = require("assert");
var http = require("http");
var sys = require("sys");

var body = "hello world";

server = http.createServer(function (req, res) {
  res.writeHeader(200 , { 'Content-Length': body.length.toString()
                        , 'Content-Type': 'text/plain'
                        });
  sys.puts('method: ' + req.method);
  if (req.method != 'HEAD') res.write(body);
  res.end();
});
server.listen(PORT);

var gotEnd = false;

server.addListener('listening', function() {
  var client = http.createClient(PORT);
  var request = client.request("HEAD", "/");
  request.addListener('response', function (response) {
    sys.puts('got response');
    response.addListener("data", function () {
      process.exit(2);
    });
    response.addListener("end", function () {
      process.exit(0);
    });
  });
  request.end();
});

//give a bit of time for the server to respond before we check it
setTimeout(function() {
  process.exit(1);
}, 2000);
