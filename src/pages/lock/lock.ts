import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,App,LoadingController,ToastController} from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { HomePage } from '../home/home';
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
	passcode:any;
 
  codeone = null ;
  codetwo= null;
  codethree= null;
  codefour= null;
  int :any;
  
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

  	this.passcode = '';
    this.int = 0;
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LockPage');
  }

  add(value){
  	if(this.passcode.length < 4) {
      this.passcode = this.passcode + value.toString();
      if(this.int == 0){
        this.codeone = value;
        this.int++
      }else if(this.int == 1){
        this.codetwo = value;
        this.int++
      }else if(this.int == 2){
        this.codethree = value;
        this.int++
      }else if(this.int == 3){
        this.codefour = value;
        this.int++
      }
      if(this.passcode.length == 4) {
        this.storage.get('PinStorage')
        .then((pin) => {
            if (this.passcode != pin)
            {
              //this.valpin = 'empty';
              this.AlertToast('Pin entered incorrectly');
              this.codeone = null;
              this.codetwo= null;
              this.codethree = null;
              this.codefour = null;
              this.passcode = '';
              this.int = 0
            }
            else
            {
              
                this.navCtrl.setRoot(HomePage);
            }
        });    
      }
    }

  }
  delete() {
      if(this.passcode.length > 0) {
            if(this.passcode.length == 1){
          this.codeone = null
          this.int--
        }else if(this.passcode.length == 2){
          this.codetwo = null;
          this.int--
        }else if(this.passcode.length == 3){
          this.codethree = null;
          this.int--
        }else if(this.passcode.length == 4){
          this.codefour = null;
          this.int--
        }
            this.passcode = this.passcode.substr(0, this.passcode.length - 1);
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
