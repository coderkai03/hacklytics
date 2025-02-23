import { NextResponse } from 'next/server';

interface VideoAnalysisResponse {
  predictedViews: number;
  videoLength: number;
  estimatedRevenue: number;
}

function calculateRevenue(views: number, videoLength: number): number {
  const lengthFactor = videoLength / 1000;
  const rpm = videoLength >= 8 ? Math.random() * 5 + 5 : Math.random() * 3 + 2; // $5-$10 for 8+ min, $2-$5 for <8 min
  return lengthFactor * views * rpm;
}

export async function POST(request: Request) {
  try {
    const { videoUrl } = await request.json();
    
    // Here you would typically:
    // 1. Get actual video length from the video file
    // 2. Use ML model to predict views
    // For now, using mock data
    const mockVideoLength = Math.floor(Math.random() * 15) + 1; // 1-15 minutes
    const mockViews = Math.floor(Math.random() * 1000000) + 10000; // 10K-1M views
    
    const response: VideoAnalysisResponse = {
      predictedViews: mockViews,
      videoLength: mockVideoLength,
      estimatedRevenue: calculateRevenue(mockViews, mockVideoLength)
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error analyzing video:', error);
    return NextResponse.json(
      { error: 'Failed to analyze video' },
      { status: 500 }
    );
  }
}

// Keep GET endpoint for testing
export async function GET() {
  try {
    const mockVideoLength = Math.floor(Math.random() * 15) + 1;
    const mockViews = Math.floor(Math.random() * 1000000) + 10000;
    
    const response: VideoAnalysisResponse = {
      predictedViews: mockViews,
      videoLength: mockVideoLength,
      estimatedRevenue: calculateRevenue(mockViews, mockVideoLength)
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error analyzing video:', error);
    return NextResponse.json(
      { error: 'Failed to analyze video' },
      { status: 500 }
    );
  }
} 