export function buildPactUserPrompt(
  myApp: { name: string; category: string; description: string; targetAudience: string },
  partnerApp: { name: string; category: string; description: string; targetAudience: string },
): string {
  const JSON_SCHEMA = `{
    "compatibility": number (60-100),
    "whyMatch": "Reason why these two apps match and have complementary growth pathways",
    "campaignSuggestions": ["specific cross-promo action 1", "specific cross-promo action 2"],
    "timeline": ["Milestone 1: date - details", "Milestone 2: date - details"],
    "promotionPlan": "Brief co-marketing strategy",
    "expectedInstalls": number (predicted downloads from campaign, 100-2000),
    "expectedCtr": "CTR percentage, e.g. 4.8%",
    "successProbability": "Success probability, e.g. 85%",
    "outreachMessage": "Editable message starting with 'Hi [FounderName]' referencing the specific target audience overlap, predicted installs, and co-marketing actions."
  }`;

  return `You are LaunchMesh AI, a growth marketing strategist.
Analyze the partnership potential between these two apps and generate a Growth Pact outline.

App 1 (My App):
- Name: ${myApp.name}
- Category: ${myApp.category}
- Description: ${myApp.description}
- Target Audience: ${myApp.targetAudience}

App 2 (Partner App):
- Name: ${partnerApp.name}
- Category: ${partnerApp.category}
- Description: ${partnerApp.description}
- Target Audience: ${partnerApp.targetAudience}

Return ONLY valid JSON matching this exact schema (no markdown, no backticks, no explanation):
${JSON_SCHEMA}`;
}
