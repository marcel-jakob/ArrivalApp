var express = require('express');
var app = express();
var Datastore = require('nedb');

// ### Server Config
var port = process.env.PORT || 3000; //use 3000 or environment var

// ### NeDB connection
db = new Datastore({ filename: './DB/users.db' });
db.loadDatabase(function (err) {
	if(err){
		console.log("couldn't access DB")
	}
});

// ### Express Config
var bodyParser = require('body-parser');
app.use(bodyParser.json());

// ### fix CORS Problem on localhost
app.use(function (req, res, next) {

	// Website you wish to allow to connect
	res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8100');

	// Request methods you wish to allow
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

	// Request headers you wish to allow
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

	// Set to true if you need the website to include cookies in the requests sent
	// to the API (e.g. in case you use sessions)
	res.setHeader('Access-Control-Allow-Credentials', true);

	// Pass to next layer of middleware
	next();
});

// ### Startup
app.listen(port, function (err) {
	if (err) {
		console.error("express server failed: ", err);
	}

	console.log("express server started at :" + port);

});

// ### ROUTES --------------------------------------------------------------------------

// POST new User
app.post('/newUser', function (req, res) {
	var doc = req.body;

	db.insert(doc, function (err, newDoc) {
		if(err){
			cosole.log("error at DB insertion");
			res.status(500).send('something broke!');
		}
		else{
			console.log("Inserted new user in DB:");
			console.log(newDoc);
			console.log("\n");
			res.send("ok");
		}
	});
});

// GET location of user :id
app.get('/getLocation/:id', function (req, res) {
	var id = req.params.id;

	db.find({ id: id }, function (err, docs) {
		if(err){
			cosole.log("error at DB retrieval");
			res.status(500).send('something broke!');
		}
		else {
			var loc = docs[0].location;
			res.send(loc);
		}
	});
});

//GET one user by id
app.get('/getPushid/:id', function (req, res) {
	var id = req.params.id;

	db.find({ id: id }, function (err, docs) {
		if(err){
			cosole.log("error at DB retrieval");
			res.status(500).send('something broke!');
		}
		else {
			var pushid = docs[0].pushid;
			res.send(pushid);
		}
	});
});

//POST give user access
app.post('/giveAccess', function (req, res) {
	var fromID = req.body.fromID;
	var toID = req.body.toID;

	db.update({ id: fromID }, { $set: {access: toID}}, function (err, doc) {
		if(err){
			cosole.log("error at DB update");
			res.status(500).send('something broke!');
		}
		else {
			console.log(doc);
			res.send("ok");
		}
	});
});

//Check if user exists by userid
app.get('/checkUser/:id', function (req, res) {
	var id = req.params.id;

	db.findOne({ id: id }, function (err, docs) {
		if(err){
			console.log("error at DB retrieval");
			res.status(500).send('something broke!');
		}
		else {
			if(docs === null){
				res.send({"userExists":false});
				console.log("User "+ id +" not found")
			}
			else{
				res.send({"userExists":true});
				console.log("User "+ id +" exists")
			}
		}
	});
});

//export express app for tests etc.
module.exports = app;