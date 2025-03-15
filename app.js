// Extract React and Recharts components
const { useState, useEffect } = React;
const { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, ErrorBar 
} = Recharts;

// Main component
function PatientFlowAnalysis() {
  const [selectedMetric, setSelectedMetric] = useState("totalTime");
  const [showMeanStats, setShowMeanStats] = useState(false);
  const wardOrder = ["W6A", "W6B", "W6C", "W6D"];

  // Metrics for selection
  const metricOptions = [
    { value: 'bookToAlloc', label: 'Time from Booking to Allocation (hours)' },
    { value: 'allocToArr', label: 'Time from Allocation to Arrival (hours)' },
    { value: 'bookToArr', label: 'Time from Booking to Arrival (hours)' },
    { value: 'totalTime', label: 'Total Time (hours)' }
  ];
  
  // Prepare data for chart
  const prepareChartData = () => {
    return wardOrder.map(ward => {
      if (!wardData[ward] || !wardData[ward][selectedMetric]) {
        return { ward };
      }
      
      const stat = wardData[ward][selectedMetric];
      
      return {
        ward,
        median: stat.median,
        q1: stat.q1,
        q3: stat.q3,
        iqr: stat.iqr,
        min: stat.min,
        max: stat.max,
        mean: stat.mean,
        lowerCI: stat.ciLower,
        upperCI: stat.ciUpper
      };
    });
  };
  
  // Get current metric label
  const getCurrentMetricLabel = () => {
    const metric = metricOptions.find(m => m.value === selectedMetric);
    return metric ? `Median ${metric.label}` : '';
  };
  
  // Create summary table data
  const createSummaryTableData = () => {
    const metrics = [
      'bookToAlloc',
      'allocToArr',
      'bookToArr',
      'totalTime'
    ];
    
    return metrics.map(metric => {
      const row = {
        metric: metricOptions.find(m => m.value === metric)?.label || metric,
      };
      
      wardOrder.forEach(ward => {
        if (wardData[ward] && wardData[ward][metric]) {
          const stat = wardData[ward][metric];
          row[`${ward}_mean`] = stat.mean.toFixed(2);
          row[`${ward}_ci`] = `(${stat.ciLower.toFixed(2)}-${stat.ciUpper.toFixed(2)})`;
          row[`${ward}_median`] = stat.median.toFixed(2);
          row[`${ward}_iqr`] = `(${stat.q1.toFixed(2)}-${stat.q3.toFixed(2)})`;
        }
      });
      
      return row;
    });
  };
  
  const chartData = prepareChartData();
  const summaryData = createSummaryTableData();
  
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Hospital Ampang Patient Flow Analysis</h1>
      
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Comparative Analysis by Ward</h2>
        <p className="mb-4">Select a metric to visualize ward differences:</p>
        
        <div className="flex flex-wrap gap-4 mb-4">
          <select 
            value={selectedMetric}
            onChange={(e) => setSelectedMetric(e.target.value)}
            className="p-2 border rounded"
          >
            {metricOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="ward" />
              <YAxis label={{ value: 'Hours', angle: -90, position: 'insideLeft' }} />
              <Tooltip 
                formatter={(value, name, props) => {
                  return [
                    `Median: ${value.toFixed(2)} hours
IQR: ${props.payload.q1.toFixed(2)}-${props.payload.q3.toFixed(2)} hours
Range: ${props.payload.min.toFixed(2)}-${props.payload.max.toFixed(2)} hours
Mean: ${props.payload.mean.toFixed(2)} hrs (95% CI: ${props.payload.lowerCI.toFixed(2)}-${props.payload.upperCI.toFixed(2)})`,
                    name
                  ];
                }} 
              />
              <Legend />
              <Bar 
                dataKey="median" 
                fill="#8884d8" 
                name={getCurrentMetricLabel()} 
                isAnimationActive={false}
              >
                {chartData.map((entry, index) => (
                  <ErrorBar 
                    key={`error-bar-${index}`} 
                    dataKey={["q1", "q3"]} 
                    width={8} 
                    strokeWidth={2}
                    stroke="#464646" 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Summary Statistics (Hours)</h2>
        
        <div className="flex border-b mb-4">
          <button 
            className={`py-2 px-4 ${showMeanStats ? 'border-b-2 border-blue-500 font-medium' : ''}`}
            onClick={() => setShowMeanStats(true)}
          >
            Mean Statistics
          </button>
          <button 
            className={`py-2 px-4 ${!showMeanStats ? 'border-b-2 border-blue-500 font-medium' : ''}`}
            onClick={() => setShowMeanStats(false)}
          >
            Median Statistics
          </button>
        </div>
        
        <div className="overflow-x-auto">
          {showMeanStats ? (
            <table className="min-w-full bg-white border">
              <thead>
                <tr>
                  <th className="border p-2">Metric</th>
                  {wardOrder.map(ward => (
                    <th key={ward} className="border p-2">{ward} Mean (95% CI)</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {summaryData.map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-gray-50' : ''}>
                    <td className="border p-2 font-semibold">{row.metric}</td>
                    {wardOrder.map(ward => (
                      <td key={`${ward}-${i}`} className="border p-2">
                        {row[`${ward}_mean`]} {row[`${ward}_ci`]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="min-w-full bg-white border">
              <thead>
                <tr>
                  <th className="border p-2">Metric</th>
                  {wardOrder.map(ward => (
                    <th key={ward} className="border p-2">{ward} Median (IQR)</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {summaryData.map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-gray-50' : ''}>
                    <td className="border p-2 font-semibold">{row.metric}</td>
                    {wardOrder.map(ward => (
                      <td key={`${ward}-${i}`} className="border p-2">
                        {row[`${ward}_median`]} {row[`${ward}_iqr`]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        
        <div className="mt-4">
          <h3 className="text-lg font-semibold">Key Findings with Statistical Significance (with Bonferroni Correction):</h3>
          <ul className="list-disc pl-6 mt-2">
            <li><strong>Total Processing Time:</strong>
              <ul>
                <li>W6A has significantly faster total processing time than W6B (mean diff: -6.43 hrs, 95% CI: -9.74 to -3.12, p&lt;0.001, adjusted p=0.003)</li>
                <li>W6A has faster total processing time than W6D (mean diff: -4.16 hrs, 95% CI: -7.19 to -1.13, p=0.007, adjusted p=0.17) (NS after correction)</li>
              </ul>
            </li>
            <li><strong>Booking to Allocation Time:</strong>
              <ul>
                <li>W6A has significantly shorter booking-to-allocation time than W6B (mean diff: -6.28 hrs, 95% CI: -9.58 to -2.99, p&lt;0.001, adjusted p=0.005)</li>
                <li>W6A has shorter booking-to-allocation time than W6C (mean diff: -3.11 hrs, 95% CI: -6.22 to -0.01, p=0.049, adjusted p=1.0) (NS after correction)</li>
                <li>W6A has shorter booking-to-allocation time than W6D (mean diff: -4.48 hrs, 95% CI: -7.48 to -1.49, p=0.003, adjusted p=0.08) (NS after correction)</li>
              </ul>
            </li>
            <li><strong>Allocation to Arrival Time:</strong>
              <ul>
                <li>W6D has significantly shorter allocation-to-arrival time than W6B (mean diff: 0.54 hrs, 95% CI: 0.27 to 0.82, p&lt;0.001, adjusted p=0.003)</li>
                <li>W6D has significantly shorter allocation-to-arrival time than W6C (mean diff: 0.34 hrs, 95% CI: 0.16 to 0.51, p&lt;0.001, adjusted p=0.005)</li>
                <li>W6D has shorter allocation-to-arrival time than W6A (mean diff: 0.39 hrs, 95% CI: 0.12 to 0.65, p=0.005, adjusted p=0.11) (NS after correction)</li>
              </ul>
            </li>
            <li><strong>Booking to Arrival Time:</strong>
              <ul>
                <li>W6A has significantly shorter booking-to-arrival time than W6B (mean diff: -6.92 hrs, 95% CI: -10.35 to -3.49, p&lt;0.001, adjusted p=0.002)</li>
                <li>W6A has shorter booking-to-arrival time than W6C (mean diff: -3.26 hrs, 95% CI: -6.44 to -0.08, p=0.044, adjusted p=1.0) (NS after correction)</li>
                <li>W6A has shorter booking-to-arrival time than W6D (mean diff: -4.51 hrs, 95% CI: -7.59 to -1.44, p=0.004, adjusted p=0.10) (NS after correction)</li>
              </ul>
            </li>
            <li>Note: NS = Not Significant after Bonferroni correction for multiple comparisons (24 tests)</li>
            <li>All wards show high variability (wide IQRs) indicating inconsistent processes.</li>
          </ul>
        </div>
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-2">Quality Improvement Recommendations</h2>
        <ul className="list-disc pl-6">
          <li><strong>Process Improvement Opportunity:</strong> Adopt W6A's bed allocation processes across all wards, particularly in W6B. This could potentially reduce total processing time by up to 6.43 hours in W6B (95% CI: 3.12-9.74 hours, p&lt;0.001, adjusted p=0.003).</li>
          
          <li><strong>Booking-to-Allocation Standardization:</strong> Study and standardize W6A's booking-to-allocation workflow, which is significantly faster than W6B (mean diff: -6.28 hrs, p&lt;0.001, adjusted p=0.005). While W6A also performs better than W6C and W6D, these differences did not remain significant after Bonferroni correction.</li>
          
          <li><strong>Transfer Process Enhancement:</strong> Implement W6D's allocation-to-arrival practices across all wards. W6D is significantly more efficient than both W6B (mean diff: 0.54 hrs, p&lt;0.001, adjusted p=0.003) and W6C (mean diff: 0.34 hrs, p&lt;0.001, adjusted p=0.005), even after Bonferroni correction.</li>
          
          <li><strong>Real-time Monitoring System:</strong> Develop a dashboard to track these key metrics with statistical process control methods to identify when processes drift outside expected performance levels.</li>
          
          <li><strong>Targeted Wait Time Reduction:</strong> Set specific targets based on statistically significant findings:
            <ul>
              <li>Booking-to-allocation target: 7.11 hours (W6A's current median)</li>
              <li>Allocation-to-arrival target: 0.66 hours (W6D's current median)</li>
              <li>Total process time target: 8.16 hours (W6A's current median)</li>
            </ul>
          </li>
          
          <li><strong>Process Variability Reduction:</strong> Address the wide interquartile ranges to deliver more consistent patient care experiences. Focus particularly on W6B, which shows the highest variability.</li>
          
          <li><strong>Cross-Functional Process Improvement Team:</strong> Form a team with staff from W6A (for booking-to-allocation expertise) and W6D (for allocation-to-arrival expertise) to develop standardized workflows for all wards based on the statistically significant differences found.</li>
        </ul>
      </div>
      
      <footer className="mt-8 pt-4
          <footer className="mt-8 pt-4 border-t text-sm text-gray-600">
        <p>© 2025 Hospital Ampang Patient Flow Analysis</p>
        <p>This analysis is licensed under GNU Affero General Public License v3.0 (AGPL-3.0)</p>
      </footer>
    </div>
  );
}

// Render the application to the DOM
ReactDOM.render(
  <PatientFlowAnalysis />,
  document.getElementById('root')
);
