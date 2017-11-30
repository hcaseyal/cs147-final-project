var classID;

app.controller('ClassController', ['$scope', '$routeParams', function($scope, $routeParams) {
	$scope.selectedClass = $routeParams.classID;
	$scope.main.displayHeader = true;
	$scope.main.displayFullHeader = false;
	$scope.main.selectedButton = 'explore';
	$scope.displayFilters = false;
	$scope.modalOn = false;

	classID = $scope.selectedClass;

	const percentageBarWidth = 250;
	$scope.reviewCount = 0;
	var comfortableMap = new Map();	
	var usefulMap = new Map(); 
	$scope.classSkills = [];
	$scope.selectedSkill = '';

	let getClassUrl = "/getClass?classID=" + classID;
	remoteServiceGet(getClassUrl).then((info) => {
		$scope.classSkills = JSON.parse(info).skills;

		for (skill in $scope.classSkills) {
			comfortableMap.set($scope.classSkills[skill], 0); 
			usefulMap.set($scope.classSkills[skill], 0);
		}
	});	

	let url = "/getReviews?classID=" + classID;
	$scope.reviews = []; 
	remoteServiceGet(url).then((reviews) => {
		$scope.reviews = JSON.parse(reviews);
		$scope.reviewCount = $scope.reviews.length;
		
		for (review in $scope.reviews) {
			var comfortable = $scope.reviews[review].skillsComfortable; 
			var useful = $scope.reviews[review].skillsUseful;
			for (s in $scope.classSkills) {
				var skill = $scope.classSkills[s]; 
				if (comfortable.indexOf(skill) > -1) {
					comfortableMap.set(skill, comfortableMap.get(skill) + 1); 
				}
				if (useful.indexOf(skill) > -1) {
					usefulMap.set(skill, usefulMap.get(skill) + 1);  
				}
			}
		}

		// default selected skill is the first skill in the skills array
		$scope.selectedSkill = $scope.classSkills[0];
		$scope.comfortableCount = comfortableMap.get($scope.selectedSkill); 
	    $scope.comfortableWidth = percentageBarWidth * ($scope.comfortableCount / $scope.reviewCount);

	    $scope.usefulCount = usefulMap.get($scope.selectedSkill); 
	    $scope.usefulWidth = percentageBarWidth * ($scope.usefulCount / $scope.reviewCount);
	});

	$scope.toggleSelectedSkills = function(skill){
	    $scope.selectedSkill = skill;
	    $scope.comfortableCount = comfortableMap.get(skill); 
	    $scope.comfortableWidth = percentageBarWidth * ($scope.comfortableCount / $scope.reviewCount);

	    $scope.usefulCount = usefulMap.get(skill); 
	    $scope.usefulWidth = percentageBarWidth * ($scope.usefulCount / $scope.reviewCount);
	}

	$scope.CloseClick = function(){
	    $scope.modalOn = false;
	}
}]);
