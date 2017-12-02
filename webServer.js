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

var server = app.listen(portno, function () {
	var port = server.address().port;
	console.log('Listening at http://localhost:' + port + ' exporting the directory ' + __dirname);
	buildClassReviewIndex();
	buildReviewList();
	buildClassList();
	buildUserList();
});

///////////////////////////
/// START BACKEND API ///  
//////////////////////////

app.post('/reviewClass', function (req, res) {
	var review = req.body;
	res.send("Received post request");

	getReviewID().then((id) => {
		review.id = id;
	})
	.then(() => {
		reviews[review.id] = review;
		review = joinReviewWithUser(review, users, reviews);
		addEntryToIndex(classReviewIndex, review, review.classID);
		fs.writeFile("data/reviews", JSON.stringify(reviews));
	})
	.catch(error => {
		console.log(error);
	});
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
// E.g., {CS106A: {classID: CS106A, skills: [recursion, java]}, CS106B : {...} }
app.get('/getClasses', function(req, res) {
	res.send(JSON.stringify(classes));
});

// Returns class as a JSON object. E.g., {classID: CS106A, skills: [recursion, java]}
app.get('/getClass', function(req, res) {
	let classID = req.query.classID;
	res.send(JSON.stringify(classes[classID]));
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

function joinReviewWithUser(review, allUsers, allReviews) {
	let user = allUsers[review.userID];
	review.userInfo = {career: user.career, name: user.name, location: user.location};
	return review;
}

function buildClassReviewIndex() {
	getAllReviews().then((allReviews) => {
		getAllUsers().then((allUsers) => {
			for (let reviewID in allReviews) {
				let review = allReviews[reviewID];
				review = joinReviewWithUser(review, allUsers, allReviews)
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