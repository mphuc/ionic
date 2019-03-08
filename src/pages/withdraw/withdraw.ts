import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,InfiniteScroll,ToastController ,AlertController,Refresher,Platform} from 'ionic-angular';
import { LoginPage } from '../login/login';
import { HomePage } from '../home/home';
import { Storage } from '@ionic/storage';
import { LoadingController } from 'ionic-angular';
import { DetailWithdrawPage } from '../detail-withdraw/detail-withdraw';
import { DepositServerProvider } from '../../providers/deposit-server/deposit-server';
import { ExchangeServerProvider } from '../../providers/exchange-server/exchange-server';
import { WithdrawServerProvider } from '../../providers/withdraw-server/withdraw-server';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
/**
 * Generated class for the DepositPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-withdraw',
  templateUrl: 'withdraw.html',
})
export class WithdrawPage {
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
  	public WithdrawServer : WithdrawServerProvider,
  	public platform: Platform,
  	private barcodeScanner: BarcodeScanner
  	) {
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

		  		

		        this.ExchangeServer.GetHisroryWithdraw(this.customer_id,0,5)
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
			let amount_estimate = (price_altcoin* parseFloat(this.form['amount'])).toFixed(8);
				
			this.form['amount_estimate'] = amount_estimate;
		}
		
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

        this.ExchangeServer.GetHisroryWithdraw(this.customer_id,0,5)
        .subscribe((data) => {
			if (data)
			{
				
		  		this.history =  data;
		  		this.count_history = data.length;
			}
			
        })
	}

	doInfinite(infiniteScroll : InfiniteScroll) {
	  	this.ExchangeServer.GetHisroryWithdraw(this.customer_id,this.history.length,5)
        .subscribe((data) => {
			if (data.length > 0)
			{
				for(let item of data) {
				  	this.history.push({
				  		"username" : item.username,
				        "amount" : item.amount,
				        "amount_usd" : item.amount_usd,
				        "currency" : item.currency,
				        "status" : item.status,
				        "txtid" : item.txtid,
				        "date_added" : item.date_added
				  	})
				}
			}
			infiniteScroll.complete();
			
        })
	}

	SubmitForm() {
		
		if (this.form['currency'] == null || this.form['currency'] === "" )
		{
			this.AlertToast('Please select the coin to withdraw.');
		}
		else
		{
			if (this.form['amount'] == null || this.form['amount'] === "")
			{
				this.AlertToast('Please enter the withdraw coin.');
			}
			else
			{
				if (parseFloat(this.form['amount_estimate']) < 500 )
				{
					this.AlertToast('The minimum amount of withdrawal is $ 500.00');
				}
				else
				{
					if (this.form['wallet'] == '' || this.form['wallet'] == null  )
					{
						this.AlertToast('Please enter the address for withdrawal of '+this.form['currency']);
					}
					else
					{
						const confirm = this.alertCtrl.create({
					      title: 'Confirm Withdraw ?',
					      message: 'Do you want to withdraw '+this.form['amount']+' '+this.form['currency']+' with wallet address '+this.form['wallet']+'?',
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
					          		
				            	this.ExchangeServer.WithdrawSubmit(this.customer_id,this.form['currency'],parseFloat(this.form['amount']),this.form['wallet'])
						        .subscribe((data) => {
									if (data.status == 'complete')
									{
								  		
				            			loadingss.dismiss();
				            			let toast = this.toastCtrl.create({
											message: 'Withdraw successfuly',
											position: 'top',
											duration : 2000,
											cssClass : 'alert_success'
										});
										toast.present();
				            			this.form['amount_estimate'] = '';
				            			this.form['amount'] = '';
				            			
				            			this.form['wallet'] = '';
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
					      ]
					    });
				    	confirm.present();
					}	
				}
					
			}
		}
	}

	scanCode() {
    
	    this.barcodeScanner.scan({
	      preferFrontCamera : false,
	      showFlipCameraButton : true,
	      showTorchButton : true,
	      disableSuccessBeep : true,
	      prompt : ''
	    }).then(barcodeData => {
	      
	      let string = barcodeData.text;
	      if (string)
	      {
	      	this.form['wallet'] = string;
	      }
	      else
	      {
	      	this.AlertToast('Error Wallet');
	      }
	    }, (err) => {
	    	this.form['wallet'] = '';
	        this.AlertToast('Error Wallet');
	    });
	}

	ViewDetailWithdraw (_id){
		this.navCtrl.push(DetailWithdrawPage,{'_id' : _id});
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
				this.ExchangeServer.GetHisroryWithdraw(this.customer_id,0,5)
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
