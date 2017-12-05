
app.controller('EditFormController', ['$scope', '$routeParams', function($scope, $routeParams) {
	$scope.selectedClass = $routeParams.classID;
	$scope.main.displayHeader = true;
	$scope.main.displayFullHeader = false; 
	$scope.main.selectedButton = 'teacher'; 

	$scope.selectedQuarter = ''; 
	$scope.selectedYear = ''; 
	$scope.quarterList = ['Fall', 'Winter', 'Spring', 'Summer']; 
	$scope.yearList = ['2017', '2016', '2015', '2014'];
	$scope.skillTags = [];

	$scope.submitCourseEdits = function() {
		var classSkills = $scope.skillTags.map(x => x.text);
		console.log($scope.selectedQuarter, $scope.selectedYear, classSkills);
		// do something
	}
}]);