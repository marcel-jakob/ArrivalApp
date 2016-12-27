import {Component} from '@angular/core';
import {Platform} from 'ionic-angular';
import {StatusBar, Splashscreen} from 'ionic-native';
import {Storage} from '@ionic/storage';
import {BackendService} from "./Services/backendService";
import {HomePage} from '../pages/home/home';
import { WalkthroughPage } from '../pages/walkthrough/walkthrough';


@Component({
  template: `<ion-nav [root]="rootPage"></ion-nav>`
})
export class MyApp {
  public rootPage;

  constructor(private platform: Platform, private storage: Storage, private backendService: BackendService) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.init();
      StatusBar.styleDefault();
    });
  }

  private init() {
    this.storage.get('jwt').then((jwt) => {
      if (!jwt) {
        this.rootPage = WalkthroughPage;
        console.log("no stored jwt, navigating to firststart");
      }
      else {
        this.backendService.saveJWT(jwt);
        this.rootPage = HomePage;
        console.log("token is stored, navigating to homepage");
      }
      Splashscreen.hide();
    });
  }
}
