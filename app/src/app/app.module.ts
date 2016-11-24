import {NgModule} from '@angular/core';
import {IonicApp, IonicModule} from 'ionic-angular';
import {MyApp} from './app.component';
import {HomePage} from '../pages/home/home';
import {ContactsPage} from '../pages/contacts/contacts';
import {FirststartPage} from '../pages/firststart/firststart';
import {AddContactPage} from "../pages/add-contact/add-contact";
import {LoginPage} from "../../.tmp/pages/login/login";
import {RegistrationPage} from "../../.tmp/pages/registration/registration";
import {BackendService} from "./Services/backendService";
import {Storage} from '@ionic/storage';


@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ContactsPage,
    FirststartPage,
    AddContactPage,
    LoginPage,
    RegistrationPage
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ContactsPage,
    FirststartPage,
    AddContactPage,
    LoginPage,
    RegistrationPage
  ],
  providers: [BackendService, Storage]
})
export class AppModule {
}
