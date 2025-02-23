from video_analysis import main as analyze_videos
from results_analysis.generate_report import generate_performance_report
import os
import pandas as pd
import json
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error, r2_score

def main():
    # Ensure directories exist
    os.makedirs("results", exist_ok=True)
    os.makedirs("results/enhanced_analysis", exist_ok=True)
    
    # Run original analysis
    analyze_videos()
    
    # Generate enhanced results
    try:
        generate_performance_report(
            results_dir="results",
            output_dir="results/enhanced_analysis"
        )
    except Exception as e:
        print(f"Warning: Report generation failed - {str(e)}")
        print("Video analysis completed but report generation failed.")

    # Load datasets
    cv_data = pd.read_csv('results/tiktok_content_analysis.csv')
    viral_data = pd.read_csv('Viral Hooks Full Data Set.csv')

    # Clean URLs in CV data
    cv_data['video_filename'] = cv_data['video_filename'].str.replace('⧸', '/')

    # Parse JSON columns
    def parse_social_media_content(json_str):
        data = json.loads(json_str)
        return {
            'total_faces': data['total_faces'],
            'text_frames': data['text_frames'],
            'screen_recording_frames': data['screen_recording_frames'],
            'avg_faces_per_frame': data['avg_faces_per_frame'],
            'text_percentage': data['text_percentage'],
            'screen_recording_percentage': data['screen_recording_percentage']
        }

    def parse_audio_features(json_str):
        data = json.loads(json_str)
        metrics = data['quality_metrics']
        dynamic = data['dynamic_analysis']
        return {
            'volume_level': metrics['volume_level'],
            'volume_consistency': metrics['volume_consistency'],
            'high_frequency_content': metrics['high_frequency_content'],
            'frequency_variation': metrics['frequency_variation'],
            'dynamic_range': dynamic['dynamic_range'],
            'peak_volume': dynamic['peak_volume'],
            'median_volume': dynamic['median_volume'],
            'noise_floor': dynamic['noise_floor']
        }

    # Extract features
    cv_features = pd.DataFrame(cv_data['social_media_content'].apply(parse_social_media_content).tolist())
    audio_features = pd.DataFrame(cv_data['audio_features'].apply(parse_audio_features).tolist())

    # Combine all features
    cv_data = pd.concat([cv_data[['video_filename', 'duration']], cv_features, audio_features], axis=1)

    # Join datasets
    merged_data = pd.merge(
        cv_data,
        viral_data,
        left_on='video_filename',
        right_on='ad_link',
        how='inner'
    )

    # Prepare features for ML
    feature_columns = [
        'duration', 'total_faces', 'text_frames', 'screen_recording_frames',
        'avg_faces_per_frame', 'text_percentage', 'screen_recording_percentage',
        'volume_level', 'volume_consistency', 'high_frequency_content',
        'frequency_variation', 'dynamic_range', 'peak_volume', 'median_volume',
        'noise_floor', 'length'
    ]

    X = merged_data[feature_columns]
    y = merged_data['views']

    # Split data
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # Scale features
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)

    # Train model
    model = RandomForestRegressor(n_estimators=100, random_state=42)
    model.fit(X_train_scaled, y_train)

    # Print feature importance
    feature_importance = pd.DataFrame({
        'feature': feature_columns,
        'importance': model.feature_importances_
    }).sort_values('importance', ascending=False)

    print("\nFeature Importance:")
    print(feature_importance)

    # Save results
    merged_data.to_csv('results/merged_dataset.csv', index=False)
    feature_importance.to_csv('results/feature_importance.csv', index=False)

def clean_urls():
    # Read the CSV
    df = pd.read_csv('results/tiktok_content_analysis.csv')
    
    # Clean URLs by replacing ⧸ with /
    df['video_filename'] = df['video_filename'].str.replace('⧸', '/')
    
    # Save back to CSV
    df.to_csv('results/tiktok_content_analysis.csv', index=False)

def train_model():
    # Load datasets
    cv_data = pd.read_csv('results/tiktok_content_analysis.csv')
    viral_data = pd.read_csv('Viral Hooks Full Data Set.csv')
    
    print("Number of videos in CV analysis:", len(cv_data))
    print("Number of videos in Viral dataset:", len(viral_data))
    
    # Join datasets
    merged_data = pd.merge(
        cv_data,
        viral_data,
        left_on='video_filename',
        right_on='ad_link',
        how='inner'
    )
    
    print("Number of matched videos:", len(merged_data))
    
    # Parse JSON columns
    def parse_social_media_content(json_str):
        data = json.loads(json_str)
        return pd.Series({
            'total_faces': data['total_faces'],
            'text_frames': data['text_frames'],
            'screen_recording_frames': data['screen_recording_frames'],
            'avg_faces_per_frame': data['avg_faces_per_frame'],
            'text_percentage': data['text_percentage'],
            'screen_recording_percentage': data['screen_recording_percentage']
        })

    def parse_audio_features(json_str):
        data = json.loads(json_str)
        metrics = data['quality_metrics']
        dynamic = data['dynamic_analysis']
        return pd.Series({
            'volume_level': metrics['volume_level'],
            'volume_consistency': metrics['volume_consistency'],
            'high_frequency_content': metrics['high_frequency_content'],
            'frequency_variation': metrics['frequency_variation'],
            'dynamic_range': dynamic['dynamic_range'],
            'peak_volume': dynamic['peak_volume'],
            'median_volume': dynamic['median_volume'],
            'noise_floor': dynamic['noise_floor']
        })

    # Extract features
    cv_features = pd.DataFrame(merged_data['social_media_content'].apply(parse_social_media_content))
    audio_features = pd.DataFrame(merged_data['audio_features'].apply(parse_audio_features))
    
    # Combine features
    X = pd.concat([
        merged_data[['duration', 'length']],
        cv_features,
        audio_features
    ], axis=1)
    
    y = merged_data['views']
    
    print("\nFeature set shape:", X.shape)
    print("Number of samples with views:", len(y))
    
    # Log transform views (since it's usually right-skewed)
    y = np.log1p(y)
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Scale features
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    # Train model
    model = RandomForestRegressor(
        n_estimators=100,
        max_depth=None,
        min_samples_split=2,
        min_samples_leaf=1,
        random_state=42
    )
    model.fit(X_train_scaled, y_train)
    
    # Evaluate
    y_pred = model.predict(X_test_scaled)
    mse = mean_squared_error(y_test, y_pred)
    r2 = r2_score(y_test, y_pred)
    
    print(f"\nModel Performance:")
    print(f"MSE (log scale): {mse:.4f}")
    print(f"R2 Score: {r2:.4f}")
    
    # Feature importance
    feature_importance = pd.DataFrame({
        'feature': X.columns,
        'importance': model.feature_importances_
    }).sort_values('importance', ascending=False)
    
    print("\nTop 10 Most Important Features:")
    print(feature_importance.head(10))
    
    # Save results
    feature_importance.to_csv('results/feature_importance.csv', index=False)
    merged_data.to_csv('results/merged_dataset.csv', index=False)
    
    return model, scaler

if __name__ == "__main__":
    model, scaler = train_model() 