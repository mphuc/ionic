import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,App,LoadingController,ToastController} from 'ionic-angular';
import { Storage } from '@ionic/storage';
//import { TabsPage } from '../tabs-page/tabs-page';
//import { TranslateService } from '@ngx-translate/core';
/**
 * Generated class for the LockPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-lock',
  templateUrl: 'lock.html',
})
export class LockPage {
	number1 : any;
	number2 : any;
	number3 : any;
	number4 : any;
	valpin : any;
  constructor(
  	public navCtrl: NavController, 
  	public navParams: NavParams,
  	public storage: Storage,
  	public app: App,
  	public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    //public translateService: TranslateService
  	) 
  {

    /*this.storage.get('Language').then((Language) => {
      this.translateService.use(Language);
    });*/

  	this.valpin = 'val';
  	this.number1 = 'null';
  	this.number2 = 'null';
  	this.number3 = 'null';
  	this.number4 = 'null';
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LockPage');
  }

  Clicknumber(num : number){
  	this.valpin = 'val';
  	if (this.number4 == 'null' && this.number1 != 'null' && this.number2 != 'null' && this.number3 != 'null')
  	{
  		this.number4 = num;

  		let pin_keyboard = String(this.number1)+String(this.number2)+String(this.number3)+String(this.number4);

  		this.storage.get('PinStorage')
	      .then((pin) => {
	          if (pin != pin_keyboard)
	          {
	          	//this.valpin = 'empty';
              this.Pinincorrectly();
	          	this.number1 = 'null';
	          	this.number2 = 'null';
	          	this.number3 = 'null';
	          	this.number4 = 'null';
	          }
	          else
	          {
	          	  let loader = this.loadingCtrl.create({
			        content: "Please wait...",
			        duration: 1000
			      });
			      loader.present();
	          	  //this.app.getRootNav().setRoot( TabsPage );
	          }
	      });

  	}

  	if (this.number3 == 'null' && this.number1 != 'null' && this.number2 != 'null')
  	{
  		this.number3 = num;
  	}

  	if (this.number2 == 'null' && this.number1 != 'null')
  	{
  		this.number2 = num;
  	}
  	if (this.number1 == 'null')
  	{
  		this.number1 = num;
  	}
  }
  Blackspace()
  {

  	if (this.number1 != 'null' && this.number2 == 'null' && this.number3 == 'null' && this.number4 == 'null')
  	{
  		this.number1 = 'null';
  	}

  	if (this.number2 != 'null' && this.number3 == 'null' && this.number4 == 'null')
  	{
  		this.number2 = 'null';
  	}

  	if (this.number3 != 'null' && this.number4 == 'null')
  	{
  		this.number3 = 'null';
  	}
  	if (this.number4 != 'null')
  	{
  		this.number4 = 'null';
  	}

  }


  Pinincorrectly() {
    let toast = this.toastCtrl.create({
      message: 'Pin entered incorrectly',
      position: 'bottom',
      duration : 1500,
      cssClass : 'errorqrcode'
      
    });
    toast.present();
  }
}
