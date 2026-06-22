import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { CategoriaService, ProductoService } from '../../core/catalogo.service';
import { AuthService } from '../../core/auth.service';
import { Categoria, Producto } from '../../core/models';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule],
  templateUrl: './productos.html'
})
export class ProductosComponent implements OnInit {
  private fb = inject(FormBuilder);
  private productoService = inject(ProductoService);
  private categoriaService = inject(CategoriaService);
  private auth = inject(AuthService);

  esAdmin = this.auth.esAdmin;
  productos = signal<Producto[]>([]);
  categorias = signal<Categoria[]>([]);
  modalAbierto = signal(false);
  editandoId = signal<number | null>(null);
  error = signal('');
  cargando = signal(false);
  filtro = signal('');

  form = this.fb.group({
    nombre: ['', [Validators.required]],
    codigo: ['', [Validators.required]],
    precio: [null as number | null, [Validators.required, Validators.min(0.01)]],
    stock: [null as number | null, [Validators.required, Validators.min(0)]],
    categoriaId: [null as number | null, [Validators.required]],
    activo: [true]
  });

  ngOnInit(): void {
    this.cargar();
    this.categoriaService.listar().subscribe((data) => this.categorias.set(data));
  }

  cargar(): void {
    this.productoService.listar().subscribe({
      next: (data) => this.productos.set(data),
      error: () => this.error.set('No se pudieron cargar los productos.')
    });
  }

  get productosFiltrados(): Producto[] {
    const f = this.filtro().toLowerCase().trim();
    if (!f) return this.productos();
    return this.productos().filter(
      (p) => p.nombre.toLowerCase().includes(f) || p.codigo.toLowerCase().includes(f)
    );
  }

  abrirNuevo(): void {
    this.editandoId.set(null);
    this.form.reset({ nombre: '', codigo: '', precio: null, stock: null, categoriaId: null, activo: true });
    this.error.set('');
    this.modalAbierto.set(true);
  }

  abrirEditar(p: Producto): void {
    this.editandoId.set(p.id!);
    this.form.reset({
      nombre: p.nombre,
      codigo: p.codigo,
      precio: p.precio,
      stock: p.stock,
      categoriaId: p.categoria?.id ?? null,
      activo: p.activo ?? true
    });
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
    const op = id
      ? this.productoService.actualizar(id, this.form.value)
      : this.productoService.crear(this.form.value);
    op.subscribe({
      next: () => {
        this.cargando.set(false);
        this.modalAbierto.set(false);
        this.cargar();
      },
      error: (err) => {
        this.cargando.set(false);
        this.error.set(err.error?.message || 'No se pudo guardar el producto.');
      }
    });
  }

  eliminar(p: Producto): void {
    if (!confirm(`¿Eliminar el producto "${p.nombre}"?`)) {
      return;
    }
    this.productoService.eliminar(p.id!).subscribe({
      next: () => this.cargar(),
      error: (err) => alert(err.error?.message || 'No se pudo eliminar.')
    });
  }
}
