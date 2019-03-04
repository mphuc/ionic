import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';



import { Storage } from '@ionic/storage';
import { LoadingController } from 'ionic-angular';
import { ExchangeServerProvider } from '../../providers/exchange-server/exchange-server';
/**
 * Generated class for the NotificationDetaiPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-notification-detai',
  templateUrl: 'notification-detai.html',
})
export class NotificationDetaiPage {
	history = {};
	
  constructor(
  	public navCtrl: NavController, 
  	public navParams: NavParams,
	public ExchangeServer: ExchangeServerProvider,
	public storage: Storage,
	public loadingCtrl: LoadingController
  	) {
  } 

	ionViewDidLoad() {
		let loading = this.loadingCtrl.create({
	    content: 'Please wait...'
	  	});
	  	loading.present();

        this.ExchangeServer.GetNotificationID(this.navParams.get("_id"))
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

}
