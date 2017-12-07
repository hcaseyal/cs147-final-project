
app.controller('HeaderController', ['$scope', function($scope) {
	$scope.searchGraph = ['CS106A', 'CS107', 'Software Developer', 'Recursion', 'Java', 'Data Scientist', 'Python', 'MATH51'];
	$scope.searchClasses = ['CS106A', 'MATH51', 'BIO150', 'CS142', 'CS145', 'MATH110', 'ENGR50', 'STS200L', 
							'CS255', 'CS124', 'COMM154', 'CS168', 'CS247', 'CS161'];

	$scope.onSelect = function ($item, $model, $label) {
		// $item is the selected item from the search dropdown
	    console.log($item);
	};
}]);