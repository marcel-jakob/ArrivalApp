import {Component, ViewChild, ElementRef} from '@angular/core';
import {NavController} from 'ionic-angular';
import {Storage} from '@ionic/storage';
import {Geolocation} from 'ionic-native';
import {BackendService} from "../../app/Services/backendService";
import {NgZone} from '@angular/core';
import {LocationService} from "../../app/Services/locationService";
import {ContactsPage} from '../contacts/contacts';


declare let google;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {
  //Google Map
  @ViewChild('map') mapElement: ElementRef;
  private map: any;
  //Warning Message
  public warning: string;
  //Array for shared contacts
  public sharedContacts: Array<any>;

  private ownMarker;
  //google maps routing
  private directionsDisplay;
  private directionsService;
  //username of contact who has access to your location
  private giveAccessTo: string;
  //current route target
  private calculateRouteTo;
  //intervall to update locations
  private updateInterval;

  constructor(public navCtrl: NavController, private backendService: BackendService, private zone: NgZone, private locationService: LocationService, private storage: Storage) {
    //initialise the array for shared contacts
    this.sharedContacts = [];
  }

  //this function is triggered before the home screen is viewed
  ionViewWillEnter() {

    //initializing the map and updating it with the position of shared contacts
    this.initMap();

    //check if other page changed access to someone
    this.storage.get('giveAccessTo').then((accessTo) => {
      if (accessTo) {
        this.giveAccessTo = accessTo;
      }
      else {
        this.giveAccessTo = "";
      }
    });

    //update positions and routes every 30 seconds
    this.updateInterval = setInterval(() => {
      this.updateLocation()
    }, 20000);
  }

  //this function is triggered before the home screen is leaved
  ionViewWillLeave() {
    clearInterval(this.updateInterval);
  }

  public clickSendLocation() {
    this.navCtrl.push(ContactsPage);
  }

  public clickContact(contact) {
    this.calculateRoute(this.ownMarker, contact);
  }

  /* =====================================
   GIVE ACCESS to contacts
   ===================================== */
  public clickGiveAccess(contactName) {
    this.backendService.giveAccess(contactName).subscribe(
      response => this.handleGiveAccessResponse(contactName),
      error => this.handleGiveAccessError(error),
      () => console.log("Request Finished")
    );
  }

  private handleGiveAccessResponse(contactName) {
    //save who got access
    this.storage.set('giveAccessTo', contactName);
    this.giveAccessTo = contactName;

    //updates markers (and routes)
    this.updateLocation();
  }

  private handleGiveAccessError(error) {
    console.log(error);
    this.warning = "Es ist ein Fehler bei der Standortfreigabe aufgetreten. Bitte versuchen Sie es erneut";
  }

  /* =====================================
   INITIALISING
   ===================================== */
  //this function initializes the map
  private initMap() {
    //creating map
    let options = {
      zoom: 14,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    this.map = new google.maps.Map(
      this.mapElement.nativeElement,
      options
    );


    //initialize routing
    this.initRoute();

    //getting own location
    let locationOptions = {
      timeout: 10000,
      enableHighAccuracy: true
    };

    //update location of markers
    this.updateLocation();
  }

  /* =====================================
   GETTING LOCATION (-> triggers calculating route and uploading location)
   ===================================== */

  //this function updates the own marker and triggers getting of other markers
  private updateLocation() {
    this.resetMarker();

    //get own location, set it to map center and create marker
    let locationOptions = {
      timeout: 10000,
      enableHighAccuracy: true
    };
    Geolocation.getCurrentPosition(locationOptions).then((resp) => {
      let position = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);
      this.map.setCenter(position);
      this.ownMarker = new google.maps.Marker({
        map: this.map,
        position: position
      });

      //get location of contacts
      this.getLocations();
    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }

  //this function gets the location of contacts from the backend
  private getLocations() {
    this.backendService.getLocations().subscribe(
      response => this.handleGetLocationsResponse(response),
      error => this.handleGetLocationsError(error),
      () => console.log("Get Locations Request Finished")
    );
  }

  private handleGetLocationsResponse(response) {
    //clear array of old shared contacts
    this.sharedContacts = [];
    //fill array with shared contacts
    for (let i = 0; i < response.length; i++) {
      let position = new google.maps.LatLng(response[i].coordinates.latitude, response[i].coordinates.longitude);
      let marker = new google.maps.Marker({
        map: this.map,
        position: position
      });
      this.sharedContacts.push({name: response[i].username, marker: marker});
    }
    //reset old warning
    this.warning = "";
    //start updating route
    this.updateRoute();
    //update new location
    this.locationService.upload();
  }

  private handleGetLocationsError(error) {
    this.warning = "Es ist ein Fehler bei der für Sie freigegebenen Standorte aufgetreten. Bitte versuchen Sie es erneut";
    console.log(error);
  }


  /* =====================================
   CALCULATING ROUTE
   ===================================== */

  private initRoute() {
    // Create a renderer for directions and bind it to the map.
    this.directionsDisplay = new google.maps.DirectionsRenderer({map: this.map});

    // Instantiate a directions service.
    this.directionsService = new google.maps.DirectionsService;
  }

  //this function calculates the route between two markers
  private calculateRoute(fromMarker, toContact) {
    this.resetMarker();

    this.directionsService.route({
      origin: fromMarker.getPosition(),
      destination: toContact.marker.getPosition(),
      travelMode: google.maps.TravelMode.WALKING
    }, (response, status) => {
      if (status === google.maps.DirectionsStatus.OK) {

        //using zone to fix variables not updating (google service)
        this.zone.run(() => {

          //store the active route
          this.calculateRouteTo = toContact;
          this.calculateRouteTo.info =
            response.routes[0].legs[0].distance.text +
            ' - ' +
            response.routes[0].legs[0].duration.text;
        });

        //show the route
        this.directionsDisplay.setDirections(response);
      } else {
        this.warning = 'Directions request failed due to ' + status;
      }
    });
  }

  //this function recalculates the route if necessary
  private updateRoute() {
    if (this.calculateRouteTo) {
      //show if calculateRoue to is in array of shared contacts
      for (let i = 0; i < this.sharedContacts.length; i++) {
        if (this.sharedContacts[i].name === this.calculateRouteTo.name) {
          this.calculateRoute(this.ownMarker, this.sharedContacts[i]);
        }
      }
    }
  }

  //this function resets all marker from the map
  private resetMarker() {
    if (this.ownMarker) {
      this.ownMarker.setMap(null);
    }
    for (let i = 0; i < this.sharedContacts.length; i++) {
      this.sharedContacts[i].marker.setMap(null);
      this.sharedContacts[i].info = null;
    }
  }

}
