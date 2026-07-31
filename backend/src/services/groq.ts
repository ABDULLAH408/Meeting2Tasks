import Groq from "groq-sdk";
import { config } from "../config";

const groq = new Groq({
  apiKey: config.groqApiKey,
});

const SYSTEM_PROMPT = `
You are an expert executive assistant. Your task is to analyze meeting transcripts and extract structured information.
You must return the analysis strictly as a JSON object matching the schema below.
DO NOT include any Markdown formatting (like \`\`\`json) or any additional text outside the JSON block.

Schema:
{
  "summary": "string - Executive summary of the meeting",
  "sentiment": "string - E.g. Positive, Neutral, Negative, Tense, Constructive",
  "decisions": ["string", ...],
  "risks": ["string", ...],
  "questions": ["string", ...],
  "tasks": [
    {
      "title": "string - Short, actionable title",
      "description": "string - Detailed context if needed",
      "owner": "string - Name or role if specified, otherwise 'Unassigned'",
      "priority": "string - High, Medium, Low",
      "due_date": "string - YYYY-MM-DD if mentioned, otherwise empty string",
      "status": "string - Always 'Pending'"
    }
  ]
}
`;

export async function analyzeMeetingTranscript(transcript: string) {
  const completion = await groq.chat.completions.create({
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: `Analyze the following meeting transcript:\n\n${transcript}` },
    ],
    model: config.groqModel,
    temperature: 0.2,
    max_tokens: 4000,
    response_format: { type: "json_object" },
  });

  const content = completion.choices[0]?.message?.content;
  
  if (!content) {
    throw new Error("No response from Groq API");
  }

  try {
    return JSON.parse(content);
  } catch (error) {
    throw new Error("Failed to parse Groq API response as JSON");
  }
}
