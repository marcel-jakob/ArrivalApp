import { Injectable } from '@angular/core';
import { Geolocation, Geoposition } from 'ionic-native';
import { BackendService } from "./backendService";
import { Events } from 'ionic-angular';

@Injectable()
export class LocationService {
  public ownLocation;
  public sharedContacts;
  public giveAccessTo;

  constructor ( private backendService: BackendService, private events: Events ) {
    this.sharedContacts = [];
    this.giveAccessTo = {};
    this.startWatching();
    this.watchSharedContacts();
    this.whoDidIShare();
  }

  public upload () {
    this.backendService.uploadLocation( this.ownLocation )
      .subscribe( data => console.log( "upload own location successfull" ), error => console.log( "Error", error ) );
  }

  /* =====================================
   WATCH OWN LOCATION
   ===================================== */
  private startWatching () {
    let locationOptions = {
      timeout           : 10000,
      enableHighAccuracy: true
    };
    Geolocation.watchPosition( locationOptions )
      .subscribe( ( position: Geoposition ) => {
        console.log( "own position changed", position );
        if ( position.coords ) {
          this.ownLocation = {
            latitude : position.coords.latitude,
            longitude: position.coords.longitude
          };
          this.events.publish( 'ownPosition:updated', this.ownLocation );
        } else {
          this.events.publish( "userNotification", {
            text : "Es ist ein Fehler bei der Standortabfrage aufgetreten. Bitte überprüfen Sie Ihre Einstellungen und versuchen Sie es erneut.",
            color: "danger"
          } );
        }
      } );
  }

  /* =====================================
   WATCH LOCATION OF SHARED CONTACTS
   ===================================== */
  private watchSharedContacts () {
    this.backendService.getLocations()
      .subscribe( response => this.watchSharedContactsResponse( response ),
        error => this.watchSharedContactsError( error ) );

    setTimeout( () => {
      this.watchSharedContacts();
    }, 5000 );
  }

  private watchSharedContactsResponse ( response ) {
    for ( let i = 0; i < response.length; i++ ) {
      let username = response[ i ].username;
      let position = {
        latitude : response[ i ].coordinates.latitude,
        longitude: response[ i ].coordinates.longitude
      };
      this.compareUsernameToSharedContacts( username, position )
    }
  }

  private watchSharedContactsError ( error ) {
    //this.notification = "";
    console.log( error );
    this.events.publish( "userNotification", {
      text : "Es ist ein Fehler bei der für Sie freigegebenen Standorte aufgetreten. Bitte sorgen Sie für eine aktive Internetverbindung und versuchen Sie es erneut.",
      color: "danger"
    } );
  }

  /* =====================================
   ON FIRST LOAD: CHECK WHO HAS ACCESS TO MY LOCATION
   ===================================== */

  private whoDidIShare () {
    this.backendService.getWhoDidIShare()
      .subscribe( data => this.whoDidIShareResponse( data ), error => this.whoDidIShareError( error ) );
  }

  private whoDidIShareResponse ( response ) {
    this.giveAccessTo.username = response.giveAccessTo;
  }

  private whoDidIShareError ( error ) {
    this.giveAccessTo.username = "";
    console.log( error );
    this.events.publish( "userNotification", {
      text : "Es ist ein Fehler bei der Kommunikation mit dem Server aufgetreten. Bitte sorgen Sie für eine aktive Internetverbindung und versuchen Sie es erneut.",
      color: "danger"
    } );
  }

  /* =====================================
   HELPER FUNCTION TO CHECK IF LOCATION OF FRIENDS HAS CHANGED
   ===================================== */
  private compareUsernameToSharedContacts ( username, position ) {
    let notFound = true;
    for ( let i = 0; i < this.sharedContacts.length; i++ ) {
      //check if username is already in sharedContacts
      if ( username === this.sharedContacts[ i ].username ) {
        notFound = false;
        //check if position has changed
        if ( position.latitude != this.sharedContacts[ i ].position.latitude || position.longitude
          != this.sharedContacts[ i ].position.longitude ) {
          //save new position
          this.sharedContacts[ i ].position.latitude = position.latitude;
          this.sharedContacts[ i ].position.longitude = position.longitude;
          this.events.publish( 'userPosition:updated', {
            username: username,
            position: position
          } );
        }
      }
    }
    if ( notFound ) {
      //save new shared contact
      this.sharedContacts.push( {
        username: username,
        position: position
      } );
      this.events.publish( 'userPosition:new', {
        username: username,
        position: position
      } );
    }
  }

}
