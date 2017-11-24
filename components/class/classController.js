
app.controller('ClassController', ['$scope', '$routeParams', function($scope, $routeParams) {
	$scope.selectedClass = $routeParams.classID;
	$scope.main.displayFullHeader = false;
	$scope.main.selectedButton = 'explore';
	$scope.displayFilters = false;

	$scope.classSkills = ['Java', 'Recursion']; 
}]);