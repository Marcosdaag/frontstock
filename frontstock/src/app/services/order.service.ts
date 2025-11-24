import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Global } from "./global.service"; // Fichero de configuracion global y variables

@Injectable({
    providedIn: 'root' // <--- Importante para que no de error
})
export class OrderService {
    public url: string;

    constructor(private _http: HttpClient) {
        this.url = Global.url;
    }

    // Helper para los headers (Token)
    private getHeaders() {
        const token = localStorage.getItem('token'); // O donde guardes el token
        return {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': token ? token : ''
            })
        };
    }

    // 1. Obtener historial
    getOrders(): Observable<any> {
        return this._http.get(this.url + 'orders', this.getHeaders());
    }

    // 2. Crear orden (Tu API espera { items: [...] })
    saveOrder(items: { productId: string; quantity: number }[]): Observable<any> {
        const body = { items: items };
        return this._http.post(this.url + 'orders', body, this.getHeaders());
    }

    // 3. Eliminar orden
    deleteOrder(id: string): Observable<any> {
        return this._http.delete(this.url + 'orders/' + id, this.getHeaders());
    }
}