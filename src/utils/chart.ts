import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { Order } from '~/types/order';

// Registrasi komponen Chart.js
Chart.register(...registerables);

export async function renderChart(orders: Order[]): Promise<void> {
  const dailySalesMap: Record<string, number> = {};

  orders.forEach(order => {
    if (!order.createdAt || !order.totalAmount) return;
    const date = new Date(order.createdAt).toISOString().split('T')[0]; // format: YYYY-MM-DD

    if (!dailySalesMap[date]) dailySalesMap[date] = 0;
    dailySalesMap[date] += order.totalAmount;
  });

  const labels = Object.keys(dailySalesMap).sort(); // ascending dates
  const sales = labels.map(date => dailySalesMap[date]);

  const config: ChartConfiguration<'line'> = {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: 'Total Penjualan Harian',
        data: sales,
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: false,
        tension: 0.1
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: true,
        },
      },
      scales: {
        x: {
          title: {
            display: true,
            text: 'Tanggal'
          }
        },
        y: {
          title: {
            display: true,
            text: 'Total Penjualan (Rp)'
          },
          beginAtZero: true
        }
      }
    }
  };

  const ctx = document.getElementById('salesChart') as HTMLCanvasElement | null;
  if (ctx) {
    new Chart(ctx, config);
  }
}
