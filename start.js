#!/usr/bin/env node

var util		   = require('util'),
	http           = require('http')
	url            = require('url'),
	cradle         = require('cradle'),
	server         = require('./server/HttpServer'),
	staticServlet  = require('./server/servlets/StaticServlet'),
	serviceServlet = require('./server/servlets/ServiceServlet'),
	service        = require('./server/services/ServiceManager'),
	argv 		   = require('optimist').argv;


var options = {port:  argv.p || 8000};
var dbName  = argv.d;
var conn    = new(cradle.Connection)();
var db      = null; 



/**
 * Start server
 */
function start(argv) {

	 app = new server.HttpServer({
	    'GET': createServlet(staticServlet.StaticServlet),
	    'HEAD': createServlet(staticServlet.StaticServlet),
	    'PUT': createServlet(serviceServlet.ServiceServlet),
	    'POST': createServlet(serviceServlet.ServiceServlet),
	    'DELETE': createServlet(serviceServlet.ServiceServlet)
	  }).start(options.port);

	 

	 if(dbName){
	 	db = conn.database(dbName);
	 	db.exists(function(err,exists){
	 		
	 		if (err) {
		      util.puts("XXXX Error connecting database: "+dbName);
		    } else if (exists) {
		      util.puts("✓ ---- Database currently in use: "+dbName);
		    }else{
		    	util.puts("X---- The folowing database does not exists: "+dbName);
		    	 if(argv.c){
		      		db = conn.database(dbName);
  					db.create();
  					util.puts("✓ ---- Database create and now in use: "+dbName);
		        }
		    }

	 	});
	 	var serviceManager = new service.ServiceManager();
	 		serviceManager.registerServices(__dirname+"/server/services",db);

	 	serviceServlet.ServiceServlet.prototype.serviceManager = serviceManager;
	 }

	 
}


/**
 * Create a servlet binding
 */
function createServlet(Class) {
  var servlet = new Class();
  return servlet.handleRequest.bind(servlet);
}


/**
 * Check if the user request help on start up
 */
function checkHelp(){
	var help = [
	    "usage: server [options]",
	    "",
	    "Runs the server at with the appropriate configuration",
	    "",
	    "options:",
	    "  -p             Port that you want the home server to run on      [8000]",
	    "  -d, --database Name of the couch database you want to wire",
	    "  -c, --create   Indicate to create database if it doesn't exist", 
	    "  -h, --help     You're staring at it",
	    "",
	    "",
		"-------------------------------------------------------------------",
		"",
	].join('\n');

	if (argv.h || argv.help) {
	  return util.puts(help);
	}
}



util.puts("\n\n---------------------- ALIVE SERVER V0.1 ---------------------------\n");
checkHelp();
start(argv);
util.puts("\n\n---------------- ENJOY NODE SERVING MADE SIMPLE -------------------\n");