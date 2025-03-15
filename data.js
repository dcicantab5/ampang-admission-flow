// Pre-computed data including inferential analysis results
const wardData = {
  "W6A": {
    "bookToAlloc": {
      "median": 7.11,
      "q1": 3.36,
      "q3": 13.72,
      "iqr": 10.36,
      "min": 0.02,
      "max": 53.94,
      "mean": 10.04,
      "ciLower": 8.32,
      "ciUpper": 11.76
    },
    "allocToArr": {
      "median": 0.87,
      "q1": 0.51,
      "q3": 1.54,
      "iqr": 1.03,
      "min": 0.11,
      "max": 9.79,
      "mean": 1.18,
      "ciLower": 0.95,
      "ciUpper": 1.42
    },
    "bookToArr": {
      "median": 7.98,
      "q1": 3.98,
      "q3": 14.58, 
      "iqr": 10.60,
      "min": 0.35,
      "max": 54.90,
      "mean": 10.81,
      "ciLower": 9.02,
      "ciUpper": 12.61
    },
    "totalTime": {
      "median": 8.16,
      "q1": 4.01,
      "q3": 16.26,
      "iqr": 12.25,
      "min": 0.35,
      "max": 54.90,
      "mean": 11.17,
      "ciLower": 9.31,
      "ciUpper": 13.03
    }
  },
  "W6B": {
    "bookToAlloc": {
      "median": 10.39,
      "q1": 3.93,
      "q3": 27.64,
      "iqr": 23.71,
      "min": 0.05,
      "max": 56.07,
      "mean": 16.33,
      "ciLower": 13.51,
      "ciUpper": 19.15
    },
    "allocToArr": {
      "median": 0.94,
      "q1": 0.71,
      "q3": 1.49,
      "iqr": 0.79,
      "min": 0.34,
      "max": 11.17,
      "mean": 1.34,
      "ciLower": 1.09,
      "ciUpper": 1.59
    },
    "bookToArr": {
      "median": 11.25,
      "q1": 5.33,
      "q3": 29.50,
      "iqr": 24.17,
      "min": 0.62,
      "max": 57.26,
      "mean": 17.73,
      "ciLower": 14.74,
      "ciUpper": 20.73
    },
    "totalTime": {
      "median": 11.65,
      "q1": 5.33,
      "q3": 29.11,
      "iqr": 23.78,
      "min": 0.62,
      "max": 57.26,
      "mean": 17.60,
      "ciLower": 14.48,
      "ciUpper": 20.71
    }
  },
  "W6C": {
    "bookToAlloc": {
      "median": 8.15,
      "q1": 2.28,
      "q3": 19.65,
      "iqr": 17.37,
      "min": 0.13,
      "max": 49.67,
      "mean": 13.16,
      "ciLower": 10.57,
      "ciUpper": 15.75
    },
    "allocToArr": {
      "median": 0.95,
      "q1": 0.60,
      "q3": 1.52,
      "iqr": 0.92,
      "min": 0.23,
      "max": 3.60,
      "mean": 1.13,
      "ciLower": 0.99,
      "ciUpper": 1.28
    },
    "bookToArr": {
      "median": 8.38,
      "q1": 3.18,
      "q3": 20.63,
      "iqr": 17.45,
      "min": 0.53,
      "max": 52.45,
      "mean": 14.07,
      "ciLower": 11.35,
      "ciUpper": 16.80
    },
    "totalTime": {
      "median": 8.92,
      "q1": 3.18,
      "q3": 20.63,
      "iqr": 17.45,
      "min": 0.53,
      "max": 52.45,
      "mean": 14.27,
      "ciLower": 11.55,
      "ciUpper": 16.99
    }
  },
  "W6D": {
    "bookToAlloc": {
      "median": 11.43,
      "q1": 3.71,
      "q3": 25.90,
      "iqr": 22.19,
      "min": 0.01,
      "max": 50.66,
      "mean": 14.53,
      "ciLower": 11.93,
      "ciUpper": 17.13
    },
    "allocToArr": {
      "median": 0.66,
      "q1": 0.48,
      "q3": 0.87,
      "iqr": 0.39,
      "min": 0.14,
      "max": 3.57,
      "mean": 0.80,
      "ciLower": 0.69,
      "ciUpper": 0.90
    },
    "bookToArr": {
      "median": 12.06,
      "q1": 4.19,
      "q3": 26.31,
      "iqr": 22.12,
      "min": 0.30,
      "max": 51.17,
      "mean": 15.33,
      "ciLower": 12.66,
      "ciUpper": 17.99
    },
    "totalTime": {
      "median": 12.06,
      "q1": 4.19,
      "q3": 26.31,
      "iqr": 22.12,
      "min": 0.30,
      "max": 51.17,
      "mean": 15.33,
      "ciLower": 12.66,
      "ciUpper": 18.00
    }
  }
};

