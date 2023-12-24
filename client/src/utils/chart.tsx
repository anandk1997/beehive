import faker from "faker";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

export const options = () => ({
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
    title: {
      display: false,
      text: "Chart.js Line Chart",
    },
    tooltip: {
      callbacks: {
        label: (context: any) => {
          // const label = context.dataset.label || "";
          const value = context.parsed.y || 0;
          const xValue = context.parsed.x || 0;
          // Use the provided timestamp argument
          const timestamp = context.dataset.timestamps[context.dataIndex];
          const xMP0 = context.dataset.xMP0[context.dataIndex];
          return `${"TimeStamp"}: (${timestamp}) xMP: ${xValue} yMP: ${value} xMP0:${xMP0}`;
        },
      },
    },
  },
  scales: {
    x: {
      type: "linear" as const,
      position: "bottom" as const,
      min: 0,
      max: 12,
    },
    y: {
      min: 0,
      max: 12,
    },
  },
});

export const data = () => ({
  labels: [],
  datasets: [
    {
      label: ``,
      data: [],
      timestamps: [],
      xMP0: [],
      xMP1: [],
      borderColor: "rgb(255, 99, 132)",
      backgroundColor: "rgba(255, 99, 132, 0.5)",
    },
  ],
});

export const labels = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
];

export const fakerData = {
  labels,
  datasets: [
    {
      label: "Dataset 1",
      data: labels.map(() => faker.datatype.number({ min: -1000, max: 1000 })),
      borderColor: "rgb(255, 99, 132)",
      backgroundColor: "rgba(255, 99, 132, 0.5)",
    },
  ],
};

export const registerChart = () =>
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
  );
