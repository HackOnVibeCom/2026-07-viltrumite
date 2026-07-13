import { DEFAULT_OXLO_CONFIG } from "../lib/analysis/types";

export async function handleLaunchKitRequest(
  body: any,
  apiKey: string
) {
  const { profile, category } = body;

  if (!profile) {
    throw new Error("Missing required product profile");
  }

  // Define Category Prompts and JSON schemas
  const categoryConfigs: Record<string, { schema: string; prompt: string; mock: any }> = {
    brand_kit: {
      schema: `{
        "brandStory": "A compelling brand story of how the app was created",
        "mission": "The mission statement",
        "vision": "The vision statement",
        "valueProposition": "The main value proposition",
        "elevatorPitch": "30-second elevator pitch",
        "oneLiner": "A punchy one-liner slogan",
        "bio50": "50-word company bio",
        "bio100": "100-word company bio",
        "bio250": "250-word company bio",
        "founderBio": "Inspiring founder bio",
        "brandPersonality": "3-5 adjectives describing personality",
        "toneOfVoice": "Guidelines on brand voice/tone",
        "brandKeywords": ["keyword1", "keyword2", "keyword3"],
        "taglineAlternatives": ["Alt tagline 1", "Alt tagline 2", "Alt tagline 3"],
        "brandColors": ["Dominant brand color", "Accent color", "Supporting color"],
        "logoConcepts": "2-3 creative logo design ideas"
      }`,
      prompt: "Generate a full Brand Kit including Story, Mission, Vision, Elevator Pitch, Bios, Tone, Keywords, Tagline alternatives, Brand color palette ideas, and Logo concepts.",
      mock: {
        brandStory: `We built ${profile.appName} because we were frustrated by how hard it was to solve the exact problems our users face every day. After talking to dozens of people in our space, we realized there had to be a better, automated way.`,
        mission: `To empower users by making their core workflows 10x faster and more intuitive.`,
        vision: `A world where anyone can seamlessly optimize their daily operations without technical overhead.`,
        valueProposition: `The absolute easiest way to launch, scale, and manage your projects without complexity.`,
        elevatorPitch: `${profile.appName} is a smart platform built for ${profile.targetAudience} that automates manual workflows and drives growth in half the time.`,
        oneLiner: `Smart workflows, zero friction.`,
        bio50: `${profile.appName} helps ${profile.targetAudience} streamline their day-to-day operations with intelligent workflows and real-time collaboration.`,
        bio100: `${profile.appName} is the leading automation suite designed specifically for ${profile.targetAudience}. By consolidating separate utilities into a unified, glassmorphic workspace, it allows team members and independent creators to scale their output 10x faster.`,
        bio250: `${profile.appName} was founded with a singular purpose: to eliminate the friction that keeps teams and founders from reaching their full potential. Built by creators for creators, the platform automates manual tasks, handles data parsing, and simplifies complex scheduling. Thousands of users now trust ${profile.appName} to power their daily work, allowing them to focus on high-impact strategic growth instead of tedious manual administration.`,
        founderBio: `An indie creator and product builder who loves solving real-world productivity issues and designing premium user experiences.`,
        brandPersonality: "Innovative, Transparent, Trustworthy, Empowering",
        toneOfVoice: "Confident, helpful, clear, and tech-forward. Avoid jargon and focus on outcomes.",
        brandKeywords: ["Automation", "Productivity", "Growth", "Seamless", "Intelligence"],
        taglineAlternatives: ["Automate the boring stuff", "The ultimate founder assistant", "Scale without limits"],
        brandColors: ["Deep Purple (#6C5CE7)", "Vibrant Teal (#00D4B8)", "Slate Gray (#1E293B)"],
        logoConcepts: "1. A stylized infinity loop merging with a lightning bolt. 2. A minimalist geometric crest using interlocking glass layers."
      }
    },
    website_copy: {
      schema: `{
        "heroHeadline": "The main hero headline",
        "heroSubtitle": "The supporting subtitle",
        "ctaButtons": ["Primary CTA", "Secondary CTA"],
        "features": [{"title": "Feature 1", "desc": "description"}],
        "benefits": [{"title": "Benefit 1", "desc": "description"}],
        "pricingCopy": "Catchy copy for the pricing section",
        "aboutUs": "Short copy for the website About section",
        "contactPage": "Call-to-action copy for the contact form",
        "footerCopy": "Footer copyright and links text",
        "faq": [{"q": "Question 1", "a": "Answer 1"}],
        "testimonials": [{"name": "User Name", "role": "Role", "quote": "Quote"}],
        "trustSection": "Security/social proof trust bar text"
      }`,
      prompt: "Generate production-ready Website Copy including Hero Headline, Subtitle, CTA buttons, Features list, Benefits list, Pricing copy, FAQ list, Testimonials list, and Trust indicators.",
      mock: {
        heroHeadline: `Supercharge Your Workflows with ${profile.appName}`,
        heroSubtitle: `The intelligent platform designed for ${profile.targetAudience} to automate manual operations and scale output.`,
        ctaButtons: ["Start Free Trial", "Book a Demo"],
        features: [
          { title: "Smart Automation", desc: "Automate repetitive daily tasks with our advanced AI processing engine." },
          { title: "Unified Workspace", desc: "Keep all your templates, matches, and campaign data in one premium glassmorphic dashboard." }
        ],
        benefits: [
          { title: "Save Hours Daily", desc: "Cut manual administrative tasks by 80% and focus on what truly matters." },
          { title: "Collaborate Seamlessly", desc: "Share progress, invite team members, and manage partner approvals live." }
        ],
        pricingCopy: "Simple, transparent pricing that scales with your growth. No hidden fees.",
        aboutUs: `We are a passionate team of developers and builders dedicated to making startup tools accessible.`,
        contactPage: "Have questions? Our support team is here to help you 24/7.",
        footerCopy: `© ${new Date().getFullYear()} ${profile.appName}. All rights reserved.`,
        faq: [
          { q: "Is there a free trial?", a: "Yes, you can try all premium features free for 14 days." },
          { q: "Do I need coding skills?", a: "Not at all. The interface is completely drag-and-drop and intuitive." }
        ],
        testimonials: [
          { name: "Sarah Jenkins", role: "Indie Founder", quote: "This tool saved me at least 15 hours of manual work in my first week alone!" }
        ],
        trustSection: "Trusted by 5,000+ fast-growing teams worldwide. SOC2 Compliant."
      }
    },
    aso: {
      schema: `{
        "title": "Store Title (Max 30 chars)",
        "subtitle": "Store Subtitle (Max 30 chars)",
        "description": "Store description, engaging with hooks",
        "shortDescription": "Store short description, max 80 chars",
        "keywords": ["keyword1", "keyword2"],
        "features": ["Feature bullet 1", "Feature bullet 2"],
        "screenshotCaptions": ["Caption for screenshot 1", "Caption for screenshot 2"],
        "appIconSuggestions": "Creative suggestions for the store icon design",
        "releaseNotes": "Mock release notes for version 1.0.0",
        "changelog": "Initial changelog log"
      }`,
      prompt: "Generate store optimization copy (ASO) including App Title (max 30 chars), Subtitle (max 30 chars), Descriptions, Keywords list, Feature bullets, App Store Screenshot caption ideas, Icon design ideas, and initial Release Notes.",
      mock: {
        title: `${profile.appName.slice(0,20)}: Smart Automation`,
        subtitle: `Workflows for ${profile.targetAudience.slice(0,18)}`,
        description: `Streamline your startup launch with ${profile.appName}. Our intelligent engine handles all manual scheduling, templates, and partner outreach automatically. Join thousands of fast-growing teams already scaling their output.`,
        shortDescription: `Streamline tasks and automate workflows with ${profile.appName}.`,
        keywords: [profile.appName.toLowerCase(), "automation", "workflows", "founder toolkit", "productivity"],
        features: ["One-click template creation", "Intelligent scheduling reminders", "Custom partner matching"],
        screenshotCaptions: [
          "Automate your launch checklist in seconds",
          "Track matches and active growth pacts live"
        ],
        appIconSuggestions: "A clean minimalist logo combining a rocket launch trail with a modern gradient shield.",
        releaseNotes: "Initial public launch! Access the full launch wizard, AI matches, and growth pact builder.",
        changelog: "v1.0.0: Initial release with core features."
      }
    },
    product_hunt: {
      schema: `{
        "tagline": "Product Hunt tagline, max 60 chars",
        "description": "PH description paragraph",
        "firstComment": "Detailed first comment from maker",
        "faq": [{"q": "Question 1", "a": "Answer 1"}],
        "hunterOutreach": "Email template to reach out to hunters",
        "checklist": ["Checklist item 1", "Checklist item 2"],
        "timeline": ["Launch timeline phase 1", "Launch timeline phase 2"],
        "replies": ["Standard reply for positive feedback", "Standard reply for feature request"]
      }`,
      prompt: "Generate a Product Hunt Launch Kit including Tagline, Description, Maker's First Comment, FAQ, Hunter Outreach email, Launch checklist, Launch timeline, and Standard comment reply templates.",
      mock: {
        tagline: `Streamline and scale your launches with AI`,
        description: `Hey Product Hunt! We built ${profile.appName} to solve the endless headache of startup launch management. Create profiles, find GTM matches, and orchestrate campaigns in one place.`,
        firstComment: `Hi hunters! Maker here. We started building this tool to save ourselves from managing launch assets in 10 different spreadsheets. Excited to hear your feedback!`,
        faq: [{ q: "What integrations do you support?", a: "We support Slack, Notion, and Discord outreach out of the box." }],
        hunterOutreach: "Subject: Quick question about launch / co-marketing tools...\n\nHey [Hunter Name], hope you're doing great! Love your curation on PH...",
        checklist: ["Prepare Product Hunt media assets", "Draft maker comment", "Notify newsletter subscribers"],
        timeline: ["00:01 AM - Launch is live on PH", "09:00 AM - Push announcement to social channels", "08:00 PM - Final thank you post"],
        replies: ["Thanks so much for the support! Let me know if you try out the wizard.", "Great suggestion! We're planning to release integrations next month."]
      }
    },
    press_kit: {
      schema: `{
        "pressRelease": "Draft of the official press release",
        "mediaKit": "Outline of resources in the media kit",
        "companyOverview": "Paragraph summarizing company background",
        "founderQuotes": ["Quote 1", "Quote 2"],
        "journalistEmail": "Outreach email template to tech journalists",
        "bloggerOutreach": "Outreach email template to bloggers",
        "podcastOutreach": "Outreach email template to podcast hosts",
        "pressFaq": [{"q": "Question 1", "a": "Answer 1"}]
      }`,
      prompt: "Generate a Press Kit including a Press Release, Media Kit index, Company Overview, Founder Quotes, Journalist cold email, Blogger email, Podcast pitch email, and Press FAQ list.",
      mock: {
        pressRelease: `FOR IMMEDIATE RELEASE\n\n${profile.appName} Launches Smart AI Workspace for ${profile.targetAudience}\n\n[CITY, DATE] — Today, the creators of ${profile.appName} announced the launch of an all-new GTM suite designed to automate manual marketing workflows...`,
        mediaKit: "Includes: Logos (PNG/SVG), App Screenshots, Founder headshots, Press release PDF.",
        companyOverview: `${profile.appName} is an innovative software company building productivity interfaces for modern startups and independent creators.`,
        founderQuotes: [
          `"We wanted to build something that makes launch day feel exciting, not overwhelming." - Founder`,
          `"By streamlining co-marketing, we're unlocking growth for thousands of indie makers."`
        ],
        journalistEmail: "Subject: Pitch: How ${profile.appName} is changing startup launches...\n\nHi [Journalist Name],\n\nI follow your articles on tech growth...",
        bloggerOutreach: "Hey [Name], loved your recent round-up. Thought your readers might love a tool that automates launch kit creation...",
        podcastOutreach: "Hi [Host Name], I'd love to share my journey of building ${profile.appName} and bootstrap marketing tips on your show...",
        pressFaq: [{ q: "When was the company founded?", a: `Founded in ${new Date().getFullYear()} by a team of indie hackers.` }]
      }
    },
    social_media: {
      schema: `{
        "twitter": ["Post 1", "Post 2", "Post 3"],
        "linkedin": ["Post 1", "Post 2"],
        "instagram": ["Caption 1", "Caption 2"],
        "facebook": ["Post 1"],
        "threads": ["Post 1"],
        "reddit": "Reddit launch post template",
        "hackerNews": "Show HN launch post text",
        "discordAnnouncement": "Discord server announcement message",
        "telegramAnnouncement": "Telegram broadcast channel message"
      }`,
      prompt: "Generate a social media package containing Twitter/X posts (generate at least 5 distinct posts), LinkedIn posts (generate at least 3 distinct posts), Instagram captions, Facebook updates, Threads posts, Reddit templates, Hacker News Show HN pitches, and Discord/Telegram broadcast formats.",
      mock: {
        twitter: [
          `🚀 We just launched ${profile.appName}! The easiest way for ${profile.targetAudience} to automate workflows. Try it out: [link]`,
          `Say goodbye to managing launch checklists in spreadsheets. ${profile.appName} handles it all in a premium glassmorphic hub. ⚡`,
          `Building in public? ${profile.appName} is live on Product Hunt today. We'd love your support! [link]`,
          `What's your biggest launch bottleneck? For us it was creating GTM kits. So we automated it. 🧠`,
          `We just released Version 1.0. Start scaling your outreach campaigns today! 🤝`
        ],
        linkedin: [
          `I am thrilled to announce the official launch of ${profile.appName}! Our team set out to solve the manual, time-consuming parts of startup launching. Today, we're releasing the GTM suite to help founders scale co-marketing.`,
          `Startup growth shouldn't require 10 different SaaS subscriptions. Here is how ${profile.appName} brings launch kits, ASO, and growth pacts into one dashboard.`,
          `Thank you to everyone who supported our launch on Product Hunt! We're working on some exciting updates based on your feedback.`
        ],
        instagram: [
          "Launch day vibes! 🚀 Streamline your startup operations with our new smart workspace. Link in bio!",
          "Behind the scenes of building the future of automated growth. 💻⚡"
        ],
        facebook: [`We are live! Discover how ${profile.appName} helps teams automate launch campaigns and find partners. Learn more: [link]`],
        threads: [`Finally launching ${profile.appName}! Check out our 6-step setup wizard and AI GTM copilot.`],
        reddit: `Title: We built a tool to automate startup launch kits and find growth partners. Looking for feedback!\n\nHey r/startup, we were tired of spreadsheets, so we built this...`,
        hackerNews: `Show HN: ${profile.appName} - Automated Launch Kits & Growth Pact Simulator\n\nHey HN, we wanted to make co-marketing simple...`,
        discordAnnouncement: `@everyone 🚀 **We are officially live!** check out the new dashboard and start generating your custom GTM launch kits right now: [link]`,
        telegramAnnouncement: `🚀 **${profile.appName} is LIVE!**\n\nStart your 14-day free trial and unlock ASO audits, Product Hunt templates, and cold outreach kits. Join now: [link]`
      }
    },
    email_marketing: {
      schema: `{
        "welcomeEmail": {"subject": "Subject", "body": "Body"},
        "launchEmail": {"subject": "Subject", "body": "Body"},
        "followUpEmail": {"subject": "Subject", "body": "Body"},
        "newsletter": {"subject": "Subject", "body": "Body"},
        "referralEmail": {"subject": "Subject", "body": "Body"},
        "productUpdate": {"subject": "Subject", "body": "Body"},
        "reengagement": {"subject": "Subject", "body": "Body"},
        "promoCampaign": {"subject": "Subject", "body": "Body"}
      }`,
      prompt: "Generate email campaigns including Welcome email, Launch email, Follow-up email, Newsletter template, Referral email, Product update email, Re-engagement email, and Promo campaigns.",
      mock: {
        welcomeEmail: { subject: `Welcome to ${profile.appName}!`, body: `Hi [Name],\n\nThanks for signing up! We're excited to help you automate your startup workflows. Go ahead and start your first launch wizard...` },
        launchEmail: { subject: `We are live! Meet ${profile.appName}`, body: `Hi there,\n\nToday, we're officially launching ${profile.appName}. Start finding growth partners and generating launch materials today!` },
        followUpEmail: { subject: `Need help setting up ${profile.appName}?`, body: `Hi [Name],\n\nJust checking in. Let us know if you have any questions about creating your first launch.` },
        newsletter: { subject: `Launch tips, co-marketing strategies, and product updates`, body: `Hey founders,\n\nHere is our weekly round-up of the best strategies to scale your startup launch...` },
        referralEmail: { subject: `Get 1 month free by inviting your friends!`, body: `Hi [Name],\n\nLove ${profile.appName}? Share your referral link and get 1 month of premium free for every founder that signs up.` },
        productUpdate: { subject: `New Feature: AI GTM Copilot is live!`, body: `Hi [Name],\n\nWe just released our GTM Copilot, giving you 17 categories of marketing assets in one click!` },
        reengagement: { subject: `We miss you! Here's what's new in ${profile.appName}`, body: `Hi [Name],\n\nIt's been a while. We've added several templates and optimizations to help your launches.` },
        promoCampaign: { subject: `Launch Special: Save 40% on yearly plans`, body: `Hi there,\n\nFor the next 48 hours only, save 40% on our yearly pro plan with code LAUNCH40.` }
      }
    },
    seo: {
      schema: `{
        "seoTitle": "SEO meta title",
        "metaDescription": "SEO meta description",
        "primaryKeywords": ["keyword1", "keyword2"],
        "longTailKeywords": ["long keyword 1", "long keyword 2"],
        "landingPageCopy": "Structure or outline of SEO-optimized landing page copy",
        "internalLinking": ["Link recommendation 1", "Link recommendation 2"],
        "blogIdeas": ["Blog idea 1", "Blog idea 2"],
        "structuredData": "Suggested schema.json structured data"
      }`,
      prompt: "Generate an SEO kit containing Meta titles, Meta descriptions, Primary/Long-tail keywords, landing page structures, Internal linking recommendations, blog ideas, and Schema markup suggestions.",
      mock: {
        seoTitle: `${profile.appName} - Intelligent Workflow Automation for ${profile.targetAudience}`,
        metaDescription: `Automate your startup launches and streamline co-marketing with ${profile.appName}. Get ASO audits, Product Hunt templates, and social media posting calendars.`,
        primaryKeywords: ["workflow automation", "startup launch kit", "co-marketing platform"],
        longTailKeywords: [`how to launch a startup as a ${profile.targetAudience.toLowerCase()}`, "automated app store optimization audits"],
        landingPageCopy: "H1: Automate Your Startup Launches.\nH2: Find partners, generate GTM kits, and scale outreach.\nCall-To-Action: Start for free.",
        internalLinking: ["Link ASO audit tool to the pricing page", "Link PH launch kits to the customer stories page"],
        blogIdeas: ["The Ultimate Guide to Co-Marketing in 2026", `10 Launch Bottlenecks for ${profile.targetAudience}`],
        structuredData: `{"@context": "https://schema.org", "@type": "SoftwareApplication", "name": "${profile.appName}", "applicationCategory": "BusinessApplication"}`
      }
    },
    content_marketing: {
      schema: `{
        "blogIdeas": ["Idea 1", "Idea 2"],
        "mediumArticle": {"title": "Title", "body": "Draft/outline"},
        "devToArticle": {"title": "Title", "body": "Draft/outline"},
        "linkedinArticle": {"title": "Title", "body": "Draft/outline"},
        "caseStudy": {"title": "Title", "body": "Draft/outline"},
        "whitepaperOutline": "Outline of whitepaper",
        "documentation": "Standard user documentation outline",
        "tutorialOutline": "Tutorial script or layout"
      }`,
      prompt: "Generate a Content Marketing suite including 50 Blog Ideas (generate at least 5 for preview), drafts for Medium/Dev.to/LinkedIn articles, a Case Study template, a Whitepaper outline, user documentation outline, and a tutorial roadmap.",
      mock: {
        blogIdeas: [
          "1. Why Traditional Launch Checklists Fail",
          `2. A Founder's Guide to Co-Marketing for ${profile.targetAudience}`,
          "3. How to Hack Product Hunt Curation",
          "4. 5 ASO Violations You are Probably Committing",
          "5. Scaling Your Outreach Without Burning Out"
        ],
        mediumArticle: { title: `Why We Built ${profile.appName} to End Spreadsheet Launches`, body: "Intro: spreadsheet hell... Body: why co-marketing is better... Conclusion: Try automation." },
        devToArticle: { title: "Building a Glassmorphic React Workspace", body: "Sharing our styling tokens, CSS utilities, and custom Framer Motion components..." },
        linkedinArticle: { title: "The Power of Growth Pacts in Startup Launches", body: "Why partner marketing is the highest leverage channel for bootstrap software startups..." },
        caseStudy: { title: "How StudyPal Grew 300% via Growth Pacts", body: "Focusing on audience overlap, co-promotion slot trades, and custom ASO audits." },
        whitepaperOutline: "Chapter 1: The Economics of Startup Launches. Chapter 2: The Co-Marketing Paradox. Chapter 3: Automated Trust Evaluation.",
        documentation: "1. Installation & Setup. 2. Running your First Launch Wizard. 3. Matching with Partner Apps. 4. Managing Active Pacts.",
        tutorialOutline: "Video 1: Creating your account (2m). Video 2: Configuring your profile (3m). Video 3: Inviting growth partners (4m)."
      }
    },
    sales_kit: {
      schema: `{
        "coldEmail": "Cold sales email outreach template",
        "salesPitch": "Core sales pitch script",
        "discoveryQuestions": ["Question 1", "Question 2"],
        "demoScript": "Outline of standard product demo flow",
        "objectionHandling": [{"objection": "Too expensive", "response": "Response"}],
        "proposalTemplate": "Proposal layout text",
        "followUpSequence": ["Follow-up email 1", "Follow-up email 2"]
      }`,
      prompt: "Generate a Sales Kit including a Cold sales email, Core Sales Pitch script, Discovery Questions, Product Demo flow, Objection Handling guidelines, Proposal template, and a Follow-up email sequence.",
      mock: {
        coldEmail: `Subject: Streamline your workflows in minutes...\n\nHey [Name],\n\nI noticed you are managing launch campaigns at [Company]. We built ${profile.appName} to help teams automate that exact process...`,
        salesPitch: `For ${profile.targetAudience} who struggle with launch overhead, ${profile.appName} consolidates checklists, outreach, and matches into a single dashboard. Unlike spreadsheets, we provide live AI matches...`,
        discoveryQuestions: ["What is your biggest blocker on launch day?", "How much time does your marketing team spend drafting assets?"],
        demoScript: "1. Show empty state vs wizard setup. 2. Trigger AI analysis. 3. Navigate matches and draft a growth pact. 4. Showcase the GTM Copilot.",
        objectionHandling: [{ objection: "We already use spreadsheets.", response: "Spreadsheets don't find you cross-promotion partners or run automated ASO audits on your metadata." }],
        proposalTemplate: `Proposal for [Client Name]:\n\nProduct: ${profile.appName} Enterprise\nScope: Unlimited wizards, custom API access, priority support.`,
        followUpSequence: ["Hey [Name], just following up on our demo yesterday...", "Wanted to share this case study of a team that saved 15 hours using our platform..."]
      }
    },
    investor_kit: {
      schema: `{
        "executiveSummary": "Executive summary paragraph",
        "pitchDeckOutline": ["Slide 1", "Slide 2"],
        "problemStatement": "The problem we are solving",
        "solution": "Our solution",
        "tamSamSom": "Market sizing estimates",
        "businessModel": "How we make money",
        "competitorAnalysis": "Competitive landscape overview",
        "gtmStrategy": "Our market entry strategy",
        "financialHighlights": "Projections and highlights",
        "fundingAsk": "How much we are raising and why"
      }`,
      prompt: "Generate an Investor Kit including an Executive Summary, Pitch Deck outline, Problem statement, Solution description, TAM/SAM/SOM market sizes, Business model, Competitor landscape, GTM strategy, Financial highlights, and the Funding Ask.",
      mock: {
        executiveSummary: `${profile.appName} is the first automated GTM matching and asset hub for startup launches. We solve the manual friction of co-marketing and asset drafting, creating a unified marketplace for creators.`,
        pitchDeckOutline: ["Slide 1: Vision", "Slide 2: Problem", "Slide 3: Solution", "Slide 4: Product Demo", "Slide 5: Market Size", "Slide 6: Business Model"],
        problemStatement: "Startups spend weeks manually drafting launch assets, finding co-marketing partners, and conducting store audits. High friction leads to failed launches.",
        solution: `An intelligent workspace (${profile.appName}) that automates GTM kits, offers ASO audits, and matches founders with growth partners.`,
        tamSamSom: "TAM: $10B (All global startups & SMBs). SAM: $1.2B (Modern SaaS/Mobile startups). SOM: $150M (Indie makers & early-stage creators).",
        businessModel: "SaaS subscription model: Starter ($29/mo), Pro ($79/mo), and Enterprise packages.",
        competitorAnalysis: "Traditional tools are generic copywriters (Jasper) or checklist trackers (Trello). LaunchMesh merges GTM copy with a live partner network.",
        gtmStrategy: "Product-led growth (PLG) leveraging shared launch hubs, virality from referral programs, and startup accelerator partnerships.",
        financialHighlights: "Targeting $1M ARR within 12 months post-launch, maintaining 85% gross margins.",
        fundingAsk: "Raising a $500k Pre-Seed round to expand the matching algorithms and hire core full-stack engineers."
      }
    },
    customer_support: {
      schema: `{
        "helpArticles": [{"title": "Article 1", "body": "Body"}],
        "faq": [{"q": "Question 1", "a": "Answer 1"}],
        "refundPolicy": "Refund policy terms",
        "supportReplies": [{"scenario": "Bug report", "reply": "Template reply"}],
        "troubleshooting": "Standard troubleshooting guide steps",
        "onboardingGuide": "Step-by-step onboarding walkthrough"
      }`,
      prompt: "Generate a Customer Support suite containing Help Center articles, FAQs, Refund policy, standard Support reply templates, Troubleshooting steps, and a Founder onboarding guide.",
      mock: {
        helpArticles: [{ title: `Getting Started with ${profile.appName}`, body: "Welcome! To begin, click 'Create New Launch' on your dashboard. Follow the wizard steps to set up..." }],
        faq: [{ q: "Can I cancel anytime?", a: "Yes, you can cancel your subscription inside your settings page at any time." }],
        refundPolicy: "We offer a full 14-day money-back guarantee if you are not satisfied with your GTM kit.",
        supportReplies: [{ scenario: "API Connection issue", reply: "Hi [Name], sorry for the trouble! Please verify your GROQ_API_KEY is configured inside your .env file..." }],
        troubleshooting: "If the analysis spinner hangs, refresh the page and verify your internet connection. Saved drafts are auto-saved in local storage.",
        onboardingGuide: "1. Log in. 2. Switch to Founder Workspace. 3. Launch the Product Wizard. 4. Generate your launch kit."
      }
    },
    launch_planner: {
      schema: `{
        "roadmap": ["Week 1: Tasks", "Week 2: Tasks"],
        "checklist": ["Daily Checklist task 1", "Daily Checklist task 2"],
        "calendar": ["Day 1 schedule", "Day 2 schedule"],
        "kpis": ["KPI 1", "KPI 2"],
        "successMetrics": ["Metric 1", "Metric 2"],
        "growthMilestones": ["Milestone 1", "Milestone 2"]
      }`,
      prompt: "Generate a Launch Planner containing a 30-Day roadmap, Weekly launch checklist, Launch calendar, KPIs list, Success metrics, and Growth milestones.",
      mock: {
        roadmap: [
          "Week 1: Complete profile, run ASO audit, and generate PH templates.",
          "Week 2: Outreach to Top 5 AI growth matches and secure 2 active pacts.",
          "Week 3: Set up social calendar queues and start newsletter teasers.",
          "Week 4: Launch day coordination, live feedback response, and performance monitoring."
        ],
        checklist: ["Check metadata length constraints", "Send outreach templates to bloggers", "Load social posts to schedule queue"],
        calendar: ["08:00 AM - Push Product Hunt announcement", "11:00 AM - Live Q&A in community channel"],
        kpis: ["Product Hunt Upvotes", "Newsletter click-through rate (CTR)", "Referral signup conversions"],
        successMetrics: ["500+ launch day signups", "10%+ referral program conversion rate", "4%+ click-through rate on active pacts"],
        growthMilestones: ["Reach 1,000 active users", "Publish first 3 co-promoted bundles", "Validate first $5k in recurring revenue"]
      }
    },
    competitor_analysis: {
      schema: `{
        "comparisonTable": [{"feature": "Feature", "me": "Yes", "competitor": "No"}],
        "swot": {"strengths": "S", "weaknesses": "W", "opportunities": "O", "threats": "T"},
        "pricing": "Pricing matrix compared to main alternatives",
        "positioning": "How the app positions itself in the market",
        "advantages": ["Advantage 1", "Advantage 2"]
      }`,
      prompt: "Generate Competitor Analysis data including a Feature comparison table, SWOT analysis, Pricing comparisons, positioning matrix, and Competitive advantages.",
      mock: {
        comparisonTable: [
          { feature: "AI GTM Kit Generator", me: "✅ Built-in", competitor: "❌ Manual" },
          { feature: "Live Growth Matching", me: "✅ Automated", competitor: "❌ Spreadsheets only" }
        ],
        swot: {
          strengths: "Premium interface, dynamic partner network, specialized Groq API completions.",
          weaknesses: "Early stage product, reliance on API availability.",
          opportunities: "Expansion into B2B marketing channels, adding automated Discord/Telegram syndication.",
          threats: "Rapid development of copywriter utilities by generic AI tools."
        },
        pricing: `Unlike generic AI copywriters costing $49/mo and partner search platforms costing $99/mo, ${profile.appName} provides both starting at just $29/mo.`,
        positioning: `The go-to intelligent launchpad for ${profile.targetAudience} who want to scale outreach without hire overhead.`,
        advantages: [
          "Saves 20+ hours of launch asset drafting",
          "Connects you directly to non-competing co-marketing partners"
        ]
      }
    },
    audience_insights: {
      schema: `{
        "personas": [{"name": "Persona 1", "details": "Details"}],
        "painPoints": ["Pain point 1", "Pain point 2"],
        "triggers": ["Buying trigger 1", "Buying trigger 2"],
        "goals": ["Goal 1", "Goal 2"],
        "objections": ["Objection 1", "Response 1"],
        "messaging": "Primary messaging framework"
      }`,
      prompt: "Generate Audience Insights including detailed Customer Personas, core Pain Points, Buying triggers, User goals, common Objections, and the Messaging framework.",
      mock: {
        personas: [
          { name: "Busy Indie Hacker Alex", details: "Sole developer, limited budget, wants to focus on building features rather than marketing outreach." }
        ],
        painPoints: [
          "Writing engaging social copy is tedious and time-consuming",
          "Finding non-competing marketing partners takes weeks of cold emailing"
        ],
        triggers: [
          "Product Hunt launch date is approaching and they have zero assets ready",
          "Struggling to drive traffic post-launch and need cross-promotion channels"
        ],
        goals: ["Get featured on Product Hunt top 5", "Build a high-CTR referral queue", "Get press mentions on startup blogs"],
        objections: [
          { objection: "Is the copy high quality?", response: "Our GTM generator uses Groq llama-3.3-70b-versatile with custom product onboarding data for highly contextual results." }
        ],
        messaging: `Headline: Automate your launch marketing.\nFocus: Eliminate manual drafting, match with growth partners, and launch successfully.`
      }
    },
    growth_engine: {
      schema: `{
        "viralIdeas": ["Viral idea 1", "Viral idea 2"],
        "referralProgram": "Referral loop details",
        "partnershipIdeas": ["Partnership idea 1", "Partnership idea 2"],
        "influencerOutreach": "Cold outreach script for influencers",
        "communityStrategy": "How to build user community",
        "retentionStrategy": "How to keep users engaged",
        "experiments": ["Growth experiment 1", "Growth experiment 2"],
        "campaigns": ["Campaign idea 1", "Campaign idea 2"]
      }`,
      prompt: "Generate a Growth Engine guide including Viral growth loops, Referral program layout, Partnership matches, Influencer outreach emails, Community strategies, Retention tactics, Growth experiments, and marketing campaigns.",
      mock: {
        viralIdeas: [
          "Include a 'Powered by LaunchMesh' badge on active shared launch hubs.",
          "Allow users to share their ASO report scores directly to Twitter with one click."
        ],
        referralProgram: "Invite another founder to launch on ${profile.appName}. When they complete their first wizard, both of you unlock 1 month of premium.",
        partnershipIdeas: [
          "Partner with startup accelerators to provide free launch templates to cohort members.",
          "Run co-promotional webinars with newsletter platforms."
        ],
        influencerOutreach: `Hey [Influencer Name], loved your review of launch kits. I built ${profile.appName} to automate that flow. Would love to send you a premium account to check out...`,
        communityStrategy: "Launch a private Discord server for active founders to share co-marketing pitches, launch dates, and feedback.",
        retentionStrategy: "Send weekly progress emails displaying pact metrics, visits, and click-through rates from active campaigns.",
        experiments: ["A/B test launch page headline (Benefit vs Feature focused)", "Trial a low-cost $9/mo tier for student creators"],
        campaigns: ["The 7-Day Launch Challenge (interactive guides to prepare your startup)", "Indie Maker Spotlight newsletter features"]
      }
    },
    ai_recommendations: {
      schema: `{
        "missingLandingSections": [{"title": "Section", "priority": "high", "why": "Why"}],
        "brandingImprovements": [{"title": "Branding", "priority": "medium", "why": "Why"}],
        "pricingImprovements": [{"title": "Pricing", "priority": "high", "why": "Why"}],
        "productImprovements": [{"title": "Product", "priority": "medium", "why": "Why"}],
        "seoImprovements": [{"title": "SEO", "priority": "low", "why": "Why"}],
        "asoImprovements": [{"title": "ASO", "priority": "high", "why": "Why"}],
        "uxImprovements": [{"title": "UX", "priority": "medium", "why": "Why"}],
        "accessibilityImprovements": [{"title": "Accessibility", "priority": "low", "why": "Why"}],
        "conversionImprovements": [{"title": "Conversion", "priority": "high", "why": "Why"}],
        "marketingImprovements": [{"title": "Marketing", "priority": "medium", "why": "Why"}],
        "growthOpportunities": [{"title": "Growth", "priority": "high", "why": "Why"}]
      }`,
      prompt: "Generate AI GTM recommendations categorized by Landing Page, Branding, Pricing, Product, SEO, ASO, UX, Accessibility, Conversions, Marketing, and Growth. Specify priority level (Critical, High, Medium, Low) for each recommendation.",
      mock: {
        missingLandingSections: [{ title: "Interactive Calculator", priority: "high", why: `Allows ${profile.targetAudience} to instantly calculate saved hours before signing up.` }],
        brandingImprovements: [{ title: "Consistent Brand Voice", priority: "medium", why: "Ensure the website benefits list matches the tech-forward tone of your social posts." }],
        pricingImprovements: [{ title: "Add Annual Tier Discount", priority: "high", why: "Increase cash-flow upfront by offering a 20% discount on annual plan commitments." }],
        productImprovements: [{ title: "Automated Slack Alerts", priority: "medium", why: "Keep users engaged by letting them hook their Slack channels to active pact notifications." }],
        seoImprovements: [{ title: "Authoritative Glossaries", priority: "low", why: "Create glossary pages for startup launch terminology to capture long-tail organic search volume." }],
        asoImprovements: [{ title: "Optimize Keywords density", priority: "high", why: "Your store description uses generic terms; replace them with highly targeted keywords from your SEO kit." }],
        uxImprovements: [{ title: "Simplifying Wizard Steps", priority: "medium", why: "Shorten step inputs to reduce drop-offs during product onboarding." }],
        accessibilityImprovements: [{ title: "Add Alt tags to screenshots", priority: "low", why: "Optimize your landing page media for screen-readers to ensure accessibility compliance." }],
        conversionImprovements: [{ title: "Highlight Social Proof", priority: "high", why: "Add a testimonials section directly below the Hero section to build trust immediately." }],
        marketingImprovements: [{ title: "Blogger Outreach Campaigns", priority: "medium", why: "Pitch your launch story to indie tech blogs using your generated media templates." }],
        growthOpportunities: [{ title: "Affiliate Referral Loop", priority: "high", why: "Turn early advocates into marketers by paying them a recurring commission on referred signups." }]
      }
    }
  };

  const config = categoryConfigs[category] || categoryConfigs.brand_kit;

  const hasKey = apiKey && apiKey !== "undefined" && apiKey !== "null" && apiKey.trim() !== "";

  if (!hasKey) {
    // Zero downtime fallback for offline mode or missing API key
    return config.mock;
  }

  // Build specialized LLM prompt
  const systemPrompt = `You are LaunchMesh GTM AI, an elite startup advisor, growth marketer, and copywriter.
Generate highly personalized startup launch assets for the given product profile.

Category to generate: ${category.toUpperCase()}
Prompt details: ${config.prompt}

Guidelines:
- Match the brand voice, industry, region, target audience, and pricing model perfectly.
- Make all recommendations actionable, specific, and ready to publish.
- Return ONLY valid JSON matching this schema (do not wrap in markdown, do not write preambles):
${config.schema}`;

  const userPrompt = `Startup Profile:
App Name: ${profile.appName}
Description: ${profile.description}
Long Description: ${profile.longDescription || ""}
Category: ${profile.category}
Target Audience: ${profile.targetAudience}
Platform: ${profile.platform}
Pricing Model: ${profile.pricing}
Website: ${profile.website || "N/A"}
User Persona: ${profile.userPersona || "General"}
Brand Voice: ${profile.brandVoice || "Professional & helpful"}
Unique Value Prop: ${profile.uvp || "Automation"}
Industry: ${profile.industry || "SaaS"}
Region: ${profile.region || "Global"}

Generate GTM data for category: ${category}`;

  try {
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
        max_tokens: DEFAULT_OXLO_CONFIG.maxTokens,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Groq API error response:", errorText);
      return config.mock; // Fallback to mock on API error
    }

    const data = await response.json();
    const contentText = data.choices?.[0]?.message?.content || "";
    try {
      const parsed = JSON.parse(contentText);
      return parsed;
    } catch (parseErr) {
      console.error("JSON parse error on Groq content:", contentText);
      return config.mock; // Fallback on parse failure
    }
  } catch (error) {
    console.error("Fetch request error:", error);
    return config.mock; // Fallback on networking failure
  }
}
