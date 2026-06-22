import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { UsuarioService } from '../../core/dashboard.service';
import { Usuario } from '../../core/models';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule],
  templateUrl: './usuarios.html'
})
export class UsuariosComponent implements OnInit {
  private fb = inject(FormBuilder);
  private service = inject(UsuarioService);

  usuarios = signal<Usuario[]>([]);
  modalAbierto = signal(false);
  editandoId = signal<number | null>(null);
  error = signal('');
  cargando = signal(false);

  form = this.fb.group({
    nombre: ['', [Validators.required]],
    username: ['', [Validators.required]],
    password: [''],
    rol: ['CAJERO', [Validators.required]],
    activo: [true]
  });

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.service.listar().subscribe({
      next: (data) => this.usuarios.set(data),
      error: () => this.error.set('No se pudieron cargar los usuarios.')
    });
  }

  abrirNuevo(): void {
    this.editandoId.set(null);
    this.form.reset({ nombre: '', username: '', password: '', rol: 'CAJERO', activo: true });
    this.error.set('');
    this.modalAbierto.set(true);
  }

  abrirEditar(u: Usuario): void {
    this.editandoId.set(u.id!);
    this.form.reset({ nombre: u.nombre, username: u.username, password: '', rol: u.rol, activo: u.activo });
    this.error.set('');
    this.modalAbierto.set(true);
  }

  cerrar(): void {
    this.modalAbierto.set(false);
  }

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.cargando.set(true);
    this.error.set('');
    const id = this.editandoId();
    const op = id ? this.service.actualizar(id, this.form.value) : this.service.crear(this.form.value);
    op.subscribe({
      next: () => {
        this.cargando.set(false);
        this.modalAbierto.set(false);
        this.cargar();
      },
      error: (err) => {
        this.cargando.set(false);
        this.error.set(err.error?.message || 'No se pudo guardar el usuario.');
      }
    });
  }

  eliminar(u: Usuario): void {
    if (!confirm(`¿Eliminar al usuario "${u.nombre}"?`)) {
      return;
    }
    this.service.eliminar(u.id!).subscribe({
      next: () => this.cargar(),
      error: (err) => alert(err.error?.message || 'No se pudo eliminar.')
    });
  }
}
