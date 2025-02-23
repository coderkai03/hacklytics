import json
import numpy as np
import joblib
import os
import warnings
from typing import Dict, Any

# Suppress joblib warnings about multiprocessing
warnings.filterwarnings('ignore', category=UserWarning, module='joblib')

# Load model at container startup
MODEL_PATH = os.path.join(os.path.dirname(__file__), 'stacking_view_predictor.pkl')
model = joblib.load(MODEL_PATH)

def expand_features(data: Dict[str, Any]) -> Dict[str, float]:
    """Extract and engineer features from raw video analysis."""
    features = {}
    
    # Basic features
    features['duration'] = data['duration']
    
    # Extract from social_media_content
    social = data['social_media_content']
    features['total_faces'] = social.get('total_faces', 0)
    features['text_frames'] = social.get('text_frames', 0)
    features['screen_recording_frames'] = social.get('screen_recording_frames', 0)
    features['avg_faces_per_frame'] = social.get('avg_faces_per_frame', 0)
    features['text_percentage'] = social.get('text_percentage', 0)
    features['screen_recording_percentage'] = social.get('screen_recording_percentage', 0)
    
    # Extract from audio_features
    audio = data['audio_features']
    quality_metrics = audio.get('quality_metrics', {})
    dynamic_analysis = audio.get('dynamic_analysis', {})
    
    features['volume_level'] = quality_metrics.get('volume_level', 0)
    features['volume_consistency'] = quality_metrics.get('volume_consistency', 0)
    features['high_frequency_content'] = quality_metrics.get('high_frequency_content', 0)
    features['frequency_variation'] = quality_metrics.get('frequency_variation', 0)
    features['dynamic_range'] = dynamic_analysis.get('dynamic_range', 0)
    features['peak_volume'] = dynamic_analysis.get('peak_volume', 0)
    features['median_volume'] = dynamic_analysis.get('median_volume', 0)
    features['noise_floor'] = dynamic_analysis.get('noise_floor', 0)
    
    # Engineer additional features
    features['face_to_duration_ratio'] = features['total_faces'] / max(features['duration'], 1)
    features['text_density'] = features['text_frames'] / max(features['duration'], 1)
    features['screen_recording_density'] = features['screen_recording_frames'] / max(features['duration'], 1)
    
    # Audio quality scores
    features['audio_quality_score'] = (features['volume_consistency'] + features['high_frequency_content']) / 2
    features['audio_dynamics_score'] = (features['dynamic_range'] + features['volume_level']) / 2
    features['audio_clarity_score'] = (features['peak_volume'] - features['noise_floor']) / max(features['peak_volume'], 0.001)
    
    # Engagement features
    features['face_text_ratio'] = features['total_faces'] / max(features['text_frames'], 1)
    features['content_density'] = (features['text_frames'] + features['screen_recording_frames']) / max(features['duration'], 1)
    features['engagement_score'] = (features['face_to_duration_ratio'] + features['text_density'] + features['audio_quality_score']) / 3
    
    return features

def format_prediction(views: float) -> Dict[str, Any]:
    """Format prediction with additional context."""
    return {
        'predicted_views': int(views),
        'confidence_range': {
            'low': int(views * 0.8),  # 20% margin
            'high': int(views * 1.2)
        },
        'engagement_metrics': {
            'viral_potential': 'high' if views > 1000000 else 'medium' if views > 100000 else 'low',
            'estimated_reach': int(views * 1.5),  # Estimated total reach including shares
            'predicted_shares': int(views * 0.1)  # Estimated shares (10% of views)
        }
    }

def lambda_handler(event, context):
    """AWS Lambda handler for prediction."""
    # Add health check for GET requests
    if event.get('httpMethod') == 'GET':
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'status': 'healthy',
                'message': 'Predictor service is running'
            })
        }
    
    try:
        # Parse input
        body = json.loads(event['body'])
        
        # Add debug logging
        print(f"Received body: {body}")
        
        if 'video_features' not in body:
            raise KeyError("Request body must contain 'video_features' key")
            
        video_features = body['video_features']
        
        # Extract and engineer features
        features = expand_features(video_features)
        
        # Prepare feature vector
        feature_columns = [
            'duration', 'total_faces', 'text_frames', 'avg_faces_per_frame',
            'text_percentage', 'volume_level', 'volume_consistency',
            'audio_quality_score', 'audio_clarity_score', 'face_text_ratio',
            'content_density', 'median_volume'
        ]
        
        feature_vector = np.array([[features[col] for col in feature_columns]])
        
        # Make prediction
        log_prediction = model.predict(feature_vector)[0]
        prediction = np.expm1(log_prediction)  # Convert back from log scale
        
        # Format response
        prediction_data = format_prediction(prediction)
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'success': True,
                'prediction': prediction_data,
                'features_used': features
            })
        }
        
    except Exception as e:
        import traceback
        error_details = traceback.format_exc()
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'success': False,
                'error': str(e),
                'error_details': error_details
            })
        }