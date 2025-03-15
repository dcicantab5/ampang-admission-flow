# Hospital Ampang Patient Flow Analysis

This repository contains a dashboard visualization for analyzing patient flow from the Emergency and Trauma Department (ETD) to different wards in Hospital Ampang.

## Overview

The analysis visualizes the flow of patients from ETD to four different wards (W6A, W6B, W6C, and W6D), focusing on the following metrics:

- Transfer time from booking to arrival at wards
- Time spent in ETD
- Time patterns throughout the day
- Statistical comparisons between wards

## Live Demo

The dashboard is available at: [https://dcicantab5.github.io/ampang-admission-flow/](https://dcicantab5.github.io/ampang-admission-flow/)

## Features

- Interactive visualizations showing median and mean times with error bars
- Hourly pattern analysis showing peak times for different process steps
- Statistical comparisons between wards (ANOVA)
- Detailed data tables with summary statistics
- Toggle between median and mean visualizations

## Data Analysis Methods

- **Transfer Time**: Time from bed allocation to arrival at the ward
- **ETD Time**: Duration spent in the Emergency and Trauma Department
- **Statistical Testing**: 
  - Kruskal-Wallis H test for non-parametric comparison between wards
  - Circular statistics (Rayleigh test, Kuiper's test) for hourly pattern analysis
- **Confidence Intervals**: 95% confidence intervals for means

## Findings

1. **Transfer Times by Ward**:
   - Ward W6D shows the shortest median transfer time (152.4 minutes)
   - Ward W6B has the highest median transfer time (196.1 minutes)
   - No statistically significant differences between wards (p = 0.303, Kruskal-Wallis)

2. **ETD Times by Ward**:
   - Ward W6B has the shortest median ETD time (443.7 minutes)
   - Ward W6D has the longest median ETD time (1664.4 minutes)
   - No statistically significant differences between wards (p = 0.743, Kruskal-Wallis)

3. **Peak Hours**:
   - Booking: No significant daily pattern (p=0.802, Rayleigh test)
   - Bed Allocation: Mean time 16:50 (95% CI: 14:57-18:43), with peak at 20:00
   - Registration: Mean time 17:40 (95% CI: 15:54-19:26), with peak at 20:00
   - Ward Arrival: Mean time 20:10 (95% CI: 18:30-21:50), with peak at 23:00

## Quality Improvement Recommendations

1. **Standardize transfer processes** across all wards to reduce variability
2. **Address peak hours** with appropriate staffing and resources
3. **Review ETD to ward workflows** to identify bottlenecks
4. **Implement real-time monitoring** of patient flow metrics

## Technical Implementation

This dashboard is built using:

- React.js for the UI components
- Recharts for data visualization
- Tailwind CSS for styling
- Static deployment on GitHub Pages

## License

This project is available under the AGPL 3.0 License.
