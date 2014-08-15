// eventually, you'll have some code here that uses the code in `archive-helpers.js`
// to actually download the urls you want to download.

var httpRequest = require('http-request');
var archive = require('../helpers/archive-helpers');
var fs = require('fs');

exports.downloadUrl = function(siteUrl){
  httpRequest.get(siteUrl, function(err, response){
      if(err){
        console.error(err);
        return;
      }
      fs.writeFile(archive.paths.archivedSites + '/' + siteUrl, response.buffer, function(err){
        if(err){
          console.log("error archiving ", siteUrl, " : ", err);

        }
      });
    });
};
