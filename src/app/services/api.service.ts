import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, forkJoin, map, Observable, Subject, switchMap } from 'rxjs';
import { Game } from '../models/game';
import { Store } from '../models/store';

const token = localStorage.getItem('token')
const headers = new HttpHeaders()
  .set('Authorization', `Bearer ${token}`)
  .set('Content-Type', 'application/json')
  .set('Access-Control-Allow-Origin', '*');

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private searchSubject = new Subject<any[]>();
  search$ = this.searchSubject.asObservable();

  constructor(private http: HttpClient) { }
  private key = '3980b36a7a8848a38b788e2a62db350c'

  fetchGenres(): Observable<any> {
    return this.http.get(`https://api.rawg.io/api/genres?key=${this.key}`);
  }

  fetchPlatforms(): Observable<any> {
    return this.http.get(`https://api.rawg.io/api/platforms/lists/parents?key=${this.key}`);
  }

  fetchStores(): Observable<any> {
    return this.http.get(`https://api.rawg.io/api/stores?key=${this.key}`);
  }

  fetchTags() {
    const url = `https://api.rawg.io/api/tags?page=6&key=${this.key}`;
    return this.http.get(url);
  }

  mapToDatabaseModel(tag: any): any {
    return {
      tagName: tag.name,
      tagLanguage: tag.language,
    };
  }

  fetchGameIds(): Observable<number[]> {
    const apiUrl = 'https://api.rawg.io/api/games';

    return this.http.get<any>(apiUrl, { headers }).pipe(
      map((response: any) => {
        return response.results.map((game: any) => game.id);
      }),
      catchError((error: any) => {
        console.error('Error fetching game IDs:', error);
        throw error;
      })
    );
  }

  sendTagsToDatabase(tags: any[]) {
    const url = `http://localhost:8080/api/tag/insertAll`;
    return this.http.post(url, tags, { headers });
  }

  sendPlatformsToDatabase(platforms: any[]) {
    const url = `http://localhost:8080/api/platform/insertAll`;

    return this.http.post(url, platforms, { headers });
  }

  sendStoresToDatabase(stores: Store[]) {
    const url = `http://localhost:8080/api/store/insertAll`;
    return this.http.post(url, stores, { headers });
  }

  sendGenresToDatabase(genres: any[]): Observable<any> {
    const apiUrl = 'http://localhost:8080/api/genre/insertAll';
    return this.http.post(apiUrl, genres, { headers });
  }

  saveGameIds(): Observable<number[]> {
    const apiUrl = `https://api.rawg.io/api/games?key=${this.key}`;
    return this.http.get(apiUrl).pipe(
      map((response: any) => {
        const games = response.results;
        const gameIds: number[] = [];

        for (const game of games) {
          gameIds.push(game.id);
        }

        return gameIds;
      })
    );
  }

  fetchGameDetails(gameId: number): Observable<any> {
    const apiUrl = `https://api.rawg.io/api/games/${gameId}?key=${this.key}`;
    return this.http.get(apiUrl);
  }

  sendToDatabase(data: any) {
    const apiUrl = 'http://localhost:8080/api/game/insertAll';
    return this.http.post(apiUrl, data, { headers });
  }

  fetchGames(): Observable<Game[]> {
    return this.http.get<Game[]>('http://localhost:8080/api/game', { headers });
  }

  getGame(id: string): Observable<any> {
    return this.http.get(`http://localhost:8080/api/game/${id}`, { headers });
  }

  fetchGameData(gameId: number): Observable<any> {
    const url = `https://api.rawg.io/api/games?id=${gameId}key=${this.key}`;
    return this.http.get(url);
  }

  formatData(game: any): any {
    return {
      id: game.id,
      gameName: game.name,
      backgroundImage: game.background_image,
      rating: game.rating,
    };
  }

  insertGameToDatabase(game: any): Observable<any> {
    const url = 'http://localhost:8080/api/game/insert';
    return this.http.post(url, game);
  }

  fetchAndInsertGames(gameIds: number[]): Observable<any[]> {
    const requests: Observable<any>[] = [];
    gameIds.forEach((id: number) => {
      const request = this.fetchGameData(id).pipe(
        map((game: any) => this.formatData(game)),
        switchMap((formattedGame: any) => this.insertGameToDatabase(formattedGame))
      );
      requests.push(request);
    });

    return forkJoin(requests);
  }

  fetchGenresFromDatabase(): Observable<any> {
    return this.http.get(`http://localhost:8080/api/genre`);
  }

  searchQuery(search: String): Observable<any> {
    return this.http.get(`http://localhost:8080/api/game/search?search=${search}`, { headers })
  }

  fetchGenreById(id: string): Observable<any> {
    return this.http.get(`https://api.rawg.io/api/genres/${id}?key=${this.key}&page_size=150`)
  }

  updateSearch(results: any[]) {
    this.searchSubject.next(results);
  }

  fetchTagsByGame(id: string): Observable<any> {
    return this.http.get<any>(`http://localhost:8080/api/hasTag/game?gameId=${id}`, { headers });
  }

  fetchGenresByGame(id: string): Observable<any> {
    return this.http.get<any>(`http://localhost:8080/api/hasGenre/game?gameId=${id}`, { headers });
  }

  fetchPlatformsByGame(id: string): Observable<any> {
    return this.http.get<any>(`http://localhost:8080/api/hasPlatform/game?gameId=${id}`, { headers });
  }

  fetchStoresByGame(id: string): Observable<any> {
    return this.http.get<any>(`http://localhost:8080/api/isBought/game?gameId=${id}`, { headers });
  }

  fetchGamesByGenre(id: string): Observable<any> {
    return this.http.get<any>(`http://localhost:8080/api/hasGenre/genre?genreId=${id}`, { headers });
  }

  sortByNameAsc(): Observable<Game[]> {
    return this.http.get<Game[]>('http://localhost:8080/api/game/nameAsc', { headers });
  }

  sortByNameDesc(): Observable<Game[]> {
    return this.http.get<Game[]>('http://localhost:8080/api/game/nameDesc', { headers });
  }

  sortByRatingAsc(): Observable<Game[]> {
    return this.http.get<Game[]>('http://localhost:8080/api/game/ratingAsc', { headers });
  }

  sortByRatingDesc(): Observable<Game[]> {
    return this.http.get<Game[]>('http://localhost:8080/api/game/ratingDesc', { headers });
  }

  createGame(game: Game): Observable<Game> {
    return this.http.post<Game>("http://localhost:8080/api/game", game, { headers });
  }

  deleteGame(gameId : string){
    return this.http.delete(`http://localhost:8080/api/game/${gameId}`, {headers})
  }

  updateGame(game: Game){
    return this.http.put(`http://localhost:8080/api/game`, game, {headers})
  }
}
