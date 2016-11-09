var express = require('express');
var app = express();

// ### Server Config
var port = process.env.PORT || 3000; //use 3000 or environment var

// ### Express Config
var bodyParser = require('body-parser');
app.use(bodyParser.json());

// ### Routes
// route /users
var usersRoute = require('./routes/users.js');
app.use('/users', usersRoute);


// ### Startup
app.listen(port, function (err) {
	if (err) {
		console.error("express server failed: ", err);
	}

	console.log("express server started at :" + port);

});

//export express app for tests etc.
module.exports = app;