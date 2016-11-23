import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {HomePage} from '../home/home';

import {BackendService} from "../../app/backendService";


@Component({
  selector: 'page-firststart',
  templateUrl: 'firststart.html',
  providers: [BackendService, Storage]
})
export class FirststartPage {
  private enteredUsr:any;
  public responseText: string;

  constructor(public navCtrl: NavController, private backendService: BackendService) {}

  clickNext(){
    if(this.enteredUsr) {
      // save entered user to local storage
      localStorage.setItem("username", this.enteredUsr);
      this.navCtrl.setRoot(HomePage);

      this.backendService.postNewUser(this.enteredUsr).subscribe(
        data => console.log(data),
        error => console.log(error),
        () => console.log("Request Finished")
      );
    }
    else {
      this.responseText = "Bitte Benutzername eingeben.";
    }
  }
}
