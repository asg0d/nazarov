import { useState } from 'react'
import { Container, AppBar, Toolbar, Typography, Button, Box, MenuItem, Select } from '@mui/material';
import { useTranslation } from 'react-i18next';
import './i18n';
import DataTable from './components/DataTable'
import Chart from './components/Chart'
import ActivePoints from './components/ActivePoints'
import DataTabs from './components/TabPanel'
import { calculateAll } from './services/calculations'

function App() {
  const [data, setData] = useState([]);
  const [calculations, setCalculations] = useState(null);
  const [openActivePoints, setOpenActivePoints] = useState(false);
  const { t, i18n } = useTranslation();

  const handleLanguageChange = (event) => {
    i18n.changeLanguage(event.target.value);
  };

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
            {t('title')}
          </Typography>
          <Select
            value={i18n.language}
            onChange={handleLanguageChange}
            sx={{ mr: 2, color: 'white', '& .MuiSelect-icon': { color: 'white' } }}
            variant="standard"
          >
            <MenuItem value="en">English</MenuItem>
            <MenuItem value="ru">Русский</MenuItem>
            <MenuItem value="uz">O'zbek</MenuItem>
          </Select>
          <Button 
            color="inherit" 
            onClick={() => setOpenActivePoints(true)}
          >
            {t('setActivePoints')}
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
