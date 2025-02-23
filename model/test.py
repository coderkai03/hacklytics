import requests
import json
import base64
import os

# Lambda URLs
ANALYZER_URL = "https://o5ixu5v3ry554pw2has7lvhvce0rmbdr.lambda-url.us-east-1.on.aws/"  # Your current URL
PREDICTOR_URL = "https://hik7fngfebyqzhpcncmbfbh3ma0vkkgw.lambda-url.us-east-1.on.aws/"  # You'll get this after creating the second Lambda

def check_health():
    """Check health of both services."""
    try:
        # Send minimal valid payloads for health checks
        analyzer_payload = {
            "video": ""  # Empty string as minimal valid payload
        }
        predictor_payload = {
            "video_features": {}  # Empty dict as minimal valid payload
        }
        
        analyzer_health = requests.post(ANALYZER_URL, json=analyzer_payload)
        predictor_health = requests.post(PREDICTOR_URL, json=predictor_payload)
        
        # Check if responses are empty
        if not analyzer_health.text or not predictor_health.text:
            print("Empty response received from one or both services")
            return False
            
        try:
            # Parse JSON responses
            analyzer_response = analyzer_health.json()
            predictor_response = predictor_health.json()
            
            print("Analyzer Health:", analyzer_response)
            print("Predictor Health:", predictor_response)
            
            # Consider the services healthy if they return any valid JSON
            return (analyzer_health.status_code == 200 and 
                    predictor_health.status_code == 200)
        except json.JSONDecodeError as je:
            print(f"JSON decode error: {str(je)}")
            print(f"Analyzer Response Text: {analyzer_health.text}")
            print(f"Predictor Response Text: {predictor_health.text}")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"Health check failed: {str(e)}")
        return False

def encode_video(video_path):
    """Encode video file to base64."""
    try:
        with open(video_path, 'rb') as video_file:
            return base64.b64encode(video_file.read()).decode('utf-8')
    except FileNotFoundError:
        print(f"Error: Video file not found at path: {video_path}")
        return None
    except Exception as e:
        print(f"Error encoding video: {str(e)}")
        return None

def process_video(video_path):
    """Two-step process: analyze video, then get prediction."""
    # Temporarily comment out health check since the endpoints have issues
    # if not check_health():
    #     print("Services are not healthy. Aborting.")
    #     return None

    # Step 1: Analyze video
    print(f"Starting to process video: {video_path}")
    encoded_video = encode_video(video_path)
    if not encoded_video:
        return None
    
    print(f"Successfully encoded video. Encoded size: {len(encoded_video) / (1024*1024):.2f} MB")

    try:
        # Step 1: Video Analysis
        print("\nStep 1: Analyzing video...")
        analyzer_payload = {
            "video": encoded_video
        }
        print("Sending request to analyzer...")
        # Increase timeout and add error response printing
        analyzer_response = requests.post(ANALYZER_URL, json=analyzer_payload, timeout=60)
        print(f"Analyzer response status code: {analyzer_response.status_code}")
        print(f"Analyzer response text: {analyzer_response.text}")
        analyzer_response.raise_for_status()
        video_features = analyzer_response.json()
        
        print("Video Analysis Complete:")
        print(json.dumps(video_features, indent=2))

        # Step 2: Get Prediction
        print("\nStep 2: Getting prediction...")
        predictor_payload = {
            "video_features": video_features
        }
        predictor_response = requests.post(PREDICTOR_URL, json=predictor_payload)
        predictor_response.raise_for_status()
        prediction = predictor_response.json()
        
        print("Prediction Complete:")
        print(json.dumps(prediction, indent=2))
        
        return prediction

    except requests.exceptions.RequestException as e:
        print(f"Error during processing: {str(e)}")
        if 'analyzer_response' in locals():
            print(f"Analyzer Response: {analyzer_response.text}")
        if 'predictor_response' in locals():
            print(f"Predictor Response: {predictor_response.text}")
        return None

if __name__ == "__main__":
    video_path = "/Users/sahil/Documents/hacklytics/model/test_2.mp4"
    process_video(video_path)