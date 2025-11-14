// src/app/guards/login.guard.ts

import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Injectable({
    providedIn: 'root'
})
export class LoginGuard implements CanActivate {

    constructor(private authService: AuthService, private router: Router) { }

    canActivate(): boolean {
        // Si el usuario YA está logueado...
        if (this.authService.isLoggedIn()) {
            console.log('Usuario ya logueado, redirigiendo al panel...');

            // ...lo mandamos directo a la zona privada
            this.router.navigate(['/managment']);
            return false; // Bloqueamos el acceso a la página de Login/Home
        }

        // Si NO está logueado, dejamos que entre al Login tranquilamente
        return true;
    }
}