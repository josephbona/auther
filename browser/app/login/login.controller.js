app.
  controller('LoginCtrl', function($scope, $http, $state) {
    $scope.user = {};
    $scope.submitLogin = function() {
      console.log('submitting...')
      $http.post('/login', {email: 'uzoho@hu.gov', password: 'uf'})
        .then(function() {
          console.log('got here');
          $state.go('stories');
        })
        .catch(function(err) {
          console.error(err);
        });
    }
  })