var classID = "";
var userID = 0; // TODO: connect this to an actual user id

app.controller('ReviewClassController', ['$scope', '$routeParams', function($scope, $routeParams) {
	$scope.selectedClass = $routeParams.classID;
	$scope.main.displayHeader = true;
	$scope.main.displayFullHeader = false; 
	classID = $scope.selectedClass;

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

	$scope.submitReview = function() {
		let reviewText = $(".review-input-box").val();
		let wishText = $(".wish-input-box").val();
		let post = {review: reviewText,
					// wish: wishText,
					// useful: $scope.slider.value,
					classID: classID, 
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




