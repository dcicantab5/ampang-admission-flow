// Main application script for Ampang Admission Flow Analysis
document.addEventListener('DOMContentLoaded', function() {
  // Load data
  fetch('data.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
      return response.json();
    })
    .then(data => {
      // Initialize the dashboard with the data
      initializeDashboard(data);
      // Hide loading spinner
      document.getElementById('loadingSpinner').style.display = 'none';
    })
    .catch(error => {
      console.error('Error loading data:', error);
      alert('Error loading data. Please check console for details.');
      document.getElementById('loadingSpinner').style.display = 'none';
    });
});

function initializeDashboard(data) {
  // Set metadata and update footer
  displayMetadata(data.metadata);
  
  // Initialize Overview Tab
  initializeOverviewTab(data);
  
  // Initialize ETD Time Tab
  initializeEtdTimeTab(data.statistics.etdTime);
  
  // Initialize Transfer Time Tab
  initializeTransferTimeTab(data.statistics.transferTime);
  
  // Initialize Peak Hours Tab
  initializePeakHoursTab(data.statistics.peakHours, data.statistics.circularStats);
  
  // Initialize 24h Distribution Tab
  initialize24hDistributionTab(data.statistics.hourlyDistribution);
}

function displayMetadata(metadata) {
  // Format and display the generation date
  const date = new Date(metadata.generatedDate);
  const formattedDate = date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  document.getElementById('footerDate').textContent = formattedDate;
}

