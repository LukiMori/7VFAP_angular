import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private isLoggedInSubject = new BehaviorSubject<boolean>(this.hasToken());
  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  private hasToken(): boolean {
    return !!localStorage.getItem('authTokenResponse');
  }

  updateAuthState(): void {
    this.isLoggedInSubject.next(this.hasToken());
  }

  logout(): void {
    localStorage.removeItem('authTokenResponse');
    this.updateAuthState();
  }
}
