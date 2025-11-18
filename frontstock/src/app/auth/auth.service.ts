// auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { Global } from '../services/global.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private apiUrl = Global.url+'login';

    constructor(private http: HttpClient, private router: Router) { }

    // En auth.service.ts

    login(username: string, password: string) {
        return this.http.post<{ token: string }>(this.apiUrl, { username, password })
            .pipe(
                tap(response => {
                    if (response && response.token) {
                        localStorage.setItem('token', response.token);
                        this.router.navigate(['/managment']);
                    } else {
                        console.error('La API dio OK pero no mandó el token.');
                        throw new Error('Respuesta del servidor no válida.');
                    }
                })
            );
    }

    logout() {
        localStorage.removeItem('token');
        this.router.navigate(['/login']);
    }

    getToken(): string | null {
        return localStorage.getItem('token');
    }

    isLoggedIn(): boolean {
        return !!this.getToken();
    }
}
