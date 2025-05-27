import os, sys, json
import pandas as pd

folder = "../../../Task1/ConvertedCSVs"
alerts = []

for filename in os.listdir(folder):
    if filename.endswith('.csv'):
        df = pd.read_csv(os.path.join(folder, filename))
        print("Printing the Columns")
        print(df.columns)
        temp_cols = [col for col in df.columns if 'temp' in col.lower()]
        print("temp_cols-")
        print(temp_cols)
        for col in df.columns:
            if 'temp' in col.lower():
                print("Printing the TEMP COlumn Values")
                print(df['col'].dtype)
                print(df['col'].head())
                print("Done")
                if (df[col] > 50).any():
                    # alerts.append(f"{col} exceeds 50°C in {filename}")
                    
                    print(f"{col} exceeds 50°C in {filename}")
            elif 'strain' in col.lower():
                if (df[col] > 5000).any():
                    # alerts.append(f"{col} exceeds 5000 in {filename}")
                    print(f"{col} exceeds 5000 in {filename}")

print(json.dumps({"alerts": alerts}))
