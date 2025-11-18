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
        // Si sale bien:
        // 1. Recargamos la lista para ver el nuevo producto
        this.getProducts();
        // 2. Limpiamos el formulario reiniciando la variable
        this.newProduct = new Product('', '', '', 0, 0, '');
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
