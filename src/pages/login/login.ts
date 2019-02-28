import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { NgForm } from '@angular/forms';

import { RegisterServerProvider } from '../../providers/register-server/register-server';
import { LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { HomePage } from '../home/home';
import { RegisterPage } from '../register/register';
import { ForgotPasswordPage } from '../forgot-password/forgot-password';
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
	validateform = true;
	errorlog = '';
	constructor(
		public navCtrl: NavController, 
		public navParams: NavParams,
		public loadingCtrl: LoadingController,
		private RegisterServer: RegisterServerProvider,
		public storage: Storage

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
		this.validateform = true;
		
		
		if (this.form['email'] != undefined && this.form['email'] != '' && this.form['password'] != undefined && this.form['password'] != '')
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
					this.navCtrl.setRoot(HomePage);
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
			this.errorlog = 'Invalid login information';
		}
		
	}
}
