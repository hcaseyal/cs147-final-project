var classID = "";
var userID = 0; // TODO: connect this to an actual user id

app.controller('ReviewClassController', ['$scope', '$routeParams', function($scope, $routeParams) {
	$scope.selectedClass = $routeParams.classID;
	$scope.main.displayHeader = true;
	$scope.main.displayFullHeader = false; 
	classID = $scope.selectedClass;
}]);

function submitReview() {
	let reviewText = $(".input-box").val();
	let post = {review: reviewText,
				classID: classID, 
				userID: userID};

	remoteServicePostJson(post, "/reviewClass")
	.then((response) => {
		console.log(response);
	})
	.catch(error => {
		console.log(error);
	});
}