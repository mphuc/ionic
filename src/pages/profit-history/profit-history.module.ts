import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProfitHistoryPage } from './profit-history';

@NgModule({
  declarations: [
    ProfitHistoryPage,
  ],
  imports: [
    IonicPageModule.forChild(ProfitHistoryPage),
  ],
})
export class ProfitHistoryPageModule {}
