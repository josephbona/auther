app.
  controller('LoginCtrl', function($scope, $state, AuthFactory) {
    $scope.user = {};
    $scope.submitLogin = function() {
      AuthFactory.login($scope.user)
        .then(function(user){
          $state.go('stories');
        })
        .catch(function(err){
          console.error(err);
        });
      
    }
  });

  //{email: 'uzoho@hu.gov', password: 'uf'}


