import {Injectable} from '@angular/core';
import {Geolocation} from 'ionic-native';
import {BackendService} from "../../../.tmp/app/Services/backendService";

@Injectable()
export class LocationService {

  constructor(private backendService: BackendService) {
  }

  public upload() {
    let locationOptions = {
      timeout: 10000,
      enableHighAccuracy: true
    };
    Geolocation.getCurrentPosition(locationOptions).then((resp) => {
      this.backendService.uploadLocation({latitude: resp.coords.latitude, longitude: resp.coords.longitude}).subscribe(
        error => console.log(error),
        () => console.log("Request Finished")
      );
    }).catch((error) => {
      console.log('Error getting location', error);
    })

  }
}
