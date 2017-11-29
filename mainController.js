
var app = angular.module('myApp',['ngResource', 'ngRoute', 'rzModule', 'ngTagsInput']);

app.config(function($routeProvider) {
    $routeProvider
	    .when('/login', {
	        templateUrl : 'components/login/login-template.html',
	        controller: 'LoginController'
	    })
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
	    .when('/teacher-home', {
	        templateUrl : 'components/teacher-home/teacher-home-template.html',
	        controller: 'TeacherHomeController'
	    })
	    .when('/edit-form/:classID', {
	        templateUrl : 'components/edit-form/edit-form-template.html',
	        controller: 'EditFormController'
	    })
	    .when('/pinned-feedback', {
	        templateUrl : 'components/pinned-feedback/pinned-feedback-template.html',
	        controller: 'PinnedFeedbackController'
	    })
	    .otherwise({
            redirectTo: '/login'
        });
	});

app.controller('MainController', ['$scope', '$resource', '$route', function($scope, $resource, $route) {
	$scope.main = {};
}]);