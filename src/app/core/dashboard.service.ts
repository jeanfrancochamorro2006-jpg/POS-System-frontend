import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL, Usuario, Venta } from './models';

export interface ResumenDashboard {
  ventasHoyTotal: number;
  ventasHoyCount: number;
  ingresoSemana: number;
  ingresoTotal: number;
  totalProductos: number;
  productosBajoStock: number;
  ventasPorMetodo: Record<string, number>;
  ultimasVentas: Venta[];
}

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private http = inject(HttpClient);
  resumen(): Observable<ResumenDashboard> {
    return this.http.get<ResumenDashboard>(`${API_URL}/dashboard/resumen`);
  }
}

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private http = inject(HttpClient);
  private url = `${API_URL}/usuarios`;

  listar(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.url);
  }
  crear(u: any): Observable<Usuario> {
    return this.http.post<Usuario>(this.url, u);
  }
  actualizar(id: number, u: any): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.url}/${id}`, u);
  }
  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
