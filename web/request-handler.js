var path = require('path');
var fs = require('fs');
var archive = require('../helpers/archive-helpers');
var helpers = require('./http-helpers');
// var httpRequest = require('http-request');
// require more modules/folders here!

exports.handleRequest = function (request, response) {
  var statusCode = 404;


  if(request.method === 'GET'){
    helpers.handleGET(request, response);
  }
  else if(request.method === 'POST'){
    helpers.handlePOST(request, response);
  }



};
