import { chatWithLLM } from "@/lib/ai/aiClient";

export async function POST(req: Request) {
  try {
    const {
      fullName,
      experience,
      jobDescription,
      companyName,
      jobTitle,
      tone = "professional",
    } = await req.json();

    const systemPrompt = `You are a cover letter writing assistant. Write a compelling, tailored cover letter using the user's experience and the job description. Keep the tone ${tone}, and follow standard cover letter structure (greeting, intro, body, closing).`;

    const userContent = `
Full Name: ${fullName}
Company Name: ${companyName}
Job Title: ${jobTitle}
Experience: ${experience}
Job Description: ${jobDescription}
    `.trim();

    const coverLetter = await chatWithLLM({ systemPrompt, userContent });

    return new Response(JSON.stringify({ coverLetter }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Cover Letter API Error:", error);
    return new Response(
      JSON.stringify({ error: typeof error === "object" && error !== null && "message" in error ? (error as { message?: string }).message : "Unknown error occurred" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
