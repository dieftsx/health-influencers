
import axios from 'axios';
import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';

interface VerificationResult {
  isVerified: boolean;
  confidence: number;
  explanation: string;
}

export async function verifyWithConsensus(claim: string): Promise<VerificationResult> {
  const apiKey = process.env.CONSENSUS_API_KEY;
  if (!apiKey) {
    throw new Error('Consensus API key is not set');
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
      confidence: (supportingPapers.length / papers.length) * 100,
      explanation: `Found ${supportingPapers.length} supporting papers out of ${papers.length} relevant papers.`
    };
  } catch (error) {
    console.error('Consensus API error:', error);
    throw error;
  }
}

export async function verifyWithPerplexity(claim: string): Promise<VerificationResult> {
  const apiKey = process.env.PERPLEXITY_API_KEY;
  if (!apiKey) {
    throw new Error('Perplexity API key is not set');
  }

  try {
    const response = await axios.post('https://api.perplexity.ai/chat/completions', {
      model: "pplx-7b-chat",
      messages: [
        {
          role: "system",
          content: "You are an AI assistant tasked with verifying health claims. Analyze the given claim and provide a verification result."
        },
        {
          role: "user",
          content: `Verify the following health claim: "${claim}"`
        }
      ]
    }, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    const aiResponse = response.data.choices[0].message.content;
    
    // Parse the AI response to determine verification result
    const isVerified = aiResponse.toLowerCase().includes('verified') || aiResponse.toLowerCase().includes('supported by evidence');
    const confidence = isVerified ? 80 : 20; // Simplified confidence calculation

    return {
      isVerified,
      confidence,
      explanation: aiResponse
    };
  } catch (error) {
    console.error('Perplexity API error:', error);
    throw error;
  }
}

export async function verifyWithOpenAI(claim: string): Promise<VerificationResult> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OpenAI API key is not set');
  }

  try {
    const { text } = await generateText({
      model: openai('gpt-4'),
      prompt: `Verify the following health claim and provide scientific evidence: "${claim}"
              Format your response as JSON with the following fields:
              - isVerified (boolean)
              - confidence (number between 0-100)
              - explanation (string)`,
    });

    const result = JSON.parse(text);
    return result;
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw error;
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

