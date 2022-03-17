import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { LoadingService } from 'src/service/loading/loading.service';
import { UserService } from 'src/service/user/user.service';
@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  data = {
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    confirm_password: '',
  };

  msg = '';
  open = false;

  constructor(
    private user: UserService,
    private route: Router,
    private alert: AlertController,
    private loadSerivce: LoadingService
  ) {}

  ngOnInit() {}

  onRegister() {
    if (
      !this.data.firstname ||
      !this.data.lastname ||
      !this.data.email ||
      !this.data.password ||
      !this.data.confirm_password
    ) {
      this.msg = 'ກະລຸນາປ້ອນຂໍ້ມູນໃຫ້ຄົບທຸກຊ່ອງ';
      return;
    } else if (!this.validateEmail(this.data.email)) {
      this.msg = 'ອີເມລ໌ບໍຖືກຕ້ອງ';
      return;
    } else if (this.data.password !== this.data.confirm_password) {
      this.msg = 'ລະຫັດຜ່ານບໍຕົງກັນ';
      return;
    } else if (this.data.password.length < 4) {
      this.msg = 'ລະຫັດຜ່ານຕ້ອງຍາວກວ່າ 4 ຕົວອັກສອນ';
      return;
    } else {
      this.msg = '';
    }

    this.loadSerivce.onLoading();
    this.user.register(this.data).subscribe(
      async (res: any) => {
        this.loadSerivce.onDismiss();
        console.log(res);
        if (res.success) {
          this.data = {
            firstname: '',
            lastname: '',
            email: '',
            password: '',
            confirm_password: '',
          };
          this.msg = '';
          const alt = await this.alert.create({
            cssClass: '_div',
            header: 'ແຈ້ງເຕືອນ',
            message: 'ລົງທະບຽນສຳເລັດແລ້ວ.',
            buttons: [
              {
                text: 'ເຂົ້າສູ່ລະບົບ',
                handler: () => {
                  this.route.navigate(['/login']);
                },
              },
            ],
          });
          alt.present();
        }
      },
      (err) => {
        this.loadSerivce.onDismiss();

        console.log('err ', err);
        if (err.error.msg === 'this email is already in use.') {
          this.msg = `ອີເມລ໌ ${this.data.email} ມີຄົນໃຊ້ແລ້ວ.`;
          return;
        }
      }
    );
  }

  validateEmail(email: any) {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  }
}
