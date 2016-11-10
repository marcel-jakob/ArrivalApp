var express = require('express');
var app = express();
var Datastore = require('nedb');

// ### Server Config
var port = process.env.PORT || 3000; //use 3000 or environment var

// ### Express Config
var bodyParser = require('body-parser');
app.use(bodyParser.json());

// ### NeDB connection
db = new Datastore({ filename: './DB/users.db' });
db.loadDatabase(function (err) {
	if(err){
		console.log("couldn't access DB")
	}
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


//export express app for tests etc.
module.exports = app;