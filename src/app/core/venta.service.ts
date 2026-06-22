import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL, Cliente, Venta } from './models';

@Injectable({ providedIn: 'root' })
export class VentaService {
  private http = inject(HttpClient);
  private url = `${API_URL}/ventas`;

  registrar(venta: any): Observable<Venta> {
    return this.http.post<Venta>(this.url, venta);
  }
  listar(): Observable<Venta[]> {
    return this.http.get<Venta[]>(this.url);
  }
  obtener(id: number): Observable<Venta> {
    return this.http.get<Venta>(`${this.url}/${id}`);
  }
}

@Injectable({ providedIn: 'root' })
export class ClienteService {
  private http = inject(HttpClient);
  private url = `${API_URL}/clientes`;

  listar(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(this.url);
  }
  registrar(cliente: any): Observable<Cliente> {
    return this.http.post<Cliente>(this.url, cliente);
  }
}
