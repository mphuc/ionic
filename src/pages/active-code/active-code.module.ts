import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ActiveCodePage } from './active-code';

@NgModule({
  declarations: [
    ActiveCodePage,
  ],
  imports: [
    IonicPageModule.forChild(ActiveCodePage),
  ],
})
export class ActiveCodePageModule {}
