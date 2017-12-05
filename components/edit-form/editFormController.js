
app.controller('EditFormController', ['$scope', '$routeParams', function($scope, $routeParams) {
	$scope.selectedClass = $routeParams.classID;
	$scope.main.displayHeader = true;
	$scope.main.displayFullHeader = false; 
	$scope.main.selectedButton = 'teacher'; 

	$scope.selectedQuarter = ''; 
	$scope.quarterList = ['Fall', 'Winter', 'Spring', 'Summer']; 
	$scope.yearList = ['2017', '2016', '2015', '2014'];
	$scope.classSkills = [];

	$scope.submitCourseEdits = function() {
		// do something
	}
}]);