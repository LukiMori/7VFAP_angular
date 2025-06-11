import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Category } from '../shared/interfaces';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../shared/auth.service'; // import service
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: []
})
export class HeaderComponent implements OnInit, OnDestroy {
  showProductsMenu = false;
  categories: Category[] = [];

  isLoggedIn = false;
  private authSubscription!: Subscription;

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // subscribe to auth state
    this.authSubscription = this.authService.isLoggedIn$.subscribe(
      (loggedIn) => {
        this.isLoggedIn = loggedIn;
      }
    );

    this.http.get<Category[]>(environment.GET_CATEGORY_URL).subscribe({
      next: (res) => {
        this.categories = res;
      },
      error: (err) => {
        console.error('Chyba při načítání kategorií:', err);
      }
    });
  }

  handleLogout(): void {
    this.authService.logout();
    this.router.navigate(['/products']);
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }
}
