// Hospital Ward Data Visualization Dashboard
document.addEventListener('DOMContentLoaded', function() {
    // Load the JSON data
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            // Display metadata
            document.getElementById('analysisDate').textContent = data.metadata.analysisDate;
            document.getElementById('dataSource').textContent = data.metadata.dataSource;
            document.getElementById('sampleSize').textContent = data.metadata.sampleSize;
            document.getElementById('timeperiod').textContent = data.metadata.timeperiod;

            // Create charts
            createWardCountChart(data);
            createTransferTimeChart(data);
            createETDTimeChart(data);
            createTimePatternChart(data);
            createCircularChart(data);
            displayKeyFindings(data);
            displayStatisticalTests(data);
        })
        .catch(error => {
            console.error('Error loading data:', error);
            document.getElementById('error-message').textContent = 'Error loading data. Please check console for details.';
            document.getElementById('error-message').style.display = 'block';
        });
});

// Ward Count Chart
function createWardCountChart(data) {
    const ctx = document.getElementById('wardCountChart').getContext('2d');
    
    const wardLabels = data.wards;
    const countValues = wardLabels.map(ward => data.wardCounts[ward]);
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: wardLabels,
            datasets: [{
                label: 'Patient Count',
                data: countValues,
                backgroundColor: [
                    'rgba(75, 192, 192, 0.7)',
                    'rgba(54, 162, 235, 0.7)',
                    'rgba(153, 102, 255, 0.7)',
                    'rgba(255, 159, 64, 0.7)'
                ],
                borderColor: [
                    'rgb(75, 192, 192)',
                    'rgb(54, 162, 235)',
                    'rgb(153, 102, 255)',
                    'rgb(255, 159, 64)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Patient Count by Ward',
                    font: { size: 16 }
                },
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Number of Patients'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Ward'
                    }
                }
            }
        }
    });
}

// Transfer Time Chart - Box Plot
function createTransferTimeChart(data) {
    const ctx = document.getElementById('transferTimeChart').getContext('2d');
    
    const wardLabels = data.wards;
    const boxplotData = wardLabels.map(ward => {
        const wardData = data.transferTime[ward];
        return {
            min: wardData.ciLower,
            q1: wardData.q1,
            median: wardData.median,
            q3: wardData.q3,
            max: wardData.ciUpper,
            mean: wardData.mean
        };
    });
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: wardLabels,
            datasets: [{
                label: 'Median Transfer Time',
                data: wardLabels.map(ward => data.transferTime[ward].median),
                backgroundColor: 'rgba(75, 192, 192, 0.7)',
                borderColor: 'rgb(75, 192, 192)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Transfer Time by Ward (Minutes)',
                    font: { size: 16 }
                },
                tooltip: {
                    callbacks: {
                        afterLabel: function(context) {
                            const ward = context.label;
                            const wardData = data.transferTime[ward];
                            return [
                                `Mean: ${wardData.mean.toFixed(2)} min`,
                                `Median: ${wardData.median.toFixed(2)} min`,
                                `Q1-Q3: ${wardData.q1.toFixed(2)} - ${wardData.q3.toFixed(2)} min`,
                                `95% CI: ${wardData.ciLower.toFixed(2)} - ${wardData.ciUpper.toFixed(2)} min`
                            ];
                        }
                    }
                }
            },
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
            }
        }
    });
}

// ETD Time Chart
function createETDTimeChart(data) {
    const ctx = document.getElementById('etdTimeChart').getContext('2d');
    
    const wardLabels = data.wards;
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: wardLabels,
            datasets: [{
                label: 'Median ETD Time',
                data: wardLabels.map(ward => data.etdTime[ward].median),
                backgroundColor: 'rgba(54, 162, 235, 0.7)',
                borderColor: 'rgb(54, 162, 235)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'ETD Time by Ward (Minutes)',
                    font: { size: 16 }
                },
                tooltip: {
                    callbacks: {
                        afterLabel: function(context) {
                            const ward = context.label;
                            const wardData = data.etdTime[ward];
                            return [
                                `Mean: ${wardData.mean.toFixed(2)} min`,
                                `Median: ${wardData.median.toFixed(2)} min`,
                                `Q1-Q3: ${wardData.q1.toFixed(2)} - ${wardData.q3.toFixed(2)} min`,
                                `95% CI: ${wardData.ciLower.toFixed(2)} - ${wardData.ciUpper.toFixed(2)} min`
                            ];
                        }
                    }
                }
            },
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
            }
        }
    });
}

