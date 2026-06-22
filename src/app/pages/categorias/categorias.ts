import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { CategoriaService } from '../../core/catalogo.service';
import { Categoria } from '../../core/models';

@Component({
  selector: 'app-categorias',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule],
  templateUrl: './categorias.html'
})
export class CategoriasComponent implements OnInit {
  private fb = inject(FormBuilder);
  private service = inject(CategoriaService);

  categorias = signal<Categoria[]>([]);
  modalAbierto = signal(false);
  editandoId = signal<number | null>(null);
  error = signal('');
  cargando = signal(false);

  form = this.fb.group({
    nombre: ['', [Validators.required]],
    descripcion: ['']
  });

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.service.listar().subscribe({
      next: (data) => this.categorias.set(data),
      error: () => this.error.set('No se pudieron cargar las categorías.')
    });
  }

  abrirNueva(): void {
    this.editandoId.set(null);
    this.form.reset({ nombre: '', descripcion: '' });
    this.error.set('');
    this.modalAbierto.set(true);
  }

  abrirEditar(c: Categoria): void {
    this.editandoId.set(c.id!);
    this.form.reset({ nombre: c.nombre, descripcion: c.descripcion ?? '' });
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
    const datos = this.form.value as Categoria;
    const id = this.editandoId();
    const op = id ? this.service.actualizar(id, datos) : this.service.crear(datos);
    op.subscribe({
      next: () => {
        this.cargando.set(false);
        this.modalAbierto.set(false);
        this.cargar();
      },
      error: (err) => {
        this.cargando.set(false);
        this.error.set(err.error?.message || 'No se pudo guardar.');
      }
    });
  }

  eliminar(c: Categoria): void {
    if (!confirm(`¿Eliminar la categoría "${c.nombre}"?`)) {
      return;
    }
    this.service.eliminar(c.id!).subscribe({
      next: () => this.cargar(),
      error: (err) => alert(err.error?.message || 'No se pudo eliminar.')
    });
  }
}
