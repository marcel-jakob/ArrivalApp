var express = require('express');
var router = express.Router();
var DBConnection = require('./db-connection');
var jwt = require('jsonwebtoken');
var secretkey = require("./secretkey").key;


// POST new User
router.post('/newUser', function (req, res) {
    var doc = req.body;
    var username = doc.username;
    var password = doc.password;
    if (username && password) {
        var user = {
            username: username,
            password: password
        };
        DBConnection.doesUserExist(username, function (err, userExists) {
            if (err) {
                console.log("error at DB retrieval");
                res.status(500).send('something broke!');
            }
            else if (userExists) {
                res.status(403).send('User already exists');
                console.log("User " + username + " already exists");
            }
            else {
                DBConnection.insertUser(user, function (err, newDoc) {
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
router.get('/checkUser/:username', function (req, res) {
    var username = req.params.username;
    if (username) {
        DBConnection.doesUserExist(username, function (err, userExists) {
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
    else {
        res.status(403).send('Username is required');
        console.log("Username is required");
    }
});

//login user
router.post('/loginUser', function (req, res) {
    var doc = req.body;
    var username = doc.username;
    var password = doc.password;
    if (username && password) {
        var user = {
            username: username,
            password: password
        };
        DBConnection.loginUser(user, function (err, authSuccess) {
            if (err) {
                console.log("error at DB retrieval");
                res.status(500).send('something broke!');
            }
            else if (authSuccess) {
                var payload = {username: username};
                var jwtUser = jwt.sign(payload, secretkey);
                res.status(200).send({jwt: jwtUser});
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

module.exports = router;