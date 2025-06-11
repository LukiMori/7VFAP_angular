import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../shared/auth.service'; // import service

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: []
})
export class LoginComponent {
  email = '';
  password = '';

  validEmail = true;
  validPassword = true;

  loginButtonClicked = false;
  loginError = '';

  constructor(private http: HttpClient, private router: Router, private authService: AuthService
  ) {

  }

  validateFields(): void {
    this.validEmail = this.email.trim().length > 0;
    this.validPassword = this.password.trim().length > 0;

  }

  login(): void {
    this.loginButtonClicked = true;
    this.validateFields();

    if (!this.validEmail || !this.validPassword) {
      return;
    }

    this.http.post<{ token: string }>(environment.LOGIN_TOKEN_URL, {
      email: this.email,
      password: this.password
    }).subscribe({
      next: (response) => {
        const token = response.token;
        localStorage.setItem('authTokenResponse', token);
        this.authService.updateAuthState();
        this.loginError = '';
        this.router.navigate(['/profile']);
      },
      error: (error) => {
        console.error('Login error:', error);
        const message = error.error || 'Chyba při přihlášení.';
        this.loginError = message;
      }
    });

    this.loginButtonClicked = false;
  }
}
