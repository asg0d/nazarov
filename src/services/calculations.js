export const calculateAll = (data) => {
  if (!data || data.length === 0) return {};

  return {
    ns_calc: calculateNS(data),
    sp_calc: calculateSP(data),
    m_calc: calculateM(data),
    s_calc: calculateS(data),
    p_calc: calculateP(data),
    k_calc: calculateK(data),
  };
};

const calculateNS = (data) => {
  return data.map((row, index, array) => {
    const prevRow = index > 0 ? array[index - 1] : null;
    const liquid = parseFloat(row.liquid) || 0;
    const prevLiquid = prevRow ? parseFloat(prevRow.liquid) || 0 : 0;
    const deltaLiquid = liquid - prevLiquid;
    
    return {
      year: row.year,
      liquid,
      deltaLiquid: index > 0 ? deltaLiquid : 0,
      relativeDelta: index > 0 ? (deltaLiquid / prevLiquid) * 100 : 0
    };
  });
};

const calculateSP = (data) => {
  return data.map((row, index, array) => {
    const oil = parseFloat(row.oil) || 0;
    const liquid = parseFloat(row.liquid) || 0;
    const watercut = ((liquid - oil) / liquid) * 100;
    
    return {
      year: row.year,
      oil,
      liquid,
      watercut: isFinite(watercut) ? watercut : 0
    };
  });
};

const calculateM = (data) => {
  return data.map((row, index, array) => {
    const prevRow = index > 0 ? array[index - 1] : null;
    const oil = parseFloat(row.oil) || 0;
    const prevOil = prevRow ? parseFloat(prevRow.oil) || 0 : 0;
    const deltaOil = oil - prevOil;
    
    return {
      year: row.year,
      oil,
      deltaOil: index > 0 ? deltaOil : 0,
      relativeDeltaOil: index > 0 ? (deltaOil / prevOil) * 100 : 0
    };
  });
};

const calculateS = (data) => {
  return data.map((row) => {
    const oil = parseFloat(row.oil) || 0;
    const liquid = parseFloat(row.liquid) || 0;
    const waters = liquid - oil;
    
    return {
      year: row.year,
      oil,
      liquid,
      waters: Math.max(0, waters)
    };
  });
};

const calculateP = (data) => {
  let cumulativeOil = 0;
  let cumulativeLiquid = 0;

  return data.map((row) => {
    const oil = parseFloat(row.oil) || 0;
    const liquid = parseFloat(row.liquid) || 0;
    
    cumulativeOil += oil;
    cumulativeLiquid += liquid;
    
    return {
      year: row.year,
      cumulativeOil,
      cumulativeLiquid,
      cumulativeWatercut: ((cumulativeLiquid - cumulativeOil) / cumulativeLiquid) * 100
    };
  });
};

const calculateK = (data) => {
  return data.map((row, index, array) => {
    const oil = parseFloat(row.oil) || 0;
    const liquid = parseFloat(row.liquid) || 0;
    const waters = liquid - oil;
    const watercut = (waters / liquid) * 100;
    
    return {
      year: row.year,
      watercut: isFinite(watercut) ? watercut : 0,
      oilRatio: isFinite(watercut) ? 100 - watercut : 100
    };
  });
};
