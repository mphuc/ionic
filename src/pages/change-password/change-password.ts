import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams , ToastController} from 'ionic-angular';
import { SettingPage } from '../setting/setting';
import { LoginPage } from '../login/login';
import { AlertController } from 'ionic-angular';
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
	errorlog = '';
	customer_id : any;
  constructor(public navCtrl: NavController, 
  	public navParams: NavParams,
  	private alertCtrl: AlertController,
	public loadingCtrl: LoadingController,
	public storage: Storage,
	private RegisterServer: RegisterServerProvider,
	public toastCtrl: ToastController,
  	) {
  }

	ionViewDidLoad() {
		this.validateform = false;
	console.log('ionViewDidLoad ChangePasswordPage');
	}
  	goback() {
		this.navCtrl.setRoot(SettingPage);
	}
	SubmitForm() {
		this.validateform = true;
		
		
		if (this.form['password'] == undefined || this.form['password'] == '')
		{
			this.validateform = false;
			this.errorlog = 'Please enter the old password';
		}
		else
		{
			if (this.form['new_password'] == undefined || this.form['new_password'] == '')
			{
				this.validateform = false;
				this.errorlog = 'Please enter the new password';
			}
			else
			{
				if (this.form['repeat_password'] == undefined || this.form['repeat_password'] == '')
				{
					this.validateform = false;
					this.errorlog = 'Please enter the repeat password';
				}
				else
				{
					if (this.form['new_password'] != this.form['repeat_password'])
					{
						this.validateform = false;
						this.errorlog = 'Two passwords do not match';
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
											position: 'bottom',
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
										this.validateform = false;
										this.errorlog = data.message;
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
}
