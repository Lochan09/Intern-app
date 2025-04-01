import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { DataService } from '../../data.service';
import { adminData } from '../../model/admindata';
import { Router } from '@angular/router';

Chart.register(...registerables);

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss'],
})
export class AdminDashboardComponent implements OnInit {
  pieChart: any;
  barChart: any;
  completionChart: any;
  lineChart: any;

  constructor(private service: DataService, private router: Router) {}

  ngOnInit(): void {
    this.loadChartData();
  }

  loadChartData(): void {
    this.service.loadAdminData().subscribe((data: adminData[]) => {
      const statusCounts = this.calculateStatusCounts(data);
      const departmentCounts = this.calculateDepartmentCounts(data);
      const completionPercentages = this.calculateCompletionPercentages(data);

      const statusLabels = Object.keys(statusCounts);
      const statusValues = Object.values(statusCounts);
      const statusColors = this.generateColors(statusLabels.length);

      const departmentLabels = Object.keys(departmentCounts);
      const departmentValues = Object.values(departmentCounts);
      const departmentColors = this.generateColors(departmentLabels.length);

      const completionLabels = Object.keys(completionPercentages);
      const completionValues = Object.values(completionPercentages);
      const completionColors = this.generateColors(completionLabels.length);

      this.renderPieChart(statusLabels, statusValues, statusColors);
      this.renderBarChart(departmentLabels, departmentValues, departmentColors);
      this.renderCompletionChart(
        completionLabels,
        completionValues,
        completionColors
      );
      this.renderLineChart(
        completionLabels,
        completionValues,
        completionColors
      );
    });
  }

  calculateStatusCounts(data: adminData[]): { [key: string]: number } {
    const statusCounts: { [key: string]: number } = {};

    data.forEach((item) => {
      if (statusCounts[item.status]) {
        statusCounts[item.status]++;
      } else {
        statusCounts[item.status] = 1;
      }
    });

    return statusCounts;
  }

  calculateDepartmentCounts(data: adminData[]): { [key: string]: number } {
    const departmentCounts: { [key: string]: number } = {};

    data.forEach((item) => {
      if (departmentCounts[item.department]) {
        departmentCounts[item.department]++;
      } else {
        departmentCounts[item.department] = 1;
      }
    });

    return departmentCounts;
  }

  calculateCompletionPercentages(data: adminData[]): { [key: string]: number } {
    const departmentCounts: {
      [key: string]: { completed: number; total: number };
    } = {};

    data.forEach((item) => {
      if (!departmentCounts[item.department]) {
        departmentCounts[item.department] = { completed: 0, total: 0 };
      }
      departmentCounts[item.department].total++;
      if (item.status === 'completed') {
        departmentCounts[item.department].completed++;
      }
    });

    const completionPercentages: { [key: string]: number } = {};
    Object.keys(departmentCounts).forEach((department) => {
      const counts = departmentCounts[department];
      completionPercentages[department] =
        (counts.completed / counts.total) * 100;
    });

    return completionPercentages;
  }

  generateColors(count: number): string[] {
    const predefinedColors = ['#00CCCC', '#F2C114', '#FF6B4ACC'];
    const colors = [];
    for (let i = 0; i < count; i++) {
      const color = `hsl(${(i * 360) / count}, 70%, 50%)`;
      colors.push(predefinedColors[i % predefinedColors.length]);
    }
    return colors;
  }

  renderPieChart(labels: string[], values: number[], colors: string[]): void {
    const ctx = document.getElementById('pieChart') as HTMLCanvasElement;
    if (ctx) {
      this.pieChart = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: labels,
          datasets: [
            {
              data: values,
              backgroundColor: colors,
            },
          ],
        },
        options: {
          scales: {
            x: {
              beginAtZero: true,
              ticks: {
                color: '#ffffff',
              },
              grid: {
                color: '#ffffff',
              },
            },
            y: {
              beginAtZero: true,
              max: 100,
              ticks: {
                color: '#ffffff',
              },
              grid: {
                color: '#ffffff',
              },
            },
          },
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
              labels: {
                color: '#ffffff',
              },
            },
            tooltip: {
              callbacks: {
                label: function (context) {
                  const label = context.label || '';
                  const value = context.raw || 0;
                  const total = context.dataset.data.reduce((a, b) => a + b, 0);
                  const percentage = (
                    (Number(value) / Number(total)) *
                    100
                  ).toFixed(2);
                  return `${label}: ${percentage}%`;
                },
              },
            },
          },
        },
      });
    } else {
      console.error('Canvas element not found');
    }
  }

  renderBarChart(labels: string[], values: number[], colors: string[]): void {
    const ctx = document.getElementById('barChart') as HTMLCanvasElement;
    if (ctx) {
      this.barChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [
            {
              data: values,
              backgroundColor: colors,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: false,
              labels: {
                color: '#ffffff',
              },
            },
            tooltip: {
              callbacks: {
                label: function (context) {
                  const label = context.label || '';
                  const value = context.raw || 0;
                  return `${label}: ${value}`;
                },
              },
            },
          },
          scales: {
            x: {
              beginAtZero: true,
              ticks: {
                color: '#ffffff',
              },
              grid: {
                color: '#ffffff',
              },
            },
            y: {
              beginAtZero: true,
              ticks: {
                color: '#ffffff',
              },
              grid: {
                color: '#ffffff',
              },
            },
          },
        },
      });
    } else {
      console.error('Canvas element not found');
    }
  }

  renderCompletionChart(
    labels: string[],
    values: number[],
    colors: string[]
  ): void {
    const ctx = document.getElementById('completionChart') as HTMLCanvasElement;
    if (ctx) {
      this.completionChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [
            {
              data: values,
              backgroundColor: colors,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: false,
              labels: {
                color: '#ffffff',
              },
            },
            tooltip: {
              callbacks: {
                label: function (context) {
                  const label = context.label || '';
                  const value = Number(context.raw) || 0;
                  return `${label}: ${value.toFixed(2)}%`;
                },
              },
            },
          },
          scales: {
            x: {
              beginAtZero: true,
              ticks: {
                color: '#ffffff',
              },
              grid: {
                color: '#ffffff',
              },
            },
            y: {
              beginAtZero: true,
              max: 100,
              ticks: {
                color: '#ffffff',
              },
              grid: {
                color: '#ffffff',
              },
            },
          },
        },
      });
    } else {
      console.error('Canvas element not found');
    }
  }

  renderLineChart(labels: string[], values: number[], colors: string[]): void {
    const ctx = document.getElementById('lineChart') as HTMLCanvasElement;
    if (ctx) {
      this.lineChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [
            {
              data: values,
              backgroundColor: colors[0],
              borderColor: colors[0],
              fill: false,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: false,
              labels: {
                color: '#ffffff',
              },
            },
            tooltip: {
              callbacks: {
                label: function (context) {
                  const label = context.label || '';
                  const value = Number(context.raw) || 0;
                  return `${label}: ${value.toFixed(2)}%`;
                },
              },
            },
          },
          scales: {
            x: {
              beginAtZero: true,
              ticks: {
                color: '#ffffff',
              },
              grid: {
                color: '#ffffff',
              },
            },
            y: {
              beginAtZero: true,
              max: 100,
              ticks: {
                color: '#ffffff',
              },
              grid: {
                color: '#ffffff',
              },
            },
          },
        },
      });
    } else {
      console.error('Canvas element not found');
    }
  }
  navigateTo(route: string): void {
    this.router.navigate([route]);
  }
}
