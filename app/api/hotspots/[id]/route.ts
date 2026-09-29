import { NextRequest, NextResponse } from 'next/server';
import { demoDataProvider } from '@/lib/data/data-provider';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const hotspot = await demoDataProvider.getHotspotById(id);

    if (!hotspot) {
      return NextResponse.json(
        { success: false, error: 'Hotspot not found' },
        { status: 404 }
      );
    }

    const allReports = await demoDataProvider.getReports();
    const linkedReports = allReports.filter(
      (r) => r.clusterId === hotspot.id || hotspot.reportIds.includes(r.id)
    );

    return NextResponse.json({
      success: true,
      hotspot,
      linkedReports,
    });
  } catch (error) {
    console.error('Error fetching hotspot detail:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve hotspot' },
      { status: 500 }
    );
  }
}
