import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ToastController} from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { RegisterServerProvider } from '../../providers/register-server/register-server';
import { AlertController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { HomePage } from '../home/home';
import { Storage } from '@ionic/storage';
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
		private alertCtrl: AlertController,
		public toastCtrl: ToastController,
		public storage: Storage,

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
						subTitle: 'Account activated successfully.',
						cssClass : 'customer-alertctrl',
						buttons: ['Ok']
					});
					alert.present();

					alert.onDidDismiss(() => {
						this.storage.set('customer_id', data.customer_id); 
					    this.navCtrl.setRoot(HomePage);
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
			this.AlertToast('Please enter the code');
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
