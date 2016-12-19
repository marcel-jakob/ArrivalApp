import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, Events } from 'ionic-angular';
import { BackendService } from "../../app/Services/backendService";
import { NgZone } from '@angular/core';
import { LocationService } from "../../app/Services/locationService";
import { ContactsPage } from '../contacts/contacts';


declare let google;

@Component( {
  selector   : 'page-home',
  templateUrl: 'home.html'
} )

export class HomePage {
  //Google Map
  @ViewChild( 'map' ) mapElement: ElementRef;
  private map: any;
  //google maps routing
  private directionsDisplay;
  private directionsService;

  //contact who has access to your location (from locationService)
  private giveAccessTo;
  //Array for shared contacts (from locationService)
  public sharedContacts: Array<any>;

  private ownMarker;
  private contactsMarker;
  //current route target
  private calculateRouteTo;
  //Warning Message
  public notification;
  private resetNotificationTimer;

  constructor ( public navCtrl: NavController, private backendService: BackendService, private zone: NgZone,
                private locationService: LocationService, private events: Events ) {


    //initialise the array for shared contacts
    this.contactsMarker = [];
    this.calculateRouteTo = {};
    this.notification = {};
    this.sharedContacts = locationService.sharedContacts;
    this.giveAccessTo = locationService.giveAccessTo;

  }

  ionViewDidLoad () {
    //initializing the map and updating it with the position of shared contacts
    this.initMap();
    //initialize routing
    this.initRoute();

    this.handleEvents();

  }

  public clickShowContacts () {
    this.navCtrl.push( ContactsPage );
  }

  /* =====================================
   GIVE OR REMOVE ACCESS to contacts
   ===================================== */
  public clickGiveAccess ( contactName ) {
    this.backendService.giveAccessTo( contactName )
      .subscribe( response => this.handleGiveAccessResponse( contactName ),
        error => this.handleGiveAccessError( error ) );
  }

  private handleGiveAccessResponse ( contactName ) {
    //save who got access
    this.giveAccessTo.username = contactName;
  }

  private handleGiveAccessError ( error ) {
    console.log( error );
    this.events.publish( "userNotification", {
      text : "Es ist ein Fehler bei der Standortfreigabe aufgetreten. Bitte sorgen Sie für eine aktive Internetverbindung und versuchen Sie es erneut.",
      color: "danger"
    } );
  }

  public clickRemoveAccess () {
    this.backendService.removeAccess()
      .subscribe( response => this.handleRemoveAccessResponse(), error => this.handleRemoveAccessError( error ) );
  }

  private handleRemoveAccessResponse () {
    //save who got access
    this.giveAccessTo.username = "";
  }

  private handleRemoveAccessError ( error ) {
    console.log( error );
    this.events.publish( "userNotification", {
      text : "Es ist ein Fehler bei der Deaktivierung der Standortfreigabe aufgetreten. Bitte sorgen Sie für eine aktive Internetverbindung und versuchen Sie es erneut.",
      color: "danger"
    } );
  }