// Time Pattern Chart - 24-hour distribution
function createTimePatternChart(data) {
    const ctx = document.getElementById('timePatternChart').getContext('2d');
    
    const hourLabels = Array.from({length: 24}, (_, i) => i);
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: hourLabels.map(hour => `${hour}:00`),
            datasets: [
                {
                    label: 'Booking Time',
                    data: data.timePatterns.booktime,
                    borderColor: 'rgb(75, 192, 192)',
                    backgroundColor: 'rgba(75, 192, 192, 0.1)',
                    fill: false,
                    tension: 0.3
                },
                {
                    label: 'Allocation Time',
                    data: data.timePatterns.alloctime,
                    borderColor: 'rgb(54, 162, 235)',
                    backgroundColor: 'rgba(54, 162, 235, 0.1)',
                    fill: false,
                    tension: 0.3
                },
                {
                    label: 'Registration Time',
                    data: data.timePatterns.regtime,
                    borderColor: 'rgb(153, 102, 255)',
                    backgroundColor: 'rgba(153, 102, 255, 0.1)',
                    fill: false,
                    tension: 0.3
                },
                {
                    label: 'Arrival Time',
                    data: data.timePatterns.arrtime,
                    borderColor: 'rgb(255, 159, 64)',
                    backgroundColor: 'rgba(255, 159, 64, 0.1)',
                    fill: false,
                    tension: 0.3
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Time Patterns (24-hour Distribution)',
                    font: { size: 16 }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Frequency'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Hour of Day'
                    }
                }
            }
        }
    });
}

// Circular Statistics Visualization
function createCircularChart(data) {
    const ctx = document.getElementById('circularChart').getContext('2d');
    
    // Extract peak times and their relative strengths
    const timeTypes = ['booktime', 'alloctime', 'regtime', 'arrtime'];
    const labels = ['Booking', 'Allocation', 'Registration', 'Arrival'];
    
    const datasets = timeTypes.map((type, index) => {
        const peaks = data.circularStats[type].topPeaks;
        return {
            label: `${labels[index]} Peak: ${peaks[0].time} (${(peaks[0].relativeStrength * 100).toFixed(1)}%)`,
            data: [peaks[0].relativeStrength],
            backgroundColor: [
                'rgba(75, 192, 192, 0.7)',
                'rgba(54, 162, 235, 0.7)',
                'rgba(153, 102, 255, 0.7)',
                'rgba(255, 159, 64, 0.7)'
            ][index]
        };
    });
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Peak Time Strength'],
            datasets: datasets
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Peak Times Analysis',
                    font: { size: 16 }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 1,
                    title: {
                        display: true,
                        text: 'Relative Strength'
                    }
                }
            }
        }
    });
}

// Display Key Findings
function displayKeyFindings(data) {
    const findingsElement = document.getElementById('keyFindings');
    
    // Transfer Time Findings
    const transferFindings = data.keyFindings.transferTime;
    const transferHtml = `
        <h4>Transfer Time</h4>
        <ul>
            <li>Shortest median transfer time: <strong>Ward ${transferFindings.shortestWard}</strong> (${transferFindings.shortestValue.toFixed(2)} minutes)</li>
            <li>Highest variability: <strong>Ward ${transferFindings.highestVariabilityWard}</strong> (IQR: ${transferFindings.highestVariabilityIQR[0].toFixed(2)} - ${transferFindings.highestVariabilityIQR[1].toFixed(2)} minutes)</li>
        </ul>
    `;
    
    // ETD Time Findings
    const etdFindings = data.keyFindings.etdTime;
    const etdHtml = `
        <h4>ETD Time</h4>
        <ul>
            <li>Shortest median ETD time: <strong>Ward ${etdFindings.shortestWard}</strong> (${etdFindings.shortestValue.toFixed(2)} minutes)</li>
            <li>Longest median ETD time: <strong>Ward ${etdFindings.longestWard}</strong> (${etdFindings.longestValue.toFixed(2)} minutes)</li>
        </ul>
    `;
    
    // Time Pattern Findings
    const timeFindings = data.keyFindings.timePatterns;
    const timeHtml = `
        <h4>Time Patterns</h4>
        <ul>
            <li>Booking time pattern: <strong>${timeFindings.bookingHasPattern ? 'Yes' : 'No'}</strong></li>
            <li>Allocation peak hour: <strong>${timeFindings.allocationPeakHour}</strong></li>
            <li>Registration peak hour: <strong>${timeFindings.registrationPeakHour}</strong></li>
            <li>Arrival peak hour: <strong>${timeFindings.arrivalPeakHour}</strong></li>
        </ul>
    `;
    
    findingsElement.innerHTML = transferHtml + etdHtml + timeHtml;
}

// Display Statistical Tests
function displayStatisticalTests(data) {
    const testsElement = document.getElementById('statisticalTests');
    const tests = data.statisticalTests;
    
    let testsHtml = '<table class="table table-striped">';
    testsHtml += `
        <thead>
            <tr>
                <th>Metric</th>
                <th>Test</th>
                <th>H Value</th>
                <th>df</th>
                <th>p-value</th>
                <th>Significant</th>
            </tr>
        </thead>
        <tbody>
    `;
    
    const testNames = {
        'transferTime': 'Transfer Time',
        'etdTime': 'ETD Time',
        'bookToAllocTime': 'Booking to Allocation',
        'allocToArrTime': 'Allocation to Arrival'
    };
    
    for (const [key, test] of Object.entries(tests)) {
        testsHtml += `
            <tr>
                <td>${testNames[key]}</td>
                <td>${test.testType}</td>
                <td>${test.H.toFixed(2)}</td>
                <td>${test.df}</td>
                <td>${test.pValue.toFixed(3)}</td>
                <td>${test.significant ? 'Yes' : 'No'}</td>
            </tr>
        `;
    }
    
    testsHtml += '</tbody></table>';
    testsElement.innerHTML = testsHtml;
}
