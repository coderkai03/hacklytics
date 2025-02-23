#!/usr/bin/env python3
"""
Video Analysis Script
Required packages:
- opencv-python
- moviepy
- librosa
- pandas
- numpy
- scikit-learn
"""

import os
import cv2
import numpy as np
import pandas as pd
from moviepy.editor import VideoFileClip
import librosa
import json
from typing import Dict, List, Any
from sklearn.cluster import KMeans

def get_video_duration(video_path: str) -> float:
    """Extract video duration using OpenCV."""
    cap = cv2.VideoCapture(video_path)
    fps = cap.get(cv2.CAP_PROP_FPS)
    frame_count = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    duration = frame_count / fps
    cap.release()
    return duration

def extract_frames(video_path: str, interval: float = 1) -> List[np.ndarray]:
    """Extract frames from video at specified intervals."""
    frames = []
    cap = cv2.VideoCapture(video_path)
    fps = cap.get(cv2.CAP_PROP_FPS)
    frame_interval = int(fps * interval)  # Convert interval from seconds to frames
    
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
    # Load EAST text detector
    east_net = cv2.dnn.readNet("frozen_east_text_detection.pb")
    return face_cascade, east_net

def detect_text(frame: np.ndarray, east_net) -> bool:
    """Detect text in frame using EAST text detector."""
    orig = frame.copy()
    (H, W) = frame.shape[:2]

    # Set new width and height
    newW, newH = 320, 320
    rW = W / float(newW)
    rH = H / float(newH)

    # Resize image
    frame = cv2.resize(frame, (newW, newH))
    (H, W) = frame.shape[:2]

    # Define output layers
    layerNames = [
        "feature_fusion/Conv_7/Sigmoid",
        "feature_fusion/concat_3"
    ]

    # Create blob and perform forward pass
    blob = cv2.dnn.blobFromImage(frame, 1.0, (W, H),
        (123.68, 116.78, 103.94), swapRB=True, crop=False)
    east_net.setInput(blob)
    (scores, geometry) = east_net.forward(layerNames)

    # At least one region with text confidence > 0.5
    return np.any(scores > 0.5)

def analyze_frame_content(frame: np.ndarray, face_cascade, east_net) -> Dict[str, Any]:
    """Analyze frame content using specialized detectors."""
    frame_info = {}
    
    # 1. Detect faces
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    faces = face_cascade.detectMultiScale(gray, 1.1, 4)
    frame_info['face_count'] = len(faces)
    
    # 2. Detect if frame is likely a screen recording
    is_screen_recording = detect_screen_recording(frame)
    frame_info['is_screen_recording'] = is_screen_recording
    
    # 3. Detect text
    has_text = detect_text(frame, east_net)
    frame_info['has_text'] = has_text
    
    # 4. Detect dominant colors
    frame_info['dominant_colors'] = get_dominant_colors(frame)
    
    # 5. Estimate scene type
    frame_info['scene_type'] = estimate_scene_type(frame)
    
    return frame_info

