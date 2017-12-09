var bodyParser = require('body-parser');
var http = require('http');
var express = require('express'); 
let fs = require('fs');


var classReviewIndex = {}; // {classID -> [reviews joined with reviewer data]}
var classes = {};
var reviews = {};
var users = {};

var portno = 3000;   // Port number to use
var app = express(); 

app.use(bodyParser.json());

app.use(function (req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

	// Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Pass to next layer of middleware
    next();
});

app.use(express.static(__dirname));

var server = app.listen(process.env.PORT || portno, function () {
	var port = server.address().port;
	console.log('Listening on' + port + ' exporting the directory ' + __dirname);
	buildClassReviewIndex();
	buildReviewList();
	buildClassList();
	buildUserList();
});

///////////////////////////
/// START BACKEND API ///  
//////////////////////////

// Bookmark class
// Request should send a json object in the form:
// { "classID" : "CS106A",
//	 "userID" : "0"
// },

app.post('/bookmarkClass', function (req, res) {
	res.send("Received bookmark class request");
	var bookmark = req.body;
	var userID = bookmark.userID;
	var user = users[userID];

	if (!user.bookmarkedClasses) {
		user.bookmarkedClasses = {};
	}
	user.bookmarkedClasses[bookmark.classID] = {};

	users[user.userID] = user;
	saveUsers();
});

// Unbookmark class
// Request should send a json object in the form:
// { "classID" : "CS106A",
//	 "userID" : "0"
// },

app.post('/unbookmarkClass', function (req, res) {
	res.send("Received unbookmark request");
	var bookmark = req.body;
	var userID = bookmark.userID;
	var user = users[userID];

	if (!user.bookmarkedClasses) {
		user.bookmarkedClasses = {};
	}

	let className = bookmark.classID;
	delete user.bookmarkedClasses[className];

	users[user.userID] = user;
	saveUsers();
});

app.post('/unpinFeedback', function (req, res) {
	res.send("Received unpinFeedback request");
	var feedback = req.body;
	var userID = feedback.userID;
	var user = users[userID];
	var type = feedback.type;

	if (!user.pinnedReviewFeedback) {
		user.pinnedReviewFeedback = {};
	}
	if (!user.pinnedWishFeedback) {
		user.pinnedWishFeedback = {};
	}

	if (type === "wish") { // I wish I learnt...
		delete user.pinnedWishFeedback[feedback.reviewID];
	}
	else { // Normal review text
		delete user.pinnedReviewFeedback[feedback.reviewID];
	}

	users[user.userID] = user;
	saveUsers();
});

app.post('/pinFeedback', function (req, res) {
	res.send("Received pin feedback request");
	var feedback = req.body;
	var userID = feedback.userID;
	var user = users[userID];
	var type = feedback.type;

	if (!user.pinnedReviewFeedback) {
		user.pinnedReviewFeedback = {};
	}
	if (!user.pinnedWishFeedback) {
		user.pinnedWishFeedback = {};
	}

	if (type === "wish") { // I wish I learnt...
		user.pinnedWishFeedback[feedback.reviewID] = { polarity: feedback.polarity };
	}
	else { // Normal review text
		user.pinnedReviewFeedback[feedback.reviewID] = { polarity: feedback.polarity };
	}

	users[user.userID] = user;
	saveUsers();
});

// For teachers editing their feedback form page
app.post('/editForm', function (req, res) {
	res.send("Received edit form request");
	var edit = req.body;
	var year = edit.selectedYear;
	var quarter = edit.selectedQuarter;
	var key = quarter + " " + year;

	let classToAdd = {skills: edit.classSkills, description: classes[edit.classID].description};
	console.log(classToAdd);
	if (key in classes[edit.classID].iterations) {
		var existingClass = classes[edit.classID].iterations[key];
		classToAdd.description = existingClass.description;
	}
	
	classes[edit.classID].iterations[key] = classToAdd;
	saveClasses();
});

// Editing a review
// Request should send a JSON object in the form:
// 
// { "id" : , // This is the id of the review you want edited!
//	 ...      // The rest of the review
// }

// Basically, just change the text and skill tags of the old review, 
// and send it here
app.post('/editReview', function (req, res) {
	var review = req.body;
	res.send("Received post request");

	reviews[review.id] = review;
	review = joinReviewWithUser(review, users);

	let classID = review.classID;
	for (let i in classReviewIndex[classID] ) {
		let storedReview = classReviewIndex[classID][i];
		if (storedReview.id === review.id) {
			buildClassReviewIndex[classID][i] = review;
		}
	}
	saveReviews();
});

// For submitting a new review
app.post('/reviewClass', function (req, res) {
	var review = req.body;
	res.send("Received post request");

	getReviewID().then((id) => {
		review.id = id;
	})
	.then(() => {
		reviews[review.id] = review;
		review = joinReviewWithUser(review, users);
		addEntryToIndex(classReviewIndex, review, review.classID);
		saveReviews();
	})
	.catch(error => {
		console.log(error);
	});
});

