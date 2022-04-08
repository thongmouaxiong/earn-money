import { Component, OnInit, ViewChild } from '@angular/core';
import {
  AlertController,
  IonInfiniteScroll,
  PopoverController,
} from '@ionic/angular';
import { IncomeService } from 'src/service/income/income.service';
import { LoadingService } from 'src/service/loading/loading.service';
import { PopIncomeComponent } from '../component/pop-income/pop-income.component';

@Component({
  selector: 'app-incomes',
  templateUrl: './incomes.page.html',
  styleUrls: ['./incomes.page.scss'],
})
export class IncomesPage implements OnInit {
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

  constructor(
    private income: IncomeService,
    private loadSerivce: LoadingService,
    private alertController: AlertController,
    public popoverController: PopoverController
  ) {}

  popIcome = false;
  data = { money: null, description: '' };
  msg = '';

  token = localStorage.getItem('token');

  incomeData = [];
  total = 0;
  skip = 1;

  month = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  year: Array<number> = [];

  sel_month: number;
  sel_year: number;

  sel_show: string;

  ngOnInit() {
    for (
      let index = new Date().getFullYear();
      index > new Date().getFullYear() - 7;
      index--
    ) {
      this.year = this.year.concat([index]);
    }
    this.sel_year = this.year[0];
    this.sel_month = new Date().getMonth() + 1;
    this.loadIncome();
  }

  loadIncome() {
    this.sel_show = 'ລາຍຮັບທັງໝົດ';

    this.loadSerivce.onLoading();

    this.income.getAllIncome(this.token, 0).subscribe((res: any) => {
      this.loadSerivce.onDismiss();
      console.log('all data=>', res);
      if (res.success) {
        this.incomeData = res.data.income;
        this.total = res.data.sum.sum;
        this.skip = 1;
      }
    });
  }

  onDel(income_id: string, i: number) {
    console.log('id=>', income_id, i);
    this.loadSerivce.onLoading();

    this.income.deleteIncome(this.token, income_id).subscribe((res: any) => {
      this.loadSerivce.onDismiss();
      console.log('delete income=>', res);
      if (res.success) {
        this.loadIncome();
      }
    });
  }
  doRefresh(event) {
    setTimeout(() => {
      this.skip = 1;
      this.loadIncome();
      event.target.complete();
    }, 1000);
  }

  loadMore(e: any) {
    this.income
      .getAllIncome(this.token, this.skip)
      .subscribe(async (res: any) => {
        this.loadSerivce.onDismiss();

        console.log('all data=>', this.skip, res);
        if (res.success) {
          if (res.data.income.length == 0) {
            const alert = await this.alertController.create({
              cssClass: '_div',
              header: 'ແຈ້ງເຕືອນ',
              message: 'ບໍ່ມີຂໍ້ມູນເພີ່ມເຕີມ!!!',
              buttons: ['ປິດ'],
            });
            await alert.present();
            return;
          }
          this.incomeData = this.incomeData.concat(res.data.income);
          this.total = res.data.sum.sum;
          this.skip += 1;
        }
      });
    setTimeout(() => {
      console.log('Done');
      e.target.complete();
      if (this.incomeData.length >= 1000) {
        e.target.disabled = true;
      }
    }, 500);
  }

  toggleInfiniteScroll() {
    this.infiniteScroll.disabled = !this.infiniteScroll.disabled;
  }

  onSelChange(e: any) {
    console.log(this.sel_year, this.sel_month);
    this.sel_show = `ລາຍຮັບປະຈຳເດືອນ ${this.sel_month} ປີ ${this.sel_year}`;

    this.skip = 0;
    this.loadSerivce.onLoading();
    this.income
      .getIncomeByDate(this.token, this.skip, this.sel_month, this.sel_year)
      .subscribe(
        (res: any) => {
          this.loadSerivce.onDismiss();
          console.log(res);

          if (res.success) {
            this.incomeData = res.data.income;
            this.total = res.data.total_money.sum;
            this.skip = 1;
          }
        },
        (err) => {
          console.log(err);
        }
      );
  }

  async openPopIncome(ev: any) {
    const popover = await this.popoverController.create({
      component: PopIncomeComponent,
      cssClass: 'pop',
      componentProps: {
        action: 'income',
      },
      event: ev,
      translucent: true,
    });
    popover.style.cssText = '--width: 94%';
    await popover.present();

    const { role } = await popover.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
    if (role == 'success') {
      this.loadIncome();
    }
  }
}
