app.
  controller('SignUpCtrl', function($scope, $state, AuthFactory) {
    
    $scope.submitSignUp = function() {
      console.log('submitting signup...')
      
      AuthFactory.signup($scope.user)
      .then(function(){
        $state.go('stories');
      })
      .catch(function(err){
        console.error(err);
      });

        
    }
  });

  //{email: 'uzoho@hu.gov', password: 'uf'}


