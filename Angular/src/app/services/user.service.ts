import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { User } from '../models/user.model';

import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export interface UserData {
  users: User[],
  meta: {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  },
  links: {
    first: string;
    previous: string;
    next: string;
    last: string;
  }
};

@Injectable({
  providedIn: 'root'
})
export class UserService {
  selectedUser: User;
  readonly baseURL = 'http://localhost:3000/user';

  constructor(private http: HttpClient) { }

  deleteUser(_id: string) {
    return this.http.delete(this.baseURL + `/${_id}`);
  }

  putUser(user) {
    return this.http.put(this.baseURL + `/${user._id}`, user);
  }

  getUserList(page: Number, size: Number): Observable<UserData> {
    let params = new HttpParams();

    params = params.append('page', String(page));
    params = params.append('limit', String(size));

    return this.http.get(this.baseURL, { params }).pipe(
      map((userData: UserData) => userData),
      catchError(err => throwError(err))
    )
  }

  searchByEmail(email: string): Observable<UserData> {
    return this.http.post(this.baseURL + '/filter', {email}).pipe(
      map((userData: UserData) => userData),
      catchError(err => throwError(err))
    )
  }
}
