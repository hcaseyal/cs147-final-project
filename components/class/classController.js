
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
}]);