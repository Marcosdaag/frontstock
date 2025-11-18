import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Global } from '../../services/global.service';

@Component({
  selector: 'app-contact',
  standalone: false,
  templateUrl: './contact.html',
  styleUrl: './contact.css',
})
export class Contact {
  contactForm: FormGroup;
  enviado = false;
  cargando = false;
  mensaje = '';

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      message: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.contactForm.invalid) return;

    this.cargando = true;
    this.mensaje = '';

    const formData = this.contactForm.value;

    // 🔗 tu API deployada en Render
    this.http.post(Global.url+'contact', formData).subscribe({
      next: (res: any) => {
        this.cargando = false;
        this.enviado = true;
        this.mensaje = '✅ Mensaje enviado correctamente.';
        this.contactForm.reset();
      },
      error: (err) => {
        this.cargando = false;
        this.mensaje = '❌ Error al enviar el mensaje.';
        console.error(err);
      },
    });
  }
}
