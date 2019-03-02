import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,InfiniteScroll } from 'ionic-angular';

import { HomePage } from '../home/home';
import { ReffralPage } from '../reffral/reffral';
import { Storage } from '@ionic/storage';
import { LoadingController } from 'ionic-angular';
import { ReffralServerProvider } from '../../providers/reffral-server/reffral-server';

/**
 * Generated class for the UserDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-user-detail',
  templateUrl: 'user-detail.html',
})
export class UserDetailPage {
	customer_id :any;
	history : any;
	count_history : any;
	infomation = {};
  constructor(
  	public navCtrl: NavController, 
  	public navParams: NavParams,
  	public storage: Storage,
  	public loadingCtrl: LoadingController,
  	public ReffralServer: ReffralServerProvider,
  	) {
  }

	ionViewDidLoad() {

		this.customer_id = this.navParams.get("customer_id");

		
		let loading = this.loadingCtrl.create({
	    content: 'Please wait...'
	  	});
	  	loading.present();

	  	this.ReffralServer.GetInfomationUser(this.customer_id)
        .subscribe((data) => {
			if (data.status == 'complete')
			{
		  		this.infomation['email'] =  data.email;
		  		this.infomation['date_added'] =  data.date_added;
		  		this.infomation['investment'] =  data.investment;
		  		this.infomation['img_profile'] =  data.img_profile;
			}
			else
			{
				this.navCtrl.setRoot(HomePage);
			}
        })

        this.ReffralServer.GetMember(this.customer_id,0,5)
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
	goback() {
		this.navCtrl.setRoot(ReffralPage);
	}

	doInfinite(infiniteScroll : InfiniteScroll) {
	  	this.ReffralServer.GetMember(this.customer_id,this.history.length,5)
        .subscribe((data) => {
			if (data.length > 0)
			{
				for(let item of data) {
				  	this.history.push({
				  		"email" : item.email,
				        "level" : item.level,
				        "img_profile" : item.img_profile,
				        "active_email" : item.active_email,
				        "date_added" : item.date_added
				  	})
				}
			}
			infiniteScroll.complete();
			
        })
	}

	ViewInfomationUser(customer_id){
		this.navCtrl.push(UserDetailPage,{customer_id : customer_id});
	}
}
