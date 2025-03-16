// Main data object
let analysisData = null;

// Load data from JSON
document.addEventListener('DOMContentLoaded', function() {
    // For GitHub Pages deployment, we'll load the data from the static JSON file
    // In a production environment, this might come from an API
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            analysisData = data;
            initializeDashboard();
        })
        .catch(error => {
            console.error('Error loading data:', error);
            document.body.innerHTML = `<div class="container mt-5">
                <div class="alert alert-danger">
                    <h4>Error Loading Data</h4>
                    <p>Could not load the analysis data. Please ensure data.json is in the root directory.</p>
                    <p>Technical details: ${error.message}</p>
                </div>
            </div>`;
        });
});

function initializeDashboard() {
    // Update metadata
    document.getElementById('generatedDate').textContent = 'Generated: ' + 
        new Date(analysisData.metadata.generatedDate).toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
        });

    // Initialize all charts and tables
    renderOverviewTab();
    renderETDTab();
    renderTransferTab();
    renderHourlyDistributionTab();
    renderRecommendationsTab();
}

function renderOverviewTab() {
    // Render ward distribution chart
    renderWardDistribution();
    
    // Render ward summary table
    renderWardSummaryTable();
    
    // Render circular stats chart
    renderCircularStatsChart();
}

function renderWardDistribution() {
    const wards = Object.keys(analysisData.summary.wardCounts);
    const counts = wards.map(ward => analysisData.summary.wardCounts[ward]);
    const colors = ['#1a237e', '#283593', '#303f9f', '#3949ab'];
    
    const options = {
        series: counts,
        chart: {
            type: 'pie',
            height: 350
        },
        labels: wards,
        colors: colors,
        dataLabels: {
            enabled: true,
            formatter: function(val, opts) {
                return opts.w.config.labels[opts.seriesIndex] + ': ' + opts.w.config.series[opts.seriesIndex];
            }
        },
        legend: {
            position: 'bottom'
        },
        title: {
            text: `Total Patients: ${analysisData.summary.totalPatients}`,
            align: 'center',
            style: {
                fontSize: '16px'
            }
        },
        tooltip: {
            y: {
                formatter: function(value) {
                    return value + ' patients';
                }
            }
        },
        responsive: [{
            breakpoint: 480,
            options: {
                chart: {
                    width: 300
                },
                legend: {
                    position: 'bottom'
                }
            }
        }]
    };

    const chart = new ApexCharts(document.getElementById('wardDistributionChart'), options);
    chart.render();
}

function renderWardSummaryTable() {
    const tableBody = document.getElementById('wardSummaryTable');
    const wards = Object.keys(analysisData.statistics.etdTime.byWard);
    
    tableBody.innerHTML = '';
    
    wards.forEach(ward => {
        const etdStats = analysisData.statistics.etdTime.byWard[ward];
        const transferStats = analysisData.statistics.transferTime.byWard[ward];
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>${ward}</strong></td>
            <td>${analysisData.summary.wardCounts[ward]}</td>
            <td>${etdStats.median.toFixed(1)} min</td>
            <td>${transferStats.median.toFixed(1)} min</td>
        `;
        
        tableBody.appendChild(row);
    });
}

function renderCircularStatsChart() {
    const wards = Object.keys(analysisData.statistics.circularStats);
    const series = [];
    
    wards.forEach(ward => {
        series.push({
            name: ward,
            data: [{
                x: 'Mean Admission Hour',
                y: analysisData.statistics.circularStats[ward].meanHour
            }]
        });
    });
    
    const options = {
        series: series,
        chart: {
            type: 'bar',
            height: 350,
            stacked: false,
            toolbar: {
                show: false
            }
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: '55%',
                endingShape: 'rounded'
            },
        },
        dataLabels: {
            enabled: true,
            formatter: function(val) {
                return val.toFixed(1);
            }
        },
        xaxis: {
            categories: ['Mean Admission Hour'],
        },
        yaxis: {
            title: {
                text: 'Hour (24-hour format)'
            },
            min: 0,
            max: 24,
            tickAmount: 6
        },
        fill: {
            opacity: 1
        },
        tooltip: {
            y: {
                formatter: function(val) {
                    const hours = Math.floor(val);
                    const minutes = Math.round((val - hours) * 60);
                    return `${hours}:${minutes.toString().padStart(2, '0')} (${val.toFixed(1)})`;
                }
            }
        },
        colors: ['#1a237e', '#283593', '#303f9f', '#3949ab']
    };

    const chart = new ApexCharts(document.getElementById('circularStatsChart'), options);
    chart.render();
}

function renderETDTab() {
    // ETD Comparison Chart
    renderETDComparisonChart();
    
    // ETD Stats Table
    renderETDStatsTable();
    
    // Kruskal-Wallis Test Result
    document.getElementById('etdKruskalWallis').textContent = 
        `H = ${analysisData.statistics.etdTime.kruskalWallis.H.toFixed(2)}, 
         df = ${analysisData.statistics.etdTime.kruskalWallis.df}, 
         p-value = ${analysisData.statistics.etdTime.kruskalWallis.pValue.toFixed(3)}. 
         ${analysisData.statistics.etdTime.kruskalWallis.interpretation}`;
}

function renderETDComparisonChart() {
    const wards = Object.keys(analysisData.statistics.etdTime.byWard);
    const series = [];
    
    wards.forEach(ward => {
        const stats = analysisData.statistics.etdTime.byWard[ward];
        
        series.push({
            name: ward,
            data: [
                {
                    x: 'Median',
                    y: stats.median
                },
                {
                    x: 'Mean',
                    y: stats.mean
                },
                {
                    x: 'Q1',
                    y: stats.q1
                },
                {
                    x: 'Q3',
                    y: stats.q3
                }
            ]
        });
    });
    
    const options = {
        series: series,
        chart: {
            type: 'bar',
            height: 400,
            toolbar: {
                show: false
            }
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: '55%',
                endingShape: 'rounded'
            },
        },
        dataLabels: {
            enabled: false
        },
        xaxis: {
            categories: ['Median', 'Mean', 'Q1', 'Q3'],
        },
        yaxis: {
            title: {
                text: 'Time (minutes)'
            },
            labels: {
                formatter: function(val) {
                    return val.toFixed(0);
                }
            }
        },
        fill: {
            opacity: 1
        },
        tooltip: {
            y: {
                formatter: function(val) {
                    return val.toFixed(1) + ' min';
                }
            }
        },
        colors: ['#1a237e', '#283593', '#303f9f', '#3949ab'],
        title: {
            text: 'ETD Time Comparison',
            align: 'center',
            style: {
                fontSize: '16px'
            }
        }
    };

    const chart = new ApexCharts(document.getElementById('etdComparisonChart'), options);
    chart.render();
}

function renderETDStatsTable() {
    const tableBody = document.getElementById('etdStatsTable');
    const wards = Object.keys(analysisData.statistics.etdTime.byWard);
    
    tableBody.innerHTML = '';
    
    wards.forEach(ward => {
        const stats = analysisData.statistics.etdTime.byWard[ward];
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>${ward}</strong></td>
            <td>${stats.mean.toFixed(1)}</td>
            <td>${stats.median.toFixed(1)}</td>
            <td>${stats.min.toFixed(1)}</td>
            <td>${stats.max.toFixed(1)}</td>
            <td>${stats.q1.toFixed(1)}</td>
            <td>${stats.q3.toFixed(1)}</td>
            <td>${stats.stdDev.toFixed(1)}</td>
            <td>[${stats.ci95[0].toFixed(1)}, ${stats.ci95[1].toFixed(1)}]</td>
        `;
        
        tableBody.appendChild(row);
    });
}

