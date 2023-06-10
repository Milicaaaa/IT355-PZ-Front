import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  template: `
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
  <div class="container-fluid">
    <a class="navbar-brand" href="#">RAWG</a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <ul class="navbar-nav me-auto mb-2 mb-lg-0">
        <li class="nav-item">
          <a class="nav-link" aria-current="page" [routerLink]="['/home']" href="#">Home</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" aria-current="page" [routerLink]="['/games']" href="#">Games</a>
        </li>
        <li class="nav-item">
        <a class="nav-link" *ngIf="!isAuthenticated" aria-current="page" [routerLink]="['/login']" href="#">Login</a>
        </li>
        <li class="nav-item">
        <a class="nav-link" *ngIf="!isAuthenticated" aria-current="page" [routerLink]="['/register']" href="#">Register</a>
        </li>
        <li class="nav-item">
        <a class="nav-link" *ngIf="isAuthenticated" aria-current="page" [routerLink]="['/favorites']" href="#">Favorites</a>
        </li>
        <li class="nav-item">
        <a class="nav-link" *ngIf="isAdmin" aria-current="page" [routerLink]="['/addGame']" href="#">Add new game</a>
        </li>
        <li class="nav-item">
        <app-logout></app-logout>
        </li>
      </ul>
      <!-- <app-search></app-search> -->
    </div>
  </div>
</nav>
<router-outlet ></router-outlet>
<app-footer></app-footer>  
  `
})
export class AppComponent {
  title = 'RAWG';

  isAuthenticated: boolean;
  isAdmin: boolean;

  constructor(public http: HttpClient, private authService: AuthService ) {
    this.isAuthenticated = !!localStorage.getItem('token');
    this.isAdmin = this.authService.isAdmin()
  }

  public connectServer() {
    this.http.get('url')
      .subscribe(
        data => console.log(data),
        err => console.log(err)
      );
  }
}
