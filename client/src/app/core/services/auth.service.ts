import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, catchError, map, of, tap, throwError } from 'rxjs';

import { environment } from '../../../environments/environment';
import { User, LoginRequest, RegisterRequest, AuthResponse } from '../models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly baseUrl = environment.apiUrl;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private tokenKey = 'pos_access_token';

  public currentUser$ = this.currentUserSubject.asObservable();
  public isLoggedIn = signal(false);

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.initializeAuth();
  }

  private initializeAuth(): void {
    const token = localStorage.getItem(this.tokenKey);
    if (token) {
      // Try to refresh token to validate it
      this.refreshToken().subscribe({
        next: (response) => {
          if (response.accessToken) {
            localStorage.setItem(this.tokenKey, response.accessToken);
            this.setAuthState(response.user);
          }
        },
        error: () => {
          this.logout();
        }
      });
    }
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    if (environment.useMockApi) {
      return this.mockLogin(credentials);
    }

    return this.http.post<AuthResponse>(`${this.baseUrl}/auth/login`, credentials)
      .pipe(
        tap(response => {
          localStorage.setItem(this.tokenKey, response.accessToken);
          this.setAuthState(response.user);
        }),
        catchError(this.handleError)
      );
  }

  register(userData: RegisterRequest): Observable<AuthResponse> {
    if (environment.useMockApi) {
      return this.mockRegister(userData);
    }

    return this.http.post<AuthResponse>(`${this.baseUrl}/auth/register`, userData)
      .pipe(
        tap(response => {
          localStorage.setItem(this.tokenKey, response.accessToken);
          this.setAuthState(response.user);
        }),
        catchError(this.handleError)
      );
  }

  refreshToken(): Observable<{ accessToken: string; user: User }> {
    if (environment.useMockApi) {
      return this.mockRefresh();
    }

    return this.http.post<{ accessToken: string }>(`${this.baseUrl}/auth/refresh`, {})
      .pipe(
        map(response => ({
          accessToken: response.accessToken,
          user: this.getCurrentUser()!
        })),
        catchError(this.handleError)
      );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.currentUserSubject.next(null);
    this.isLoggedIn.set(false);
    
    if (!environment.useMockApi) {
      this.http.post(`${this.baseUrl}/auth/logout`, {}).subscribe();
    }
    
    this.router.navigate(['/auth/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return this.isLoggedIn();
  }

  hasRole(roles: string[]): boolean {
    const user = this.getCurrentUser();
    return user ? roles.includes(user.role) : false;
  }

  private setAuthState(user: User): void {
    this.currentUserSubject.next(user);
    this.isLoggedIn.set(true);
  }

  private handleError(error: any): Observable<never> {
    console.error('Auth error:', error);
    return throwError(() => error);
  }

  // Mock API methods for showcase mode
  private mockLogin(credentials: LoginRequest): Observable<AuthResponse> {
    return new Observable<AuthResponse>((observer) => {
      setTimeout(() => {
        const mockUsers = [
          { id: '1', username: 'admin', password: 'ChangeMe123!', role: 'ADMIN' },
          { id: '2', username: 'cashier', password: 'Cashier123!', role: 'CASHIER' },
          { id: '3', username: 'manager', password: 'Manager123!', role: 'MANAGER' }
        ];

        const user = mockUsers.find(u => 
          u.username === credentials.username && u.password === credentials.password
        );

        if (user) {
          observer.next({
            accessToken: 'mock-jwt-token-' + user.id,
            user: {
              id: user.id,
              username: user.username,
              role: user.role as any,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            }
          });
          observer.complete();
        } else {
          observer.error({ error: 'Invalid credentials' });
        }
      }, 1000);
    });
  }

  private mockRegister(userData: RegisterRequest): Observable<AuthResponse> {
    return new Observable<AuthResponse>((observer) => {
      setTimeout(() => {
        if (userData.username.length < 3) {
          observer.error({ error: 'Username too short' });
        } else if (userData.password.length < 8) {
          observer.error({ error: 'Password too short' });
        } else {
          observer.next({
            accessToken: 'mock-jwt-token-new',
            user: {
              id: 'new-user-id',
              username: userData.username,
              role: 'CASHIER' as any,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            }
          });
          observer.complete();
        }
      }, 1000);
    });
  }

  private mockRefresh(): Observable<{ accessToken: string; user: User }> {
    const currentUser = this.getCurrentUser();
    if (currentUser) {
      return of({
        accessToken: 'refreshed-mock-token-' + currentUser.id,
        user: currentUser
      });
    }
    return throwError(() => ({ error: 'No user found' }));
  }
}