import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const user = await getAuthUser();

    if (!user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Fetch user details from database
    await connectDB();
    const userDoc = await User.findById(user.userId).select('name email role').lean();

    if (!userDoc) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      user: {
        name: userDoc.name,
        email: userDoc.email,
        role: userDoc.role,
      },
    });
  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json(
      { message: 'Unauthorized' },
      { status: 401 }
    );
  }
}
