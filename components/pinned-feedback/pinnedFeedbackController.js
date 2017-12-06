
app.controller('PinnedFeedbackController', ['$scope', function($scope) {
	$scope.main.displayHeader = true;
	$scope.main.displayFullHeader = false; 
	$scope.main.selectedButton = 'teacher'; 

	// TODO: make this dynamic
	$scope.myClasses = ['CS106A', 'CS107', 'CS109']; 
	$scope.selectedClass = 'CS106A'; 

	$scope.positiveFeedback = ['Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus sit amet venenatis ante, in tristique est. Maecenas sed sem feugiat, lacinia purus sed, rutrum dui. Cras eu nulla in velit rutrum scelerisque.', 
								'Curabitur faucibus dictum elit ultricies rhoncus. Mauris maximus vestibulum ante, in auctor mauris congue at.'];

	$scope.toggleSelectedClass = function(selectedClass) {
		$scope.selectedClass = selectedClass;

		// TODO: load relevant feedback based on selectedClass
	};
}]);