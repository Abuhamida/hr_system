import { ChartConfig } from '@/lib/types/chart';

const defaultColors = [
  '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6',
  '#EC4899', '#06B6D4', '#84CC16', '#F97316', '#6366F1'
];

export const createBarChartConfig = (data: any, title: string): ChartConfig => {
  return {
    type: 'bar',
    data: {
      labels: data.labels,
      datasets: data.datasets.map((dataset: any, index: number) => ({
        ...dataset,
        backgroundColor: dataset.backgroundColor || defaultColors[index % defaultColors.length],
        borderColor: dataset.borderColor || defaultColors[index % defaultColors.length],
        borderWidth: 2,
        borderRadius: 4,
      }))
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top' as const,
        },
        title: {
          display: true,
          text: title,
          font: {
            size: 16,
            weight: 'bold'
          }
        },
        tooltip: {
          mode: 'index',
          intersect: false,
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(0, 0, 0, 0.1)',
          }
        },
        x: {
          grid: {
            display: false
          }
        }
      }
    }
  };
};

export const createLineChartConfig = (data: any, title: string): ChartConfig => {
  return {
    type: 'line',
    data: {
      labels: data.labels,
      datasets: data.datasets.map((dataset: any, index: number) => ({
        ...dataset,
        borderColor: dataset.borderColor || defaultColors[index % defaultColors.length],
        backgroundColor: dataset.backgroundColor || `${defaultColors[index % defaultColors.length]}20`,
        borderWidth: 3,
        tension: 0.1,
        fill: false,
      }))
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top' as const,
        },
        title: {
          display: true,
          text: title,
          font: {
            size: 16,
            weight: 'bold'
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
        }
      }
    }
  };
};

export const createPieChartConfig = (data: any, title: string): ChartConfig => {
  return {
    type: 'pie',
    data: {
      labels: data.labels,
      datasets: [{
        data: data.datasets[0].data,
        backgroundColor: data.datasets[0].backgroundColor || defaultColors,
        borderColor: '#ffffff',
        borderWidth: 2,
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'right' as const,
        },
        title: {
          display: true,
          text: title,
          font: {
            size: 16,
            weight: 'bold'
          }
        }
      }
    }
  };
};

export const createRadarChartConfig = (data: any, title: string): ChartConfig => {
  return {
    type: 'radar',
    data: {
      labels: data.labels,
      datasets: data.datasets.map((dataset: any, index: number) => ({
        ...dataset,
        borderColor: dataset.borderColor || defaultColors[index % defaultColors.length],
        backgroundColor: dataset.backgroundColor || `${defaultColors[index % defaultColors.length]}30`,
        borderWidth: 2,
      }))
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top' as const,
        },
        title: {
          display: true,
          text: title,
          font: {
            size: 16,
            weight: 'bold'
          }
        }
      },
      scales: {
        r: {
          beginAtZero: true,
          ticks: {
            stepSize: 1
          }
        }
      }
    }
  };
};

export const createDoughnutChartConfig = (data: any, title: string): ChartConfig => {
  return {
    type: 'doughnut',
    data: {
      labels: data.labels,
      datasets: [{
        data: data.datasets[0].data,
        backgroundColor: data.datasets[0].backgroundColor || defaultColors,
        borderColor: '#ffffff',
        borderWidth: 2,
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'right' as const,
        },
        title: {
          display: true,
          text: title,
          font: {
            size: 16,
            weight: 'bold'
          }
        }
      }
    }
  };
};