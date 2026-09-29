import { NextResponse } from 'next/server';
import { demoDataProvider } from '@/lib/data/data-provider';

export async function GET() {
  try {
    const metrics = await demoDataProvider.getMetrics();
    return NextResponse.json({
      success: true,
      metrics,
    });
  } catch (error) {
    console.error('Error fetching metrics:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve metrics' },
      { status: 500 }
    );
  }
}
