import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import { FirststartPage } from '../firststart/firststart';

@Component({
  selector: 'page-walkthrough',
  templateUrl: 'walkthrough.html'
})
export class WalkthroughPage {

  constructor(public navCtrl: NavController) {
  }

  clickNext() {
    this.navCtrl.push(FirststartPage);
  }
}
