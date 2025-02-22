from video_analysis import main as analyze_videos
from results_analysis.generate_report import generate_performance_report
import os

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

if __name__ == "__main__":
    main() 