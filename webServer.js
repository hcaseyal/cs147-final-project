var bodyParser = require('body-parser');
var http = require('http');
var express = require('express'); 
let fs = require('fs');

// {classID -> [reviews]}
var classReviewIndex = {};
var allReviews = {};

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
});

app.post('/reviewClass', function (req, res) {
	let review = req.body;
	res.send("Received post request");

	getReviewID().then((id) => {
		review.id = id;
	})
	.then(() => {
		allReviews[review.id] = review;
		addEntryToIndex(classReviewIndex, review, review.classID);
		fs.writeFile("data/reviews", JSON.stringify(allReviews));
	})
});

app.get('/getReviews', function(req, res) {
	let classID = req.query.classID;
	res.send(JSON.stringify(classReviewIndex[classID]));
});

function addEntryToIndex(index, entry, key) {
	if (!(key in index)) {
		index[key] = [];
	}
	index[key].push(entry);
}

function buildClassReviewIndex() {
	getAllReviews().then((reviews) => {
		for (let reviewID in reviews) {
			let review = reviews[reviewID];
			let classID = review.classID;
			addEntryToIndex(classReviewIndex, review, classID);
		}
		console.log("Class review index: " + JSON.stringify(classReviewIndex));
	});
}

function buildReviewList() {
	getAllReviews().then((reviews) => {
		allReviews = reviews; 
	});
}

// Returns a JSON object containing all reviews in the reviews file
// reviews = {reviewID: review}
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