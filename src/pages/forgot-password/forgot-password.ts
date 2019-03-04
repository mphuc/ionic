import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';

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
	
  	constructor(
  		public navCtrl: NavController, 
  		public navParams: NavParams,
  		private alertCtrl: AlertController,
  		public loadingCtrl: LoadingController,
  		private RegisterServer: RegisterServerProvider,
  		public toastCtrl: ToastController
  	) {
  	}

  	goback() {
		this.navCtrl.setRoot(LoginPage);
	}

  	ionViewDidLoad() {
    	console.log('ionViewDidLoad ForgotPasswordPage');
  	}


  	SubmitForm() {
		
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
						message: 'Your new password is sent to your email address.',
						
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
					this.AlertToast(data.message);
				}
	        })
		}
		else
		{
			this.AlertToast('Invalid email information');
		}
		
	}

	AlertToast(message) {
	    let toast = this.toastCtrl.create({
	      message: message,
	      position: 'top',
	      duration : 3000,
	      cssClass : 'error-submitform'
	    });
	    toast.present();
  	}
}
