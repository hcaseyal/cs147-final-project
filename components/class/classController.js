var classID;

app.controller('ClassController', ['$scope', '$routeParams', function($scope, $routeParams) {
	$scope.selectedClass = $routeParams.classID;
	$scope.main.displayHeader = true;
	$scope.main.displayFullHeader = false;
	$scope.main.selectedButton = 'explore';
	$scope.displayFilters = false;
	$scope.modalOn = false;

	$scope.classSkills = ['Java', 'Recursion']; 

	$scope.CloseClick = function(){
	    $scope.modalOn = false;
	}
	classID = $scope.selectedClass;
	let url = "/getReviews?classID=" + classID;
	remoteServiceGet(url).then((reviews) => {
		console.log("Reviews so far: ");
		console.log(JSON.parse(reviews));
	});

	let getClassUrl = "/getClass?classID=" + classID;
	remoteServiceGet(getClassUrl).then((info) => {
		let skills = JSON.parse(info).skills;
		console.log(skills);
	});
}]);
