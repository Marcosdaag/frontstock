import { Component, OnInit } from '@angular/core';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-products',
  standalone: false,
  templateUrl: './products.html',
  styleUrl: './products.css',
  providers: [ProductService]
})
export class Products implements OnInit {
  public allProducts: Product[] = []; 
  public products: Product[] = []; // Esta es la que se muestra en el HTML
  public searchTerm: string = '';  // Lo que escribe el usuario

  public newProduct: Product;

  public costPrice: number | null = null; // Precio de costo
  public markup: number | null = null;

  constructor(
    private _productService: ProductService
  ) {
    // Inicializamos el producto vacío (ID, Brand, Name, Stock, Price, Normalized)
    // El ID va vacío porque mongo lo genera solo
    this.newProduct = new Product('', '', '', 0, 0, '');
  }

  ngOnInit(): void {
    // Apenas carga la página, pedimos los productos
    this.getProducts();
  }

  calculateFinalPrice() {
    // 1. Usamos '?? 0' (Nullish Coalescing) para asegurar que si costPrice
    //    es 'null' o 'undefined', el valor usado sea 0 para la matemática.
    const cost = this.costPrice ?? 0;
    const profitMargin = this.markup ?? 0;

    // 2. Quitamos el 'if' que causaba el fallo y simplemente verificamos la validez
    if (cost >= 0) {
      // Cálculo: Costo + (Costo * Porcentaje / 100)
      const profit = cost * (profitMargin / 100);
      this.newProduct.price = Math.round(cost + profit);
    } else {
      // Si por alguna razón es negativo (aunque HTML lo previene), lo reseteamos a 0
      this.newProduct.price = 0;
    }
  }

  // 1. LISTAR PRODUCTOS
  getProducts() {
    this._productService.getProducts().subscribe({
      next: (response) => {
        // Según tu controller de Node, devuelve { products: [...] }
        if (response.products) {
          this.allProducts = response.products;
          this.products = this.allProducts;
        }
      },
      error: (err) => {
        console.log('Error al cargar productos', err);
      }
    });
  }

  // 2. GUARDAR NUEVO PRODUCTO
  saveNewProduct() {
    this._productService.saveProduct(this.newProduct).subscribe({
      next: (response) => {
        this.getProducts();
        this.newProduct = new Product('', '', '', 0, 0, '');
        this.costPrice = null;
        this.markup = null;
      },
      error: (err) => {
        console.log(err);
        alert("❌ Error al crear el producto");
      }
    });
  }

  // 3. ACTUALIZAR (Edición en línea)
  updateProduct(product: Product) {
    this._productService.updateProduct(product).subscribe({
      next: (response) => {
        console.log('Producto actualizado', response);
      },
      error: (err) => {
        console.log(err);
        alert("❌ Error al actualizar. Revisa tu conexión o token.");
      }
    });
  }

  // 4. BORRAR PRODUCTO
  deleteProduct(id: string) {
    // Preguntamos antes de borrar para evitar accidentes
    if(confirm("¿Estás seguro de que quieres eliminar este producto?")) {
      this._productService.deleteProduct(id).subscribe({
        next: (response) => {
          // Opción A: Recargar todo (más lento)
          // this.getProducts(); 
          
          // Opción B: Filtrar la lista localmente (más rápido y fluido)
          this.products = this.products.filter(prod => prod._id !== id);
        },
        error: (err) => {
          console.log(err);
          alert("❌ No se pudo eliminar el producto.");
        }
      });
    }
  }

  // 3. NUEVA FUNCIÓN: Filtrado en tiempo real
  onSearch() {
    if (this.searchTerm.length === 0) {
      // Si el buscador está vacío, mostramos todo de nuevo usando el respaldo
      this.products = this.allProducts;
    } else {
      // Si hay texto, filtramos buscando en Nombre O en Marca (ignorando mayúsculas)
      this.products = this.allProducts.filter(product => 
        product.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        product.brand.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }
}
