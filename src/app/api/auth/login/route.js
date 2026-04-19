import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import bcrypt from 'bcryptjs';
import { createSession } from '../../../../lib/auth';

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });

    if (!user.isActivated) {
      return NextResponse.json({ error: 'Account not verified. Please complete OTP.' }, { status: 403 });
    }

    await createSession(user.id, user.role, user.fullName);

    return NextResponse.json({ message: 'Logged in successfully', role: user.role });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}
