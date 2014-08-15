var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var http = require('http');
var httpRequest = require('http-request');
var htmlFetcher = require('../workers/htmlfetcher');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  'siteAssets' : path.join(__dirname, '../web/public'),
  'archivedSites' : path.join(__dirname, '../archives/sites'),
  'list' : path.join(__dirname, '../archives/sites.txt'),
  '/' : path.join(__dirname, '../web/public/index.html')
};

// Used for stubbing paths for jasmine tests, do not modify
exports.initialize = function(pathsObj){
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!
//www.google.com,www.facebook.com,
exports.readListOfUrls = function(callback){

  // read our list file
  fs.readFile( exports.paths.list, 'utf8', function(error, data){
    if(error) throw error;
    var aArchivedSites = data.split('\n');
    callback(aArchivedSites);
  });


};

exports.isUrlInList = function(siteUrl, callback){


  exports.readListOfUrls(function(data){
    var isInList = false;
    data.forEach(function(item){
      if(item === siteUrl){
        isInList = true;
      }
    });
    callback(isInList);
  });


};

exports.addUrlToList = function(siteUrl){
  fs.appendFile(exports.paths.list, siteUrl + '\n', function(error){

  });
};

exports.isURLArchived = function(){

};

exports.downloadUrls = function(siteUrl){
  htmlFetcher.downloadUrl(siteUrl);
};
