import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {AddContactPage} from '../add-contact/add-contact';
import {Storage} from '@ionic/storage';

@Component({
  selector: 'page-contacts',
  templateUrl: 'contacts.html',
  providers: [Storage]
})
export class ContactsPage {
  private contacts: Array<any>;
  private notification: string;

  constructor(private navCtrl: NavController, private storage: Storage) {

  }
  ionViewDidEnter() {
    this.storage.get('contacts').then((contactList) => {
      if (contactList) {
        this.contacts = contactList;
        this.notification = "";
      }
      else {
        this.notification = "Keine Kontakte gefunden.";
      }
    });
  }

  clickAddContact() {
    this.navCtrl.push(AddContactPage);
  }
}
