import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit {

  isAuthenticated: boolean;

  constructor(private router: Router) {
    this.isAuthenticated = !!localStorage.getItem('token');
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/home'])
    .then(() => {
      location.reload();
    });
  }

  ngOnInit(): void {
  }

}
