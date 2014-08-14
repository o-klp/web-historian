var path = require('path');
var fs = require('fs');
var archive = require('../helpers/archive-helpers');
var helpers = require('./http-helpers');
// var httpRequest = require('http-request');
// require more modules/folders here!

exports.handleRequest = function (request, response) {
  var statusCode = 404;

  var pathName = request.url;

  if( archive.paths[pathName] ){
    fs.readFile(archive.paths[pathName], function(error, data){
      if(error) throw error;
      statusCode = 200;
      response.writeHead(statusCode, helpers.headers);
      response.end(data);
    });

  }else{
    var siteUrl = pathName.slice(1);
    archive.readListOfUrls(function(data){
      data.forEach(function(item){
        if(item === siteUrl){
          statusCode = 200;
          response.writeHead(statusCode, helpers.headers);
          response.end(item+" was found");
        }
      });
      response.writeHead(statusCode, helpers.headers);
      response.end(siteUrl + " was not found");
    });
  }

};
