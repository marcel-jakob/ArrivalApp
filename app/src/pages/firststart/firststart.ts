import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {BackendService} from "../../app/Services/backendService";
import {Storage} from '@ionic/storage';
import {LoginPage} from "../login/login";
import {RegistrationPage} from "../registration/registration";

@Component({
  selector: 'page-firststart',
  templateUrl: 'firststart.html',
  providers: [BackendService, Storage]
})
export class FirststartPage {
  public enteredUsr: string;
  public responseText: string;

  constructor(public navCtrl: NavController, private backendService: BackendService) {
  }

  clickNext() {
    /*if (this.enteredUsr != null) {
      // save entered user to local storage
      localStorage.setItem("username", this.enteredUsr);
      this.navCtrl.setRoot(HomePage);
    }*/
    if (this.enteredUsr) {
      this.backendService.getCheckUser(this.enteredUsr).subscribe(
        data => this.handleResponse(data, this.enteredUsr),
        error => console.log(error),
        () => console.log("Request Finished")
      );
    }
    else {
      this.responseText = "Bitte Benutzername eingeben.";
    }
  }

  private handleResponse(data, username) {
    if (data.userExists) {
      this.navCtrl.push(LoginPage);
    }
    else {
      this.navCtrl.push(RegistrationPage);
    }
  }
}
