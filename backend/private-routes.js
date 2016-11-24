var express = require('express');
var router = express.Router();
var DBConnection = require('./db-connection');
var jwt = require('jsonwebtoken');
var secretkey = require("./secretkey").key;

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

//POST give user access
router.post('/giveAccess', function (req, res) {
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

module.exports = router;