import { NextResponse } from 'next/server';
import { analyzeInfluencerContent, identifyHealthClaims, verifyClaim } from '@/utils/perplexity';

export async function POST(req: Request) {
  const { influencerName } = await req.json();

  try {
    // Step 1: Analyze influencer content
    const content = await analyzeInfluencerContent(influencerName);

    // Step 2: Identify health claims
    const claims = await identifyHealthClaims(content);

    // Step 3: Verify each claim
    const verifiedClaims = await Promise.all(
      claims.map(async (claim: string) => {
        const verificationResult = await verifyClaim(claim);
        return {
          claim,
          ...verificationResult,
        };
      })
    );

    return NextResponse.json({ success: true, claims: verifiedClaims });
  } catch (error) {
    console.error('Error analyzing influencer:', error);
    return NextResponse.json({ success: false, error: 'Failed to analyze influencer' }, { status: 500 });
  }
}


