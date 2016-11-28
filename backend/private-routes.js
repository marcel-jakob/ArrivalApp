var express = require('express');
var router = express.Router();
var DBConnection = require('./db-connection');
var jwt = require('jsonwebtoken');
var secretkey = require("./secretkey").key;


//GET give user access
router.get('/giveAccess/:forId', function (req, res) {
    var forId = req.params.forId;
    DBConnection.doesUserExist(forId, function (err, userExists) {
        if (err) {
            console.log("error at DB retrieval");
            res.status(500).send('something broke!');
        }
        else if (!userExists) {
            res.status(404).send('User not found');
        }
        else {
            DBConnection.giveAccess(req.username,forId, function(err, doc){
                if (err) {
                    console.log("error at DB update");
                    res.status(500).send('something broke!');
                }
                else {
                    if (doc) {
                        res.status(200).send();
                    }
                    else {
                        res.status(500).send('something broke! Nothing updated');
                    }
                }
            });
        }
    });
});
// Upload User location
router.post('/uploadLocation/', function (req, res) {
    var doc = req.body;
    var coordinates = doc;
    DBConnection.saveLocation(req.username, coordinates, function (err) {
        if (err) {
            console.log("error at DB retrieval");
            res.status(500).send('something broke!');
        }
        else {
            res.send();
        }
    });
});

// GET location of user :id
router.get('/getLocation/:id', function (req, res) {
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
router.get('/getPushid/:id', function (req, res) {
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


module.exports = router;