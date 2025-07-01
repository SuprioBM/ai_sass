import { NextRequest, NextResponse } from "next/server";
import { chatWithLLM } from "@/lib/ai/aiClient"; // your existing wrapper

export async function POST(req: NextRequest) {
  try {
    const { job, userData } = await req.json();

    if (!job?.description || !job?.title) {
      return NextResponse.json(
        { error: "Job information is incomplete" },
        { status: 400 }
      );
    }

    const systemPrompt = `
You are an expert resume assistant AI. Your task is to generate a highly personalized CV perfectly tailored to the provided job. 

This CV is being written specifically to apply for the provided job. All sections — including summary, skills, and experience descriptions — must be customized to strongly align with the job title, required qualifications, and job description.

🧠 Strict Rules:
- NEVER change or invent absolute factual data such as:
  • Full name, email, phone number
  • Company names, roles, dates in experience
  • School names, degrees, dates in education
  • Links like LinkedIn, GitHub, Portfolio
  • Certificate names or issuers
- Use only dynamic and soft fields (like summaries, descriptions, skills, languages) to optimize the CV.
- If user data is provided, use it as the base.
- If user data is missing, generate placeholder data that still feels realistic but clearly fictional.
- Tailor tone and skills to match the job description.
- Use first-person action-oriented tone (“Led”, “Built”, “Collaborated”).
- Return ONLY valid JSON with the structure described next — no extra explanation or formatting.

Required output JSON format:
\`\`\`json
{
  "name": "...",
  "email": "...",
  "phone": "...",
  "location": "...",
  "JobTitle": "...",
  "summary": "...",
  "linkedin": "...",
  "github": "...",
  "portfolio": "...",
  "education": [
    {
      "school": "...",
      "degree": "...",
      "startDate": "...",
      "endDate": "..."
    }
  ],
  "experience": [
    {
      "company": "...",
      "role": "...",
      "startDate": "...",
      "endDate": "...",
      "description": "..."
    }
  ],
  "skills": ["...", "..."],
  "languages": ["...", "..."],
  "projects": [
    {
      "name": "...",
      "description": "..."
    }
  ],
  "certificates": [
    {
      "name": "...",
      "issuer": "..."
    }
  ],
  "hobbies": ["...", "..."]
}
\`\`\`
`;

    const userPrompt = `
Job Description:
${job.title} (${job.location}) — ${job.type}
${job.description}

${
  userData && Object.keys(userData).length > 0
    ? `User Provided Data:
${JSON.stringify(userData, null, 2)}`
    : "No user data was provided. Please create a realistic CV fully tailored to the job."
}
`;

    const aiResponse = await chatWithLLM({
      systemPrompt,
      userContent: userPrompt,
      temperature: 0.7,
      max_tokens: 1600,
    });

    let cleaned = aiResponse.trim();

    // Try to extract JSON between triple backticks first
    const jsonMatch =
      cleaned.match(/```json([\s\S]*?)```/i) ||
      cleaned.match(/```([\s\S]*?)```/i);

    if (jsonMatch) {
      cleaned = jsonMatch[1].trim();
    } else {
      // If no backticks found, try to find first '{' and last '}' and slice JSON part
      const firstBrace = cleaned.indexOf("{");
      const lastBrace = cleaned.lastIndexOf("}");
      if (firstBrace !== -1 && lastBrace !== -1) {
        cleaned = cleaned.substring(firstBrace, lastBrace + 1);
      }
    }

    try {
      const parsed = JSON.parse(cleaned);
      console.log("Parsed AI JSON:", parsed);
      return NextResponse.json(parsed, { status: 200 });
    } catch (err) {
      console.error(
        "Failed to parse AI JSON:",
        err,
        "\nRaw AI response:",
        aiResponse
      );
      return NextResponse.json(
        {
          error:
            "AI response is not valid JSON. Please refine your prompt or check LLM output.",
          raw: aiResponse,
        },
        { status: 500 }
      );
    }
  } catch (err) {
    console.error("Failed to generate draft CV:", err);
    return NextResponse.json(
      { error: "AI generation failed or invalid JSON format" },
      { status: 500 }
    );
  }
}
