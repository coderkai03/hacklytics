"""
Generate actionable reports from video analysis
"""

import os
import json
from typing import Dict, List
from .video_metrics import analyze_metrics, VideoMetrics
import matplotlib.pyplot as plt
import seaborn as sns
import pandas as pd
import numpy as np

def generate_performance_report(results_dir: str, output_dir: str) -> None:
    """Generate comprehensive performance report"""
    # Create output directory
    os.makedirs(output_dir, exist_ok=True)
    
    # Load CSV results
    results_df = pd.read_csv(os.path.join(results_dir, "tiktok_content_analysis.csv"))
    
    # Generate metrics for each video
    metrics = []
    for _, row in results_df.iterrows():
        metrics.append(analyze_metrics(row))
    
    # Generate reports
    _generate_summary_report(metrics, output_dir)
    _generate_visualizations(metrics, output_dir)
    _generate_recommendations(metrics, output_dir)

def _generate_summary_report(metrics: List[VideoMetrics], output_dir: str) -> None:
    """Generate summary statistics and insights"""
    summary = {
        'total_videos': len(metrics),
        'avg_duration': np.mean([m.duration for m in metrics]),
        'engagement_metrics': {
            'avg_retention_score': np.mean([m.engagement_metrics['viewer_retention_score'] for m in metrics]),
            'avg_attention_density': np.mean([m.engagement_metrics['attention_density'] for m in metrics]),
            'avg_pacing_score': np.mean([m.engagement_metrics['pacing_score'] for m in metrics])
        },
        'content_distribution': {
            'avg_face_presence': np.mean([m.content_metrics['face_presence_ratio'] for m in metrics]),
            'avg_text_visibility': np.mean([m.content_metrics['text_visibility'] for m in metrics]),
            'avg_screen_recording': np.mean([m.content_metrics['screen_recording'] for m in metrics])
        }
    }
    
    with open(os.path.join(output_dir, 'summary_report.json'), 'w') as f:
        json.dump(summary, f, indent=2)

def _generate_visualizations(metrics: List[VideoMetrics], output_dir: str) -> None:
    """Generate visual insights"""
    plt.figure(figsize=(12, 6))
    
    # Face presence vs Duration
    durations = [m.duration for m in metrics]
    face_ratios = [m.content_metrics['face_presence_ratio'] for m in metrics]
    plt.scatter(durations, face_ratios)
    plt.xlabel('Video Duration (s)')
    plt.ylabel('Face Presence Ratio')
    plt.title('Face Presence vs Video Duration')
    plt.savefig(os.path.join(output_dir, 'face_duration_correlation.png'))
    plt.close()
    
    # Content type distribution
    plt.figure(figsize=(10, 6))
    content_types = pd.DataFrame({
        'Screen Recording': [m.content_metrics['screen_recording'] > 50 for m in metrics],
        'Text Heavy': [m.content_metrics['text_visibility'] > 50 for m in metrics],
        'Face Heavy': [m.content_metrics['face_presence_ratio'] > 0.5 for m in metrics]
    })
    
    sns.heatmap(content_types.corr(), annot=True, cmap='coolwarm')
    plt.title('Content Type Correlations')
    plt.savefig(os.path.join(output_dir, 'content_type_correlation.png'))
    plt.close()

def _generate_recommendations(metrics: List[VideoMetrics], output_dir: str) -> None:
    """Generate actionable recommendations"""
    recommendations = []
    
    # Analyze patterns
    avg_duration = np.mean([m.duration for m in metrics])
    avg_faces = np.mean([m.content_metrics['face_presence_ratio'] for m in metrics])
    avg_text = np.mean([m.content_metrics['text_visibility'] for m in metrics])
    
    # Duration recommendations
    if avg_duration > 60:
        recommendations.append("Consider shorter videos (30-60s) for better retention")
    elif avg_duration < 15:
        recommendations.append("Consider slightly longer videos to convey more value")
    
    # Content balance recommendations
    if avg_faces < 0.3:
        recommendations.append("Include more human presence for better engagement")
    if avg_text < 30:
        recommendations.append("Add more text overlays for key points")
    elif avg_text > 80:
        recommendations.append("Reduce text density to maintain visual interest")
    
    with open(os.path.join(output_dir, 'recommendations.txt'), 'w') as f:
        f.write("\n".join(recommendations)) 