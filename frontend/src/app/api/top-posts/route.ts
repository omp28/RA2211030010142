import { NextResponse } from 'next/server';
import { getTopPosts } from '@/services/analytics';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '5');
    
    const topPosts = await getTopPosts(limit);
    
    return NextResponse.json({
      data: topPosts,
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error('Error in top-posts API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch top posts' },
      { status: 500 }
    );
  }
}