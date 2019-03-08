import { Component } from '@angular/core';
import { NavController, NavParams,ToastController ,AlertController,Refresher} from 'ionic-angular';
import { LoginPage } from '../login/login';

import { Storage } from '@ionic/storage';
import { LoadingController } from 'ionic-angular';
import { DepositServerProvider } from '../../providers/deposit-server/deposit-server';
import { ExchangeServerProvider } from '../../providers/exchange-server/exchange-server';
import { NotificationPage } from '../notification/notification';
import { HeaderColor } from '@ionic-native/header-color';
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
	balance = {};
	price_coin = {};
	customer_id :any;
	count_notifications = 0;
  constructor(
  	public navCtrl: NavController, 
	public navParams: NavParams,
	public DepositServer : DepositServerProvider,
	public ExchangeServer: ExchangeServerProvider,
	public storage: Storage,
	public loadingCtrl: LoadingController,
	public toastCtrl: ToastController,
	public alertCtrl: AlertController,
	private headerColor: HeaderColor
  	) {

  }

  ionViewDidLoad() {
  		this.headerColor.tint('#becb29');
		this.storage.get('customer_id')
		.then((customer_id) => {
			if (customer_id) 
			{
				this.customer_id = customer_id;
			 	
				let loading = this.loadingCtrl.create({
			    content: 'Please wait...'
			  	});
			  	loading.present();

			  	this.ExchangeServer.CountNotification(this.customer_id)
		        .subscribe((data) => {
		        	
					if (data.status == 'complete')
					{
						this.count_notifications = data.count_notifications;
					}
					
		        })

			  	this.ExchangeServer.LoadPrice()
		        .subscribe((data) => {
		        	
					if (data.status == 'complete')
					{
						this.price_coin['btc_usd'] = data.btc_usd;
						this.price_coin['eth_usd'] = data.eth_usd;
						this.price_coin['ltc_usd'] = data.ltc_usd;
						this.price_coin['xrp_usd'] = data.xrp_usd;
						this.price_coin['coin_usd'] = data.coin_usd;
						this.price_coin['usdt_usd'] = data.usdt_usd;
					}
					else
					{
						this.navCtrl.setRoot(LoginPage);
					}
		        })

			  	this.DepositServer.GetUser(this.customer_id)
		        .subscribe((data) => {
		        	
					if (data.status == 'complete')
					{
						loading.dismiss();
						this.balance['btc_balance'] = (parseFloat(data.btc_balance)/100000000).toFixed(8);
						this.balance['eth_balance'] = (parseFloat(data.eth_balance)/100000000).toFixed(8);
						this.balance['usdt_balance'] = (parseFloat(data.usdt_balance)/100000000).toFixed(8);
						this.balance['coin_balance'] = (parseFloat(data.coin_balance)/100000000).toFixed(8);
						this.balance['xrp_balance'] = (parseFloat(data.xrp_balance)/100000000).toFixed(8);
						this.balance['ltc_balance'] = (parseFloat(data.ltc_balance)/100000000).toFixed(8);
					}
					else
					{
						loading.dismiss();
						this.navCtrl.setRoot(LoginPage);
					}
		        })

		  		

		       
			}
			else
			{
				this.navCtrl.setRoot(LoginPage);
			}
			
		});

	}

	goNotificationPage() {
		this.navCtrl.push(NotificationPage);
	}

	
	doRefresh(refresher: Refresher) {
		this.ExchangeServer.LoadPrice()
        .subscribe((data) => {
        	
			if (data.status == 'complete')
			{
				this.price_coin['btc_usd'] = data.btc_usd;
				this.price_coin['eth_usd'] = data.eth_usd;
				this.price_coin['ltc_usd'] = data.ltc_usd;
				this.price_coin['xrp_usd'] = data.xrp_usd;
				this.price_coin['coin_usd'] = data.coin_usd;
				this.price_coin['usdt_usd'] = data.usdt_usd;


			}

			this.DepositServer.GetUser(this.customer_id)
	        .subscribe((data) => {
	        	
				if (data.status == 'complete')
				{
					
					this.balance['btc_balance'] = (parseFloat(data.btc_balance)/100000000).toFixed(8);
					this.balance['eth_balance'] = (parseFloat(data.eth_balance)/100000000).toFixed(8);
					this.balance['usdt_balance'] = (parseFloat(data.usdt_balance)/100000000).toFixed(8);
					this.balance['coin_balance'] = (parseFloat(data.coin_balance)/100000000).toFixed(8);
					this.balance['xrp_balance'] = (parseFloat(data.xrp_balance)/100000000).toFixed(8);
					this.balance['ltc_balance'] = (parseFloat(data.ltc_balance)/100000000).toFixed(8);
				}

				this.ExchangeServer.CountNotification(this.customer_id)
		        .subscribe((data) => {
		        	
					if (data.status == 'complete')
					{
						this.count_notifications = data.count_notifications;
					}
					refresher.complete();
		        })
				
	        })

        })

			  	
		
    	
  	}
}
