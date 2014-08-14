var path = require('path');
var fs = require('fs');
var archive = require('../helpers/archive-helpers');


exports.headers = headers = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10, // Seconds.
  'Content-Type': "text/html"
};

exports.serveAssets = function(res, asset, callback) {
  // Write some code here that helps serve up your static files!
  // (Static files are things like html (yours or archived from others...), css, or anything that doesn't change often.)

};

exports.handleGET = function(request, response){
  var statusCode = 404;
  var pathName = request.url;
  if( archive.paths[pathName] ){

    fs.readFile(archive.paths[pathName], function(error, data){

      if(error) throw error;
      statusCode = 200;
      response.writeHead(statusCode, exports.headers);
      response.end(data);

    });

  }else{
    var siteUrl = pathName.slice(1);
    archive.readListOfUrls(function(data){

      data.forEach(function(item){
        if(item === siteUrl){
          statusCode = 200;
          response.writeHead(statusCode, exports.headers);

          // if found, return scraped site

          response.end(item+" was found");
        }
      });

      // if not found, add url to list
      // and download url

      response.writeHead(statusCode, exports.headers);
      response.end(siteUrl + " was not found");

    });
  }
};
//add sites to our list and archives or retrieve if it already exists.
exports.handlePOST = function(request, response){
  var statusCode = 404;



  //check if the passed in url is in the list
  request.on('data', function(data){
    var siteUrl = "";
    siteUrl += data;
    siteUrl = siteUrl.split('url=')[1];
    archive.isUrlInList(siteUrl, function(isInList){
        if(isInList){
          //if the url was found: return true to user
          statusCode = 200;
          console.log('is in list ', isInList);
        }
        else{
          // if url was not found: add to list
          statusCode = 302;
          archive.addUrlToList(siteUrl);

          console.log('is not in list ', siteUrl);

        }
        response.writeHead(statusCode, exports.headers);
        response.end(siteUrl + " was found: "+ isInList);
    });

  });



}


// As you progress, keep thinking about what helper functions you can put here!
