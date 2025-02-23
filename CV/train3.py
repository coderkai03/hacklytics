# %%
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.preprocessing import StandardScaler, PowerTransformer
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from xgboost import XGBRegressor
from lightgbm import LGBMRegressor
from sklearn.metrics import mean_squared_error, r2_score, mean_absolute_percentage_error
import joblib
import json
import time
import matplotlib.pyplot as plt
import seaborn as sns
import os

def parse_json_column(json_str):
    """Parse JSON string, handling None values and invalid JSON."""
    if pd.isna(json_str) or json_str is None:
        return {}
    
    try:
        if isinstance(json_str, dict):
            return json_str
            
        if isinstance(json_str, str):
            if not json_str.strip():
                return {}
            return json.loads(json_str.replace("'", "\""))
            
        return {}
    except Exception as e:
        print(f"Failed to parse: {type(json_str)} - {str(json_str)[:100]}...")
        print(f"Error: {str(e)}")
        return {}

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

def expand_features(df):
    """Extract features from JSON columns with debug info."""
    df = df.copy()
    
    # Parse JSON columns
    df['social_media_content'] = df['social_media_content'].apply(parse_json_column)
    df['audio_features'] = df['audio_features'].apply(parse_json_column)
    
    # Extract and engineer features
    # Video engagement features
    df['total_faces'] = df['social_media_content'].apply(lambda x: safe_get(x, 'total_faces', default=0))
    df['text_frames'] = df['social_media_content'].apply(lambda x: safe_get(x, 'text_frames', default=0))
    df['screen_recording_frames'] = df['social_media_content'].apply(lambda x: safe_get(x, 'screen_recording_frames', default=0))
    df['avg_faces_per_frame'] = df['social_media_content'].apply(lambda x: safe_get(x, 'avg_faces_per_frame', default=0))
    df['text_percentage'] = df['social_media_content'].apply(lambda x: safe_get(x, 'text_percentage', default=0))
    df['screen_recording_percentage'] = df['social_media_content'].apply(lambda x: safe_get(x, 'screen_recording_percentage', default=0))
    
    # Audio quality features
    df['volume_level'] = df['audio_features'].apply(lambda x: safe_get(x, 'quality_metrics', 'volume_level', default=0))
    df['volume_consistency'] = df['audio_features'].apply(lambda x: safe_get(x, 'quality_metrics', 'volume_consistency', default=0))
    df['high_frequency_content'] = df['audio_features'].apply(lambda x: safe_get(x, 'quality_metrics', 'high_frequency_content', default=0))
    df['frequency_variation'] = df['audio_features'].apply(lambda x: safe_get(x, 'quality_metrics', 'frequency_variation', default=0))
    df['dynamic_range'] = df['audio_features'].apply(lambda x: safe_get(x, 'dynamic_analysis', 'dynamic_range', default=0))
    df['peak_volume'] = df['audio_features'].apply(lambda x: safe_get(x, 'dynamic_analysis', 'peak_volume', default=0))
    df['median_volume'] = df['audio_features'].apply(lambda x: safe_get(x, 'dynamic_analysis', 'median_volume', default=0))
    df['noise_floor'] = df['audio_features'].apply(lambda x: safe_get(x, 'dynamic_analysis', 'noise_floor', default=0))
    
    # Feature engineering
    df['face_to_duration_ratio'] = df['total_faces'] / df['duration']
    df['text_density'] = df['text_frames'] / df['duration']
    df['audio_quality_score'] = (df['volume_consistency'] + df['high_frequency_content']) / 2
    
    # Drop original JSON columns
    df = df.drop(['social_media_content', 'audio_features'], axis=1)
    
    return df

# %%
# Load and preprocess data
cv_data = pd.read_csv('results/tiktok_content_analysis.csv')
viral_data = pd.read_csv('Viral Hooks Full Data Set.csv')

# Clean video filenames
cv_data['video_filename'] = cv_data['video_filename'].str.replace('：', ':').str.replace('⧸', '/').str.replace('.mp4', '')

# Expand features
cv_data = expand_features(cv_data)

# Merge datasets
full_data = pd.merge(
    cv_data,
    viral_data[['ad_link', 'views', 'length']],
    left_on='video_filename',
    right_on='ad_link',
    how='inner'
).drop(columns=['ad_link'])

print("Final dataset shape:", full_data.shape)

