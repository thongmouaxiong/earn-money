import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';

@Injectable({
  providedIn: 'root'
})
export class ExpensesService extends ApiService {
  public url: string = this.getBaseUrl() + '/expenses';

  getAllExpenses(token: string, skip: number = 0) {
    return this.http.get(`${this.url}`, {
      headers: { token, skip: `${skip}` },
    });
  }
  getExpensesByDate(token: string, skip: number = 0, month:number, year:number) {
    return this.http.get(`${this.url}/by-date`, {
      headers: { token, skip: `${skip}`, month:`${month}`, year:`${year}` },
    });
  }

  addExpenses(token: string, data: any) {
    return this.http.post(`${this.url}`, data, { headers: { token } });
  }
  deleteExpenses(token: string, expenses_id: string) {
    return this.http.delete(`${this.url}/${expenses_id}`, { headers: { token } });
  }
}
