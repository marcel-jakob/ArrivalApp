import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {BackendService} from "../../app/Services/backendService";
import {HomePage} from "../home/home";
import {Storage} from '@ionic/storage';

/*
 Generated class for the Login page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  public enteredPassword: string;
  public responseText: string;
  private newUsername: string;

  constructor(public navCtrl: NavController, private backendService: BackendService, private navParams: NavParams, private storage: Storage) {
    this.newUsername = navParams.get("newUsername");
  }

  public clickLogin() {
    if (!this.enteredPassword) {
      this.responseText = "Bitte geben Sie ein Passwort ein";
    }
    else {
      this.backendService.postLoginUser(this.newUsername, this.enteredPassword).subscribe(
        data => this.handleResponse(data, this.newUsername),
        error => this.handleError(error),
        () => console.log("Request Finished")
      );
    }
  }

  private handleResponse(data, username) {
    this.responseText = "Sie haben sich erfolgreich eingeloggt.";
    this.storage.set('jwt', data.jwt).then(() => {
      this.navCtrl.setRoot(HomePage);
      this.backendService.updateJWT();
    });
  }

  private handleError(error) {
    console.log(error);
    if (error.status === 403) {
      this.responseText = "Das eingegebene Passwort ist falsch.";
    }
    else {
      this.responseText = "Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.";
    }
  }
}
