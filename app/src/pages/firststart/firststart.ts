import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {HomePage} from '../home/home';

@Component({
  selector: 'page-firststart',
  templateUrl: 'firststart.html'
})
export class FirststartPage {
  enteredUsr:any;

  constructor(public navCtrl: NavController) {
    if(localStorage.getItem("username")){
      this.navCtrl.setRoot(HomePage);
    }
  }

  ionViewDidLoad() {
    //console.log("username is: " + localStorage.getItem("username"));
  }

  clickNext(){
    if(this.enteredUsr != null) {
      // save entered user to local storage
      localStorage.setItem("username", this.enteredUsr);
      this.navCtrl.push(HomePage);
    }
  }
}
