
var crypto = require('crypto');


/**
 * Basic user model
 */
module.exports = function (username,password) {

	//ACTUAL DATA TO SAVE THE USER IN DB
	this.data = {
		salt : null,
		username : null,
		password : null
	}



	this.isValidPassword = function(passwordString) {
    	return this.data.password === this._hash(passwordString, this.data.salt);
	};



	this._setPassword = function(passwordString) {
   	 	return this._hash(passwordString, this.data.salt);
	};



	this._guidGenerator = function() {
	    var S4 = function() {
	       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
	    };
	    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
	};


	this._hash = function(passwd, salt) {
    	return crypto.createHmac('sha256', salt).update(passwd).digest('hex');
	};


	//PROPERTIES
	this.data.salt	   = this._guidGenerator()
	this.data.username = username;
	this.data.password = this._setPassword(password);
}