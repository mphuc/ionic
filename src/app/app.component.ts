import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';

import { LoginPage } from '../pages/login/login';
//import { RegisterPage } from '../pages/register/register';
//import { ForgotPasswordPage } from '../pages/forgot-password/forgot-password';
import { DepositPage } from '../pages/deposit/deposit';
import { WithdrawPage } from '../pages/withdraw/withdraw';
import { ExchangePage } from '../pages/exchange/exchange';
import { ReffralPage } from '../pages/reffral/reffral';
//import { UserDetailPage } from '../pages/user-detail/user-detail';
//import { NotificationPage } from '../pages/notification/notification';
import { InvestmentPage } from '../pages/investment/investment';
import { TransactionHistoryPage } from '../pages/transaction-history/transaction-history';
import { SupportPage } from '../pages/support/support';
import { SettingPage } from '../pages/setting/setting';
//import { LogoutPage } from '../pages/logout/logout';
//import { ChangePasswordPage } from '../pages/change-password/change-password';
//import { DetailWithdrawPage } from '../pages/detail-withdraw/detail-withdraw';

import { LockPage } from '../pages/lock/lock';
//import { ActiveCodePage } from '../pages/active-code/active-code';
import { Network } from '@ionic-native/network';
import { Storage } from '@ionic/storage';
import { ReffralServerProvider } from '../providers/reffral-server/reffral-server';
import { InAppBrowser } from '@ionic-native/in-app-browser';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = HomePage;
  infomation : any = {};
  customer_id : any = '';
  versionApp : any;
  pages: Array<{title: string, component: any, icon : string}>;

  constructor(public platform: Platform, 
    public statusBar: StatusBar, 
    public splashScreen: SplashScreen,
    private network: Network,
    public alertCtrl: AlertController,
    public storage: Storage,
    public ReffralServer: ReffralServerProvider,
    private iab: InAppBrowser
    ) {

    this.versionApp = 1;
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
      { title: 'Setting', component: SettingPage, icon : 'settings' }
    ];

    this.storage.get('customer_id')
    .then((customer_id) => {
      this.ReffralServer.GetInfomationUser(customer_id)
        .subscribe((data) => {
        if (data.status == 'complete')
        {
            this.infomation['email'] =  data.email;
            this.infomation['date_added'] =  data.date_added;
            this.infomation['investment'] =  data.investment;
            this.infomation['img_profile'] =  data.img_profile;
        }
      },
      (err) => {
        if (err)
        {
          this.SeverNotLogin();
        }
      })
      
    });
    // get version

    this.ReffralServer.GetVersionApp()
      .subscribe((data) => {
      if (data)
      {
        if (parseInt(this.versionApp) < parseInt(data.version))
        {
          this.UpdateVersion();
        }  
      }
    })
    
    

  }

  initializeApp() {
    this.platform.ready().then(() => {
      
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      //2 back exit ap
      

      this.platform.registerBackButtonAction(() => {
        const confirm = this.alertCtrl.create({
        title: 'Confirm Exit?',
        message: 'Are you sure to exit the application',
        buttons: [
          {
            text: 'Cancel',
            handler: () => {
              console.log('Disagree clicked');
            }
          },
          {
            text: 'Exit',
            handler: () => {
              this.platform.exitApp();
              //navigator['app'].exitApp(); 
            }
          }
        ]
      });
      confirm.present();          
      });
      

      //check network
      if (this.network.type == "none")
      {
        let confirm = this.alertCtrl.create({
          title: 'Notification',
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
         });
        confirm.present();

      } 


      /*this.storage.get('customer_id')
      .then((customer_id) => {
        
        if (customer_id) {
          this.storage.get('StatusPinStorage')
            .then((StatusPinStorage) => {
            if (!StatusPinStorage || StatusPinStorage == 'false') {
              this.rootPage = HomePage;
            }
            else
            {
              this.rootPage = LockPage;
            }
          }); 
        }
        this.platformReady()
      });*/


    });
  }

  openPage(page) {
    
    this.nav.setRoot(page.component);
  }

  Logout_Click() {
    const confirm = this.alertCtrl.create({
      title: 'Confirm Logout?',
      message: 'Are you sure you are logged out of the account',
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'Logout',
          handler: () => {
            this.storage.remove('customer_id');
            this.storage.remove('PinStorage');
            this.storage.remove('StatusPinStorage');
            this.nav.setRoot(LoginPage);
          }
        }
      ]
    });
    confirm.present();

    
  }
  SeverNotLogin(){
      const confirm = this.alertCtrl.create({
    title: 'System maintenance',
    message: 'The system is updating. Please come back after a few minutes',
    buttons: [
    {
      text: 'Cancel',
      handler: () => {
        
      }
    },
    {
      text: 'Exit',
      handler: () => {
        this.platform.exitApp();
      }
    }
    ]
    });
    confirm.present();
  }

  UpdateVersion(){
      const confirm = this.alertCtrl.create({
    title: 'Update System',
    message: 'The latest version is available. Please update the application.',
    buttons: [
    {
      text: 'Exit',
      handler: () => {
        this.platform.exitApp();
      }
    },
    {
      text: 'Update',
      handler: () => {
        const browser = this.iab.create('https://ionicframework.com/');
      }
    }
    ]
    });
    confirm.present();
  }


    
  platformReady() {
    this.platform.ready().then(() => {
      this.splashScreen.hide();
    });
  }
}
