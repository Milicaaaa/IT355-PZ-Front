import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Game } from '../models/game';
import { ApiService } from '../services/api.service';
import { UserService } from '../services/userservice';
import { faHeart, faHeartBroken } from '@fortawesome/free-solid-svg-icons'
import { FavoritesService } from '../services/favoritesservice';

const token = localStorage.getItem('token')

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {

  game: Game = {} as Game;
  isInFavorites: boolean
  icon = faHeart;
  iconFalse = faHeartBroken
  userId = ""

  constructor(private route: ActivatedRoute, private apiService: ApiService, private userService: UserService, private favoriteService: FavoritesService) {
  }

  fetchPlatformsByGameId(gameId: string) {
    this.apiService.fetchPlatformsByGame(gameId).subscribe(data => {
      console.warn(data);
      this.game.platforms = data;
    });
  }
  
  fetchStoresByGameId(gameId: string) {
    this.apiService.fetchStoresByGame(gameId).subscribe(data => {
      console.warn(data);
      this.game.stores = data;
    });
  }

  getPlatforms(id: any[]) {
    return id.map((id) => id.platform.platformName).join(', ')
  }

  getGenres(id: any[]) {
    return id.map((id) => id.genreName).join(', ')
  }

  getStores(id: any[]) {
    return id.map((id) => id.store.storename).join(', ')
  }

  isLoggedIn() {
    let user = localStorage.getItem('token');
    if (user != null) {
      return true
    } else {
      return false
    }
  }

  addToFavorites() {
    const id = this.route.snapshot.paramMap.get('id');
    this.userService.getUserIdFromToken(token).subscribe(
      (userId: string | null) => {
        this.favoriteService.addFavorites(userId!, id!).subscribe(
          (response) => {
            console.log('Favorites added successfully');
          },
          (error) => {
            console.error('Error occurred while adding favorites:', error);
          }
        );
      });
    this.isInFavorites = true
  }

  removeFromFavorites() {
    this.userService.getUserIdFromToken(token).subscribe(
      (userId: string | null) => {
        this.favoriteService.deleteFavorites(userId!, this.game.id).subscribe((response) => {
          this.isInFavorites = false;
        }
        )
      });
  }


  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.userService.getUserIdFromToken(token).subscribe(
      (userId: string | null) => {
        if (id) {
          this.apiService.getGame(id).subscribe(result => {
            this.game = result

            this.apiService.fetchTagsByGame(this.game.id).subscribe(
              (response: any) => {
                this.game.tags = response.map((obj: { tag: any; }) => obj.tag);
              },
              (error: any) => {
                console.error('Error fetching tags:', error);
              }
            );
              this.apiService.fetchGenresByGame(this.game.id).subscribe((response)=>{
                this.game.genres = response.map((obj: { genre: any; }) => obj.genre);
              })

            this.favoriteService.checkIfInFavorite(userId!, id).subscribe((response) => {
              if (response != null) {
                this.isInFavorites = true;
              } else {
                this.isInFavorites = false;
              }
            })
            this.fetchPlatformsByGameId(this.game.id);
            this.fetchStoresByGameId(this.game.id);
          });
        }
      });

  }

}


