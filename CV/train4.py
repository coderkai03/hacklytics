# %%
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.preprocessing import StandardScaler, PowerTransformer, QuantileTransformer
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.ensemble import StackingRegressor, RandomForestRegressor
from sklearn.linear_model import HuberRegressor, QuantileRegressor
from xgboost import XGBRegressor
from lightgbm import LGBMRegressor
from sklearn.metrics import mean_squared_error, r2_score, mean_absolute_percentage_error
from sklearn.feature_selection import SelectFromModel
import joblib
import json
import time
import matplotlib.pyplot as plt
import seaborn as sns
import os

# Keep the same parsing functions
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
    """Extract and engineer features from JSON columns."""
    df = df.copy()
    
    # Parse JSON columns
    df['social_media_content'] = df['social_media_content'].apply(parse_json_column)
    df['audio_features'] = df['audio_features'].apply(parse_json_column)
    
    # Basic features
    df['total_faces'] = df['social_media_content'].apply(lambda x: safe_get(x, 'total_faces', default=0))
    df['text_frames'] = df['social_media_content'].apply(lambda x: safe_get(x, 'text_frames', default=0))
    df['screen_recording_frames'] = df['social_media_content'].apply(lambda x: safe_get(x, 'screen_recording_frames', default=0))
    df['avg_faces_per_frame'] = df['social_media_content'].apply(lambda x: safe_get(x, 'avg_faces_per_frame', default=0))
    df['text_percentage'] = df['social_media_content'].apply(lambda x: safe_get(x, 'text_percentage', default=0))
    df['screen_recording_percentage'] = df['social_media_content'].apply(lambda x: safe_get(x, 'screen_recording_percentage', default=0))
    
    # Audio features
    df['volume_level'] = df['audio_features'].apply(lambda x: safe_get(x, 'quality_metrics', 'volume_level', default=0))
    df['volume_consistency'] = df['audio_features'].apply(lambda x: safe_get(x, 'quality_metrics', 'volume_consistency', default=0))
    df['high_frequency_content'] = df['audio_features'].apply(lambda x: safe_get(x, 'quality_metrics', 'high_frequency_content', default=0))
    df['frequency_variation'] = df['audio_features'].apply(lambda x: safe_get(x, 'quality_metrics', 'frequency_variation', default=0))
    df['dynamic_range'] = df['audio_features'].apply(lambda x: safe_get(x, 'dynamic_analysis', 'dynamic_range', default=0))
    df['peak_volume'] = df['audio_features'].apply(lambda x: safe_get(x, 'dynamic_analysis', 'peak_volume', default=0))
    df['median_volume'] = df['audio_features'].apply(lambda x: safe_get(x, 'dynamic_analysis', 'median_volume', default=0))
    df['noise_floor'] = df['audio_features'].apply(lambda x: safe_get(x, 'dynamic_analysis', 'noise_floor', default=0))
    
    # Advanced feature engineering
    # Content density features
    df['face_to_duration_ratio'] = df['total_faces'] / np.maximum(df['duration'], 1)
    df['text_density'] = df['text_frames'] / np.maximum(df['duration'], 1)
    df['screen_recording_density'] = df['screen_recording_frames'] / np.maximum(df['duration'], 1)
    
    # Audio quality features
    df['audio_quality_score'] = (df['volume_consistency'] + df['high_frequency_content']) / 2
    df['audio_dynamics_score'] = (df['dynamic_range'] + df['volume_level']) / 2
    df['audio_clarity_score'] = (df['peak_volume'] - df['noise_floor']) / np.maximum(df['peak_volume'], 0.001)
    
    # Engagement potential features
    df['face_text_ratio'] = df['total_faces'] / np.maximum(df['text_frames'], 1)
    df['content_density'] = (df['text_frames'] + df['screen_recording_frames']) / np.maximum(df['duration'], 1)
    df['engagement_score'] = (df['face_to_duration_ratio'] + df['text_density'] + df['audio_quality_score']) / 3
    
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
# Define all potential features
feature_columns = [
    # Basic features
    'duration', 'length', 'total_faces', 'text_frames', 'screen_recording_frames',
    'avg_faces_per_frame', 'text_percentage', 'screen_recording_percentage',
    
    # Audio features
    'volume_level', 'volume_consistency', 'high_frequency_content',
    'frequency_variation', 'dynamic_range', 'peak_volume', 'median_volume',
    'noise_floor',
    
    # Engineered features
    'face_to_duration_ratio', 'text_density', 'screen_recording_density',
    'audio_quality_score', 'audio_dynamics_score', 'audio_clarity_score',
    'face_text_ratio', 'content_density', 'engagement_score'
]

# %%
# Analyze and transform target variable
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
# Analyze feature correlations and remove highly correlated features
correlation_matrix = full_data[feature_columns].corr()
plt.figure(figsize=(15, 10))
sns.heatmap(correlation_matrix, annot=True, cmap='coolwarm', center=0, fmt='.2f')
plt.title('Feature Correlation Matrix')
plt.tight_layout()
plt.show()

