import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ClienteService } from '../../services/cliente';
@Component({
 selector: 'app-cliente-form',
 standalone: true,
 imports: [CommonModule, ReactiveFormsModule],
 templateUrl: './cliente-form.html',
 styleUrl: './cliente-form.css'
})
export class ClienteFormComponent {
 private fb = inject(FormBuilder);
 private clienteService = inject(ClienteService);
 mensaje = '';
 clientes: any[] = [];
 clienteForm = this.fb.group({
 nombres: ['', [Validators.required, Validators.minLength(3)]],
 apellidos: ['', [Validators.required]],
 correo: ['', [Validators.required, Validators.email]],
 edad: [null, [Validators.required, Validators.min(18), Validators.max(80)]],
 telefono: ['', [Validators.pattern('^[0-9]{9}$')]],
 tipoDocumento: ['', [Validators.required]],
 numeroDocumento: ['', [Validators.required]],
 aceptaTerminos: [false, [Validators.requiredTrue]]
 });
 campoInvalido(campo: string): boolean {
 const control = this.clienteForm.get(campo);
 return !!(control && control.invalid && control.touched);
 }
 guardar(): void {
 if (this.clienteForm.invalid) {
 this.clienteForm.markAllAsTouched();
 this.mensaje = 'Revise los campos obligatorios.';
 return;
 }
 this.clienteService.registrar(this.clienteForm.value).subscribe({
  next: () => {
 this.mensaje = 'Cliente registrado correctamente.';
 this.limpiar();
 this.listar();
 },
 error: (err) => {
 this.mensaje = err.error?.message || 'No se pudo registrar el cliente.';
 }
 });
 }
 limpiar(): void {
 this.clienteForm.reset({ aceptaTerminos: false });
 }
 listar(): void {
 this.clienteService.listar().subscribe({
 next: (data) => this.clientes = data,
 error: () => this.mensaje = 'No se pudo listar clientes.'
 });
 }
}