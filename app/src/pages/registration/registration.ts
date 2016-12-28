import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {Storage} from '@ionic/storage';
import {BackendService} from "../../app/Services/backendService";
import {HomePage} from "../home/home";

/*
 Generated class for the Registration page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
  selector: 'page-registration',
  templateUrl: 'registration.html'
})
export class RegistrationPage {
  public enteredPassword: string;
  public enteredPasswordAgain: string;
  public responseText: string;
  private newUsername: string;

  constructor(private navCtrl: NavController, private backendService: BackendService, private navParams: NavParams, private storage: Storage) {
    this.newUsername = navParams.get("newUsername");
  }

  public clickRegistration() {
    if(!this.enteredPassword){
      this.responseText = "Bitte geben Sie ein Passwort ein";
    }
    else if (this.enteredPassword === this.enteredPasswordAgain) {
      this.backendService.postNewUser(this.newUsername, this.enteredPassword).subscribe(
        data => this.handleResponse(data),
        error => this.handleError(error),
        () => console.log("Request Finished")
      );
    }
    else {
      this.responseText = "Die Passwörter stimmen nicht überein";
    }
  }

  private handleResponse(data) {
    this.responseText = "Ein neuer Benutzer wurde angelegt.";
    this.backendService.saveJWT(data.jwt);
    this.storage.set('jwt', data.jwt).then(() => {
      this.navCtrl.setRoot(HomePage);
    });
  }

  private handleError(error) {
    console.log(error);
    this.responseText = "Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.";
  }
}
