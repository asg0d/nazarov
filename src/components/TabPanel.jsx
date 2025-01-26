import React from 'react';
import { Tabs, Tab, Box } from '@mui/material';
import DataGrid from './DataGrid';

const TabPanel = ({ value, index, children }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

const DataTabs = ({ data, calculations }) => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="data tabs">
          <Tab label="Основные данные" />
          <Tab label="N_S расчет" />
          <Tab label="S_P расчет" />
          <Tab label="M расчет" />
          <Tab label="S расчет" />
          <Tab label="P расчет" />
          <Tab label="K расчет" />
        </Tabs>
      </Box>

      <TabPanel value={value} index={0}>
        <DataGrid data={data} />
      </TabPanel>

      <TabPanel value={value} index={1}>
        <DataGrid data={calculations?.ns_calc || []} />
      </TabPanel>

      <TabPanel value={value} index={2}>
        <DataGrid data={calculations?.sp_calc || []} />
      </TabPanel>

      <TabPanel value={value} index={3}>
        <DataGrid data={calculations?.m_calc || []} />
      </TabPanel>

      <TabPanel value={value} index={4}>
        <DataGrid data={calculations?.s_calc || []} />
      </TabPanel>

      <TabPanel value={value} index={5}>
        <DataGrid data={calculations?.p_calc || []} />
      </TabPanel>

      <TabPanel value={value} index={6}>
        <DataGrid data={calculations?.k_calc || []} />
      </TabPanel>
    </Box>
  );
};

export default DataTabs;
