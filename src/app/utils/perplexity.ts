
import axios from 'axios';

const PERPLEXITY_API_URL = 'https://api.perplexity.ai';

export async function analyzeInfluencerContent(influencerName: string) {
  const response = await axios.post(`${PERPLEXITY_API_URL}/analyze`, {
    query: `Analyze recent health-related content from ${influencerName}`,
  }, {
    headers: {
      'Authorization': `Bearer ${process.env.PERPLEXITY_API_KEY}`,
    },
  });

  return response.data;
}

export async function identifyHealthClaims(content: string) {
  const response = await axios.post(`${PERPLEXITY_API_URL}/extract`, {
    query: `Identify health claims from the following content: ${content}`,
  }, {
    headers: {
      'Authorization': `Bearer ${process.env.PERPLEXITY_API_KEY}`,
    },
  });

  return response.data;
}

export async function verifyClaim(claim: string) {
  const response = await axios.post(`${PERPLEXITY_API_URL}/verify`, {
    query: `Verify the following health claim against trusted scientific journals: ${claim}`,
  }, {
    headers: {
      'Authorization': `Bearer ${process.env.PERPLEXITY_API_KEY}`,
    },
  });

  return response.data;
}

