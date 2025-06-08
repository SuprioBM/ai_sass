import { chatWithLLM } from "@/lib/ai/aiClient";

export async function POST(req: Request) {
  try {
    const { experience, jobDescription } = await req.json();

    const systemPrompt = `You are a professional resume writer. Generate 5 impactful resume bullet points based on the experience and job description. Each bullet point should start with a strong action verb.`;

    const userContent = `Experience:\n${experience}\n\nJob Description:\n${jobDescription}`;

    const bulletPoints = await chatWithLLM({ systemPrompt, userContent });

    return new Response(JSON.stringify({ bulletPoints }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Bullet Point API Error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Unknown error occurred" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
