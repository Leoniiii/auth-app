import { Injectable, computed, inject, signal } from '@angular/core';
import { environments } from '../../environments/environments';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, map, of, tap, throwError } from 'rxjs';
import { AuthStatus, CheckTokenResponse, LoginResponse, User } from '../auth/interfaces';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private http = inject(HttpClient)
  private readonly baseUrl: string = environments.baseUrl
  private _currentUser = signal<User | null>(null);
  private _authStatus = signal<AuthStatus>(AuthStatus.checking)

  public currentUser = computed(() => this._currentUser())
  public AuthStatus = computed(() => this._authStatus())

  constructor() { }

  login(email: string, password: string): Observable<boolean> {
    const url = `${this.baseUrl}/auth/login`;
    const body = { email, password }
    return this.http.post<LoginResponse>(url, body)
      .pipe(
        tap(({ user, token }) => {
          this._currentUser.set(user);
          console.log(this.currentUser())

          this._authStatus.set(AuthStatus.authenticated);
          localStorage.setItem('token', token);
          console.log(user, token)
        }),
        map(() => true),
        catchError(err => {
          console.log(err)
          return throwError(() => err.error.message)
        })
      )
  }

  checkAuthStatus(): Observable<boolean> {
    const url = `${this.baseUrl}/auth/check-token`;
    const token = localStorage.getItem('token');

    if (!token) return of(false);

    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`)

    return this.http.get<CheckTokenResponse>(url, { headers }).pipe(
      map(({ token, user }) => {
        this._currentUser.set(user);
        console.log(this.currentUser())
        this._authStatus.set(AuthStatus.authenticated);
        localStorage.setItem('token', token);
        return true
      }),
      catchError(() => of(false))
    )
  }

}
