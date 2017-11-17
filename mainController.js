
var app = angular.module('myApp',['ngResource', 'ngRoute']);

app.config(function($routeProvider) {
    $routeProvider
	    .when('/explore', {
	        templateUrl : 'components/explore/explore-template.html',
	        controller: 'ExploreController'
	    })
	    .when('/class/:classID', {
	        templateUrl : 'components/class/class-template.html',
	        controller: 'ClassController'
	    })
	    .when('/bookmarks', {
	        templateUrl : 'components/bookmarks/bookmarks-template.html',
	        controller: 'BookmarksController'
	    })
	    .when('/review', {
	        templateUrl : 'components/review/review-template.html',
	        controller: 'ReviewController'
	    })
	    .when('/review/:classID', {
	        templateUrl : 'components/review-class/review-class-template.html',
	        controller: 'ReviewClassController'
	    })
	    .otherwise({
            redirectTo: '/explore'
        });
	});

app.controller('MainController', ['$scope', '$resource', '$route', function($scope, $resource, $route) {
	$scope.main = {};
}]);