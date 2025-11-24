import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-orders',
  standalone: false,
  templateUrl: './orders.html',
  styleUrl: './orders.css',
})
export class Orders implements OnInit {

  // --- CONTROL DE VISTAS ---
  public vistaActual: string = 'NUEVA';

  // --- DATOS DE PRODUCTOS ---
  public productosTodos: any[] = []; // 🔒 COPIA DE SEGURIDAD (Inventario completo)
  public productos: any[] = [];      // 👁️ LISTA VISIBLE (Lo que se ve en pantalla, se filtra)
  public historial: any[] = [];

  // --- BUSCADOR ---
  public terminoBusqueda: string = '';

  // --- CARRITO ---
  public carrito: Array<{ producto: any, cantidad: number, subtotal: number, customName?: string }> = [];
  public total: number = 0;

  // --- VENTA MANUAL ---
  public montoManual: number | null = null;
  public descripcionManual: string = '';

  constructor(
    private _productService: ProductService,
    private _orderService: OrderService
  ) { }

  ngOnInit(): void {
    this.cargarProductos();
    this.cargarHistorial();
  }

  // ==========================================
  // 1. CARGA DE DATOS (API)
  // ==========================================
  cargarProductos() {
    this._productService.getProducts().subscribe({
      next: (response: any) => {
        let listaRecibida = [];

        // Normalizamos la respuesta de la API
        if (Array.isArray(response)) {
          listaRecibida = response;
        } else if (response.products) {
          listaRecibida = response.products;
        } else if (response.data) {
          listaRecibida = response.data;
        }

        // --- AQUÍ ESTÁ EL CAMBIO ---
        // Ordenamos de Menor a Mayor stock (Ascendente)
        // Si quisieras de Mayor a Menor, sería (b.stock - a.stock)
        listaRecibida.sort((a: any, b: any) => a.stock - b.stock);

        // Guardamos en las variables
        this.productosTodos = listaRecibida;
        this.productos = listaRecibida;
      },
      error: (error) => console.error('Error al cargar productos:', error)
    });
  }

  cargarHistorial() {
    this._orderService.getOrders().subscribe({
      next: (res: any) => {
        this.historial = Array.isArray(res) ? res : (res.orders || res);
      },
      error: (e) => console.error('Error al cargar historial:', e)
    });
  }

  // ==========================================
  // 2. LÓGICA DE FILTRADO (BUSCADOR)
  // ==========================================
  filtrarProductos() {
    // Si no hay texto, restauramos la lista completa desde la copia de seguridad
    if (!this.terminoBusqueda) {
      this.productos = this.productosTodos;
      return;
    }

    const term = this.terminoBusqueda.toLowerCase();

    // Filtramos sobre 'productosTodos' para no perder datos
    this.productos = this.productosTodos.filter(prod => {
      const nombre = prod.name ? prod.name.toLowerCase() : '';
      const marca = prod.brand ? prod.brand.toLowerCase() : '';

      // Coincide si el nombre O la marca contienen el texto
      return nombre.includes(term) || marca.includes(term);
    });
  }

  // ==========================================
  // 3. GESTIÓN DEL CARRITO
  // ==========================================

  // --- AGREGAR PRODUCTO NORMAL ---
  agregarAlCarrito(prod: any) {
    if (prod.stock <= 0) {
      alert('Sin stock disponible');
      return;
    }

    // Buscamos si ya existe en el carrito (excluyendo items manuales)
    const item = this.carrito.find(x => x.producto._id === prod._id && !x.customName);

    if (item) {
      if (item.cantidad < prod.stock) {
        item.cantidad++;
        item.subtotal = item.cantidad * prod.price;
      } else {
        alert('Stock máximo alcanzado para este producto');
      }
    } else {
      this.carrito.push({
        producto: prod,
        cantidad: 1,
        subtotal: prod.price
      });
    }
    this.calcularTotal();
  }

  // --- AGREGAR PRODUCTO MANUAL (VARIOS) ---
  agregarItemManual() {
    if (!this.montoManual || this.montoManual <= 0) {
      alert('Por favor ingresa un monto válido');
      return;
    }

    // IMPORTANTE: Buscamos en 'productosTodos' (la lista maestra)
    // Así funciona aunque el usuario esté filtrando por "Coca Cola" en el buscador
    const productoVarios = this.productosTodos.find(p =>
      (p.brand && p.brand.toLowerCase().includes('varios')) ||
      (p.name && p.name.toLowerCase().includes('varios'))
    );

    if (!productoVarios) {
      alert('❌ ERROR: No se encuentra el producto "Varios" en la base de datos (Precio $1).');
      return;
    }

    this.carrito.push({
      producto: productoVarios,
      cantidad: this.montoManual, // Cantidad = Precio (porque base es $1)
      subtotal: this.montoManual,
      customName: this.descripcionManual || 'Venta Manual'
    });

    // Reset inputs
    this.montoManual = null;
    this.descripcionManual = '';
    this.calcularTotal();
  }

  eliminarDelCarrito(index: number) {
    this.carrito.splice(index, 1);
    this.calcularTotal();
  }

  calcularTotal() {
    this.total = this.carrito.reduce((acc, el) => acc + el.subtotal, 0);
  }

  // ==========================================
  // 4. FINALIZAR VENTA
  // ==========================================
  confirmarVenta() {
    if (this.carrito.length === 0) return;

    // Mapeo para el Backend
    const itemsApi = this.carrito.map(item => ({
      productId: item.producto._id,
      quantity: item.cantidad,
      customName: item.customName
    }));

    this._orderService.saveOrder(itemsApi).subscribe({
      next: () => {
        // Limpieza tras éxito
        this.carrito = [];
        this.total = 0;
        this.terminoBusqueda = ''; // Limpiamos el buscador

        // Recargamos datos
        this.cargarProductos();
        this.cargarHistorial();
      },
      error: (e) => {
        console.error(e);
        alert('Error al procesar la venta.');
      }
    });
  }

  borrarOrden(id: string) {
    if (confirm('¿Eliminar del historial?')) {
      this._orderService.deleteOrder(id).subscribe({
        next: () => this.cargarHistorial(),
        error: (e) => console.error(e)
      });
    }
  }
}