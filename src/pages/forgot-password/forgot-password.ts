import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { LoginPage } from '../login/login';
import { AlertController } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { RegisterServerProvider } from '../../providers/register-server/register-server';
/**
 * Generated class for the ForgotPasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-forgot-password',
  templateUrl: 'forgot-password.html',
})
export class ForgotPasswordPage {
	form = {};
	validateform = true;
	errorlog = '';
  	constructor(
  		public navCtrl: NavController, 
  		public navParams: NavParams,
  		private alertCtrl: AlertController,
  		public loadingCtrl: LoadingController,
  		private RegisterServer: RegisterServerProvider
  	) {
  	}

  	goback() {
		this.navCtrl.setRoot(LoginPage);
	}

  	ionViewDidLoad() {
    	console.log('ionViewDidLoad ForgotPasswordPage');
  	}


  	SubmitForm() {
		this.validateform = true;
		
		
		if (this.form['email'] != undefined && this.form['email'] != '')
		{
			
			let loading = this.loadingCtrl.create({
			    content: 'Please wait...'
		  	});

		  	loading.present();

			this.RegisterServer.ForgotPassword(this.form['email'])
	        .subscribe((data) => {
				if (data.status == 'complete')
				{
					loading.dismiss();
					let alert = this.alertCtrl.create({
						title: 'Notification',
						subTitle: 'We have sent a link to your email. Please click on the link in the email to get the password.',
						cssClass : 'customer-alertctrl',
						buttons: ['Ok']
					});
					alert.present();

					alert.onDidDismiss(() => {
					    this.navCtrl.setRoot(LoginPage);
				  	});
				}
				else
				{
					loading.dismiss();
					this.validateform = false;
					this.errorlog = data.message;
				}
	        })
		}
		else
		{
			this.validateform = false;
			this.errorlog = 'Invalid email information';
		}
		
	}
}