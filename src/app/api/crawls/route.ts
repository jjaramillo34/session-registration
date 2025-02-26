import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const crawls = await prisma.crawl.findMany({
      where: {
        available: true,
      },
      include: {
        _count: {
          select: {
            registrations: true
          }
        }
      },
      orderBy: [
        { name: 'asc' }
      ]
    });

    return NextResponse.json(crawls);
  } catch (error) {
    console.error('Failed to fetch crawls:', error);
    return NextResponse.json(
      { error: 'Failed to fetch crawls' },
      { status: 500 }
    );
  }
} 