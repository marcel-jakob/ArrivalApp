var express = require('express');
var app = express();

// ### Server Config
//use 3000 for localhost
//use 62000 on uberspace server
var port = 62000;

// ### Express Config
var bodyParser = require('body-parser');
app.use(bodyParser.json());

// ### fix CORS Problem on localhost
var allowCrossDomain = require('./allow-cross-domain');
app.use(allowCrossDomain);


// ### Public Routes
var publicRoutes = require('./public-routes');
app.use(publicRoutes);

// ### only authorized access with jwt
var authorization = require('./authorization');
app.use(authorization);

// ### Private Routes
var privateRoutes = require('./private-routes');
app.use(privateRoutes);

// ### Startup
app.listen(port, function (err) {
    if (err) {
        console.error("express server failed: ", err);
    }
    console.log("express server started at :" + port);
});

//export express app for tests etc.
module.exports = app;