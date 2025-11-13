import { Component } from '@angular/core';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  //Variables para el login
  username = '';
  password = '';

  // 1. Variable para rastrear si la contraseña es visible (por defecto, es falsa/oculta)
  public passwordVisible: boolean = false;

  constructor(private auth: AuthService) { }

  onSubmit() {
    this.auth.login(this.username, this.password).subscribe({
      next: () => console.log('Login correcto'),
      error: err => alert('Error al iniciar sesión: ' + err.error.message)
    });
  }

  /**
   * Método para alternar la visibilidad de la contraseña.
   */
  public togglePasswordVisibility(): void {
    // Simplemente invierte el valor actual de la variable
    this.passwordVisible = !this.passwordVisible;
  }

}
