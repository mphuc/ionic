import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DialingPage } from './dialing';

@NgModule({
  declarations: [
    DialingPage,
  ],
  imports: [
    IonicPageModule.forChild(DialingPage),
  ],
})
export class DialingPageModule {}
