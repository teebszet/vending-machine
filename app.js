var express = require('express');

var app = express();

var server = app.listen(3838, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('web server listening at http://%s:%s', host, port);
});
