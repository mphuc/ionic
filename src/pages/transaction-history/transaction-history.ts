import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,InfiniteScroll } from 'ionic-angular';
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
	customer_id :any;
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
				        
				        "date_added" : item.date_added
				  	})
				}
			}
			infiniteScroll.complete();
			
        })
	}

	goback() {
		this.navCtrl.setRoot(HomePage);
	}
}
