
import axios from 'axios';
import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';

interface VerificationResult {
  isVerified: boolean;
  confidence: number;
  sources: string[];
  explanation: string;
}

export async function verifyWithConsensus(claim: string): Promise<VerificationResult> {
  const apiKey = process.env.CONSENSUS_API_KEY;
  if (!apiKey) {
    console.error('Consensus API key is not set');
    return {
      isVerified: false,
      confidence: 0,
      sources: [],
      explanation: 'Unable to verify due to missing API key'
    };
  }

  try {
    const response = await axios.post('https://api.consensus.app/v1/search', {
      query: claim,
      limit: 5
    }, {
      headers: {
        'Authorization': `Bearer ${apiKey}`
      }
    });

    const papers = response.data.results;
    const supportingPapers = papers.filter((paper: any) => 
      paper.relevanceScore > 0.7 && paper.supportScore > 0.6
    );

    return {
      isVerified: supportingPapers.length > 0,
      confidence: supportingPapers.length / papers.length * 100,
      sources: supportingPapers.map((paper: any) => paper.url),
      explanation: `Found ${supportingPapers.length} supporting papers out of ${papers.length} relevant papers.`
    };
  } catch (error) {
    console.error('Consensus API error:', error);
    return {
      isVerified: false,
      confidence: 0,
      sources: [],
      explanation: 'Error occurred while verifying with Consensus'
    };
  }
}

export async function verifyWithPerplexity(claim: string): Promise<VerificationResult> {
  const apiKey = process.env.PERPLEXITY_API_KEY;
  if (!apiKey) {
    console.error('Perplexity API key is not set');
    return {
      isVerified: false,
      confidence: 0,
      sources: [],
      explanation: 'Unable to verify due to missing API key'
    };
  }

  try {
    const response = await axios.post('https://api.perplexity.ai/verify', {
      query: claim
    }, {
      headers: {
        'Authorization': `Bearer ${apiKey}`
      }
    });

    return {
      isVerified: response.data.verification_score > 0.7,
      confidence: response.data.verification_score * 100,
      sources: response.data.sources || [],
      explanation: response.data.explanation
    };
  } catch (error) {
    console.error('Perplexity API error:', error);
    return {
      isVerified: false,
      confidence: 0,
      sources: [],
      explanation: 'Error occurred while verifying with Perplexity'
    };
  }
}

export async function verifyWithOpenAI(claim: string): Promise<VerificationResult> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.error('OpenAI API key is not set');
    return {
      isVerified: false,
      confidence: 0,
      sources: [],
      explanation: 'Unable to verify due to missing API key'
    };
  }

  try {
    const { text } = await generateText({
      model: openai('gpt-4'),
      prompt: `Verify the following health claim and provide scientific evidence: "${claim}"
              Format your response as JSON with the following fields:
              - isVerified (boolean)
              - confidence (number between 0-100)
              - sources (array of URLs)
              - explanation (string)`,
    });

    const result = JSON.parse(text);
    return result;
  } catch (error) {
    console.error('OpenAI API error:', error);
    return {
      isVerified: false,
      confidence: 0,
      sources: [],
      explanation: 'Error occurred while verifying with OpenAI'
    };
  }
}

export async function verifyClaimWithAllServices(claim: string): Promise<{
  consensus: VerificationResult;
  perplexity: VerificationResult;
  openai: VerificationResult;
  aggregateScore: number;
}> {
  const [consensusResult, perplexityResult, openaiResult] = await Promise.all([
    verifyWithConsensus(claim),
    verifyWithPerplexity(claim),
    verifyWithOpenAI(claim)
  ]);

  const aggregateScore = (
    (consensusResult.confidence + perplexityResult.confidence + openaiResult.confidence) / 3
  );

  return {
    consensus: consensusResult,
    perplexity: perplexityResult,
    openai: openaiResult,
    aggregateScore
  };
}

