var bodyParser = require('body-parser');
var http = require('http');
var express = require('express'); 
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
});

app.post('/reviewClass', function (req, res) {
	console.log(req.body.review);
	res.send("Received post request");
});