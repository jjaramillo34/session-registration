import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import CrawlRegistration from '@/models/CrawlRegistration';
import mongoose from 'mongoose';
import { requireAuth } from '@/lib/auth';
import { RegistrationStatus } from '@/types/registration';

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
      return NextResponse.json({ message: 'Invalid registration ID' }, { status: 400 });
    }

    const reg = await CrawlRegistration.findById(id).populate('crawlId').lean();
    if (!reg) {
      return NextResponse.json({ message: 'Crawl registration not found' }, { status: 404 });
    }

    const crawl = reg.crawlId as any;
    return NextResponse.json({
      _id: reg._id.toString(),
      name: reg.name,
      email: reg.email,
      status: reg.status,
      emailSent: reg.emailSent ?? false,
      crawlId: reg.crawlId?._id?.toString() ?? null,
      crawlName: crawl?.name ?? '',
      crawlLocation: crawl?.location ?? '',
      crawlAddress: crawl?.address ?? '',
      crawlDate: crawl?.date ?? '',
      crawlTime: crawl?.time ?? '',
      crawlEndTime: crawl?.endTime ?? '',
      createdAt: reg.createdAt ? new Date(reg.createdAt).toISOString() : '',
      updatedAt: reg.updatedAt ? new Date(reg.updatedAt).toISOString() : '',
    });
  } catch (error) {
    console.error('Error fetching crawl registration:', error);
    return NextResponse.json(
      { message: 'Failed to fetch crawl registration' },
      { status: 500 }
    );
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
      return NextResponse.json({ message: 'Invalid registration ID' }, { status: 400 });
    }

    const body = await request.json();
    const { name, email, status, emailSent } = body;
    const updateData: Record<string, unknown> = {};

    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email;
    if (emailSent !== undefined) updateData.emailSent = Boolean(emailSent);
    if (status !== undefined) {
      if (!Object.values(RegistrationStatus).includes(status)) {
        return NextResponse.json({ message: 'Invalid status' }, { status: 400 });
      }
      updateData.status = status;
    }

    const updated = await CrawlRegistration.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    )
      .populate('crawlId')
      .lean();

    if (!updated) {
      return NextResponse.json({ message: 'Crawl registration not found' }, { status: 404 });
    }

    const crawl = updated.crawlId as any;
    return NextResponse.json({
      message: 'Crawl registration updated successfully',
      registration: {
        _id: updated._id.toString(),
        name: updated.name,
        email: updated.email,
        status: updated.status,
        emailSent: updated.emailSent ?? false,
        crawlId: updated.crawlId?._id?.toString() ?? null,
        crawlName: crawl?.name ?? '',
        crawlLocation: crawl?.location ?? '',
        crawlAddress: crawl?.address ?? '',
        crawlDate: crawl?.date ?? '',
        crawlTime: crawl?.time ?? '',
        crawlEndTime: crawl?.endTime ?? '',
        createdAt: updated.createdAt ? new Date(updated.createdAt).toISOString() : '',
        updatedAt: updated.updatedAt ? new Date(updated.updatedAt).toISOString() : '',
      },
    });
  } catch (error) {
    console.error('Error updating crawl registration:', error);
    return NextResponse.json(
      { message: 'Failed to update crawl registration' },
      { status: 500 }
    );
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
      return NextResponse.json({ message: 'Invalid registration ID' }, { status: 400 });
    }

    const deleted = await CrawlRegistration.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ message: 'Crawl registration not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Crawl registration deleted successfully' });
  } catch (error) {
    console.error('Error deleting crawl registration:', error);
    return NextResponse.json(
      { message: 'Failed to delete crawl registration' },
      { status: 500 }
    );
  }
}
