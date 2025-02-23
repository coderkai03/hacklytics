import json
import cv2
import numpy as np
import base64
from moviepy.editor import VideoFileClip
import librosa
import tempfile
import os
from typing import Dict, Any
from sklearn.cluster import KMeans

def decode_video_from_base64(base64_string: str) -> str:
    """Decode base64 video and save to temp file."""
    # Create temp directory if it doesn't exist
    temp_dir = '/tmp'
    if not os.path.exists(temp_dir):
        os.makedirs(temp_dir)
    
    # Save video to temp file
    temp_path = os.path.join(temp_dir, 'temp_video.mp4')
    with open(temp_path, 'wb') as f:
        f.write(base64.b64decode(base64_string))
    
    return temp_path

def get_video_duration(video_path: str) -> float:
    """Extract video duration using OpenCV."""
    cap = cv2.VideoCapture(video_path)
    fps = cap.get(cv2.CAP_PROP_FPS)
    frame_count = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    duration = frame_count / fps
    cap.release()
    return duration

def extract_frames(video_path: str, interval: float = 1) -> list:
    """Extract frames from video at specified intervals."""
    frames = []
    cap = cv2.VideoCapture(video_path)
    fps = cap.get(cv2.CAP_PROP_FPS)
    frame_interval = int(fps * interval)
    
    frame_count = 0
    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break
            
        if frame_count % frame_interval == 0:
            frames.append(frame)
        frame_count += 1
    
    cap.release()
    return frames

def load_detectors():
    """Load specialized detectors for social media content."""
    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
    return face_cascade

def analyze_frame_content(frame: np.ndarray, face_cascade) -> Dict[str, Any]:
    """Analyze frame content using specialized detectors."""
    frame_info = {}
    
    # 1. Detect faces
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    faces = face_cascade.detectMultiScale(gray, 1.1, 4)
    frame_info['face_count'] = len(faces)
    
    # 2. Detect if frame is likely a screen recording
    is_screen_recording = detect_screen_recording(frame)
    frame_info['is_screen_recording'] = is_screen_recording
    
    # 3. Detect text (simplified for Lambda)
    has_text = detect_text_simple(frame)
    frame_info['has_text'] = has_text
    
    # 4. Detect dominant colors
    frame_info['dominant_colors'] = get_dominant_colors(frame)
    
    # 5. Estimate scene type
    frame_info['scene_type'] = estimate_scene_type(frame)
    
    return frame_info

