import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    console.log("Poziva se interceptor")
    const token = this.authService.getToken();
    if (token) {
      console.log("Poziva se interceptor")
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
            'Access-Control-Allow-Origin': '*', 
        },
      });
    }
    return next.handle(request);
  }
}
