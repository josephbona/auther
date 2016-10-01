app.factory('AuthFactory',function($http){
	var _user = {};
	return {
		signup: function(user) {
			console.log('signing up user: ',user);
			return $http.post('/api/users', user)
	        .then(function(result) {
	          console.log('singed up: ', result.data);
	          angular.copy(result.data, _user);
	          return _user;
	        });
		},
		login: function(user) {
			return $http.post('/login', user)
			  .then(function(result) {
			    console.log('logged in: ', result.data);
			    angular.copy(result.data, _user);
			    return _user;
			  });
		},
		logout: function() {
			return $http.delete('/logout')
			.then(function(){
				console.log('finished logging out');
				_user = null;
			});
		},
		isLoggedIn: function() {
			return _user != null;
		}
	}
});