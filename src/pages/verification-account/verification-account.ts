import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams ,AlertController ,ToastController,Platform} from 'ionic-angular';
import { LoginPage } from '../login/login';
import { HomePage } from '../home/home';


import { Storage } from '@ionic/storage';
import { LoadingController } from 'ionic-angular';
import { ReffralServerProvider } from '../../providers/reffral-server/reffral-server';
import { Camera } from '@ionic-native/camera';//CameraOptions
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { RegisterServerProvider } from '../../providers/register-server/register-server';
/**
 * Generated class for the VerificationAccountPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-verification-account',
  templateUrl: 'verification-account.html',
})
export class VerificationAccountPage {
	form ={};
	customer_id : any;
	infomation = {};
	img_camera = '';
	pintoggle : any;
  	img_passport_fontside = '';
  	img_passport_backside = '';
  	img_address = '';
	constructor(
		public navCtrl: NavController, 
	  	public navParams: NavParams,
	  	public storage: Storage,
	  	public loadingCtrl: LoadingController,
	  	public alertCtrl: AlertController,
	  	public ReffralServer: ReffralServerProvider,
	  	private camera: Camera,
	  	private camera1: Camera,
	  	private camera2: Camera,
	    private transfer: FileTransfer,
	  	public toastCtrl: ToastController,
	  	public platform: Platform,
	  	private RegisterServer: RegisterServerProvider,
	  	) {
	}
	private fileTransfer: FileTransferObject = this.transfer.create();

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
		        	loading.dismiss();
					if (data.status == 'complete')
					{
				  		this.infomation['img_address'] =  data.img_address;
				  		this.infomation['img_passport_fontside'] =  data.img_passport_fontside;
				  		this.infomation['img_passport_backside'] =  data.img_passport_backside;
				  		
				  		this.infomation['verification'] =  data.verification;

				  		if (data.date_birthday != '')
				  		{
				  			this['form']['first_name'] = data.firstname;
					  		this['form']['last_name'] = data.lastname;
					  		this['form']['birth_day'] = new Date(data.date_birthday).toISOString();
					  		this['form']['telephone'] = data.telephone;
					  		this['form']['address'] = data.address;
				  		}
					  		
					}
					else
					{
						this.navCtrl.setRoot(HomePage);
					}
		        })
			}
			else
			{
				this.navCtrl.setRoot(LoginPage);
			}
			
		});
	}	
	open_camera_passport_fontside()
	{
		this.camera.getPicture({
          quality: 50,
          destinationType: this.camera.DestinationType.FILE_URI,
          sourceType: this.camera.PictureSourceType.CAMERA,
          encodingType: this.camera.EncodingType.JPEG
      }).then((imageData) => {
          let options: FileUploadOptions = {
            fileKey: "file",
            fileName:imageData.substr(imageData.lastIndexOf('/') + 1),
            chunkedMode: false,
            mimeType: "image/jpg"
          }
          let loading = this.loadingCtrl.create({
            content: 'Please wait...'
          });
          loading.present();

          this.fileTransfer.upload(imageData,'https://api.buy-sellpro.co/api/upload-img-passport-fontside/'+this.customer_id, options)
          .then((data) => {
            loading.dismiss();
            this.AlertComplete('Successful update.');
            this.img_passport_fontside = 'https://api.buy-sellpro.co/static/img/upload/'+options.fileName;
          }, (err) => {
            loading.dismiss();
            this.AlertToast('Please try again.')
          })
      }, (err) => {
          this.AlertToast('Please try again.')
      });
	} 
	open_camera_passport_backside()
	{
		this.camera1.getPicture({
          quality: 50,
          destinationType: this.camera1.DestinationType.FILE_URI,
          sourceType: this.camera1.PictureSourceType.CAMERA,
          encodingType: this.camera1.EncodingType.JPEG
      }).then((imageData) => {
          let optionss: FileUploadOptions = {
            fileKey: "file",
            fileName:imageData.substr(imageData.lastIndexOf('/') + 1),
            chunkedMode: false,
            mimeType: "image/jpg"
          }
          let loading = this.loadingCtrl.create({
            content: 'Please wait...'
          });
          loading.present();

          this.fileTransfer.upload(imageData,'https://api.buy-sellpro.co/api/upload-img-passport-backside/'+this.customer_id, optionss)
          .then((data) => {
            loading.dismiss();
            this.AlertComplete('Successful update.');
            this.img_passport_backside = 'https://api.buy-sellpro.co/static/img/upload/'+optionss.fileName;
          }, (err) => {
            loading.dismiss();
            this.AlertToast('Please try again.')
          })
      }, (err) => {
          this.AlertToast('Please try again.')
      });
	}
	open_camera_address(){
		this.camera2.getPicture({
          quality: 50,
          destinationType: this.camera2.DestinationType.FILE_URI,
          sourceType: this.camera2.PictureSourceType.CAMERA,
          encodingType: this.camera2.EncodingType.JPEG
      }).then((imageData) => {
          let optionsss: FileUploadOptions = {
            fileKey: "file",
            fileName:imageData.substr(imageData.lastIndexOf('/') + 1),
            chunkedMode: false,
            mimeType: "image/jpg"
          }
          let loading = this.loadingCtrl.create({
            content: 'Please wait...'
          });
          loading.present();

          this.fileTransfer.upload(imageData,'https://api.buy-sellpro.co/api/upload-img-address/'+this.customer_id, optionsss)
          .then((data) => {
            loading.dismiss();
            this.AlertComplete('Successful update.');
            this.img_address = 'https://api.buy-sellpro.co/static/img/upload/'+optionsss.fileName;
          }, (err) => {
            loading.dismiss();
            this.AlertToast('Please try again.')
          })
      }, (err) => {
          this.AlertToast('Please try again.')
      });
	}


	SubmitForm() {
		
		
		if (this.form['first_name'] == undefined || this.form['first_name'] == '')
		{
			this.AlertToast('Please enter the first name');
		}
		else
		{
			if (this.form['last_name'] == undefined || this.form['last_name'] == '')
			{
				this.AlertToast('Please enter the last name');
			}
			else
			{
				if (this.form['birth_day'] == undefined || this.form['birth_day'] == '')
				{
					this.AlertToast('Please enter the birth day');
				}
				else
				{
					if (this.form['telephone']  == undefined || this.form['telephone'] == '')
					{
						this.AlertToast('Please enter the telephone');
					}
					else
					{
						if (this.form['address']  == undefined || this.form['address'] == '')
						{
							this.AlertToast('Please enter the address');
						}
						else
						{
							let loading = this.loadingCtrl.create({
							    content: 'Please wait...'
						  	});

						  	loading.present();

							this.RegisterServer.UpdateInfomation(this.customer_id,this.form['first_name'],this.form['last_name'],this.form['birth_day'],this.form['address'],this.form['telephone'])
					        .subscribe((data) => {
								if (data.status == 'complete')
								{
									loading.dismiss();
									this.AlertComplete(data.message);
									
									/*this.form['new_password'] = '';
									this.form['repeat_password'] = '';
									this.form['password'] = '';*/
								}
								else
								{
									loading.dismiss();
									this.AlertToast(data.message);
								}
					        },
					        (err) => {
					        	if (err)
					        	{
					        		loading.dismiss();
					        		this.SeverNotLogin();
					        	}
					        })
						}
						
					}
				}
			}
		}
	}

	AlertToast(message) {
      let toast = this.toastCtrl.create({
        message: message,
        position: 'top',
        duration : 2000,
        cssClass : 'error-submitform'
      });
      toast.present();
    }
	  AlertComplete(message) {
	    let toast = this.toastCtrl.create({
	      message: message,
	      position: 'top',
	      duration : 2000,
	      cssClass : 'alert_success'
	    });
	    toast.present();
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
}
