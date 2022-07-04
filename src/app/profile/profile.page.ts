import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { LoadingService } from 'src/service/loading/loading.service';
import { UserService } from 'src/service/user/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  proInfo: any = {};
  password = {
    old: '',
    new: '',
  };
  maxUpload = 5 * 1024 * 1024;

  token = localStorage.getItem('token');

  img: any;
  bg_img: any;

  openPop = false;
  isEdit = false;
  isPwd = false;
  msg = '';
  constructor(
    private user: UserService,
    private route: Router,
    private toastController: ToastController,
    private alertController: AlertController,
    private loadSerivce: LoadingService
  ) {}

  ngOnInit() {
    this.loadProfile();
  }

  close() {
    this.openPop = false;
    this.isEdit = true;
  }

  async loadProfile() {
    this.loadSerivce.onLoading();
    this.user.userInfo(this.token).subscribe(
      async (res: any) => {
        this.loadSerivce.onDismiss();
        console.log('user info ', res.data);
        this.proInfo = res.data;
      },
      async (err) => {
        this.loadSerivce.onDismiss();

        console.log('err:', err);

        // if (!err.error.isAuth) {
          this.route.navigate(['/login']);
        // }
      }
    );
  }

  async onEdit() {
    if (!this.proInfo.firstname || !this.proInfo.lastname) {
      this.msg = 'ກະລຸນາປ້ອນຂໍ້ມູນໃຫ້ຄົບທຸກຊ່ອງ';
      return;
    } else {
      this.msg = '';
    }

    this.loadSerivce.onLoading();

    this.user
      .updateUser(this.token, {
        firstname: this.proInfo.firstname,
        lastname: this.proInfo.lastname,
      })
      .subscribe(async (res: any) => {
        console.log('edit res=>', res);
        if (res.success) {
          this.isEdit = false;
          this.loadSerivce.onDismiss();
          const alert = await this.alertController.create({
            cssClass: '_div',
            header: 'ແຈ້ງເຕືອນ',
            message: 'ແກ້ໄຂຂໍ້ມູນສ່ວນຕົວສຳເລັດ.',
            buttons: ['ປິດ'],
          });
          await alert.present();
          this.loadProfile();
        }
      });
  }

  async onChangePwd() {
    if (!this.password.old || !this.password.new) {
      this.msg = 'ກະລຸນາປ້ອນຂໍ້ມູນໃຫ້ຄົບທຸກຊ່ອງ';
      return;
    } else {
      this.msg = '';
    }
    this.loadSerivce.onLoading();
    this.user
      .changePassword(this.token, {
        oldPassword: this.password.old,
        newPassword: this.password.new,
      })
      .subscribe(
        async (res: any) => {
          this.loadSerivce.onDismiss();
          console.log('res data=>', res);

          if (res.success) {
            this.password = {
              old: '',
              new: '',
            };
            this.msg = '';
            this.isPwd = false;
            const alert = await this.alertController.create({
              cssClass: '_div',
              header: 'ແຈ້ງເຕືອນ',
              message: 'ປ່ຽນລະຫັດຜ່ານສຳເລັດ.',
              buttons: ['ປິດ'],
            });
            alert.present();
          }
        },
        async (err) => {
          console.log('error change pwd =>', err);

          this.loadSerivce.onDismiss();

          if (err.error.msg === 'Your old password is not match.') {
            this.msg = 'ລະຫັດຜ່ານເກົ່າບໍ່ຖືກຕ້ອງ';
          } else {
            this.msg = '';
          }
        }
      );
  }

  async logOut() {
    const confirm = await this.loadSerivce.alertConfirm('ຕ້ອງການອອກອອກຈາກລະບົບບໍ?');
    if (!confirm) return;
    this.user.logout(this.token).subscribe(
      async (res: any) => {
        if (res.success) {
          localStorage.setItem("token",'');
          this.route.navigate(['/login']);
        }
      },
      async (err) => {
        console.log(err.error);
        this.loadSerivce.onDismiss();
      }
    );
    this.openPop = false;
  }

  async selBgImg(e) {
    if (e.target.files) {
      if (e.target.files[0].size > this.maxUpload) {
        this.toastController
          .create({
            message:
              'File is too large, 5MB max ~' +
              e.target.files[0].size / 1024 / 1024 +
              'MB',
            duration: 3000,
          })
          .then((r) => {
            r.present();
          });
        return;
      }
      var reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);

      reader.onload = async (e: any) => {
        this.bg_img = e.target.result;
        console.log('one select file', this.bg_img);
        this.loadSerivce.onDismiss();
        this.user
          .editBgImg(this.token, {
            oldImg: this.proInfo.bg_image,
            newImg: this.bg_img,
          })
          .subscribe(async (res: any) => {
            console.log('bg img', res);
            if (res.success) {
              this.bg_img = '';
              this.loadSerivce.onDismiss();
              const alert = await this.alertController.create({
                cssClass: '_div',
                header: 'ແຈ້ງເຕືອນ',
                message: 'ແກ້ໄຂຮູບພື້ນຫຼັງສຳເລັດ.',
                buttons: ['ປິດ'],
              });
              alert.present();
              this.loadProfile();
            }
          });
      };
    }
  }
  async selImg(e) {
    if (e.target.files) {
      if (e.target.files[0].size > this.maxUpload) {
        this.toastController
          .create({
            message:
              'File is too large, 5MB max ~' +
              e.target.files[0].size / 1024 / 1024 +
              'MB',
            duration: 3000,
          })
          .then((r) => {
            r.present();
          });
        return;
      }
      var reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);

      reader.onload = async (e: any) => {
        this.img = e.target.result;
        console.log('one select file', this.bg_img);
        this.loadSerivce.onLoading();
        this.user
          .editImg(this.token, {
            oldImg: this.proInfo.image,
            newImg: this.img,
          })
          .subscribe(async (res: any) => {
            console.log('img', res);
            if (res.success) {
              this.bg_img = '';
              this.loadSerivce.onDismiss();
              const alert = await this.alertController.create({
                cssClass: '_div',
                header: 'ແຈ້ງເຕືອນ',
                message: 'ແກ້ໄຂຮູບໂປຣໄຟລ໌ສຳເລັດ.',
                buttons: ['ປິດ'],
              });
              alert.present();
              this.loadProfile();
            }
          });
      };
    }
  }
  doRefresh(event) {
    setTimeout(() => {
      this.loadProfile();
      event.target.complete();
    }, 1000);
  }
}
