import {Component, ViewChild, ElementRef} from '@angular/core';
import {NavController, Platform} from 'ionic-angular';
import {ContactsPage} from '../contacts/contacts';
import {FirststartPage} from '../firststart/firststart';
import {Geolocation} from 'ionic-native';
import {Storage} from '@ionic/storage';
import {BackendService} from "../../../.tmp/app/Services/backendService";


declare var google;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [BackendService, Storage]
})

export class HomePage {

  @ViewChild('map') mapElement: ElementRef;
  private markers: Array<any>;
  private map: any;
  public notification: string;

  constructor(public navCtrl: NavController, private platform: Platform, private storage: Storage, private backendService: BackendService) {
    this.markers = [];
    this.storage.get('jwt').then((jwt) => {
      if(!jwt){
        this.navCtrl.setRoot(FirststartPage);
      }
      else{
        this.platform = platform;
        this.loadMap();
      }
    });
  }

  private loadMap() {
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
        var marker = new google.maps.Marker({
          map: this.map,
          animation: google.maps.Animation.DROP,
          position: position
        });
        this.markers.push(marker);

        this.getLocations();
      }).catch((error) => {
        console.log('Error getting location', error);
      })

    })
  }

  private getLocations() {
    this.backendService.getLocations().subscribe(
      response => this.handleResponse(response),
      error => this.handleError(error),
      () => console.log("Request Finished")
    );
  }
  private handleResponse(response){
    response = [
      {
        "username":"Christoph",
        "coordinates": {
          "latitude": 48.865609,
          "longitude": 9.187429
        }
      },{
        "username":"Marcel",
        "coordinates": {
          "latitude": 48.863609,
          "longitude": 9.187429
        }
      }
    ];
    let position = new google.maps.LatLng(response[0].coordinates.latitude, response[0].coordinates.longitude);
    var marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: position
    });
    this.markers.push(marker);
    if(!response){
      this.notification="Es sind keine Standorte für dich freigegeben.";
    }
  }

  private handleError(error){
    this.notification="Es ist ein Fehler bei der für Sie freigegebenen Standorte aufgetreten. Bitte versuchen Sie es erneut";
    console.log(error);
  }

  public clickSendLocation() {
    this.navCtrl.push(ContactsPage);
  }

}