function renderTransferTab() {
    // Transfer Comparison Chart
    renderTransferComparisonChart();
    
    // Transfer Stats Table
    renderTransferStatsTable();
    
    // Kruskal-Wallis Test Result
    document.getElementById('transferKruskalWallis').textContent = 
        `H = ${analysisData.statistics.transferTime.kruskalWallis.H.toFixed(2)}, 
         df = ${analysisData.statistics.transferTime.kruskalWallis.df}, 
         p-value = ${analysisData.statistics.transferTime.kruskalWallis.pValue.toFixed(3)}. 
         ${analysisData.statistics.transferTime.kruskalWallis.interpretation}`;
}

function renderTransferComparisonChart() {
    const wards = Object.keys(analysisData.statistics.transferTime.byWard);
    const series = [];
    
    wards.forEach(ward => {
        const stats = analysisData.statistics.transferTime.byWard[ward];
        
        series.push({
            name: ward,
            data: [
                {
                    x: 'Median',
                    y: stats.median
                },
                {
                    x: 'Mean',
                    y: stats.mean
                },
                {
                    x: 'Q1',
                    y: stats.q1
                },
                {
                    x: 'Q3',
                    y: stats.q3
                }
            ]
        });
    });
    
    const options = {
        series: series,
        chart: {
            type: 'bar',
            height: 400,
            toolbar: {
                show: false
            }
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: '55%',
                endingShape: 'rounded'
            },
        },
        dataLabels: {
            enabled: false
        },
        xaxis: {
            categories: ['Median', 'Mean', 'Q1', 'Q3'],
        },
        yaxis: {
            title: {
                text: 'Time (minutes)'
            },
            labels: {
                formatter: function(val) {
                    return val.toFixed(0);
                }
            }
        },
        fill: {
            opacity: 1
        },
        tooltip: {
            y: {
                formatter: function(val) {
                    return val.toFixed(1) + ' min';
                }
            }
        },
        colors: ['#1a237e', '#283593', '#303f9f', '#3949ab'],
        title: {
            text: 'Transfer Time Comparison',
            align: 'center',
            style: {
                fontSize: '16px'
            }
        }
    };

    const chart = new ApexCharts(document.getElementById('transferComparisonChart'), options);
    chart.render();
}

function renderTransferStatsTable() {
    const tableBody = document.getElementById('transferStatsTable');
    const wards = Object.keys(analysisData.statistics.transferTime.byWard);
    
    tableBody.innerHTML = '';
    
    wards.forEach(ward => {
        const stats = analysisData.statistics.transferTime.byWard[ward];
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>${ward}</strong></td>
            <td>${stats.mean.toFixed(1)}</td>
            <td>${stats.median.toFixed(1)}</td>
            <td>${stats.min.toFixed(1)}</td>
            <td>${stats.max.toFixed(1)}</td>
            <td>${stats.q1.toFixed(1)}</td>
            <td>${stats.q3.toFixed(1)}</td>
            <td>${stats.stdDev.toFixed(1)}</td>
            <td>[${stats.ci95[0].toFixed(1)}, ${stats.ci95[1].toFixed(1)}]</td>
        `;
        
        tableBody.appendChild(row);
    });
}

function renderHourlyDistributionTab() {
    // Hourly Distribution Chart
    renderHourlyDistributionChart();
    
    // Peak Hours by Ward
    renderPeakHoursByWard();
}

function renderHourlyDistributionChart() {
    const hours = Array.from({length: 24}, (_, i) => i);
    
    const series = [
        {
            name: 'Booking',
            data: hours.map(hour => {
                const item = analysisData.statistics.hourlyDistribution.booking.find(b => b.hour === hour);
                return item ? item.count : 0;
            })
        },
        {
            name: 'Allocation',
            data: hours.map(hour => {
                const item = analysisData.statistics.hourly