# Remove highly correlated features
def remove_correlated_features(correlation_matrix, threshold=0.85):
    features_to_drop = set()
    for i in range(len(correlation_matrix.columns)):
        for j in range(i+1, len(correlation_matrix.columns)):
            if abs(correlation_matrix.iloc[i, j]) > threshold:
                feature1, feature2 = correlation_matrix.columns[i], correlation_matrix.columns[j]
                # Keep the one with higher correlation with target
                if abs(full_data[feature1].corr(full_data['log_views'])) < abs(full_data[feature2].corr(full_data['log_views'])):
                    features_to_drop.add(feature1)
                else:
                    features_to_drop.add(feature2)
    
    return [f for f in feature_columns if f not in features_to_drop]

# Get filtered features
filtered_features = remove_correlated_features(correlation_matrix)
print("\nSelected features after correlation analysis:")
print(filtered_features)

# %%
# Split data
X = full_data[filtered_features]
y = full_data['log_views']

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# %%
# Create preprocessing pipeline with feature selection
preprocessor = ColumnTransformer(
    transformers=[
        ('num', QuantileTransformer(output_distribution='normal'), filtered_features)
    ])

# Define base models with tuned parameters
base_models = [
    ('rf', RandomForestRegressor(
        n_estimators=500,
        max_depth=8,
        min_samples_split=5,
        random_state=42
    )),
    ('xgb', XGBRegressor(
        n_estimators=500,
        learning_rate=0.01,
        max_depth=6,
        subsample=0.8,
        colsample_bytree=0.8,
        random_state=42
    )),
    ('lgb', LGBMRegressor(
        n_estimators=500,
        learning_rate=0.01,
        max_depth=6,
        subsample=0.8,
        colsample_bytree=0.8,
        random_state=42
    )),
    ('huber', HuberRegressor(
        epsilon=1.35,
        max_iter=200
    ))
]

# Create stacking model
final_estimator = QuantileRegressor(quantile=0.5, solver='highs')
stacking_regressor = StackingRegressor(
    estimators=base_models,
    final_estimator=final_estimator,
    cv=5,
    n_jobs=-1
)

# Create final pipeline
pipeline = Pipeline([
    ('preprocessor', preprocessor),
    ('regressor', stacking_regressor)
])

# Train model
print("Training stacking model...")
start_time = time.time()
pipeline.fit(X_train, y_train)
train_time = time.time() - start_time
print(f"Training time: {train_time:.1f}s")

# Evaluate model
y_pred = pipeline.predict(X_test)

# Transform back to original scale
y_test_orig = np.expm1(y_test)
y_pred_orig = np.expm1(y_pred)

# Calculate metrics
rmse = np.sqrt(mean_squared_error(y_test_orig, y_pred_orig))
r2 = r2_score(y_test_orig, y_pred_orig)
mape = mean_absolute_percentage_error(y_test_orig, y_pred_orig)

print("\nModel Results:")
print(f"RMSE: {rmse:,.2f}")
print(f"R²: {r2:.3f}")
print(f"MAPE: {mape:.3f}")

# %%
# Analyze predictions
plt.figure(figsize=(10, 6))
plt.scatter(y_test_orig, y_pred_orig, alpha=0.5)
plt.plot([y_test_orig.min(), y_test_orig.max()], [y_test_orig.min(), y_test_orig.max()], 'r--', lw=2)
plt.xlabel('Actual Views')
plt.ylabel('Predicted Views')
plt.title('Actual vs Predicted Views')
plt.xscale('log')
plt.yscale('log')
plt.tight_layout()
plt.show()

# Plot residuals
residuals = y_pred_orig - y_test_orig
plt.figure(figsize=(10, 6))
plt.scatter(y_pred_orig, residuals, alpha=0.5)
plt.axhline(y=0, color='r', linestyle='--')
plt.xlabel('Predicted Views')
plt.ylabel('Residuals')
plt.title('Residual Plot')
plt.xscale('log')
plt.tight_layout()
plt.show()

# Create models directory if it doesn't exist
os.makedirs('models', exist_ok=True)

# Save model
joblib.dump(pipeline, 'models/stacking_view_predictor.pkl')
print("\nModel saved to models/stacking_view_predictor.pkl")

# %%
# Test saved model
print("Testing saved model...")
# Load the model
loaded_model = joblib.load('models/stacking_view_predictor.pkl')

# Get a sample row from our dataset
sample_data = X.iloc[0:3]  # Get first 3 rows for testing
print("\nSample input features:")
for idx, row in sample_data.iterrows():
    print(f"\nSample {idx + 1}:")
    for feature, value in row.items():
        print(f"{feature}: {value:.3f}")

# Make predictions
sample_predictions = loaded_model.predict(sample_data)
sample_predictions_orig = np.expm1(sample_predictions)

# Get actual values
actual_views = np.expm1(y.iloc[0:3])

# Compare predictions with actual values
print("\nPredictions vs Actual:")
for i, (pred, actual) in enumerate(zip(sample_predictions_orig, actual_views)):
    print(f"\nSample {i + 1}:")
    print(f"Predicted views: {pred:,.0f}")
    print(f"Actual views: {actual:,.0f}")
    print(f"Difference: {((pred - actual) / actual * 100):,.1f}%") 

