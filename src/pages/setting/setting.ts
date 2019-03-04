import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,AlertController ,ToastController} from 'ionic-angular';
import { LoginPage } from '../login/login';
import { HomePage } from '../home/home';
import { ChangePasswordPage } from '../change-password/change-password';

import { VerificationAccountPage } from '../verification-account/verification-account';

import { CreatepinPage } from '../createpin/createpin';

import { Storage } from '@ionic/storage';
import { LoadingController } from 'ionic-angular';
import { ReffralServerProvider } from '../../providers/reffral-server/reffral-server';
import { Camera } from '@ionic-native/camera';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
/**
 * Generated class for the SettingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-setting',
  templateUrl: 'setting.html',
})
export class SettingPage {
	customer_id : any;
	infomation = {};
	img_camera = '';
	pintoggle : any;
  	
  constructor(
  	public navCtrl: NavController, 
  	public navParams: NavParams,
  	public storage: Storage,
  	public loadingCtrl: LoadingController,
  	public alertCtrl: AlertController,
  	public ReffralServer: ReffralServerProvider,
  	private camera: Camera,
    private transfer: FileTransfer,
  	public toastCtrl: ToastController,
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


		        this.storage.get('StatusPinStorage')
			    .then((StatusPinStorage) => {
			      if (!StatusPinStorage || StatusPinStorage == 'false')
			      {
			        this.pintoggle = false;
			      } 
			      else
			      {
			        this.pintoggle = true;
			      }
			    });

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

	ViewChangepassword(){
		this.navCtrl.push(ChangePasswordPage);
	}
  ViewVerification()
  {
    this.navCtrl.push(VerificationAccountPage);
  }
  clickImage(){
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

          this.fileTransfer.upload(imageData,'https://api.buy-sellpro.co/api/upload-img-profile/'+this.customer_id, options)
          .then((data) => {
            loading.dismiss();
            this.AlertComplete('Successful update.');
            this.img_camera = 'https://api.buy-sellpro.co/static/img/upload/'+options.fileName;
          }, (err) => {
            loading.dismiss();
            this.AlertToast('Please try again.')
          })
      }, (err) => {
          this.AlertToast('Please try again.')
      });
  }

	presentConfirm_createPin() {
    let alert = this.alertCtrl.create({
      title: 'Confirm enable lock',
      message: 'Do you want to enable lock application authentication?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            this.pintoggle = false;
          }
        },
        {
          text: 'Enable',
          handler: () => {
          	this.navCtrl.setRoot(CreatepinPage);
            //this.app.getRootNav().setRoot( CreatepinPage );
          }
        }
      ]
    });
    alert.present();
  }
  UpdateStatusPin()
  {
    this.storage.get('StatusPinStorage')
    .then((StatusPinStorage) => {
      if (this.pintoggle)
      {
        if (!StatusPinStorage || StatusPinStorage == 'false')
        {
          this.presentConfirm_createPin();
        }
        
      } 
      else
      {
        if (StatusPinStorage == 'true')
        {
          this.presentConfirm_createPin_disaple();
        }
        
      }

    });
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

  presentConfirm_createPin_disaple() {
    let alert = this.alertCtrl.create({
      title: 'Confirm disable lock',
      message: 'Do you want to disable lock application authentication?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            this.pintoggle = true;
          }
        },
        {
          text: 'Disable',
          handler: () => {
            this.storage.set('StatusPinStorage', 'false'); 
          }
        }
      ]
    });
    alert.present();
  }
}
