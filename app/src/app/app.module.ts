import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ContactsPage } from '../pages/contacts/contacts';
import { FirststartPage } from '../pages/firststart/firststart';
import { AddContactPage } from "../pages/add-contact/add-contact";
import { LoginPage } from "../pages/login/login";
import { RegistrationPage } from "../pages/registration/registration";
import { WalkthroughPage } from "../pages/walkthrough/walkthrough";
import { BackendService } from "./Services/backendService";
import { Storage } from '@ionic/storage';
import { LocationService } from "./Services/locationService";
import { MapService } from './Services/mapService';


@NgModule( {
  declarations   : [
    MyApp,
    HomePage,
    ContactsPage,
    FirststartPage,
    AddContactPage,
    LoginPage,
    RegistrationPage,
    WalkthroughPage
  ],
  imports        : [
    IonicModule.forRoot( MyApp )
  ],
  bootstrap      : [ IonicApp ],
  entryComponents: [
    MyApp,
    HomePage,
    ContactsPage,
    FirststartPage,
    AddContactPage,
    LoginPage,
    RegistrationPage,
    WalkthroughPage
  ],
  providers      : [
    MapService,
    LocationService,
    BackendService,
    Storage,
    {
      provide : ErrorHandler,
      useClass: IonicErrorHandler
    }
  ]
} )
export class AppModule {
}
