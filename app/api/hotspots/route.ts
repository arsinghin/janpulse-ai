import { NextRequest, NextResponse } from 'next/server';
import { demoDataProvider } from '@/lib/data/data-provider';
import { IssueCategory, UrgencyLevel } from '@/lib/types';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const state = searchParams.get('state') || undefined;
    const district = searchParams.get('district') || undefined;
    const category = (searchParams.get('category') as IssueCategory) || undefined;
    const urgency = (searchParams.get('urgency') as UrgencyLevel) || undefined;
    const status = searchParams.get('status') || undefined;
    const searchQuery = searchParams.get('q') || undefined;

    const hotspots = await demoDataProvider.getHotspots({
      state,
      district,
      category,
      urgency,
      status,
      searchQuery,
    });

    return NextResponse.json({
      success: true,
      count: hotspots.length,
      hotspots,
    });
  } catch (error) {
    console.error('Error fetching hotspots:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve hotspots' },
      { status: 500 }
    );
  }
}
