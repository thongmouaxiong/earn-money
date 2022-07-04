import { Component, OnInit, ViewChild } from '@angular/core';
import {
  AlertController,
  IonInfiniteScroll,
  PopoverController,
} from '@ionic/angular';
import { EarnService } from 'src/service/earn/earn.service';
import { LoadingService } from 'src/service/loading/loading.service';
import { PopIncomeComponent } from '../component/pop-income/pop-income.component';

@Component({
  selector: 'app-earn',
  templateUrl: './earn.page.html',
  styleUrls: ['./earn.page.scss'],
})
export class EarnPage implements OnInit {
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

  popEarn = false;
  amount_money: number;
  msg = '';

  token = localStorage.getItem('token');

  earnData = [];
  total = 0;
  skip = 1;

  constructor(
    private earn: EarnService,
    private loadSerivce: LoadingService,
    private alertController: AlertController,
    public popoverController: PopoverController
  ) {}

  ngOnInit() {
    this.loadEarn();
  }

  loadEarn() {
    this.loadSerivce.onLoading();
    this.earn.getAllEarn(this.token, 0).subscribe((res: any) => {
      this.loadSerivce.onDismiss();

      console.log('all data=>', res);
      if (res.success) {
        this.earnData = res.data.earn;
        this.total = res.data.sum.sum;
        this.skip = 1;
      }
    });
  }

  async onDel(earn_id: string, i: number) {
    console.log('id=>', earn_id, i);

    const confirm = await this.loadSerivce.alertConfirm('ຕ້ອງການລຶບອອກແທ້ບໍ?');

    if (!confirm) return;

    this.earn.deleteEarn(this.token, earn_id).subscribe((res: any) => {
      console.log('delete earn=>', res);
      if (res.success) {
        this.loadEarn();
      }
    });
  }
  doRefresh(event) {
    setTimeout(() => {
      this.infiniteScroll.disabled = false;
      this.loadEarn();
      event.target.complete();
    }, 1000);
  }

  loadMore(e: any) {
    this.earn.getAllEarn(this.token, this.skip).subscribe(async (res: any) => {
      this.loadSerivce.onDismiss();
      console.log('all data=>', this.skip, res);
      if (res.success) {
        if (!res.data.earn.length) {
          this.infiniteScroll.disabled = true;
          return;
        }
        this.earnData = this.earnData.concat(res.data.earn);
        this.total = res.data.sum.sum;
        this.skip += 1;
      }
    });
    setTimeout(() => {
      console.log('Done');
      e.target.complete();
      if (this.earnData.length >= 1000) {
        e.target.disabled = true;
      }
    }, 500);
  }

  toggleInfiniteScroll() {
    this.infiniteScroll.disabled = !this.infiniteScroll.disabled;
  }

  async openPopIncome(ev: any) {
    const popover = await this.popoverController.create({
      component: PopIncomeComponent,
      cssClass: 'pop-over-style',
      componentProps: {
        action: 'earn',
      },
      event: ev,
      translucent: true,
    });
    popover.style.cssText = '--width: 94%';

    await popover.present();

    const { role } = await popover.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);

    if (role == 'success') {
      this.loadEarn();
    }
  }
}