function initializeOverviewTab(data) {
  // Create patient distribution pie chart
  createPatientDistributionChart(data.summary.wardCounts);
  
  // Display overview findings
  const overviewFindings = document.getElementById('overviewFindings');
  overviewFindings.innerHTML = `
    <li>Total patients analyzed: ${data.summary.totalPatients}</li>
    <li>W6A: ${data.summary.wardCounts.W6A} patients</li>
    <li>W6B: ${data.summary.wardCounts.W6B} patients</li>
    <li>W6C: ${data.summary.wardCounts.W6C} patients</li>
    <li>W6D: ${data.summary.wardCounts.W6D} patients</li>
  `;
  
  // Create summary table
  const summaryTable = document.getElementById('summaryTable');
  const wards = Object.keys(data.summary.wardCounts);
  
  wards.forEach(ward => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${ward}</td>
      <td>${data.summary.wardCounts[ward]}</td>
      <td>${data.statistics.etdTime.byWard[ward].median.toFixed(1)}</td>
      <td>${data.statistics.transferTime.byWard[ward].median.toFixed(1)}</td>
    `;
    summaryTable.appendChild(row);
  });
  
  // ETD Time Comparison
  document.getElementById('etdTimeComparison').innerHTML = `
    <strong>Kruskal-Wallis H Test:</strong> There is a statistically significant difference in ETD time between wards (p < 0.05). 
    Ward W6D has the highest median ETD time (${data.statistics.etdTime.byWard.W6D.median.toFixed(1)} minutes).
  `;
  
  // Circular Statistics
  document.getElementById('circularStatistics').innerHTML = `
    <strong>Circular Statistics:</strong> Admission times are not uniformly distributed throughout the day (p < 0.001), 
    indicating clear peak hours for admissions.
  `;
  
  // Transfer Time Comparison
  document.getElementById('transferTimeComparison').innerHTML = `
    <strong>Kruskal-Wallis H Test:</strong> There is a highly significant difference in transfer times between wards (p < 0.001). 
    Ward W6D has the shortest median transfer time (${data.statistics.transferTime.byWard.W6D.median.toFixed(1)} minutes), while W6B has the 
    longest (${data.statistics.transferTime.byWard.W6B.median.toFixed(1)} minutes).
  `;
  
  // Key Finding Transfer
  document.getElementById('keyFindingTransfer').innerHTML = `
    <strong>Key Finding:</strong> The transfer process efficiency varies significantly between wards, suggesting opportunities for process standardization.
  `;
  
}

function createPatientDistributionChart(wardCounts) {
  const ctx = document.getElementById('patientDistributionChart').getContext('2d');
  
  // Calculate total for percentages
  const total = Object.values(wardCounts).reduce((sum, count) => sum + count, 0);
  
  // Prepare data
  const labels = Object.keys(wardCounts);
  const data = Object.values(wardCounts);
  const percentages = data.map(count => ((count / total) * 100).toFixed(1));
  
  // Define colors for each ward
  const colors = {
    W6A: 'rgba(54, 162, 235, 0.8)',
    W6B: 'rgba(75, 192, 192, 0.8)',
    W6C: 'rgba(255, 206, 86, 0.8)',
    W6D: 'rgba(255, 99, 132, 0.8)'
  };
  
  // Create chart
  new Chart(ctx, {
    type: 'pie',
    data: {
      labels: labels.map((ward, i) => `${ward}: ${percentages[i]}%`),
      datasets: [{
        data: data,
        backgroundColor: labels.map(ward => colors[ward]),
        borderColor: 'white',
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            font: {
              size: 14
            }
          }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const label = context.label || '';
              const value = context.raw;
              const percentage = ((value / total) * 100).toFixed(1);
              return `${label.split(':')[0]}: ${value} patients (${percentage}%)`;
            }
          }
        }
      }
    }
  });
}

function initializeEtdTimeTab(etdTimeData) {
  // Create ETD Time Chart
  createEtdTimeChart(etdTimeData);
  
  // Create ETD Stats Table
  const etdStatsTable = document.getElementById('etdStatsTable');
  const wards = Object.keys(etdTimeData.byWard);
  
  wards.forEach(ward => {
    const wardData = etdTimeData.byWard[ward];
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${ward}</td>
      <td>${wardData.mean.toFixed(1)}(${wardData.ci95[0].toFixed(1)} - ${wardData.ci95[1].toFixed(1)})</td>
      <td>${wardData.median.toFixed(1)}</td>
      <td>${wardData.q1.toFixed(1)} - ${wardData.q3.toFixed(1)}</td>
      <td>${wardData.min.toFixed(1)}</td>
      <td>${wardData.max.toFixed(1)}</td>
    `;
    etdStatsTable.appendChild(row);
  });
  
  // Display Kruskal-Wallis test results
  document.getElementById('etdKruskalWallis').textContent = `H-statistic: ${etdTimeData.kruskalWallis.H.toFixed(2)}, degrees of freedom: ${etdTimeData.kruskalWallis.df}, p-value: ${etdTimeData.kruskalWallis.pValue.toFixed(3)}`;
  document.getElementById('etdInterpretation').textContent = `Interpretation: ${etdTimeData.kruskalWallis.interpretation}`;
  
  // Display ETD Key Findings
  const etdKeyFindings = document.getElementById('etdKeyFindings');
  etdKeyFindings.innerHTML = `
    <li>Ward W6D has the highest median ETD time (${etdTimeData.byWard.W6D.median.toFixed(1)} minutes)</li>
    <li>Ward W6A has the lowest median ETD time (${etdTimeData.byWard.W6A.median.toFixed(1)} minutes)</li>
    <li>The large interquartile ranges indicate high variability in ETD times within each ward</li>
    <li>Some patients spend over 48 hours (3000+ minutes) in ETD before ward admission</li>
  `;
}

function createEtdTimeChart(etdTimeData) {
  const ctx = document.getElementById('etdTimeChart').getContext('2d');
  
  // Extract ward data
  const labels = Object.keys(etdTimeData.byWard);
  const medians = labels.map(ward => etdTimeData.byWard[ward].median);
  
  // Create chart
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Median ETD Time (min)',
        data: medians,
        backgroundColor: 'rgba(130, 130, 230, 0.7)',
        borderColor: 'rgba(130, 130, 230, 1)',
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Minutes'
          },
          grid: {
            color: 'rgba(200, 200, 200, 0.2)'
          }
        },
        x: {
          title: {
            display: true,
            text: 'Ward'
          },
          grid: {
            display: false
          }
        }
      },
      plugins: {
        legend: {
          display: true,
          position: 'top',
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const label = context.dataset.label || '';
              const value = context.parsed.y || 0;
              return `${label}: ${value.toFixed(1)}`;
            }
          }
        }
      }
    }
  });
}

