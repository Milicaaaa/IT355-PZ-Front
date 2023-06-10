import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  genres: any;

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.apiService.fetchGenres()
    .subscribe(response => {
      this.genres = response;
    });
  }

  }

