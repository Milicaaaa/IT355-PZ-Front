import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../models/user';
import { UserService } from '../services/userservice';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  user: User = {} as User;
  userName!: string;
  surname!: string;
  email!: string;
  username!: string;
  password: string = '';
  formGroup: FormGroup;


  constructor(private userService: UserService, private router: Router) { }

  passwordValidator(control: FormControl) {
    const hasUpperCase = /[A-Z]/.test(control.value);
    const hasLowerCase = /[a-z]/.test(control.value);
    const hasNumber = /\d/.test(control.value);
    const hasSpecial = /[!@#\$%\^&\*]/.test(control.value);
    const isValid = hasUpperCase && hasLowerCase && hasNumber && hasSpecial && control.value.length >= 6;
    return isValid ? null : { passwordInvalid: true };
  }

  ngOnInit(): void {
    this.formGroup = new FormGroup({
      userName: new FormControl(null, [Validators.required, Validators.pattern('[a-zA-Z ]*')]),
      surname: new FormControl(null, [Validators.required, Validators.pattern('[a-zA-Z ]*')]),
      email: new FormControl(null, [Validators.required, Validators.email]),
      username: new FormControl(null, [Validators.required, Validators.min(6)]),
      password: new FormControl(null, [Validators.required])
    })

    this.formGroup.controls['userName'].updateValueAndValidity();
    this.formGroup.controls['surname'].updateValueAndValidity();
    this.formGroup.controls['email'].updateValueAndValidity();
    this.formGroup.controls['username'].updateValueAndValidity();
    this.formGroup.controls['password'].updateValueAndValidity();
    this.formGroup.controls['password'].statusChanges.subscribe(status => {
      console.log(status);
    });
  }



  register() {
    console.log(this.formGroup.errors)
    if (this.formGroup.valid) {
      this.user.firstname = this.formGroup.controls?.['userName']?.value
      this.user.surname = this.formGroup.controls?.['surname']?.value
      this.user.email = this.formGroup.controls?.['email']?.value
      this.user.username = this.formGroup.controls?.['username']?.value
      this.user.password = this.formGroup.controls?.['password']?.value
  
      this.user.favorites = []
      this.userService.register(this.user)
      window.alert("Successful user registration!");
      this.router.navigate(['/login'])
    }

  }

}
