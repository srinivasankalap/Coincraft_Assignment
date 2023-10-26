const axios = require('axios');

async function calculateProfit(schemeCode, startDate, endDate, capital = 1000000.0) {
  const apiURL = `https://api.mfapi.in/mf/${schemeCode}`;

  try {
    const response = await axios.get(apiURL);
    const data = response.data;
    const navData = data.data || [];
    let navOnStartDate = null;
    let navOnEndDate = null;

    for (const entry of navData) {
      if (entry.date === startDate) {
        navOnStartDate = entry.nav;
      }
      if (entry.date === endDate) {
        navOnEndDate = entry.nav;
      }

      if (navOnStartDate && navOnEndDate) {
        break;
      }
    }
    if (!navOnStartDate) {
      const nextAvailableDate = navData.find(entry => entry.date > startDate);
      if (nextAvailableDate) {
        navOnStartDate = nextAvailableDate.nav;
      }
    }
    const unitsAllotted = capital / navOnStartDate;
    const valueOnEndDate = unitsAllotted * navOnEndDate;
    const netProfit = valueOnEndDate - capital;

    return netProfit;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

calculateProfit('101206', '26-07-2023', '18-10-2023', 1000000)
  .then(netProfit => {
    if (netProfit !== null) {
      console.log('Net Profit:', netProfit.toFixed(2));
    }
  });
