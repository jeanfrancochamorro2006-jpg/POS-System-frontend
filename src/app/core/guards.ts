import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (auth.autenticado()) {
    return true;
  }
  router.navigate(['/login']);
  return false;
};

// Solo permite el acceso a usuarios ADMIN
export const adminGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (auth.esAdmin()) {
    return true;
  }
  router.navigate(['/dashboard']);
  return false;
};

// Evita volver al login si ya hay sesión
export const guestGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (!auth.autenticado()) {
    return true;
  }
  router.navigate(['/dashboard']);
  return false;
};
