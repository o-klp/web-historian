var path = require('path');
var fs = require('fs');
var archive = require('../helpers/archive-helpers');
var helpers = require('./http-helpers');
var httpRequest = require('http-request');
// require more modules/folders here!

exports.handleRequest = function (request, response) {
  var statusCode = 200;
  console.log('got a request', request.url);

  var pathName = request.url;

  fs.readFile(archive.paths[pathName], function(error, data){
    if(error) throw error;
    response.writeHead(statusCode, helpers.headers);
    response.end(data);
  });

};
