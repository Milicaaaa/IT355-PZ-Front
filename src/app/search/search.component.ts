import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Game } from '../models/game';
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';
import { fas, faSearch } from '@fortawesome/free-solid-svg-icons'

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  @Output() searchCompleted = new EventEmitter<any[]>();
  query = '';
  games: Game[] = [];
  icon = faSearch;

  constructor(private apiService: ApiService, private router: Router) { }

  search() {
    this.router.navigate(['/games']).then(() =>{
      this.apiService.searchQuery(this.query).subscribe(data => {
        this.router.navigate(['/games'], { queryParams: { search: this.query } });
        this.games = data.results;
        this.apiService.updateSearch(this.games);
      });
    })
  }

  ngOnInit(): void {
  }

}
