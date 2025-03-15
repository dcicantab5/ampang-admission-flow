const { useState } = React;
const { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ErrorBar, LineChart, Line } = Recharts;

// Add error bar data for visualization
const addErrorBars = (data) => {
  return data.map(item => ({
    ...item,
    errorBar: [item.ciLower, item.ciUpper]
  }));
};

const HospitalFlowDashboard = () => {
  const [showMean, setShowMean] = useState(false);

  // Data based on analysis
  // Prepare data with error bars - arranged in ward order: W6A, W6B, W6C, W6D
  const sortedTransferTimeByWard = addErrorBars([
    { ward: 'W6A', median: 181.27, q1: 157.40, q3: 214.97, mean: 239.88, ciLower: 148.35, ciUpper: 331.42 },
    { ward: 'W6B', median: 196.08, q1: 163.13, q3: 237.72, mean: 221.35, ciLower: 159.90, ciUpper: 282.81 },
    { ward: 'W6C', median: 159.50, q1: 146.00, q3: 183.00, mean: 164.50, ciLower: 146.34, ciUpper: 182.66 },
    { ward: 'W6D', median: 152.37, q1: 149.70, q3: 214.07, mean: 172.05, ciLower: 130.84, ciUpper: 213.26 }
  ]);
  
  // Make sure we're working with the correctly ordered array
  const transferTimeByWard = sortedTransferTimeByWard;

  const sortedEtdTimeByWard = addErrorBars([
    { ward: 'W6A', median: 519.81, q1: 327.50, q3: 984.87, mean: 662.32, ciLower: 332.85, ciUpper: 991.79 },
    { ward: 'W6B', median: 443.74, q1: 151.30, q3: 2189.28, mean: 1013.31, ciLower: 486.35, ciUpper: 1540.28 },
    { ward: 'W6C', median: 1122.50, q1: 814.00, q3: 2282.00, mean: 1302.38, ciLower: 576.53, ciUpper: 2028.22 },
    { ward: 'W6D', median: 1664.38, q1: 131.65, q3: 1921.37, mean: 1239.13, ciLower: 144.10, ciUpper: 2334.16 }
  ]);
  
  // Make sure we're working with the correctly ordered array
  const etdTimeByWard = sortedEtdTimeByWard;

  const timePatterns = {
    booktime: [0, 1, 2, 1, 2, 1, 4, 2, 3, 0, 0, 1, 3, 2, 3, 1, 0, 2, 0, 3, 2, 2, 1, 1],
    alloctime: [0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 1, 0, 6, 1, 4, 2, 4, 2, 1, 9, 3, 0, 0],
    regtime: [0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 2, 4, 2, 1, 2, 4, 2, 1, 8, 6, 1, 1],
    arrtime: [3, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 0, 0, 0, 1, 1, 3, 4, 1, 2, 7, 1, 0, 11]
  };

  const hourlyPatternData = Array.from({ length: 24 }, (_, i) => ({
    hour: i,
    booktime: timePatterns.booktime[i],
    alloctime: timePatterns.alloctime[i],
    regtime: timePatterns.regtime[i],
    arrtime: timePatterns.arrtime[i]
  }));

  const comparisons = {
    transferTime: { H: 3.64, df: 3, pValue: 0.303, significant: false },
    etdTime: { H: 1.24, df: 3, pValue: 0.743, significant: false },
    bookToAllocTime: { H: 1.25, df: 3, pValue: 0.741, significant: false },
    allocToArrTime: { H: 3.62, df: 3, pValue: 0.306, significant: false }
  };

  // Custom tooltip for the charts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      // Add the rendering of the React component to the DOM at the end of the file
  const renderComponent = () => {
    return (
        <div className="bg-white p-4 border rounded shadow-lg">
          <p className="font-bold">{`Ward: ${data.ward}`}</p>
          <p>{`Median: ${data.median.toFixed(1)} minutes`}</p>
          <p>{`IQR: ${data.q1.toFixed(1)} - ${data.q3.toFixed(1)} minutes`}</p>
          {showMean && (
            <>
              <p>{`Mean: ${data.mean.toFixed(1)} minutes`}</p>
              <p>{`95% CI: ${data.ciLower.toFixed(1)} - ${data.ciUpper.toFixed(1)}`}</p>
            </>
          )}
        </div>
      );
    }
    return null;
  };

  // Custom tooltip for hourly patterns
  const HourlyTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border rounded shadow-lg">
          <p className="font-bold">{`Hour: ${label}:00`}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {`${entry.name}: ${entry.value} patients`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Hospital Ampang Patient Flow Analysis</h1>
        <p className="text-gray-600">
          Analysis of patient flow from ETD to wards W6A, W6B, W6C, and W6D. Time measurements in minutes.
        </p>
        <div className="mt-4">
          <label className="inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              checked={showMean} 
              onChange={() => setShowMean(!showMean)}
              className="mr-2"
            />
            <span>Show Mean & 95% CI</span>
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Transfer Time by Ward</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={transferTimeByWard}
                margin={{ top: 10, right: 30, left: 20, bottom: 40 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="ward" />
                <YAxis label={{ value: 'Minutes', angle: -90, position: 'insideLeft' }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar 
                  dataKey={showMean ? "mean" : "median"} 
                  fill="#8884d8" 
                  name={showMean ? "Mean Transfer Time" : "Median Transfer Time"} 
                >
                  {showMean && (
                    <ErrorBar dataKey="errorBar" width={4} strokeWidth={2} stroke="#8884d8" />
                  )}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 text-sm text-center text-gray-500">
            {comparisons.transferTime.significant ? (
              <p>Significant difference between wards (p = {comparisons.transferTime.pValue.toFixed(3)}, Kruskal-Wallis H test)</p>
            ) : (
              <p>No significant difference between wards (p = {comparisons.transferTime.pValue.toFixed(3)}, Kruskal-Wallis H test)</p>
            )}
          </div>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">ETD Time by Ward</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={etdTimeByWard}
                margin={{ top: 10, right: 30, left: 20, bottom: 40 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="ward" />
                <YAxis label={{ value: 'Minutes', angle: -90, position: 'insideLeft' }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar 
                  dataKey={showMean ? "mean" : "median"} 
                  fill="#82ca9d" 
                  name={showMean ? "Mean ETD Time" : "Median ETD Time"} 
                >
                  {showMean && (
                    <ErrorBar dataKey="errorBar" width={4} strokeWidth={2} stroke="#82ca9d" />
                  )}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 text-sm text-center text-gray-500">
            {comparisons.etdTime.significant ? (
              <p>Significant difference between wards (p = {comparisons.etdTime.pValue.toFixed(3)}, Kruskal-Wallis H test)</p>
            ) : (
              <p>No significant difference between wards (p = {comparisons.etdTime.pValue.toFixed(3)}, Kruskal-Wallis H test)</p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded shadow mb-8">
        <h2 className="text-xl font-semibold mb-4">Hourly Pattern Analysis</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={hourlyPatternData}
              margin={{ top: 10, right: 30, left: 20, bottom: 40 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="hour" 
                label={{ value: 'Hour of Day', position: 'insideBottom', offset: -10 }}
                tickFormatter={(hour) => `${hour}:00`}
              />
              <YAxis label={{ value: 'Number of Patients', angle: -90, position: 'insideLeft' }} />
              <Tooltip content={<HourlyTooltip />} />
              <Legend />
              <Line type="monotone" dataKey="booktime" stroke="#8884d8" name="Booking Time" />
              <Line type="monotone" dataKey="alloctime" stroke="#82ca9d" name="Allocation Time" />
              <Line type="monotone" dataKey="regtime" stroke="#ffc658" name="Registration Time" />
              <Line type="monotone" dataKey="arrtime" stroke="#ff7300" name="Arrival Time" />
