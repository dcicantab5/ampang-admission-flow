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
  // Set metadata and summary information
  displayMetadata(data.metadata);
  displaySummary(data.summary);
  
  // Create charts and visualizations
  createETDTimeChart(data.statistics.etdTime);
  createTransferTimeChart(data.statistics.transferTime);
  createHourlyDistributionCharts(data.statistics.hourlyDistribution);
  createPeakHoursChart(data.statistics.peakHours, data.statistics.circularStats);
  
  // Display findings and recommendations
  displayFindings(data.qualityImprovement);
}

function displayMetadata(metadata) {
  // Format and display the generation date
  const date = new Date(metadata.generatedDate);
  const formattedDate = date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  document.getElementById('reportDate').textContent = `Generated: ${formattedDate}`;
  document.getElementById('footerDate').textContent = formattedDate;
}

function displaySummary(summary) {
  // Display ward counts and total patients
  document.getElementById('totalPatients').textContent = summary.totalPatients;
  document.getElementById('countW6A').textContent = summary.wardCounts.W6A;
  document.getElementById('countW6B').textContent = summary.wardCounts.W6B;
  document.getElementById('countW6C').textContent = summary.wardCounts.W6C;
  document.getElementById('countW6D').textContent = summary.wardCounts.W6D;
}

function createETDTimeChart(etdTimeData) {
  const ctx = document.getElementById('etdTimeChart').getContext('2d');
  
  // Extract ward data
  const labels = Object.keys(etdTimeData.byWard);
  const medians = labels.map(ward => etdTimeData.byWard[ward].median);
  const q1Values = labels.map(ward => etdTimeData.byWard[ward].q1);
  const q3Values = labels.map(ward => etdTimeData.byWard[ward].q3);
  const minValues = labels.map(ward => etdTimeData.byWard[ward].min);
  const maxValues = labels.map(ward => etdTimeData.byWard[ward].max);
  
  // Create box plot data
  const boxplotData = {
    // Min, Q1, Median, Q3, Max
    datasets: [{
      label: 'ETD Time (minutes)',
      backgroundColor: 'rgba(67, 97, 238, 0.2)',
      borderColor: 'rgba(67, 97, 238, 1)',
      borderWidth: 1,
      outlierColor: '#999999',
      padding: 10,
      itemRadius: 0,
      data: labels.map((ward, i) => ({
        min: minValues[i],
        q1: q1Values[i],
        median: medians[i],
        q3: q3Values[i],
        max: maxValues[i],
        ward: ward
      }))
    }]
  };
  
  // Create chart
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Min',
          data: minValues,
          backgroundColor: 'rgba(67, 97, 238, 0.2)',
          borderColor: 'rgba(67, 97, 238, 1)',
          borderWidth: 1
        },
        {
          label: 'Q1',
          data: q1Values,
          backgroundColor: 'rgba(67, 97, 238, 0.4)',
          borderColor: 'rgba(67, 97, 238, 1)',
          borderWidth: 1
        },
        {
          label: 'Median',
          data: medians,
          backgroundColor: 'rgba(67, 97, 238, 0.6)',
          borderColor: 'rgba(67, 97, 238, 1)',
          borderWidth: 1
        },
        {
          label: 'Q3',
          data: q3Values,
          backgroundColor: 'rgba(67, 97, 238, 0.8)',
          borderColor: 'rgba(67, 97, 238, 1)',
          borderWidth: 1
        },
        {
          label: 'Max',
          data: maxValues,
          backgroundColor: 'rgba(67, 97, 238, 1)',
          borderColor: 'rgba(67, 97, 238, 1)',
          borderWidth: 1
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
            text: 'Minutes'
          }
        },
        x: {
          title: {
            display: true,
            text: 'Ward'
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
              return `${label}: ${value.toFixed(1)} min`;
            }
          }
        }
      }
    }
  });
  
  // Display statistical test results
  document.getElementById('etdStatTest').textContent = etdTimeData.kruskalWallis.interpretation;
}

function createTransferTimeChart(transferTimeData) {
  const ctx = document.getElementById('transferTimeChart').getContext('2d');
  
  // Extract ward data
  const labels = Object.keys(transferTimeData.byWard);
  const medians = labels.map(ward => transferTimeData.byWard[ward].median);
  const q1Values = labels.map(ward => transferTimeData.byWard[ward].q1);
  const q3Values = labels.map(ward => transferTimeData.byWard[ward].q3);
  const minValues = labels.map(ward => transferTimeData.byWard[ward].min);
  const maxValues = labels.map(ward => transferTimeData.byWard[ward].max);
  
  // Create chart
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Min',
          data: minValues,
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        },
        {
          label: 'Q1',
          data: q1Values,
          backgroundColor: 'rgba(75, 192, 192, 0.4)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        },
        {
          label: 'Median',
          data: medians,
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        },
        {
          label: 'Q3',
          data: q3Values,
          backgroundColor: 'rgba(75, 192, 192, 0.8)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        },
        {
          label: 'Max',
          data: maxValues,
          backgroundColor: 'rgba(75, 192, 192, 1)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
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
            text: 'Minutes'
          }
        },
        x: {
          title: {
            display: true,
            text: 'Ward'
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
              return `${label}: ${value.toFixed(1)} min`;
            }
          }
        }
      }
    }
  });
  
  // Display statistical test results
  document.getElementById('transferStatTest').textContent = transferTimeData.kruskalWallis.interpretation;
}

