var userID = 0; // TODO: connect this to an actual user id

app.controller('ReviewClassController', ['$scope', '$routeParams', function($scope, $routeParams) {
	$scope.selectedClass = $routeParams.classID;
	$scope.main.displayHeader = true;
	$scope.main.displayFullHeader = false; 

	$scope.main.selectedButton = 'review';

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

	$scope.submitReview = function() {
		let post = {review: $scope.reviewText,
					wishText: $scope.wishText,
					usefulValue: $scope.slider.value,
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
	}
}]);
