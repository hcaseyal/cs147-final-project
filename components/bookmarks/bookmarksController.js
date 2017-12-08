var userID = 0; // TODO: hook this up to a dynamic user ID

app.controller('BookmarksController', ['$scope', function($scope) {
	$scope.main.displayHeader = true;
	$scope.main.displayFullHeader = false; 
	$scope.main.selectedButton = 'explore';

	$scope.bookmarks = [];

	var getUserUrl = "/getUser?userID=" + userID;
	remoteServiceGet(getUserUrl).then((data) => {
		if (data.length > 0) {
			let user = JSON.parse(data); 

			for (let className in user.bookmarkedClasses) {
				let classObj = user.bookmarkedClasses[className];
				classObj.url = "#!/class/" + className;
				classObj.name = className;
				$scope.bookmarks.push(classObj);
			}
		}
		$scope.$apply();
	})
	.catch((error) => {
		console.log(error);
	});

}]);