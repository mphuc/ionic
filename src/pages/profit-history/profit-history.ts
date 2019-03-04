import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,InfiniteScroll,Refresher } from 'ionic-angular';

import { Storage } from '@ionic/storage';
import { LoadingController } from 'ionic-angular';
import { ExchangeServerProvider } from '../../providers/exchange-server/exchange-server';

/**
 * Generated class for the ProfitHistoryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profit-history',
  templateUrl: 'profit-history.html',
})
export class ProfitHistoryPage {
	history : any;
	customer_id :any;
	name_history : any;
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
		this.customer_id = this.navParams.get("customer_id");
		this.name_history = this.navParams.get("name_history");

		let loading = this.loadingCtrl.create({
	    content: 'Please wait...'
	  	});
	  	loading.present();

	  	
        this.ExchangeServer.GetHisroryProfit(this.customer_id,this.name_history,0,20)
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

	doInfinite(infiniteScroll : InfiniteScroll) {
	  	this.ExchangeServer.GetHisroryProfit(this.customer_id,this.name_history,this.history.length,20)
        .subscribe((data) => {
			if (data.length > 0)
			{
				for(let item of data) {
				  	this.history.push({
				  		"username" : item.username,
				        "amount" : item.amount,
				        "type" : item.type,
				        "currency" : item.currency,
				        "detail" : item.detail,
				        "date_added" : item.date_added
				  	})
				}
			}
			infiniteScroll.complete();
			
        })
	}

	doRefresh(refresher: Refresher) {

		this.ExchangeServer.GetHisroryProfit(this.customer_id,this.name_history,0,20)
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
