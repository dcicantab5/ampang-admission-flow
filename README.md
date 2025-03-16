# Ampang Admission Flow Analysis

## Overview

This repository contains an interactive dashboard for analyzing patient flow from the Emergency and Trauma Department (ETD) to admission wards at Hospital Ampang. The analysis focuses on four wards (W6A, W6B, W6C, and W6D) and provides comprehensive statistical insights into ETD times, transfer times, and temporal patterns of patient admissions.

![Ampang Admission Flow Analysis Dashboard](https://via.placeholder.com/800x400?text=Ampang+Admission+Flow+Analysis)

## Features

- **Interactive Dashboard**: Navigate between different analysis views using a tabbed interface
- **Multiple Visualization Types**: Bar charts, line charts, and pie charts presenting different aspects of the data
- **Statistical Analysis**: Includes descriptive statistics, Kruskal-Wallis H test results, and circular statistics
- **24-Hour Distribution Analysis**: Visualizes booking, allocation, registration, and arrival patterns throughout the day
- **Peak Hours Identification**: Highlights peak admission times for each ward
- **Quality Improvement Insights**: Provides data-driven recommendations for process improvement

## Data Analysis Components

1. **Overview**: Patient distribution by ward and summary statistics
2. **ETD Time Analysis**: Comparison of time spent in ETD before ward admission
3. **Transfer Time Analysis**: Analysis of time from bed allocation to ward arrival
4. **Peak Hours Analysis**: Identification of peak admission times for each ward
5. **24-Hour Distribution**: Visualization of process timings throughout the day

## Statistical Methods

- **Descriptive Statistics**: Mean, median, interquartile range (IQR), and 95% confidence intervals
- **Kruskal-Wallis H Test**: Non-parametric method for comparing medians among multiple independent groups
- **Circular Statistics**: Specialized methods for analyzing cyclical time data, including Rayleigh test for uniformity

## Key Findings

- ETD times differ significantly between wards (p = 0.016)
- Ward W6D has the highest median ETD time (685.8 min)
- Ward W6A has the lowest median ETD time (376.3 min)
- Transfer times differ highly significantly between wards (p < 0.001)
- Ward W6D has the shortest transfer time (median 39.3 min)
- Ward W6B has the longest transfer time (median 56.1 min)
- Evening hours (18:00-20:00) are peak admission times for all wards
- Registration times show a notable peak at 20:00 (12.6% of all registrations)

## Quality Improvement Recommendations

- Standardize transfer processes across all wards to reduce variability
- Investigate reasons for longer ETD times in W6D
- Optimize staffing during peak arrival and registration hours (17:00-20:00)
- Apply W6D transfer process improvements to other wards
- Consider staggered discharge times to better accommodate peak admission periods
- Improve coordination between booking, allocation, registration, and arrival processes
- Review patient flow to reduce extended ETD stays (some exceeding 48 hours)

## Technical Implementation

This dashboard is implemented as a static web application using:
- **React**: For building the user interface
- **Recharts**: For data visualization
- **Tailwind CSS**: For styling

The application is designed to be hosted directly on GitHub Pages without requiring a build process or server-side components.

## Files in this Repository

- **index.html**: Main HTML file that loads the required dependencies
- **app.js**: React application that renders the interactive dashboard
- **data.json**: Comprehensive analysis results in JSON format

## Deployment

This repository is set up for direct deployment on GitHub Pages. The live dashboard can be accessed at: [https://dcicantab5.github.io/ampang-admission-analysis/](https://dcicantab5.github.io/ampang-admission-analysis/)

## Data Source

The analysis is based on patient flow data from Hospital Ampang, collected in February - March 2025. The dataset includes admission records with timestamps for key events in the patient journey from ETD to wards.

## License

This project is licensed under the AGPL3.0 License - see the LICENSE file for details.

## Acknowledgments

- Hospital Ampang's Quality Unit & BMU for providing the data
- The medical and administrative staff involved in patient care