# %%
# Feature selection and engineering
feature_columns = [
    'duration', 'total_faces', 'text_frames', 'screen_recording_frames',
    'avg_faces_per_frame', 'text_percentage', 'screen_recording_percentage',
    'volume_level', 'volume_consistency', 'high_frequency_content',
    'frequency_variation', 'dynamic_range', 'peak_volume', 'median_volume',
    'noise_floor', 'length', 'face_to_duration_ratio', 'text_density',
    'audio_quality_score'
]

# %%
# Analyze target variable distribution
plt.figure(figsize=(10, 6))
sns.histplot(data=full_data, x='views', bins=50)
plt.title('Distribution of Video Views')
plt.yscale('log')
plt.show()

# Log transform views for better modeling
full_data['log_views'] = np.log1p(full_data['views'])

plt.figure(figsize=(10, 6))
sns.histplot(data=full_data, x='log_views', bins=50)
plt.title('Distribution of Log-Transformed Views')
plt.show()

# %%
# Analyze feature correlations
correlation_matrix = full_data[feature_columns].corr()
plt.figure(figsize=(12, 8))
sns.heatmap(correlation_matrix, annot=True, cmap='coolwarm', center=0)
plt.title('Feature Correlation Matrix')
plt.tight_layout()
plt.show()

# %%
# Split data
X = full_data[feature_columns]
y = full_data['log_views']  # Use log-transformed views

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

print("Training set shape:", X_train.shape)
print("Test set shape:", X_test.shape)

# %%
# Create preprocessing pipeline
preprocessor = ColumnTransformer(
    transformers=[
        ('num', PowerTransformer(method='yeo-johnson'), feature_columns)
    ])

# Define models to try
models = {
    'XGBoost': XGBRegressor(
        n_estimators=1000,
        learning_rate=0.01,
        max_depth=6,
        subsample=0.8,
        colsample_bytree=0.8,
        random_state=42
    ),
    'LightGBM': LGBMRegressor(
        n_estimators=1000,
        learning_rate=0.01,
        max_depth=6,
        subsample=0.8,
        colsample_bytree=0.8,
        random_state=42
    ),
    'RandomForest': RandomForestRegressor(
        n_estimators=1000,
        max_depth=10,
        min_samples_split=5,
        random_state=42
    )
}

# Train and evaluate models
results = {}
for name, model in models.items():
    print(f"\nTraining {name}...")
    pipeline = Pipeline([
        ('preprocessor', preprocessor),
        ('regressor', model)
    ])
    
    # Train
    start_time = time.time()
    pipeline.fit(X_train, y_train)
    train_time = time.time() - start_time
    
    # Predict
    y_pred = pipeline.predict(X_test)
    
    # Transform back to original scale
    y_test_orig = np.expm1(y_test)
    y_pred_orig = np.expm1(y_pred)
    
    # Calculate metrics
    rmse = np.sqrt(mean_squared_error(y_test_orig, y_pred_orig))
    r2 = r2_score(y_test_orig, y_pred_orig)
    mape = mean_absolute_percentage_error(y_test_orig, y_pred_orig)
    
    results[name] = {
        'rmse': rmse,
        'r2': r2,
        'mape': mape,
        'train_time': train_time,
        'pipeline': pipeline
    }
    
    print(f"{name} Results:")
    print(f"RMSE: {rmse:,.2f}")
    print(f"R²: {r2:.3f}")
    print(f"MAPE: {mape:.3f}")
    print(f"Training time: {train_time:.1f}s")

# %%
# Plot feature importance for best model
best_model_name = max(results.items(), key=lambda x: x[1]['r2'])[0]
best_pipeline = results[best_model_name]['pipeline']
best_model = best_pipeline.named_steps['regressor']

if hasattr(best_model, 'feature_importances_'):
    importance = pd.DataFrame({
        'feature': feature_columns,
        'importance': best_model.feature_importances_
    }).sort_values('importance', ascending=False)

    plt.figure(figsize=(10,6))
    plt.barh(importance['feature'], importance['importance'])
    plt.gca().invert_yaxis()
    plt.title(f'Feature Importance ({best_model_name})')
    plt.tight_layout()
    plt.show()

    print(f"\nTop 10 most important features ({best_model_name}):")
    print(importance.head(10))

# Create models directory if it doesn't exist
os.makedirs('models', exist_ok=True)

# Save best model
joblib.dump(best_pipeline, 'models/best_view_predictor.pkl')
print(f"\nBest model ({best_model_name}) saved to models/best_view_predictor.pkl")



# %%
