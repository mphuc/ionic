import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';

import { LoginPage } from '../pages/login/login';
import { RegisterPage } from '../pages/register/register';
import { ForgotPasswordPage } from '../pages/forgot-password/forgot-password';
import { DepositPage } from '../pages/deposit/deposit';
import { WithdrawPage } from '../pages/withdraw/withdraw';
import { ExchangePage } from '../pages/exchange/exchange';
import { ReffralPage } from '../pages/reffral/reffral';
import { UserDetailPage } from '../pages/user-detail/user-detail';
import { NotificationPage } from '../pages/notification/notification';
import { InvestmentPage } from '../pages/investment/investment';
import { TransactionHistoryPage } from '../pages/transaction-history/transaction-history';
import { SupportPage } from '../pages/support/support';
import { SettingPage } from '../pages/setting/setting';
import { LogoutPage } from '../pages/logout/logout';
import { ChangePasswordPage } from '../pages/change-password/change-password';
import { DetailWithdrawPage } from '../pages/detail-withdraw/detail-withdraw';

import { ActiveCodePage } from '../pages/active-code/active-code';
import { Network } from '@ionic-native/network';
import { Storage } from '@ionic/storage';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = TransactionHistoryPage;

  pages: Array<{title: string, component: any, icon : string}>;

  constructor(public platform: Platform, 
    public statusBar: StatusBar, 
    public splashScreen: SplashScreen,
    private network: Network,
    public alertCtrl: AlertController,
    public storage: Storage,
    ) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Dashboard', component: HomePage, icon : 'color-palette' },
      { title: 'Invetsment', component: InvestmentPage, icon : 'laptop' },
      { title: 'Reffral', component: ReffralPage, icon : 'ribbon' },
      { title: 'Depoist', component: DepositPage, icon : 'log-in' },
      { title: 'Withdraw', component: WithdrawPage, icon : 'log-out' },
      { title: 'Exchange', component: ExchangePage, icon : 'redo' },
      { title: 'Transaction History', component: TransactionHistoryPage, icon : 'filing' },
      { title: 'Support', component: SupportPage, icon : 'help-buoy' },
      { title: 'Setting', component: SettingPage, icon : 'settings' },
      { title: 'Logout', component: LogoutPage, icon : 'power' }
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      //2 back exit ap
      this.platform.ready().then(() => {
          this.platform.registerBackButtonAction(() => {
              navigator['app'].exitApp();                
          });
      });

      //check network
      if (this.network.type == "none")
      {
        let confirm = this.alertCtrl.create({
          
          message: 'We were unable to connect to the server to verify the SSL certificate. Please check your device\'s network connection before proceeding.',
          buttons: [
            {
              text: 'Exit',
              handler: () => {
                this.platform.exitApp();
              }
            } 
            
          ],

        });

        confirm.onDidDismiss(data => {
            this.platform.exitApp();
           console.log(data);
         });
        confirm.present();

      } 


      /*this.storage.get('customer_id')
      .then((customer_id) => {
        if (customer_id) {
         this.rootPage = HomePage; 
        }
        this.platformReady()
      });*/


    });
  }

  openPage(page) {
    
    this.nav.setRoot(page.component);
  }

  openLogout() {
    this.storage.remove('customer_id');
    this.nav.setRoot(LoginPage);
  }

  platformReady() {
    this.platform.ready().then(() => {
      this.splashScreen.hide();
    });
  }
}
