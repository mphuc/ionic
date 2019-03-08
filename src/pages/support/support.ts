import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,InfiniteScroll,Refresher,ToastController ,AlertController,Platform} from 'ionic-angular';
import { LoginPage } from '../login/login';
import { HomePage } from '../home/home';
import { SupportDetailPage } from '../support-detail/support-detail';
import { Storage } from '@ionic/storage';
import { LoadingController } from 'ionic-angular';
import { ExchangeServerProvider } from '../../providers/exchange-server/exchange-server';

/**
 * Generated class for the SupportPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-support',
  templateUrl: 'support.html',
})
export class SupportPage {
	form = {};
	customer_id :any;
	history : any;
	count_history = 0;
  constructor(
  	public navCtrl: NavController, 
  	public navParams: NavParams,
	public ExchangeServer: ExchangeServerProvider,
	public storage: Storage,
	public loadingCtrl: LoadingController,
	public toastCtrl: ToastController,
	public alertCtrl: AlertController,
	public platform: Platform,
		
  	
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

		        this.ExchangeServer.GetHisrorySupport(this.customer_id,0,5)
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

	SubmitForm() {
		
		if (this.form['title'] == null || this.form['title'] === "" )
		{
			this.AlertToast('Please enter the title of support content');
		}
		else
		{
			if (this.form['content'] == null || this.form['content'] === "")
			{
				this.AlertToast('Please enter support content');
			}
			else
			{
				let loadingss = this.loadingCtrl.create({
			    	content: 'Please wait...'
			  	});
			  	loadingss.present();
	          		
            	this.ExchangeServer.SupportSubmit(this.customer_id,this.form['title'],this.form['content'])
		        .subscribe((data) => {
					if (data.status == 'complete')
					{
				  		
            			loadingss.dismiss();
            			let toast = this.toastCtrl.create({
							message: 'Submit successful support information. We will reply you as soon as possible',
							position: 'top',
							duration : 5000,
							cssClass : 'alert_success'
						});
						toast.present();
            			this.form['content'] = '';
            			this.form['title'] = '';
            			
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

  	reLoadPage(){
		
        this.ExchangeServer.GetHisrorySupport(this.customer_id,0,5)
        .subscribe((data) => {
			if (data)
			{
				
		  		this.history =  data;
		  		this.count_history = data.length;
			}
			
        })
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
	
	doInfinite(infiniteScroll : InfiniteScroll) {
	  	this.ExchangeServer.GetHisrorySupport(this.customer_id,this.history.length,5)
        .subscribe((data) => {
			if (data.length > 0)
			{
				this.count_history = data.length;
				for(let item of data) {
				  	this.history.push({
				  		"_id" : item._id,
				  		"username" : item.username,
				        "message" : item.message,
				        "subject" : item.subject,
				        "status" : item.status,
				        "date_added" : item.date_added
				  	})
				}
			}
			infiniteScroll.complete();
			
        })
	}

	ViewDetailSupport(_id){
		this.navCtrl.push(SupportDetailPage,{'_id' : _id});
	}


	doRefresh(refresher: Refresher) {
		
		this.ExchangeServer.GetHisrorySupport(this.customer_id,0,5)
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
