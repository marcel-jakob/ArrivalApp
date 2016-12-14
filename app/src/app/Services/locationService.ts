import { Injectable } from '@angular/core';
import { Geolocation, Geoposition } from 'ionic-native';
import { BackendService } from "./backendService";
import { Events } from 'ionic-angular';

@Injectable()
export class LocationService {
  private ownLocation;
  public sharedContacts;

  constructor ( private backendService: BackendService, private events: Events ) {
    this.sharedContacts = [];
    this.startWatching();
    this.watchSharedContacts();
  }

  private startWatching () {
    let locationOptions = {
      timeout           : 10000,
      enableHighAccuracy: true
    };
    Geolocation.watchPosition( locationOptions )
      .subscribe( ( position: Geoposition ) => {
        this.ownLocation = {
          latitude : position.coords.latitude,
          longitude: position.coords.longitude
        };
        this.events.publish( 'ownPosition:updated', this.ownLocation );
      } );
  }

  public upload () {
    this.backendService.uploadLocation( this.ownLocation )
      .subscribe( error => console.log( error ), () => console.log( "Request Finished" ) );
  }

  private watchSharedContacts () {
    setInterval( () => {
      this.backendService.getLocations()
        .subscribe( response => this.watchSharedContactsResponse( response ),
          error => this.watchSharedContactsError( error ), () => console.log( "Get Locations Request Finished" ) );
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
    //this.warning = "Es ist ein Fehler bei der für Sie freigegebenen Standorte aufgetreten. Bitte versuchen Sie es erneut";
    console.log( error );
  }

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
            username    : username,
            position: position
          } );
        }
      }
    }
    if ( notFound ) {
      //save new shared contact
      this.sharedContacts.push( {
        username    : username,
        position: position
      } );
      this.events.publish( 'userPosition:new', {
        username    : username,
        position: position
      } );
    }
  }

  /* ENHANCEMENT: compare and remove outdated contacts from list, otherwise the position will just stay the same
  private cleanupSharedContacts(newList){

  }*/

}
