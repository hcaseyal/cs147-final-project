var userID = 0; // TODO: hook this up to a dynamic user ID

app.controller('ProfileController', ['$scope', function($scope) {
	$scope.main.displayHeader = true;
	$scope.main.displayFullHeader = false; 
	$scope.main.selectedButton = 'explore';
	$scope.displayAllClasses = false;

	getUser();

	function getUser() {
		remoteServiceGet('/getUser?userID=0').then((data) => {
			if (data.length > 0) {
			let user = JSON.parse(data); 
			$scope.user = user; 
		}
		$scope.$apply();
	})
	.catch((error) => {
		console.log(error);
	});
	}
}]);