import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertController, IonInfiniteScroll, PopoverController } from '@ionic/angular';
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

  onAdd() {
    if (!this.amount_money) {
      this.msg = 'ກະລຸນາປ້ອນຈຳນວນເງິນ!';
      return;
    } else if (this.amount_money % 1000 != 0 || this.amount_money <= 0) {
      this.msg = 'ຈຳນວນເງິນບໍຖືກຕ້ອງ!';
      return;
    } else {
      this.msg = '';
    }

    this.loadSerivce.onLoading();
    this.earn
      .addEarn(this.token, { money: this.amount_money })
      .subscribe((res: any) => {
        this.loadSerivce.onDismiss();

        console.log('earn data=>', res);
        this.amount_money = null;

        this.loadEarn();
      });
    this.popEarn = false;
  }

  onDel(earn_id: string, i: number) {
    console.log('id=>', earn_id, i);
    this.loadSerivce.onLoading();
    this.earn.deleteEarn(this.token, earn_id).subscribe((res: any) => {
      this.loadSerivce.onDismiss();

      console.log('delete earn=>', res);
      if (res.success) {
        this.loadEarn();
      }
    });
  }
  doRefresh(event) {
    setTimeout(() => {
      this.loadEarn();
      event.target.complete();
    }, 1000);
  }

  loadMore(e: any) {
    this.earn.getAllEarn(this.token, this.skip).subscribe(async (res: any) => {
      this.loadSerivce.onDismiss();

      console.log('all data=>', this.skip, res);
      if (res.success) {
        if (res.data.earn.length == 0) {
          const alert = await this.alertController.create({
            cssClass: '_div',
            header: 'ແຈ້ງເຕືອນ',
            message: 'ບໍ່ມີຂໍ້ມູນເພີ່ມເຕີມ!!!',
            buttons: ['ປິດ'],
          });
          await alert.present();
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

  async openPopIncome(ev:any){
    const popover = await this.popoverController.create({
      component: PopIncomeComponent,
      cssClass: 'pop-over-style',
      componentProps: {
        action:'earn'
      },
      event: ev,
      translucent: true,
    });
    popover.style.cssText = '--width: 94%';

    await popover.present();
  
    const { role } = await popover.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
    
    if (role == 'success') {      
      this.loadEarn()
    }
  }
}
