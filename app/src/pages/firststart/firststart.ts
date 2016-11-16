import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

/*
  Generated class for the Firststart page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-firststart',
  templateUrl: 'firststart.html'
})
export class FirststartPage {

  constructor(public navCtrl: NavController) {}

  ionViewDidLoad() {
    console.log('Hello FirststartPage Page');
  }

}
