import pandas as pd

# Read the CSV file
df = pd.read_csv('data.csv')

# Define function to categorize virality
def categorize_virality(views):
    if views < 10000:  # Less than 10K
        return 'Non-viral'
    elif views < 100000:  # 10K to 100K
        return 'Low-viral'
    elif views < 1000000:  # 100K to 1M
        return 'Viral'
    else:  # 1M+
        return 'Super-viral'

# Add new virality column
df['virality'] = df['views'].apply(categorize_virality)

# Save the updated dataframe to the same CSV file
df.to_csv('data.csv', index=False)

print("Virality categories have been added successfully!") 