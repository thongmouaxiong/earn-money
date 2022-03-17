import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertController, IonInfiniteScroll } from '@ionic/angular';
import { ExpensesService } from 'src/service/expenses/expenses.service';
import { LoadingService } from 'src/service/loading/loading.service';

@Component({
  selector: 'app-expenses',
  templateUrl: './expenses.page.html',
  styleUrls: ['./expenses.page.scss'],
})
export class ExpensesPage implements OnInit {
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

  openPop = false;
  data = { money: null, description: '' };
  msg = '';

  token = localStorage.getItem('token');

  expensesData = [];
  total = 0;
  skip = 1;

  month = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  year: Array<number> = [];

  sel_month: number;
  sel_year: number;

  constructor(
    private expenses: ExpensesService,
    private loadSerivce: LoadingService,
    private alertController: AlertController
  ) {}

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
    this.loadExpenses();
  }

  loadExpenses() {
    this.loadSerivce.onLoading();
    this.expenses.getAllExpenses(this.token, 0).subscribe((res: any) => {
      this.loadSerivce.onDismiss();

      console.log('all data=>', res);
      if (res.success) {
        this.expensesData = res.data.expenses;
        this.total = res.data.sum.sum;
        this.skip = 1;
      }
    });
  }

  onAdd() {
    if (!this.data.money || !this.data.description) {
      this.msg = 'ກະລຸນາປ້ອນຂໍ້ມູນໃຫ້ຄົບທຸກຊ່ອງ!';
      return;
    } else if (this.data.money % 1000 != 0 || this.data.money <= 0) {
      this.msg = 'ຈຳນວນເງິນບໍຖືກຕ້ອງ!';
      return;
    } else {
      this.msg = '';
    }
    this.loadSerivce.onLoading();
    this.expenses.addExpenses(this.token, this.data).subscribe((res: any) => {
      this.loadSerivce.onDismiss();

      console.log('expenses data=>', res);
      this.data = { money: null, description: '' };
      this.loadExpenses();
    });
    this.openPop = false;
  }

  onDel(expenses_id: string, i: number) {
    console.log('id=>', expenses_id, i);
    this.loadSerivce.onLoading();
    this.expenses
      .deleteExpenses(this.token, expenses_id)
      .subscribe((res: any) => {
        this.loadSerivce.onDismiss();

        console.log('delete expenses=>', res);
        if (res.success) {
          this.loadExpenses();
        }
      });
  }
  doRefresh(event) {
    setTimeout(() => {
      this.loadExpenses();
      event.target.complete();
    }, 1000);
  }

  loadMore(e: any) {
    this.expenses
      .getAllExpenses(this.token, this.skip)
      .subscribe(async (res: any) => {
        this.loadSerivce.onDismiss();

        console.log('all data=>', this.skip, res);
        if (res.success) {
          if (res.data.expenses.length == 0) {
            const alert = await this.alertController.create({
              cssClass: '_div',
              header: 'ແຈ້ງເຕືອນ',
              message: 'ບໍ່ມີຂໍ້ມູນເພີ່ມເຕີມ!!!',
              buttons: ['ປິດ'],
            });
            await alert.present();
            return;
          }
          this.expensesData = this.expensesData.concat(res.data.expenses);
          this.total = res.data.sum.sum;
          this.skip += 1;
        }
      });
    setTimeout(() => {
      console.log('Done');
      e.target.complete();
      if (this.expensesData.length >= 1000) {
        e.target.disabled = true;
      }
    }, 500);
  }

  toggleInfiniteScroll() {
    this.infiniteScroll.disabled = !this.infiniteScroll.disabled;
  }

  onSelChange(e: any) {
    console.log(this.sel_year, this.sel_month);
    this.skip = 0;
    this.loadSerivce.onLoading();
    this.expenses
      .getExpensesByDate(this.token, this.skip, this.sel_month, this.sel_year)
      .subscribe((res: any) => {
        this.loadSerivce.onDismiss();
        if (res.success) {
          this.expensesData = res.data.expenses;
          this.total = res.data.total_money.sum;
          this.skip = 1;
        }
      });
  }
}
