import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ContactsPage } from '../pages/contacts/contacts';
import { FirststartPage } from '../pages/firststart/firststart';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ContactsPage,
    FirststartPage
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ContactsPage,
    FirststartPage
  ],
  providers: []
})
export class AppModule {}
