import { NextRequest, NextResponse } from 'next/server';
import { demoDataProvider } from '@/lib/data/data-provider';
import { IssueCategory, UrgencyLevel } from '@/lib/types';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const state = searchParams.get('state') || undefined;
    const district = searchParams.get('district') || undefined;
    const category = (searchParams.get('category') as IssueCategory) || undefined;
    const language = searchParams.get('language') || undefined;
    const urgency = (searchParams.get('urgency') as UrgencyLevel) || undefined;
    const searchQuery = searchParams.get('q') || undefined;

    const reports = await demoDataProvider.getReports({
      state,
      district,
      category,
      language,
      urgency,
      searchQuery,
    });

    return NextResponse.json({
      success: true,
      count: reports.length,
      reports,
    });
  } catch (error) {
    console.error('Error fetching reports:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve reports' },
      { status: 500 }
    );
  }
}
