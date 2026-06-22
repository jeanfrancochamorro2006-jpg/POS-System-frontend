import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL, Categoria, Producto } from './models';

@Injectable({ providedIn: 'root' })
export class CategoriaService {
  private http = inject(HttpClient);
  private url = `${API_URL}/categorias`;

  listar(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(this.url);
  }
  crear(c: Categoria): Observable<Categoria> {
    return this.http.post<Categoria>(this.url, c);
  }
  actualizar(id: number, c: Categoria): Observable<Categoria> {
    return this.http.put<Categoria>(`${this.url}/${id}`, c);
  }
  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}

@Injectable({ providedIn: 'root' })
export class ProductoService {
  private http = inject(HttpClient);
  private url = `${API_URL}/productos`;

  listar(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.url);
  }
  disponibles(): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.url}/disponibles`);
  }
  crear(p: any): Observable<Producto> {
    return this.http.post<Producto>(this.url, p);
  }
  actualizar(id: number, p: any): Observable<Producto> {
    return this.http.put<Producto>(`${this.url}/${id}`, p);
  }
  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
