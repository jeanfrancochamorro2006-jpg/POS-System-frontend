import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { ProductoService } from '../../core/catalogo.service';
import { ClienteService, VentaService } from '../../core/venta.service';
import { Cliente, Producto } from '../../core/models';

interface ItemCarrito {
  producto: Producto;
  cantidad: number;
}

@Component({
  selector: 'app-ventas',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './ventas.html',
  styleUrl: './ventas.css'
})
export class VentasComponent implements OnInit {
  private productoService = inject(ProductoService);
  private clienteService = inject(ClienteService);
  private ventaService = inject(VentaService);

  productos = signal<Producto[]>([]);
  clientes = signal<Cliente[]>([]);
  carrito = signal<ItemCarrito[]>([]);
  filtro = signal('');

  clienteId = signal<number | null>(null);
  metodoPago = signal('EFECTIVO');
  procesando = signal(false);
  mensaje = signal('');
  error = signal('');

  total = computed(() =>
    this.carrito().reduce((acc, i) => acc + i.producto.precio * i.cantidad, 0)
  );
  cantidadItems = computed(() => this.carrito().reduce((acc, i) => acc + i.cantidad, 0));

  ngOnInit(): void {
    this.cargarProductos();
    this.clienteService.listar().subscribe({
      next: (data) => this.clientes.set(data),
      error: () => {}
    });
  }

  cargarProductos(): void {
    this.productoService.disponibles().subscribe({
      next: (data) => this.productos.set(data),
      error: () => this.error.set('No se pudieron cargar los productos.')
    });
  }

  get productosFiltrados(): Producto[] {
    const f = this.filtro().toLowerCase().trim();
    const base = this.productos();
    if (!f) return base;
    return base.filter(
      (p) => p.nombre.toLowerCase().includes(f) || p.codigo.toLowerCase().includes(f)
    );
  }

  agregar(producto: Producto): void {
    if (producto.stock <= 0) return;
    this.carrito.update((items) => {
      const existente = items.find((i) => i.producto.id === producto.id);
      if (existente) {
        if (existente.cantidad < producto.stock) {
          existente.cantidad++;
        }
        return [...items];
      }
      return [...items, { producto, cantidad: 1 }];
    });
  }

  cambiarCantidad(item: ItemCarrito, delta: number): void {
    this.carrito.update((items) => {
      const it = items.find((i) => i.producto.id === item.producto.id);
      if (it) {
        const nueva = it.cantidad + delta;
        if (nueva <= 0) {
          return items.filter((i) => i.producto.id !== item.producto.id);
        }
        if (nueva <= it.producto.stock) {
          it.cantidad = nueva;
        }
      }
      return [...items];
    });
  }

  quitar(item: ItemCarrito): void {
    this.carrito.update((items) => items.filter((i) => i.producto.id !== item.producto.id));
  }

  limpiar(): void {
    this.carrito.set([]);
    this.clienteId.set(null);
    this.metodoPago.set('EFECTIVO');
  }

  cobrar(): void {
    if (this.carrito().length === 0) {
      this.error.set('Agrega al menos un producto al carrito.');
      return;
    }
    this.procesando.set(true);
    this.error.set('');
    this.mensaje.set('');

    const payload = {
      clienteId: this.clienteId(),
      metodoPago: this.metodoPago(),
      detalles: this.carrito().map((i) => ({ productoId: i.producto.id, cantidad: i.cantidad }))
    };

    this.ventaService.registrar(payload).subscribe({
      next: (venta) => {
        this.procesando.set(false);
        this.mensaje.set(`✅ Venta #${venta.id} registrada — Total: S/ ${venta.total.toFixed(2)}`);
        this.limpiar();
        this.cargarProductos();
        setTimeout(() => this.mensaje.set(''), 5000);
      },
      error: (err) => {
        this.procesando.set(false);
        this.error.set(err.error?.message || 'No se pudo registrar la venta.');
      }
    });
  }
}
