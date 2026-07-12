import { DEFAULT_OXLO_CONFIG } from "../lib/analysis/types";

export async function handleCopilotChatRequest(
  body: any,
  apiKey: string
) {
  const { message, history, profile } = body;

  if (!message || typeof message !== "string") {
    throw new Error("Message is required");
  }

  const systemPrompt = `You are LaunchMesh AI, an expert startup growth strategist and co-marketing coordinator. 
The founder is chatting with you about their app launch. 
${profile ? `Here is their app profile:
Name: ${profile.appName || "N/A"}
Description: ${profile.description || "N/A"}
Category: ${profile.category || "N/A"}
Target Audience: ${profile.targetAudience || "N/A"}` : "The founder has not created a product launch profile yet."}

Help them answer their questions, improve their copy, write outreach emails, design launch campaigns, and recommend matching strategies. 
Keep your responses concise, actionable, and formatted in clean markdown.`;

  const messages = [
    { role: "system", content: systemPrompt },
    ...(history || []).map((m: any) => ({
      role: m.role === "user" ? "user" : "assistant",
      content: m.text || m.content
    })),
    { role: "user", content: message }
  ];

  if (!apiKey) {
    throw new Error("Server is missing GROQ_API_KEY configuration");
  }

  const response = await fetch(DEFAULT_OXLO_CONFIG.apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: DEFAULT_OXLO_CONFIG.model,
      messages,
      max_tokens: 800,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text().catch(() => "");
    throw new Error(`AI service error (${response.status}): ${errorBody.slice(0, 150)}`);
  }

  const data: any = await response.json();
  const content = data?.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error("AI service returned an empty message");
  }

  return { reply: content };
}
