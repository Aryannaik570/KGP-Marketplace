import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { createSession } from '../../../../lib/auth';

export async function POST(request) {
  try {
    const { userId, otp } = await request.json();

    const user = await prisma.user.findUnique({ where: { id: userId } });
    
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
    
    if (user.otp !== otp) return NextResponse.json({ error: 'Invalid OTP' }, { status: 400 });

    // Update user to activated
    await prisma.user.update({
      where: { id: userId },
      data: { isActivated: true, otp: null }
    });

    // Create session
    await createSession(user.id, user.role, user.fullName);

    return NextResponse.json({ message: 'Verified successfully', role: user.role });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 });
  }
}
