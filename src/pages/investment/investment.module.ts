import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InvestmentPage } from './investment';

@NgModule({
  declarations: [
    InvestmentPage,
  ],
  imports: [
    IonicPageModule.forChild(InvestmentPage),
  ],
})
export class InvestmentPageModule {}
