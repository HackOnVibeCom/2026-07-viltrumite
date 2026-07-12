import { DEFAULT_OXLO_CONFIG } from "../lib/analysis/types";

export async function handleLaunchKitRequest(
  body: any,
  apiKey: string
) {
  const { profile } = body;

  if (!profile) {
    throw new Error("Missing required product profile");
  }

  if (!apiKey) {
    throw new Error("Server is missing GROQ_API_KEY configuration");
  }

  const systemPrompt = `You are LaunchMesh AI, an expert app marketing and startup growth advisor.
Generate a structured, highly specific launch marketing kit for the user's app. 

Return ONLY valid JSON matching this schema:
{
  "aso": {
    "title": "Optimized store title, max 30 chars",
    "subtitle": "Optimized iOS subtitle, max 30 chars",
    "description": "Engaging app store description with benefit hook and CTA, 3-4 short paragraphs"
  },
  "productHunt": {
    "tagline": "Benefit-forward tagline, max 60 chars",
    "description": "Short Product Hunt introduction copy",
    "firstComment": "The maker's first comment explaining the story behind the app and welcoming feedback"
  },
  "social": [
    {
      "day": "Day 1 (Teaser)",
      "post": "Post content under 280 characters",
      "hashtags": ["#startup", "#launch"]
    },
    {
      "day": "Day 2 (Launch)",
      "post": "Post content under 280 characters",
      "hashtags": ["#buildinpublic"]
    },
    {
      "day": "Day 3 (Feature)",
      "post": "Post content under 280 characters",
      "hashtags": ["#productivity"]
    },
    {
      "day": "Day 4 (Social Proof)",
      "post": "Post content under 280 characters",
      "hashtags": ["#milestone"]
    },
    {
      "day": "Day 5 (Story)",
      "post": "Post content under 280 characters",
      "hashtags": ["#indiehackers"]
    },
    {
      "day": "Day 6 (Milestone)",
      "post": "Post content under 280 characters",
      "hashtags": ["#feedback"]
    },
    {
      "day": "Day 7 (Final CTA)",
      "post": "Post content under 280 characters",
      "hashtags": ["#growth"]
    }
  ],
  "press": {
    "blurb50": "A concise 50-word press blurb",
    "blurb100": "A descriptive 100-word press blurb",
    "coldEmail": {
      "subject": "Catchy subject line for tech bloggers",
      "body": "Short, personalized pitch email introducing the problem, value prop, and call for review"
    }
  }
}`;

  const userPrompt = `App Profile to analyze:
Name: ${profile.appName}
Description: ${profile.description}
Category: ${profile.category}
Target Audience: ${profile.targetAudience}
Platform: ${profile.platform}
Pricing: ${profile.pricing}

Generate the launch kit JSON based on these details. Make the copy highly contextual and specific to this niche (do not use generic placeholders).`;

  const response = await fetch(DEFAULT_OXLO_CONFIG.apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: DEFAULT_OXLO_CONFIG.model,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      response_format: { type: "json_object" },
      max_tokens: 2500,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text().catch(() => "");
    throw new Error(`AI service error (${response.status}): ${errorBody.slice(0, 150)}`);
  }

  const data: any = await response.json();
  const content = data?.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error("AI service returned an empty kit");
  }

  try {
    const parsed = JSON.parse(content);
    return parsed;
  } catch (err) {
    console.error("Failed to parse JSON launch kit from Groq:", content);
    throw new Error("AI returned invalid JSON structure for launch kit");
  }
}
