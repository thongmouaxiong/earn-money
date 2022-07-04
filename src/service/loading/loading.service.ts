import { Injectable } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  constructor(public loadingCtrl: LoadingController, public alertController:AlertController) {}

  load: any;

  async onLoading() {
    console.log('is loading');

    this.load = this.loadingCtrl.create({
      spinner: 'bubbles',
      duration: 0,
      message: 'ກຳລັງໂຫລດຂໍ້ມູນ...',
      translucent: true,
      cssClass: 'custom-class custom-loading',
    });
    (await this.load).present();
  }

  async onDismiss() {
    (await this.load).dismiss();
  }

  async onAlert(text){
    const alert = await this.alertController.create({
      header: 'ແຈ້ງເຕືອນ',
      message: text,
      buttons: ['OK']
    });
    await alert.present();
  }
  
  async alertError(text){
    const alert = await this.alertController.create({
      header: 'ເກີດຂໍ້ຜິດພາດ',
      message: text,
      buttons: ['OK']
    });
    await alert.present();
  }

  async alertConfirm(text:string):Promise<boolean> {
    let confirm:boolean
    const alert = await this.alertController.create({
      header: 'ແຈ້ງເຕືອນ!',
      message: text,
      buttons: [
        {
          text: 'ຍົກເລີກ',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            alert.dismiss({confirm: false})
            confirm = false
          }
        }, {
          text: 'ຕົກລົງ',
          handler: () => {
            alert.dismiss({confirm: true})
            confirm = true
          }
        }
      ]
    });
    await alert.present();
    await alert.onWillDismiss()
    return confirm
  }
}
