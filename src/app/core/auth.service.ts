import { Injectable, computed, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { API_URL, AuthResponse, Rol } from './models';

const STORAGE_KEY = 'pos_auth';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly _sesion = signal<AuthResponse | null>(this.cargarSesion());

  readonly sesion = this._sesion.asReadonly();
  readonly autenticado = computed(() => this._sesion() !== null);
  readonly nombre = computed(() => this._sesion()?.nombre ?? '');
  readonly rol = computed<Rol | null>(() => this._sesion()?.rol ?? null);
  readonly esAdmin = computed(() => this._sesion()?.rol === 'ADMIN');

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${API_URL}/auth/login`, { username, password }).pipe(
      tap((res) => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(res));
        this._sesion.set(res);
      })
    );
  }

  logout(): void {
    localStorage.removeItem(STORAGE_KEY);
    this._sesion.set(null);
  }

  get token(): string | null {
    return this._sesion()?.token ?? null;
  }

  private cargarSesion(): AuthResponse | null {
    if (typeof localStorage === 'undefined') {
      return null;
    }
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AuthResponse) : null;
  }
}
