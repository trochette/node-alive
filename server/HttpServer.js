var util  = require('util'),
    url   = require('url'),
    http  = require('http');

/**
 * An Http server implementation that uses a map of methods to decide
 * action routing.
 *
 * Copy of the Angular.js Seed project
 * https://github.com/angular/angular-seed/blob/master/scripts/web-server.js
 */
function HttpServer(handlers) {
  this.handlers = handlers;
  this.server = http.createServer(this.handleRequest_.bind(this));
}



HttpServer.prototype.start = function(port) {
  this.port = port;
  this.server.listen(port);
  util.puts('Http server: Running at http://localhost:' + port + '/');
  util.puts('Service server: Services located in /server/service/ are ready' );
};


HttpServer.prototype.parseUrl_ = function(urlString) {
  var parsed = url.parse(urlString);
  parsed.pathname = url.resolve('/', parsed.pathname);
  return url.parse(url.format(parsed), true);
};



HttpServer.prototype.handleRequest_ = function(req, res) {
  var logEntry = req.method + ' ' + req.url;
  if (req.headers['user-agent']) {
    logEntry += ' ' + req.headers['user-agent'];
  }
  util.puts(logEntry,req.method);
  req.url = this.parseUrl_(req.url);
  var handler = this.handlers[req.method];
  if (!handler) {
    res.writeHead(501);
    res.end();
  } else {
    handler.call(this, req, res);
  }
};


module.exports = {HttpServer:HttpServer}