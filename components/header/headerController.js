
app.controller('HeaderController', ['$scope', '$location', function($scope, $location) {
	$scope.searchCareers = ['Front End Dev', 'Marketing', 'PR', 'Product Manager']; 
	$scope.searchSkills = ['Recursion', 'Visual Design', 'Speaking', 'Code compilation', 'Linear algebra', 'Java', 'Algorithms'];
	$scope.searchClasses = ['CS106A', 'CS147', 'PWR1', 'EDUC193A', 'MATH51', 'CS142', 'CS145',
							 'CS161'];
	$scope.searchGraph = $scope.searchCareers.concat($scope.searchSkills).concat($scope.searchClasses);
	$scope.searchTeacherClasses = ['CS106A', 'CS107', 'CS109']; 

	//TODO: flesh out the search classes with all the available classes

	// after selecting a class/career/skill, should zoom in to the appropriate node
	$scope.onSelect = function ($item, $model, $label) {
		// $item is the selected item from the search dropdown
		console.log("In on select function");
		// TODO: this is case sensitive
		let centerFunction = centerFunctionsByClass[$item];
		if (centerFunction !== undefined) {
			centerFunction();
		}
	};

	$scope.searchClassMaybeFromGraph = function() {
		let inputText = d3.select(".search-bar").node().value;
		console.log("Searching class. Button clicked");
		console.log(inputText);

		// On the explore page
		if ($scope.main.selectedButton === 'explore') {
			if ($scope.searchGraph.includes(inputText)) {
				$scope.onSelect(inputText); // Center to the corresponding node
			}
			else {
				// Display error message
			}
		}
		else { // Not on the graph page
			if ($scope.searchClasses.includes(inputText) 
				|| $scope.searchTeacherClasses.includes(inputText)) {
				$scope.onSelectClass(inputText);
			}
			else {
				// Display error message
			}
		}
	};

	$scope.searchClassNotFromGraph = function() {
		let inputText = d3.select(".search-bar").node().value;


		if ($scope.searchClasses.includes(inputText) 
			|| $scope.searchTeacherClasses.includes(inputText)) {

			$scope.onSelectClass(inputText);
		}
		else {
			// Display error message
		}
	};

	// after selecting a class from the class search bar, should redirect to that class page
	$scope.onSelectClass = function ($item, $model, $label) {
		$location.path('class/' + $item);
	};

	// (teacher view) after selecting a class from the class search bar, should redirect to that class page 
	$scope.onSelectTeacherClass = function ($item, $model, $label) {
		$location.path('teacher-class/' + $item);
	};

	$scope.goToBookmarked = function() {
		$location.path('bookmarks');
	}

	$scope.logout = function() {
		$location.path('');
	}

	$scope.goToPinned = function() {
		$location.path('pinned-feedback');
	}

	$scope.goToMyReviews = function() {
		$location.path('my-reviews');
	}

	$scope.goToProfile = function() {
		$location.path('profile');
	}
}]);