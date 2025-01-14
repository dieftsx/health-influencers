
export interface Influencer {
  id: number;
  name: string;
  username: string;
  profilePicture: string;
  followers: number;
  trustScore: number;
  verifiedClaims: number;
  questionableClaims: number;
  recentClaims: {
    claim: string;
    verifications: {
      service: string;
      isVerified: boolean;
      confidence: number;
      explanation: string;
    }[];
  }[];
}

export const mockInfluencers: Influencer[] = [
  {
    id: 1,
    name: "Dr. Health Guru",
    username: "@healthguru",
    profilePicture: "https://i.pravatar.cc/150?img=1",
    followers: 1200000,
    trustScore: 85,
    verifiedClaims: 120,
    questionableClaims: 15,
    recentClaims: [
      {
        claim: "Regular exercise can improve cognitive function",
        verifications: [
          {
            service: "Consensus",
            isVerified: true,
            confidence: 92,
            explanation: "Multiple studies support this claim."
          },
          {
            service: "Perplexity",
            isVerified: true,
            confidence: 89,
            explanation: "Scientific literature consistently shows a positive correlation."
          },
          {
            service: "OpenAI",
            isVerified: true,
            confidence: 95,
            explanation: "Extensive research confirms the cognitive benefits of regular exercise."
          }
        ]
      },
      {
        claim: "Drinking lemon water cures cancer",
        verifications: [
          {
            service: "Consensus",
            isVerified: false,
            confidence: 98,
            explanation: "No scientific evidence supports this claim."
          },
          {
            service: "Perplexity",
            isVerified: false,
            confidence: 97,
            explanation: "This claim is not supported by medical research."
          },
          {
            service: "OpenAI",
            isVerified: false,
            confidence: 99,
            explanation: "This is a common misconception with no scientific basis."
          }
        ]
      }
    ]
  },
  {
    id: 2,
    name: "Fitness Fanatic",
    username: "@fitfanatic",
    profilePicture: "https://i.pravatar.cc/150?img=2",
    followers: 800000,
    trustScore: 78,
    verifiedClaims: 95,
    questionableClaims: 22,
    recentClaims: [
      {
        claim: "High-intensity interval training burns more calories than steady-state cardio",
        verifications: [
          {
            service: "Consensus",
            isVerified: true,
            confidence: 87,
            explanation: "Research supports this claim for short-term calorie burn."
          },
          {
            service: "Perplexity",
            isVerified: true,
            confidence: 85,
            explanation: "Studies show HIIT is more efficient for calorie burning in less time."
          },
          {
            service: "OpenAI",
            isVerified: true,
            confidence: 90,
            explanation: "Scientific literature consistently supports the efficiency of HIIT."
          }
        ]
      }
    ]
  },
  {
    id: 3,
    name: "Nutrition Ninja",
    username: "@nutritionninja",
    profilePicture: "https://i.pravatar.cc/150?img=3",
    followers: 500000,
    trustScore: 92,
    verifiedClaims: 150,
    questionableClaims: 8,
    recentClaims: [
      {
        claim: "A balanced diet rich in fruits and vegetables can lower the risk of chronic diseases",
        verifications: [
          {
            service: "Consensus",
            isVerified: true,
            confidence: 96,
            explanation: "Extensive research supports this claim across multiple studies."
          },
          {
            service: "Perplexity",
            isVerified: true,
            confidence: 98,
            explanation: "Consistent evidence from long-term studies confirms this benefit."
          },
          {
            service: "OpenAI",
            isVerified: true,
            confidence: 97,
            explanation: "This claim is well-established in nutritional science."
          }
        ]
      }
    ]
  }
];

