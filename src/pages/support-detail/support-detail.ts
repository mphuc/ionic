import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ToastController ,AlertController,Platform,Refresher} from 'ionic-angular';
import { LoginPage } from '../login/login';

import { Storage } from '@ionic/storage';
import { LoadingController } from 'ionic-angular';
import { ExchangeServerProvider } from '../../providers/exchange-server/exchange-server';
import { DepositServerProvider } from '../../providers/deposit-server/deposit-server';
/**
 * Generated class for the SupportDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-support-detail',
  templateUrl: 'support-detail.html',
})
export class SupportDetailPage {
	history = {};
	form = {};
	img_profile;
	customer_id : any;
  constructor(
  	public navCtrl: NavController, 
  	public navParams: NavParams,
	public ExchangeServer: ExchangeServerProvider,
	public storage: Storage,
	public loadingCtrl: LoadingController,
	public toastCtrl: ToastController,
	public alertCtrl: AlertController,
	public DepositServer : DepositServerProvider,
	public platform: Platform,
  	) {
  }

	ionViewDidLoad() {
		
	  	this.storage.get('customer_id')
		.then((customer_id) => {
			if (customer_id) 
			{
				this.customer_id = customer_id;
			 	
				let loading = this.loadingCtrl.create({
			    content: 'Please wait...'
			  	});
			  	loading.present();

		        this.DepositServer.GetUser(this.customer_id)
		        .subscribe((data) => {
					if (data)
					{
						this.img_profile = data.img_profile;
					}
					
		        })

		        this.ExchangeServer.GetHisrorySupportID(this.navParams.get("_id"))
		        .subscribe((data) => {
		        	
					if (data)
					{
						loading.dismiss();
				  		this.history =  data;
					}
					else
					{
						loading.dismiss();
					}
		        })
		        

			}
			else
			{
				this.navCtrl.setRoot(LoginPage);
			}
			
		});

		
	}


	SubmitForm() {
		if (this.form['content'] == null || this.form['content'] === "")
		{
			this.AlertToast('Please enter support content');
		}
		else
		{
			let loadingss = this.loadingCtrl.create({
		    	content: 'Please wait...'
		  	});
		  	loadingss.present();
          		
        	this.ExchangeServer.SupportSubmitReply(this.customer_id,this.navParams.get("_id"),this.form['content'])
	        .subscribe((data) => {
				if (data.status == 'complete')
				{
			  		
        			loadingss.dismiss();
        			let toast = this.toastCtrl.create({
						message: 'Submit successful support information. We will reply you as soon as possible',
						position: 'top',
						duration : 5000,
						cssClass : 'alert_success'
					});
					toast.present();
        			this.form['content'] = '';
        			
					this.reLoadPage();

				}
				else
				{
					this.AlertToast(data.message);
					
	          		loadingss.dismiss();
	          	}
	        },
	        (err) => {
	        	if (err)
	        	{
	        		loadingss.dismiss();
	        		this.SeverNotLogin();
	        	}
	        })
				
		}
		
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

	AlertToast(message) {
	    let toast = this.toastCtrl.create({
	      message: message,
	      position: 'top',
	      duration : 3000,
	      cssClass : 'error-submitform'
	    });
	    toast.present();
  	}

  	reLoadPage(){
		
        this.ExchangeServer.GetHisrorySupportID(this.navParams.get("_id"))
        .subscribe((data) => {
        	
			if (data)
			{
				
		  		this.history =  data;
			}
			
        })
	}


	doRefresh(refresher: Refresher) {

		this.ExchangeServer.GetHisrorySupportID(this.navParams.get("_id"))
        .subscribe((data) => {
        	
			if (data)
			{
		  		this.history =  data;
			}
			refresher.complete();
        })


  	}
}