// Statistical significance data with Bonferroni correction
const statisticalTests = {
  "W6A_vs_W6B": {
    "bookToAlloc": {
      "meanDiff": -6.28,
      "pValue": 0.000188,
      "adjustedPValue": 0.0045,
      "ciLower": -9.58,
      "ciUpper": -2.99,
      "isSignificant": true
    },
    "allocToArr": {
      "meanDiff": -0.16,
      "pValue": 0.3659,
      "adjustedPValue": 1.0,
      "ciLower": -0.50,
      "ciUpper": 0.18,
      "isSignificant": false
    },
    "bookToArr": {
      "meanDiff": -6.92,
      "pValue": 0.000078,
      "adjustedPValue": 0.0019,
      "ciLower": -10.35,
      "ciUpper": -3.49,
      "isSignificant": true
    },
    "totalTime": {
      "meanDiff": -6.43,
      "pValue": 0.00014,
      "adjustedPValue": 0.0034,
      "ciLower": -9.74,
      "ciUpper": -3.12,
      "isSignificant": true
    }
  },
  "W6A_vs_W6C": {
    "bookToAlloc": {
      "meanDiff": -3.11,
      "pValue": 0.0490,
      "adjustedPValue": 1.0,
      "ciLower": -6.22,
      "ciUpper": -0.01,
      "isSignificant": false
    },
    "allocToArr": {
      "meanDiff": 0.05,
      "pValue": 0.7284,
      "adjustedPValue": 1.0,
      "ciLower": -0.23,
      "ciUpper": 0.33,
      "isSignificant": false
    },
    "bookToArr": {
      "meanDiff": -3.26,
      "pValue": 0.0445,
      "adjustedPValue": 1.0,
      "ciLower": -6.44,
      "ciUpper": -0.08,
      "isSignificant": false
    },
    "totalTime": {
      "meanDiff": -3.10,
      "pValue": 0.0521,
      "adjustedPValue": 1.0,
      "ciLower": -6.23,
      "ciUpper": 0.03,
      "isSignificant": false
    }
  },
  "W6A_vs_W6D": {
    "bookToAlloc": {
      "meanDiff": -4.48,
      "pValue": 0.0033,
      "adjustedPValue": 0.0797,
      "ciLower": -7.48,
      "ciUpper": -1.49,
      "isSignificant": false
    },
    "allocToArr": {
      "meanDiff": 0.39,
      "pValue": 0.0045,
      "adjustedPValue": 0.1092,
      "ciLower": 0.12,
      "ciUpper": 0.65,
      "isSignificant": false
    },
    "bookToArr": {
      "meanDiff": -4.51,
      "pValue": 0.0040,
      "adjustedPValue": 0.0967,
      "ciLower": -7.59,
      "ciUpper": -1.44,
      "isSignificant": false
    },
    "totalTime": {
      "meanDiff": -4.16,
      "pValue": 0.0071,
      "adjustedPValue": 0.1703,
      "ciLower": -7.19,
      "ciUpper": -1.13,
      "isSignificant": false
    }
  },
  "W6B_vs_W6C": {
    "bookToAlloc": {
      "meanDiff": 3.17,
      "pValue": 0.1143,
      "adjustedPValue": 1.0,
      "ciLower": -0.76,
      "ciUpper": 7.10,
      "isSignificant": false
    },
    "allocToArr": {
      "meanDiff": 0.21,
      "pValue": 0.1681,
      "adjustedPValue": 1.0,
      "ciLower": -0.09,
      "ciUpper": 0.50,
      "isSignificant": false
    },
    "bookToArr": {
      "meanDiff": 3.66,
      "pValue": 0.0759,
      "adjustedPValue": 1.0,
      "ciLower": -0.38,
      "ciUpper": 7.70,
      "isSignificant": false
    },
    "totalTime": {
      "meanDiff": 3.33,
      "pValue": 0.0983,
      "adjustedPValue": 1.0,
      "ciLower": -0.62,
      "ciUpper": 7.28,
      "isSignificant": false
    }
  },
  "W6B_vs_W6D": {
    "bookToAlloc": {
      "meanDiff": 1.80,
      "pValue": 0.3586,
      "adjustedPValue": 1.0,
      "ciLower": -2.04,
      "ciUpper": 5.64,
      "isSignificant": false
    },
    "allocToArr": {
      "meanDiff": 0.54,
      "pValue": 0.000127,
      "adjustedPValue": 0.0030,
      "ciLower": 0.27,
      "ciUpper": 0.82,
      "isSignificant": true
    },
    "bookToArr": {
      "meanDiff": 2.41,
      "pValue": 0.2302,
      "adjustedPValue": 1.0,
      "ciLower": -1.53,
      "ciUpper": 6.34,
      "isSignificant": false
    },
    "totalTime": {
      "meanDiff": 2.27,
      "pValue": 0.2486,
      "adjustedPValue": 1.0,
      "ciLower": -1.59,
      "ciUpper": 6.13,
      "isSignificant": false
    }
  },
  "W6C_vs_W6D": {
    "bookToAlloc": {
      "meanDiff": -1.37,
      "pValue": 0.4664,
      "adjustedPValue": 1.0,
      "ciLower": -5.06,
      "ciUpper": 2.32,
      "isSignificant": false
    },
    "allocToArr": {
      "meanDiff": 0.34,
      "pValue": 0.000212,
      "adjustedPValue": 0.0051,
      "ciLower": 0.16,
      "ciUpper": 0.51,
      "isSignificant": true
    },
    "bookToArr": {
      "meanDiff": -1.25,
      "pValue": 0.5108,
      "adjustedPValue": 1.0,
      "ciLower": -4.98,
      "ciUpper": 2.48,
      "isSignificant": false
    },
    "totalTime": {
      "meanDiff": -1.06,
      "pValue": 0.5774,
      "adjustedPValue": 1.0,
      "ciLower": -4.78,
      "ciUpper": 2.66,
      "isSignificant": false
    }
  }
};
