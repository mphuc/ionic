import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,InfiniteScroll,Refresher } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { HomePage } from '../home/home';
import { Storage } from '@ionic/storage';
import { LoadingController } from 'ionic-angular';
import { ExchangeServerProvider } from '../../providers/exchange-server/exchange-server';
/**
 * Generated class for the TransactionHistoryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-transaction-history',
  templateUrl: 'transaction-history.html',
})
export class TransactionHistoryPage {

	history : any;
	history_temp : any;
	customer_id :any;
	count_history = 0;
  constructor(
  	public navCtrl: NavController, 
  	public navParams: NavParams,
  	public ExchangeServer: ExchangeServerProvider,
	public storage: Storage,
	public loadingCtrl: LoadingController
	
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

			  	
		        this.ExchangeServer.GetHisroryTransaction(this.customer_id,0,20)
		        .subscribe((data) => {
					if (data)
					{
						loading.dismiss();
				  		this.history =  data;
				  		this.history_temp = data;
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

	doInfinite(infiniteScroll : InfiniteScroll) {
	  	this.ExchangeServer.GetHisroryTransaction(this.customer_id,this.history.length,20)
        .subscribe((data) => {
			if (data.length > 0)
			{
				for(let item of data) {
				  	this.history.push({
				  		"username" : item.username,
				        "amount" : item.amount,
				        "type" : item.type,
				        "currency" : item.currency,
				        "date_added" : item.date_added,
				        "detail" : item.detail
				  	})
				}
				this.history_temp = this.history;
			}
			infiniteScroll.complete();
			
        })
	}

	getItems(ev: any) {
	    
	    let val = ev.target.value;

	    // if the value is an empty string don't filter the items
	    if (val && val.trim() != '') {
	    	val = val.toLowerCase();
	      this.history =  this.history_temp.filter((item) => {
			  if (item.type.toLowerCase().indexOf(val) >= 0) {
			    return true;
			  }
			  if (item.date_added.indexOf(val) >= 0) {
			    return true;
			  }
			  if (item.amount.toString().indexOf(val) >= 0) {
			    return true;
			  }
			  return false;
			})
	      
	    }
	    else
	    {
	    	this.history =  this.history_temp;
	    }
  	}
	goback() {
		this.navCtrl.setRoot(HomePage);
	}
	doRefresh(refresher: Refresher) {

		this.ExchangeServer.GetHisroryTransaction(this.customer_id,0,20)
        .subscribe((data) => {
			if (data)
			{
				
		  		this.history =  data;
		  		this.history_temp = data;
		  		this.count_history = data.length;
			}
			refresher.complete();
        })
  	}
}
