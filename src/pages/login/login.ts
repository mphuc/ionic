import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,Platform ,AlertController} from 'ionic-angular';

import { RegisterServerProvider } from '../../providers/register-server/register-server';
import { LoadingController,ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { HomePage } from '../home/home';
import { RegisterPage } from '../register/register';
import { ForgotPasswordPage } from '../forgot-password/forgot-password';
import { ActiveCodePage } from '../active-code/active-code';
/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
	form = {};
	constructor(
		public navCtrl: NavController, 
		public navParams: NavParams,
		public loadingCtrl: LoadingController,
		private RegisterServer: RegisterServerProvider,
		public storage: Storage,
		public toastCtrl: ToastController,
		public platform: Platform,
		public alertCtrl: AlertController,

		) {
	}

	ionViewDidLoad() {
		
		console.log('ionViewDidLoad LoginPage');
	}

	onSignup() {
		this.navCtrl.setRoot(RegisterPage);
	}
	onForgotpassword() {
		this.navCtrl.setRoot(ForgotPasswordPage);
	}

	SubmitForm() {
		
		
		if (this.form['email'] == undefined || this.form['email'] == '')
		{
			this.AlertToast('Please enter your login email');
		}
		else
		{
			if (this.form['password'] == undefined || this.form['password'] == '')
			{
				this.AlertToast('Please enter your login password');
			}
			else
			{	
				let loading = this.loadingCtrl.create({
				    content: 'Please wait...'
			  	});

			  	loading.present();

				this.RegisterServer.Login(this.form['email'],this.form['password'])

		        .subscribe((data) => {
		        	
					if (data.status == 'complete')
					{
						loading.dismiss();
						this.storage.set('customer_id', data.customer_id); 

						let toast = this.toastCtrl.create({
							message: 'Logged in successfully',
							position: 'top',
							duration : 2000,
							cssClass : 'alert_success'
						});
						toast.present();

						this.navCtrl.setRoot(HomePage);
					}
					else
					{
						if (data.status = 'error_active_email')
						{
							this.storage.set('customer_id', data.customer_id); 
							this.storage.set('active_code', 'not-active'); 
							this.navCtrl.push(ActiveCodePage);
						}
						loading.dismiss();
						this.AlertToast(data.message);
					}
		        },
		        (err) => {
		        	if (err)
		        	{
		        		loading.dismiss();
		        		this.SeverNotLogin();
		        	}
		        })
			}
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
}
