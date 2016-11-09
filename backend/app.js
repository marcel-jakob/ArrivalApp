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

	db.insert(doc, function (err, newDoc) {   // Callback is optional
		if(err){
			cosole.log("error at DB insertion");
		}
		else{
			console.log("Inserted new user in DB:");
			console.log(newDoc);
			console.log("\n");
			res.send("ok");
		}
	});
});

// GET all Users
app.get('/', function (req, res) {
});

//GET one user by id
app.get('/:id', function (req, res) {
});



//export express app for tests etc.
module.exports = app;