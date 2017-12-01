
var app = angular.module('myApp',['ngResource', 'ngRoute', 'rzModule', 'ngTagsInput', 'chart.js']);

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

	$scope.main.classSkills = [];
	$scope.main.selectedSkill = '';
	$scope.main.reviewCount = 0;
	$scope.main.averageRating = 0;
	$scope.main.reviewSubmitted = false;


	// TEMP - figure out how to properly load data and remove this 

	classID = 'CS106A';

	const percentageBarWidth = 250;
	var comfortableMap = new Map();	
	var usefulMap = new Map(); 

	let getClassUrl = "/getClass?classID=" + classID;
	remoteServiceGet(getClassUrl).then((info) => {
		var classData = JSON.parse(info); 
		$scope.main.classSkills = classData.skills;
		$scope.main.classDescription = classData.description;

		for (skill in $scope.main.classSkills) {
			comfortableMap.set($scope.main.classSkills[skill], 0); 
			usefulMap.set($scope.main.classSkills[skill], 0);
		}
	});	

	let url = "/getReviews?classID=" + classID;
	$scope.reviews = []; 
	remoteServiceGet(url).then((reviews) => {

		$scope.reviews = JSON.parse(reviews);
		$scope.main.reviewCount = $scope.reviews.length;
		
		var classRatingData = [0, 0, 0, 0, 0];
		for (r in $scope.reviews) {
			var review = $scope.reviews[r];
			var comfortable = review.skillsComfortable; 
			var useful = review.skillsUseful;
			for (s in $scope.main.classSkills) {
				var skill = $scope.main.classSkills[s]; 
				if (comfortable.indexOf(skill) > -1) {
					comfortableMap.set(skill, comfortableMap.get(skill) + 1); 
				}
				if (useful.indexOf(skill) > -1) {
					usefulMap.set(skill, usefulMap.get(skill) + 1);  
				}
			}
			classRatingData[review.usefulValue - 1] += 1;
		}
		$scope.main.classRatingData = classRatingData.reverse();
		$scope.main.numReviews = $scope.main.classRatingData.reduce(function(a, b) { return a + b; }, 0);
		$scope.main.averageRating = 0;
		for (v in $scope.main.classRatingData) {
			$scope.main.averageRating += ((5-v) * $scope.main.classRatingData[v]); 
		}
		$scope.main.averageRating /= $scope.main.numReviews; 
		$scope.main.averageRating = Math.floor($scope.main.averageRating * 10) / 10; 

		// default selected skill is the first skill in the skills array
		$scope.main.selectedSkill = $scope.main.classSkills[0];
		$scope.toggleSelectedSkills($scope.main.selectedSkill);
	});
}]);