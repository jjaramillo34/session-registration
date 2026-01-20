import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Registration from '@/models/Registration';
import mongoose from 'mongoose';
import { requireAuth } from '@/lib/auth';
import { RegistrationStatus, Language } from '@/types/registration';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// GET single registration by ID
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    // Check authentication
    try {
      await requireAuth();
    } catch (authError) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    await connectDB();

    // Handle Next.js 16 async params
    const resolvedParams = await Promise.resolve(params);
    const registrationId = resolvedParams.id;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(registrationId)) {
      return NextResponse.json(
        { message: 'Invalid registration ID' },
        { status: 400 }
      );
    }

    const registration = await Registration.findById(registrationId).lean();

    if (!registration) {
      return NextResponse.json(
        { message: 'Registration not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ...registration,
      _id: registration._id.toString(),
      sessionId: registration.sessionId.toString(),
    });
  } catch (error) {
    console.error('Error fetching registration:', error);
    return NextResponse.json(
      { message: 'Failed to fetch registration' },
      { status: 500 }
    );
  }
}

// PATCH update registration
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    // Check authentication
    try {
      await requireAuth();
    } catch (authError) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    await connectDB();

    // Handle Next.js 16 async params
    const resolvedParams = await Promise.resolve(params);
    const registrationId = resolvedParams.id;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(registrationId)) {
      return NextResponse.json(
        { message: 'Invalid registration ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { name, email, language, agencyName, isNYCPSStaff, status, emailSent } = body;

    // Build update object
    const updateData: any = {};

    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email;
    if (language !== undefined) {
      if (!Object.values(Language).includes(language)) {
        return NextResponse.json(
          { message: 'Invalid language' },
          { status: 400 }
        );
      }
      updateData.language = language;
    }
    if (agencyName !== undefined) updateData.agencyName = agencyName;
    if (isNYCPSStaff !== undefined) updateData.isNYCPSStaff = isNYCPSStaff;
    if (status !== undefined) {
      if (!Object.values(RegistrationStatus).includes(status)) {
        return NextResponse.json(
          { message: 'Invalid status' },
          { status: 400 }
        );
      }
      updateData.status = status;
    }
    if (emailSent !== undefined) updateData.emailSent = emailSent;

    const registration = await Registration.findById(registrationId);
    if (!registration) {
      return NextResponse.json(
        { message: 'Registration not found' },
        { status: 404 }
      );
    }

    const updatedRegistration = await Registration.findByIdAndUpdate(
      registrationId,
      { $set: updateData },
      { new: true }
    ).lean();

    return NextResponse.json({
      message: 'Registration updated successfully',
      registration: {
        ...updatedRegistration,
        _id: updatedRegistration!._id.toString(),
        sessionId: updatedRegistration!.sessionId.toString(),
      },
    });
  } catch (error) {
    console.error('Error updating registration:', error);
    return NextResponse.json(
      { message: 'Failed to update registration' },
      { status: 500 }
    );
  }
}

// DELETE registration
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    // Check authentication
    try {
      await requireAuth();
    } catch (authError) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    await connectDB();

    // Handle Next.js 16 async params
    const resolvedParams = await Promise.resolve(params);
    const registrationId = resolvedParams.id;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(registrationId)) {
      return NextResponse.json(
        { message: 'Invalid registration ID' },
        { status: 400 }
      );
    }

    const registration = await Registration.findByIdAndDelete(registrationId);

    if (!registration) {
      return NextResponse.json(
        { message: 'Registration not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Registration deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting registration:', error);
    return NextResponse.json(
      { message: 'Failed to delete registration' },
      { status: 500 }
    );
  }
}
