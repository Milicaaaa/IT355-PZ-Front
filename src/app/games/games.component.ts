import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Game } from '../models/game';
import { Genre } from '../models/genre';
import { Observable, map, tap, forkJoin } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Store } from '../models/store';
import { AuthService } from '../services/auth.service';
import { faPenSquare } from '@fortawesome/free-solid-svg-icons';

const token = localStorage.getItem('token');

@Component({
  selector: 'app-games',
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.css']
})

export class GamesComponent implements OnInit {

  games: Game[] = [];
  gamesIDs: number[];
  game: Game;
  genres: Genre[] = []
  orderBy = '-added';
  page = 1;
  selectedValue: string;
  isAdmin: boolean = false;
  editIcon = faPenSquare;

  onSelectionChange() {
    if (this.selectedValue) {
      // Make the API call based on the selected value
      if (this.selectedValue === 'value1') {
        this.fetchDataFromAPI1();
      } else if (this.selectedValue === 'value2') {
        this.fetchDataFromAPI2();
      } else if (this.selectedValue === 'value3') {
        this.fetchDataFromAPI3();
      }else if(this.selectedValue === 'value4'){
        this.fetchDataFromAPI4();
      }
    }
  }
  
  fetchDataFromAPI1() {
      this.apiService.sortByNameAsc().subscribe(response =>{
        this.games = response
      })
  }
  
  fetchDataFromAPI2() {
    this.apiService.sortByNameDesc().subscribe(response =>{
      this.games = response
    })
  }
  
  fetchDataFromAPI3() {
    this.apiService.sortByRatingAsc().subscribe(response =>{
      this.games = response
    })
  }

  fetchDataFromAPI4() {
    this.apiService.sortByRatingDesc().subscribe(response =>{
      this.games = response
    })
  }
  
  constructor(private apiService: ApiService, private authService: AuthService) {
    this.apiService.search$.subscribe(results => {
      this.games = results;
    });
  }

  saveGameID() {
    // console.log(this.apiService.saveGameIds())
    return this.apiService.saveGameIds();
  }

  fetchGames() {
    this.apiService.fetchGames().subscribe(
      (games) => {
        this.games = games as Game[];
      },
      (error) => {
        console.error('Error fetching games:', error);
      }
    );
  }

  fetchAndSendPlatforms() {
    this.apiService.fetchPlatforms().subscribe(
      (response: any) => {
        const platforms = response.results;
        console.warn(response.results)
        this.apiService.sendPlatformsToDatabase(platforms).subscribe(
          (response: any) => {
            console.log('Platforms sent to the database successfully:', response);
         
          },
          (error: any) => {
            console.error('Error sending platforms to the database:', error);
          }
        );
      },
      (error: any) => {
        console.error('Error fetching platforms:', error);
      }
    );
  }

  fetchAndSendStores() {
    this.apiService.fetchStores().subscribe(
      (response: any) => {
        const stores : Store[] = response.results;
        console.warn(stores[0].storeName)
        this.apiService.sendStoresToDatabase(stores).subscribe(
          (response: any) => {
            console.log('Stores sent to the database successfully:', response);
          },
          (error: any) => {
            console.error('Error sending stores to the database:', error);
          }
        );
      },
      (error: any) => {
        console.error('Error fetching stores:', error);
      }
    );
  }

  // fetchGameDetailsByIds() {
  //   this.apiService.saveGameIds().subscribe(
  //     (gameIds: number[]) => {
  //       const observables = gameIds.map(gameId => this.apiService.fetchGameDetails(gameId));
  //       forkJoin(observables).subscribe(
  //         (responses: any[]) => {
  //           for (const response of responses) {
  //             const gameDetails = {
  //               id: response.id,
  //               gameName: response.name,
  //               descriptionRaw: response.description_raw,
  //               backgroundImage: response.background_image,
  //               rating: response.rating,
  //               suggestionCount: response.suggestions_count,
  //               reviewCount: response.reviews_text_count,
  //             };
  
