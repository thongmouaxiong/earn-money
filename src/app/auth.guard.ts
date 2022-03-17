import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from 'src/service/user/user.service';
import { AuthService } from '../service/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private _authService: AuthService,
    private _router: Router,
    private user: UserService
  ) {}
  canActivate(): boolean {
    console.log('auth guard ', this._authService.loggedIn());

    if (this._authService.loggedIn()) {
      return true;
    }  else {
      console.log('else guard');

      this._router.navigate(['/login']);
      return false;
    }
  }
}
