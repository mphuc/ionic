import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,InfiniteScroll,ToastController } from 'ionic-angular';
import { HomePage } from '../home/home';
import { LoginPage } from '../login/login';
import { Storage } from '@ionic/storage';
import { LoadingController } from 'ionic-angular';
import { DepositServerProvider } from '../../providers/deposit-server/deposit-server';
import { Clipboard } from '@ionic-native/clipboard';
/**
 * Generated class for the DepositPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-deposit',
  templateUrl: 'deposit.html',
})
export class DepositPage {
	tab = {};
	balance = {};
	customer_id :any;
	address :any;
	history : any;
	count_history = 0;
  constructor(
  	public navCtrl: NavController, 
  	public navParams: NavParams,
  	public DepositServer : DepositServerProvider,
  	public storage: Storage,
  	public loadingCtrl: LoadingController,
  	private clipboard: Clipboard,
  	public toastCtrl: ToastController
  	) {
  }

  	ionViewDidLoad() {

  		this.tab['BTC'] = true;
  		this.tab['ETH'] = false;
  		this.tab['USDT'] = false;
  		this.tab['LTC'] = false;
  		this.tab['XRP'] = false;
  		this.tab['STO'] = false;
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
						loading.dismiss();
						this.navCtrl.setRoot(HomePage);
					}
		        })

		  		this.DepositServer.GetWalletAddress(this.customer_id,'BTC')
		        .subscribe((data) => {
					if (data.status == 'complete')
					{
				  		this.address = data.address;
					}
		        })

		        this.DepositServer.GetHisroryDeposit(this.customer_id,0,5)
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


  	DepositBTC(){
  		if (this.tab['BTC'] == false)
  		{
  			let loading = this.loadingCtrl.create({
			    content: 'Please wait...'
		  	});
		  	loading.present();
	  		this.DepositServer.GetWalletAddress(this.customer_id,'BTC')
	        .subscribe((data) => {
				if (data.status == 'complete')
				{
					loading.dismiss();
					this.tab['BTC'] = true;
			  		this.tab['ETH'] = false;
			  		this.tab['USDT'] = false;
			  		this.tab['LTC'] = false;
			  		this.tab['XRP'] = false;
			  		this.tab['STO'] = false;
			  		this.address = data.address;
				}
				else
				{
					loading.dismiss();
				}
	        })
  		}
	  		
  	}

  	DepositETH(){
  		if (this.tab['ETH'] == false)
  		{
	  		let loading = this.loadingCtrl.create({
			    content: 'Please wait...'
		  	});
		  	loading.present();
	  		this.DepositServer.GetWalletAddress(this.customer_id,'ETH')
	        .subscribe((data) => {
				if (data.status == 'complete')
				{
					loading.dismiss();
					this.tab['BTC'] = false;
			  		this.tab['ETH'] = true;
			  		this.tab['USDT'] = false;
			  		this.tab['LTC'] = false;
			  		this.tab['XRP'] = false;
			  		this.tab['STO'] = false;
			  		this.address = data.address;
				}
				else
				{
					loading.dismiss();
				}
	        })
	    }
  	}

  	DepositUSDT(){
  		if (this.tab['USDT'] == false)
  		{
	  		let loading = this.loadingCtrl.create({
			    content: 'Please wait...'
		  	});
		  	loading.present();
	  		this.DepositServer.GetWalletAddress(this.customer_id,'USDT')
	        .subscribe((data) => {
				if (data.status == 'complete')
				{
					loading.dismiss();
					this.tab['BTC'] = false;
			  		this.tab['ETH'] = false;
			  		this.tab['USDT'] = true;
			  		this.tab['LTC'] = false;
			  		this.tab['XRP'] = false;
			  		this.tab['STO'] = false;
			  		this.address = data.address;
				}
				else
				{
					loading.dismiss();
				}
	        })
	    }
  	}

  	DepositLTC(){
  		if (this.tab['LTC'] == false)
  		{
	  		let loading = this.loadingCtrl.create({
			    content: 'Please wait...'
		  	});
		  	loading.present();
	  		this.DepositServer.GetWalletAddress(this.customer_id,'LTC')
	        .subscribe((data) => {
				if (data.status == 'complete')
				{
					loading.dismiss();
					this.tab['BTC'] = false;
			  		this.tab['ETH'] = false;
			  		this.tab['USDT'] = false;
			  		this.tab['LTC'] = true;
			  		this.tab['XRP'] = false;
			  		this.tab['STO'] = false;
			  		this.address = data.address;
				}
				else
				{
					loading.dismiss();
				}
	        })
	    }
  	}

  	DepositXRP(){
  		if (this.tab['XRP'] == false)
  		{
	  		let loading = this.loadingCtrl.create({
			    content: 'Please wait...'
		  	});
		  	loading.present();
	  		this.DepositServer.GetWalletAddress(this.customer_id,'XRP')
	        .subscribe((data) => {
				if (data.status == 'complete')
				{
					loading.dismiss();
					this.tab['BTC'] = false;
			  		this.tab['ETH'] = false;
			  		this.tab['USDT'] = false;
			  		this.tab['LTC'] = false;
			  		this.tab['XRP'] = true;
			  		this.tab['STO'] = false;
			  		this.address = data.address;
				}
				else
				{
					loading.dismiss();
				}
	        })
	    }
  	}

  	DepositSTO(){
  		if (this.tab['STO'] == false)
  		{
	  		let loading = this.loadingCtrl.create({
			    content: 'Please wait...'
		  	});
		  	loading.present();
	  		this.DepositServer.GetWalletAddress(this.customer_id,'STO')
	        .subscribe((data) => {
				if (data.status == 'complete')
				{
					loading.dismiss();
					this.tab['BTC'] = false;
			  		this.tab['ETH'] = false;
			  		this.tab['USDT'] = false;
			  		this.tab['LTC'] = false;
			  		this.tab['XRP'] = false;
			  		this.tab['STO'] = true;
			  		this.address = data.address;
				}
				else
				{
					loading.dismiss();
				}
	        })
	    }
  	}

  	goback() {
		this.navCtrl.setRoot(HomePage);
	}


	doInfinite(infiniteScroll : InfiniteScroll) {
	  	this.DepositServer.GetHisroryDeposit(this.customer_id,this.history.length,5)
        .subscribe((data) => {

			if (data.length > 0)
			{
				for(let item of data) {
				  	this.history.push({
				  		"username" : item.username,
				        "status" : item.status,
				        "amount" : item.amount,
				        "tx" : item.tx,
				        "address" : item.address,
				        "date_added" : item.date_added,
				        "type" : item.type
				  	})
				}
				//this.history = this.sortByKeyDesc(this.history,'date_added');
			}
			infiniteScroll.complete();
			
        })
	}


	sortByKeyDesc(array, key) {
        return array.sort(function (a, b) {
            var x = a[key]; var y = b[key];
            return ((x > y) ? -1 : ((x < y) ? 1 : 0));
        });
    }
    sortByKeyAsc(array, key) {
        return array.sort(function (a, b) {
            var x = a[key]; var y = b[key];
            return ((x < y) ? -1 : ((x > y) ? 1 : 0));
        });
    }

	CopyWallet(){
    
	this.clipboard.copy(this.address);

	this.clipboard.paste().then(
		(resolve: string) => {
			console.log(resolve);
			let toast = this.toastCtrl.create({
				message: 'The wallet address has been successfully coppy',
				position: 'bottom',
				duration : 2000,
				cssClass : 'errorqrcode'
			});
			toast.present();
		},
		(reject: string) => {
			console.log('Error: ' + reject);
		}
	);
	//this.presentToast();
	}
}
