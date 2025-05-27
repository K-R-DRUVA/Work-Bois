import pandas as pd

# Load your DataFrame (replace 'your_file.csv' with your actual file)
df = pd.read_csv('../../../Task1/ConvertedCSVs/Strain_project_channel1_NC_Channel4_Win_20250502155637.csv')

# Print all columns
print("Printing the Columns")
print(df.columns)

# Find all temperature-related columns (case-insensitive)
temp_cols = [col for col in df.columns if 'temp' in col.lower()]
print("temp_cols-")
print(temp_cols)

# Print data types of all temperature columns
print("\nPrinting the TEMP Columns' Data Types:")
for col in temp_cols:
    print(f"{col}: {df[col].dtype}")

# Optionally, print first few values of each temp column
print("\nPrinting first 5 values of each TEMP column:")
for col in temp_cols:
    print(f"\n{col} values:")
    print(df[col].head())
