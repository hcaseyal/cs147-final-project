
app.controller('HeaderController', ['$scope', '$location', function($scope, $location) {
	$scope.searchCareers = ['Software Developer', 'Data Scientist']; 
	$scope.searchSkills = ['Recursion', 'Java', 'Python'];
	$scope.searchClasses = ['CS106A', 'MATH51', 'BIO150', 'CS142', 'CS145', 'MATH110', 'ENGR50', 'STS200L', 
							'CS255', 'CS124', 'COMM154', 'CS168', 'CS247', 'CS161'];
	$scope.searchGraph = $scope.searchCareers.concat($scope.searchSkills).concat($scope.searchClasses);
	$scope.searchTeacherClasses = ['CS106A', 'CS107', 'CS109']; 

	// after selecting a class/career/skill, should zoom in to the appropriate node
	$scope.onSelect = function ($item, $model, $label) {
		// $item is the selected item from the search dropdown
		let centerFunction = centerFunctionsByClass[$item];
		if (centerFunction !== undefined) {
			centerFunction();
		}
	    console.log($item);
	};

	// after selecting a class from the class search bar, should redirect to that class page
	$scope.onSelectClass = function ($item, $model, $label) {
		$location.path('class/' + $item);
	};

	// (teacher view) after selecting a class from the class search bar, should redirect to that class page 
	$scope.onSelectTeacherClass = function ($item, $model, $label) {
		$location.path('teacher-class/' + $item);
	};
}]);