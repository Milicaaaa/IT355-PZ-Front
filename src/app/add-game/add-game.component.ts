import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-game',
  templateUrl: './add-game.component.html',
  styleUrls: ['./add-game.component.css']
})
export class AddGameComponent implements OnInit {

  gameForm: FormGroup;
  // showAlert: boolean = false;
  constructor(private formBuilder: FormBuilder, private apiService: ApiService, private router: Router) { }

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.gameForm = this.formBuilder.group({
      gameName: ['', Validators.required],
      backgroundImage: ['', Validators.required],
      rating: ['', Validators.required],
      descriptionRaw: ['', Validators.required],
      suggestionCount: ['', Validators.required],
      reviewCount: ['', Validators.required]
    });
  }

  // onAlertClosed() {
  //   location.reload();
  // }
  

  onSubmit() {
    if (this.gameForm.invalid) {
      return;
    }
    const gameData = this.gameForm.value;
    this.apiService.createGame(gameData).subscribe(
      response => {
        console.log('Game created successfully:', response);
        window.alert("Game created successfully!")
        this.router.navigate(['/games'])
      },
      error => {
        console.error('Error creating game:', error);
      }
    );
  }

}
