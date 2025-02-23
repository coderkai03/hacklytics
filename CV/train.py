import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.metrics import mean_squared_error, r2_score
import joblib
import json
import time

def load_and_preprocess_data():
    # Load datasets
    cv_data = pd.read_csv('results/tiktok_content_analysis.csv')
    viral_data = pd.read_csv('Viral Hooks Full Data Set.csv')

    # Clean URLs in CV data
    cv_data['video_filename'] = cv_data['video_filename'].str.replace('⧸', '/')

    # Parse JSON columns
    def parse_json_column(json_str):
        if pd.isna(json_str):
            return {}
        try:
            return json.loads(json_str.replace("'", "\""))
        except:
            return {}

    # Extract nested features from JSON columns
    cv_data['social_media_content'] = cv_data['social_media_content'].apply(parse_json_column)
    cv_data['audio_features'] = cv_data['audio_features'].apply(parse_json_column)

    # Create feature columns
    cv_features = pd.DataFrame({
        'duration': cv_data['duration'],
        'total_faces': cv_data['social_media_content'].apply(lambda x: x.get('total_faces', 0)),
        'text_frames': cv_data['social_media_content'].apply(lambda x: x.get('text_frames', 0)),
        'avg_faces': cv_data['social_media_content'].apply(lambda x: x.get('avg_faces_per_frame', 0)),
        'text_percent': cv_data['social_media_content'].apply(lambda x: x.get('text_percentage', 0)),
        'volume_level': cv_data['audio_features'].apply(lambda x: x.get('quality_metrics', {}).get('volume_level', 0)),
        'dynamic_range': cv_data['audio_features'].apply(lambda x: x.get('dynamic_analysis', {}).get('dynamic_range', 0)),
        'peak_volume': cv_data['audio_features'].apply(lambda x: x.get('dynamic_analysis', {}).get('peak_volume', 0))
    })

    # Merge with viral data
    full_data = pd.merge(
        cv_features,
        viral_data[['ad_link', 'views', 'length']],
        left_on='video_filename',
        right_on='ad_link',
        how='inner'
    )

    # Final feature selection
    features = [
        'duration', 'total_faces', 'text_frames', 'avg_faces',
        'text_percent', 'volume_level', 'dynamic_range', 'peak_volume',
        'length'
    ]
    
    return full_data[features], full_data['views']

def train_model():
    start_time = time.time()
    
    X, y = load_and_preprocess_data()
    print(f"Data loaded and preprocessed in {time.time()-start_time:.1f}s")
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )
    
    # Scale features
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    # Train model with hyperparameters
    model = GradientBoostingRegressor(
        n_estimators=1000,
        learning_rate=0.01,
        max_depth=5,
        subsample=0.8,
        random_state=42
    )
    
    # Train model
    model_start = time.time()
    model.fit(X_train_scaled, y_train)
    print(f"Model trained in {time.time()-model_start:.1f}s")
    
    # Evaluate
    predictions = model.predict(X_test_scaled)
    rmse = np.sqrt(mean_squared_error(y_test, predictions))
    r2 = r2_score(y_test, predictions)
    
    print(f"Model Performance:\nRMSE: {rmse:,.2f}\nR²: {r2:.3f}")
    
    # Save artifacts
    joblib.dump(model, 'models/view_predictor.pkl')
    joblib.dump(scaler, 'models/scaler.pkl')
    
    # Feature importance
    importance = pd.DataFrame({
        'feature': X.columns,
        'importance': model.feature_importances_
    }).sort_values('importance', ascending=False)
    
    print("\nFeature Importance:")
    print(importance)
    
    total_time = time.time() - start_time
    print(f"\nTotal execution time: {total_time//60:.0f}m {total_time%60:.1f}s")

if __name__ == "__main__":
    train_model() 