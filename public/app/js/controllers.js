'use strict';


/**
 * Login Controller handle login call
 * plus errors handling
 * @author tommy.rochette[followed by the usual sign]universalmind.com
 */
function LoginController($scope,$http,$location){

	$scope.login = function(user) {
		 $http.post('/user/login',"?username="+user.email+"&password="+user.password).success(function(data) {
    		alert("LOGIN RESPONSE"+data);

    		if(data.error){
    			alert("USER FAIL");
    		}else{
    			$location.path("/profile");
    		}
  		 });
  	}


  	$scope.register = function(){
  		alert("register");
  		$location.path("/register");
  	}

}

LoginController.$inject = ['$scope','$http','$location'];




function UserSettingController($scope) {
}
UserSettingController.$inject = ['$scope'];



function RegisterController($scope) {
}
RegisterController.$inject = ['$scope'];

function ProfileController($scope) {
}
ProfileController.$inject = ['$scope'];