import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { RegisterServerProvider } from '../../providers/register-server/register-server';
import { AlertController } from 'ionic-angular';
import { LoginPage } from '../login/login';
/**
 * Generated class for the ActiveCodePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-active-code',
  templateUrl: 'active-code.html',
})
export class ActiveCodePage {
	form = {};
	validateform = true;
	errorlog = '';
	constructor(
		public navCtrl: NavController, 
		public navParams: NavParams,
		public loadingCtrl: LoadingController,
		private RegisterServer: RegisterServerProvider,
		private alertCtrl: AlertController

	) {

	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad ActiveCodePage');
	}


	SubmitForm() {
		this.validateform = true;
		
		if (this.form['code'] != undefined && this.form['code'] != '')
		{
			
			let loading = this.loadingCtrl.create({
			    content: 'Please wait...'
		  	});

		  	loading.present();

		  	let email = this.navParams.get("email");
		  	
			this.RegisterServer.ActiveCode(this.form['code'],email)
	        .subscribe((data) => {
				if (data.status == 'complete')
				{
					loading.dismiss();
					let alert = this.alertCtrl.create({
						title: 'Notification',
						subTitle: 'Account activated successfully. Please login to use.',
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
			this.errorlog = 'Please enter the code';
		}
		
	}


	onResendCode(){
		let email = this.navParams.get("email");
		let loading = this.loadingCtrl.create({
		    content: 'Please wait...'
	  	});

	  	loading.present();
		this.RegisterServer.ResendCode(email)
        .subscribe((data) => {
			if (data.status == 'complete')
			{
				loading.dismiss();
				
			}
			else
			{
				loading.dismiss();
				this.validateform = false;
				this.errorlog = 'Error Network';
			}
        })
	}

}
