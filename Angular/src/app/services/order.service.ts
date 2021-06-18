import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Order } from '../models/order.model';


@Injectable({
  providedIn: 'root'
})
export class OrderService {
  selectedOrder: Order;
  orders: Order[];
  readonly baseURL = 'http://localhost:3000/order';
  readonly USER_ID = 'USER_ID';

  constructor(private http: HttpClient) { }

  postOrder(order: Order){
    let params = new HttpParams();

    params = params.append('user_id', localStorage.getItem(this.USER_ID));

    return this.http.post(this.baseURL, order, {params});
  }

  getOrderList(){
    let params = new HttpParams();

    params = params.append('user_id', localStorage.getItem(this.USER_ID));

    return this.http.get(this.baseURL, {params});
  }

  putOrder(order: Order){
    let params = new HttpParams();

    params = params.append('user_id', localStorage.getItem(this.USER_ID));

    return this.http.put(this.baseURL + `/${order._id}`, order, {params});
  }

  deleteOrder(_id: string){
    let params = new HttpParams();

    params = params.append('user_id', localStorage.getItem(this.USER_ID));

    return this.http.delete(this.baseURL + `/${_id}`, {params});
  }
}
