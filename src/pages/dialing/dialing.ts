import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,InfiniteScroll,ToastController ,AlertController,Refresher} from 'ionic-angular';
import { LoginPage } from '../login/login';

import { Storage } from '@ionic/storage';
import { LoadingController } from 'ionic-angular';

import { ExchangeServerProvider } from '../../providers/exchange-server/exchange-server';

/**
 * Generated class for the DialingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-dialing',
  templateUrl: 'dialing.html',
})
export class DialingPage {
	customer_id :any;
	history : any;
	count_history = 0;
	number_radom = 0;
	setinterval : any;
	button = 'start';
	number_dialing : any;
  constructor(
  	public navCtrl: NavController, 
	public navParams: NavParams,
	public ExchangeServer: ExchangeServerProvider,
	public storage: Storage,
	public loadingCtrl: LoadingController,
	public toastCtrl: ToastController,
	public alertCtrl: AlertController,
  	) {
  }

	ionViewDidLoad() {
		this.number_radom = 100;
		
		this.storage.get('customer_id')
		.then((customer_id) => {
			if (customer_id) 
			{
				this.customer_id = customer_id;
			 	
				let loading = this.loadingCtrl.create({
			    content: 'Please wait...'
			  	});
			  	loading.present();
			  	
			  	this.ExchangeServer.GetNumberDialing(this.customer_id)
		        .subscribe((data) => {
					if (data)
					{
						this.number_dialing = data.number_dialing;
					}
					
		        })

		        this.ExchangeServer.GetHisroryDialing(this.customer_id,0,5)
		        .subscribe((data) => {
					if (data)
					{
						loading.dismiss();
				  		this.history =  data;
				  		this.count_history = data.length;
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

	StartDialing(){
		if (this.number_dialing > 0)
		{
			this.number_dialing = this.number_dialing -1;
			this.button = 'stop';
			let number = 0;
			this.setinterval = setInterval(function(){ 
				number = Math.floor(11 + Math.random() * 90);
				this.number_radom = number;
			}.bind(this), 10); 
		}
		else
		{
			this.AlertToast('You have no turns');
		}
			
	}
	StopDialing(){
		this.button = 'pedding';
		
		clearInterval(this.setinterval);
		this.ExchangeServer.UpdateDialing(this.customer_id,this.number_radom)
        .subscribe((data) => {
        	if (data.status == 'complete')
        	{
        		setTimeout(function() {
					this.button = 'start';
				}.bind(this), 1000);
				let toast = this.toastCtrl.create({
					message: 'Congratulations. You receive '+this.number_radom+' STO',
					position: 'top',
					duration : 2000,
					cssClass : 'alert_success'
				});
				toast.present();
				this.ExchangeServer.GetHisroryDialing(this.customer_id,0,5)
		        .subscribe((data) => {
					if (data)
					{
						
				  		this.history =  data;
				  		this.count_history = data.length;
					}
					
		        })
        	}
        })
	}

	doInfinite(infiniteScroll : InfiniteScroll) {
	  	this.ExchangeServer.GetHisroryDialing(this.customer_id,this.history.length,5)
        .subscribe((data) => {
			if (data.length > 0)
			{
				for(let item of data) {
				  	this.history.push({
				  		"username" : item.username,
				        "package" : item.package,
				        "currency" : item.currency,
				        "status" : item.status,
				        "amount_coin" : item.amount_coin,
				        "date_added" : item.date_added
				  	})
				}
			}
			infiniteScroll.complete();
			
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
  	doRefresh(refresher: Refresher) {
  		this.ExchangeServer.GetHisroryDialing(this.customer_id,0,5)
        .subscribe((data) => {
			if (data)
			{
				
		  		this.history =  data;
		  		this.count_history = data.length;
			}
			refresher.complete();
        })
  	}

}
