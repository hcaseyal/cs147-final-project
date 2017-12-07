var userID = 0; //TODO: hook this up to a dynamic userID

app.controller('PinnedFeedbackController', ['$scope', function($scope) {
	$scope.main.displayHeader = true;
	$scope.main.displayFullHeader = false; 
	$scope.main.selectedButton = 'teacher'; 

	$scope.myClasses = ['CS106A', 'CS107', 'CS109']; 
	$scope.selectedClass = 'CS106A'; 

	$scope.toggleSelectedClass = function(selectedClass) {
		$scope.selectedClass = selectedClass;
		$scope.positiveFeedback = [];
		$scope.neutralFeedback = [];
		$scope.negativeFeedback = [];

		let classFeedback = $scope.feedback[selectedClass];
		if (classFeedback !== undefined) {
			$scope.positiveFeedback = classFeedback["positive"];
			$scope.negativeFeedback = classFeedback["negative"];
			$scope.neutralFeedback = classFeedback["neutral"];

			// User info is in each review as a userInfo field
			// On the html template, you can access it as:
			// {{feedback.userInfo}}
			/* "userInfo": {
			      "career": "Front End Dev",
			      "name": "Amy Liu",
			      "location": "LinkedIn"
			    }
			*/

		}
	};

	var getPinnedFeedbackUrl = "/getPinnedFeedback?userID=" + userID;
	remoteServiceGet(getPinnedFeedbackUrl).then((data) => {
		if (data.length > 0) {
			let feedback = JSON.parse(data); 
			$scope.feedback = feedback;
			$scope.toggleSelectedClass($scope.selectedClass);
			$scope.$apply();
		}
	})
	.catch((error) => {
		console.log(error);
	});
}]);