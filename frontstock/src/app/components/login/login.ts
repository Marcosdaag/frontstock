import { Component } from '@angular/core';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  // 1. Variable para rastrear si la contraseña es visible (por defecto, es falsa/oculta)
  public passwordVisible: boolean = false;

  constructor() { }

  /**
   * Método para alternar la visibilidad de la contraseña.
   */
  public togglePasswordVisibility(): void {
    // Simplemente invierte el valor actual de la variable
    this.passwordVisible = !this.passwordVisible;
  }
}
