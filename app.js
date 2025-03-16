// Ampang Admission Flow Analysis Dashboard
document.addEventListener('DOMContentLoaded', function() {
    // Load the JSON data
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            // Initialize the dashboard with data
            initializeDashboard(data);
        })
        .catch(error => {
            console.error('Error loading data:', error);
            document.getElementById('error-message').textContent = 'Error loading data. Please check console for details.';
            document.getElementById('error-message').style.display = 'block';
        });
});

function initializeDashboard(data) {
    // Display metadata
    displayMetadata(data.metadata);
    
    // Display summary
    displaySummary(data.summary);
    
    // Create charts
    createWardCountChart(data.summary.wardCounts, data.metadata.wardOrder);
    createETDTimeChart(data.statistics.etdTime, data.metadata.wardOrder);
    createTransferTimeChart(data.statistics.transferTime, data.metadata.wardOrder);
    createHourlyDistributionChart(data.statistics.hourlyDistribution);
    createPeakHoursChart(data.statistics.peakHours, data.metadata.wardOrder);
    createCircularStatsChart(data.statistics.circularStats, data.metadata.wardOrder);
    
    // Display quality improvement data
    displayKeyFindings(data.qualityImprovement.keyFindings);
    displayRecommendations(data.qualityImprovement.recommendedInterventions);
    
    // Display statistical test results
    displayStatisticalTests(data.statistics);
}

function displayMetadata(metadata) {
    document.getElementById('dashboard-title').textContent = metadata.title;
    document.getElementById('generated-date').textContent = formatDate(metadata.generatedDate);
    document.getElementById('data-source').textContent = metadata.dataSource;
}

function displaySummary(summary) {
    document.getElementById('total-patients').textContent = summary.totalPatients;
    
    const wardListElement = document.getElementById('ward-breakdown');
    wardListElement.innerHTML = '';
    
    for (const [ward, count] of Object.entries(summary.wardCounts)) {
        const percent = ((count / summary.totalPatients) * 100).toFixed(1);
        const li = document.createElement('li');
        li.className = 'list-group-item d-flex justify-content-between align-items-center';
        li.innerHTML = `
            <span>Ward ${ward}</span>
            <span>
                <span class="badge bg-primary rounded-pill">${count}</span>
                <span class="text-muted ms-2">(${percent}%)</span>
            </span>
        `;
        wardListElement.appendChild(li);
    }
}

function createWardCountChart(wardCounts, wardOrder) {
    const ctx = document.getElementById('ward-count-chart').getContext('2d');
    
    const data = wardOrder.map(ward => wardCounts[ward]);
    const labels = wardOrder.map(ward => `Ward ${ward}`);
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Number of Patients',
                data: data,
                backgroundColor: [
                    'rgba(54, 162, 235, 0.7)',
                    'rgba(75, 192, 192, 0.7)',
                    'rgba(153, 102, 255, 0.7)',
                    'rgba(255, 159, 64, 0.7)'
                ],
                borderColor: [
                    'rgb(54, 162, 235)',
                    'rgb(75, 192, 192)',
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
                    text: 'Patient Distribution by Ward',
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
                }
            }
        }
    });
}

function createETDTimeChart(etdTimeData, wardOrder) {
    const ctx = document.getElementById('etd-time-chart').getContext('2d');
    
    const medianData = wardOrder.map(ward => etdTimeData.byWard[ward].median);
    const meanData = wardOrder.map(ward => etdTimeData.byWard[ward].mean);
    const labels = wardOrder.map(ward => `Ward ${ward}`);
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Median ETD Time (min)',
                    data: medianData,
                    backgroundColor: 'rgba(54, 162, 235, 0.7)',
                    borderColor: 'rgb(54, 162, 235)',
                    borderWidth: 1
                },
                {
                    label: 'Mean ETD Time (min)',
                    data: meanData,
                    backgroundColor: 'rgba(255, 99, 132, 0.7)',
                    borderColor: 'rgb(255, 99, 132)',
                    borderWidth: 1
                }
            ]
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
                            const ward = wardOrder[context.dataIndex];
                            const wardData = etdTimeData.byWard[ward];
                            return [
                                `Min: ${wardData.min.toFixed(1)} min`,
                                `Max: ${wardData.max.toFixed(1)} min`,
                                `Q1-Q3: ${wardData.q1.toFixed(1)} - ${wardData.q3.toFixed(1)} min`,
                                `IQR: ${wardData.iqr.toFixed(1)} min`,
                                `95% CI: ${wardData.ci95[0].toFixed(1)} - ${wardData.ci95[1].toFixed(1)} min`
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
                }
            }
        }
    });
}

