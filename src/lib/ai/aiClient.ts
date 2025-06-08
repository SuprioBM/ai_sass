import OpenAI from "openai";
import { ChatCompletionMessageParam } from "openai/resources/chat/index.mjs";

const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY || "", // Make sure this is set in your .env
  baseURL: "https://openrouter.ai/api/v1",
  defaultHeaders: {
    "HTTP-Referer": "https://yourdomain.com", // Replace with your domain if required by OpenRouter
    "X-Title": "AI Job Prep Assistant",
  },
});

export async function chatWithLLM({
  systemPrompt,
  userContent,
  temperature = 0.7,
  max_tokens = 512,
  retries = 2,
}: {
  systemPrompt: string;
  userContent: string;
  temperature?: number;
  max_tokens?: number;
  retries?: number;
}): Promise<string> {
  const messages: ChatCompletionMessageParam[] = [
    { role: "system", content: systemPrompt },
    { role: "user", content: userContent },
  ];

  let attempt = 0;
  while (attempt <= retries) {
    try {
      const response = await openai.chat.completions.create({
        model:"meta-llama/llama-3.3-8b-instruct:free",
        messages,
        temperature,
        max_tokens,
      });

      return response.choices?.[0]?.message?.content?.trim() || "";
    } catch (error: any) {
      attempt++;
      console.error(`LLM call failed (attempt ${attempt}):`, error);

      if (attempt > retries) {
        throw new Error("AI CV generation failed after multiple attempts.");
      }

      // Optional delay between retries
      await new Promise((res) => setTimeout(res, 1500));
    }
  }

  return "";
}
