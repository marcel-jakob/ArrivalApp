import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {Storage} from '@ionic/storage';
import {BackendService} from "../../app/Services/backendService";

/*
 Generated class for the Registration page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
  selector: 'page-registration',
  templateUrl: 'registration.html',
  providers: [BackendService, Storage]
})
export class RegistrationPage {
  public enteredPassword: string;
  public enteredPasswordAgain: string;
  public responseText: string;

  constructor(private navCtrl: NavController, private backendService: BackendService) {
  }

  public clickNext() {
    /*if (this.enteredPassword) {
     this.backendService.getCheckUser(this.enteredPassword).subscribe(
     data => this.handleResponse(data, this.enteredPassword),
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
     }
     else {
     }
     }*/
  }
}
