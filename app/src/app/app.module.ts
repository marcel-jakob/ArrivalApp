import {NgModule} from '@angular/core';
import {IonicApp, IonicModule} from 'ionic-angular';
import {MyApp} from './app.component';
import {HomePage} from '../pages/home/home';
import {ContactsPage} from '../pages/contacts/contacts';
import {FirststartPage} from '../pages/firststart/firststart';
import {AddContactPage} from "../pages/add-contact/add-contact";
import {BackendService} from "../pages/add-contact/backendService";


@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ContactsPage,
    FirststartPage,
    AddContactPage
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
    AddContactPage
  ],
  providers: [BackendService, Storage]
})
export class AppModule {
}
