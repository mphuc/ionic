import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ToastController } from 'ionic-angular';

import { NgForm } from '@angular/forms';

import { RegisterServerProvider } from '../../providers/register-server/register-server';

import { LoginPage } from '../login/login';
import { ActiveCodePage } from '../active-code/active-code';
import { LoadingController } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
/**
 * Generated class for the RegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {
	form = {};
	validateform = true;
	errorlog = '';
	scannedCode : any;
	customer_sponser = '';
	constructor(
		public navCtrl: NavController, 
		public navParams: NavParams,
		public loadingCtrl: LoadingController,
		private RegisterServer: RegisterServerProvider,
		private barcodeScanner: BarcodeScanner,
		public toastCtrl: ToastController,
	) 
	{

	}

	goback() {
		this.navCtrl.setRoot(LoginPage);
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad RegisterPage');
	}
	
	validateEmail(email) {
	  var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
	  return regex.test(email);
	}
	SubmitForm() {
		this.validateform = true;
		
		if (this.validateEmail(this.form['email']))
		{
			if (this.form['password'] == this.form['re_password'] && this.form['password'] != undefined && this.form['password'] != '')
			{
				
				let loading = this.loadingCtrl.create({
				    content: 'Please wait...'
			  	});

			  	loading.present();

				this.RegisterServer.Signup(this.form['email'],this.form['password'],this.customer_sponser)
		        .subscribe((data) => {
					if (data.status == 'complete')
					{
						loading.dismiss();
						
						this.navCtrl.push(ActiveCodePage,{email : this.form['email']});
					}
					else
					{
						loading.dismiss();
						this.validateform = false;
						this.errorlog = data.message;
					}
		        })
			}
			else
			{
				this.validateform = false;
				this.errorlog = 'The password you entered does not match';
			}
		}
		else
		{
			this.validateform = false;
			this.errorlog = 'Your email is not properly formatted';
		}
	}


	scanCode() {
    
	    this.barcodeScanner.scan({
	      preferFrontCamera : false,
	      showFlipCameraButton : true,
	      showTorchButton : true,
	      disableSuccessBeep : true,
	      prompt : ''
	    }).then(barcodeData => {
	      this.scannedCode = barcodeData.text;
	      
	      let string = barcodeData.text;
	      let string_slip = string.split("_");
	      this.customer_sponser = string_slip[0].slice(9);
	      
	      
		    let toast = this.toastCtrl.create({
		      message: 'Scan successful QR code',
		      position: 'bottom',
		      duration : 2000,
		      cssClass : 'successqrcode'
		      
		    });
		    toast.present();
		  
  		  
	    }, (err) => {
	        this.noQrcode();
	        console.log('Error: ', err);
	    });
	  }

	  noQrcode() {
	    let toast = this.toastCtrl.create({
	      message: 'Error Qrcode',
	      position: 'bottom',
	      duration : 2000,
	      cssClass : 'errorqrcode'
	      
	    });
	    toast.present();
	  }
}
