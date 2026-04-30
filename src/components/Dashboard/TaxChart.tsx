import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import { ChartType } from '../../types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface TaxChartProps {
  chartType: ChartType;
  oldRegimeTax: number;
  newRegimeTax: number;
  savings: number;
}

export function TaxChart({ chartType, oldRegimeTax, newRegimeTax, savings }: TaxChartProps) {
  const data = {
    labels: ['Old Regime', 'New Regime', 'Savings'],
    datasets: [
      {
        data: [oldRegimeTax, newRegimeTax, Math.abs(savings)],
        backgroundColor: [
          '#7C3AED',
          '#A855F7',
          '#FFD700',
        ],
        borderColor: [
          '#6D28D9',
          '#9333EA',
          '#FFC700',
        ],
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          font: {
            size: 14,
            weight: 'bold' as const,
          },
          color: '#374151',
        },
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const value = context.parsed.y || context.parsed;
            return `${context.label}: ₹${value.toLocaleString()}`;
          },
        },
        backgroundColor: '#374151',
        titleColor: '#FFD700',
        bodyColor: '#FFFFFF',
        borderColor: '#FFD700',
        borderWidth: 1,
      },
    },
    ...(chartType === 'bar' && {
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: '#E5E7EB',
          },
          ticks: {
            color: '#6B7280',
            callback: function(value: any) {
              return '₹' + value.toLocaleString();
            },
          },
        },
        x: {
          grid: {
            color: '#E5E7EB',
          },
          ticks: {
            color: '#6B7280',
          },
        },
      },
    }),
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 h-96">
      {chartType === 'pie' ? (
        <Pie data={data} options={options} />
      ) : (
        <Bar data={data} options={options} />
      )}
    </div>
  );
}