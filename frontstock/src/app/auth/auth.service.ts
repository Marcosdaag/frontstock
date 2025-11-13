// auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private apiUrl = 'https://stockapi-2t3a.onrender.com/login'; // ajustá según tu API

    constructor(private http: HttpClient, private router: Router) { }

    login(user: string, password: string) {
        return this.http.post<{ authorization: string }>(this.apiUrl, { user, password }).pipe(tap(response => {
            localStorage.setItem('token', response.authorization);
            this.router.navigate(['/managment']);
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
