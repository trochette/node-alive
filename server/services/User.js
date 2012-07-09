var crypto = require("crypto");
var user   = userModel = require("../models/User");

/**
 * Basic user service example.
 * Use this example for class structure.
 * Each services need to be in a separate class.
 * 
 * @param db - CouchDB database reference.
 */

module.exports = function (db) {
	//Module ID, usualy path from route (Base on Node)
	this.id = "./user/";
	

	/**
	 * Handle user login
	 */
	this.login = function (req,res){
		console.log(req.body.username);

		db.get(req.body.username, function (err, doc) {

		   if(doc+"" === "undefined"){
		    	
				res.writeHead(200, {"Content-Type": "application/json"});  
	        	res.write(JSON.stringify({error:'User not found'}));  
	        	res.end();
	        	console.log("SENT");
			}else{
				if(!err){
					var userModel = new user(doc.username,"temp")
						userModel.data.salt = doc.salt;
						userModel.data.password = doc.password;


					if(userModel.isValidPassword(req.body.password)){
						console.log("VALID PASSWORD ACCESS GRANTED TO :"+userModel.data.username);
						res.writeHead(200, {"Content-Type": "application/json"});  
	        		 	res.write(JSON.stringify({success:'You are now signed in.'}));  
	        		 	res.end();

					}else{
						console.log("INVALIDE PASSWORD ACCESS REFUSED TO :"+userModel.data.username);
						res.writeHead(200, {"Content-Type": "application/json"});  
	        		 	res.write(JSON.stringify({error:'Invalid password for this user'}));  
	        		 	res.end(); 
					}
				}else{
					res.writeHead(200, {"Content-Type": "application/json"});  
	        		res.write(JSON.stringify({error:'User not found'}));  
	        		res.end();
				}
			}

		})

		/*db.view('User/user',{_userid:req.body.username}, function (err, records) {
			if(!err){
				console.log(err,records)
				var userModel = new user(records[0].value.username,"temp")
					userModel.data.salt = records[0].value.salt;
					userModel.data.password = records[0].value.password;


				if(userModel.isValidPassword(req.body.password)){
					console.log("VALID PASSWORD ACCESS GRANTED TO :"+userModel.data.username);

				}else{
					console.log("INVALIDE PASSWORD ACCESS REFUSED TO :"+userModel.data.username);
					res.writeHead(200, {"Content-Type": "application/json"});  
        		 	res.write(JSON.stringify({error:'Invalid password for this user'}));  
        		 	res.end(); 
				}
			}else{
				res.writeHead(200, {"Content-Type": "application/json"});  
        		res.write(JSON.stringify({error:'User not found'}));  
        		res.end();
			}
			
		});*/
	}

	
	/**
	 * Handle user registration
	 */
	this.register = function(req,res){
		var self = null;
		var checkUser = null;
		var username  =  req.body.username;

		 db.view('User/getUsers', function (err, records) {
		 	if(records && records.total_rows>0){
		 		for(var i=0;i<records.rows.length;i++){
		 			if(records.rows[i].value.username == req.body.username)checkUser = true;
		 		}
		 	}

			if(!checkUser){
				console.log("-- STARTING USER REGISTRATION FOR : "+req.body.username)
			  	db.save(req.body.username,new user(req.body.username,req.body.password).data, function (err, records) {
				  	if(err){
				  		res.writeHead(200, {"Content-Type": "application/json"});  
	        		    res.write("{'error': Something went wrong, try again later : "+err+"}");  
	        		    res.end(); 
				  	}else{
				  		res.writeHead(200, {"Content-Type": "application/json"});  
	        		    res.write("{'success': This user account was created : "+req.body.username+"}");  
	        		    res.end(); 
				  	}
			  	});
			 }else{
			 	 res.writeHead(200, {"Content-Type": "application/json"});  
        		 res.write(JSON.stringify({error:'User Already Exist'}));  
        		 res.end();  
			 }			
 		 });
	}




	/********** TEMP **************/
	//TODO CREATE A SYSTEM TO MANAGE VIEW SEPARETELY FROM MODEL.
	this.initViews = function () {
	  var designs = [
	    {
	      '_id': '_design/User',
	      views: {
	        getUsers: {
	          map: function (doc) {emit(doc._id,{"username":doc.username})}
	        },

	        user:{
	        	map: function (doc) {if(doc._userid ==doc._id){emit(doc._id,{"username":doc.username,"password":doc.password,"salt":doc.salt})}}
	        },

	        userDetail:{
	        	map: function (doc) {if(doc._id && doc.password){emit(doc._id,doc)}}
	        }
	      }
	    }
	  ];
	  
	  db.save(designs, function (err) {
	       
	  });
	 };

	 this.initViews();
}




	