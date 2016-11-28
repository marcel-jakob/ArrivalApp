import {Component} from '@angular/core';
import {NavController, ActionSheetController} from 'ionic-angular';
import {AddContactPage} from '../add-contact/add-contact';
import {Storage} from '@ionic/storage';
import {BackendService} from "../../../.tmp/app/Services/backendService";
import {LocationService} from "../../app/Services/locationService";

@Component({
  selector: 'page-contacts',
  templateUrl: 'contacts.html',
  providers: [Storage, BackendService, LocationService]
})
export class ContactsPage {
  public contacts: Array<any>;
  public notification: string;
  public giveAccessTo: string;

  constructor(private locationService: LocationService, private navCtrl: NavController, private backendService: BackendService, private storage: Storage, private actionSheetCtrl: ActionSheetController) {

  }
  ionViewDidEnter() {
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

  clickAddContact() {
    this.navCtrl.push(AddContactPage);
  }
  clickContact(contactName){
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Kontakt: '+contactName,
      buttons: [
        {
          text: 'Standort freigeben',
          handler: () => {
            this.giveAccess(contactName);
          }
        },{
          text: 'Abbrechen',
          role: 'cancel'
        }
      ]
    });
    actionSheet.present();
  }
  giveAccess(contactName){
    this.backendService.giveAccess(contactName).subscribe(
      response => this.handleResponse(contactName),
      error => this.handleError(error),
      () => console.log("Request Finished")
    );
  }

  handleResponse(contactName){
    this.storage.set('giveAccessTo', contactName);
    this.giveAccessTo = contactName;
    this.locationService.upload();
  }

  handleError(error){
    console.log(error);
    this.notification = "Es ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut";
  }
}
