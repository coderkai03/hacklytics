import yt_dlp
import json
import os
import pandas as pd
import numpy as np
from datetime import datetime
from urllib.parse import urlparse, unquote

# Create directory if it doesn't exist
os.makedirs('scraped_tiktoks', exist_ok=True)
# Create subdirectories for each category
for category in ['non-viral', 'low-viral', 'viral', 'super-viral']:
    os.makedirs(f'scraped_tiktoks/{category}', exist_ok=True)

# Read and process the CSV
df = pd.read_csv('data.csv')

# Create logarithmic bins
df['view_category'] = pd.cut(
    df['views'],
    bins=[0, 10000, 100000, 1000000, float('inf')],
    labels=['non-viral', 'low-viral', 'viral', 'super-viral'],
    include_lowest=True
)

# Initialize storage for processed URLs
processed_urls = set()

# Function to clean URL for filename
def clean_url(url):
    parsed = urlparse(unquote(url))
    return parsed.geturl().strip().replace(' ', '')

# Function to sample and download videos
def process_category(category, target_count=1500):
    successful = 0
    category_df = df[df['view_category'] == category].copy()
    
    ydl_opts = {
        'format': 'best',
        'outtmpl': f'scraped_tiktoks/{category}/%(webpage_url)s.%(ext)s',
        'ignoreerrors': True,
    }

    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        while successful < target_count and not category_df.empty:
            # Sample a random row
            sample = category_df.sample(n=1)
            url = clean_url(sample['ad_link'].iloc[0])
            views = sample['views'].iloc[0]
            
            if url in processed_urls:
                continue
                
            try:
                print(f"Downloading {category} video: {url} ({views:,} views)")
                ydl.download([url])
                successful += 1
                processed_urls.add(url)
                # Update stats immediately after successful download
                if category not in stats['downloads_per_category']:
                    stats['downloads_per_category'][category] = 0
                stats['downloads_per_category'][category] += 1
                stats['total_downloads'] += 1
            except Exception as e:
                print(f"Error downloading {url}: {e}")
            
            # Remove processed URL from category_df
            category_df = category_df[category_df['ad_link'] != sample['ad_link'].iloc[0]]
            
    return successful

# Process each category
stats = {
    'timestamp': datetime.now().isoformat(),
    'downloads_per_category': {},
    'total_downloads': 0
}

try:
    for category in ['non-viral', 'low-viral', 'viral', 'super-viral']:
        print(f"\nProcessing {category} videos...")
        process_category(category)  # Remove assignment since we're updating stats directly

except KeyboardInterrupt:
    print("\nScript interrupted by user. Saving progress...")

finally:
    # Load existing runs or create new list
    try:
        with open('download_history.json', 'r') as f:
            history = json.load(f)
    except FileNotFoundError:
        history = []

    # Add new run and save
    history.append(stats)
    with open('download_history.json', 'w') as f:
        json.dump(history, f, indent=4)

    print("\nDownload Summary:")
    for category, count in stats['downloads_per_category'].items():
        print(f"{category}: {count} videos")
    print(f"Total downloads: {stats['total_downloads']}")