import { NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma';
import { revalidatePath } from 'next/cache';
import { deletedIds } from '../../../../../lib/deletedIds';

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;

    if (id.startsWith('su-')) {
      deletedIds.add(id);
    } else {
      await prisma.startup.delete({
        where: { id }
      });
    }

    revalidatePath('/startups');
    revalidatePath('/dashboard/founder');
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to delete startup' }, { status: 500 });
  }
}
