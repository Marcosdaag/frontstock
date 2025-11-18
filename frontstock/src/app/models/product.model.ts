// Modelo que hace referencia al schema utilizado para los objetos pendigs dentro de la db

export class Product {
    constructor(
        public _id: string,
        public brand: string,
        public name: string,
        public stock: number,
        public price: number,
        public normalizedName: string
    ) { }
}