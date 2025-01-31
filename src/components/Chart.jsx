import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ScatterController
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { Box, FormControl, RadioGroup, FormControlLabel, Radio, Paper, Button, Snackbar, Alert } from '@mui/material';
import * as XLSX from 'xlsx';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ScatterController
);

const Chart = ({ data, calculations }) => {
  const [chartType, setChartType] = useState('ns');
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!data || !Array.isArray(data) || data.length === 0) {
      setError('No data available for charts');
      return;
    }
    setError(null);
  }, [data]);

  const getChartData = () => {
    if (!data || !Array.isArray(data) || data.length === 0) {
      return {
        labels: [],
        datasets: []
      };
    }

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
              })) || [],
              borderColor: 'rgb(255, 99, 132)',
              backgroundColor: 'rgba(255, 99, 132, 0.5)',
              type: 'scatter',
            }
          ]
        };
      case 'sp':
        return {
          labels: data.map(item => item.year),
          datasets: [
            {
              label: 'Watercut',
              data: calculations?.sp_calc?.map(item => item.watercut) || [],
              borderColor: 'rgb(75, 192, 192)',
              backgroundColor: 'rgba(75, 192, 192, 0.5)',
            }
          ]
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
              data: calculations?.m_calc?.map(item => ({
                x: item.year,
                y: item.deltaOil
              })) || [],
              borderColor: 'rgb(53, 162, 235)',
              backgroundColor: 'rgba(53, 162, 235, 0.5)',
              type: 'scatter',
            }
          ]
        };
      case 's':
      case 'p':
      case 'k':
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
            }
          ]
        };
      case 'results':
        console.log('Results data:', calculations?.results);
        // Make sure we have valid results data
        if (!calculations?.results || !Array.isArray(calculations.results)) {
          return {
            labels: [],
            datasets: []
          };
        }

        // Convert array of objects to arrays of labels and values
        const labels = calculations.results.map(item => item.year);
        const values = calculations.results.map(item => item.value);

        console.log('Processed data:', { labels, values });

        return {
          labels: labels,
          datasets: [
            {
              label: 'Results',
              data: values,
              backgroundColor: [
                'rgba(255, 99, 132, 0.5)',
                'rgba(54, 162, 235, 0.5)',
                'rgba(255, 206, 86, 0.5)',
                'rgba(75, 192, 192, 0.5)',
                'rgba(153, 102, 255, 0.5)',
                'rgba(255, 159, 64, 0.5)'
              ],
              borderColor: [
                'rgb(255, 99, 132)',
                'rgb(54, 162, 235)',
                'rgb(255, 206, 86)',
                'rgb(75, 192, 192)',
                'rgb(153, 102, 255)',
                'rgb(255, 159, 64)'
              ],
              borderWidth: 1
            }
          ]
        };
      default:
        return {
          labels: [],
          datasets: []
        };
    }
  };

  const getChartOptions = () => {
    if (chartType === 'results') {
      return {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Results Analysis',
          },
        },
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      };
    }

    return {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: chartType.toUpperCase() + ' Analysis',
        },
      },
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    };
  };

  const handleExportAllToExcel = () => {
    try {
      console.log('Starting export process...');
      
      const wb = XLSX.utils.book_new();
      
      const createWorksheet = (name, chartData) => {
        const headers = ['Year', ...chartData.datasets.map(ds => ds.label)];
        const rows = chartData.labels.map((year, idx) => {
          const row = [year];
          chartData.datasets.forEach(ds => {
            if (ds.type === 'scatter') {
              const point = ds.data.find(p => p.x === year);
              row.push(point ? point.y : null);
            } else {
              row.push(ds.data[idx]);
            }
          });
          return row;
        });
        
        const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
        
        ws['!cols'] = headers.map(() => ({ wch: 15 }));
        
        return ws;
      };
      
      const chartTypes = {
        'NS Analysis': 'ns',
        'SP Analysis': 'sp',
        'M Analysis': 'm',
        'S Analysis': 's',
        'P Analysis': 'p',
        'K Analysis': 'k'
      };
      
      Object.entries(chartTypes).forEach(([name, type]) => {
        const chartData = {
          labels: data.map(item => item.year),
          datasets: []
        };
        
        switch (type) {
          case 'ns':
            chartData.datasets = [
              {
                label: 'Liquid',
                data: data.map(item => item.liquid)
              },
              {
                label: 'Delta Liquid',
                data: calculations?.ns_calc?.map(item => ({
                  x: item.year,
                  y: item.deltaLiquid
                })),
                type: 'scatter'
              }
            ];
            break;
          case 'sp':
            chartData.datasets = [
              {
                label: 'Watercut',
                data: calculations?.sp_calc?.map(item => item.watercut)
              }
            ];
            break;
          case 'm':
            chartData.datasets = [
              {
                label: 'Oil',
                data: data.map(item => item.oil)
              },
              {
                label: 'Delta Oil',
                data: calculations?.m_calc?.map(item => item.deltaOil),
                type: 'scatter'
              }
            ];
            break;
          case 's':
          case 'p':
          case 'k':
            chartData.datasets = [
              {
                label: 'Oil',
                data: data.map(item => item.oil)
              },
              {
                label: 'Liquid',
                data: data.map(item => item.liquid)
              },
              {
                label: 'Waters',
                data: data.map(item => item.waters)
              }
            ];
            break;
        }
        
        const ws = createWorksheet(name, chartData);
        XLSX.utils.book_append_sheet(wb, ws, name);
      });
      
      if (calculations?.results && Array.isArray(calculations.results)) {
        console.log('Adding results to Excel:', calculations.results);
        const resultsData = [
          ['Method', 'Value'],
          ...calculations.results.map(item => [item.year, item.value])
        ];
        const ws = XLSX.utils.aoa_to_sheet(resultsData);
        
        ws['!cols'] = [
          { wch: 20 }, // Method column
          { wch: 15 }  // Value column
        ];
        
        const range = XLSX.utils.decode_range(ws['!ref']);
        for (let R = range.s.r; R <= range.e.r; ++R) {
          for (let C = range.s.c; C <= range.e.c; ++C) {
            const cell_address = { c: C, r: R };
            const cell_ref = XLSX.utils.encode_cell(cell_address);
            if (!ws[cell_ref]) continue;
            
            if (R > 0 && C === 1) { // Value column, skip header
              ws[cell_ref].z = '0.0000';
            }
          }
        }
        
        XLSX.utils.book_append_sheet(wb, ws, 'Results');
      }
      
      XLSX.writeFile(wb, 'all_charts_with_data.xlsx');
      console.log('Export completed successfully');
    } catch (err) {
      console.error('Export failed:', err);
      setError(err.message);
    }
  };

  if (error) {
    return (
      <Box sx={{ width: '100%', mt: 2 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', mt: 2 }}>
      <FormControl component="fieldset">
        <RadioGroup
          row
          name="chart-type"
          value={chartType}
          onChange={(e) => setChartType(e.target.value)}
        >
          <FormControlLabel value="ns" control={<Radio />} label="NS" />
          <FormControlLabel value="sp" control={<Radio />} label="SP" />
          <FormControlLabel value="m" control={<Radio />} label="M" />
          <FormControlLabel value="s" control={<Radio />} label="S" />
          <FormControlLabel value="p" control={<Radio />} label="P" />
          <FormControlLabel value="k" control={<Radio />} label="K" />
          {calculations?.results && (
            <FormControlLabel value="results" control={<Radio />} label="Results" />
          )}
        </RadioGroup>
      </FormControl>
      
      <Paper sx={{ p: 2, mt: 2 }}>
        {chartType === 'ns' && <Line options={getChartOptions()} data={getChartData()} />}
        {chartType === 'sp' && <Line options={getChartOptions()} data={getChartData()} />}
        {chartType === 'm' && <Line options={getChartOptions()} data={getChartData()} />}
        {chartType === 's' && <Line options={getChartOptions()} data={getChartData()} />}
        {chartType === 'p' && <Line options={getChartOptions()} data={getChartData()} />}
        {chartType === 'k' && <Line options={getChartOptions()} data={getChartData()} />}
        {chartType === 'results' && <Bar options={getChartOptions()} data={getChartData()} />}
      </Paper>
      
      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Button 
          variant="contained" 
          color="primary"
          onClick={handleExportAllToExcel}
          disabled={!data || data.length === 0}
        >
          Export All Charts to Excel
        </Button>
      </Box>

      <Snackbar 
        open={!!error} 
        autoHideDuration={6000} 
        onClose={() => setError(null)}
      >
        <Alert severity="error" onClose={() => setError(null)}>
          Export failed: {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Chart;
