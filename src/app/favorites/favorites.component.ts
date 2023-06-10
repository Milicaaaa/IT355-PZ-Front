import { Component, OnInit } from '@angular/core';
import { Game } from '../models/game';
import { ApiService } from '../services/api.service';
import { FavoritesService } from '../services/favoritesservice';
import { UserService } from '../services/userservice';
import { forkJoin } from 'rxjs';

const token = localStorage.getItem('token')
var user = 0;

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.css']
})
export class FavoritesComponent implements OnInit {

  games: Game[] = [];
  userId = ""

  constructor(private userService: UserService, private apiService: ApiService, private favoritesService: FavoritesService) {
  }

  ngOnInit() {
    this.userService.getUserIdFromToken(token).subscribe(
      (userId: string | null) => {
        this.favoritesService.getFavorites(userId!).subscribe(
          (response: any[]) => {
            const game: Game[] = response.map(item => item.game);
            this.games = game
            for (const gam of this.games ){
              this.apiService.fetchTagsByGame(gam.id).subscribe(
                (response: any) => {
                  console.log(response)
                  gam.tags = response.map((obj: { tag: any; }) => obj.tag);
                  
                },
                (error: any) => {
                  console.error('Error fetching tags:', error);
                }
              );
            }

          },
          (error: any) => {
            console.error('Error occurred while getting favorites:', error);
          }
        );
      },
      (error: any) => {
        console.error('Error occurred while getting user ID:', error);
      }
    );
  }
  
  removeFromFavorites(id: string) {
    this.userService.getUserIdFromToken(token).subscribe(
      (userId: string | null) => {
        this.favoritesService.deleteFavorites(userId!, id).subscribe((response )=>{
          if (confirm('Successfully removed from favorites')) {
            window.location.reload();
          }
        })
      }
    )
  }

  // Used for game details
  getGameGenre(games: any[]) {
    return games.map((games) => games.name).join(', ')
  }

  getPlatforms(games: any[]) {
    return games.map((games) => games.platform.name).join(', ')
  }
  //

  getGameByID(id: string) {
    this.apiService.getGame(id).subscribe(result => {
      const game: Game = result;
      this.games.push(game)
    })
  }

}


