import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';

@Injectable({
  providedIn: 'root',
})
export class UserService extends ApiService {
  public url: string = this.getBaseUrl() + '/user';

  userInfo(token: string) {
    // const header = this.headerBase();
    return this.http.get(`${this.url}/info`, { headers: { token } });
  }

  register(data: any) {
    const header = this.headerBase();
    return this.http.post(`${this.url}/register`, data, header);
  }

  login(data: any) {
    return this.http.post(`${this.url}/login`, data);
  }
  logout(token: string) {
    return this.http.get(`${this.url}/logout`, { headers: { token } });
  }
  updateUser(token: string, data: any) {
    // const header = this.headerBase();

    return this.http.put(`${this.url}`, data, { headers: { token } });
  }
  changePassword(token: string, data: any) {
    return this.http.put(`${this.url}/change-password`, data, {
      headers: { token },
    });
  }
  deleteUser(token: string) {
    // const header = this.headerBase();
    return this.http.delete(`${this.url}`, { headers: { token } });
  }
  editImg(token: string, data: any) {
    return this.http.put(`${this.url}/image`, data, { headers: { token } });
  }
  editBgImg(token: string, data: any) {
    return this.http.put(`${this.url}/bg-image`, data, { headers: { token } });
  }
}
