app.controller('ReviewClassController', ['$scope', '$routeParams', function($scope, $routeParams) {
	$scope.selectedClass = $routeParams.classID;
	$scope.main.displayHeader = true;
	$scope.main.displayFullHeader = false; 
}]);

function submitReview() {
	let xhttp = new XMLHttpRequest();
	let url = "/reviewClass";
	let params = JSON.stringify({review: "CS106a was a great class."});
	xhttp.open("POST", url, true);

	//Send the proper header information along with the request
	xhttp.setRequestHeader("Content-type", "application/json");

	xhttp.onload = () => {
		console.log(xhttp.responseText);
	}
	xhttp.send(params);
}

