import { NextResponse } from 'next/server';
import { getTopUsers } from '@/services/analytics';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '5');
    
    const topUsers = await getTopUsers(limit);
    
    return NextResponse.json({
      data: topUsers,
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error('Error in top-users API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch top users' },
      { status: 500 }
    );
  }
}
