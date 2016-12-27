import { Injectable, NgZone } from '@angular/core';
import { Events } from 'ionic-angular';


declare let google;

@Injectable()
export class MapService {

  //current route target with information
  public calculateRouteTo;

  private map;
  //google maps routing
  private directionsDisplay;
  private directionsService;
  //marker
  private ownMarker;
  private contactsMarker;
  //Warning Message

  constructor ( private events: Events, private zone: NgZone ) {
    //initialise the array for shared contacts
    this.contactsMarker = [];
    this.calculateRouteTo = {};
  }

  /* =====================================
   INITIALISING
   ===================================== */
  //this function initializes the map
  public initMap ( mapElement ) {
    //map style
    //let styles = [{"featureType":"all","elementType":"all","stylers":[{"visibility":"on"}]},{"featureType":"all","elementType":"labels","stylers":[{"visibility":"off"},{"saturation":"-100"}]},{"featureType":"all","elementType":"labels.text.fill","stylers":[{"saturation":36},{"color":"#000000"},{"lightness":40},{"visibility":"off"}]},{"featureType":"all","elementType":"labels.text.stroke","stylers":[{"visibility":"off"},{"color":"#000000"},{"lightness":16}]},{"featureType":"all","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#000000"},{"lightness":20}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#000000"},{"lightness":17},{"weight":1.2}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":20}]},{"featureType":"landscape","elementType":"geometry.fill","stylers":[{"color":"#4d6059"}]},{"featureType":"landscape","elementType":"geometry.stroke","stylers":[{"color":"#4d6059"}]},{"featureType":"landscape.natural","elementType":"geometry.fill","stylers":[{"color":"#4d6059"}]},{"featureType":"poi","elementType":"geometry","stylers":[{"lightness":21}]},{"featureType":"poi","elementType":"geometry.fill","stylers":[{"color":"#4d6059"}]},{"featureType":"poi","elementType":"geometry.stroke","stylers":[{"color":"#4d6059"}]},{"featureType":"road","elementType":"geometry","stylers":[{"visibility":"on"},{"color":"#7f8d89"}]},{"featureType":"road","elementType":"geometry.fill","stylers":[{"color":"#7f8d89"}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#7f8d89"},{"lightness":17}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#7f8d89"},{"lightness":29},{"weight":0.2}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":18}]},{"featureType":"road.arterial","elementType":"geometry.fill","stylers":[{"color":"#7f8d89"}]},{"featureType":"road.arterial","elementType":"geometry.stroke","stylers":[{"color":"#7f8d89"}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":16}]},{"featureType":"road.local","elementType":"geometry.fill","stylers":[{"color":"#7f8d89"}]},{"featureType":"road.local","elementType":"geometry.stroke","stylers":[{"color":"#7f8d89"}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":19}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#2b3638"},{"visibility":"on"}]},{"featureType":"water","elementType":"geometry","stylers":[{"color":"#2b3638"},{"lightness":17}]},{"featureType":"water","elementType":"geometry.fill","stylers":[{"color":"#24282b"}]},{"featureType":"water","elementType":"geometry.stroke","stylers":[{"color":"#24282b"}]},{"featureType":"water","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"labels.text","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"labels.text.fill","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"labels.text.stroke","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"labels.icon","stylers":[{"visibility":"off"}]}];
    //creating map
    let options = {
      zoom     : 14,
      mapTypeId: google.maps.MapTypeId.ROADMAP/*,
       styles: styles*/
    };
    this.map = new google.maps.Map( mapElement, options );

    //initialize routing
    this.initRoute();
    //start handling events
    this.handleEvents();
  }

  private initRoute () {
    // Create a renderer for directions and bind it to the map.
    this.directionsDisplay = new google.maps.DirectionsRenderer( { map: this.map } );

    // Instantiate a directions service.
    this.directionsService = new google.maps.DirectionsService;
  }


  /* =====================================
   CALCULATING ROUTE
   ===================================== */

  public stopRouting () {
    this.directionsDisplay.setMap( null );
    this.calculateRouteTo.username = null;
  }

  public calculateRouteToContact ( contact ) {
    let toMarker;
    let toContact;
    //search for the right marker
    for ( let i = 0; i < this.contactsMarker.length; i++ ) {
      if ( this.contactsMarker[ i ].username === contact.username ) {
        toMarker = this.contactsMarker[ i ].marker;
        toContact = this.contactsMarker[ i ].username;
      }
    }
    if ( toMarker ) {
      this.calculateRouteBetweenMarker( this.ownMarker, toMarker );
      this.calculateRouteTo.username = toContact;
    } else {
      this.events.publish( "userNotification", {
        text : "Es ist ein Fehler bei der Routenberechnung aufgetreten. Der Marker des ausgewählten Kontakts existiert nicht."
        + status,
        color: "danger"
      } );
    }
  }

  //this function calculates the route between two markers
  private calculateRouteBetweenMarker ( fromMarker, toMarker ) {
    this.directionsService.route( {
      origin     : fromMarker.getPosition(),
      destination: toMarker.getPosition(),
      travelMode : google.maps.TravelMode.WALKING
    }, ( response, status ) => {
      if ( status === google.maps.DirectionsStatus.OK ) {

        //using zone to fix variables not updating (google service)
        this.zone.run( () => {
          //store the active route information
          this.calculateRouteTo.info = response.routes[ 0 ].legs[ 0 ].distance.text + ' - '
            + response.routes[ 0 ].legs[ 0 ].duration.text;
        } );

        //show the route
        this.directionsDisplay.setMap( this.map );
        this.directionsDisplay.setDirections( response );
      } else {
        this.events.publish( "userNotification", {
          text : "Es ist ein Fehler bei der Routenberechnung aufgetreten. Bitte versuchen Sie es erneut:" + status,
          color: "danger"
        } );
      }
    } );
  }

  private handleEvents () {

    //own position updated
    this.events.subscribe( 'ownPosition:updated', ( ownLocation ) => {
      let gmapsPosition = {
        lat: ownLocation.latitude,
        lng: ownLocation.longitude
      };
      this.map.setCenter( gmapsPosition );

      if ( !this.ownMarker ) {
        //create new marker
        this.ownMarker = new google.maps.Marker( {
          map     : this.map,
          position: gmapsPosition
        } );
      } else {
        //update marker position
        this.ownMarker.setPosition( gmapsPosition );
      }

    } );

    //new users position
    this.events.subscribe( 'userPosition:new', ( userObject ) => {
      let gmapsPosition = {
        lat: userObject.position.latitude,
        lng: userObject.position.longitude
      };
      console.log( "new marker added" );
      //create marker
      let marker = new google.maps.Marker( {
        map     : this.map,
        position: gmapsPosition
      } );
      //push to marker array
      this.contactsMarker.push( {
        username: userObject.username,
        marker  : marker
      } );
    } );

    //users position updated
    this.events.subscribe( 'userPosition:updated', ( userObject ) => {
      let gmapsPosition = {
        lat: userObject.position.latitude,
        lng: userObject.position.longitude
      };
      for ( let i = 0; i < this.contactsMarker.length; i++ ) {
        //select the marker for this user
        if ( this.contactsMarker[ i ].username === userObject.username ) {
          this.contactsMarker[ i ].marker.setPosition( gmapsPosition );
          //if this user is also the current "Route-User"
          if ( this.calculateRouteTo.username === userObject.username ) {
            this.calculateRouteBetweenMarker( this.ownMarker, this.contactsMarker[ i ].marker );
          }
        }
      }
      console.log( "marker position updated" );
    } );
  }
}
