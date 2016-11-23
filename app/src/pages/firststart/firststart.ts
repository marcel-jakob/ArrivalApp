import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {BackendService} from "../../app/Services/backendService";
import {LoginPage} from "../login/login";
import {RegistrationPage} from "../registration/registration";

@Component({
  selector: 'page-firststart',
  templateUrl: 'firststart.html',
  providers: [BackendService]
})
export class FirststartPage {
  public enteredUser: string;
  public responseText: string;

  constructor(public navCtrl: NavController, private backendService: BackendService) {
  }

  clickNext() {
    if (this.enteredUser) {
      this.backendService.getCheckUser(this.enteredUser).subscribe(
        response => this.handleResponse(response, this.enteredUser),
        error => console.log(error),
        () => console.log("Request Finished")
      );
    }
    else {
      this.responseText = "Bitte Benutzername eingeben.";
    }
  }

  private handleResponse(response, username) {
    //210 => user exists
    if (response === 210) {
      this.navCtrl.push(LoginPage, {
        newUsername: username
      });
    }
    //220 => user not found
    else if(response === 220){
      this.navCtrl.push(RegistrationPage, {
        newUsername: username
      });
    }
    else{
      this.responseText = "Es ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut."
    }
  }
}
