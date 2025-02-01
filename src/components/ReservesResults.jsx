import React from 'react';
import { Paper, Typography, Box, Table, TableBody, TableCell, TableContainer, TableRow, Button, Grid } from '@mui/material';
import { useTranslation } from 'react-i18next';
import * as XLSX from 'xlsx';

const ReservesResults = ({ calculations }) => {
  const { t } = useTranslation();

  const totalReserves = calculations?.results ? [
    { 
      number: "1.1",
      name: t('reserves.parameters.vmax'),
      value: calculations.results.find(r => r.year === 'Vmax')?.value || 0 
    },
    { 
      number: "1.2",
      name: t('reserves.parameters.vfo'),
      value: calculations.results.find(r => r.year === 'V fo')?.value || 0 
    },
    { 
      number: "1.3",
      name: t('reserves.parameters.vfw'),
      value: calculations.results.find(r => r.year === 'v fw')?.value || 0 
    }
  ] : [];

  const remainingReserves = calculations?.results ? [
    { 
      number: "2.1",
      name: t('reserves.parameters.remainingVmax'),
      value: calculations.results.find(r => r.year === 'Remaining Vmax')?.value || 0 
    },
    { 
      number: "2.2",
      name: t('reserves.parameters.remainingVfo'),
      value: calculations.results.find(r => r.year === 'Remaining V fo')?.value || 0 
    },
    { 
      number: "2.3",
      name: t('reserves.parameters.remainingVfw'),
      value: calculations.results.find(r => r.year === 'Remaining v fw')?.value || 0 
    }
  ] : [];

  const ReservesTable = ({ title, data }) => (
    <TableContainer component={Paper} sx={{ mb: 2 }}>
      <Typography variant="h6" sx={{ p: 2, bgcolor: 'primary.main', color: 'white' }}>
        {title}
      </Typography>
      <Table>
        <TableBody>
          {data.map((row, index) => (
            <TableRow key={index}>
              <TableCell width="10%">{row.number}</TableCell>
              <TableCell>{row.name}</TableCell>
              <TableCell align="right">{row.value.toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  const handleExportExcel = () => {
    const totalHeaders = [[t('reserves.recoverable'), '', '']];
    const totalData = totalReserves.map(row => [row.number, row.name, Number(row.value.toFixed(2))]);
    
    const blankRow = ['', '', ''];
    
    const remainingHeaders = [[t('reserves.remaining'), '', '']];
    const remainingData = remainingReserves.map(row => [row.number, row.name, Number(row.value.toFixed(2))]);
    
    const wsData = [
      ...totalHeaders,
      ['№', 'Parameter', 'Value'],
      ...totalData,
      blankRow,
      ...remainingHeaders,
      ['№', 'Parameter', 'Value'],
      ...remainingData
    ];

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(wsData);

    ws['!cols'] = [
      { wch: 10 },  // Number column
      { wch: 35 },  // Parameter column
      { wch: 15 }   // Value column
    ];

    const headerStyle = { font: { bold: true, color: { rgb: "000000" } }, fill: { fgColor: { rgb: "CCCCCC" } } };
    const sectionStyle = { font: { bold: true, color: { rgb: "000000" } }, fill: { fgColor: { rgb: "E6E6E6" } } };

    ['A1:C1', 'A2:C2'].forEach(range => {
      const [start, end] = range.split(':');
      for (let col = start[0]; col <= end[0]; col = String.fromCharCode(col.charCodeAt(0) + 1)) {
        ws[col + start.slice(1)].s = headerStyle;
      }
    });

    ['A6:C6', 'A7:C7'].forEach(range => {
      const [start, end] = range.split(':');
      for (let col = start[0]; col <= end[0]; col = String.fromCharCode(col.charCodeAt(0) + 1)) {
        ws[col + start.slice(1)].s = headerStyle;
      }
    });

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

    XLSX.utils.book_append_sheet(wb, ws, t('reserves.title'));
    
    const date = new Date().toISOString().split('T')[0];
    XLSX.writeFile(wb, `reserves_${date}.xlsx`);
  };

  if (!calculations?.results) {
    return null;
  }

  return (
    <Box sx={{ mt: 4 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <ReservesTable title={t('reserves.recoverable')} data={totalReserves} />
        </Grid>
        <Grid item xs={12} md={6}>
          <ReservesTable title={t('reserves.remaining')} data={remainingReserves} />
        </Grid>
      </Grid>
      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant="contained" onClick={handleExportExcel}>
          {t('reserves.export')}
        </Button>
      </Box>
    </Box>
  );
};

export default ReservesResults;
