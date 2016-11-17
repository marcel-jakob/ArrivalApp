import {Component, ViewChild, ElementRef} from '@angular/core';
import {NavController, Platform} from 'ionic-angular';
import {ContactsPage} from '../contacts/contacts';
import {FirststartPage} from '../firststart/firststart';
import {Geolocation} from 'ionic-native';


declare var google;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {

  @ViewChild('map') mapElement: ElementRef;
  map: any;
  private platform: Platform;
  private marker: any;

  constructor(public navCtrl: NavController, platform: Platform) {
    this.platform = platform;
    this.loadMap();

    if(!localStorage.getItem("username")) {
      this.navCtrl.setRoot(FirststartPage);
    }
  }

  ionViewDidLoad() {
    if(localStorage.getItem("username")) {
      console.log("username is: " + localStorage.getItem("username"));
    }
  }

  loadMap() {
    this.platform.ready().then(() => {

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
        this.marker = new google.maps.Marker({
          map: this.map,
          animation: google.maps.Animation.DROP,
          position: position
        });
      }).catch((error) => {
        console.log('Error getting location', error);
      })

    })
  }

  clickSendLocation() {
    this.navCtrl.push(ContactsPage);
  }

}
