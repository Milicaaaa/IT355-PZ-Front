import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { UserService } from './userservice';
import { JwtHelperService } from '@auth0/angular-jwt';
import { User } from '../models/user';

interface LoginResponse {
  accessToken: string;
}

const token = localStorage.getItem('token')

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  constructor(private http: HttpClient, private userService: UserService,  private jwtHelper: JwtHelperService) {}

  login(username: string, password: string): Observable<LoginResponse> {
    console.log(username)
    return this.http.post<LoginResponse>(`http://localhost:8080/authenticate/login`, {
      username,
      password,
    });
  }

  getUser(){
    if (token === null) {
      return of(null);
    }
    try {
      const decodedToken: any = this.jwtHelper.decodeToken(token);
      return decodedToken.role;
    } catch (error) {
      console.error('Error decoding JWT token:', error);
    }
  }

  isAdmin(): boolean {
    if(this.getUser() === 'ROLE_ROLE_ADMIN'){
      return true;
    }else{
      return false;
    }
  }

  getToken(): string | null {
    const token = localStorage.getItem('token');
    return token !== null ? token : null;
  }
  
}
