
app.controller('ReviewController', ['$scope', function($scope) {
	$scope.main.displayHeader = true;
	$scope.main.displayFullHeader = true; 
	$scope.main.selectedButton = 'review';
	$scope.displayAllClasses = false;
	$scope.main.reviewRedirect = '#!/review';

	$scope.CloseClick = function(){
	    $scope.main.reviewSubmitted = false;
	}
}]);