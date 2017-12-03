var userID = 0; // TODO: connect this to an actual user id

app.controller('ReviewClassController', ['$scope', '$routeParams', function($scope, $routeParams) {
	$scope.selectedClass = $routeParams.classID;
	$scope.main.displayHeader = true;
	$scope.main.displayFullHeader = false; 
	$scope.main.selectedButton = 'review';

	$scope.classSkills = [];
	$scope.selectedSkill = '';
	$scope.reviewCount = 0;
	$scope.averageRating = 0;
	$scope.classYear = "WINTER 13-14"; 

	$scope.slider = {
	    value: 3,
	    options: {
	    	showTicksValues: true,
	    	stepsArray: [
		    	{value: 1, legend: 'Not useful'},
		    	{value: 2},
		    	{value: 3},
		    	{value: 4},
		    	{value: 5, legend: 'Very useful'}
			]
	    }
	};

	$scope.reviewText = ""; 
	$scope.wishText = ""; 

	let getClassUrl = "/getClass?classID=" + $scope.selectedClass;
	remoteServiceGet(getClassUrl).then((info) => {
		$scope.classSkills = JSON.parse(info).skills;
	});

	$scope.skillsUseful = []; 
	$scope.skillsComfortable = [];
	$scope.reviewTags = []; 

	$scope.toggleSkillsUseful = function(skill) {
		var idx = $scope.skillsUseful.indexOf(skill); 
		if (idx > -1) {
			$scope.skillsUseful.splice(idx, 1);
			$scope.reviewTags.splice(idx, 1);
		}
		else {
			$scope.skillsUseful.push(skill);
			$scope.reviewTags.push({'text': skill});
		}
	};

	$scope.toggleSkillsComfortable = function(skill) {
		var idx = $scope.skillsComfortable.indexOf(skill); 
		if (idx > -1) {
			$scope.skillsComfortable.splice(idx, 1);
		}
		else {
			$scope.skillsComfortable.push(skill); 
		}
	};

	$scope.submitReview = function() {
		let post = {review: $scope.reviewText,
					reviewTags: $scope.reviewTags,
					wishText: $scope.wishText,
					usefulValue: $scope.slider.value,
					skillsUseful: $scope.skillsUseful,
					skillsComfortable: $scope.skillsComfortable, 
					classYear: $scope.classYear,
					classID: $scope.selectedClass, 
					userID: userID };

		remoteServicePostJson(post, "/reviewClass")
		.then((response) => {
			console.log(response);
		})
		.catch(error => {
			console.log(error);
		});
	};
}]);
