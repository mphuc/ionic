import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams , ToastController,AlertController,Platform} from 'ionic-angular';
import { SettingPage } from '../setting/setting';
import { LoginPage } from '../login/login';

import { LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { RegisterServerProvider } from '../../providers/register-server/register-server';
/**
 * Generated class for the ChangePasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-change-password',
  templateUrl: 'change-password.html',
})
export class ChangePasswordPage {
	form = {};
	validateform = true;
	customer_id : any;
  constructor(public navCtrl: NavController, 
  	public navParams: NavParams,
  	
	public loadingCtrl: LoadingController,
	public storage: Storage,
	private RegisterServer: RegisterServerProvider,
	public toastCtrl: ToastController,
	public platform: Platform,
	public alertCtrl: AlertController,
  	) {
  }

	ionViewDidLoad() {
		
	}
  	goback() {
		this.navCtrl.setRoot(SettingPage);
	}
	SubmitForm() {
		
		
		if (this.form['password'] == undefined || this.form['password'] == '')
		{
			this.AlertToast('Please enter the old password');
		}
		else
		{
			if (this.form['new_password'] == undefined || this.form['new_password'] == '')
			{
				this.AlertToast('Please enter the new password');
			}
			else
			{
				if (this.form['repeat_password'] == undefined || this.form['repeat_password'] == '')
				{
					this.AlertToast('Please enter the repeat password');
				}
				else
				{
					if (this.form['new_password'] != this.form['repeat_password'])
					{
						this.AlertToast('Two passwords do not match');
					}
					else
					{
						this.storage.get('customer_id')
						.then((customer_id) => {
							if (customer_id) 
							{
								this.customer_id = customer_id;
							 	
								let loading = this.loadingCtrl.create({
								    content: 'Please wait...'
							  	});

							  	loading.present();

								this.RegisterServer.ChangePassword(this.customer_id,this.form['password'],this.form['new_password'])
						        .subscribe((data) => {
									if (data.status == 'complete')
									{
										loading.dismiss();
										let toast = this.toastCtrl.create({
											message: data.message,
											position: 'top',
											duration : 2000,
											cssClass : 'alert_success'
										});
										toast.present();
										this.form['new_password'] = '';
										this.form['repeat_password'] = '';
										this.form['password'] = '';
									}
									else
									{
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
							else
							{
								
								this.navCtrl.setRoot(LoginPage);
							}
							
						});

						
					}
				}
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
