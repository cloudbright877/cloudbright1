function fillMissingDates(data) {
    data.sort((a, b) => new Date(a.date) - new Date(b.date));
  
    const filledData = [];
    let lastBalance = 0;
  
    const startDate = new Date(data[0].date);
    const endDate = new Date(data[data.length - 1].date);
  
    const dateMap = new Map(data.map((item) => [item.date, parseFloat(item.sum)]));
  
    let currentDate = new Date(startDate);
  
    while (currentDate <= endDate) {
      const formattedDate = currentDate.toISOString().split("T")[0];
  
      if (dateMap.has(formattedDate)) {
        lastBalance = dateMap.get(formattedDate);
      }
  
      filledData.push({
        date: formattedDate,
        sum: lastBalance.toFixed(0),
      });
  
      currentDate.setDate(currentDate.getDate() + 1);
    }
  
    return filledData;
  }


export default fillMissingDates;