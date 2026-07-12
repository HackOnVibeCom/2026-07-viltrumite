interface Env {
  OXLO_API_KEY?: string;
}

type PagesContext = {
  request: Request;
  env: Env;
};

// ---------------------------------------------------------------------------
// Deterministic mock responses based on keyword matching in the user's message
// ---------------------------------------------------------------------------

function generateMockReply(message: string, profile?: { appName?: string; description?: string; category?: string; targetAudience?: string }): string {
  const lower = message.toLowerCase();
  const appName = profile?.appName ?? "your app";

  // Launch / marketing strategy
  if (lower.includes("launch") || lower.includes("strategy") || lower.includes("marketing")) {
    return `Here's a launch strategy for **${appName}**:

1. **Pre-launch (2-4 weeks out)**: Build a landing page with an email waitlist. Start posting teasers on social media.
2. **Launch week**: Submit to Product Hunt, Hacker News, and relevant subreddits. Reach out to 10-15 bloggers in your niche.
3. **Post-launch**: Collect reviews, iterate on feedback, and run a referral campaign.

Would you like me to draft a specific outreach email or social post?`;
  }

  // Outreach / email
  if (lower.includes("email") || lower.includes("outreach") || lower.includes("pitch")) {
    return `Here's a cold outreach template for **${appName}**:

> **Subject:** Quick question about ${profile?.category ?? "your space"}
>
> Hi [Name],
>
> I've been following your work on [topic] and thought you'd find ${appName} interesting — it helps ${profile?.targetAudience ?? "people"} ${profile?.description ?? "solve a real problem"}.
>
> Would you be open to a quick chat or a trial? Happy to set you up with early access.
>
> Best,
> [Your name]

Want me to tailor this for a specific person or platform?`;
  }

  // Copy / messaging
  if (lower.includes("copy") || lower.includes("messaging") || lower.includes("tagline") || lower.includes("description")) {
    return `Here are a few messaging angles for **${appName}**:

- **Problem-first**: "Tired of [pain point]? ${appName} makes it effortless."
- **Outcome-first**: "Launch faster, grow smarter — with ${appName}."
- **Social proof**: "Join the founders already using ${appName} to [key benefit]."

Which angle resonates most with your audience? I can expand any of these.`;
  }

  // Pricing / monetization
  if (lower.includes("pricing") || lower.includes("monetize") || lower.includes("revenue") || lower.includes("business model")) {
    return `For **${appName}**, consider these monetization approaches:

1. **Freemium**: Free core features, charge for premium tiers.
2. **Flat subscription**: Simple monthly/annual pricing — easy to communicate.
3. **Usage-based**: Charge per active user, API call, or feature usage.

Given your target audience (${profile?.targetAudience ?? "early adopters"}), I'd recommend starting with a freemium model to drive adoption, then layering on a pro tier once you have traction.`;
  }

  // Social media
  if (lower.includes("social") || lower.includes("twitter") || lower.includes("linkedin") || lower.includes("instagram") || lower.includes("tiktok")) {
    return `Social media plan for **${appName}**:

- **Twitter/X**: Share build-in-public updates, engage with indie hacker community.
- **LinkedIn**: Post thought leadership on ${profile?.category ?? "your industry"} trends.
- **TikTok/Reels**: Short demos showing the before/after of using ${appName}.

Posting cadence: 3-5x per week. Focus on value-first content — don't just promote, educate and entertain.`;
  }

  // ASO / App Store
  if (lower.includes("aso") || lower.includes("app store") || lower.includes("play store") || lower.includes("keyword")) {
    return `App Store Optimization tips for **${appName}**:

- **Title**: Include your primary keyword — e.g. "${appName} — ${profile?.description?.slice(0, 30) ?? "Your App Tagline"}"
- **Subtitle**: Add secondary keywords (iOS) or short description (Android).
- **Keywords field (iOS)**: Use all 100 characters, comma-separated, no spaces.
- **Screenshots**: Show the core value in the first 2 screenshots — users rarely scroll.

Would you like me to generate a keyword list for the "${profile?.category ?? "your category"}" space?`;
  }

  // General / help
  if (lower.includes("help") || lower.includes("what can you do") || lower.includes("capabilities")) {
    return `I'm your LaunchMesh AI co-pilot! I can help with:

- 🚀 **Launch strategy** — step-by-step plans tailored to your app
- ✍️ **Copywriting** — taglines, descriptions, outreach emails
- 📣 **Marketing** — social media, content, and growth tactics
- 💰 **Pricing & monetization** — models that fit your audience
- 📱 **ASO** — App Store Optimization for iOS and Android
- 🤝 **Partnerships** — cross-promotion and co-marketing ideas

Just ask me anything about launching and growing **${appName}**!`;
  }

  // Default: thoughtful fallback
  return `Great question about **${appName}**! 

Based on what you've shared (${profile?.category ?? "your category"}, targeting ${profile?.targetAudience ?? "your audience"}), here's my take: focus on clearly communicating your core value — "${profile?.description ?? "what makes your app special"}" — across every channel.

Could you tell me more about what specifically you're trying to figure out? I'm here to help with strategy, copy, outreach, pricing, ASO, and more.`;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function jsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function errorResponse(message: string, status = 500): Response {
  return jsonResponse({ error: message }, status);
}

// ---------------------------------------------------------------------------
// Route handler
// ---------------------------------------------------------------------------

export async function onRequestPost(context: PagesContext): Promise<Response> {
  try {
    const body: any = await context.request.json();
    const { message, history, profile } = body;

    if (!message || typeof message !== "string") {
      return errorResponse("Message is required", 400);
    }

    // Deterministic mock reply — no API key needed
    const reply = generateMockReply(message, profile);

    return jsonResponse({ reply });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Copilot chat failed";
    const status = message.includes("Message is required") ? 400 : 500;
    return errorResponse(message, status);
  }
}