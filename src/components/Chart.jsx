import React, { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ScatterController
} from 'chart.js';
import { Line, Scatter } from 'react-chartjs-2';
import { Box, FormControl, RadioGroup, FormControlLabel, Radio, Paper } from '@mui/material';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ScatterController
);

const Chart = ({ data, calculations }) => {
  const [chartType, setChartType] = useState('ns');

  const getChartData = () => {
    switch (chartType) {
      case 'ns':
        return {
          labels: data.map(item => item.year),
          datasets: [
            {
              label: 'Liquid',
              data: data.map(item => item.liquid),
              borderColor: 'rgb(53, 162, 235)',
              backgroundColor: 'rgba(53, 162, 235, 0.5)',
              type: 'line',
            },
            {
              label: 'Delta Liquid',
              data: calculations?.ns_calc?.map(item => ({
                x: item.year,
                y: item.deltaLiquid
              })),
              borderColor: 'rgb(255, 99, 132)',
              backgroundColor: 'rgba(255, 99, 132, 0.5)',
              type: 'scatter',
            }
          ],
        };
      case 'sp':
        return {
          labels: data.map(item => item.year),
          datasets: [
            {
              label: 'Watercut',
              data: calculations?.sp_calc?.map(item => item.watercut),
              borderColor: 'rgb(75, 192, 192)',
              backgroundColor: 'rgba(75, 192, 192, 0.5)',
            }
          ],
        };
      case 'm':
        return {
          labels: data.map(item => item.year),
          datasets: [
            {
              label: 'Oil',
              data: data.map(item => item.oil),
              borderColor: 'rgb(255, 99, 132)',
              backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
            {
              label: 'Delta Oil',
              data: calculations?.m_calc?.map(item => item.deltaOil),
              borderColor: 'rgb(53, 162, 235)',
              backgroundColor: 'rgba(53, 162, 235, 0.5)',
              type: 'scatter',
            }
          ],
        };
      default:
        return {
          labels: data.map(item => item.year),
          datasets: [
            {
              label: 'Oil',
              data: data.map(item => item.oil),
              borderColor: 'rgb(255, 99, 132)',
              backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
            {
              label: 'Liquid',
              data: data.map(item => item.liquid),
              borderColor: 'rgb(53, 162, 235)',
              backgroundColor: 'rgba(53, 162, 235, 0.5)',
            },
            {
              label: 'Waters',
              data: data.map(item => item.waters),
              borderColor: 'rgb(75, 192, 192)',
              backgroundColor: 'rgba(75, 192, 192, 0.5)',
            },
          ],
        };
    }
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Production Data Analysis',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <Box sx={{ width: '100%', mt: 3 }}>
      <Paper sx={{ p: 2, mb: 2 }}>
        <FormControl component="fieldset">
          <RadioGroup
            row
            value={chartType}
            onChange={(e) => setChartType(e.target.value)}
          >
            <FormControlLabel value="ns" control={<Radio />} label="N-S" />
            <FormControlLabel value="sp" control={<Radio />} label="S-P" />
            <FormControlLabel value="m" control={<Radio />} label="M" />
            <FormControlLabel value="s" control={<Radio />} label="S" />
            <FormControlLabel value="p" control={<Radio />} label="P" />
            <FormControlLabel value="k" control={<Radio />} label="K" />
          </RadioGroup>
        </FormControl>
      </Paper>
      
      <Paper sx={{ p: 2 }}>
        {getChartData().datasets.some(dataset => dataset.type === 'scatter') ? (
          <Scatter options={options} data={getChartData()} />
        ) : (
          <Line options={options} data={getChartData()} />
        )}
      </Paper>
    </Box>
  );
};

export default Chart;
