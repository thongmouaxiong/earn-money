import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})

export class ApiService {

  constructor(public http: HttpClient) { }

  protected getBaseUrl(): string {
    // return "http://localhost:3002/api"
    return "https://money--save.herokuapp.com/api"
  }

  // protected headerBase(m:string=""): any {
  protected headerBase(): any {
    const token = localStorage.getItem('token');
    const myheader = new HttpHeaders({ 'Content-Type': 'application/json'})
    .set('token', token)
    // .set("skip", skip);
    return myheader;
  }
}
