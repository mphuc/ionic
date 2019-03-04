import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,InfiniteScroll,Refresher,ToastController ,AlertController,Platform} from 'ionic-angular';
import { LoginPage } from '../login/login';
import { HomePage } from '../home/home';
import { Storage } from '@ionic/storage';
import { LoadingController } from 'ionic-angular';
import { DepositServerProvider } from '../../providers/deposit-server/deposit-server';
import { ExchangeServerProvider } from '../../providers/exchange-server/exchange-server';
/**
 * Generated class for the ExchangePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-exchange',
  templateUrl: 'exchange.html',
})
export class ExchangePage {
	balance = {};
	price_coin = {};
	form = {};
	customer_id :any;
	history : any;
	count_history = 0;
	constructor(
		public navCtrl: NavController, 
		public navParams: NavParams,
		public DepositServer : DepositServerProvider,
		public ExchangeServer: ExchangeServerProvider,
		public storage: Storage,
		public loadingCtrl: LoadingController,
		public toastCtrl: ToastController,
		public alertCtrl: AlertController,
		public platform: Platform,
	) {
  }

	ionViewDidLoad() {
		this.form['from_currency'] = 'BTC';
		this.form['to_currency'] = 'ETH';
		this.storage.get('customer_id')
		.then((customer_id) => {
			if (customer_id) 
			{
				this.customer_id = customer_id;
			 	
				let loading = this.loadingCtrl.create({
			    content: 'Please wait...'
			  	});
			  	loading.present();

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
						this.navCtrl.setRoot(HomePage);
					}
		        })

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
					else
					{
						this.navCtrl.setRoot(HomePage);
					}
		        })

		  		

		        this.ExchangeServer.GetHisroryExchange(this.customer_id,0,5)
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


	SubmitForm() {
		
		if (this.form['from_currency'] == null || this.form['from_currency'] === "" || this.form['to_currency'] == null || this.form['to_currency'] === "" || this.form['to_currency'] == this.form['from_currency'])
		{
			this.AlertToast('Please select conversion currency');
		}
		else
		{
			if (this.form['amount'] == null || this.form['amount'] === "")
			{
				this.AlertToast('Please enter the currency conversion number');
			}
			else
			{


				const confirm = this.alertCtrl.create({
			      title: 'Confirm exchange?',
			      message: 'Do you want to exchange '+this.form['amount']+' '+this.form['from_currency']+' to '+this.form['to_currency']+'?',
			      buttons: [
			        {
			          text: 'Cancel',
			          handler: () => {
			            console.log('Disagree clicked');
			          }
			        },
			        {
			          text: 'Confirm',
			          handler: () => {
			          	let val_balance = 0;
			          	if (this.form['from_currency'] == 'BTC')
			          	{
			          		val_balance = this.balance['btc_balance'];
			          	}
			          	if (this.form['from_currency'] == 'ETH')
			          	{
			          		val_balance = this.balance['eth_balance'];
			          	}
			          	if (this.form['from_currency'] == 'XRP')
			          	{
			          		val_balance = this.balance['xrp_balance'];
			          	}
			          	if (this.form['from_currency'] == 'USDT')
			          	{
			          		val_balance = this.balance['usdt_balance'];
			          	}
			          	if (this.form['from_currency'] == 'LTC')
			          	{
			          		val_balance = this.balance['ltc_balance'];
			          	}
			          	if (this.form['from_currency'] == 'STO')
			          	{
			          		val_balance = this.balance['coin_balance'];
			          	}

			          	let loadingss = this.loadingCtrl.create({
					    	content: 'Please wait...'
					  	});
					  	loadingss.present();
			          		
		            	this.ExchangeServer.ExchangeSubmit(this.customer_id,this.form['from_currency'],this.form['to_currency'],parseFloat(this.form['amount']))
				        .subscribe((data) => {
							if (data.status == 'complete')
							{
						  		
		            			loadingss.dismiss();
		            			let toast = this.toastCtrl.create({
									message: 'The conversion process was successfuly',
									position: 'top',
									duration : 2000,
									cssClass : 'alert_success'
								});
								toast.present();
		            			this.form['amount_estimate'] = '';
		            			this.form['amount'] = '';
		            			
								this.reLoadPage();

							}
							else
							{
								this.AlertToast('Your '+this.form['from_currency']+' balance is not enough to exchange.');
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
			      ]
			    });
			    confirm.present();
			}
		}
	}

	goback() {
		this.navCtrl.setRoot(HomePage);
	}

	reLoadPage(){
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
			else
			{
				this.navCtrl.setRoot(HomePage);
			}
        })

        this.ExchangeServer.GetHisroryExchange(this.customer_id,0,5)
        .subscribe((data) => {
			if (data)
			{
				
		  		this.history =  data;
		  		this.count_history = data.length;
			}
			
        })
	}

	doInfinite(infiniteScroll : InfiniteScroll) {
	  	this.ExchangeServer.GetHisroryExchange(this.customer_id,this.history.length,5)
        .subscribe((data) => {
			if (data.length > 0)
			{
				for(let item of data) {
				  	this.history.push({
				  		"username" : item.username,
				        "amount_form" : item.amount_form,
				        "amount_to" : item.amount_to,
				        "price_form" : item.price_form,
				        "price_to" : item.price_to,
				        "currency_from" :  item.currency_from,
				        "currency_to" :  item.currency_to,
				        "date_added" : item.date_added
				  	})
				}
			}
			infiniteScroll.complete();
			
        })
	}

	onChangeInput(value){
		if (this.form['from_currency'] != "" && this.form['to_currency'] != "" && this.form['to_currency'] != this.form['from_currency'])
		{
			if (value)
			{
				let price_form = 0;
				let form_usd = 0;
				let price_to = 0;
				
				if (this.form['from_currency'] == 'BTC')
				{
					price_form = this.price_coin['btc_usd'];
				}
				if (this.form['from_currency'] == 'LTC')
				{
					price_form = this.price_coin['ltc_usd'];
				}
				if (this.form['from_currency'] == 'ETH')
				{
					price_form = this.price_coin['eth_usd'];
				}
				if (this.form['from_currency'] == 'XRP')
				{
					price_form = this.price_coin['xrp_usd'];
				}
				if (this.form['from_currency'] == 'USDT')
				{
					price_form = this.price_coin['usdt_usd'];
				}
				if (this.form['from_currency'] == 'STO')
				{
					price_form = this.price_coin['coin_usd'];
				}


				if (this.form['to_currency'] == 'BTC')
				{
					price_to = this.price_coin['btc_usd'];
				}
				if (this.form['to_currency'] == 'LTC')
				{
					price_to = this.price_coin['ltc_usd'];
				}
				if (this.form['to_currency'] == 'ETH')
				{
					price_to = this.price_coin['eth_usd'];
				}
				if (this.form['to_currency'] == 'XRP')
				{
					price_to = this.price_coin['xrp_usd'];
				}
				if (this.form['to_currency'] == 'USDT')
				{
					price_to = this.price_coin['usdt_usd'];
				}
				if (this.form['to_currency'] == 'STO')
				{
					price_to = this.price_coin['coin_usd'];
				}

				form_usd = price_form* parseFloat(value);
				let to_coin_exchange = (form_usd/price_to).toFixed(8);
				this.form['amount_estimate'] = to_coin_exchange.toString();
				
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
  	onChangeSelectFrom(value){
  		if (this.form['amount'] != "" && this.form['to_currency'] != "" && this.form['to_currency'] != value)
		{
			if (value)
			{
				let price_form = 0;
				let form_usd = 0;
				let price_to = 0;
				
				if (value == 'BTC')
				{
					price_form = this.price_coin['btc_usd'];
				}
				if (value == 'LTC')
				{
					price_form = this.price_coin['ltc_usd'];
				}
				if (value == 'ETH')
				{
					price_form = this.price_coin['eth_usd'];
				}
				if (value == 'XRP')
				{
					price_form = this.price_coin['xrp_usd'];
				}
				if (value == 'USDT')
				{
					price_form = this.price_coin['usdt_usd'];
				}
				if (value == 'STO')
				{
					price_form = this.price_coin['coin_usd'];
				}


				if (this.form['to_currency'] == 'BTC')
				{
					price_to = this.price_coin['btc_usd'];
				}
				if (this.form['to_currency'] == 'LTC')
				{
					price_to = this.price_coin['ltc_usd'];
				}
				if (this.form['to_currency'] == 'ETH')
				{
					price_to = this.price_coin['eth_usd'];
				}
				if (this.form['to_currency'] == 'XRP')
				{
					price_to = this.price_coin['xrp_usd'];
				}
				if (this.form['to_currency'] == 'USDT')
				{
					price_to = this.price_coin['usdt_usd'];
				}
				if (this.form['to_currency'] == 'STO')
				{
					price_to = this.price_coin['coin_usd'];
				}

				form_usd = price_form* parseFloat(this.form['amount']);
				let to_coin_exchange = (form_usd/price_to).toFixed(8);
				this.form['amount_estimate'] = to_coin_exchange.toString();
				
			}
		}
  	}

  	onChangeSelectTo(value){
		if (this.form['from_currency'] != "" && this.form['amount'] != "" && value != this.form['from_currency'])
		{
			if (value)
			{
				let price_form = 0;
				let form_usd = 0;
				let price_to = 0;
				
				if (this.form['from_currency'] == 'BTC')
				{
					price_form = this.price_coin['btc_usd'];
				}
				if (this.form['from_currency'] == 'LTC')
				{
					price_form = this.price_coin['ltc_usd'];
				}
				if (this.form['from_currency'] == 'ETH')
				{
					price_form = this.price_coin['eth_usd'];
				}
				if (this.form['from_currency'] == 'XRP')
				{
					price_form = this.price_coin['xrp_usd'];
				}
				if (this.form['from_currency'] == 'USDT')
				{
					price_form = this.price_coin['usdt_usd'];
				}
				if (this.form['from_currency'] == 'STO')
				{
					price_form = this.price_coin['coin_usd'];
				}


				if (value == 'BTC')
				{
					price_to = this.price_coin['btc_usd'];
				}
				if (value == 'LTC')
				{
					price_to = this.price_coin['ltc_usd'];
				}
				if (value == 'ETH')
				{
					price_to = this.price_coin['eth_usd'];
				}
				if (value == 'XRP')
				{
					price_to = this.price_coin['xrp_usd'];
				}
				if (value == 'USDT')
				{
					price_to = this.price_coin['usdt_usd'];
				}
				if (value == 'STO')
				{
					price_to = this.price_coin['coin_usd'];
				}

				form_usd = price_form* parseFloat(this.form['amount']);

				let to_coin_exchange = (form_usd/price_to).toFixed(8);
				this.form['amount_estimate'] = to_coin_exchange.toString();
				
			}
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
				this.ExchangeServer.GetHisroryExchange(this.customer_id,0,5)
		        .subscribe((data) => {
					if (data)
					{
						
						
				  		this.history =  data;
				  		this.count_history = data.length;
					}
					refresher.complete();
		        })
	        })
        })

  	}
}
