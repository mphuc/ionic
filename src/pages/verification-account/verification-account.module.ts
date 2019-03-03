import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VerificationAccountPage } from './verification-account';

@NgModule({
  declarations: [
    VerificationAccountPage,
  ],
  imports: [
    IonicPageModule.forChild(VerificationAccountPage),
  ],
})
export class VerificationAccountPageModule {}
