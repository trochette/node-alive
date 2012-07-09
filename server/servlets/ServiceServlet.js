
var util = require('util'),
    url  = require('url')
    staticServlet = require('./StaticServlet');


/**
 * Handles webservice routing content
 */
var ServiceServlet  =  module.exports.ServiceServlet =  function(database) {}


ServiceServlet.prototype =  new staticServlet.StaticServlet();
ServiceServlet.prototype.serviceManager = null;



ServiceServlet.prototype.handleRequest = function(req, res) {
  util.puts("\n Service request for "+req.method+" : "+req.url.pathname);

  var self = this;
  var path = ('./' + req.url.pathname).replace('//','/').replace(/%(..)/, function(match, hex){
    return String.fromCharCode(parseInt(hex, 16));
  });

  var service = this.serviceManager.checkIfAvailable(path);
 

  if(service){
    req.content = "";
    req.addListener("data", function(data) {
         req.content += data;
          if (req.content.length > 1e6) {
            // FLOOD ATTACK OR FAULTY CLIENT, NUKE REQUEST
            req.connection.destroy();
            return self.sendError_(req, res, path);
          }
    });

    req.addListener("end", function() {
      console.log(req.content);
      if(req.content.charAt(0)=="?"){
        req.content = req.content.substring(1);
      }

       var params = req.content.split('&');

       req.body = {}

     for ( param in params ){
       var pair = params[param].split('=');
       req.body[pair[0]] = pair[1];
     }

      req.serviceMethod = req.url.pathname.substring(req.url.pathname.lastIndexOf("/")+1);
      service[req.serviceMethod](req,res);
    });

    
  }else{
    var parts = path.split('/');
    if (parts[parts.length-1].charAt(0) === '.')
      return self.sendForbidden_(req, res, path);
  
    return self.sendMissing_(req, res, path); 
  }
}