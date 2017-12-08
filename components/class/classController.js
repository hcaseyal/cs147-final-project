var classID;
var filterStates = {
		"iteration": [], 
		"career": [],
		"instructor": []
	};
var relevantReviews =  [];
var relevantWishReviews = [];

app.controller('ClassController', ['$scope', '$routeParams', '$route', function($scope, $routeParams, $route) {

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

	getSkills().then((skills) => getReviews());

	function getSkills() {
		return new Promise((resolve, reject) => {
			let getClassUrl = "/getClass?classID=" + classID;
			remoteServiceGet(getClassUrl).then((info) => {	
				if (info.length > 0) {
					var classData = JSON.parse(info); 

					let classSkills = {};
					for (let i in classData.iterations) {
						classData.iterations[i].skills.forEach(skill => {classSkills[skill] = true});
					}

					// Transform object into array
					let classSkillsArray = [];
					for (let skill in classSkills) {
						classSkillsArray.push(skill);
					}
					$scope.classSkills = classSkillsArray;
					$scope.classDescription = classData.description;

					for (skill in $scope.classSkills) {
						comfortableMap.set($scope.classSkills[skill], 0); 
						usefulMap.set($scope.classSkills[skill], 0);
					}
				}
				resolve($scope.classSkills)
			})
			.catch((error) => {
				reject(error);
			});	
		});
	}

	function getReviews() {
		let url = "/getReviews?classID=" + classID;
		$scope.reviews = []; 
		$scope.wishReviews = [];

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

					$scope.wishReviews.push({
						'text': review.wishText,
						'classYear': review.classYear,
						'userInfo': review.userInfo,
					})
					// also add reviews with no skills tags to "I wish I learnt"
					if (review.reviewTags.length == 0) {
						$scope.wishReviews.push({
							'text': review.review,
							'classYear': review.classYear,
							'userInfo': review.userInfo,
						})
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
			}
			$scope.$apply();
		});
	}

	$scope.toggleSelectedSkills = function(skill){
		relevantReviews = [];
		relevantWishReviews = [];

	    $scope.selectedSkill = skill;
	    $scope.comfortableCount = comfortableMap.get(skill); 
	    $scope.comfortableWidth = percentageBarWidth * ($scope.comfortableCount / $scope.reviewCount);

	    $scope.usefulCount = usefulMap.get(skill); 
	    $scope.usefulWidth = percentageBarWidth * ($scope.usefulCount / $scope.reviewCount);

	    // find reviews tagged with the selected skill 
	    for (r in $scope.reviews) {
			var review = $scope.reviews[r]; 

			for (t in review.reviewTags) {
				if (review.reviewTags[t].text == skill && filterReviews(review)) {
					relevantReviews.push(review);
				}
			}
		}

		// find reviews filtered to the filter criteria
	    for (r in $scope.wishReviews) {
			let review = $scope.wishReviews[r]; 

			if (filterReviews(review)) {
				relevantWishReviews.push(review);
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

		// by default, show max 4 "I wishes" initially 
		if (relevantWishReviews.length > 4) {
			$scope.relevantWishReviews = relevantWishReviews.slice(0,4);
			$scope.moreWish = true;
		} else {
			$scope.relevantWishReviews = relevantWishReviews.slice();
			$scope.moreWish = false; 
		}
	}

	// load all of the remaining reviews
	$scope.loadMoreReviews = function() {
		$scope.relevantReviews = relevantReviews.slice();
		$scope.moreReviews = false; 
	}

	// load all of the remaining I wish I learnts
	$scope.loadMoreWish = function() {
		$scope.relevantWishReviews = relevantWishReviews.slice();
		$scope.moreWish = false; 
	}


	$scope.CloseClick = function(){
	    $scope.modalOn = false;
	}

	$scope.bookmarkClass = function() {
		$scope.modalOn = true;
		var bookmark = {
			classID: classID, 
			userID: userID 
		};

		remoteServicePostJson(bookmark, "/bookmarkClass")
		.then((response) => {
			$scope.$apply();
		})
		.catch(error => {
			console.log(error);
			$scope.$apply();
		});
		
	}

	$scope.setFilterState = function($event) {
		var checkbox = $event.target;
		let filterType = checkbox.attributes.class.value;
		let value = checkbox.attributes.name.value;

		if (checkbox.checked) {
			filterStates[filterType].push(value);
		} else {
			let array = filterStates[filterType];
			let index = array.indexOf(value);
			if (index > -1) {
    			array.splice(index, 1);
			}
		}
		$scope.toggleSelectedSkills($scope.selectedSkill);
	}

	function filterReviews(review) {
		if (filterStates["iteration"].length > 0 && 
			!(filterStates["iteration"].includes(review.classYear))) {
			return false;
		}
		if (filterStates["career"].length > 0 && 
			!(filterStates["career"].includes(review.userInfo.career))) {
			return false;
		}
		return true;
	}
}]);
