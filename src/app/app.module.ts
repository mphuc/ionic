import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { HttpModule } from '@angular/http';
import { MyApp } from './app.component';
import { IonicStorageModule } from '@ionic/storage';
import { HomePage } from '../pages/home/home';
import { Network } from '@ionic-native/network';



//import { ListPage } from '../pages/list/list';
import { LoginPage } from '../pages/login/login';
import { RegisterPage } from '../pages/register/register';
import { ForgotPasswordPage } from '../pages/forgot-password/forgot-password';
import { ActiveCodePage } from '../pages/active-code/active-code';
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
import { LockPage } from '../pages/lock/lock';
import { CreatepinPage } from '../pages/createpin/createpin';
import { DetailWithdrawPage } from '../pages/detail-withdraw/detail-withdraw';
import { SupportDetailPage } from '../pages/support-detail/support-detail';
import { VerificationAccountPage } from '../pages/verification-account/verification-account';
import { ProfitHistoryPage } from '../pages/profit-history/profit-history';
import { NotificationDetaiPage } from '../pages/notification-detai/notification-detai';
import { DialingPage } from '../pages/dialing/dialing';


import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Clipboard } from '@ionic-native/clipboard';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';

import { RegisterServerProvider } from '../providers/register-server/register-server';
import { DepositServerProvider } from '../providers/deposit-server/deposit-server';
import { WithdrawServerProvider } from '../providers/withdraw-server/withdraw-server';
import { ExchangeServerProvider } from '../providers/exchange-server/exchange-server';
import { ReffralServerProvider } from '../providers/reffral-server/reffral-server';
import { Camera } from '@ionic-native/camera';
import { HeaderColor } from '@ionic-native/header-color';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { FileTransfer } from '@ionic-native/file-transfer'; 
@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    RegisterPage,
    ForgotPasswordPage,
    ActiveCodePage,
    DepositPage,
    WithdrawPage,
    ExchangePage,
    ReffralPage,
    UserDetailPage,
    NotificationPage,
    InvestmentPage,
    TransactionHistoryPage,
    SupportPage,
    SettingPage,
    LogoutPage,
    ChangePasswordPage,
    LockPage,
    CreatepinPage,
    DetailWithdrawPage,
    SupportDetailPage,
    VerificationAccountPage,
    ProfitHistoryPage,
    NotificationDetaiPage,
    DialingPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    RegisterPage,
    ForgotPasswordPage,
    ActiveCodePage,
    DepositPage,
    WithdrawPage,
    ExchangePage,
    ReffralPage,
    UserDetailPage,
    NotificationPage,
    InvestmentPage,
    TransactionHistoryPage,
    SupportPage,
    SettingPage,
    LogoutPage,
    ChangePasswordPage,
    LockPage,
    CreatepinPage,
    DetailWithdrawPage,
    SupportDetailPage,
    VerificationAccountPage,
    ProfitHistoryPage,
    NotificationDetaiPage,
    DialingPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    RegisterServerProvider,
    Network,
    DepositServerProvider,
    WithdrawServerProvider,
    Clipboard,
    ExchangeServerProvider,
    ReffralServerProvider,
    BarcodeScanner,
    Camera,
    HeaderColor,
    InAppBrowser,
    FileTransfer
    
  ]
})
export class AppModule {}
