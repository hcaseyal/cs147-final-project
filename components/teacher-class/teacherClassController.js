var classID;

app.controller('TeacherClassController', ['$scope', '$routeParams', '$route', function($scope, $routeParams, $route) {

	$scope.selectedClass = $routeParams.classID;
	$scope.main.displayHeader = true;
	$scope.main.displayFullHeader = false;
	$scope.main.selectedButton = 'teacher';
	$scope.displayFilters = false;
	$scope.modalOn = false;
	$scope.classRatingLabels = ['Very Useful', '', '', '', 'Not Useful']; 
	$scope.chartRatingColors = [ '#024AC1', '#2F6FD7', '#5D90E3', '#97BBF5', '#B3C9EC'];
	$scope.classYear = "Winter 13-14"; // make this dynamic?
	$scope.selectedPolarity = '';
	$scope.successfulPin = false;
	classID = $scope.selectedClass;

	const percentageBarWidth = 250;
	var comfortableMap = new Map();	
	var usefulMap = new Map(); 


	let getClassUrl = "/getClass?classID=" + classID + "&classYear=" + $scope.classYear;
	remoteServiceGet(getClassUrl).then((info) => {
		if (info.length > 0) {
			var classData = JSON.parse(info); 
			$scope.classSkills = classData.skills;
			$scope.classDescription = classData.description;

			for (skill in $scope.classSkills) {
				comfortableMap.set($scope.classSkills[skill], 0); 
				usefulMap.set($scope.classSkills[skill], 0);
			}
		}
	});	

	let url = "/getReviews?classID=" + classID;
	$scope.reviews = []; 
	var wishReviews = [];

	remoteServiceGet(url).then((reviews) => {
		if (reviews.length > 0) {
			$scope.reviews = JSON.parse(reviews);
			$scope.reviewCount = $scope.reviews.length;
			
			var classRatingData = [0, 0, 0, 0, 0];
			for (r in $scope.reviews) {
				var review = $scope.reviews[r];
				var comfortable = review.skillsComfortable; 
				var useful = review.skillsUseful;
				for (s in $scope.classSkills) {
					var skill = $scope.classSkills[s]; 
					if (comfortable.indexOf(skill) > -1) {
						comfortableMap.set(skill, comfortableMap.get(skill) + 1); 
					}
					if (useful.indexOf(skill) > -1) {
						usefulMap.set(skill, usefulMap.get(skill) + 1);  
					}
				}
				classRatingData[review.usefulValue - 1] += 1;

				wishReviews.push({
					'text': review.wishText,
					'classYear': review.classYear,
					'userInfo': review.userInfo,
				})
				// also add reviews with no skills tags to "I wish I learnt"
				if (review.reviewTags.length == 0) {
					wishReviews.push({
						'text': review.review,
						'classYear': review.classYear,
						'userInfo': review.userInfo,
					})
				}

				// by default, show max 4 "I wishes" initially 
				if (wishReviews.length > 4) {
					$scope.wishReviews = wishReviews.slice(0,4);
					$scope.moreWish = true;
				} else {
					$scope.wishReviews = wishReviews.slice();
					$scope.moreWish = false; 
				}
			}

			// calculate class rating data
			$scope.classRatingData = classRatingData.reverse();
			$scope.numReviews = $scope.classRatingData.reduce(function(a, b) { return a + b; }, 0);
			$scope.averageRating = 0;
			for (v in $scope.classRatingData) {
				$scope.averageRating += ((5-v) * $scope.classRatingData[v]); 
			}
			$scope.averageRating /= $scope.numReviews; 
			$scope.averageRating = Math.floor($scope.averageRating * 10) / 10; 

			// default selected skill is the first skill in the skills array
			$scope.selectedSkill = $scope.classSkills[0];
			$scope.toggleSelectedSkills($scope.selectedSkill);

			$scope.$apply();
		}
	});

	var relevantReviews = [];

	$scope.toggleSelectedSkills = function(skill){
		relevantReviews = [];

	    $scope.selectedSkill = skill;
	    $scope.comfortableCount = comfortableMap.get(skill); 
	    $scope.comfortableWidth = percentageBarWidth * ($scope.comfortableCount / $scope.reviewCount);

	    $scope.usefulCount = usefulMap.get(skill); 
	    $scope.usefulWidth = percentageBarWidth * ($scope.usefulCount / $scope.reviewCount);

	    // find reviews tagged with the selected skill 
	    for (r in $scope.reviews) {
			var review = $scope.reviews[r]; 

			for (t in review.reviewTags) {
				if (review.reviewTags[t].text == skill) {
					relevantReviews.push(review);
				}
			}
		}
		// by default, show max 2 reviews initially 
		if (relevantReviews.length > 2) {
			$scope.relevantReviews = relevantReviews.slice(0,2);
			$scope.moreReviews = true;
		} else {
			$scope.relevantReviews = relevantReviews.slice();
			$scope.moreReviews = false; 
		}
	}

	// load all of the remaining reviews
	$scope.loadMoreReviews = function() {
		$scope.relevantReviews = relevantReviews.slice();
		$scope.moreReviews = false; 
	}

	// load all of the remaining I wish I learnts
	$scope.loadMoreWish = function() {
		$scope.wishReviews = wishReviews.slice();
		$scope.moreWish = false; 
	}

	$scope.pinFeedback = function(text) {
	    $scope.modalOn = true;
	    $scope.pinnedReview = text;
	}

	$scope.CloseClick = function(){
	    $scope.modalOn = false;
	}

	$scope.saveFeedback = function(text) {
		console.log(text, $scope.selectedPolarity); 
		// save feedback to backend
		$scope.successfulPin = true;
	}
}]);
