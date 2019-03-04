import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,InfiniteScroll ,Refresher} from 'ionic-angular';
import { LoginPage } from '../login/login';

import { NotificationDetaiPage } from '../notification-detai/notification-detai';
import { Storage } from '@ionic/storage';
import { LoadingController } from 'ionic-angular';
import { ExchangeServerProvider } from '../../providers/exchange-server/exchange-server';

/**
 * Generated class for the NotificationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-notification',
  templateUrl: 'notification.html',
})
export class NotificationPage {

	customer_id :any;
	history : any;
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

			  	
		        this.ExchangeServer.GetListNotification(this.customer_id,0,20)
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

	doInfinite(infiniteScroll : InfiniteScroll) {
	  	this.ExchangeServer.GetListNotification(this.customer_id,this.history.length,5)
        .subscribe((data) => {
			if (data.length > 0)
			{
				for(let item of data) {
				  	this.history.push({
				  		"_id" : item._id,
				  		"username" : item.username,
				        "content" : item.content,
				        "type" : item.type,
				        "read" : item.read,
				        "status" : item.status,
				        "date_added" : item.date_added
				  	})
				}
			}
			infiniteScroll.complete();
			
        })
	}
	ViewDetailNotification(_id){
		this.navCtrl.push(NotificationDetaiPage,{'_id' : _id});
	}

	doRefresh(refresher: Refresher) {
		this.ExchangeServer.GetListNotification(this.customer_id,0,20)
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
