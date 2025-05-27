# Internship Project

## Tech Stack

### Backend
- Node.js
- Express
- Python

### Frontend
- React.js
- Bootstrap
- TypeScript

## Backend Features

### Data Processing
- Parse structured CSV data
- Extract temperature and strain measurements

### Analysis
- Real-time plotting and monitoring
- Threshold-based tracking

### Alerting System
- Rule-based alert generation:
  - One: Temperature exceeds 50°C → **[TEMP ALERT]**
  - Two: Strain exceeds 5000 → **[STRAIN ALERT]**
  - Three: Temperature exceeds 50°C and strain exceeds 5000 → **[TEMP AND STRAIN ALERT]**
- Automated notification system

## Workflow

```
📦 Folder of CSVs
   |
🟢 Node.js API
   ├── Accepts upload / folder path
   ├── Spawns Python child process (using `child_process`)
   └── Returns alerts, plots, and parsed data
        |
🐍 Python Script
   ├── Parses CSVs
   ├── Applies thresholds
   ├── Generates plots or alerts
   └── Sends result as JSON or image path
```
        