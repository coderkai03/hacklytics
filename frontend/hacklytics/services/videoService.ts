import { S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { v4 as uuidv4 } from 'uuid';

const ANALYZER_URL = "https://o5ixu5v3ry554pw2has7lvhvce0rmbdr.lambda-url.us-east-1.on.aws/";
const PREDICTOR_URL = "https://hik7fngfebyqzhpcncmbfbh3ma0vkkgw.lambda-url.us-east-1.on.aws/";
const BUCKET_NAME = "hacklytics-video-uploads"; // Replace with your bucket name

const s3Client = new S3Client({
  region: 'us-east-1',
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY!,
  },
});

export interface VideoAnalysisResult {
  prediction: {
    predicted_views: number;
    confidence_range: {
      low: number;
      high: number;
    };
    engagement_metrics: {
      viral_potential: string;
      estimated_reach: number;
      predicted_shares: number;
    };
  };
  features_used: {
    duration: number;
    total_faces: number;
    text_percentage: number;
    engagement_score: number;
    audio_quality_score: number;
    audio_dynamics_score: number;
    audio_clarity_score: number;
  };
  financial_metrics: {
    rpm: number;
    estimated_revenue: number;
    revenue_potential: 'low' | 'medium' | 'high';
  };
}


export async function analyzeVideo(file: File): Promise<VideoAnalysisResult> {
  try {
    // Convert File directly to base64
    const base64Video = await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        // Remove the data URL prefix
        resolve(base64String.split(',')[1]);
      };
      reader.readAsDataURL(file);
    });

    // Step 1: Analyze video
    const analyzerResponse = await fetch(ANALYZER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ video: base64Video }),
    });

    if (!analyzerResponse.ok) {
      const errorData = await analyzerResponse.json();
      throw new Error(`Video analysis failed: ${JSON.stringify(errorData)}`);
    }

    const videoFeatures = await analyzerResponse.json();

    // Step 2: Get prediction
    const predictorResponse = await fetch(PREDICTOR_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ video_features: videoFeatures }),
    });

    if (!predictorResponse.ok) {
      const errorData = await predictorResponse.json();
      throw new Error(`Prediction failed: ${JSON.stringify(errorData)}`);
    }

    return await predictorResponse.json();
  } catch (error) {
    console.error('Error in analyzeVideo:', error);
    throw error;
  }
} 