// Returns all pinned feedback for a particular user
// {classID: {polarity : [{reviewID, type, text, userInfo, ...}, ...
app.get('/getPinnedFeedback', function(req, res) {
	let userID = req.query.userID;
	let user = users[userID];
	let ret = {};

	// Normal reviews (not "I wish I learnt")
	for (let reviewID in user.pinnedReviewFeedback) {
		let info = user.pinnedReviewFeedback[reviewID];
		let review = reviews[reviewID];

		let classID = review.classID;
		let polarity = info.polarity;
		let reviewToSend = Object.assign({}, review);
		delete reviewToSend.wishText;
		reviewToSend.type = "review";
		reviewToSend.text = review.review;
		delete reviewToSend.review;

		ensureExists(ret, classID);
		ret[classID][polarity].push(reviewToSend);
	}

	// I wish I learnt reviews
	for (let reviewID in user.pinnedWishFeedback) {
		let info = user.pinnedWishFeedback[reviewID];
		let review = reviews[reviewID];

		let classID = review.classID;
		let polarity = info.polarity;
		let reviewToSend = Object.assign({}, review);
		delete reviewToSend.review;
		reviewToSend.type = "review";
		reviewToSend.text = review.wishText;
		delete reviewToSend.wishText;

		ensureExists(ret, classID);
		ret[classID][polarity].push(reviewToSend);
	}

	res.send(JSON.stringify(ret));
});

// Returns all reviews for a particular class
app.get('/getReviews', function(req, res) {
	let classID = req.query.classID;
	res.send(JSON.stringify(classReviewIndex[classID]));
});

// Returns all reviews as a JSON object 
// E.g., {classID: {review joined with reviewer data}, anotherClassID: {review} }
app.get('/getAllReviews', function(req, res) {
	res.send(JSON.stringify(classReviewIndex))
});

// Returns all classes as JSON object 
// E.g., 		
/*		{	CS106A: {
				classID: CS106A, 
				iterations: {
					Fall2017: {
						skills: [ 
							Java, recursion
						] 
*/

app.get('/getClasses', function(req, res) {
	res.send(JSON.stringify(classes));
});

// Returns class as a JSON object, given a classID
// If classYear is not provided, then returns
// all iterations of the class:
/*
	No classYear provided: 
	{ classID, iterations: {Winter 13-14: {}}, description }

	classYear provided: 
	{ skills: [...], description: ...}
*/
// OPTIONAL: classYear. E.g., "Winter 13-14"
app.get('/getClass', function(req, res) {
	let classID = req.query.classID;
	let iteration = req.query.classYear; // E.g., "Winter 13-14"
	console.log(req.query);
	if (iteration === undefined) {
		console.log("classYear not provided.");
		res.send(JSON.stringify(classes[classID]));
	}
	else {
		res.send(JSON.stringify(classes[classID].iterations[iteration]));
	}
});

app.get('/getUser', function(req, res) {
	let userID = req.query.userID;
	res.send(JSON.stringify(users[userID]));
});
/////////////////////////
/// END BACKEND API ///
////////////////////////


function addEntryToIndex(index, entry, key) {
	if (!(key in index)) {
		index[key] = [];
	}
	index[key].push(entry);
}

function joinReviewWithUser(review, allUsers) {
	let user = allUsers[review.userID];
	review.userInfo = {career: user.career, name: user.name, location: user.location};
	return review;
}

function buildClassReviewIndex() {
	getAllReviews().then((allReviews) => {
		getAllUsers().then((allUsers) => {
			for (let reviewID in allReviews) {
				let review = allReviews[reviewID];
				review = joinReviewWithUser(review, allUsers)
				addEntryToIndex(classReviewIndex, review, review.classID);
			}
			console.log("Class review index: " + JSON.stringify(classReviewIndex));
		})
		.catch(error => {
			console.log(error);
		});
	})
	.catch(error => {
		console.log(error);
	});
}

function buildReviewList() {
	getAllReviews().then((allReviews) => {
		reviews = allReviews; 
	})
	.catch(error => {
		console.log(error);
	});
}

function buildClassList() {
	getAllClasses().then((allClasses) => {
		classes = allClasses; 
	})
	.catch(error => {
		console.log(error);
	});
}

function buildUserList() {
	getAllUsers().then((allUsers) => {
		users = allUsers; 
	})
	.catch(error => {
		console.log(error);
	});
}

// Returns a JSON object containing all reviews in the reviews file
// reviews = {reviewID: {}}
function getAllReviews() {
	return new Promise((resolve, reject) => {
		readFile("data/reviews", function(filename, content) {
			let reviews = JSON.parse(content);
			resolve(reviews);
		},
		(error) => {
			reject(error);
		});
	});
}

// Returns a JSON object containing all classes in the classes file
// classes = {classID: {}}
function getAllClasses() {
	return new Promise((resolve, reject) => {
		readFile("data/classes", function(filename, content) {
			let classes = JSON.parse(content);
			resolve(classes);
		},
		(error) => {
			reject(error);
		});
	});
}

// Returns a JSON object containing all users in the users file
// users = {userID: {}}
function getAllUsers() {
	return new Promise((resolve, reject) => {
		readFile("data/users", function(filename, content) {
			let users = JSON.parse(content);
			resolve(users);
		},
		(error) => {
			reject(error);
		});
	});
}

function getReviewID() {
	return new Promise((resolve, reject) => {
		readFile('data/reviewID', function(filename, content) {
			let id = parseInt(content);
			fs.writeFile(filename, ++id);
			resolve(id);
		},
		(error) => { 
			reject(error);
		});
	});
}

function readFile(filename, onFileContent, onError) {
	fs.readFile(filename, 'utf-8', (err, content) => {
		if (err) {
			onError(err);
		} else {
			onFileContent(filename, content);
		}
	});
}

function ensureExists(ret, classID) {
	if (!(classID in ret)) {
		ret[classID] = {};
		ret[classID]["positive"] = [];
		ret[classID]["negative"] = [];
		ret[classID]["neutral"] = [];
	}
}

function saveUsers() {
	fs.writeFile("data/users", JSON.stringify(users));
}

function saveClasses() {
	fs.writeFile("data/classes", JSON.stringify(classes));
}

function saveReviews() {
	fs.writeFile("data/reviews", JSON.stringify(reviews));
}
