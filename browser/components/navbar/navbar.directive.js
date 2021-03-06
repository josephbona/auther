'use strict';

app.directive('navbar', function ($state, $location, AuthFactory) {
  return {
    restrict: 'E',
    templateUrl: '/browser/components/navbar/navbar.html',
    link: function (scope) {
      scope.pathStartsWithStatePath = function (state) {
        var partial = $state.href(state);
        var path = $location.path();
        return path.startsWith(partial);
        
      };
      scope.submitLogOut = function(){
        AuthFactory.logout()
        .then(function(){
          $state.go('home');
        });
      };
      scope.isLoggedIn = function(){
        return AuthFactory.isLoggedIn();
      };
    }
  }
});
