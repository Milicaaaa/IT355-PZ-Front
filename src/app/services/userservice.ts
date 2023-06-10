import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, map, of } from 'rxjs';
import { User } from '../models/user';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Status } from '../models/status';
import { LoginResponseModel } from '../models/login-response';
import { JwtHelperService } from '@auth0/angular-jwt';

const token = localStorage.getItem('token')
const headers = new HttpHeaders()
  .set('Authorization', `Bearer ${token}`)
  .set('Content-Type', 'application/json')
  .set('Access-Control-Allow-Origin', '*');

@Injectable({
  providedIn: 'root'
})
export class UserService {

  isUserLoggedIn = new BehaviorSubject<boolean>(false)
  apiurl = ' http://localhost:8080/users';
  user: User;

  private baseUrl = environment.baseUrl + '/authenticate';
  constructor(private http: HttpClient, private jwtHelper: JwtHelperService) {

  }

  login(model: User) {
    return this.http.post<LoginResponseModel>(this.baseUrl + '/login', model);
  }

  signup(model: User) {
    return this.http.post<Status>(this.baseUrl + '/registration', model);
  }

  findUser(username: string) {
    return this.http.get<User>(`http://localhost:8080/api/user/${username}`, { headers })
  }

  chagePassword(model: User) {
    return this.http.post<Status>(this.baseUrl + '/chagepassword', model);
  }

  getUserIdFromToken(token: string | null): Observable<string | null> {
    if (token === null) {
      return of(null);
    }
    try {
      const decodedToken: any = this.jwtHelper.decodeToken(token);
  
      return this.findUser(decodedToken.username).pipe(
        map((response) => {
          console.log(response.id);
          return response.id;
        })
      );
    } catch (error) {
      console.error('Error decoding JWT token:', error);
      return of(null);
    }
  }

  register(data: User) {

    this.http.post("http://localhost:8080/authenticate/register", data).subscribe(
      (result: any) => {
        console.log("Registered")
      }
    );
  }

}

