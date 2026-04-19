import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { getSession } from '../../../../lib/auth';
import { revalidatePath } from 'next/cache';

export async function POST(request) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'FOUNDER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    
    let profile = await prisma.founderProfile.findUnique({
      where: { userId: session.userId }
    });

    if (!profile) {
      profile = await prisma.founderProfile.create({
        data: { userId: session.userId }
      });
    }

    const tech = await prisma.technology.create({
      data: {
        founderId: profile.id,
        title: data.title,
        subtitle: data.subtitle,
        sector: data.sector || 'Deep Tech',
        inventorName: data.inventorName,
        coInventors: data.coInventors,
        department: data.department,
        abstract: data.abstract,
        problemSolved: data.problemSolved,
        mechanism: data.mechanism,
        novelty: data.novelty,
        stageOfDev: data.stageOfDev,
        testEnvironment: data.testEnvironment,
        poCAvailable: Boolean(data.poCAvailable),
        patentStatus: data.patentStatus || 'Not Filed',
        publicDisclosureRisk: data.publicDisclosureRisk,
        competitorLandscape: data.competitorLandscape,
        fundingSource: data.fundingSource,
        sponsorObligations: data.sponsorObligations,
        targetIndustries: data.targetIndustries,
        adoptionFriction: data.adoptionFriction,
        capexEst: data.capexEst,
        roiBand: data.roiBand,
        regulatoryBurden: data.regulatoryBurden,
        marketInterest: data.marketInterest,
        visibility: data.visibility || 'Public',
        ndaRequired: Boolean(data.ndaRequired),
        trl: parseInt(data.trl) || 1,
        thumbnailUrl: data.thumbnailUrl,
      }
    });

    revalidatePath('/technologies');
    revalidatePath('/dashboard/founder');

    return NextResponse.json({ success: true, tech });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message || 'Failed to create technology' }, { status: 500 });
  }
}
