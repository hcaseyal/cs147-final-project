
app.controller('EditFormController', ['$scope', '$routeParams', function($scope, $routeParams) {
	$scope.selectedClass = $routeParams.classID;
	$scope.main.displayHeader = true;
	$scope.main.displayFullHeader = false; 
	$scope.main.selectedButton = 'teacher'; 

	$scope.preview = false;
	$scope.selectedQuarter = ''; 
	$scope.selectedYear = ''; 
	$scope.quarterList = ['Fall', 'Winter', 'Spring', 'Summer']; 
	$scope.yearList = ['13-14', '14-15', '15-16', '16-17'];
	$scope.skillTags = [];
	$scope.showFakeSlider = true;

	$scope.slider = {
	    value: 3,
	    options: {
	    	showTicksValues: true,
	    	stepsArray: [
		    	{value: 1, legend: 'Not useful'},
		    	{value: 2},
		    	{value: 3},
		    	{value: 4},
		    	{value: 5, legend: 'Very useful'}
			]
	    }
	};

	$scope.submitCourseEdits = function() {
		$scope.classSkills = $scope.skillTags.map(x => x.text);
		
		let post = {classSkills: $scope.classSkills,
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

	$scope.togglePreview = function() {
		$scope.preview = !$scope.preview;
		$scope.classSkills = $scope.skillTags.map(x => x.text);
		$scope.classYear = $scope.selectedQuarter + ' ' + $scope.selectedYear;
	}
}]);