import {Component, ViewChild, ElementRef} from '@angular/core';
import {NavController, Platform} from 'ionic-angular';
import {ContactsPage} from '../contacts/contacts';
import {Geolocation} from 'ionic-native';

declare var google;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {

  @ViewChild('map') mapElement: ElementRef;
  map: any;

  constructor(public navCtrl: NavController, platform: Platform) {
    platform.ready().then(() => {
      this.loadMap();
    });
  }

  ionViewDidLoad() {
  }

  loadMap() {
    console.log("load map");
    Geolocation.getCurrentPosition().then((position) => {
      console.log("location received");
      console.log(position);
      let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

      let mapOptions = {
        center: latLng,
        zoom: 13,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };

      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

    }, (err) => {
      console.log(err);
    });

  }

  clickSendLocation() {
    this.navCtrl.push(ContactsPage);
  }

  clickAddMarker() {

    new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: this.map.getCenter()
    });

  }

}
