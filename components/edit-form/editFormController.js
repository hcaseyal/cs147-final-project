
app.controller('EditFormController', ['$scope', '$routeParams', function($scope, $routeParams) {
	$scope.selectedClass = $routeParams.classID;
	$scope.main.displayHeader = true;
	$scope.main.displayFullHeader = false; 
	$scope.main.selectedButton = 'teacher'; 

	$scope.selectedQuarter = ''; 
	$scope.selectedYear = ''; 
	$scope.quarterList = ['Fall', 'Winter', 'Spring', 'Summer']; 
	$scope.yearList = ['13-14', '14-15', '15-16', '16-17'];
	$scope.skillTags = [];

	$scope.submitCourseEdits = function() {
		var classSkills = $scope.skillTags.map(x => x.text);
		
		let post = {classSkills: classSkills,
					selectedQuarter: $scope.selectedQuarter,
					selectedYear: $scope.selectedYear,
					classID: $scope.selectedClass,
					userID: userID };

		remoteServicePostJson(post, "/editForm")
		.then((response) => {
			console.log(response);
		})
		.catch(error => {
			console.log(error);
		});
	}
}]);