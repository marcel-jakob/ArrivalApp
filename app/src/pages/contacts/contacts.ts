import { Component } from '@angular/core';
import { NavController, ActionSheetController } from 'ionic-angular';
import { AddContactPage } from '../add-contact/add-contact';
import { Storage } from '@ionic/storage';
import { LocationService } from "../../app/Services/locationService";
import { BackendService } from "../../app/Services/backendService";

@Component( {
  selector   : 'page-contacts',
  templateUrl: 'contacts.html'
} )
export class ContactsPage {
  public contacts: Array<any>;
  public warning: string;
  public giveAccessTo;

  constructor ( private locationService: LocationService, private navCtrl: NavController,
                private backendService: BackendService, private storage: Storage,
                private actionSheetCtrl: ActionSheetController ) {
    this.giveAccessTo = locationService.giveAccessTo;
  }

  ionViewWillEnter () {
    this.storage.get( 'contacts' )
      .then( ( contactList ) => {
        if ( contactList ) {
          this.contacts = contactList;
          this.warning = "";
        } else {
          this.warning = "Keine Kontakte gefunden.";
        }
      } );
  }

  public clickAddContact () {
    this.navCtrl.push( AddContactPage );
  }

  public clickContact ( contactName ) {
    let buttons;
    if ( this.giveAccessTo.username === contactName ) {
      buttons = [
        {
          text   : 'Standort nicht mehr freigeben',
          handler: () => {
            this.clickRemoveAccess();
          }
        },
        {
          text: 'Abbrechen',
          role: 'cancel'
        }
      ]
    } else {
      buttons = [
        {
          text   : 'Standort freigeben',
          handler: () => {
            this.clickGiveAccess( contactName );
          }
        },
        {
          text: 'Abbrechen',
          role: 'cancel'
        }
      ]
    }
    let actionSheet = this.actionSheetCtrl.create( {
      title  : 'Kontakt: ' + contactName,
      buttons: buttons
    } );
    actionSheet.present();
  }


  /* =====================================
   GIVE OR REMOVE ACCESS to contacts
   ===================================== */
  //give access
  public clickGiveAccess ( contactName ) {
    this.backendService.giveAccessTo( contactName )
      .subscribe( response => this.handleGiveAccessResponse( contactName ),
        error => this.handleGiveAccessError( error ) );
  }

  private handleGiveAccessResponse ( contactName ) {
    this.giveAccessTo.username = contactName;
  }

  private handleGiveAccessError ( error ) {
    console.log( error );
    this.warning = "Es ist ein Fehler bei der Standortfreigabe aufgetreten. Bitte versuchen Sie es erneut";
  }

  //remove access
  public clickRemoveAccess () {
    this.backendService.removeAccess()
      .subscribe( response => this.handleRemoveAccessResponse(), error => this.handleRemoveAccessError( error ) );
  }

  private handleRemoveAccessResponse () {
    this.giveAccessTo.username = "";
  }

  private handleRemoveAccessError ( error ) {
    console.log( error );
    this.warning = "Es ist ein Fehler bei der Standortfreigabe aufgetreten. Bitte versuchen Sie es erneut";
  }

}
