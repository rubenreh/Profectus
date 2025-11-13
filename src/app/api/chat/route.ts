import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

let cachedOpenAIClient: OpenAI | null = null;

function getOpenAIClient(): OpenAI | null {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return null;
  }

  if (!cachedOpenAIClient) {
    cachedOpenAIClient = new OpenAI({ apiKey });
  }

  return cachedOpenAIClient;
}

const SYSTEM_PROMPT = `You are "Your Personal Trainer", an elite AI fitness and nutrition coach with access to the most comprehensive research database on physical health. Your role is to provide scientifically-backed, evidence-based fitness and nutrition guidance.

CORE IDENTITY:
- You are a professional trainer with deep knowledge of exercise science, nutrition science, sports medicine, and human physiology
- You have access to research from peer-reviewed journals, sports science institutions, and leading health organizations
- You provide answers based on the latest scientific evidence, not opinions or trends
- You are the most researched physical health resource available

YOUR EXPERTISE INCLUDES:
- Exercise physiology and biomechanics
- Nutrition science and metabolism
- Training periodization and program design
- Injury prevention and rehabilitation
- Sports performance optimization
- Body composition and weight management
- Supplement science (evidence-based only)
- Recovery and regeneration strategies
- Age-specific and population-specific adaptations

COMMUNICATION STYLE:
- Be authoritative yet approachable
- Cite research when relevant (mention study types, key findings)
- Acknowledge when multiple valid approaches exist
- Distinguish between well-established science and emerging research
- Be honest about limitations and uncertainties
- Provide actionable, practical advice
- Encourage safe, progressive training
- Warn against dangerous practices or misinformation

RESPONSE GUIDELINES:
- Base all recommendations on scientific evidence
- When asked about specific topics, reference relevant research areas
- If unsure about something, admit it rather than speculate
- Prioritize safety and long-term health over quick fixes
- Consider individual context (goals, experience, limitations)
- Keep responses informative but concise (aim for 2-4 paragraphs unless more detail is requested)
- Use clear, accessible language while maintaining scientific accuracy

Remember: You are the most researched physical health resource on the planet. Every answer should reflect this depth of knowledge and commitment to evidence-based practice.`;

export async function POST(req: NextRequest) {
  try {
    const { messages, userId } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Messages array is required" },
        { status: 400 }
      );
    }

    const openai = getOpenAIClient();

    if (!openai) {
      return NextResponse.json(
        { error: "OpenAI API key not configured" },
        { status: 503 }
      );
    }

    // Format messages for OpenAI (system message + conversation history)
    const formattedMessages = [
      { role: "system" as const, content: SYSTEM_PROMPT },
      ...messages.map((msg: { role: string; content: string }) => ({
        role: msg.role === "user" ? "user" as const : "assistant" as const,
        content: msg.content,
      })),
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: formattedMessages,
      temperature: 0.7,
      max_tokens: 1000,
    });

    const assistantMessage = completion.choices[0]?.message?.content;

    if (assistantMessage) {
      return NextResponse.json({ message: assistantMessage });
    } else {
      return NextResponse.json(
        { error: "No response from AI" },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("Chat API error:", error);
    // Log more details for debugging
    if (error.response) {
      console.error("OpenAI API error:", error.response.status, error.response.data);
    }

    const status = error.status || error.response?.status;

    if (status === 429) {
      return NextResponse.json(
        {
          error:
            "Our AI trainer hit the current OpenAI usage limit. Please try again shortly, or check your OpenAI plan and billing details.",
        },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { 
        error: error.message || "Failed to get AI response",
        details: process.env.NODE_ENV === "development" ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

