import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingService } from 'src/service/loading/loading.service';
import { UserService } from 'src/service/user/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  data = {
    email: '',
    password: '',
  };

  msg = '';

  constructor(
    private user: UserService,
    private route: Router,
    private loadSerivce: LoadingService
  ) {}

  ngOnInit() {}

  onLogin() {
    if (!this.data.email || !this.data.password) {
      this.msg = 'ກະລຸນາປ້ອນຂໍ້ມູນໃຫ້ຄົບທຸກຊ່ອງ';
      return;
    } else if (!this.validateEmail(this.data.email)) {
      this.msg = 'ອີເມລ໌ບໍຖືກຕ້ອງ';
      return;
    }
    this.loadSerivce.onLoading();
    this.user
      .login({ email: this.data.email, password: this.data.password })
      .subscribe(
        async (res: any) => {
          this.loadSerivce.onDismiss();
          console.log(res);
          localStorage.setItem('token', res.data.token);
          this.data = {
            email: '',
            password: '',
          };
          this.msg = '';

          this.route.navigate(['/tabs/profile']);
        },
        (err: any) => {
          this.loadSerivce.onDismiss();
          console.log('err ', err);
          if (!err.error.success) {
            this.msg = `ອີເມລ໌ ຫຼື ລະຫັດຜ່ານບໍຖືກຕ້ອງ.`;
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
