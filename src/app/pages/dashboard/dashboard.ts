import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { AuthService } from '../../core/auth.service';
import { DashboardService, ResumenDashboard } from '../../core/dashboard.service';

interface SegmentoDonut {
  metodo: string;
  monto: number;
  porcentaje: number;
  color: string;
}

const COLORES_METODO: Record<string, string> = {
  EFECTIVO: '#3b82f6',
  TARJETA: '#0f172a',
  YAPE: '#a855f7',
  TRANSFERENCIA: '#10b981'
};

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule, DatePipe],
  templateUrl: './dashboard.html'
})
export class DashboardComponent implements OnInit {
  private auth = inject(AuthService);
  private dashboardService = inject(DashboardService);

  nombre = this.auth.nombre;
  resumen = signal<ResumenDashboard | null>(null);
  cargando = signal(true);

  segmentos = computed<SegmentoDonut[]>(() => {
    const r = this.resumen();
    if (!r) return [];
    const entradas = Object.entries(r.ventasPorMetodo ?? {});
    const total = entradas.reduce((acc, [, monto]) => acc + monto, 0);
    if (total === 0) return [];
    return entradas.map(([metodo, monto]) => ({
      metodo,
      monto,
      porcentaje: (monto / total) * 100,
      color: COLORES_METODO[metodo] ?? '#94a3b8'
    }));
  });

  totalMetodos = computed(() =>
    this.segmentos().reduce((acc, s) => acc + s.monto, 0)
  );

  donutGradient = computed(() => {
    const segs = this.segmentos();
    if (segs.length === 0) return '#e2e8f0';
    let acc = 0;
    const partes = segs.map((s) => {
      const desde = acc;
      acc += s.porcentaje;
      return `${s.color} ${desde}% ${acc}%`;
    });
    return `conic-gradient(${partes.join(', ')})`;
  });

  ngOnInit(): void {
    this.dashboardService.resumen().subscribe({
      next: (data) => {
        this.resumen.set(data);
        this.cargando.set(false);
      },
      error: () => this.cargando.set(false)
    });
  }
}
