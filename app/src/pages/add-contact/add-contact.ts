import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

/*
  Generated class for the AddContact page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-add-contact',
  templateUrl: 'add-contact.html'
})
export class AddContactPage {
  private checkUserUrl = 'http://localhost:3000/checkUser/';
  private enteredUser: any;
  constructor(public navCtrl: NavController) {}

  clickCheckContact(){
    console.log(this.enteredUser);
  }

}
