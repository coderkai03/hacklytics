# %%
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.metrics import mean_squared_error, r2_score
import joblib
import json
import time
import matplotlib.pyplot as plt

def parse_json_column(json_str):
    """Parse JSON string, handling None values and invalid JSON."""
    if pd.isna(json_str) or json_str is None:
        return {}
    
    try:
        # If it's already a dict, return it
        if isinstance(json_str, dict):
            return json_str
            
        # If it's a string, try to parse it
        if isinstance(json_str, str):
            # Handle empty strings
            if not json_str.strip():
                return {}
            return json.loads(json_str.replace("'", "\""))
            
        return {}
    except Exception as e:
        print(f"Failed to parse: {type(json_str)} - {str(json_str)[:100]}...")
        print(f"Error: {str(e)}")
        return {}

def expand_features(df):
    """Extract features from JSON columns with debug info."""
    # Create a copy to avoid modifying original
    df = df.copy()
    
    # Debug info before parsing
    print("\nBefore parsing:")
    print("Null values in social_media_content:", df['social_media_content'].isnull().sum())
    print("Null values in audio_features:", df['audio_features'].isnull().sum())
    
    # Sample of raw data
    print("\nSample of raw social_media_content:")
    print(df['social_media_content'].iloc[0])
    print("\nSample of raw audio_features:")
    print(df['audio_features'].iloc[0])
    
    # Parse JSON columns - handle both string and dict inputs
    df['social_media_content'] = df['social_media_content'].apply(parse_json_column)
    df['audio_features'] = df['audio_features'].apply(parse_json_column)
    
    # Debug info after parsing
    print("\nAfter parsing:")
    print("Empty dicts in social_media_content:", df['social_media_content'].apply(lambda x: x == {}).sum())
    print("Empty dicts in audio_features:", df['audio_features'].apply(lambda x: x == {}).sum())
    
    # Safe get function to handle None values
    def safe_get(d, *keys, default=0):
        """Safely get nested dictionary values."""
        if d is None:
            return default
        
        current = d
        for key in keys:
            if not isinstance(current, dict):
                return default
            current = current.get(key, {})
        return current if current != {} else default
    
    # Extract social media features
    df['total_faces'] = df['social_media_content'].apply(lambda x: safe_get(x, 'total_faces', default=0))
    df['text_frames'] = df['social_media_content'].apply(lambda x: safe_get(x, 'text_frames', default=0))
    df['screen_recording_frames'] = df['social_media_content'].apply(lambda x: safe_get(x, 'screen_recording_frames', default=0))
    df['avg_faces_per_frame'] = df['social_media_content'].apply(lambda x: safe_get(x, 'avg_faces_per_frame', default=0))
    df['text_percentage'] = df['social_media_content'].apply(lambda x: safe_get(x, 'text_percentage', default=0))
    df['screen_recording_percentage'] = df['social_media_content'].apply(lambda x: safe_get(x, 'screen_recording_percentage', default=0))
    
    # Extract audio features
    df['volume_level'] = df['audio_features'].apply(lambda x: safe_get(x, 'quality_metrics', 'volume_level', default=0))
    df['volume_consistency'] = df['audio_features'].apply(lambda x: safe_get(x, 'quality_metrics', 'volume_consistency', default=0))
    df['high_frequency_content'] = df['audio_features'].apply(lambda x: safe_get(x, 'quality_metrics', 'high_frequency_content', default=0))
    df['frequency_variation'] = df['audio_features'].apply(lambda x: safe_get(x, 'quality_metrics', 'frequency_variation', default=0))
    df['dynamic_range'] = df['audio_features'].apply(lambda x: safe_get(x, 'dynamic_analysis', 'dynamic_range', default=0))
    df['peak_volume'] = df['audio_features'].apply(lambda x: safe_get(x, 'dynamic_analysis', 'peak_volume', default=0))
    df['median_volume'] = df['audio_features'].apply(lambda x: safe_get(x, 'dynamic_analysis', 'median_volume', default=0))
    df['noise_floor'] = df['audio_features'].apply(lambda x: safe_get(x, 'dynamic_analysis', 'noise_floor', default=0))
    
    # Drop original JSON columns
    df = df.drop(['social_media_content', 'audio_features'], axis=1)
    
    return df

# %%
# Load and clean data
cv_data = pd.read_csv('results/tiktok_content_analysis.csv')
viral_data = pd.read_csv('Viral Hooks Full Data Set.csv')

print("Initial shapes:")
print("CV Data:", cv_data.shape)
print("Viral Data:", viral_data.shape)

# Show sample of raw data
print("\nSample of raw data:")
print(cv_data[['video_filename', 'social_media_content', 'audio_features']].head(2))

# %%
# Clean video filenames and expand features
cv_data['video_filename'] = cv_data['video_filename'].str.replace('：', ':').str.replace('⧸', '/').str.replace('.mp4', '')

# Expand features with debug info
cv_data = expand_features(cv_data)
print("\nExpanded CV data shape:", cv_data.shape)
cv_data.head(2)

# %%
# Merge datasets
full_data = pd.merge(
    cv_data,
    viral_data[['ad_link', 'views', 'length']],
    left_on='video_filename',
    right_on='ad_link',
    how='inner'
).drop(columns=['ad_link'])

print("\nMerged Data Shape:", full_data.shape)
full_data.head(2)

# %%
# Prepare features for training
feature_columns = [
    'duration', 'total_faces', 'text_frames', 'screen_recording_frames',
    'avg_faces_per_frame', 'text_percentage', 'screen_recording_percentage',
    'volume_level', 'volume_consistency', 'high_frequency_content',
    'frequency_variation', 'dynamic_range', 'peak_volume', 'median_volume',
    'noise_floor', 'length'
]

X = full_data[feature_columns]
y = full_data['views']

# Train/test split
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

print("Training set shape:", X_train.shape)
print("Test set shape:", X_test.shape)

# %%
# Scale features
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# %%
# Train model
model = GradientBoostingRegressor(
    n_estimators=1000,
    learning_rate=0.01,
    max_depth=5,
    subsample=0.8,
    random_state=42
)

start_time = time.time()
model.fit(X_train_scaled, y_train)
print(f"Training time: {time.time()-start_time:.1f}s")

# %%
# Evaluate model
predictions = model.predict(X_test_scaled)
rmse = np.sqrt(mean_squared_error(y_test, predictions))
r2 = r2_score(y_test, predictions)

print(f"RMSE: {rmse:,.2f}")
print(f"R²: {r2:.3f}")

# %%
# Save model and scaler
joblib.dump(model, 'models/view_predictor.pkl')
joblib.dump(scaler, 'models/scaler.pkl')
print("Model and scaler saved to models/")

# %%
# Plot feature importance
importance = pd.DataFrame({
    'feature': feature_columns,
    'importance': model.feature_importances_
}).sort_values('importance', ascending=False)

plt.figure(figsize=(10,6))
plt.barh(importance['feature'], importance['importance'])
plt.gca().invert_yaxis()
plt.title('Feature Importance')
plt.tight_layout()
plt.show()

print("\nTop 5 most important features:")
print(importance.head())


