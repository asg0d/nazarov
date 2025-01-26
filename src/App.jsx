import { useState } from 'react'
import { Container, AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import DataTable from './components/DataTable'
import Chart from './components/Chart'
import ActivePoints from './components/ActivePoints'
import DataTabs from './components/TabPanel'
import { calculateAll } from './services/calculations'

function App() {
  const [data, setData] = useState([]);
  const [calculations, setCalculations] = useState(null);
  const [openActivePoints, setOpenActivePoints] = useState(false);

  const handleDataLoaded = (newData) => {
    setData(newData);
    const calcs = calculateAll(newData);
    setCalculations(calcs);
  };

  const handleUpdateActivePoints = (count) => {
    const totalRows = data.length;
    const updatedData = data.map((row, index) => ({
      ...row,
      activePoint: index >= totalRows - count ? "1" : "0"
    }));
    setData(updatedData);
    const calcs = calculateAll(updatedData);
    setCalculations(calcs);
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Production Data Analysis
          </Typography>
          <Button 
            color="inherit" 
            onClick={() => setOpenActivePoints(true)}
          >
            Set Active Points
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg">
        <Box sx={{ my: 4 }}>
          <DataTable onDataLoaded={handleDataLoaded} />
          
          {data.length > 0 && (
            <>
              <Chart data={data} calculations={calculations} />
              <DataTabs data={data} calculations={calculations} />
            </>
          )}
        </Box>
      </Container>

      <ActivePoints
        open={openActivePoints}
        onClose={() => setOpenActivePoints(false)}
        onUpdate={handleUpdateActivePoints}
      />
    </>
  )
}

export default App
