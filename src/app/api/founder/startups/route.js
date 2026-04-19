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

    const startup = await prisma.startup.create({
      data: {
        founderId: profile.id,
        name: data.name,
        tagline: data.tagline,
        website: data.website,
        foundedDate: data.foundedDate,
        headquarters: data.headquarters,
        industry: data.industry || 'Deep Tech',
        shortDesc: data.shortDesc,
        problem: data.problem,
        solution: data.solution,
        urgencyWhyNow: data.urgencyWhyNow,
        differentiation: data.differentiation,
        targetCustomer: data.targetCustomer,
        businessModel: data.businessModel,
        pricingModel: data.pricingModel,
        salesMotion: data.salesMotion,
        primaryMetric: data.primaryMetric,
        userCount: data.userCount,
        revenueARR: data.revenueARR,
        retention: data.retention,
        growthRate: data.growthRate,
        currentRaise: data.currentRaise,
        fundingRequired: data.fundingRequired,
        amountRaised: data.amountRaised,
        valuationRange: data.valuationRange,
        burnRate: data.burnRate,
        runway: data.runway,
        useOfFunds: data.useOfFunds,
        keyEmployees: data.keyEmployees,
        advisors: data.advisors,
        boardMembers: data.boardMembers,
        targetMarket: data.targetMarket,
        icp: data.icp,
        competitorSet: data.competitorSet,
        coreIp: data.coreIp,
        technicalMoat: data.technicalMoat,
        universityLinkage: data.universityLinkage,
        labOrigin: data.labOrigin,
        pilots: data.pilots,
        customers: data.customers,
        lois: data.lois,
        grants: data.grants,
        confidentiality: data.confidentiality || 'Public',
        incubationStatus: data.incubationStatus,
        b2bClassification: data.b2bClassification,
        commercialReadiness: data.commercialReadiness,
        esgClimateTag: data.esgClimateTag,
        logoUrl: data.logoUrl,
        bannerUrl: data.bannerUrl,
      }
    });

    revalidatePath('/startups');
    revalidatePath('/dashboard/founder');

    return NextResponse.json({ success: true, startup });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message || 'Failed to create startup' }, { status: 500 });
  }
}
