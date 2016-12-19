import { Component } from '@angular/core';
import { NavController, Events } from 'ionic-angular';
import { BackendService } from "../../app/Services/backendService";
import { Storage } from '@ionic/storage';

/*
 Generated class for the AddContact page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component( {
  selector   : 'page-add-contact',
  templateUrl: 'add-contact.html'
} )
export class AddContactPage {
  public enteredUser: any;
  public responseText: string;

  constructor ( private navCtrl: NavController, private backendService: BackendService, private storage: Storage,
                private events: Events ) {
  }

  public clickCheckContact () {
    if ( this.enteredUser ) {
      this.backendService.getCheckUser( this.enteredUser )
        .subscribe( response => this.handleResponse( response, this.enteredUser ), error => this.handleError( error ) );
    } else {
      this.responseText = "Bitte Benutzername eingeben.";
    }
  }

  private handleResponse ( response, username ) {
    //210 => user exists
    if ( response === 210 ) {
      this.addToContactlist( username );
    }
    //220 => user not found
    else if ( response === 220 ) {
      this.responseText = "Kein Nutzer mit dem Namen " + this.enteredUser + " gefunden";
    } else {
      this.events.publish( "userNotification", {
        text : "Es ist ein Fehler beim Hinzufügen eines Kontaktes aufgetreten. Bitte sorgen Sie für eine aktive Internetverbindung und versuchen Sie es erneut.",
        color: "danger"
      } );
      this.navCtrl.popToRoot();
    }
  }

  private handleError ( error ) {
    console.log( error );
    this.events.publish( "userNotification", {
      text : "Es ist ein Fehler beim Hinzufügen eines Kontaktes aufgetreten. Bitte sorgen Sie für eine aktive Internetverbindung und versuchen Sie es erneut.",
      color: "danger"
    } );
    this.navCtrl.popToRoot();
  }


  private addToContactlist ( username ) {
    this.storage.get( 'contacts' )
      .then( ( contactList ) => {
        let newContactList = [];
        if ( contactList ) {
          newContactList = contactList;
        }

        let duplicatedUser = newContactList.filter( contact => contact.username === username );

        if ( duplicatedUser.length === 0 ) {
          newContactList.push( { "username": username } );
          this.storage.set( 'contacts', newContactList );
          this.responseText = "Der Nutzer wurde gefunden und zu Ihren Kontakten hinzugefügt.";
          this.navCtrl.pop();
        } else {
          this.responseText = "Der Nutzer ist bereits Ihr Kontakt.";
        }
      } );
  }
}
