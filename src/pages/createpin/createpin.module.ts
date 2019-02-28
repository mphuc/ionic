import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CreatepinPage } from './createpin';

@NgModule({
  declarations: [
    CreatepinPage,
  ],
  imports: [
    IonicPageModule.forChild(CreatepinPage),
  ],
})
export class CreatepinPageModule {}
