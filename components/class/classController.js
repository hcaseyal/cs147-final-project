var classID;

app.controller('ClassController', ['$scope', '$routeParams', '$timeout', function($scope, $routeParams, $timeout) {

	$scope.selectedClass = $routeParams.classID;
	$scope.main.displayHeader = true;
	$scope.main.displayFullHeader = false;
	$scope.main.selectedButton = 'explore';
	$scope.displayFilters = false;
	$scope.modalOn = false;
	$scope.classRatingLabels = ['Very Useful', '', '', '', 'Not Useful']; 
	$scope.chartRatingColors = [ '#024AC1', '#2F6FD7', '#5D90E3', '#97BBF5', '#B3C9EC'];

	classID = $scope.selectedClass;

	const percentageBarWidth = 250;
	var comfortableMap = new Map();	
	var usefulMap = new Map(); 

	let getClassUrl = "/getClass?classID=" + classID;
	remoteServiceGet(getClassUrl).then((info) => {
		$scope.main.classSkills = JSON.parse(info).skills;

		for (skill in $scope.main.classSkills) {
			comfortableMap.set($scope.main.classSkills[skill], 0); 
			usefulMap.set($scope.main.classSkills[skill], 0);
		}
	});	

	let url = "/getReviews?classID=" + classID;
	$scope.reviews = []; 
	remoteServiceGet(url).then((reviews) => {

		$scope.reviews = JSON.parse(reviews);
		$scope.main.reviewCount = $scope.reviews.length;
		
		var classRatingData = [0, 0, 0, 0, 0];
		for (r in $scope.reviews) {
			var review = $scope.reviews[r];
			var comfortable = review.skillsComfortable; 
			var useful = review.skillsUseful;
			for (s in $scope.main.classSkills) {
				var skill = $scope.main.classSkills[s]; 
				if (comfortable.indexOf(skill) > -1) {
					comfortableMap.set(skill, comfortableMap.get(skill) + 1); 
				}
				if (useful.indexOf(skill) > -1) {
					usefulMap.set(skill, usefulMap.get(skill) + 1);  
				}
			}
			classRatingData[review.usefulValue - 1] += 1;
		}
		$scope.main.classRatingData = classRatingData.reverse();
		$scope.main.numReviews = $scope.main.classRatingData.reduce(function(a, b) { return a + b; }, 0);
		for (v in $scope.main.classRatingData) {
			$scope.main.averageRating += ((5-v) * $scope.main.classRatingData[v]); 
		}
		$scope.main.averageRating /= $scope.main.numReviews; 
		$scope.main.averageRating = Math.floor($scope.main.averageRating * 10) / 10; 

		// default selected skill is the first skill in the skills array
		$scope.main.selectedSkill = $scope.main.classSkills[0];
		$scope.toggleSelectedSkills($scope.main.selectedSkill);
	});

	$scope.toggleSelectedSkills = function(skill){
	    $scope.main.selectedSkill = skill;
	    $scope.main.comfortableCount = comfortableMap.get(skill); 
	    $scope.main.comfortableWidth = percentageBarWidth * ($scope.main.comfortableCount / $scope.main.reviewCount);

	    $scope.main.usefulCount = usefulMap.get(skill); 
	    $scope.main.usefulWidth = percentageBarWidth * ($scope.main.usefulCount / $scope.main.reviewCount);

	    // find reviews tagged with the selected skill 
	    var relevantReviews = [];
	    for (r in $scope.reviews) {
			var review = $scope.reviews[r]; 

			for (t in review.reviewTags) {
				if (review.reviewTags[t].text == skill) {
					relevantReviews.push(review);
				}
			}
		}
		$scope.main.relevantReviews = relevantReviews.slice();
	}

	$scope.CloseClick = function(){
	    $scope.modalOn = false;
	}
}]);
