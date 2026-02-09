import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Crawl from '@/models/Crawl';
import CrawlRegistration from '@/models/CrawlRegistration';
import mongoose from 'mongoose';
import { requireAuth } from '@/lib/auth';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type Params = { params: Promise<{ id: string }> | { id: string } };

async function resolveParams(params: Params['params']) {
  return typeof (params as Promise<{ id: string }>).then === 'function'
    ? (params as Promise<{ id: string }>)
    : Promise.resolve(params as { id: string });
}

export async function GET(request: Request, { params }: Params) {
  try {
    await requireAuth();
  } catch {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  try {
    await connectDB();
    const { id } = await resolveParams(params);
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: 'Invalid crawl ID' }, { status: 400 });
    }
    const crawl = await Crawl.findById(id).lean();
    if (!crawl) {
      return NextResponse.json({ message: 'Crawl not found' }, { status: 404 });
    }
    const count = await CrawlRegistration.countDocuments({ crawlId: id, status: 'CONFIRMED' });
    return NextResponse.json({
      _id: crawl._id.toString(),
      id: crawl._id.toString(),
      name: crawl.name,
      location: crawl.location,
      address: crawl.address,
      date: crawl.date,
      time: crawl.time,
      endTime: crawl.endTime ?? '',
      borough: crawl.borough ?? '',
      capacity: crawl.capacity,
      available: crawl.available,
      coordinates: crawl.coordinates,
      description: crawl.description,
      _count: { registrations: count },
    });
  } catch (error) {
    console.error('Error fetching crawl:', error);
    return NextResponse.json({ message: 'Failed to fetch crawl' }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: Params) {
  try {
    await requireAuth();
  } catch {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  try {
    await connectDB();
    const { id } = await resolveParams(params);
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: 'Invalid crawl ID' }, { status: 400 });
    }
    const body = await request.json();
    const updateData: Record<string, unknown> = {};
    const allowed = ['name', 'location', 'address', 'date', 'time', 'endTime', 'borough', 'capacity', 'available', 'description'];
    for (const key of allowed) {
      if (body[key] !== undefined) updateData[key] = body[key];
    }
    if (body.coordinates !== undefined && Array.isArray(body.coordinates)) {
      updateData.coordinates = body.coordinates;
    }
    const crawl = await Crawl.findByIdAndUpdate(id, { $set: updateData }, { new: true }).lean();
    if (!crawl) {
      return NextResponse.json({ message: 'Crawl not found' }, { status: 404 });
    }
    const count = await CrawlRegistration.countDocuments({ crawlId: id, status: 'CONFIRMED' });
    return NextResponse.json({
      message: 'Crawl updated successfully',
      crawl: {
        _id: crawl._id.toString(),
        id: crawl._id.toString(),
        name: crawl.name,
        location: crawl.location,
        address: crawl.address,
        date: crawl.date,
        time: crawl.time,
        endTime: crawl.endTime ?? '',
        borough: crawl.borough ?? '',
        capacity: crawl.capacity,
        available: crawl.available,
        coordinates: crawl.coordinates,
        description: crawl.description,
        _count: { registrations: count },
      },
    });
  } catch (error) {
    console.error('Error updating crawl:', error);
    return NextResponse.json({ message: 'Failed to update crawl' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: Params) {
  try {
    await requireAuth();
  } catch {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  try {
    await connectDB();
    const { id } = await resolveParams(params);
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: 'Invalid crawl ID' }, { status: 400 });
    }
    const regCount = await CrawlRegistration.countDocuments({ crawlId: id });
    if (regCount > 0) {
      return NextResponse.json(
        { message: `Cannot delete: ${regCount} registration(s) exist for this crawl. Remove them first.` },
        { status: 400 }
      );
    }
    const deleted = await Crawl.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ message: 'Crawl not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Crawl deleted successfully' });
  } catch (error) {
    console.error('Error deleting crawl:', error);
    return NextResponse.json({ message: 'Failed to delete crawl' }, { status: 500 });
  }
}