function createTransferTimeChart(transferTimeData, wardOrder) {
    const ctx = document.getElementById('transfer-time-chart').getContext('2d');
    
    const medianData = wardOrder.map(ward => transferTimeData.byWard[ward].median);
    const meanData = wardOrder.map(ward => transferTimeData.byWard[ward].mean);
    const labels = wardOrder.map(ward => `Ward ${ward}`);
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Median Transfer Time (min)',
                    data: medianData,
                    backgroundColor: 'rgba(75, 192, 192, 0.7)',
                    borderColor: 'rgb(75, 192, 192)',
                    borderWidth: 1
                },
                {
                    label: 'Mean Transfer Time (min)',
                    data: meanData,
                    backgroundColor: 'rgba(153, 102, 255, 0.7)',
                    borderColor: 'rgb(153, 102, 255)',
                    borderWidth: 1
                }
            ]
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
                            const ward = wardOrder[context.dataIndex];
                            const wardData = transferTimeData.byWard[ward];
                            return [
                                `Min: ${wardData.min.toFixed(1)} min`,
                                `Max: ${wardData.max.toFixed(1)} min`,
                                `Q1-Q3: ${wardData.q1.toFixed(1)} - ${wardData.q3.toFixed(1)} min`,
                                `IQR: ${wardData.iqr.toFixed(1)} min`,
                                `95% CI: ${wardData.ci95[0].toFixed(1)} - ${wardData.ci95[1].toFixed(1)} min`
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
                }
            }
        }
    });
}

function createHourlyDistributionChart(hourlyData) {
    const ctx = document.getElementById('hourly-distribution-chart').getContext('2d');
    
    const hours = Array.from({length: 24}, (_, i) => i);
    const bookingData = hours.map(hour => {
        const entry = hourlyData.booking.find(item => item.hour === hour);
        return entry ? entry.count : 0;
    });
    
    const allocationData = hours.map(hour => {
        const entry = hourlyData.allocation.find(item => item.hour === hour);
        return entry ? entry.count : 0;
    });
    
    const registrationData = hours.map(hour => {
        const entry = hourlyData.registration.find(item => item.hour === hour);
        return entry ? entry.count : 0;
    });
    
    const arrivalData = hours.map(hour => {
        const entry = hourlyData.arrival.find(item => item.hour === hour);
        return entry ? entry.count : 0;
    });
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: hours.map(hour => `${hour}:00`),
            datasets: [
                {
                    label: 'Booking',
                    data: bookingData,
                    borderColor: 'rgb(54, 162, 235)',
                    backgroundColor: 'rgba(54, 162, 235, 0.1)',
                    borderWidth: 2,
                    tension: 0.3,
                    fill: false
                },
                {
                    label: 'Allocation',
                    data: allocationData,
                    borderColor: 'rgb(75, 192, 192)',
                    backgroundColor: 'rgba(75, 192, 192, 0.1)',
                    borderWidth: 2,
                    tension: 0.3,
                    fill: false
                },
                {
                    label: 'Registration',
                    data: registrationData,
                    borderColor: 'rgb(153, 102, 255)',
                    backgroundColor: 'rgba(153, 102, 255, 0.1)',
                    borderWidth: 2,
                    tension: 0.3,
                    fill: false
                },
                {
                    label: 'Arrival',
                    data: arrivalData,
                    borderColor: 'rgb(255, 99, 132)',
                    backgroundColor: 'rgba(255, 99, 132, 0.1)',
                    borderWidth: 2,
                    tension: 0.3,
                    fill: false
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Hourly Distribution of Patient Flow',
                    font: { size: 16 }
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
                        text: 'Hour of Day'
                    }
                }
            }
        }
    });
}

function createPeakHoursChart(peakHoursData, wardOrder) {
    const ctx = document.getElementById('peak-hours-chart').getContext('2d');
    
    const datasets = wardOrder.map((ward, index) => {
        // Get the peak hour data for this ward
        const wardPeaks = peakHoursData[ward];
        
        // Create the dataset for this ward
        return {
            label: `Ward ${ward}`,
            data: wardPeaks.map(peak => peak.count),
            backgroundColor: [
                'rgba(54, 162, 235, 0.7)',
                'rgba(75, 192, 192, 0.7)',
                'rgba(153, 102, 255, 0.7)',
                'rgba(255, 159, 64, 0.7)'
            ][index],
            borderColor: [
                'rgb(54, 162, 235)',
                'rgb(75, 192, 192)',
                'rgb(153, 102, 255)',
                'rgb(255, 159, 64)'
            ][index],
            borderWidth: 1
        };
    });
    
    // Get all unique peak hours
    const peakHours = wardOrder.flatMap(ward => 
        peakHoursData[ward].map(peak => `${peak.hour}:00`)
    );
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Top Peak', '2nd Peak', '3rd Peak'],
            datasets: datasets
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Peak Hours by Ward',
                    font: { size: 16 }
                },
                tooltip: {
                    callbacks: {
                        afterLabel: function(context) {
                            const wardIndex = context.datasetIndex;
                            const peakIndex = context.dataIndex;
                            const ward = wardOrder[wardIndex];
                            const peak = peakHoursData[ward][peakIndex];
                            return [
                                `Hour: ${peak.hour}:00`,
                                `Percentage: ${peak.percent}`
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
                        text: 'Number of Patients'
                    }
                }
            }
        }
    });
}

