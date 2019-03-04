import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,InfiniteScroll ,Refresher} from 'ionic-angular';
import { LoginPage } from '../login/login';
import { HomePage } from '../home/home';
import { UserDetailPage } from '../user-detail/user-detail';
import { Storage } from '@ionic/storage';
import { LoadingController } from 'ionic-angular';
import { ReffralServerProvider } from '../../providers/reffral-server/reffral-server';
/**
 * Generated class for the ReffralPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-reffral',
  templateUrl: 'reffral.html',
})
export class ReffralPage {
	customer_id :any;
	history : any;
	email = '';
	count_history = 0;
  constructor(
  	public navCtrl: NavController, 
  	public navParams: NavParams,
  	public storage: Storage,
  	public loadingCtrl: LoadingController,
  	public ReffralServer: ReffralServerProvider,
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


			  	this.ReffralServer.GetInfomationUser(this.customer_id)
		        .subscribe((data) => {
		        	
					if (data.status == 'complete')
					{
				  		this.email =  data.email;
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
			else
			{
				this.navCtrl.setRoot(LoginPage);
			}
			
		});
	}

	goback() {
		this.navCtrl.setRoot(HomePage);
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
		this.navCtrl.push(UserDetailPage,{'customer_id' : customer_id});
	}

	doRefresh(refresher: Refresher) {

		this.ReffralServer.GetInfomationUser(this.customer_id)
        .subscribe((data) => {
        	
			if (data.status == 'complete')
			{
		  		this.email =  data.email;
			}
			this.ReffralServer.GetMember(this.customer_id,0,5)
	        .subscribe((data) => {
				if (data)
				{
					
			  		this.history =  data;
			  		this.count_history = data.length;
				}
				refresher.complete();
	        })
        })
  	}
}
