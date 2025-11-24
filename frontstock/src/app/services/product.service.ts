// Servicio de productos, logica que interactua con los objetos del front y llama a los metodos de la API
import { Injectable } from "@angular/core"; // Decorador
import { HttpClient, HttpHeaders } from "@angular/common/http"; // Para hacer peticiones ajax
import { Observable } from "rxjs"; // Maneja los datos de las peticiones http
import { Global } from "./global.service"; // Fichero de configuracion global y variables
import { Product } from "../models/product.model";

// Al usar el decorador puedo usar el servicio en otros ficheros sin necesidad de importar el modulo
@Injectable({
    providedIn: 'root'
})
export class ProductService {
    public url: string;

    constructor(
        private _http: HttpClient
    ) {
        this.url = Global.url;
    }

    // Metodos

    // Guardar nuevos pendings
    saveProduct(product: Product) {
        let params = JSON.stringify(product);
        let headers = new HttpHeaders().set('Content-Type', 'application/json');

        return this._http.post(this.url + 'products', params, { headers: headers });
    }

    // Listar los pendings
    getProducts(): Observable<any> {
        let headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this._http.get(this.url + 'products', { headers: headers });
    }

    // Borrar pending
    deleteProduct(id: string): Observable<any> {
        let headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this._http.delete(this.url + 'products/' + id, { headers: headers });
    }

    // Actualizar un producto existente
    updateProduct(product: Product): Observable<any> {
        // Convertimos el objeto producto a un string JSON
        let params = JSON.stringify(product);

        // Definimos las cabeceras
        let headers = new HttpHeaders().set('Content-Type', 'application/json');

        return this._http.put(this.url + 'products/' + product._id, params, { headers: headers });
    }
}