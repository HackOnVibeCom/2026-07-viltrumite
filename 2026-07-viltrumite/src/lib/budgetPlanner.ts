export interface BudgetInputs {
  totalBudget: number;
  currency: "USD" | "INR";
  country: string;
  category: string;
  goal: "Users" | "Revenue" | "Waitlist" | "Awareness";
  hasGrowthPact: boolean;
}

export interface ChannelAllocation {
  channel: string;
  suggestedSpend: number;
  expectedUsers: number;
  estimatedCac: number;
  expectedRoi: number;
  confidenceScore: number;
}

export interface BudgetPlanResult {
  summary: {
    totalBudget: number;
    estimatedNewUsers: number;
    estimatedRevenue: number;
    estimatedProfit: number;
    breakEvenPoint: string;
    aiConfidence: number;
  };
  allocations: ChannelAllocation[];
  savings: {
    amount: number;
    installs: number;
    cacSaved: number;
    partnerName: string;
  } | null;
}

// Channel base configurations (in USD)
const CHANNELS_CONFIG: Record<string, { baseCac: number; baseRoi: number; baseConfidence: number }> = {
  "Product Hunt promotion": { baseCac: 5.0, baseRoi: 170, baseConfidence: 90 },
  "Reddit ads": { baseCac: 9.5, baseRoi: 130, baseConfidence: 78 },
  "X (Twitter) promotion": { baseCac: 7.0, baseRoi: 140, baseConfidence: 80 },
  LinkedIn: { baseCac: 28.0, baseRoi: 180, baseConfidence: 85 },
  "Google Ads": { baseCac: 14.0, baseRoi: 160, baseConfidence: 88 },
  "Meta Ads": { baseCac: 11.0, baseRoi: 155, baseConfidence: 86 },
  "Influencer partnerships": { baseCac: 7.5, baseRoi: 190, baseConfidence: 75 },
  "Newsletter sponsorships": { baseCac: 9.0, baseRoi: 165, baseConfidence: 82 },
  "Discord communities": { baseCac: 3.2, baseRoi: 135, baseConfidence: 70 },
  "Slack communities": { baseCac: 4.5, baseRoi: 145, baseConfidence: 72 },
  "Telegram communities": { baseCac: 3.0, baseRoi: 125, baseConfidence: 68 },
  "Content marketing": { baseCac: 6.0, baseRoi: 200, baseConfidence: 84 },
  "Giveaway budget": { baseCac: 2.2, baseRoi: 115, baseConfidence: 65 },
  "Referral rewards": { baseCac: 3.8, baseRoi: 185, baseConfidence: 87 },
};

// Base goal weights (must sum to 1.0)
const GOAL_WEIGHTS: Record<string, Record<string, number>> = {
  Users: {
    "Product Hunt promotion": 0.12,
    "Reddit ads": 0.08,
    "X (Twitter) promotion": 0.05,
    LinkedIn: 0.02,
    "Google Ads": 0.14,
    "Meta Ads": 0.20,
    "Influencer partnerships": 0.08,
    "Newsletter sponsorships": 0.04,
    "Discord communities": 0.04,
    "Slack communities": 0.02,
    "Telegram communities": 0.04,
    "Content marketing": 0.06,
    "Giveaway budget": 0.06,
    "Referral rewards": 0.10,
  },
  Revenue: {
    "Product Hunt promotion": 0.05,
    "Reddit ads": 0.04,
    "X (Twitter) promotion": 0.06,
    LinkedIn: 0.16,
    "Google Ads": 0.24,
    "Meta Ads": 0.14,
    "Influencer partnerships": 0.04,
    "Newsletter sponsorships": 0.12,
    "Discord communities": 0.01,
    "Slack communities": 0.03,
    "Telegram communities": 0.01,
    "Content marketing": 0.08,
    "Giveaway budget": 0.02,
    "Referral rewards": 0.04,
  },
  Waitlist: {
    "Product Hunt promotion": 0.18,
    "Reddit ads": 0.10,
    "X (Twitter) promotion": 0.08,
    LinkedIn: 0.02,
    "Google Ads": 0.06,
    "Meta Ads": 0.08,
    "Influencer partnerships": 0.04,
    "Newsletter sponsorships": 0.04,
    "Discord communities": 0.08,
    "Slack communities": 0.06,
    "Telegram communities": 0.08,
    "Content marketing": 0.04,
    "Giveaway budget": 0.04,
    "Referral rewards": 0.10,
  },
  Awareness: {
    "Product Hunt promotion": 0.08,
    "Reddit ads": 0.04,
    "X (Twitter) promotion": 0.10,
    LinkedIn: 0.04,
    "Google Ads": 0.04,
    "Meta Ads": 0.10,
    "Influencer partnerships": 0.22,
    "Newsletter sponsorships": 0.08,
    "Discord communities": 0.02,
    "Slack communities": 0.02,
    "Telegram communities": 0.02,
    "Content marketing": 0.12,
    "Giveaway budget": 0.10,
    "Referral rewards": 0.02,
  },
};

