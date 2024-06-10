import { Inject, Injectable, computed, inject, signal } from '@angular/core';
import { environments } from '../../environments/environments';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, map, of, tap, throwError } from 'rxjs';
import { AuthStatus, CheckTokenResponse, LoginResponse, User } from '../auth/interfaces';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class AuthService {



  private http = inject(HttpClient)
  private readonly baseUrl: string = environments.baseUrl
  private _currentUser = signal<User | null>(null);
  private _authStatus = signal<AuthStatus>(AuthStatus.checking)

  public currentUser = computed(() => this._currentUser())
  public authStatus = computed(() => this._authStatus())

  constructor(@Inject(DOCUMENT) private document: Document) {
    this.checkAuthStatus().subscribe()
  }

  private setAuthentication(user: User, token: string): boolean {
    this._currentUser.set(user);
    this._authStatus.set(AuthStatus.authenticated);
    
    return true
  }

  login(email: string, password: string): Observable<boolean> {
    const url = `${this.baseUrl}/auth/login`;
    const body = { email, password }
    return this.http.post<LoginResponse>(url, body)
      .pipe(
        map(({ user, token }) => {
          this.setAuthentication(user, token)
        }),
        map(() => true),
        catchError(err => {
          return throwError(() => err.error.message)
        })
      )
  }

  checkAuthStatus(): Observable<boolean> {
    const url = `${this.baseUrl}/auth/check-token`;
    let token;    

    if (!token) return of(false);

    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`)

    return this.http.get<CheckTokenResponse>(url, { headers }).pipe(
      map(({ token, user }) => {
        return this.setAuthentication(user, token)
      }),
      catchError(() => {
        this._authStatus.set(AuthStatus.notAuthenticated)
        return of(false)
      })
    )
  }

}
