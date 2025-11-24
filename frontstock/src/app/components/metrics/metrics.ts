import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core'; // <--- 1. AGREGAR ChangeDetectorRef
import { OrderService } from '../../services/order.service';

import {
  ChartComponent,
  // ... (resto de imports de ApexCharts siguen igual)
} from "ng-apexcharts";

@Component({
  selector: 'app-metrics',
  standalone: false,
  templateUrl: './metrics.html',
  styleUrls: ['./metrics.css']
})
export class Metrics implements OnInit {

  @ViewChild("chart") chart: ChartComponent | undefined;

  public chartOptions: any;
  public todasLasOrdenes: any[] = [];
  public fechaActual: Date = new Date();
  public nombreMes: string = '';
  public totalMesDinero: number = 0;
  public totalMesCantidad: number = 0;

  // 2. NUEVA VARIABLE PARA CONTROLAR LA VISUALIZACIÓN
  public datosCargados: boolean = false;

  // 3. INYECTAR ChangeDetectorRef EN EL CONSTRUCTOR
  constructor(
    private _orderService: OrderService,
    private cdr: ChangeDetectorRef
  ) {
    // ... (Tu función formatMoney y la configuración inicial de chartOptions siguen igual) ...
    const formatMoney = (value: number) => {
      if (value >= 1000000) return '$' + (value / 1000000).toFixed(1) + 'M';
      if (value >= 1000) return '$' + (value / 1000).toFixed(0) + 'k';
      return '$' + value;
    };

    this.chartOptions = {
      // ... (Toda tu configuración chartOptions original va aquí, NO CAMBIA NADA) ...
      // Asegúrate de que series empiece vacío: series: []
      series: [],
      chart: {
        height: 380,
        type: "line",
        toolbar: { show: false },
        fontFamily: 'inherit',
        background: 'transparent',
        animations: { enabled: true }
      },
      stroke: { width: [3, 0], curve: 'smooth' },
      plotOptions: {
        bar: { columnWidth: '50%', borderRadius: 4 }
      },
      colors: ['#10b981', '#3b82f6'],
      dataLabels: {
        enabled: true,
        enabledOnSeries: [0, 1],
        formatter: function (val: any, opts: any) {
          if (opts.seriesIndex === 0) return formatMoney(val);
          return val;
        },
        style: { fontSize: '10px', fontWeight: 'bold', colors: ['#10b981', '#3b82f6'] },
        background: {
          enabled: true,
          foreColor: '#0f172a',
          padding: 4,
          borderRadius: 2,
          opacity: 0.9,
          borderWidth: 0
        },
        offsetY: -5
      },
      legend: { show: false },
      grid: {
        borderColor: '#334155',
        strokeDashArray: 4,
        xaxis: { lines: { show: false } },
        padding: { left: 20, right: 0 }
      },
      xaxis: {
        categories: [],
        labels: { show: true, style: { colors: '#94a3b8', fontSize: '12px' } },
        axisBorder: { show: false },
        axisTicks: { show: false },
        tooltip: { enabled: false }
      },
      yaxis: [
        {
          seriesName: "Ingresos",
          labels: {
            style: { colors: '#10b981', fontWeight: 600 },
            formatter: (val: number) => formatMoney(val)
          },
          title: { text: "Ingresos", style: { color: '#10b981', fontWeight: 600 } }
        },
        {
          seriesName: "Ventas",
          opposite: true,
          labels: {
            style: { colors: '#3b82f6', fontWeight: 600 },
            formatter: (val: number) => val.toFixed(0)
          },
          title: { text: "Cantidad", style: { color: '#3b82f6', fontWeight: 600 } }
        }
      ],
      tooltip: {
        theme: 'dark',
        shared: true,
        intersect: false,
        y: {
          formatter: function (val: any, opts: any) {
            if (opts.seriesIndex === 0) return '$' + val.toLocaleString();
            return val + ' ventas';
          }
        }
      },
      fill: {
        type: ['gradient', 'solid'],
        gradient: {
          shade: 'dark',
          type: "vertical",
          shadeIntensity: 0.5,
          gradientToColors: undefined,
          inverseColors: true,
          opacityFrom: 0.5,
          opacityTo: 0.1,
          stops: [0, 100]
        }
      }
    };
  }

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos() {
    this._orderService.getOrders().subscribe({
      next: (res: any) => {
        this.todasLasOrdenes = Array.isArray(res) ? res : (res.orders || res);
        this.procesarDatosPorMes();
      },
      error: (e) => console.error(e)
    });
  }

  cambiarMes(direccion: number) {
    // Pequeño truco: Ocultamos el gráfico un instante al cambiar de mes para reiniciar la animación
    this.datosCargados = false;

    this.fechaActual.setMonth(this.fechaActual.getMonth() + direccion);
    this.fechaActual = new Date(this.fechaActual);

    this.procesarDatosPorMes();
  }

  procesarDatosPorMes() {
    const año = this.fechaActual.getFullYear();
    const mes = this.fechaActual.getMonth();

    const opciones: any = { month: 'long', year: 'numeric' };
    let nombre = this.fechaActual.toLocaleDateString('es-ES', opciones);
    this.nombreMes = nombre.charAt(0).toUpperCase() + nombre.slice(1);

    const diasEnMes = new Date(año, mes + 1, 0).getDate();
    const datosDinero = new Array(diasEnMes).fill(0);
    const datosCantidad = new Array(diasEnMes).fill(0);
    const etiquetasDias = Array.from({ length: diasEnMes }, (_, i) => (i + 1).toString());

    this.totalMesDinero = 0;
    this.totalMesCantidad = 0;

    this.todasLasOrdenes.forEach(orden => {
      const fechaOrden = new Date(orden.createdAt);
      if (fechaOrden.getMonth() === mes && fechaOrden.getFullYear() === año) {
        const dia = fechaOrden.getDate();
        datosDinero[dia - 1] += orden.total;
        datosCantidad[dia - 1] += 1;
        this.totalMesDinero += orden.total;
        this.totalMesCantidad += 1;
      }
    });

    // Actualizamos los datos
    this.chartOptions.series = [
      { name: "Ingresos", type: "line", data: datosDinero },
      { name: "Ventas", type: "column", data: datosCantidad }
    ];

    this.chartOptions.xaxis = {
      ...this.chartOptions.xaxis,
      categories: etiquetasDias
    };

    // 4. EL TRUCO FINAL: Activamos la bandera y forzamos la detección de cambios
    this.datosCargados = true;
    this.cdr.detectChanges(); // <--- OBLIGAMOS A ANGULAR A RENDERIZAR AHORA
  }
}