function createHourlyDistributionCharts(hourlyData) {
  // Setup hours labels (0-23)
  const hourLabels = Array.from({length: 24}, (_, i) => 
    i < 10 ? `0${i}:00` : `${i}:00`
  );
  
  // Define colors for each data series
  const colors = {
    booking: 'rgba(54, 162, 235, 0.7)',
    allocation: 'rgba(255, 206, 86, 0.7)',
    registration: 'rgba(75, 192, 192, 0.7)',
    arrival: 'rgba(255, 99, 132, 0.7)'
  };
  
  // Create combined chart
  createHourlyChart('allHourlyChart', hourLabels, [
    {
      label: 'Booking',
      data: hourlyData.booking.map(item => item.count),
      backgroundColor: colors.booking,
      borderColor: colors.booking.replace('0.7', '1'),
      borderWidth: 1
    },
    {
      label: 'Allocation',
      data: hourlyData.allocation.map(item => item.count),
      backgroundColor: colors.allocation,
      borderColor: colors.allocation.replace('0.7', '1'),
      borderWidth: 1
    },
    {
      label: 'Registration',
      data: hourlyData.registration.map(item => item.count),
      backgroundColor: colors.registration,
      borderColor: colors.registration.replace('0.7', '1'),
      borderWidth: 1
    },
    {
      label: 'Arrival',
      data: hourlyData.arrival.map(item => item.count),
      backgroundColor: colors.arrival,
      borderColor: colors.arrival.replace('0.7', '1'),
      borderWidth: 1
    }
  ]);
  
  // Create individual charts
  createHourlyChart('bookingHourlyChart', hourLabels, [{
    label: 'Booking',
    data: hourlyData.booking.map(item => item.count),
    backgroundColor: colors.booking,
    borderColor: colors.booking.replace('0.7', '1'),
    borderWidth: 1
  }]);
  
  createHourlyChart('allocationHourlyChart', hourLabels, [{
    label: 'Allocation',
    data: hourlyData.allocation.map(item => item.count),
    backgroundColor: colors.allocation,
    borderColor: colors.allocation.replace('0.7', '1'),
    borderWidth: 1
  }]);
  
  createHourlyChart('registrationHourlyChart', hourLabels, [{
    label: 'Registration',
    data: hourlyData.registration.map(item => item.count),
    backgroundColor: colors.registration,
    borderColor: colors.registration.replace('0.7', '1'),
    borderWidth: 1
  }]);
  
  createHourlyChart('arrivalHourlyChart', hourLabels, [{
    label: 'Arrival',
    data: hourlyData.arrival.map(item => item.count),
    backgroundColor: colors.arrival,
    borderColor: colors.arrival.replace('0.7', '1'),
    borderWidth: 1
  }]);
}

function createHourlyChart(canvasId, labels, datasets) {
  const ctx = document.getElementById(canvasId).getContext('2d');
  
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: datasets
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Count'
          }
        },
        x: {
          title: {
            display: true,
            text: 'Hour of Day'
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
              return `${label}: ${value}`;
            }
          }
        }
      }
    }
  });
}

function createPeakHoursChart(peakHoursData, circularStats) {
  const ctx = document.getElementById('peakHoursChart').getContext('2d');
  
  // Define colors for each ward
  const colors = {
    W6A: 'rgba(75, 192, 192, 0.7)',
    W6B: 'rgba(54, 162, 235, 0.7)',
    W6C: 'rgba(255, 206, 86, 0.7)',
    W6D: 'rgba(255, 99, 132, 0.7)'
  };
  
  // Combine all peak hours data
  const wards = Object.keys(peakHoursData);
  
  // Create datasets for each ward
  const datasets = wards.map(ward => {
    // Create array of 24 zeros (one for each hour)
    const hourCounts = Array(24).fill(0);
    
    // Fill in the peak hour counts
    peakHoursData[ward].forEach(peak => {
      hourCounts[peak.hour] = peak.count;
    });
    
    return {
      label: ward,
      data: hourCounts,
      backgroundColor: colors[ward],
      borderColor: colors[ward].replace('0.7', '1'),
      borderWidth: 1
    };
  });
  
  // Hour labels (0-23)
  const hourLabels = Array.from({length: 24}, (_, i) => 
    i < 10 ? `0${i}:00` : `${i}:00`
  );
  
  // Create chart
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: hourLabels,
      datasets: datasets
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Count'
          }
        },
        x: {
          title: {
            display: true,
            text: 'Hour of Day'
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
              return `${label}: ${value}`;
            }
          }
        }
      }
    }
  });
  
  // Display mean admission times
  const meanTimesElement = document.getElementById('meanAdmissionTimes');
  meanTimesElement.innerHTML = '';
  
  Object.keys(circularStats).forEach(ward => {
    const meanHour = circularStats[ward].meanHour;
    const hours = Math.floor(meanHour);
    const minutes = Math.round((meanHour - hours) * 60);
    const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    
    const listItem = document.createElement('li');
    listItem.className = 'list-group-item';
    listItem.innerHTML = `<strong>${ward}:</strong> ${formattedTime} <small class="text-muted">(r = ${circularStats[ward].r.toFixed(3)})</small>`;
    meanTimesElement.appendChild(listItem);
  });
}

function displayFindings(qualityImprovement) {
  // Display key findings
  const keyFindingsList = document.getElementById('keyFindingsList');
  qualityImprovement.keyFindings.forEach(finding => {
    const listItem = document.createElement('li');
    listItem.textContent = finding;
    keyFindingsList.appendChild(listItem);
  });
  
  // Display recommendations
  const recommendationsList = document.getElementById('recommendationsList');
  qualityImprovement.recommendedInterventions.forEach(recommendation => {
    const listItem = document.createElement('li');
    listItem.textContent = recommendation;
    recommendationsList.appendChild(listItem);
  });
}
