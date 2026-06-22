import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { AuthService } from '../core/auth.service';

interface MenuItem {
  ruta: string;
  label: string;
  icono: string;
  soloAdmin?: boolean;
}

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, LucideAngularModule],
  templateUrl: './main-layout.html'
})
export class MainLayoutComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  nombre = this.auth.nombre;
  rol = this.auth.rol;
  esAdmin = this.auth.esAdmin;
  menuMovil = signal(false);

  menu: MenuItem[] = [
    { ruta: '/dashboard', label: 'Dashboard', icono: 'layout-dashboard' },
    { ruta: '/ventas', label: 'Punto de venta', icono: 'shopping-cart' },
    { ruta: '/historial', label: 'Historial', icono: 'receipt-text' },
    { ruta: '/productos', label: 'Productos', icono: 'package' },
    { ruta: '/categorias', label: 'Categorías', icono: 'tags', soloAdmin: true },
    { ruta: '/clientes', label: 'Clientes', icono: 'users' },
    { ruta: '/usuarios', label: 'Usuarios', icono: 'shield-check', soloAdmin: true }
  ];

  get menuVisible(): MenuItem[] {
    return this.menu.filter((m) => !m.soloAdmin || this.esAdmin());
  }

  get iniciales(): string {
    return this.nombre().split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase();
  }

  salir(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
