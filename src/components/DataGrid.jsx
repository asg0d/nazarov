import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Box
} from '@mui/material';
import { formatNumber } from '../utils/formatNumber';
import { utils, writeFile } from 'xlsx';

const DataGrid = ({ data }) => {
  if (!data || data.length === 0) return null;

  const columns = Object.keys(data[0]);

  const handleExport = () => {
    const ws = utils.json_to_sheet(data);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Sheet1");
    writeFile(wb, "export.xlsx");
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} size="small" aria-label="data grid">
          <TableHead>
            <TableRow>
              {columns.map((column, index) => (
                <TableCell key={index} align="right">
                  {column}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {columns.map((column, colIndex) => (
                  <TableCell key={colIndex} align="right">
                    {typeof row[column] === 'number' 
                      ? formatNumber(row[column])
                      : row[column]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant="contained" onClick={handleExport}>
          Export to Excel
        </Button>
      </Box>
    </>
  );
};

export default DataGrid;
