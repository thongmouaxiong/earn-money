import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';

@Injectable({
  providedIn: 'root'
})
export class IncomeService extends ApiService {
  public url: string = this.getBaseUrl() + '/income';

  getAllIncome(token: string, skip: number = 0) {
    return this.http.get(`${this.url}s`, {
      headers: { token, skip: `${skip}` },
    });
  }
  getIncomeByDate(token: string, skip: number = 0, month:number, year:number) {
    return this.http.get(`${this.url}/by-date`, {
      headers: { token, skip: `${skip}`, month:`${month}`, year:`${year}` },
    });
  }

  addIncome(token: string, data: any) {
    return this.http.post(`${this.url}`, data, { headers: { token } });
  }
  deleteIncome(token: string, income_id: string) {
    return this.http.delete(`${this.url}/${income_id}`, { headers: { token } });
  }
}
