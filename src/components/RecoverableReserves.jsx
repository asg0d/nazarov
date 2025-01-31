import React from 'react';
import { Line } from 'react-chartjs-2';
import { Box, Paper, Typography } from '@mui/material';

const RecoverableReserves = ({ data, calculations }) => {
  const chartData = {
    labels: data.map(item => item.year),
    datasets: [
      {
        label: 'Vmax (Maximum Recoverable)',
        data: calculations?.reserves_calc?.map(item => item.vmax) || [],
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        type: 'line',
      },
      {
        label: 'V fo (Recoverable Oil)',
        data: calculations?.reserves_calc?.map(item => item.vfo) || [],
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        type: 'line',
      },
      {
        label: 'v fw (Recoverable Water)',
        data: calculations?.reserves_calc?.map(item => item.vfw) || [],
        borderColor: 'rgb(153, 102, 255)',
        backgroundColor: 'rgba(153, 102, 255, 0.5)',
        type: 'line',
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Recoverable Reserves Analysis',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Recoverable Reserves Analysis
        </Typography>
        <Line options={chartOptions} data={chartData} />
      </Paper>
    </Box>
  );
};

export default RecoverableReserves;
