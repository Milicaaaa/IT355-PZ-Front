import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { UserService } from './userservice';
import { Observable } from 'rxjs';
import { User } from '../models/user';
import { tokenGetter } from '../app.module';
import { Game } from '../models/game';

const getToken = localStorage.getItem('token')
const token = localStorage.getItem('token') !== null ? null : getToken;
const headers = new HttpHeaders()
    .set('Authorization', `Bearer ${getToken}`)
    .set('Content-Type', 'application/json')
    .set('Access-Control-Allow-Origin', '*');

@Injectable({
    providedIn: 'root'
})
export class FavoritesService {

    private apiUrl = 'http://localhost:8080/api/favorite';

    constructor(private http: HttpClient, private userService: UserService) { }

    addFavorites(userId: string, gameId: string): Observable<any> {
        const params = {
            userId: userId,
            gameId: gameId,
        };
        return this.http.post(this.apiUrl, null, { params, headers });
    }

    deleteFavorites(userId: string, gameId: string): Observable<any> {
        return this.http.delete(`http://localhost:8080/api/favorite?userId=${userId}&gameId=${gameId}`, { headers });
    }

    getFavorites(id: string): Observable<Game[]> {
        return this.http.get<Game[]>(`http://localhost:8080/api/favorite/user?userId=${id}`, { headers });
    }

    checkIfInFavorite(userId: string, gameId: string){
        return this.http.get<any>(`http://localhost:8080/api/favorite/detail?userId=${userId}&gameId=${gameId}`, { headers });
    }


}