import { Component,ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams,App ,ToastController} from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { SettingPage } from '../setting/setting';

/**
 * Generated class for the LockPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-createpin',
  templateUrl: 'createpin.html',
})
export class CreatepinPage {

  @ViewChild('myNav') nav: NavController;

	number1 : any;
	number2 : any;
	number3 : any;
	number4 : any;
	valpin : any;
  pin_keyboard : any;
  rootPage: any;
  constructor(
  	public navCtrl: NavController, 
  	public navParams: NavParams,
  	public storage: Storage,
    public app: App ,
    public toastCtrl: ToastController
    
  	) 
  {
    
   
    
  	this.valpin = 'val';
  	this.number1 = 'null';
  	this.number2 = 'null';
  	this.number3 = 'null';
  	this.number4 = 'null';
    this.pin_keyboard = 'val';
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LockPage');
  }

  Clicknumber(num : number){
  	this.valpin = 'val';
  	if (this.number4 == 'null' && this.number1 != 'null' && this.number2 != 'null' && this.number3 != 'null')
  	{
  		this.number4 = num;
      if (this.pin_keyboard == 'val')
      {
        this.pin_keyboard = String(this.number1)+String(this.number2)+String(this.number3)+String(this.number4);
        
        this.number1 = 'null';
        this.number2 = 'null';
        this.number3 = 'null';
        this.number4 = 'null';
        return false;
      }
      else
      {
        let pin_keyboard_repeat = String(this.number1)+String(this.number2)+String(this.number3)+String(this.number4);
        if (pin_keyboard_repeat != this.pin_keyboard) 
        {
          //this.valpin = 'empty';
          this.Pinin2one();
        }
        else
        {
          this.storage.set('StatusPinStorage', 'true');
          this.storage.set('PinStorage', this.pin_keyboard);
          this.app.getRootNav().setRoot( SettingPage );
        }
      }
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
  Pinin2one() {
    let toast = this.toastCtrl.create({
      message: 'Two pin codes do not match',
      position: 'bottom',
      duration : 1500,
      cssClass : 'errorqrcode'
      
    });
    toast.present();
  }
  goback() {
    this.app.getRootNav().setRoot( SettingPage );
  }
}
