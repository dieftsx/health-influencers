
import { NextResponse } from 'next/server';

// This is a mock database. In a real application, you would fetch this data from your actual database.
const influencers = [
  {
    id: 1,
    name: "Dr. Health Guru",
    trustScore: 85,
    followers: "1.2M",
    verifiedClaims: 120,
    questionableClaims: 15,
    claims: [
      {
        id: 1,
        claim: "Eating blueberries can improve memory",
        status: "Verified",
        confidence: 92,
        category: "Nutrition",
      },
      {
        id: 2,
        claim: "Drinking lemon water cures cancer",
        status: "Debunked",
        confidence: 98,
        category: "Medicine",
      },
      {
        id: 3,
        claim: "Meditation reduces stress levels",
        status: "Verified",
        confidence: 88,
        category: "Mental Health",
      },
    ],
    recentActivity: [
      { date: "2023-06-01", trustScore: 82 },
      { date: "2023-06-08", trustScore: 84 },
      { date: "2023-06-15", trustScore: 83 },
      { date: "2023-06-22", trustScore: 85 },
      { date: "2023-06-29", trustScore: 85 },
    ],
  },
  // Add more influencers as needed
];

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id);
  const influencer = influencers.find(inf => inf.id === id);

  if (influencer) {
    return NextResponse.json({ success: true, influencer });
  } else {
    return NextResponse.json(
      { success: false, error: 'Influencer not found' },
      { status: 404 }
    );
  }
}

