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

  @ViewChild('map') mapElement: ElementRef;
  public warning: string;
  public sharedContacts: Array<any>;
  private ownMarker;
  private map: any;
  private directionsDisplay;
  private directionsService;
  private giveAccessTo: string;

  constructor(public navCtrl: NavController, private backendService: BackendService, private zone: NgZone, private locationService: LocationService, private storage: Storage) {
    this.sharedContacts = [];

    this.initMap();
  }

  ionViewWillEnter() {
    this.updateLocation();
    this.storage.get('giveAccessTo').then((accessTo) => {
      if (accessTo) {
        this.giveAccessTo = accessTo;
      }
      else {
        this.giveAccessTo = "";
      }
    });
  }

  public clickSendLocation() {
    this.navCtrl.push(ContactsPage);
  }

  public clickUpdateLocation() {
    this.updateLocation();
  }

  public clickMarker(contact) {
    this.calculateRoute(this.ownMarker, contact);
  }

  //==========================================
  public giveAccess(contactName) {
    this.backendService.giveAccess(contactName).subscribe(
      response => this.handleGiveAccessResponse(contactName),
      error => this.handleGiveAccessError(error),
      () => console.log("Request Finished")
    );
  }

  private handleGiveAccessResponse(contactName) {
    this.storage.set('giveAccessTo', contactName);
    this.giveAccessTo = contactName;
    this.locationService.upload();
    this.updateLocation();
  }

  private handleGiveAccessError(error) {
    console.log(error);
    this.warning = "Es ist ein Fehler bei der Standortfreigabe aufgetreten. Bitte versuchen Sie es erneut";
  }

  //======================================
  private initMap() {
    let locationOptions = {
      timeout: 10000,
      enableHighAccuracy: true
    };
    Geolocation.getCurrentPosition(locationOptions).then((resp) => {
      let position = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);
      let options = {
        center: position,
        zoom: 14,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };

      this.map = new google.maps.Map(
        this.mapElement.nativeElement,
        options
      );
      this.initRoute();
    }).catch((error) => {
      console.log('Error getting location', error);
    })
  }

  private updateLocation() {
    this.resetMarker();

    let locationOptions = {
      timeout: 10000,
      enableHighAccuracy: true
    };
    Geolocation.getCurrentPosition(locationOptions).then((resp) => {
      let position = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);

      let marker = new google.maps.Marker({
        map: this.map,
        animation: google.maps.Animation.DROP,
        position: position
      });
      this.ownMarker = marker;
      this.getLocations();
    }).catch((error) => {
      console.log('Error getting location', error);
    })
  }

  // ================================================
  private getLocations() {
    this.backendService.getLocations().subscribe(
      response => this.handleGetLocationsResponse(response),
      error => this.handleGetLocationsError(error),
      () => console.log("Get Locations Request Finished")
    );
  }

  private handleGetLocationsResponse(response) {
    this.sharedContacts = [];
    for (let i = 0; i < response.length; i++) {
      let position = new google.maps.LatLng(response[i].coordinates.latitude, response[i].coordinates.longitude);
      let marker = new google.maps.Marker({
        map: this.map,
        animation: google.maps.Animation.DROP,
        position: position
      });
      this.sharedContacts.push({name: response[i].username, marker: marker});
    }
    this.warning = "";
  }

  private handleGetLocationsError(error) {
    this.warning = "Es ist ein Fehler bei der für Sie freigegebenen Standorte aufgetreten. Bitte versuchen Sie es erneut";
    console.log(error);
  }

  //=====================================

  private initRoute() {
    // Create a renderer for directions and bind it to the map.
    this.directionsDisplay = new google.maps.DirectionsRenderer({map: this.map});

    // Instantiate a directions service.
    this.directionsService = new google.maps.DirectionsService;
  }

  private calculateRoute(fromMarker, toContact) {
    this.resetMarker();

    this.directionsService.route({
      origin: fromMarker.getPosition(),
      destination: toContact.marker.getPosition(),
      travelMode: google.maps.TravelMode.WALKING
    }, (response, status) => {
      if (status === google.maps.DirectionsStatus.OK) {
        this.zone.run(() => {
          toContact.info =
            response.routes[0].legs[0].distance.text +
            ' - ' +
            response.routes[0].legs[0].duration.text;
        });
        this.directionsDisplay.setDirections(response);
      } else {
        this.warning = 'Directions request failed due to ' + status;
      }
    });
  }

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
