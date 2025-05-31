import os
import pandas as pd
import matplotlib.pyplot as plt
import matplotlib.dates as mdates
import json
import sys
import re
from glob import glob

try:
    from tqdm import tqdm
except ImportError:
    tqdm = lambda x, **kwargs: x  # fallback if tqdm not installed

TEMP_THRESHOLD = 50
STRAIN_THRESHOLD = 5000

def is_temp_col(col_name):
    return bool(re.match(r'temp\d*[_\w/]*', col_name.lower()))

def is_strain_col(col_name):
    return bool(re.match(r'strain\d*[_\w/]*', col_name.lower()))

def process_folder(folder_path):
    folder_path = os.path.abspath(folder_path)
    if not os.path.exists(folder_path):
        print(f"ERROR: Folder not found: {folder_path}", file=sys.stderr)
        return None

    csv_files = glob(os.path.join(folder_path, "*.csv"))
    if not csv_files:
        print("WARNING: No CSV files found in the folder.", file=sys.stderr)
        return None

    print(f"INFO: Found {len(csv_files)} CSV files in: {folder_path}", file=sys.stderr)
    all_alerts = []
    combined_df = pd.DataFrame()

    for file_path in tqdm(csv_files, desc="Processing CSVs"):
        print(f"INFO: Processing: {os.path.basename(file_path)}", file=sys.stderr)
        try:
            df = pd.read_csv(file_path)
        except Exception as e:
            print(f"ERROR: Failed to read {file_path}: {e}", file=sys.stderr)
            continue

        df['source_file'] = os.path.basename(file_path)

        timestamp_col = [col for col in df.columns if 'timestamp' in col.lower()]
        if not timestamp_col:
            print("WARNING: Skipped (no timestamp column)", file=sys.stderr)
            continue

        df.rename(columns={timestamp_col[0]: 'TimeStamp'}, inplace=True)
        df['TimeStamp'] = pd.to_datetime(df['TimeStamp'], errors='coerce')

        temp_cols = [col for col in df.columns if is_temp_col(col)]
        strain_cols = [col for col in df.columns if is_strain_col(col)]

        melted_temp = df[['TimeStamp'] + temp_cols].melt(id_vars='TimeStamp', var_name='Sensor', value_name='Value')
        melted_temp['Type'] = 'Temperature'

        melted_strain = df[['TimeStamp'] + strain_cols].melt(id_vars='TimeStamp', var_name='Sensor', value_name='Value')
        melted_strain['Type'] = 'Strain'

        combined = pd.concat([melted_temp, melted_strain])
        combined['File'] = os.path.basename(file_path)

        file_alerts = 0
        for _, row in combined.iterrows():
            if row['Type'] == 'Temperature' and row['Value'] > TEMP_THRESHOLD:
                all_alerts.append(f"[{row['TimeStamp']}] TEMP ALERT ({row['Sensor']}) in {row['File']}")
                file_alerts += 1
            elif row['Type'] == 'Strain' and row['Value'] > STRAIN_THRESHOLD:
                all_alerts.append(f"[{row['TimeStamp']}] STRAIN ALERT ({row['Sensor']}) in {row['File']}")
                file_alerts += 1

        print(f"SUCCESS: Alerts found in file: {file_alerts}", file=sys.stderr)
        combined_df = pd.concat([combined_df, combined])

    if combined_df.empty:
        print("WARNING: No valid data to plot.", file=sys.stderr)
        return None

    combined_df['Date'] = combined_df['TimeStamp'].dt.date

    plt.figure(figsize=(14, 6))
    sensor_types = ['Temperature', 'Strain']
    for sensor_type in sensor_types:
        subset = combined_df[combined_df['Type'] == sensor_type]
        if subset.empty:
            continue

        grouped = subset.groupby(['Date', 'Sensor'])['Value'].mean().reset_index()
        for sensor in grouped['Sensor'].unique():
            sensor_data = grouped[grouped['Sensor'] == sensor]
            plt.plot(sensor_data['Date'], sensor_data['Value'], label=f"{sensor_type}: {sensor}", alpha=0.7)

    plt.gca().xaxis.set_major_formatter(mdates.DateFormatter('%Y-%m-%d'))
    plt.gca().xaxis.set_major_locator(mdates.DayLocator())
    plt.xlabel("Date")
    plt.ylabel("Sensor Values")
    plt.title("Daily Average Temperature and Strain Readings")
    plt.legend(loc='upper right', fontsize='small', ncol=2)
    plt.grid(True)
    plt.xticks(rotation=45)
    plt.tight_layout()
    plot_path = os.path.join(folder_path, "daily_plot.png")
    plt.savefig(plot_path)
    plt.close()

    print(f"SUCCESS: Plot saved to: {plot_path}", file=sys.stderr)
    print(f"INFO: Total alerts: {len(all_alerts)}", file=sys.stderr)
    print("INFO: Sample Alerts:", file=sys.stderr)
    for alert in all_alerts[:5]:
        print(f"   {alert}", file=sys.stderr)

    return {
        "alerts": all_alerts,
        "plot_path": plot_path,
        "files_processed": len(csv_files)
    }

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python analysis.py <relative_path_to_csv_folder>", file=sys.stderr)
        sys.exit(1)

    folder = sys.argv[1]
    result = process_folder(folder)

    # Print JSON result to stdout so Node.js can parse it
    if result is not None:
        print(json.dumps(result))
    else:
        print(json.dumps({"error": "No data processed", "alerts": [], "files_processed": 0}))