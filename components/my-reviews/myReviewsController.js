var userID = 0; // TODO: hook this up to a dynamic user ID

app.controller('MyReviewsController', ['$scope', function($scope) {
	$scope.main.displayHeader = true;
	$scope.main.displayFullHeader = false; 
	$scope.main.selectedButton = 'explore';
	
	let url = "/getAllReviews";
	var reviews;

	remoteServiceGet(url).then((allReviews) => {
		reviews = JSON.parse(allReviews);

		$scope.myReviews = [];
		for (classID in reviews) {
			var classReviews = reviews[classID];
			for (r in classReviews) {
				if (classReviews[r].userID == userID) {
					classReviews[r].class = classID; 
					$scope.myReviews.push(classReviews[r]);
				}
			}
		}
		$scope.$apply();
	});
}]);