import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {HeaderComponent} from './header/header.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  authTokenResponse: string | null = localStorage.getItem('authTokenResponse');
  loadingAuth = false;
  protected title = 'VFAP-angular-app';
}
