import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  constructor(public loadingCtrl: LoadingController) {}

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
}
