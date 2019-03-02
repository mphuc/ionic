import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,AlertController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { HomePage } from '../home/home';
import { ChangePasswordPage } from '../change-password/change-password';
import { CreatepinPage } from '../createpin/createpin';

import { Storage } from '@ionic/storage';
import { LoadingController } from 'ionic-angular';
import { ReffralServerProvider } from '../../providers/reffral-server/reffral-server';
import { Camera, CameraOptions } from '@ionic-native/camera';
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
  	private camera: Camera
  	
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


	clickImage()
	{

		const options: CameraOptions = {
		  quality: 100,
		  destinationType: this.camera.DestinationType.FILE_URI,
		  encodingType: this.camera.EncodingType.JPEG,
		  mediaType: this.camera.MediaType.PICTURE
		}


		this.camera.getPicture(options).then((imageData) => {
		 let base64Image = 'data:image/jpeg;base64,' + imageData;
		 this.img_camera = base64Image;
		 	this.ReffralServer.UpdateImgProfile(this.customer_id,base64Image)
	        .subscribe((data) => {
	        	
	        })
		}, (err) => {
		 // Handle error
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
