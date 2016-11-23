import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {BackendService} from "../../app/Services/backendService";
import {Storage} from '@ionic/storage';

/*
 Generated class for the AddContact page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
  selector: 'page-add-contact',
  templateUrl: 'add-contact.html',
  providers: [BackendService, Storage]
})
export class AddContactPage {
  public enteredUser: any;
  public responseText: string;

  constructor(private navCtrl: NavController, private backendService: BackendService, private storage: Storage) {
  }

  public clickCheckContact() {
    if (this.enteredUser) {
      this.backendService.getCheckUser(this.enteredUser).subscribe(
        data => this.handleResponse(data, this.enteredUser),
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
      this.addToContactlist(username)
    }
    else {
      this.responseText = "Kein Nutzer mit dem Namen " + this.enteredUser + " gefunden";
    }
  }


  private addToContactlist(username) {
    this.storage.get('contacts').then((contactList) => {
      let newContactList = [];
      if (contactList) {
        newContactList = contactList;
      }

      let duplicatedUser = newContactList.filter(contact => contact.name === username);

      if (duplicatedUser.length === 0) {
        newContactList.push({"name":username});
        this.storage.set('contacts', newContactList);
        this.responseText = "Der Nutzer wurde gefunden und zu Ihren Kontakten hinzugefügt.";
        this.navCtrl.pop();
      }
      else {
        this.responseText = "Der Nutzer ist bereits Ihr Kontakt.";
      }
    });
  }

}
