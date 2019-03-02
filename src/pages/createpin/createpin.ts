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

	passcode:any;
  pageStatus:any;
  codeone = null ;
  codetwo= null;
  codethree= null;
  codefour= null;
  int :any;
  newPincount :any;
  
  finalPin :any;
  fingerPin :any;
  constructor(
  	public navCtrl: NavController, 
  	public navParams: NavParams,
  	public storage: Storage,
    public app: App ,
    public toastCtrl: ToastController
    
  	) 
  {
    
   this.passcode = '';
    this.finalPin = '';
    
    this.pageStatus = "Enter Pin"
    this.int = 0;
    this.newPincount = 0;
    this.fingerPin = false;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LockPage');
  }

  add(value) {
    if(this.passcode.length < 4) {
          this.passcode = this.passcode + value;
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
                if(this.newPincount > 0){
                  if( this.finalPin == this.codeone.toString()+this.codetwo.toString()+this.codethree.toString()+this.codefour.toString()){
                    console.log(this.finalPin);
                    this.storage.set('StatusPinStorage', 'true');
                    this.storage.set('PinStorage', this.finalPin);
                    this.navCtrl.setRoot( SettingPage );
                    let toast = this.toastCtrl.create({
                      message: 'Create pin successfully',
                      position: 'top',
                      duration : 2000,
                      cssClass : 'alert_success'
                    });
                    toast.present();
                  }else{
                    this.AlertToast('Two Pin passwords do not match.');
                  }
                }else
                {
                  this.pageStatus = "Confirm Pin"
                  this.newPincount++ 
                  this.finalPin = this.codeone.toString()+this.codetwo.toString()+this.codethree.toString()+this.codefour.toString()
                  this.codeone = null;
                  this.codetwo= null;
                  this.codethree = null;
                  this.codefour = null;
                  this.passcode = '';
                  this.int = 0
                
                }    
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
