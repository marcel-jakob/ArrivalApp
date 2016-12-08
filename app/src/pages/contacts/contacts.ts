import {Component} from '@angular/core';
import {NavController, ActionSheetController} from 'ionic-angular';
import {AddContactPage} from '../add-contact/add-contact';
import {Storage} from '@ionic/storage';
import {LocationService} from "../../app/Services/locationService";
import {BackendService} from "../../app/Services/backendService";

@Component({
  selector: 'page-contacts',
  templateUrl: 'contacts.html'
})
export class ContactsPage {
  public contacts: Array<any>;
  public notification: string;
  public giveAccessTo: string;

  constructor(private locationService: LocationService, private navCtrl: NavController, private backendService: BackendService, private storage: Storage, private actionSheetCtrl: ActionSheetController) {

  }

  ionViewWillEnter() {
    this.storage.get('contacts').then((contactList) => {
      if (contactList) {
        this.contacts = contactList;
        this.notification = "";
        this.storage.get('giveAccessTo').then((accessTo) => {
          if (accessTo) {
            this.giveAccessTo = accessTo;
          }
          else {
            this.giveAccessTo = "";
          }
        });
      }
      else {
        this.notification = "Keine Kontakte gefunden.";
      }
    });
  }

  public clickAddContact() {
    this.navCtrl.push(AddContactPage);
  }

  public clickContact(contactName) {
    let buttons;
    if (this.giveAccessTo === contactName) {
      buttons = [
        {
          text: 'Standort nicht mehr freigeben',
          handler: () => {
            this.removeAccess();
          }
        }, {
          text: 'Abbrechen',
          role: 'cancel'
        }
      ]
    }
    else {
      buttons = [
        {
          text: 'Standort freigeben',
          handler: () => {
            this.giveAccess(contactName);
          }
        }, {
          text: 'Abbrechen',
          role: 'cancel'
        }
      ]
    }
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Kontakt: ' + contactName,
      buttons: buttons
    });
    actionSheet.present();
  }

  private giveAccess(contactName) {
    this.backendService.giveAccess(contactName).subscribe(
      response => this.handleGiveAccessResponse(contactName),
      error => this.handleGiveAccessError(error),
      () => console.log("Request Finished")
    );
  }

  private handleGiveAccessResponse(contactName) {
    this.storage.set('giveAccessTo', contactName);
    this.giveAccessTo = contactName;
    this.locationService.upload();
  }

  private handleGiveAccessError(error) {
    console.log(error);
    this.notification = "Es ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut";
  }

  private removeAccess() {
    this.backendService.removeAccess().subscribe(
      response => this.handleRemoveAccessResponse(),
      error => this.handleRemoveAccessError(error),
      () => console.log("Request Finished")
    );
  }

  private handleRemoveAccessResponse() {
    this.storage.set('giveAccessTo', "");
    this.giveAccessTo = "";
  }

  private handleRemoveAccessError(error) {
    console.log(error);
    this.notification = "Es ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut";
  }

}
