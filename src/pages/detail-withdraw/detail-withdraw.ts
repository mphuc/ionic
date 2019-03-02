import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { HomePage } from '../home/home';
import { Storage } from '@ionic/storage';
import { LoadingController } from 'ionic-angular';
import { ExchangeServerProvider } from '../../providers/exchange-server/exchange-server';
/**
 * Generated class for the DetailWithdrawPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-detail-withdraw',
  templateUrl: 'detail-withdraw.html',
})
export class DetailWithdrawPage {
	detailwithdraw = {};
  constructor(
  	public navCtrl: NavController, 
  	public navParams: NavParams,
  	public ExchangeServer : ExchangeServerProvider,
  	public storage: Storage,
	public loadingCtrl: LoadingController
  	) {
  }

	ionViewDidLoad() {
		let loading = this.loadingCtrl.create({
	    	content: 'Please wait...'
	  	});
	  	loading.present();


	  	this.ExchangeServer.LoadDetailWithdraw(this.navParams.get("_id"))
        .subscribe((data) => {
			if (data)
			{
				this.detailwithdraw = data;
				loading.dismiss();
			}
			else
			{
				this.navCtrl.setRoot(HomePage);
				loading.dismiss();
			}
        })
	}
	goback() {
		this.navCtrl.setRoot(HomePage);
	}
}
