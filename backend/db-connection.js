var Datastore = require( 'nedb' );
var DBConnection = {};

// ### NeDB connection
db = new Datastore( { filename: __dirname + '/DB/users.db' } );
db.loadDatabase( function ( err ) {
  if ( err ) {
    console.log( "couldn't access DB" )
  }
} );

//Database Functions
DBConnection.doesUserExist = function ( username, callback ) {
  db.findOne( { username: username }, function ( err, docs ) {
    if ( err ) {
      callback( err, false );
    } else if ( docs === null ) {
      callback( false, false );
    } else {
      callback( false, true );
    }

  } );
};
DBConnection.insertUser = function ( user, callback ) {
  db.insert( user, function ( err, newDoc ) {
    if ( err ) {
      callback( err, newDoc );
    } else {
      callback( false, newDoc );
    }
  } );
};
DBConnection.loginUser = function ( user, callback ) {
  db.findOne( { username: user.username }, function ( err, docs ) {
    if ( err ) {
      callback( err, false );
    }
    //user not found
    else if ( docs === null ) {
      callback( false, false );
    }
    //user found
    else {
      if ( docs.password === user.password ) {
        callback( false, true );
      } else {
        //wrong credentials
        callback( false, false );
      }
    }

  } );
};
DBConnection.giveAccessTo = function ( username, forId, callback ) {
  db.update( { username: username }, { $set: { giveAccessTo: forId } }, function ( err, doc ) {
    callback( err, doc );
  } );
};
DBConnection.saveLocation = function ( username, coordinates, callback ) {
  db.update( { username: username }, { $set: { coordinates: coordinates } }, function ( err, doc ) {
    callback( err );
    console.log( "save location from " + username + ": " + doc );
  } );
};
DBConnection.getUserLocation = function ( username, callback ) {
  db.find( { giveAccessTo: username }, function ( err, doc ) {
    callback( err, doc );
  } );
};
DBConnection.whoDidIShare = function ( username, callback ) {
  db.find( { username: username }, function ( err, doc ) {
    callback( err, doc );
  } );
};
module.exports = DBConnection;