  /* =====================================
   INITIALISING
   ===================================== */
  //this function initializes the map
  private initMap () {
    //map style
    //let styles = [{"featureType":"all","elementType":"all","stylers":[{"visibility":"on"}]},{"featureType":"all","elementType":"labels","stylers":[{"visibility":"off"},{"saturation":"-100"}]},{"featureType":"all","elementType":"labels.text.fill","stylers":[{"saturation":36},{"color":"#000000"},{"lightness":40},{"visibility":"off"}]},{"featureType":"all","elementType":"labels.text.stroke","stylers":[{"visibility":"off"},{"color":"#000000"},{"lightness":16}]},{"featureType":"all","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#000000"},{"lightness":20}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#000000"},{"lightness":17},{"weight":1.2}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":20}]},{"featureType":"landscape","elementType":"geometry.fill","stylers":[{"color":"#4d6059"}]},{"featureType":"landscape","elementType":"geometry.stroke","stylers":[{"color":"#4d6059"}]},{"featureType":"landscape.natural","elementType":"geometry.fill","stylers":[{"color":"#4d6059"}]},{"featureType":"poi","elementType":"geometry","stylers":[{"lightness":21}]},{"featureType":"poi","elementType":"geometry.fill","stylers":[{"color":"#4d6059"}]},{"featureType":"poi","elementType":"geometry.stroke","stylers":[{"color":"#4d6059"}]},{"featureType":"road","elementType":"geometry","stylers":[{"visibility":"on"},{"color":"#7f8d89"}]},{"featureType":"road","elementType":"geometry.fill","stylers":[{"color":"#7f8d89"}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#7f8d89"},{"lightness":17}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#7f8d89"},{"lightness":29},{"weight":0.2}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":18}]},{"featureType":"road.arterial","elementType":"geometry.fill","stylers":[{"color":"#7f8d89"}]},{"featureType":"road.arterial","elementType":"geometry.stroke","stylers":[{"color":"#7f8d89"}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":16}]},{"featureType":"road.local","elementType":"geometry.fill","stylers":[{"color":"#7f8d89"}]},{"featureType":"road.local","elementType":"geometry.stroke","stylers":[{"color":"#7f8d89"}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":19}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#2b3638"},{"visibility":"on"}]},{"featureType":"water","elementType":"geometry","stylers":[{"color":"#2b3638"},{"lightness":17}]},{"featureType":"water","elementType":"geometry.fill","stylers":[{"color":"#24282b"}]},{"featureType":"water","elementType":"geometry.stroke","stylers":[{"color":"#24282b"}]},{"featureType":"water","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"labels.text","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"labels.text.fill","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"labels.text.stroke","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"labels.icon","stylers":[{"visibility":"off"}]}];
    //creating map
    let options = {
      zoom     : 14,
      mapTypeId: google.maps.MapTypeId.ROADMAP/*,
       styles: styles*/
    };
    this.map = new google.maps.Map( this.mapElement.nativeElement, options );
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

  public clickCalculateRoute ( contact ) {
    let toMarker;
    let toContact;
    //search the right marker
    for ( let i = 0; i < this.contactsMarker.length; i++ ) {
      if ( this.contactsMarker[ i ].username === contact.username ) {
        toMarker = this.contactsMarker[ i ].marker;
        toContact = this.contactsMarker[ i ].username;
      }
    }
    if ( toMarker ) {
      this.calculateRoute( this.ownMarker, toMarker );
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
  private calculateRoute ( fromMarker, toMarker ) {
    //this.resetMarker();

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
        this.directionsDisplay.setDirections( response );
      } else {
        this.events.publish( "userNotification", {
          text : "Es ist ein Fehler bei der Routenberechnung aufgetreten. Bitte versuchen Sie es erneut:" + status,
          color: "danger"
        } );
      }
    } );
  }

  /* =====================================
   NOTIFICATIONS
   ===================================== */

  private resetNotifications () {
    //make sure that timeout is cleared if there is an active one
    if(this.resetNotificationTimer){
      clearTimeout(this.resetNotificationTimer);
    }
    this.resetNotificationTimer= setTimeout(()=>{
      this.resetNotificationTimer=null;
      this.events.publish( "userNotification", {
        text : "",
        color: ""
      } );
    },10000);
  }


  /* =====================================
   EVENTS
   ===================================== */

  private handleEvents () {

    //own position updated
    this.events.subscribe( 'ownPosition:updated', ( ownLocation ) => {
      let gmapsPosition = {
        lat: ownLocation[ 0 ].latitude,
        lng: ownLocation[ 0 ].longitude
      };
      if ( !this.ownMarker ) {
        //create new marker
        this.map.setCenter( gmapsPosition );
        this.ownMarker = new google.maps.Marker( {
          map     : this.map,
          position: gmapsPosition
        } );
      } else {
        //update marker position
        this.map.setCenter( gmapsPosition );
        this.ownMarker.setPosition( gmapsPosition );
      }

    } );

    this.events.subscribe( 'ownPosition:updated', () => {
      this.locationService.upload();
    } );

    //new users position
    this.events.subscribe( 'userPosition:new', ( userObject ) => {
      let gmapsPosition = {
        lat: userObject[ 0 ].position.latitude,
        lng: userObject[ 0 ].position.longitude
      };
      console.log( "new marker added" );
      //create marker
      let marker = new google.maps.Marker( {
        map     : this.map,
        position: gmapsPosition
      } );
      //push to marker array
      this.contactsMarker.push( {
        username: userObject[ 0 ].username,
        marker  : marker
      } );
    } );

    //users position updated
    this.events.subscribe( 'userPosition:updated', ( userObject ) => {
      console.log( "marker position updated" );
    } );

    //new user notification
    this.events.subscribe( 'userNotification', ( notificationObject ) => {
      this.resetNotifications();
      this.notification.text = notificationObject[ 0 ].text;
      //colors: danger->red, primary->blue, secondary->green, default->white
      this.notification.color = notificationObject[ 0 ].color;
    } );
  }

  /* =====================================
   TODO
   ===================================== */

  //TODO: loading contacts notification (like errors)
  //TODO: delete route
  //TODO: GMAP FUNCTIONS to service
  //TODO: recalculate route
  // this function recalculates the route if necessary
  /* private updateRoute () {
   if ( this.calculateRouteTo ) {
   //show if calculateRoue to is in array of shared contacts
   for ( let i = 0; i < this.sharedContacts.length; i++ ) {
   if ( this.sharedContacts[ i ].name === this.calculateRouteTo.name ) {
   this.calculateRoute( this.ownMarker, this.sharedContacts[ i ] );
   }
   }
   }
   }*/

}
