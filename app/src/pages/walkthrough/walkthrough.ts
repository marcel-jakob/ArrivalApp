import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { FirststartPage } from '../firststart/firststart';

@Component( {
  selector   : 'page-walkthrough',
  templateUrl: 'walkthrough.html'
} )
export class WalkthroughPage {
  public mySlideOptions;

  constructor ( public navCtrl: NavController ) {
    this.mySlideOptions = {
      autoplay: 7000,
      pager   : true
    };
  }

  clickNext () {
    this.navCtrl.push( FirststartPage );
  }
}
