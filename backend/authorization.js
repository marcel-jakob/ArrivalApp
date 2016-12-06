var jwt = require('jsonwebtoken');
var secretkey = require("./secretkey").key;

var authorization = function (req, res, next) {
    var token = req.headers['jwt'];
    if (token) {

        // verifies secret and checks exp
        jwt.verify(token, secretkey, function (err, decoded) {
            if (err) {
                res.json({success: false, message: 'Failed to authenticate token.'});
            } else {
                // if everything is good, save to request for use in other routes
                req.username = decoded.username;
                next();
            }
        });

    } else {

        // if there is no token
        // return an error
        res.status(403).send({
            success: false,
            message: 'No token provided.'
        });

    }
};

module.exports = authorization;