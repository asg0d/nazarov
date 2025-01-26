import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';

const DataGrid = ({ data }) => {
  if (!data || data.length === 0) return null;

  const columns = Object.keys(data[0]);

  return (
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
                    ? Number(row[column]).toFixed(3) 
                    : row[column]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default DataGrid;