export function calculateLaunchBudgetPlan(inputs: BudgetInputs): BudgetPlanResult {
  const { totalBudget, currency, country, category, goal, hasGrowthPact } = inputs;

  // Rate Multipliers
  const isINR = currency === "INR";
  const currencyMultiplier = isINR ? 80.0 : 1.0;

  let countryMultiplier = 1.0;
  switch (country) {
    case "United States":
    case "US":
      countryMultiplier = 1.25;
      break;
    case "Germany":
    case "DE":
    case "United Kingdom":
    case "UK":
      countryMultiplier = 1.15;
      break;
    case "India":
    case "IN":
      countryMultiplier = 0.45;
      break;
    case "Canada":
    case "CA":
      countryMultiplier = 1.0;
      break;
    default:
      countryMultiplier = 1.0;
  }

  // Determine base channel weights based on goals
  let weights = { ...GOAL_WEIGHTS[goal] };

  // Category adjustments to optimize allocation weights
  if (category === "SaaS" || category === "B2B Developer Tool") {
    // Boost LinkedIn & Product Hunt, decrease Meta/Giveaways
    weights["LinkedIn"] = (weights["LinkedIn"] || 0) + 0.06;
    weights["Product Hunt promotion"] = (weights["Product Hunt promotion"] || 0) + 0.04;
    weights["Meta Ads"] = Math.max(0.01, (weights["Meta Ads"] || 0) - 0.05);
    weights["Giveaway budget"] = Math.max(0.01, (weights["Giveaway budget"] || 0) - 0.05);
  } else if (category === "Mobile App" || category === "Consumer Tech") {
    // Boost Meta Ads, Influencers, Referrals, decrease LinkedIn
    weights["Meta Ads"] = (weights["Meta Ads"] || 0) + 0.06;
    weights["Influencer partnerships"] = (weights["Influencer partnerships"] || 0) + 0.04;
    weights["Referral rewards"] = (weights["Referral rewards"] || 0) + 0.03;
    weights["LinkedIn"] = Math.max(0.01, (weights["LinkedIn"] || 0) - 0.10);
    weights["Google Ads"] = Math.max(0.02, (weights["Google Ads"] || 0) - 0.03);
  } else if (category === "Web3/Crypto") {
    // Boost Telegram, Discord, X, decrease LinkedIn/Google
    weights["Telegram communities"] = (weights["Telegram communities"] || 0) + 0.08;
    weights["Discord communities"] = (weights["Discord communities"] || 0) + 0.06;
    weights["X (Twitter) promotion"] = (weights["X (Twitter) promotion"] || 0) + 0.04;
    weights["LinkedIn"] = Math.max(0.01, (weights["LinkedIn"] || 0) - 0.09);
    weights["Google Ads"] = Math.max(0.01, (weights["Google Ads"] || 0) - 0.09);
  }

  // Renormalize weights to make sure they sum to 1
  const sumWeights = Object.values(weights).reduce((a, b) => a + b, 0);
  Object.keys(weights).forEach((k) => {
    weights[k] = weights[k] / sumWeights;
  });

  // Calculate allocations
  let allocations: ChannelAllocation[] = [];
  let totalAllocatedBudget = 0;
  let estimatedNewUsers = 0;
  let weightedConfidence = 0;

  // Retrieve partner name if growth pact exists
  let partnerName = "StudyFlow";
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem("lm_pacts");
      if (stored) {
        const parsed = JSON.parse(stored);
        const activePact = parsed.find((p: any) => p.status === "active");
        if (activePact) {
          partnerName = activePact.partnerName || activePact.name || "StudyFlow";
        }
      }
    } catch (e) {
      console.error(e);
    }
  }

  // Growth Pact savings logic
  // If active, save 25% of the total budget by shifting Meta/Google ads to co-marketing
  let pactSavingAmount = 0;
  let pactSavingInstalls = 0;
  const avgCacUSD = 8.5; // typical paid CAC
  const avgCacScaled = avgCacUSD * countryMultiplier * currencyMultiplier;

  if (hasGrowthPact) {
    pactSavingAmount = Math.round(totalBudget * 0.25);
    pactSavingInstalls = Math.round(pactSavingAmount / avgCacScaled);
  }

  // Calculate each channel details
  Object.keys(CHANNELS_CONFIG).forEach((channelName) => {
    const config = CHANNELS_CONFIG[channelName];
    const weight = weights[channelName] || 0;

    let spend = totalBudget * weight;
    
    // Scale CAC/CPC
    const cac = config.baseCac * countryMultiplier * currencyMultiplier;

    // Adjust ROI and Confidence dynamically
    let roi = config.baseRoi;
    let confidence = config.baseConfidence;

    // Boost channel if it aligns with the Goal
    if (goal === "Users" && ["Meta Ads", "Referral rewards", "Product Hunt promotion"].includes(channelName)) {
      roi += 15;
      confidence += 5;
    } else if (goal === "Revenue" && ["LinkedIn", "Google Ads", "Newsletter sponsorships"].includes(channelName)) {
      roi += 20;
      confidence += 6;
    } else if (goal === "Waitlist" && ["Product Hunt promotion", "Referral rewards", "Discord communities"].includes(channelName)) {
      roi += 15;
      confidence += 4;
    } else if (goal === "Awareness" && ["Influencer partnerships", "Content marketing", "Giveaway budget"].includes(channelName)) {
      roi += 18;
      confidence += 5;
    }

    // Boost channel if it aligns with Category
    if ((category === "SaaS" || category === "B2B Developer Tool") && ["LinkedIn", "Product Hunt promotion", "Newsletter sponsorships"].includes(channelName)) {
      roi += 15;
      confidence += 4;
    } else if (category === "Web3/Crypto" && ["Telegram communities", "Discord communities", "X (Twitter) promotion"].includes(channelName)) {
      roi += 20;
      confidence += 8;
    }

    confidence = Math.min(98, Math.max(50, confidence));

    // Calculate users gained
    let users = Math.round(spend / cac);

    allocations.push({
      channel: channelName,
      suggestedSpend: Math.round(spend),
      expectedUsers: users,
      estimatedCac: parseFloat(cac.toFixed(2)),
      expectedRoi: roi,
      confidenceScore: confidence,
    });

    totalAllocatedBudget += spend;
    estimatedNewUsers += users;
    weightedConfidence += confidence * spend;
  });

  // Calculate average AI Confidence score weighted by spend
  const aiConfidence = Math.round(weightedConfidence / (totalBudget || 1));

  // Determine user Lifetime Value (LTV) or conversion value based on category/goal
  let baseUserLtvUSD = 5.0; // average revenue value per user signup across conversion rates
  if (category === "SaaS") baseUserLtvUSD = 8.5;
  else if (category === "B2B Developer Tool") baseUserLtvUSD = 12.0;
  else if (category === "Web3/Crypto") baseUserLtvUSD = 10.0;
  else if (category === "Mobile App") baseUserLtvUSD = 3.5;
  else if (category === "Consumer Tech") baseUserLtvUSD = 4.5;

  // Scale LTV based on country & goal multiplier
  let goalMultiplier = 1.0;
  if (goal === "Revenue") goalMultiplier = 1.4;
  else if (goal === "Users") goalMultiplier = 1.1;
  else if (goal === "Waitlist") goalMultiplier = 0.8;
  else if (goal === "Awareness") goalMultiplier = 0.5;

  const userLtv = baseUserLtvUSD * countryMultiplier * currencyMultiplier * goalMultiplier;

  // Add the free growth pact installs if active
  let totalUsersWithPartnership = estimatedNewUsers;
  if (hasGrowthPact) {
    totalUsersWithPartnership += pactSavingInstalls;
  }

  // Calculate final summary card stats
  const estimatedRevenue = Math.round(totalUsersWithPartnership * userLtv);
  const estimatedProfit = estimatedRevenue - totalBudget;
  
  // Break-even Point calculation
  const breakEvenUsers = Math.round(totalBudget / userLtv);
  const breakEvenPoint = `${breakEvenUsers.toLocaleString()} signups/installs`;

  // Sort allocations so highest spend comes first
  allocations.sort((a, b) => b.suggestedSpend - a.suggestedSpend);

  return {
    summary: {
      totalBudget,
      estimatedNewUsers: totalUsersWithPartnership,
      estimatedRevenue,
      estimatedProfit,
      breakEvenPoint,
      aiConfidence,
    },
    allocations,
    savings: hasGrowthPact
      ? {
          amount: pactSavingAmount,
          installs: pactSavingInstalls,
          cacSaved: parseFloat(avgCacScaled.toFixed(2)),
          partnerName,
        }
      : null,
  };
}

/**
 * Simulates a request to Oxlo AI API to calculate the launch budget plan.
 * Can later be replaced by:
 *   const res = await fetch('/api/optimize-budget', { method: 'POST', body: JSON.stringify(inputs) });
 *   return res.json();
 */
export async function optimizeBudgetWithAI(inputs: BudgetInputs): Promise<BudgetPlanResult> {
  // Simulate network request delay (1.5 seconds)
  await new Promise((resolve) => setTimeout(resolve, 1500));
  return calculateLaunchBudgetPlan(inputs);
}