function createCircularStatsChart(circularStatsData, wardOrder) {
    const ctx = document.getElementById('circular-stats-chart').getContext('2d');
    
    const meanHours = wardOrder.map(ward => circularStatsData[ward].meanHour);
    const rValues = wardOrder.map(ward => circularStatsData[ward].r);
    const labels = wardOrder.map(ward => `Ward ${ward}`);
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Mean Hour',
                    data: meanHours,
                    backgroundColor: 'rgba(54, 162, 235, 0.7)',
                    borderColor: 'rgb(54, 162, 235)',
                    borderWidth: 1,
                    yAxisID: 'y'
                },
                {
                    label: 'Concentration (r)',
                    data: rValues,
                    backgroundColor: 'rgba(255, 99, 132, 0.7)',
                    borderColor: 'rgb(255, 99, 132)',
                    borderWidth: 1,
                    yAxisID: 'y1'
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Circular Statistics by Ward',
                    font: { size: 16 }
                },
                tooltip: {
                    callbacks: {
                        afterLabel: function(context) {
                            const ward = wardOrder[context.dataIndex];
                            const wardData = circularStatsData[ward];
                            return [
                                `Mean Hour: ${wardData.meanHour.toFixed(1)}`,
                                `Mean Angle: ${wardData.meanAngle.toFixed(2)} rad`,
                                `Concentration (r): ${wardData.r.toFixed(3)}`,
                                `Circular Variance: ${wardData.circularVariance.toFixed(3)}`,
                                `Circular Std Dev: ${wardData.circularStdDev.toFixed(3)}`,
                                `Rayleigh Test: p=${wardData.rayleighP.toFixed(6)}`,
                                `Uniform Distribution: ${wardData.isUniform ? 'Yes' : 'No'}`
                            ];
                        }
                    }
                }
            },
            scales: {
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    title: {
                        display: true,
                        text: 'Mean Hour of Day'
                    }
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    grid: {
                        drawOnChartArea: false
                    },
                    min: 0,
                    max: 1,
                    title: {
                        display: true,
                        text: 'Concentration (r)'
                    }
                }
            }
        }
    });
}

function displayKeyFindings(findings) {
    const findingsElement = document.getElementById('key-findings-list');
    findingsElement.innerHTML = '';
    
    findings.forEach(finding => {
        const li = document.createElement('li');
        li.className = 'list-group-item';
        li.textContent = finding;
        findingsElement.appendChild(li);
    });
}

function displayRecommendations(recommendations) {
    const recommendationsElement = document.getElementById('recommendations-list');
    recommendationsElement.innerHTML = '';
    
    recommendations.forEach(recommendation => {
        const li = document.createElement('li');
        li.className = 'list-group-item';
        li.textContent = recommendation;
        recommendationsElement.appendChild(li);
    });
}

function displayStatisticalTests(statistics) {
    // Extract tests from ETD and Transfer Time data
    const etdTest = statistics.etdTime.kruskalWallis;
    const transferTest = statistics.transferTime.kruskalWallis;
    
    // Create table content for ETD time test
    document.getElementById('etd-test-h').textContent = etdTest.H.toFixed(2);
    document.getElementById('etd-test-df').textContent = etdTest.df;
    document.getElementById('etd-test-p').textContent = etdTest.pValue.toFixed(3);
    document.getElementById('etd-test-sig').textContent = etdTest.interpretation;
    
    // Create table content for Transfer time test
    document.getElementById('transfer-test-h').textContent = transferTest.H.toFixed(2);
    document.getElementById('transfer-test-df').textContent = transferTest.df;
    document.getElementById('transfer-test-p').textContent = transferTest.pValue.toFixed(3);
    document.getElementById('transfer-test-sig').textContent = transferTest.interpretation;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}
