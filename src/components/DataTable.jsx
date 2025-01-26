import React, { useState } from 'react';
import { read, utils } from 'xlsx';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Box,
  Alert,
} from '@mui/material';

const DataTable = ({ onDataLoaded }) => {
  const [tableData, setTableData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [error, setError] = useState(null);

  const processExcelData = (data) => {
    try {
      // Remove empty rows and validate data
      const validData = data.filter(row => 
        row.some(cell => cell !== null && cell !== undefined && cell !== "")
      );

      if (validData.length < 2) {
        throw new Error("Excel file must contain at least one row of data");
      }

      // Process data rows
      return validData.slice(1).map((row, index) => {
        const year = parseInt(row[0]) || 0;
        const oil = parseFloat(row[1]) || 0;
        const liquid = parseFloat(row[2]) || 0;
        const waters = Math.abs((liquid - oil).toFixed(3));

        // Calculate watercut based on previous row
        const prevRow = index > 0 ? validData[index] : null;
        const prevLiquid = prevRow ? parseFloat(prevRow[2]) || 0 : 0;
        const watercut = index > 0 && prevLiquid > 0
          ? (((liquid - prevLiquid) / prevLiquid) * 100).toFixed(2)
          : "0.00";

        // Set active points (last 11 rows by default)
        const isActive = index >= validData.length - 12 ? "1" : "0";

        return {
          no: index + 1,
          year,
          oil,
          liquid,
          waters,
          watercut,
          activePoint: isActive,
        };
      });
    } catch (err) {
      console.error('Error processing Excel data:', err);
      setError('Error processing Excel file. Please check the file format.');
      return [];
    }
  };

  const handleFileUpload = async (event) => {
    try {
      setError(null);
      const file = event.target.files[0];
      
      if (!file) return;

      // Validate file type
      const fileType = file.name.split('.').pop().toLowerCase();
      if (!['xlsx', 'xls'].includes(fileType)) {
        throw new Error('Please upload only Excel files (.xlsx or .xls)');
      }

      const data = await file.arrayBuffer();
      const workbook = read(data);
      
      // Get first sheet
      const firstSheetName = workbook.SheetNames[0];
      if (!firstSheetName) {
        throw new Error('Excel file appears to be empty');
      }

      const worksheet = workbook.Sheets[firstSheetName];
      const jsonData = utils.sheet_to_json(worksheet, { 
        header: 1,
        blankrows: false,
        defval: null
      });

      const processedData = processExcelData(jsonData);
      
      if (processedData.length > 0) {
        setColumns(['№', 'Year', 'Oil', 'Liquid', 'Waters', 'Watercut', 'Active Point']);
        setTableData(processedData);
        
        if (onDataLoaded) {
          onDataLoaded(processedData);
        }
      }
    } catch (err) {
      console.error('Error uploading file:', err);
      setError(err.message || 'Error uploading file');
    }
  };

  return (
    <Box sx={{ width: '100%', mt: 3 }}>
      <Button
        variant="contained"
        component="label"
        sx={{ mb: 2 }}
      >
        Import Excel File
        <input
          type="file"
          hidden
          accept=".xlsx, .xls"
          onChange={handleFileUpload}
        />
      </Button>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {tableData.length > 0 && (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="data table">
            <TableHead>
              <TableRow>
                {columns.map((column, index) => (
                  <TableCell key={index} align={index === 0 ? 'left' : 'right'}>
                    {column}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {tableData.map((row, rowIndex) => (
                <TableRow 
                  key={rowIndex}
                  sx={{ 
                    backgroundColor: row.activePoint === "1" ? 'rgba(144, 238, 144, 0.1)' : 'inherit'
                  }}
                >
                  <TableCell>{row.no}</TableCell>
                  <TableCell align="right">{row.year}</TableCell>
                  <TableCell align="right">{Number(row.oil).toFixed(3)}</TableCell>
                  <TableCell align="right">{Number(row.liquid).toFixed(3)}</TableCell>
                  <TableCell align="right">{Number(row.waters).toFixed(3)}</TableCell>
                  <TableCell align="right">{row.watercut}</TableCell>
                  <TableCell align="right">{row.activePoint}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default DataTable;
