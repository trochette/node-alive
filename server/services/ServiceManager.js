
var util = require('util'),
	 fs  = require('fs');


/**
 * Global services manager, use to dispatch
 * dynamic web service routing;
 */

var ServiceManager = module.exports.ServiceManager = function () {}

	//VERB DEFINITION FOR ADDING THE SERVICE IN THE RIGHT PLACE;
	ServiceManager.prototype.PUT    = "PUT";
	ServiceManager.prototype.POST   = "POST";
	ServiceManager.prototype.DELETE = "DELETE";
	ServiceManager.prototype.path   = __dirname;

	//Array containing all registred services
	ServiceManager.prototype.registredServices = new Array();
	


	ServiceManager.prototype.addService = function(service,path){
		this.registredServices.push({instance:service,id:path});
	}


	ServiceManager.prototype.registerServices = function (dir,db){
		var that = this;

		fs.readdir(dir, function (err, list) {
		    list.forEach(function (file) {

			    path = dir + "/" + file;
			    stat = fs.statSync(path)

		        if (stat && stat.isDirectory()){
		       		that.registerServices(path,db);
		        }else{
		        	var name = file.substr(0, file.indexOf('.'));
		        	if(name.length>1 && name != "ServiceManager"){
		          		var requirePath = dir.replace(__dirname,"");
		          		util.puts("SERVICE READY : "+ name);

		          		service = require('./' +requirePath+"/" +name);

		          		that.addService( new service(db),"/"+requirePath+"/"+file);
		          	}
		    	}
		    });
		  });
	}


	ServiceManager.prototype.checkIfAvailable = function(path){
		var found = null;

		for(var i=0;i<this.registredServices.length;i++){
			util.puts("BUCKLE");
			util.puts(path);
			util.puts(this.registredServices[i].instance.id )
			util.puts()
			if(path.indexOf(this.registredServices[i].instance.id) == 0){
				util.puts("AVAILABLE TO PROCESS");
				found = this.registredServices[i].instance;
				break;
			}
		}

		return found;
	}
