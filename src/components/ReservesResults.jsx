import React from 'react';
import { Paper, Typography, Box, Table, TableBody, TableCell, TableContainer, TableRow, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import * as XLSX from 'xlsx';

const ReservesResults = ({ calculations }) => {
  const { t } = useTranslation();

  const totalReserves = calculations?.results ? [
    { 
      name: t('reserves.parameters.vmax'),
      value: calculations.results.find(r => r.year === 'Vmax')?.value || 0 
    },
    { 
      name: t('reserves.parameters.vfo'),
      value: calculations.results.find(r => r.year === 'V fo')?.value || 0 
    },
    { 
      name: t('reserves.parameters.vfw'),
      value: calculations.results.find(r => r.year === 'v fw')?.value || 0 
    }
  ] : [];

  const remainingReserves = calculations?.results ? [
    { 
      name: t('reserves.parameters.remainingVmax'),
      value: calculations.results.find(r => r.year === 'Remaining Vmax')?.value || 0 
    },
    { 
      name: t('reserves.parameters.remainingVfo'),
      value: calculations.results.find(r => r.year === 'Remaining V fo')?.value || 0 
    },
    { 
      name: t('reserves.parameters.remainingVfw'),
      value: calculations.results.find(r => r.year === 'Remaining v fw')?.value || 0 
    }
  ] : [];

  const handleExportExcel = () => {
    // Create headers and data for total reserves
    const totalHeaders = [[t('reserves.recoverable'), '']];
    const totalData = totalReserves.map(row => [row.name, Number(row.value.toFixed(2))]);
    
    // Add a blank row for separation
    const blankRow = ['', ''];
    
    // Create headers and data for remaining reserves
    const remainingHeaders = [[t('reserves.remaining'), '']];
    const remainingData = remainingReserves.map(row => [row.name, Number(row.value.toFixed(2))]);
    
    // Combine all data
    const wsData = [
      ...totalHeaders,
      ['Parameter', 'Value'],
      ...totalData,
      blankRow,
      ...remainingHeaders,
      ['Parameter', 'Value'],
      ...remainingData
    ];

    // Create a new workbook and worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(wsData);

    // Set column widths
    ws['!cols'] = [
      { wch: 35 }, // Parameter column
      { wch: 15 }  // Value column
    ];

    // Add some styling
    const headerStyle = { font: { bold: true, color: { rgb: "000000" } }, fill: { fgColor: { rgb: "CCCCCC" } } };
    const sectionStyle = { font: { bold: true, color: { rgb: "000000" } }, fill: { fgColor: { rgb: "E6E6E6" } } };

    // Apply styles
    ['A1', 'B1', 'A2', 'B2'].forEach(cell => {
      ws[cell].s = headerStyle;
    });
    ['A6', 'B6', 'A7', 'B7'].forEach(cell => {
      ws[cell].s = headerStyle;
    });

    // Add borders to all cells
    for (let i = 0; i < wsData.length; i++) {
      for (let j = 0; j < wsData[0].length; j++) {
        const cell = XLSX.utils.encode_cell({ r: i, c: j });
        if (!ws[cell].s) ws[cell].s = {};
        ws[cell].s.border = {
          top: { style: 'thin' },
          bottom: { style: 'thin' },
          left: { style: 'thin' },
          right: { style: 'thin' }
        };
      }
    }

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(wb, ws, t('reserves.title'));

    // Generate current date for filename
    const date = new Date().toISOString().split('T')[0];
    
    // Save the file
    XLSX.writeFile(wb, `reserves_${date}.xlsx`);
  };

  const ReservesTable = ({ data, title }) => (
    <Box>
      <Typography variant="h6" sx={{ mb: 2, color: 'text.secondary' }}>
        {title}
      </Typography>
      <TableContainer>
        <Table>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row.name}>
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>
                <TableCell align="right">
                  {row.value.toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );

  return (
    <Box sx={{ mt: 4 }}>
      <Paper elevation={3}>
        <Box sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5">
              {t('reserves.title')}
            </Typography>
            <Button 
              variant="outlined" 
              onClick={handleExportExcel}
              sx={{ ml: 2 }}
            >
              {t('reserves.export')}
            </Button>
          </Box>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <ReservesTable data={totalReserves} title={t('reserves.recoverable')} />
            <ReservesTable data={remainingReserves} title={t('reserves.remaining')} />
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default ReservesResults;