  //             const game = new Game(
  //               gameDetails.id,
  //               gameDetails.gameName,
  //               gameDetails.backgroundImage,
  //               gameDetails.rating,
  //               gameDetails.descriptionRaw,
  //               gameDetails.suggestionCount,
  //               gameDetails.reviewCount
  //             );
  
  //             this.games.push(game);
  //           }
  
  //           console.log("Array of games:", this.games);
  
  //           this.apiService.sendToDatabase(this.games).subscribe(
  //             (response: any) => {
  //               console.log('Games sent to database successfully:', response);
  //             },
  //             (error: any) => {
  //               console.error('Error sending games to the database:', error);
  //             }
  //           );
  //         },
  //         (error: any) => {
  //           console.error('Error fetching game details:', error);
  //         }
  //       );
  //     },
  //     (error: any) => {
  //       console.error('Error saving game IDs:', error);
  //     }
  //   );
  // }

  fetchGenresAndSendToDatabase() {

    this.apiService.fetchGenres().subscribe(
      (response: any) => {
        const genres = response.results;
        
        // Create an array to store the observables for individual genre requests
        const observables: Observable<any>[] = [];
        
        // Iterate through each genre and fetch it individually
        for (const genre of genres) {
          const genreId = genre.id;
          observables.push(this.apiService.fetchGenreById(genreId));
        }
        
        // Use forkJoin to wait for all genre requests to complete
        forkJoin(observables).subscribe(
          (genreResponses: any[]) => {
            const modifiedGenres = genreResponses.map((response: any) => {
              return {
                id: response.id,
                genreName: response.name,
                slug: response.slug,
                description: response.description
                // Add any other properties you need
              };
            });
            
            // Send the modified genres data to your database
            this.apiService.sendGenresToDatabase(modifiedGenres).subscribe(
              (response: any) => {
                console.log('Genres sent to database successfully:', response);
              },
              (error: any) => {
                console.error('Error sending genres to the database:', error);
              }
            );
          },
          (error: any) => {
            console.error('Error fetching genre details:', error);
          }
        );
      },
      (error: any) => {
        console.error('Error fetching genres:', error);
      }
    );
  }
  
  ngOnInit() {
    // this.fetchAndSendPlatforms()
    // this.fetchGameDetailsByIds()
    this.fetchGames();
    // this.fetchGenresAndSendToDatabase();
    this.fetchGenres();
    // this.fetchAndSendStores();
    // this.fetchAndSendTags();
    this.authService.getUser();
    this.isAdmin = this.authService.isAdmin();
  }

  // Used for game details
  getGameGenre(games: any[]) {
    return games.map((games) => games.name).join(', ')
  }

  getPlatforms(games: any[]) {
    return games.map((games) => games.platform.name).join(', ')
  }
  //

  fetchGenres() {
    this.apiService.fetchGenresFromDatabase().subscribe(data => {
      this.genres = data
    })
  }

  fetchGamesByGenre(genreId: string) {
    this.apiService.fetchGamesByGenre(genreId).subscribe((data: any[]) => {
      console.warn(data);
      const games: Game[] = data.map((item: any) => item.game);
      this.games = games;
    });
  }
  


  fetchAndSendTags() {
    this.apiService.fetchTags().subscribe(
      (response: any) => {
         const tags = response.results;

        const mappedTags = tags.map((tag: any) => this.apiService.mapToDatabaseModel(tag));

        this.apiService.sendTagsToDatabase(mappedTags).subscribe(
          (response: any) => {
            console.log('Tags sent to database successfully:', response);
          },
          (error: any) => {
            console.error('Error sending tags to the database:', error);
          }
        );
      },
      (error: any) => {
        console.error('Error fetching tags:', error);
      }
    );
  }

  deleteGame(id: string){
    this.apiService.deleteGame(id).subscribe(response=>{
        window.alert("Game successfully deleted!");
        location.reload();
    })
  }

}


