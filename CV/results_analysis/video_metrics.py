"""
Enhanced Video Metrics Analysis
Focuses on B2C ad performance metrics
"""

import os
import json
import numpy as np
import pandas as pd
from typing import Dict, List, Any
from dataclasses import dataclass

@dataclass
class VideoMetrics:
    filename: str
    duration: float
    engagement_metrics: Dict[str, float]
    content_metrics: Dict[str, Any]
    audio_metrics: Dict[str, Any]

def analyze_metrics(video_data: Dict) -> VideoMetrics:
    """Convert raw analysis into actionable metrics"""
    social_media_content = json.loads(video_data['social_media_content'])
    audio_features = json.loads(video_data['audio_features'])
    
    engagement_metrics = {
        'viewer_retention_score': _calculate_retention_score(social_media_content),
        'attention_density': social_media_content['avg_faces_per_frame'],
        'pacing_score': _calculate_pacing_score(social_media_content),
        'hook_strength': social_media_content['text_percentage'] / 100.0
    }
    
    content_metrics = {
        'face_presence_ratio': social_media_content['avg_faces_per_frame'],
        'text_visibility': social_media_content['text_percentage'],
        'screen_recording': social_media_content['screen_recording_percentage'],
        'scene_types': social_media_content['scene_types']
    }
    
    return VideoMetrics(
        filename=video_data['video_filename'],
        duration=video_data['duration'],
        engagement_metrics=engagement_metrics,
        content_metrics=content_metrics,
        audio_metrics=audio_features
    )

def _calculate_retention_score(content: Dict) -> float:
    """Calculate viewer retention score based on content density"""
    return min(100, (
        content['avg_faces_per_frame'] * 20 +
        content['text_percentage'] * 0.5
    ))

def _calculate_pacing_score(content: Dict) -> float:
    """Calculate content pacing score"""
    scene_variety = len(content['scene_types'])
    face_variation = content['avg_faces_per_frame'] * 10
    text_density = content['text_percentage'] * 0.3
    
    return min(100, scene_variety * 20 + face_variation + text_density) 