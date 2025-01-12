
import { NextResponse } from 'next/server';
import { verifyClaimWithAllServices } from '@/utils/ai-services';

// This is mock data - in a real application, this would come from your database
const influencers = [
  {
    id: 1,
    name: "Dr. Health Guru",
    trustScore: 85,
    followers: "1.2M",
    verifiedClaims: 120,
    questionableClaims: 15,
    recentClaims: [
      {
        id: 1,
        text: "Regular exercise can improve cognitive function",
        verifications: [],
        aggregateScore: 0
      },
      {
        id: 2,
        text: "Meditation reduces cortisol levels",
        verifications: [],
        aggregateScore: 0
      }
    ]
  },
  {
    id: 2,
    name: "FitnessFanatic",
    trustScore: 72,
    followers: "800K",
    verifiedClaims: 95,
    questionableClaims: 28,
    recentClaims: [
      {
        id: 3,
        text: "High-intensity interval training burns more calories than steady-state cardio",
        verifications: [],
        aggregateScore: 0
      }
    ]
  },
  // Add more influencers as needed
];

export async function GET() {
  try {
    // Verify recent claims for each influencer using all AI services
    const verifiedInfluencers = await Promise.all(
      influencers.map(async (influencer) => {
        const verifiedClaims = await Promise.all(
          influencer.recentClaims.map(async (claim) => {
            try {
              const verificationResults = await verifyClaimWithAllServices(claim.text);
              return {
                ...claim,
                verifications: [
                  {
                    service: 'Consensus',
                    result: verificationResults.consensus
                  },
                  {
                    service: 'Perplexity',
                    result: verificationResults.perplexity
                  },
                  {
                    service: 'OpenAI',
                    result: verificationResults.openai
                  }
                ],
                aggregateScore: verificationResults.aggregateScore
              };
            } catch (error) {
              console.error(`Error verifying claim: ${claim.text}`, error);
              return {
                ...claim,
                verifications: [],
                aggregateScore: 0
              };
            }
          })
        );

        return {
          ...influencer,
          recentClaims: verifiedClaims
        };
      })
    );

    return NextResponse.json({ 
      success: true, 
      influencers: verifiedInfluencers 
    });
  } catch (error) {
    console.error('Error processing influencers:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process influencers' },
      { status: 500 }
    );
  }
}

