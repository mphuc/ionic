import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,InfiniteScroll,ToastController ,AlertController,Refresher} from 'ionic-angular';
import { LoginPage } from '../login/login';
import { HomePage } from '../home/home';
import { ProfitHistoryPage } from '../profit-history/profit-history';
import { DialingPage } from '../dialing/dialing';

import { Storage } from '@ionic/storage';
import { LoadingController } from 'ionic-angular';
import { DepositServerProvider } from '../../providers/deposit-server/deposit-server';
import { ExchangeServerProvider } from '../../providers/exchange-server/exchange-server';
import { ReffralServerProvider } from '../../providers/reffral-server/reffral-server';
/**
 * Generated class for the InvestmentPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-investment',
  templateUrl: 'investment.html',
})
export class InvestmentPage {
	balance = {};
	price_coin = {};
	invest_wallet = {};
	form = {};
	customer_id :any;
	history : any;
	count_history = 0; 
	number_dialing = 0;
  constructor(public navCtrl: NavController, 
		public navParams: NavParams,
		public DepositServer : DepositServerProvider,
		public ExchangeServer: ExchangeServerProvider,
		public storage: Storage,
		public loadingCtrl: LoadingController,
		public toastCtrl: ToastController,
		public alertCtrl: AlertController,
		public ReffralServer: ReffralServerProvider) {
  }

	ionViewDidLoad() {
		this.form['currency'] = 'BTC';
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
		  		

		        this.ReffralServer.GetInfomationUser(this.customer_id)
		        .subscribe((data) => {
		        	
					if (data.status == 'complete')
					{
				  		this.invest_wallet =  data;
					}
					else
					{
						this.navCtrl.setRoot(HomePage);
					}
		        })


		        this.ExchangeServer.GetHisroryInvestment(this.customer_id,0,5)
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
	
  	goback() {
		this.navCtrl.setRoot(HomePage);
	}


	SubmitForm() {
		if (this.form['currency'] == null || this.form['currency'] === "" )
		{
			this.AlertToast('Please select the coin to investment.');
		}
		else
		{
			if (this.form['amount'] == null || this.form['amount'] === "")
			{
				this.AlertToast('Please enter the investment coin.');
			}
			else
			{
				if (parseFloat(this.form['amount_estimate']) < 500 )
				{
					this.AlertToast('The investment package must be greater than $ 500.00');
				}
				else
				{
					const confirm = this.alertCtrl.create({
				      title: 'Confirm Investment?',
				      message: 'Do you want to invest '+this.form['amount']+' '+this.form['currency']+' ?',
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
				          	

				          	let loadingss = this.loadingCtrl.create({
						    	content: 'Please wait...'
						  	});
						  	loadingss.present();
				          		
			            	this.ExchangeServer.InvestmentSubmit(this.customer_id,this.form['currency'],parseFloat(this.form['amount']))
					        .subscribe((data) => {
								if (data.status == 'complete')
								{
							  		
			            			loadingss.dismiss();
			            			let toast = this.toastCtrl.create({
										message: 'Active package successfully',
										position: 'top',
										duration : 2000,
										cssClass : 'alert_success'
									});
									toast.present();
			            			this.form['amount_estimate'] = '';
			            			this.form['amount'] = '';
			            			this.form['from'] = '';
									this.reLoadPage();

								}
								else
								{
									this.AlertToast(data.message);
					          		loadingss.dismiss();
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
	}

	onChangeInput(value){
		if (this.form['currency'] != "")
		{
			if (value)
			{
				let price_altcoin = 0;
				
				if (this.form['currency'] == 'BTC')
				{
					price_altcoin = this.price_coin['btc_usd'];
				}
				if (this.form['currency'] == 'LTC')
				{
					price_altcoin = this.price_coin['ltc_usd'];
				}
				if (this.form['currency'] == 'ETH')
				{
					price_altcoin = this.price_coin['eth_usd'];
				}
				if (this.form['currency'] == 'XRP')
				{
					price_altcoin = this.price_coin['xrp_usd'];
				}
				if (this.form['currency'] == 'USDT')
				{
					price_altcoin = this.price_coin['usdt_usd'];
				}
				if (this.form['currency'] == 'STO')
				{
					price_altcoin = this.price_coin['coin_usd'];
				}

				let amount_estimate = (price_altcoin* parseFloat(value)).toFixed(8);
				
				this.form['amount_estimate'] = amount_estimate;
				
			}
		}
	}
	onChangeSelect(value)
	{
		if (this.form['amount'] != "")
		{
			let price_altcoin = 0;
			if (value == 'BTC')
			{
				price_altcoin = this.price_coin['btc_usd'];
			}
			if (value == 'LTC')
			{
				price_altcoin = this.price_coin['ltc_usd'];
			}
			if (value == 'ETH')
			{
				price_altcoin = this.price_coin['eth_usd'];
			}
			if (value == 'XRP')
			{
				price_altcoin = this.price_coin['xrp_usd'];
			}
			if (value == 'USDT')
			{
				price_altcoin = this.price_coin['usdt_usd'];
			}
			if (value == 'STO')
			{
				price_altcoin = this.price_coin['coin_usd'];
			}
			let amount_estimate = price_altcoin* parseFloat(this.form['amount']);
				
			this.form['amount_estimate'] = amount_estimate;
		}
		
	}

	reLoadPage(){
		this.ExchangeServer.GetNumberDialing(this.customer_id)
        .subscribe((data) => {
			if (data)
			{
				this.number_dialing = data.number_dialing;
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

        this.ExchangeServer.GetHisroryInvestment(this.customer_id,0,5)
        .subscribe((data) => {
			if (data)
			{
				
		  		this.history =  data;
		  		this.count_history = data.length;
			}
			
        })
	}

	ViewHistory(name_history){
		this.navCtrl.push(ProfitHistoryPage,{'name_history' : name_history,'customer_id' : this.customer_id});
	}

	ViewDialing()
	{
		this.number_dialing = (this.number_dialing) - 1;
		this.navCtrl.push(DialingPage);
	}

	doInfinite(infiniteScroll : InfiniteScroll) {
	  	this.ExchangeServer.GetHisroryInvestment(this.customer_id,this.history.length,5)
        .subscribe((data) => {
			if (data.length > 0)
			{
				for(let item of data) {
				  	this.history.push({
				  		"username" : item.username,
				        "package" : item.package,
				        "currency" : item.currency,
				        "amount_usd" : item.amount_usd,
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
  		this.ExchangeServer.GetNumberDialing(this.customer_id)
        .subscribe((data) => {
			if (data)
			{
				this.number_dialing = data.number_dialing;
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

				this.ReffralServer.GetInfomationUser(this.customer_id)
		        .subscribe((data) => {
		        	
					if (data.status == 'complete')
					{
				  		this.invest_wallet =  data;

				  		
					}

					this.ExchangeServer.GetHisroryInvestment(this.customer_id,0,5)
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
        })
  	}
}
