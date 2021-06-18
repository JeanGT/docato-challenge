import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  selectedUser: User;
  readonly baseURL = 'http://localhost:3000';
  readonly AUTH_TOKEN = 'AUTH_TOKEN';
  readonly USER_ID = 'USER_ID';

  constructor(private http: HttpClient) { }

  register(user: User){
    return this.http.post(this.baseURL + '/user/register', user);
  }

  login(user: User){
    return this.http.post(this.baseURL + '/login', user);
  }

  doLoginUser(res){
    this.storeToken(res.token, res.user_id);
  }

  storeToken(token, user_id){
    localStorage.setItem(this.AUTH_TOKEN, token);
    localStorage.setItem(this.USER_ID, user_id);
  }

  isLoggedIn() {
    return !!this.getToken();
  }

  getToken() {
    return localStorage.getItem(this.AUTH_TOKEN);
  }

  logout() {
    localStorage.removeItem(this.AUTH_TOKEN);
  }
}
