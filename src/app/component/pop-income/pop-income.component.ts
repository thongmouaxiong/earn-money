import { Component, Input, OnInit } from '@angular/core';
import { AlertController, PopoverController } from '@ionic/angular';
import { EarnService } from 'src/service/earn/earn.service';
import { ExpensesService } from 'src/service/expenses/expenses.service';
import { IncomeService } from 'src/service/income/income.service';
import { LoadingService } from 'src/service/loading/loading.service';

@Component({
  selector: 'app-pop-income',
  templateUrl: './pop-income.component.html',
  styleUrls: ['./pop-income.component.scss'],
})
export class PopIncomeComponent implements OnInit {
  @Input() action: string;

  constructor(
    private pop: PopoverController,
    private earn: EarnService,
    private loadSerivce: LoadingService,
    private alertController: AlertController,
    private income: IncomeService,
    private expenses: ExpensesService
  ) {}

  amount_earn: number;
  amount_income = 0;
  amount_expenses = 0;

  data_income = { money: null, description: '' };
  data_expenses = { money: null, description: '' };

  msg = '';

  token = localStorage.getItem('token');

  ngOnInit() {
    console.log('action ', this.action);
  }

  onSave() {
    if (this.action == 'earn') {
      this.AddEarn();
    } else if (this.action == 'income') {
      this.AddIncome();
    } else if (this.action == 'expenses') {
      this.AddExpenses();
    }
  }

  AddEarn() {
    if (!this.amount_earn) {
      this.msg = 'ກະລຸນາປ້ອນຈຳນວນເງິນ!';
      return;
    } else if (this.amount_earn % 1000 != 0 || this.amount_earn <= 0) {
      this.msg = 'ຈຳນວນເງິນບໍຖືກຕ້ອງ!';
      return;
    } else {
      this.msg = '';
    }

    this.loadSerivce.onLoading();
    this.earn.addEarn(this.token, { money: this.amount_earn }).subscribe(
      async (res: any) => {
        this.loadSerivce.onDismiss();
        console.log('earn data=>', res);
        this.amount_earn = null;

        const alert = await this.alertController.create({
          cssClass: '_div',
          header: 'ແຈ້ງເຕືອນ',
          message: 'ອອນເງິນເຂົ້າກະເປົ໋າສຳເລັດ.',
          buttons: ['ປິດ'],
        });
        await alert.present();

        this.pop.dismiss({ success: true }, 'success');
      },
      (err) => {
        this.loadSerivce.onDismiss();
        console.log('error=>', err);
      }
    );
  }

  AddIncome() {
    if (!this.data_income.money || !this.data_income.description) {
      this.msg = 'ກະລຸນາປ້ອນຂໍ້ມູນໃຫ້ຄົບທຸກຊ່ອງ!';
      return;
    } else if (
      this.data_income.money % 1000 != 0 ||
      this.data_income.money <= 0
    ) {
      this.msg = 'ຈຳນວນເງິນບໍຖືກຕ້ອງ!';
      return;
    } else {
      this.msg = '';
    }
    this.loadSerivce.onLoading();

    this.income
      .addIncome(this.token, this.data_income)
      .subscribe(async (res: any) => {
        this.loadSerivce.onDismiss();
        console.log('income data_income=>', res);
        this.data_income = { money: null, description: '' };
        const alert = await this.alertController.create({
          cssClass: '_div',
          header: 'ແຈ້ງເຕືອນ',
          message: 'ເພີ່ມລາຍຮັບສຳເລັດ.',
          buttons: ['ປິດ'],
        });
        await alert.present();

        this.pop.dismiss({ success: true }, 'success');
      });
  }
  AddExpenses() {
    if (!this.data_expenses.money || !this.data_expenses.description) {
      this.msg = 'ກະລຸນາປ້ອນຂໍ້ມູນໃຫ້ຄົບທຸກຊ່ອງ!';
      return;
    } else if (
      this.data_expenses.money % 1000 != 0 ||
      this.data_expenses.money <= 0
    ) {
      this.msg = 'ຈຳນວນເງິນບໍຖືກຕ້ອງ!';
      return;
    } else {
      this.msg = '';
    }
    this.loadSerivce.onLoading();
    this.expenses
      .addExpenses(this.token, this.data_expenses)
      .subscribe(async (res: any) => {
        this.loadSerivce.onDismiss();

        console.log('expenses data_expenses=>', res);
        this.data_expenses = { money: null, description: '' };
        const alert = await this.alertController.create({
          cssClass: '_div',
          header: 'ແຈ້ງເຕືອນ',
          message: 'ເພີ່ມລາຍຈ່າຍສຳເລັດ.',
          buttons: ['ປິດ'],
        });
        await alert.present();

        this.pop.dismiss({ success: true }, 'success');
      });
  }
}