def detect_screen_recording(frame: np.ndarray) -> bool:
    """Detect if frame is likely a screen recording."""
    # Convert to grayscale
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    
    # Look for characteristics of screen recordings:
    # 1. High number of straight lines (UI elements)
    edges = cv2.Canny(gray, 50, 150)
    lines = cv2.HoughLinesP(edges, 1, np.pi/180, 100, minLineLength=100, maxLineGap=10)
    
    # 2. Check for solid color regions (typical in UI)
    blur = cv2.GaussianBlur(gray, (5,5), 0)
    _, thresh = cv2.threshold(blur, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
    solid_regions = cv2.countNonZero(thresh) / (frame.shape[0] * frame.shape[1])
    
    return lines is not None and len(lines) > 10 and solid_regions > 0.3

def get_dominant_colors(frame: np.ndarray, n_colors: int = 3) -> List[str]:
    """Extract dominant colors from frame."""
    # Reshape the frame
    pixels = frame.reshape(-1, 3)
    
    # Use k-means to find dominant colors
    kmeans = KMeans(n_clusters=n_colors, random_state=42)
    kmeans.fit(pixels)
    
    # Convert colors to hex
    colors = []
    for color in kmeans.cluster_centers_:
        hex_color = '#{:02x}{:02x}{:02x}'.format(
            int(color[0]), int(color[1]), int(color[2])
        )
        colors.append(hex_color)
    
    return colors

def estimate_scene_type(frame: np.ndarray) -> str:
    """Estimate the type of scene in the frame."""
    # Simple heuristic based on color and edge distribution
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    edges = cv2.Canny(gray, 50, 150)
    edge_density = np.count_nonzero(edges) / (frame.shape[0] * frame.shape[1])
    
    if edge_density < 0.1:
        return "simple_background"
    elif edge_density > 0.4:
        return "complex_scene"
    else:
        return "moderate_complexity"

def analyze_objects(frames: List[np.ndarray], detector) -> Dict[str, Any]:
    """Analyze frames for social media relevant content."""
    face_cascade, east_net = detector
    
    frame_analysis = []
    summary = {
        'total_faces': 0,
        'text_frames': 0,
        'screen_recording_frames': 0,
        'scene_types': {},
        'dominant_colors': set()
    }
    
    for frame in frames:
        frame_info = analyze_frame_content(frame, face_cascade, east_net)
        frame_analysis.append(frame_info)
        
        # Update summary
        summary['total_faces'] += frame_info['face_count']
        if frame_info['has_text']:
            summary['text_frames'] += 1
        if frame_info['is_screen_recording']:
            summary['screen_recording_frames'] += 1
        summary['scene_types'][frame_info['scene_type']] = summary['scene_types'].get(frame_info['scene_type'], 0) + 1
        summary['dominant_colors'].update(frame_info['dominant_colors'])
    
    # Convert summary for JSON serialization
    summary['dominant_colors'] = list(summary['dominant_colors'])
    summary['avg_faces_per_frame'] = summary['total_faces'] / len(frames)
    summary['text_percentage'] = (summary['text_frames'] / len(frames)) * 100
    summary['screen_recording_percentage'] = (summary['screen_recording_frames'] / len(frames)) * 100
    
    return summary

def interpret_mfccs(mfccs_mean: List[float]) -> Dict[str, str]:
    """Interpret MFCC values for content creators"""
    features = {
        'voice_clarity': 'low' if mfccs_mean[1] < 80 else 'high',
        'bass_presence': 'strong' if mfccs_mean[2] > 10 else 'weak', 
        'audio_brightness': 'bright' if mfccs_mean[3] > 25 else 'dark',
        'audio_complexity': 'complex' if abs(mfccs_mean[4]) > 5 else 'simple'
    }
    return features

def extract_audio_features(video_path: str) -> Dict[str, Any]:
    """Extract very basic audio features without using any advanced processing."""
    try:
        # Extract audio using moviepy
        video = VideoFileClip(video_path)
        audio = video.audio
        
        # Save audio temporarily
        temp_audio = "temp_audio.wav"
        audio.write_audiofile(temp_audio, verbose=False, logger=None)
        
        # Load audio with librosa
        y, sr = librosa.load(temp_audio)
        
        # Only use RMS energy and zero-crossing rate
        rms = librosa.feature.rms(y=y)[0]
        zcr = librosa.feature.zero_crossing_rate(y=y)[0]
        
        # Calculate basic statistics
        rms_mean = float(np.mean(rms))
        rms_std = float(np.std(rms))
        zcr_mean = float(np.mean(zcr))
        zcr_std = float(np.std(zcr))
        
        # Calculate volume levels
        volume_percentiles = np.percentile(rms, [10, 50, 90])
        dynamic_range = float((volume_percentiles[2] - volume_percentiles[0]) / volume_percentiles[1])
        
        # Quality metrics
        quality_metrics = {
            "volume_level": rms_mean,  # Overall loudness
            "volume_consistency": float(1 - rms_std / rms_mean if rms_mean > 0 else 0),  # Higher means more consistent
            "high_frequency_content": zcr_mean,  # Higher means more high-frequency content
            "frequency_variation": float(zcr_std / zcr_mean if zcr_mean > 0 else 0)  # Higher means more varied frequency content
        }
        
        # Quality scores based on empirical thresholds
        quality_scores = {
            "volume_quality": "good" if quality_metrics["volume_consistency"] > 0.7 else "variable",
            "dynamic_range": "wide" if dynamic_range > 1.5 else "narrow",
            "frequency_quality": "rich" if quality_metrics["high_frequency_content"] > 0.1 else "basic",
            "overall_quality": "high" if (quality_metrics["volume_consistency"] > 0.7 and quality_metrics["high_frequency_content"] > 0.1) else "medium"
        }
        
        # Clean up
        os.remove(temp_audio)
        video.close()
        
        return {
            "quality_metrics": quality_metrics,
            "quality_scores": quality_scores,
            "dynamic_analysis": {
                "dynamic_range": dynamic_range,
                "peak_volume": float(volume_percentiles[2]),
                "median_volume": float(volume_percentiles[1]),
                "noise_floor": float(volume_percentiles[0])
            }
        }
        
    except Exception as e:
        print(f"Warning: Audio analysis failed - {str(e)}")
        return {
            "quality_metrics": None,
            "quality_scores": None,
            "dynamic_analysis": None
        }

def analyze_view_potential(frame_analyses: List[Dict]) -> Dict[str, float]:
    """Analyze view potential based on proven metrics"""
    return {
        'engagement_score': _calculate_engagement_score(frame_analyses),
        'retention_probability': _estimate_retention(frame_analyses),
        'viral_coefficient': _estimate_viral_potential(frame_analyses)
    }

def _calculate_engagement_score(analyses: List[Dict]) -> float:
    attention_scores = [f['attention_score'] for f in analyses]
    motion_energies = [f['motion_energy'] for f in analyses]
    
    # Higher scores for:
    # - Consistent attention with peaks
    # - Good motion pacing
    # - Presence of CTAs
    attention_consistency = np.std(attention_scores) / np.mean(attention_scores)
    motion_pacing = np.std(motion_energies) / np.mean(motion_energies)
    
    return (100 - attention_consistency * 30) * (0.7 + motion_pacing * 0.3)

def main():
    """Main function to process videos."""
    video_dir = "videos"
    results_dir = "results"
    results = []
    
    print("Loading object detection model...")
    detector = load_detectors()
    
    # Get all MP4 files
    video_files = [f for f in os.listdir(video_dir) if f.endswith('.mp4')]
    
    for video_file in video_files:
        video_path = os.path.join(video_dir, video_file)
        print(f"\nProcessing {video_file}...")
        
        try:
            # Get video duration
            duration = get_video_duration(video_path)
            print("- Extracted duration")
            
            # Extract and analyze frames
            frames = extract_frames(video_path)
            print("- Extracted frames")
            social_media_content = analyze_objects(frames, detector)
            print("- Analyzed social media content")
            
            # Extract audio features
            audio_features = extract_audio_features(video_path)
            print("- Extracted audio features")
            
            # Compile results
            results.append({
                "video_filename": video_file,
                "duration": duration,
                "social_media_content": json.dumps(social_media_content),
                "audio_features": json.dumps(audio_features)
            })
            
        except Exception as e:
            print(f"Error processing {video_file}: {str(e)}")
            continue
    
    # Create DataFrame and save to CSV
    if results:
        df = pd.DataFrame(results)
        output_file = os.path.join(results_dir, "tiktok_content_analysis.csv")
        df.to_csv(output_file, index=False)
        print(f"\nAnalysis complete! Results saved to {output_file}")
    else:
        print("\nNo results were generated. Check the errors above.")

if __name__ == "__main__":
    main() 