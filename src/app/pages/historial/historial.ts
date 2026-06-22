import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { VentaService } from '../../core/venta.service';
import { Venta } from '../../core/models';

@Component({
  selector: 'app-historial',
  standalone: true,
  imports: [CommonModule, DatePipe, LucideAngularModule],
  templateUrl: './historial.html'
})
export class HistorialComponent implements OnInit {
  private ventaService = inject(VentaService);

  ventas = signal<Venta[]>([]);
  detalle = signal<Venta | null>(null);
  error = signal('');

  ngOnInit(): void {
    this.ventaService.listar().subscribe({
      next: (data) => this.ventas.set(data),
      error: () => this.error.set('No se pudo cargar el historial.')
    });
  }

  ver(v: Venta): void {
    this.detalle.set(v);
  }
  cerrar(): void {
    this.detalle.set(null);
  }
}
