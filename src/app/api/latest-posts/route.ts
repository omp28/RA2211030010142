import { NextResponse } from 'next/server';
import { getLatestPosts } from '@/services/analytics'; 

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '5');
    
    const latestPosts = await getLatestPosts(limit);
    
    return NextResponse.json({
      data: latestPosts,
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error('Error in latest-posts API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch latest posts' },
      { status: 500 }
    );
  }
}