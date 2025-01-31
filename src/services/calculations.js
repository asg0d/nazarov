export const calculateAll = (data) => {
  if (!data || data.length === 0) return {};

  const ns = calculateNS(data);
  const sp = calculateSP(data);
  const m = calculateM(data);
  const s = calculateS(data);
  const p = calculateP(data);
  const k = calculateK(data);
  const reserves = calculateRecoverableReserves(data);

  return {
    ns_calc: ns,
    sp_calc: sp,
    m_calc: m,
    s_calc: s,
    p_calc: p,
    k_calc: k,
    reserves_calc: reserves,
    results: calculateResults(data, ns, sp, m, s, p, k)
  };
};

const calculateResults = (data, ns, sp, m, s, p, k) => {
  // Get active points (points marked with "1")
  const activePoints = data.filter(row => row.activePoint === "1");
  
  if (activePoints.length === 0) return [];

  // Calculate averages for active points
  const avgLiquid = activePoints.reduce((sum, row) => sum + parseFloat(row.liquid), 0) / activePoints.length;
  const avgOil = activePoints.reduce((sum, row) => sum + parseFloat(row.oil), 0) / activePoints.length;
  
  // Calculate recoverable reserves for active points
  const avgWater = avgLiquid - avgOil;
  const vmax = avgLiquid * 0.9; // 90% recovery factor
  const vfo = avgOil * 0.85;    // 85% oil recovery factor
  const vfw = avgWater * 0.95;  // 95% water recovery factor
  
  // Calculate cumulative values
  const cumulativeOil = data.reduce((sum, row) => sum + parseFloat(row.oil), 0);
  const cumulativeLiquid = data.reduce((sum, row) => sum + parseFloat(row.liquid), 0);
  const cumulativeWater = cumulativeLiquid - cumulativeOil;
  
  // Calculate remaining reserves
  const remainingVmax = vmax - cumulativeLiquid;
  const remainingVfo = vfo - cumulativeOil;
  const remainingVfw = vfw - cumulativeWater;
  
  // Calculate final results based on all methods
  const results = [
    { year: 'N/S', value: calculateNSResult(ns, activePoints) },
    { year: 'S/P', value: calculateSPResult(sp, activePoints) },
    { year: 'M', value: calculateMResult(m, activePoints) },
    { year: 'S', value: calculateSResult(s, activePoints) },
    { year: 'P', value: calculatePResult(p, activePoints) },
    { year: 'K', value: calculateKResult(k, activePoints) },
    { year: 'Vmax', value: vmax },
    { year: 'V fo', value: vfo },
    { year: 'v fw', value: vfw },
    { year: 'Remaining Vmax', value: remainingVmax },
    { year: 'Remaining V fo', value: remainingVfo },
    { year: 'Remaining v fw', value: remainingVfw }
  ];

  return results.filter(result => !isNaN(result.value) && isFinite(result.value));
};

const calculateNSResult = (ns, activePoints) => {
  if (!ns || activePoints.length === 0) return 0;
  const activeNS = ns.filter(item => 
    activePoints.some(ap => ap.year === item.year)
  );
  return activeNS.reduce((sum, item) => sum + item.relativeDelta, 0) / activeNS.length;
};

const calculateSPResult = (sp, activePoints) => {
  if (!sp || activePoints.length === 0) return 0;
  const activeSP = sp.filter(item => 
    activePoints.some(ap => ap.year === item.year)
  );
  return activeSP.reduce((sum, item) => sum + item.watercut, 0) / activeSP.length;
};

const calculateMResult = (m, activePoints) => {
  if (!m || activePoints.length === 0) return 0;
  const activeM = m.filter(item => 
    activePoints.some(ap => ap.year === item.year)
  );
  return activeM.reduce((sum, item) => sum + item.relativeDeltaOil, 0) / activeM.length;
};

const calculateSResult = (s, activePoints) => {
  if (!s || activePoints.length === 0) return 0;
  const activeS = s.filter(item => 
    activePoints.some(ap => ap.year === item.year)
  );
  return activeS.reduce((sum, item) => sum + (item.waters / item.liquid) * 100, 0) / activeS.length;
};

const calculatePResult = (p, activePoints) => {
  if (!p || activePoints.length === 0) return 0;
  const activeP = p.filter(item => 
    activePoints.some(ap => ap.year === item.year)
  );
  return activeP.reduce((sum, item) => sum + item.cumulativeWatercut, 0) / activeP.length;
};

const calculateKResult = (k, activePoints) => {
  if (!k || activePoints.length === 0) return 0;
  const activeK = k.filter(item => 
    activePoints.some(ap => ap.year === item.year)
  );
  return activeK.reduce((sum, item) => sum + item.oilRatio, 0) / activeK.length;
};

const calculateRecoverableReserves = (data) => {
  if (!data || data.length === 0) return [];
  
  return data.map((row, index) => {
    const liquid = parseFloat(row.liquid) || 0;
    const oil = parseFloat(row.oil) || 0;
    const water = liquid - oil;
    
    // Calculate Vmax (maximum recoverable reserves)
    const vmax = liquid * 0.9; // Assuming 90% recovery factor
    
    // Calculate V fo (recoverable oil reserves)
    const vfo = oil * 0.85; // Assuming 85% oil recovery factor
    
    // Calculate v fw (recoverable water reserves)
    const vfw = water * 0.95; // Assuming 95% water recovery factor
    
    return {
      year: row.year,
      vmax,
      vfo,
      vfw
    };
  });
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