function initializeTransferTimeTab(transferTimeData) {
  // Create Transfer Time Chart
  createTransferTimeChart(transferTimeData);
  
  // Create Transfer Stats Table
  const transferStatsTable = document.getElementById('transferStatsTable');
  const wards = Object.keys(transferTimeData.byWard);
  
  wards.forEach(ward => {
    const wardData = transferTimeData.byWard[ward];
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${ward}</td>
      <td>${wardData.mean.toFixed(1)}(${wardData.ci95[0].toFixed(1)} - ${wardData.ci95[1].toFixed(1)})</td>
      <td>${wardData.median.toFixed(1)}</td>
      <td>${wardData.q1.toFixed(1)} - ${wardData.q3.toFixed(1)}</td>
      <td>${wardData.min.toFixed(1)}</td>
      <td>${wardData.max.toFixed(1)}</td>
    `;
    transferStatsTable.appendChild(row);
  });
  
  // Display Kruskal-Wallis test results
  document.getElementById('transferKruskalWallis').textContent = `H-statistic: ${transferTimeData.kruskalWallis.H.toFixed(2)}, degrees of freedom: ${transferTimeData.kruskalWallis.df}, p-value: ${transferTimeData.kruskalWallis.pValue.toFixed(3)}`;
  document.getElementById('transferInterpretation').textContent = `Interpretation: There is a highly significant difference in transfer times between wards.`;
  
  // Display Transfer Key Findings
  const transferKeyFindings = document.getElementById('transferKeyFindings');
  transferKeyFindings.innerHTML = `
    <li>Ward W6D has the lowest median transfer time (${transferTimeData.byWard.W6D.median.toFixed(1)} minutes)</li>
    <li>Ward W6B has the highest median transfer time (${transferTimeData.byWard.W6B.median.toFixed(1)} minutes)</li>
    <li>The transfer time for W6B shows greater variability than other wards</li>
    <li>Some extreme cases show transfer times of over 10 hours (600+ minutes)</li>
  `;
}

function createTransferTimeChart(transferTimeData) {
  const ctx = document.getElementById('transferTimeChart').getContext('2d');
  
  // Extract ward data
  const labels = Object.keys(transferTimeData.byWard);
  const medians = labels.map(ward => transferTimeData.byWard[ward].median);
  
  // Create chart
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Median Transfer Time (min)',
        data: medians,
        backgroundColor: 'rgba(100, 200, 132, 0.7)',
        borderColor: 'rgba(100, 200, 132, 1)',
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Minutes'
          },
          grid: {
            color: 'rgba(200, 200, 200, 0.2)'
          }
        },
        x: {
          title: {
            display: true,
            text: 'Ward'
          },
          grid: {
            display: false
          }
        }
      },
      plugins: {
        legend: {
          display: true,
          position: 'top',
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const label = context.dataset.label || '';
              const value = context.parsed.y || 0;
              return `${label}: ${value.toFixed(1)}`;
            }
          }
        }
      }
    }
  });
}

function initializePeakHoursTab(peakHoursData, circularStats) {
  // Create Peak Hours Tables
  const peakHoursTables = document.getElementById('peakHoursTables');
  const wards = Object.keys(peakHoursData);
  
  wards.forEach(ward => {
    const tableWrapper = document.createElement('div');
    tableWrapper.className = 'peak-hours-table';
    tableWrapper.innerHTML = `
      <h4 class="peak-hours-title">${ward} - Top 3 Peak Hours</h4>
      <table>
        <thead>
          <tr>
            <th>Hour</th>
            <th>Count</th>
            <th>Percentage</th>
          </tr>
        </thead>
        <tbody id="${ward}PeakHoursTable">
        </tbody>
      </table>
    `;
    peakHoursTables.appendChild(tableWrapper);
    
    const tableBody = document.getElementById(`${ward}PeakHoursTable`);
    peakHoursData[ward].forEach(peak => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${peak.hour}:00 - ${peak.hour}:59</td>
        <td>${peak.count}</td>
        <td>${peak.percent}</td>
      `;
      tableBody.appendChild(row);
    });
  });
  
  // Create Circular Statistics Table
  const circularStatsTable = document.getElementById('circularStatsTable');
  wards.forEach(ward => {
    const stats = circularStats[ward];
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${ward}</td>
      <td>${stats.meanHour}</td>
      <td>< ${stats.rayleighP.toFixed(3)}</td>
      <td>Clustered (non-uniform)</td>
    `;
    circularStatsTable.appendChild(row);
  });
  
  // Display Peak Hours Key Findings
  const peakHoursFindings = document.getElementById('peakHoursFindings');
  peakHoursFindings.innerHTML = `
    <li>Evening hours (18:00-20:00) are peak admission times for most wards</li>
  `;
}

function initialize24hDistributionTab(hourlyData) {
  // Create 24-hour distribution chart
  createHourlyDistributionChart(hourlyData);
  
  // Display Observations
  const distributionObservations = document.getElementById('distributionObservations');
  distributionObservations.innerHTML = `
    <li>Booking times show a more distributed pattern throughout the day, with slight increases in the morning and evening</li>
    <li>Allocation times peak during daytime hours, reflecting administrative working patterns</li>
    <li>Registration times show a notable peak in the evening hours (20:00) with 12.6% of registrations</li>
    <li>Arrival times show clear evening peaks (18:00-20:00), confirming our previous peak hour analysis</li>
    <li>The line chart clearly shows the temporal relationship between the different process steps</li>
  `;
  
  // Display Implications
  const distributionImplications = document.getElementById('distributionImplications');
  distributionImplications.innerHTML = `
    <li>Bed Management Unit (BMU) may need additional staffing during peak allocation hours</li>
    <li>Consider adjusting ward staffing to match arrival patterns</li>
    <li>Investigate the relationship between booking time patterns and ETD workflows</li>
    <li>Potential for better coordination between booking process and allocation process</li>
  `;
}

function createHourlyDistributionChart(hourlyData) {
  const ctx = document.getElementById('hourlyDistributionChart').getContext('2d');
  
  // Setup hours labels (0-23)
  const hourLabels = Array.from({length: 24}, (_, i) => 
    `${i}:00`
  );
  
  // Prepare datasets
  const bookingData = hourlyData.booking.map(item => item.count);
  const allocationData = hourlyData.allocation.map(item => item.count);
  const registrationData = hourlyData.registration.map(item => item.count);
  const arrivalData = hourlyData.arrival.map(item => item.count);
  
  // Create chart
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: hourLabels,
      datasets: [
        {
          label: 'Booking Time',
          data: bookingData,
          borderColor: 'rgba(130, 130, 230, 1)',
          backgroundColor: 'rgba(130, 130, 230, 0.1)',
          borderWidth: 2,
          tension: 0.3,
          pointRadius: 3
        },
        {
          label: 'Allocation Time',
          data: allocationData,
          borderColor: 'rgba(100, 200, 132, 1)',
          backgroundColor: 'rgba(100, 200, 132, 0.1)',
          borderWidth: 2,
          tension: 0.3,
          pointRadius: 3
        },
        {
          label: 'Registration Time',
          data: registrationData,
          borderColor: 'rgba(255, 99, 132, 1)',
          backgroundColor: 'rgba(255, 99, 132, 0.1)',
          borderWidth: 2,
          tension: 0.3,
          pointRadius: 3
        },
        {
          label: 'Arrival Time',
          data: arrivalData,
          borderColor: 'rgba(255, 206, 86, 1)',
          backgroundColor: 'rgba(255, 206, 86, 0.1)',
          borderWidth: 2,
          tension: 0.3,
          pointRadius: 3
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Number of Events'
          },
          grid: {
            color: 'rgba(200, 200, 200, 0.2)'
          }
        },
        x: {
          title: {
            display: true,
            text: 'Hour of Day'
          },
          grid: {
            color: 'rgba(200, 200, 200, 0.2)'
          }
        }
      },
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            usePointStyle: true,
            padding: 20
          }
        }
      }
    }
  });
}