def detect_screen_recording(frame: np.ndarray) -> bool:
    """Detect if frame is likely a screen recording."""
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    edges = cv2.Canny(gray, 50, 150)
    lines = cv2.HoughLinesP(edges, 1, np.pi/180, 100, minLineLength=100, maxLineGap=10)
    
    blur = cv2.GaussianBlur(gray, (5,5), 0)
    _, thresh = cv2.threshold(blur, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
    solid_regions = cv2.countNonZero(thresh) / (frame.shape[0] * frame.shape[1])
    
    return lines is not None and len(lines) > 10 and solid_regions > 0.3

def detect_text_simple(frame: np.ndarray) -> bool:
    """Simplified text detection for Lambda."""
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    blur = cv2.GaussianBlur(gray, (5,5), 0)
    thresh = cv2.threshold(blur, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)[1]
    
    # Count white pixels (potential text)
    white_pixels = np.count_nonzero(thresh)
    total_pixels = thresh.size
    
    return (white_pixels / total_pixels) > 0.01

def get_dominant_colors(frame: np.ndarray, n_colors: int = 3) -> list:
    """Extract dominant colors from frame."""
    pixels = frame.reshape(-1, 3)
    kmeans = KMeans(n_clusters=n_colors, random_state=42)
    kmeans.fit(pixels)
    
    colors = []
    for color in kmeans.cluster_centers_:
        hex_color = '#{:02x}{:02x}{:02x}'.format(
            int(color[0]), int(color[1]), int(color[2])
        )
        colors.append(hex_color)
    
    return colors

def estimate_scene_type(frame: np.ndarray) -> str:
    """Estimate the type of scene in the frame."""
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    edges = cv2.Canny(gray, 50, 150)
    edge_density = np.count_nonzero(edges) / (frame.shape[0] * frame.shape[1])
    
    if edge_density < 0.1:
        return "simple_background"
    elif edge_density > 0.4:
        return "complex_scene"
    else:
        return "moderate_complexity"

def analyze_objects(frames: list, detector) -> Dict[str, Any]:
    """Analyze frames for social media relevant content."""
    face_cascade = detector
    
    frame_analysis = []
    summary = {
        'total_faces': 0,
        'text_frames': 0,
        'screen_recording_frames': 0,
        'scene_types': {},
        'dominant_colors': set()
    }
    
    for frame in frames:
        frame_info = analyze_frame_content(frame, face_cascade)
        frame_analysis.append(frame_info)
        
        summary['total_faces'] += frame_info['face_count']
        if frame_info['has_text']:
            summary['text_frames'] += 1
        if frame_info['is_screen_recording']:
            summary['screen_recording_frames'] += 1
        summary['scene_types'][frame_info['scene_type']] = summary['scene_types'].get(frame_info['scene_type'], 0) + 1
        summary['dominant_colors'].update(frame_info['dominant_colors'])
    
    summary['dominant_colors'] = list(summary['dominant_colors'])
    summary['avg_faces_per_frame'] = summary['total_faces'] / len(frames)
    summary['text_percentage'] = (summary['text_frames'] / len(frames)) * 100
    summary['screen_recording_percentage'] = (summary['screen_recording_frames'] / len(frames)) * 100
    
    return summary

def extract_audio_features(video_path: str) -> Dict[str, Any]:
    """Extract audio features optimized for Lambda."""
    try:
        video = VideoFileClip(video_path)
        if video.audio is None:
            return {
                "quality_metrics": {"no_audio": True},
                "quality_scores": {"overall_quality": "no_audio"},
                "dynamic_analysis": {}
            }
            
        audio = video.audio
        
        # Save audio temporarily
        temp_audio = "/tmp/temp_audio.wav"
        audio.write_audiofile(temp_audio, verbose=False, logger=None)
        
        # Load and analyze audio with simplified settings
        y, sr = librosa.load(temp_audio, sr=22050, mono=True, duration=30)  # Limit duration
        
        # Basic features that don't require heavy computation
        rms = np.sqrt(np.mean(y**2))
        zcr = np.mean(librosa.zero_crossings(y))
        
        # Clean up
        os.remove(temp_audio)
        video.close()
        
        return {
            "quality_metrics": {
                "volume_level": float(rms),
                "high_frequency_content": float(zcr)
            },
            "quality_scores": {
                "volume_quality": "good" if rms > 0.1 else "low",
                "overall_quality": "high" if rms > 0.1 else "medium"
            },
            "dynamic_analysis": {
                "peak_volume": float(np.max(np.abs(y))),
                "median_volume": float(np.median(np.abs(y)))
            }
        }
        
    except Exception as e:
        print(f"Audio analysis failed: {str(e)}")
        return {
            "quality_metrics": {"error": str(e)},
            "quality_scores": {"overall_quality": "error"},
            "dynamic_analysis": {}
        }

def lambda_handler(event, context):
    """AWS Lambda handler."""
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
                'message': 'Video analyzer service is running'
            })
        }

    try:
        # Get video data from request
        body = json.loads(event['body'])
        video_base64 = body['video']
        
        # Decode and save video
        video_path = decode_video_from_base64(video_base64)
        
        # Initialize detector
        detector = load_detectors()
        
        # Extract features
        duration = get_video_duration(video_path)
        frames = extract_frames(video_path)
        social_media_content = analyze_objects(frames, detector)
        audio_features = extract_audio_features(video_path)
        
        # Clean up
        os.remove(video_path)
        
        # Return results
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'duration': duration,
                'social_media_content': social_media_content,
                'audio_features': audio_features
            })
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'error': str(e)
            })
        } 