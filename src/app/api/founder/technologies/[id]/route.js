import { NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma';
import { revalidatePath } from 'next/cache';
import { deletedIds } from '../../../../../lib/deletedIds';

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;

    // Handle static mock data deletion using the in-memory cache
    if (id.startsWith('tech-')) {
      deletedIds.add(id);
    } else {
      // Handle physical database row deletions
      await prisma.technology.delete({
        where: { id }
      });
    }

    revalidatePath('/technologies');
    revalidatePath('/dashboard/founder');
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to delete technology' }, { status: 500 });
  }
}
