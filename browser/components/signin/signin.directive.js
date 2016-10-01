'use strict';

app.directive('signIn', function ($state) {

	return {
		restrict: 'E',
		templateUrl: '/browser/components/signin/signin.template.html',
		scope: {
			action: '=',
			user: '=model'
		}
	};

});