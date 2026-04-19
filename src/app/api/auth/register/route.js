import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  try {
    const { email, password, fullName, role } = await request.json();

    const existingUser = await prisma.user.findUnique({ where: { email } });
    const passwordHash = await bcrypt.hash(password, 10);
    const mockOtp = '123456'; // Standardized for prototyping

    if (existingUser) {
      if (!existingUser.isActivated) {
        const user = await prisma.user.update({
          where: { email },
          data: { fullName, passwordHash, role: role.toUpperCase(), otp: mockOtp }
        });
        return NextResponse.json({ message: 'OTP Reset', userId: user.id, mockOtp });
      }
      return NextResponse.json({ error: 'Email already in use' }, { status: 400 });
    }

    console.log(`[MOCK EMAIL] To: ${email} -> Your OTP is: ${mockOtp}`);

    const user = await prisma.user.create({
      data: {
        email,
        fullName,
        passwordHash,
        role: role.toUpperCase(),
        otp: mockOtp,
        isActivated: false
      }
    });

    return NextResponse.json({ 
      message: 'Registration successful', 
      userId: user.id,
      mockOtp 
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
  }
}
