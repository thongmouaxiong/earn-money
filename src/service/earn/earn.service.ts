import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';

@Injectable({
  providedIn: 'root',
})
export class EarnService extends ApiService {
  public url: string = this.getBaseUrl() + '/earn';

  getAllEarn(token: string, skip: number = 0) {
    return this.http.get(`${this.url}s`, {
      headers: { token, skip: `${skip}` },
    });
  }

  addEarn(token: string, data: any) {
    return this.http.post(`${this.url}`, data, { headers: { token } });
  }
  deleteEarn(token: string, earn_id: string) {
    return this.http.delete(`${this.url}/${earn_id}`, { headers: { token } });
  }
  
}
