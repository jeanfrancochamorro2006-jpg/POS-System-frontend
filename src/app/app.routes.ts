import { Routes } from '@angular/router';
import { authGuard, adminGuard, guestGuard } from './core/guards';

export const routes: Routes = [
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () => import('./pages/login/login').then((m) => m.LoginComponent)
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./layout/main-layout').then((m) => m.MainLayoutComponent),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      {
        path: 'dashboard',
        loadComponent: () => import('./pages/dashboard/dashboard').then((m) => m.DashboardComponent)
      },
      {
        path: 'productos',
        loadComponent: () => import('./pages/productos/productos').then((m) => m.ProductosComponent)
      },
      {
        path: 'categorias',
        canActivate: [adminGuard],
        loadComponent: () => import('./pages/categorias/categorias').then((m) => m.CategoriasComponent)
      },
      {
        path: 'ventas',
        loadComponent: () => import('./pages/ventas/ventas').then((m) => m.VentasComponent)
      },
      {
        path: 'historial',
        loadComponent: () => import('./pages/historial/historial').then((m) => m.HistorialComponent)
      },
      {
        path: 'clientes',
        loadComponent: () =>
          import('./pages/cliente-form/cliente-form').then((m) => m.ClienteFormComponent)
      },
      {
        path: 'usuarios',
        canActivate: [adminGuard],
        loadComponent: () => import('./pages/usuarios/usuarios').then((m) => m.UsuariosComponent)
      }
    ]
  },
  { path: '**', redirectTo: '' }
];
