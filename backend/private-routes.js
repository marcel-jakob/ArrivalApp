var express = require('express');
var router = express.Router();
var DBConnection = require('./db-connection');
var jwt = require('jsonwebtoken');
var secretkey = require("./secretkey").key;


//GET give user access
router.get('/giveAccessTo/:forId', function (req, res) {
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
            DBConnection.giveAccessTo(req.username,forId, function( err, doc){
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
//GET remove user access
router.get('/removeAccess/', function (req, res) {
    var forId = "";
    DBConnection.giveAccessTo(req.username, forId, function ( err, doc) {
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
});
// Upload User location
router.post('/uploadLocation/', function (req, res) {
    var doc = req.body;
    var coordinates = doc.coordinates;
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
router.get('/getLocations/', function (req, res) {
  var username = req.username;

  DBConnection.getUserLocation(username, function (err, doc) {
    if (err) {
      console.log("ERROR: at DB retrieval");
      res.status(500);
    }
    else {
      // array of locations
      var locations = [];
      var location;

      for (var i in doc){
        location = {};
        location.username = doc[i].username;
        location.coordinates = doc[i].coordinates;

        // push one location in locations array
        locations.push(location);
      }
      //return locations array
      res.send(locations);
    }
  });
});

// GET location of user :id
router.get('/whoDidIShare/', function (req, res) {
  console.log("get whodidishare");
  var username = req.username;

  DBConnection.whoDidIShare(username, function (err, doc) {
    if (err) {
      console.log("ERROR: at DB retrieval");
      res.status(500);
    }
    else {
      var sharedContact;
      if(doc!=null){
        sharedContact=doc[0].giveAccessTo;
      }
      else{
        sharedContact=null;
      }
      res.send({giveAccessTo: sharedContact});
    }
  });
});

/*GET one user by id
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
});*/


module.exports = router;