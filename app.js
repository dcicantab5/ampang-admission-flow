import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const AmpangAdmissionAnalysis = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Sort wards in the specified order: W6A, W6B, W6C, W6D
  const wardOrder = ["W6A", "W6B", "W6C", "W6D"];
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch the JSON data from data.json
        const response = await fetch('./data.json');
        const jsonData = await response.json();
        
        // Prepare data for charts
        const etdTimeBarData = wardOrder.map(ward => ({
          ward,
          median: jsonData.statistics.etdTime.byWard[ward].median,
          mean: jsonData.statistics.etdTime.byWard[ward].mean,
          q1: jsonData.statistics.etdTime.byWard[ward].q1,
          q3: jsonData.statistics.etdTime.byWard[ward].q3,
          ci95Low: jsonData.statistics.etdTime.byWard[ward].ci95[0],
          ci95High: jsonData.statistics.etdTime.byWard[ward].ci95[1]
        }));
        
        const transferTimeBarData = wardOrder.map(ward => ({
          ward,
          median: jsonData.statistics.transferTime.byWard[ward].median,
          mean: jsonData.statistics.transferTime.byWard[ward].mean,
          q1: jsonData.statistics.transferTime.byWard[ward].q1,
          q3: jsonData.statistics.transferTime.byWard[ward].q3,
          ci95Low: jsonData.statistics.transferTime.byWard[ward].ci95[0],
          ci95High: jsonData.statistics.transferTime.byWard[ward].ci95[1]
        }));
        
        const wardDistributionData = wardOrder.map(ward => ({
          name: ward,
          value: jsonData.summary.wardCounts[ward]
        }));
        
        // Create 24-hour distribution data
        const hourlyDistributionData = Array.from({ length: 24 }, (_, i) => {
          const hour = i;
          const booking = jsonData.statistics.hourlyDistribution.booking.find(h => h.hour === hour)?.count || 0;
          const allocation = jsonData.statistics.hourlyDistribution.allocation.find(h => h.hour === hour)?.count || 0;
          const registration = jsonData.statistics.hourlyDistribution.registration.find(h => h.hour === hour)?.count || 0;
          const arrival = jsonData.statistics.hourlyDistribution.arrival.find(h => h.hour === hour)?.count || 0;
          
          return {
            hour,
            booking,
            allocation,
            registration,
            arrival
          };
        });
        
        // Store all the processed data and statistics
        setData({
          jsonData,
          etdTimeBarData,
          transferTimeBarData,
          wardDistributionData,
          hourlyDistributionData,
          peakHoursByWard: jsonData.statistics.peakHours,
          statsByWard: jsonData.statistics.etdTime.byWard,
          transferStatsByWard: jsonData.statistics.transferTime.byWard
        });
        
        setLoading(false);
      } catch (error) {
        console.error("Error loading data:", error);
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Custom tooltip for the bar charts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-300 rounded shadow-lg">
          <p className="font-bold">{`Ward: ${label}`}</p>
          <p>{`Median: ${payload[0].value.toFixed(2)} minutes`}</p>
          <p>{`IQR: ${payload[0].payload.q1.toFixed(2)} - ${payload[0].payload.q3.toFixed(2)}`}</p>
          <p>{`Mean: ${payload[0].payload.mean.toFixed(2)} minutes`}</p>
          <p>{`95% CI: ${payload[0].payload.ci95Low.toFixed(2)} - ${payload[0].payload.ci95High.toFixed(2)}`}</p>
        </div>
      );
    }
    
    return null;
  };
  
  if (loading) {
    return <div className="p-8 text-center">Loading data...</div>;
  }
  
  if (!data) {
    return <div className="p-8 text-center">Error loading data</div>;
  }
  
  return (
    <div className="p-4 max-w-full">
      <h1 className="text-2xl font-bold mb-6 text-center">Ampang Admission Flow Analysis</h1>
      
      {/* Navigation Tabs */}
      <div className="mb-6 flex justify-center">
        <div className="inline-flex bg-gray-200 rounded-lg p-1">
          <button
            className={`px-4 py-2 rounded-lg ${activeTab === 'overview' ? 'bg-blue-600 text-white' : 'text-gray-700'}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            className={`px-4 py-2 rounded-lg ${activeTab === 'etdtime' ? 'bg-blue-600 text-white' : 'text-gray-700'}`}
            onClick={() => setActiveTab('etdtime')}
          >
            ETD Time
          </button>
          <button
            className={`px-4 py-2 rounded-lg ${activeTab === 'transfertime' ? 'bg-blue-600 text-white' : 'text-gray-700'}`}
            onClick={() => setActiveTab('transfertime')}
          >
            Transfer Time
          </button>
          <button
            className={`px-4 py-2 rounded-lg ${activeTab === 'peakhours' ? 'bg-blue-600 text-white' : 'text-gray-700'}`}
            onClick={() => setActiveTab('peakhours')}
          >
            Peak Hours
          </button>
          <button
            className={`px-4 py-2 rounded-lg ${activeTab === '24hourdist' ? 'bg-blue-600 text-white' : 'text-gray-700'}`}
            onClick={() => setActiveTab('24hourdist')}
          >
            24h Distribution
          </button>
        </div>
      </div>
      
      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Patient Distribution by Ward</h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data.wardDistributionData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {data.wardDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} patients`, 'Count']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4">
                <h3 className="font-semibold">Key Findings:</h3>
                <ul className="list-disc pl-5 mt-2">
                  <li>Total patients analyzed: {data.jsonData.summary.totalPatients}</li>
                  <li>W6A: {data.jsonData.summary.wardCounts.W6A} patients</li>
                  <li>W6B: {data.jsonData.summary.wardCounts.W6B} patients</li>
                  <li>W6C: {data.jsonData.summary.wardCounts.W6C} patients</li>
                  <li>W6D: {data.jsonData.summary.wardCounts.W6D} patients</li>
                </ul>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Summary Statistics</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border px-4 py-2">Ward</th>
                      <th className="border px-4 py-2">Count</th>
                      <th className="border px-4 py-2">Median ETD Time (min)</th>
                      <th className="border px-4 py-2">Median Transfer Time (min)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {wardOrder.map(ward => (
                      <tr key={ward}>
                        <td className="border px-4 py-2 font-medium">{ward}</td>
                        <td className="border px-4 py-2">{data.jsonData.summary.wardCounts[ward]}</td>
                        <td className="border px-4 py-2">{data.statsByWard[ward].median.toFixed(1)}</td>
                        <td className="border px-4 py-2">{data.transferStatsByWard[ward].median.toFixed(1)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-semibold mb-4">Statistical Analysis Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium mb-2">ETD Time Comparison</h3>
                <p>
                  <strong>Kruskal-Wallis H Test:</strong> There is a statistically significant 
                  difference in ETD time between wards (p &lt; 0.05). Ward W6D has the highest median ETD time.
                </p>
                <p>
                  <strong>Circular Statistics:</strong> Admission times are not uniformly distributed throughout the day (p &lt; 0.001), 
                  indicating clear peak hours for admissions.
                </p>
                <p>
                  <strong>Correction:</strong> Ward W6D has the highest median ETD time (685.8 minutes), not W6B.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">Transfer Time Comparison</h3>
                <p>
                  <strong>Kruskal-Wallis H Test:</strong> There is a highly significant 
                  difference in transfer times between wards (p &lt; 0.001). Ward W6D has the shortest median transfer time, 
                  while W6B has the longest.
                </p>
                <p>
                  <strong>Key Finding:</strong> The transfer process efficiency varies significantly between wards, 
                  suggesting opportunities for process standardization.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* ETD Time Tab */}
      {activeTab === 'etdtime' && (
        <div>
          <div className="bg-white p-4 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-semibold mb-4">ETD Time Analysis by Ward</h2>
            <p className="mb-4">
              ETD time represents the duration patients spend in the Emergency and Trauma Department before ward admission.
              Below chart shows median ETD times with interquartile ranges.
            </p>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={data.etdTimeBarData}
                  margin={{ top: 20, right: 30, left: 30, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="ward" />
                  <YAxis label={{ value: 'Minutes', angle: -90, position: 'insideLeft' }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="median" name="Median ETD Time (min)" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-2">ETD Time Statistics Table</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border px-4 py-2">Ward</th>
                      <th className="border px-4 py-2">Mean (95% CI)</th>
                      <th className="border px-4 py-2">Median</th>
                      <th className="border px-4 py-2">IQR</th>
                      <th className="border px-4 py-2">Min</th>
                      <th className="border px-4 py-2">Max</th>
                    </tr>
                  </thead>
                  <tbody>
                    {wardOrder.map(ward => (
                      <tr key={ward}>
                        <td className="border px-4 py-2 font-medium">{ward}</td>
                        <td className="border px-4 py-2">
                          {data.statsByWard[ward].mean.toFixed(1)} 
                          ({data.statsByWard[ward].ci95[0].toFixed(1)} - {data.statsByWard[ward].ci95[1].toFixed(1)})
                        </td>
                        <td className="border px-4 py-2">{data.statsByWard[ward].median.toFixed(1)}</td>
                        <td className="border px-4 py-2">
                          {data.statsByWard[ward].q1.toFixed(1)} - {data.statsByWard[ward].q3.toFixed(1)}
                        </td>
                        <td className="border px-4 py-2">{data.statsByWard[ward].min.toFixed(1)}</td>
                        <td className="border px-4 py-2">{data.statsByWard[ward].max.toFixed(1)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-2">Statistical Analysis Results</h3>
              <p>
                <strong>Kruskal-Wallis H Test for ETD Time:</strong><br />
                H-statistic: {data.jsonData.statistics.etdTime.kruskalWallis.H.toFixed(2)}, 
                degrees of freedom: {data.jsonData.statistics.etdTime.kruskalWallis.df}, 
                p-value: {data.jsonData.statistics.etdTime.kruskalWallis.pValue}<br />
                <em>Interpretation:</em> There is a statistically significant difference in ETD times between wards at α = 0.05 level.
              </p>
              <p className="mt-2">
                <strong>Key Findings:</strong>
              </p>
              <ul className="list-disc pl-5 mt-1">
                <li>Ward W6D has the highest median ETD time ({data.statsByWard.W6D.median.toFixed(1)} minutes)</li>
                <li>Ward W6A has the lowest median ETD time ({data.statsByWard.W6A.median.toFixed(1)} minutes)</li>
                <li>The large interquartile ranges indicate high variability in ETD times within each ward</li>
                <li>Some patients spend over 48 hours (3000+ minutes) in ETD before ward admission</li>
              </ul>
            </div>
          </div>
        </div>
      )}
      
      {/* Transfer Time Tab */}
      {activeTab === 'transfertime' && (
        <div>
          <div className="bg-white p-4 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-semibold mb-4">Transfer Time Analysis by Ward</h2>
            <p className="mb-4">
              Transfer time represents the duration from bed allocation until the patient's arrival at the ward.
              Below chart shows median transfer times with interquartile ranges.
            </p>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={data.transferTimeBarData}
                  margin={{ top: 20, right: 30, left: 30, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="ward" />
                  <YAxis label={{ value: 'Minutes', angle: -90, position: 'insideLeft' }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="median" name="Median Transfer Time (min)" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-2">Transfer Time Statistics Table</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border px-4 py-2">Ward</th>
                      <th className="border px-4 py-2">Mean (95% CI)</th>
                      <th className="border px-4 py-2">Median</th>
                      <th className="border px-4 py-2">IQR</th>
                      <th className="border px-4 py-2">Min</th>
                      <th className="border px-4 py-2">Max</th>
                    </tr>
                  </thead>
                  <tbody>
                    {wardOrder.map(ward => (
                      <tr key={ward}>
                        <td className="border px-4 py-2 font-medium">{ward}</td>
                        <td className="border px-4 py-2">
                          {data.transferStatsByWard[ward].mean.toFixed(1)} 
                          ({data.transferStatsByWard[ward].ci95[0].toFixed(1)} - {data.transferStatsByWard[ward].ci95[1].toFixed(1)})
                        </td>
                        <td className="border px-4 py-2">{data.transferStatsByWard[ward].median.toFixed(1)}</td>
                        <td className="border px-4 py-2">
                          {data.transferStatsByWard[ward].q1.toFixed(1)} - {data.transferStatsByWard[ward].q3.toFixed(1)}
                        </td>
                        <td className="border px-4 py-2">{data.transferStatsByWard[ward].min.toFixed(1)}</td>
                        <td className="border px-4 py-2">{data.transferStatsByWard[ward].max.toFixed(1)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-2">Statistical Analysis Results</h3>
              <p>
                <strong>Kruskal-Wallis H Test for Transfer Time:</strong><br />
                H-statistic: {data.jsonData.statistics.transferTime.kruskalWallis.H.toFixed(2)}, 
                degrees of freedom: {data.jsonData.statistics.transferTime.kruskalWallis.df}, 
                p-value: {data.jsonData.statistics.transferTime.kruskalWallis.pValue}<br />
                <em>Interpretation:</em> There is a highly significant difference in transfer times between wards.
              </p>
              <p className="mt-2">
                <strong>Key Findings:</strong>
              </p>
              <ul className="list-disc pl-5 mt-1">
                <li>Ward W6D has the lowest median transfer time ({data.transferStatsByWard.W6D.median.toFixed(1)} minutes)</li>
                <li>Ward W6B has the highest median transfer time ({data.transferStatsByWard.W6B.median.toFixed(1)} minutes)</li>
                <li>The transfer time for W6B shows greater variability than other wards</li>
                <li>Some extreme cases show transfer times of over 10 hours (600+ minutes)</li>
              </ul>
            </div>
          </div>
        </div>
      )}
      
      {/* Peak Hours Tab */}
      {activeTab === 'peakhours' && (
        <div>
          <div className="bg-white p-4 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-semibold mb-4">Peak Admission Hours Analysis</h2>
            <p className="mb-4">
              This analysis identifies the hours of the day when most patients arrive at the wards.
              Understanding peak admission times can help optimize staffing and resource allocation.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {wardOrder.map(ward => (
                <div key={ward} className="border rounded-lg p-4">
                  <h3 className="text-lg font-medium mb-3">{ward} - Top 3 Peak Hours</h3>
                  <table className="min-w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border px-4 py-2">Hour</th>
                        <th className="border px-4 py-2">Count</th>
                        <th className="border px-4 py-2">Percentage</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.peakHoursByWard[ward].map((hour, index) => (
                        <tr key={index}>
                          <td className="border px-4 py-2">{hour.hour}:00 - {hour.hour}:59</td>
                          <td className="border px-4 py-2">{hour.count}</td>
                          <td className="border px-4 py-2">{hour.percent}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
            
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-2">Circular Statistics for Admission Times</h3>
              <p className="mb-3">
                Circular statistics treats time as a circular variable, allowing proper analysis of daily patterns.
              </p>
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border px-4 py-2">Ward</th>
                      <th className="border px-4 py-2">Mean Hour</th>
                      <th className="border px-4 py-2">Uniformity Test p-value</th>
                      <th className="border px-4 py-2">Distribution Pattern</th>
                    </tr>
                  </thead>
                  <tbody>
                    {wardOrder.map(ward => (
                      <tr key={ward}>
                        <td className="border px-4 py-2 font-medium">{ward}</td>
                        <td className="border px-4 py-2">{data.jsonData.statistics.circularStats[ward].meanHour}</td>
                        <td className="border px-4 py-2">{data.jsonData.statistics.circularStats[ward].rayleighP < 0.001 ? '< 0.001' : data.jsonData.statistics.circularStats[ward].rayleighP}</td>
                        <td className="border px-4 py-2">{data.jsonData.statistics.circularStats[ward].isUniform ? 'Uniform' : 'Clustered (non-uniform)'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-2">Key Findings</h3>
              <ul className="list-disc pl-5 mt-1">
                <li>Evening hours (18:00-20:00) are peak admission times for most wards</li>
                <li>W6A has its highest admission peak at 20:00 (18.2% of admissions)</li>
                <li>W6B has its highest admission peak at 18:00 (10.2% of admissions)</li>
                <li>W6C has its highest admission peak at 18:00 (13.5% of admissions)</li>
                <li>W6D has its highest admission peak at 20:00 (14.1% of admissions)</li>
                <li>All wards show statistically significant clustering of admission times</li>
              </ul>
            </div>
          </div>
        </div>
      )}
      
      {/* 24-hour Distribution Tab */}
      {activeTab === '24hourdist' && (
        <div>
          <div className="bg-white p-4 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-semibold mb-4">24-Hour Distribution of Patient Flow Events</h2>
            <p className="mb-4">
              This analysis shows the distribution of different events throughout the 24-hour day cycle,
              including booking time, allocation time, registration time, and arrival time.
            </p>
            
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={data.hourlyDistributionData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="hour" 
                    tickFormatter={(hour) => `${hour}:00`}
                    label={{ value: 'Hour of Day', position: 'insideBottom', offset: -10 }}
                  />
                  <YAxis label={{ value: 'Number of Events', angle: -90, position: 'insideLeft' }} />
                  <Tooltip formatter={(value, name) => [value, name.charAt(0).toUpperCase() + name.slice(1)]} />
                  <Legend />
                  <Line type="monotone" dataKey="booking" name="Booking Time" stroke="#8884d8" activeDot={{ r: 8 }} />
                  <Line type="monotone" dataKey="allocation" name="Allocation Time" stroke="#82ca9d" activeDot={{ r: 8 }} />
                  <Line type="monotone" dataKey="registration" name="Registration Time" stroke="#ff7300" activeDot={{ r: 8 }} />
                  <Line type="monotone" dataKey="arrival" name="Arrival Time" stroke="#ffc658" activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-2">Observations</h3>
              <ul className="list-disc pl-5 mt-1">
                <li>Booking times show a more distributed pattern throughout the day, with slight increases in the morning and evening</li>
                <li>Allocation times peak during daytime hours, reflecting administrative working patterns</li>
                <li>Registration times show a notable peak in the evening hours (20:00) with 12.6% of registrations</li>
                <li>Arrival times show clear evening peaks (18:00-20:00), confirming our previous peak hour analysis</li>
                <li>The line chart clearly shows the temporal relationship between the different process steps</li>
              </ul>
            </div>
            
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-2">Implications for Quality Improvement</h3>
              <ul className="list-disc pl-5 mt-1">
                <li>Bed Management Unit (BMU) may need additional staffing during peak allocation hours</li>
                <li>Consider adjusting ward staffing to match arrival patterns</li>
                <li>Investigate the relationship between booking time patterns and ETD workflows</li>
                <li>Potential for better coordination between booking process and allocation process</li>
              </ul>
            </div>
          </div>
        </div>
      )}
      
      <div className="mt-6 text-sm text-gray-600">
        <p className="font-bold">Statistical Methods:</p>
        <ol className="list-decimal pl-5 mt-1">
          <li>Descriptive statistics: mean, median, interquartile range (IQR), and 95% confidence intervals.</li>
          <li>Kruskal-Wallis H test: non-parametric method for comparing medians among multiple independent groups.</li>
          <li>Circular statistics: specialized methods for analyzing cyclical time data, including Rayleigh test for uniformity.</li>
        </ol>
      </div>
      
      {/* Source data information */}
      <div className="mt-2 text-sm text-gray-500 text-center">
        <p>Data source: Hospital Ampang ETD to Ward Admission Flow (March 2025)</p>
      </div>
    </div>
  );
};

// Render the application
ReactDOM.render(<AmpangAdmissionAnalysis />, document.getElementById('root'));
