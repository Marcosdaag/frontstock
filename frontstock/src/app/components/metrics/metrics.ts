import { Component, OnInit, ViewChild } from '@angular/core';
import { OrderService } from '../../services/order.service';

import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexStroke,
  ApexYAxis,
  ApexLegend,
  ApexGrid,
  ApexTooltip,
  ApexPlotOptions,
  ApexFill
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

  constructor(private _orderService: OrderService) {

    // --- FUNCIÓN DE FORMATEO DE DINERO (Mágica) ---
    // Convierte 1500000 en $1.5M y 2000 en $2k
    const formatMoney = (value: number) => {
      if (value >= 1000000) return '$' + (value / 1000000).toFixed(1) + 'M'; // Millones
      if (value >= 1000) return '$' + (value / 1000).toFixed(0) + 'k';       // Miles
      return '$' + value;
    };

    this.chartOptions = {
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

      // --- ETIQUETAS SOBRE LAS BARRAS/LÍNEAS ---
      dataLabels: {
        enabled: true,
        enabledOnSeries: [0, 1],
        formatter: function (val: any, opts: any) {
          // Si es la serie de Dinero (0), usamos el formato corto ($1.5k)
          if (opts.seriesIndex === 0) return formatMoney(val);
          return val; // Si es cantidad, mostramos el número normal
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
        padding: { left: 20, right: 0 } // Un poco más de margen a la izquierda para los números
      },

      xaxis: {
        categories: [],
        labels: { show: true, style: { colors: '#94a3b8', fontSize: '12px' } },
        axisBorder: { show: false },
        axisTicks: { show: false },
        tooltip: { enabled: false }
      },

      // --- EJES Y (AQUÍ ESTÁ LA CLAVE DEL FORMATO) ---
      yaxis: [
        {
          seriesName: "Ingresos",
          labels: {
            style: { colors: '#10b981', fontWeight: 600 },
            // Usamos la función abreviada aquí también
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

      // --- TOOLTIP (Aquí sí mostramos el número completo) ---
      tooltip: {
        theme: 'dark',
        shared: true,
        intersect: false,
        y: {
          formatter: function (val: any, opts: any) {
            // En el tooltip queremos ver el detalle exacto: $1,250,000
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

    this.chartOptions.series = [
      { name: "Ingresos", type: "line", data: datosDinero },
      { name: "Ventas", type: "column", data: datosCantidad }
    ];

    this.chartOptions.xaxis = {
      ...this.chartOptions.xaxis,
      categories: etiquetasDias
    };
  }
}