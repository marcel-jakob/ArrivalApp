import {Component, ViewChild, ElementRef} from '@angular/core';
import {NavController, Platform} from 'ionic-angular';
import {ContactsPage} from '../contacts/contacts';
import {FirststartPage} from '../firststart/firststart';
import {Geolocation} from 'ionic-native';
import {Storage} from '@ionic/storage';
import {BackendService} from "../../app/Services/backendService";


declare let google;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {

  @ViewChild('map') mapElement: ElementRef;
  private markers: Array<any>;
  private map: any;
  public notification: string;

  constructor(public navCtrl: NavController, private storage: Storage, private backendService: BackendService, private platform: Platform) {
    this.markers = [];
    this.platform.ready().then(() => {
      this.init();
    });
  }
  ionViewWillEnter() {
    this.updateLocation();
  }
  private init() {
      this.storage.get('jwt').then((jwt) => {
        if (!jwt) {
          this.navCtrl.setRoot(FirststartPage);
          console.log("no stored jwt, navigating to firststart");
        }
        else {
          console.log("token is stored, staying on homepage");
          this.updateLocation();
        }
      });
  }

  private updateLocation(){
    let locationOptions = {
      timeout: 10000,
      enableHighAccuracy: true
    };
    Geolocation.getCurrentPosition(locationOptions).then((resp) => {
      let position = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);
      let options = {
        center: position,
        zoom: 13,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };

      this.map = new google.maps.Map(
        this.mapElement.nativeElement,
        options
      );
      let marker = new google.maps.Marker({
        map: this.map,
        animation: google.maps.Animation.DROP,
        position: position
      });
      this.markers.push(marker);
      this.getLocations();
    }).catch((error) => {
      console.log('Error getting location', error);
    })
  }

  private getLocations() {
    this.backendService.getLocations().subscribe(
      response => this.handleResponse(response),
      error => this.handleError(error),
      () => console.log("Request Finished")
    );
  }

  private handleResponse(response) {
    if (response) {
      for(let i=0;i<response.length;i++){
        let position = new google.maps.LatLng(response[i].coordinates.latitude, response[i].coordinates.longitude);
        let marker = new google.maps.Marker({
          map: this.map,
          animation: google.maps.Animation.DROP,
          position: position
        });
        this.markers.push(marker);
      }
    }
    else {
      this.notification = "Es sind keine Standorte für dich freigegeben.";
    }
  }

  private handleError(error) {
    this.notification = "Es ist ein Fehler bei der für Sie freigegebenen Standorte aufgetreten. Bitte versuchen Sie es erneut";
    console.log(error);
  }

  public clickSendLocation() {
    this.navCtrl.push(ContactsPage);
  }
  public clickUpdateLocation() {
    this.updateLocation();
  }

}
