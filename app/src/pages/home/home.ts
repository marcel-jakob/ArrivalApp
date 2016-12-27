import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, Events } from 'ionic-angular';
import { BackendService } from "../../app/Services/backendService";
import { LocationService } from "../../app/Services/locationService";
import { ContactsPage } from '../contacts/contacts';
import { MapService } from '../../app/Services/mapService';

@Component( {
  selector   : 'page-home',
  templateUrl: 'home.html'
} )

export class HomePage {
  //get map element
  @ViewChild( 'map' ) mapElement: ElementRef;
  //routing information
  private calculateRouteTo;

  //contact who has access to your location (from locationService)
  private giveAccessTo;
  //Array for shared contacts (from locationService)
  public sharedContacts: Array<any>;

  //Warning Message
  public notification;
  private resetNotificationTimer;

  constructor ( public navCtrl: NavController, private backendService: BackendService,
                private locationService: LocationService, private events: Events, private mapService: MapService ) {


    this.notification = {};
    this.sharedContacts = locationService.sharedContacts;
    this.giveAccessTo = locationService.giveAccessTo;
    this.calculateRouteTo = mapService.calculateRouteTo;

  }

  ionViewDidLoad () {
    //initializing the map and pass the map element to the map service
    this.mapService.initMap( this.mapElement.nativeElement );

    //start handling events
    this.handleEvents();
  }

  public clickShowContacts () {
    this.navCtrl.push( ContactsPage );
  }

  /* =====================================
   INITIALISING
   ===================================== */

  public clickStopRouting () {
    this.mapService.stopRouting();
  }

  public clickCalculateRoute ( contact ) {
    this.mapService.calculateRouteToContact( contact );
  }

  /* =====================================
   NOTIFICATIONS
   ===================================== */

  private resetNotifications () {
    //make sure that timeout is cleared if there is an active one
    if ( this.resetNotificationTimer ) {
      clearTimeout( this.resetNotificationTimer );
    }
    this.resetNotificationTimer = setTimeout( () => {
      this.resetNotificationTimer = null;
      this.events.publish( "userNotification", {
        text : "",
        color: ""
      } );
    }, 10000 );
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
   EVENTS
   ===================================== */

  private handleEvents () {
    //new user notification
    this.events.subscribe( 'userNotification', ( notificationObject ) => {
      this.resetNotifications();
      this.notification.text = notificationObject.text;
      //colors: danger->red, primary->blue, secondary->green, default->white
      this.notification.color = notificationObject.color;
    } );
  }

}
