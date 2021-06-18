import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './services/auth.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(
    private http: HttpClient,
    private route: Router,
    private authService: AuthService,
  ) {}
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (!request.url.includes('login') && !request.url.includes('register')) {
      request = request.clone({
        setHeaders: {
          'Content-Type': 'application/json',
          'auth-token': this.authService.getToken(),
        },
      });
    } else {
      request = request.clone({
        setHeaders: {
          'Content-Type': 'application/json',
        },
      });
    }

    return next.handle(request);
  }
}
