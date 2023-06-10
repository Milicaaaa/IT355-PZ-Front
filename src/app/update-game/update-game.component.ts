import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Game } from '../models/game';

@Component({
  selector: 'app-update-game',
  templateUrl: './update-game.component.html',
  styleUrls: ['./update-game.component.css']
})
export class UpdateGameComponent implements OnInit {
  gameForm: FormGroup;
  game: Game = {} as Game;
  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute, private apiService: ApiService, private router : Router) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if(id){
      this.apiService.getGame(id).subscribe(result => {
        console.log(result)
        this.game = result;
        this.createForm();
      });
    }

  }

  createForm() {
    this.gameForm = this.formBuilder.group({
      id: ['', Validators.required],
      gameName: ['', Validators.required],
      backgroundImage: ['', Validators.required],
      rating: ['', Validators.required],
      descriptionRaw: ['', Validators.required],
      suggestionCount: ['', Validators.required],
      reviewCount: ['', Validators.required]
    });

    this.gameForm.patchValue({
      id: this.route.snapshot.paramMap.get('id'),
      gameName: this.game.gameName,
      backgroundImage: this.game.backgroundImage,
      rating: this.game.rating,
      descriptionRaw: this.game.descriptionRaw,
      suggestionCount: this.game.suggestionCount,
      reviewCount: this.game.reviewCount,
      
   });
  }

  onSubmit() {
    const gameData = this.gameForm.value;
    this.apiService.updateGame(gameData).subscribe(
      response => {
        console.log('Game updated successfully:', response);
        window.alert("Game updated successfully!")
        this.router.navigate(['/games'])
      },
      error => {
        console.error('Error creating game:', error);
      }
    );
  }
}
