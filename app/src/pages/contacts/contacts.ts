import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {AddContactPage} from '../add-contact/add-contact';

@Component({
  selector: 'page-contacts',
  templateUrl: 'contacts.html'
})
export class ContactsPage {

  constructor(public navCtrl: NavController) {
  }

  clickAddContact() {
    this.navCtrl.push(AddContactPage);
  }
}
