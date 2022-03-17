import { Injectable } from '@angular/core';
import { UserService } from './user/user.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor() {}

  loggedIn(){
    return !!localStorage.getItem('token')
  }
}
