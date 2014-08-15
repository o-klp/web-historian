var path = require('path');
var fs = require('fs');
var archive = require('../helpers/archive-helpers');
var htmlFetcher = require('../workers/htmlfetcher');


exports.headers = headers = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10, // Seconds.
  'Content-Type': "text/html"
};

exports.serveAssets = function(response, assetUrl, callback) {
  // Write some code here that helps serve up your static files!
  // (Static files are things like html (yours or archived from others...), css, or anything that doesn't change often.)

  var siteUrl = assetUrl.slice(1);
  archive.readListOfUrls(function(data){

    data.forEach(function(item){
      if(item === siteUrl){

        // if found, return scraped site
        fs.readFile(archive.paths.archivedSites + assetUrl, function(error, data){
          if(error){throw error;}
          callback(data);
        });
      }
    });
  });
};

exports.finalizeResponse = function(statusCode, response, data){
  statusCode = statusCode || 404;
  response.writeHead(statusCode, exports.headers);
  response.end(data);
};

exports.handleGET = function(request, response){
  var statusCode = 404;
  var pathName = request.url;
  if( archive.paths[pathName] ){
    fs.readFile(archive.paths[pathName], function(error, data){

      if(error){throw error;}

      statusCode = 200;
      response.writeHead(statusCode, exports.headers);
      response.end(data);


    });

  }else{
      exports.serveAssets(response, pathName, function(data){
        statusCode = 200;
        response.writeHead(statusCode, exports.headers);
        response.end(data);
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
          exports.serveAssets(response, siteUrl, function(data){
            exports.finalizeResponse(statusCode, response, data);
          });

        }
        else{
          // if url was not found: add to list
          statusCode = 302;
          console.log("About to call downloadUrls...");
          htmlFetcher.downloadUrl(siteUrl);
          archive.addUrlToList(siteUrl);
          console.log('is not in list ', siteUrl);

        }
        response.writeHead(statusCode, exports.headers);
        response.end(siteUrl + " was found: "+ isInList);
    });

  });



}


// As you progress, keep thinking about what helper functions you can put here!
