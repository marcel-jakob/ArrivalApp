var express = require('express');
var app = express();
var Datastore = require('nedb');
var jwt = require('jsonwebtoken');

//key for jwt
var secretkey = require("./secretkey").key;

// ### Server Config
//use 3000 for localhost
//use 62000 on uberspace server
var port = 62000;


//Route Functions
var allowCrossDomain = function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8100');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,jwt');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    //res.setHeader('Access-Control-Allow-Credentials', true);

    // intercept OPTIONS method
    if (req.method === 'OPTIONS') {
        res.status(200);
        res.send();
    }
    else {
        next();
    }
};

var authorize = function (req, res, next) {
    var token = req.headers['jwt'];
    if (token) {

        // verifies secret and checks exp
        jwt.verify(token, secretkey, function (err, decoded) {
            if (err) {
                return res.json({success: false, message: 'Failed to authenticate token.'});
            } else {
                // if everything is good, save to request for use in other routes
                req.jwtuser = decoded.user;
                next();
            }
        });

    } else {

        // if there is no token
        // return an error
        return res.status(403).send({
            success: false,
            message: 'No token provided.'
        });

    }
};

// ### NeDB connection
db = new Datastore({filename: __dirname + '/DB/users.db'});
db.loadDatabase(function (err) {
    if (err) {
        console.log("couldn't access DB")
    }
});

//Database Functions
var doesUserExist = function (username, callback) {
    db.findOne({username: username}, function (err, docs) {
        if (err) {
            callback(err, false);
        }
        else if (docs === null) {
            callback(false, false);
        }
        else {
            callback(false, true);
        }

    });
};
var insertUser = function (user, callback) {
    db.insert(user, function (err, newDoc) {
        if (err) {
            callback(err, newDoc);
        }
        else {
            callback(false, newDoc);
        }
    });
};
var loginUser = function (user, callback) {
    db.findOne({username: user.username}, function (err, docs) {
        if (err) {
            callback(err, false);
        }
        //user not found
        else if (docs === null) {
            callback(false, false);
        }
        //user found
        else {
            if (docs.password === user.password) {
                callback(false, true);
            }
            else {
                //wrong credentials
                callback(false, false);
            }
        }

    });
};


// ### Express Config
var bodyParser = require('body-parser');
app.use(bodyParser.json());

// ### fix CORS Problem on localhost
app.use(allowCrossDomain);

// ### create jwt
/* ### remove on server!
 app.get('/jwt', function (req, res) {
 var apijwt = jwt.sign("jwt4api", secretkey);
 console.log(apijwt);
 res.send(apijwt);
 });*/




// ### ROUTES --------------------------------------------------------------------------

// POST new User
app.post('/newUser', function (req, res) {
    var doc = req.body;
    var username = doc.username;
    var password = doc.password;
    if (username && password) {
        var user = {
            username: username,
            password: password
        };
        doesUserExist(username, function (err, userExists) {
            if (err) {
                console.log("error at DB retrieval");
                res.status(500).send('something broke!');
            }
            else if (userExists) {
                res.status(403).send('User already exists');
                console.log("User " + username + " already exists");
            }
            else {
                insertUser(user, function (err, newDoc) {
                    if (err) {
                        console.log("error at DB insertion");
                        res.status(500).send('something broke!');
                    }
                    else {
                        console.log("Inserted new user in DB:");
                        console.log(newDoc);
                        console.log("\n");
                        var payload = {username: username};
                        var jwtUser = jwt.sign(payload, secretkey);
                        res.status(200).send({jwt:jwtUser});
                    }
                })
            }
        });
    }
    else {
        res.status(403).send('Username and password required');
        console.log("Username and password is required");
    }
});

//Check if user exists by username
app.get('/checkUser/:username', function (req, res) {
    var username = req.params.username;
    if(username) {
        doesUserExist(username, function (err, userExists) {
            if (err) {
                console.log("error at DB retrieval");
                res.status(500).send('something broke!');
            }
            else if (userExists) {
                res.status(210).send();
                console.log("User " + username + " exists")
            }
            else {
                res.status(220).send();
                console.log("User " + username + " not found")
            }
        });
    }
    else{
        res.status(403).send('Username is required');
        console.log("Username is required");
    }
});

//login user
app.post('/loginUser', function (req, res) {
    var doc = req.body;
    var username = doc.username;
    var password = doc.password;
    if (username && password) {
        var user = {
            username: username,
            password: password
        };
        loginUser(user, function (err, authSuccess) {
            if (err) {
                console.log("error at DB retrieval");
                res.status(500).send('something broke!');
            }
            else if (authSuccess) {
                var payload = {username: username};
                var jwtUser = jwt.sign(payload, secretkey);
                res.status(200).send({jwt:jwtUser});
                console.log("User " + username + " logged in")
            }
            else {
                res.status(403).send();
                console.log("Wrong credentials")
            }
        });
    }
    else {
        res.status(403).send('Username and password required');
        console.log("Username and password is required");
    }
});

// ### only authorized access with jwt
//app.use(authorize);

// GET location of user :id
app.get('/getLocation/:id', function (req, res) {
    var id = req.params.id;

    db.find({id: id}, function (err, docs) {
        if (err) {
            console.log("error at DB retrieval");
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

    db.find({id: id}, function (err, docs) {
        if (err) {
            console.log("error at DB retrieval");
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

    db.update({id: fromID}, {$set: {access: toID}}, function (err, doc) {
        if (err) {
            console.log("error at DB update");
            res.status(500).send('something broke!');
        }
        else {
            console.log(doc);
            res.send("ok");
        }
    });
});

// ### Startup
app.listen(port, function (err) {
    if (err) {
        console.error("express server failed: ", err);
    }

    console.log("express server started at :" + port);

});
//export express app for tests etc.
module.exports = app;