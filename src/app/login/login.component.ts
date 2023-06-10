import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { User } from '../models/user';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  users!: User[];
  username!: string;
  password!: string;
  submitted = false;
  isInvalid: boolean = false;
  formGroup: FormGroup;

  ngOnInit(): void {
    this.formGroup = new FormGroup({
      username: new FormControl(null, [Validators.required]),
      password: new FormControl(null, [Validators.required]),
    });
  }

  constructor(private authService: AuthService, private router : Router) { }

  login(): void {
    this.submitted = true;
    let usernameValue = this.formGroup.controls?.['username']?.value;
    console.log(String(usernameValue))
    let passwordValue = this.formGroup.controls?.['password']?.value;
    this.authService.login(String(usernameValue), passwordValue).subscribe(
      (response) => {
        console.log(response)
        localStorage.setItem('token', response.accessToken);
        console.log('Login successful');
        this.router.navigate(['/home'])
        .then(() => {
          location.reload();
        });
      },
      (error) => {
        console.error('Login failed:', error);
      }
    );
  }

}
