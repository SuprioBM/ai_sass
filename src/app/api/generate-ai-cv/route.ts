import { NextRequest, NextResponse } from "next/server";
import { chatWithLLM } from "@/lib/ai/aiClient";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      name,
      email,
      phone,
      location,
      linkedin,
      github,
      portfolio,
      skills = [],
      education = [],
      experience = [],
      projects = [],
      certificates = [],
      languages = [],
      jobDescription,
    } = body;

    console.log(
      name,
      email,
      phone,
      location,
      skills,
      education,
      experience,
      projects,
      certificates,
      languages,
      jobDescription,
      linkedin,
      github,
      portfolio
    );

    if (!jobDescription || !name || !email) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const systemPrompt = `
    You are a professional resume assistant specialized in enhancing candidate resumes.
    
    Your goal is to improve the descriptions, summaries, skills, and any textual fields (like project descriptions or certificates) so they sound dynamic, first-person, and aligned with the provided job description.
    
    Strict rules:
    - Do NOT change or invent company names, roles, dates, or factual data.
    - Do NOT overwrite any valid existing fields unless they are empty, missing, or contain meaningless placeholders such as "nothing", "N/A", "none", "no info", or any similar garbage text.
    - If a field contains meaningless or placeholder text, replace it with a meaningful and dynamic description aligned with the job description.
    - Do NOT add "Not provided" or any placeholders unless the field is missing or empty.
    - Keep the original JSON structure and keys exactly.
    - Keep the tone first-person active or resume-style action verbs like "Led", "Designed", "Implemented", "Collaborated".
    - Do NOT use third-person phrasing like "He managed..." or "The user was...".
    - Output strictly valid JSON only, no explanations or extra text.
    `;
    

    type Education = {
      school?: string;
      degree?: string;
      startDate?: string;
      endDate?: string;
    };

    type Experience = {
      company?: string;
      role?: string;
      startDate?: string;
      endDate?: string;
      description?: string;
    };

    type Project = {
      name?: string;
      description?: string;
    };

    type Certificate = {
      name?: string;
      issuer?: string;
    };

    const userPrompt = `
  Job Description:
  ${jobDescription.trim()}

  Candidate Information:
  Name: ${name.trim()}
  Email: ${email.trim()}
  Phone: ${phone?.trim() || "N/A"}
  Location: ${location?.trim() || "N/A"}
  LinkedIn: ${linkedin?.trim() || "N/A"}
  GitHub: ${github?.trim() || "N/A"}
  Portfolio: ${portfolio?.trim() || "N/A"}
  Skills: ${skills.map((s: string) => s.trim()).join(", ") || "N/A"}
  Languages: ${languages.map((l: string) => l.trim()).join(", ") || "N/A"}

  Education:
  ${
    (education as Education[]).length > 0
    ? (education as Education[])
      .map(
        (e) =>
        `- ${e.degree?.trim() || "N/A"} from ${
          e.school?.trim() || "N/A"
        } (${e.startDate || "N/A"} - ${e.endDate || "N/A"})`
      )
      .join("\n")
    : "N/A"
  }

  Experience:
  ${
    (experience as Experience[]).length > 0
    ? (experience as Experience[])
      .map(
        (e) =>
        `- ${e.role?.trim() || "N/A"} at ${e.company?.trim() || "N/A"} (${
          e.startDate || "N/A"
        } - ${e.endDate || "N/A"}): ${e.description?.trim() || ""}`
      )
      .join("\n")
    : "N/A"
  }

  Projects:
  ${
    (projects as Project[]).length > 0
    ? (projects as Project[])
      .map(
        (p) =>
        `- ${p.name?.trim() || "N/A"}: ${p.description?.trim() || ""}`
      )
      .join("\n")
    : "N/A"
  }

  Certificates:
  ${
    (certificates as Certificate[]).length > 0
    ? (certificates as Certificate[])
      .map(
        (c) =>
        `- ${c.name?.trim() || "N/A"}: ${c.issuer?.trim() || "N/A"}`
      )
      .join("\n")
    : "N/A"
  }

  Return the following JSON wrapped in triple backticks:
  \`\`\`json
  {
    "summary": "...",
    "skills": [...],
    "experience": [
    {
      "company": "...",
      "role": "...",
      "startDate": "...",
      "endDate": "...",
      "description": "..."
    }
    ],
    "education": [
    {
      "school": "...",
      "degree": "...",
      "startDate": "...",
      "endDate": "..."
    }
    ],
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
    "name": "...",
    "email": "...",
    "phone": "...",
    "location": "...",
    "linkedin": "...",
    "github": "...",
    "portfolio": "...",
    "languages": ["..."]
  }
  \`\`\`
    `;

    const aiResponse = await chatWithLLM({
      systemPrompt,
      userContent: userPrompt,
      temperature: 0.7,
      max_tokens: 1024,
    });

    try {
      let cleaned = aiResponse.trim();

      // Strip triple backticks and json marker if present
      cleaned = cleaned
        .replace(/^```json\s*/, "")
        .replace(/^```\s*/, "")
        .replace(/```$/, "")
        .trim();

      const parsed = JSON.parse(cleaned);
      return NextResponse.json(parsed, { status: 200 });
    } catch (e) {
      console.log("AI response is not valid JSON:", e);
      return NextResponse.json(
        {
          error:
            "AI response is not valid JSON. Please refine your prompt or check OpenRouter output.",
          raw: aiResponse,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("AI CV generation failed:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
