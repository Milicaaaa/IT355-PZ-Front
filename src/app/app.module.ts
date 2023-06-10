import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ApiService } from './services/api.service';
import { FooterComponent } from './footer/footer.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { GamesComponent } from './games/games.component';
import { DetailComponent } from './detail/detail.component';
import { SearchComponent } from './search/search.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { LoginComponent } from './login/login.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LogoutComponent } from './logout/logout.component';
import { FavoritesComponent } from './favorites/favorites.component';
import { RegisterComponent } from './register/register.component';
import { UserService } from './services/userservice';
import { FavoritesService } from './services/favoritesservice';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { JwtInterceptor, JwtHelperService, JwtModule, JWT_OPTIONS } from '@auth0/angular-jwt';
import { jwtHelperFactory } from './services/jwt-helper.service';
import { AddGameComponent } from './add-game/add-game.component';
import { AuthGuard } from './authguard';
import { AdminAuthGuard } from './adminauthguard';
import { UpdateGameComponent } from './update-game/update-game.component';


const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'games', component: GamesComponent },
  { path: 'games/:id', component: DetailComponent },
  { path: 'login', component: LoginComponent}, //IDKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKK
  { path: 'register', component: RegisterComponent },
  { path: 'home', component: HomeComponent },
  {
    path: 'favorites',
    component: FavoritesComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'addGame',
    component: AddGameComponent,
    canActivate: [AdminAuthGuard],
  },
  {path: 'update/:id', component: UpdateGameComponent}
];

export function tokenGetter() {
  return localStorage.getItem('token');
}

export function jwtOptionsFactory() {
  return {
    tokenGetter: () => {
      return localStorage.getItem('token');
    },
    allowedDomains: ['http://localhost:4200']
  };
}


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    FooterComponent,
    GamesComponent,
    DetailComponent,
    SearchComponent,
    LoginComponent,
    LogoutComponent,
    FavoritesComponent,
    RegisterComponent,
    AddGameComponent,
    UpdateGameComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    RouterModule.forRoot(routes),
    HttpClientModule,
    NgxPaginationModule,
    FontAwesomeModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    JwtModule.forRoot({
      jwtOptionsProvider: {
        provide: JWT_OPTIONS,
        useFactory: jwtOptionsFactory,
      },})
  ],
  providers: [
    ApiService,
    UserService,
    AdminAuthGuard,
    FavoritesService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true,
    },
    { provide: JwtHelperService, useFactory: jwtHelperFactory },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
