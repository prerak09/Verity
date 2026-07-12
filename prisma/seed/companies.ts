// prisma/seed/companies.ts — real, hand-curated companies (VERIFIED) with internships.
// Roadmap P0: "a seeded company renders on a hard-coded page". The 100-company
// catalog (task 5.7, G2) extends this baseline.

import type { PrismaClient } from "@prisma/client";
import type { SeededTaxonomy } from "./types";

interface DemoCompany {
  slug: string;
  name: string;
  tagline: string;
  about: string;
  logoUrl?: string;
  fundingStage: "BOOTSTRAPPED" | "PRE_SEED" | "SEED" | "SERIES_A" | "SERIES_B" | "SERIES_C_PLUS" | "PUBLIC";
  remotePolicy: "REMOTE" | "HYBRID" | "ONSITE";
  visaSponsorship: boolean;
  employeeCountRange: string;
  websiteUrl: string;
  categories: string[]; // slugs
  technologies: string[]; // slugs
  location: { city: string; country: string };
  founders: { name: string; title: string; linkedinUrl?: string; twitterUrl?: string; isHiringManager?: boolean }[];
  links?: { type: string; url: string }[];
  internships: {
    slug: string;
    title: string;
    description: string;
    location: string;
    department: string;
    jobType: "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERNSHIP";
    remotePolicy: "REMOTE" | "HYBRID" | "ONSITE";
    stipend: string;
    duration: string;
    applyUrl: string;
  }[];
}

const COMPANIES: DemoCompany[] = [
  {
    slug: "cloudflare",
    name: "Cloudflare",
    tagline: "The leading connectivity cloud company",
    about:
      "Cloudflare operates a global network that provides content delivery, DDoS mitigation, DNS, and cybersecurity services, making websites, APIs, and applications faster and more secure. Founded in 2009 and headquartered in San Francisco, it went public on the NYSE (NET) in 2019.",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/4/4b/Cloudflare_Logo.svg",
    fundingStage: "PUBLIC",
    remotePolicy: "HYBRID",
    visaSponsorship: false,
    employeeCountRange: "1000+",
    websiteUrl: "https://www.cloudflare.com",
    categories: ["infrastructure", "devtools"],
    technologies: ["go", "typescript", "postgres"],
    location: { city: "San Francisco", country: "USA" },
    founders: [
      {
        name: "Matthew Prince",
        title: "Co-founder & CEO",
        linkedinUrl: "https://www.linkedin.com/in/mprince/",
      },
      {
        name: "Michelle Zatlyn",
        title: "Co-founder & President",
        linkedinUrl: "https://www.linkedin.com/in/michellezatlyn/",
      },
      { name: "Lee Holloway", title: "Co-founder" },
    ],
    links: [
      { type: "linkedin", url: "https://www.linkedin.com/company/cloudflare" },
      { type: "twitter", url: "https://x.com/cloudflare" },
      { type: "github", url: "https://github.com/cloudflare" },
      { type: "youtube", url: "https://www.youtube.com/@cloudflare" },
      { type: "discord", url: "https://discord.cloudflare.com" },
    ],
    internships: [
      {
        slug: "cloudflare-systems-engineer-data-residency",
        title: "Systems Engineer - Global Resource Management (Data Residency)",
        description: `
<p>Join the Data Residency Architecture (DRA) program, a small, high-autonomy team building the infrastructure that lets customers keep their data in a country or region of their choosing.</p>
<p><strong>What You'll Work On</strong></p>
<ul>
<li><strong>Regional API Routing</strong> — Build per-account API hostname generation and routing so that customer requests terminate in their chosen country, integrating with Cloudflare's Data Localization Suite and edge API gateway.</li>
<li><strong>Dashboard Integration</strong> — Modify the Cloudflare dashboard so that API calls route through regional endpoints while surfacing clear regional indicators to the customer.</li>
<li><strong>Account Creation & Provisioning</strong> — Build the account creation flow that captures country/region selection and integrates with the Control Plane Platform orchestrator to provision per-account regional storage and configuration.</li>
<li><strong>Internal Tooling</strong> — Build admin tooling (provisioning integrations, billing shims, operational dashboards) so that support, sales, and finance teams can manage DRA accounts without violating residency constraints.</li>
<li><strong>Cross-Team Integration</strong> — Work across the DRA program to integrate with regional storage, cryptographic key management, and logging infrastructure built by other teams.</li>
<li><strong>Migration & Self-Service</strong> — Help design the path from manual provisioning (MVP) to dashboard self-service, and eventually tooling that migrates existing enterprise customers into DRA.</li>
</ul>
<p><strong>Required</strong></p>
<ul>
<li>3+ years of professional software engineering experience building production systems at scale.</li>
<li>Proficiency in Go. Cloudflare's backend services and core platform are written in Go.</li>
<li>Comfort or willingness to work in TypeScript. The control plane uses Cloudflare Workers (TypeScript), and the dashboard is a TypeScript application.</li>
<li>Experience designing and building REST APIs — routing, authentication, request lifecycle, and how frontends consume distributed backends.</li>
<li>Comfort with distributed systems tradeoffs — data locality, replication, consistency models, and the latency implications of geographically distributed infrastructure.</li>
<li>Ability to work across team boundaries; DRA spans nearly every engineering organization at Cloudflare.</li>
</ul>
<p><strong>Nice to Have</strong></p>
<ul>
<li>Experience with data residency, sovereignty, or compliance engineering (GDPR, EU Data Act, EUCS, FedRAMP, or equivalent regulatory frameworks).</li>
<li>Familiarity with edge computing platforms such as Cloudflare Workers, Durable Objects, or similar serverless/edge-native runtimes.</li>
<li>Familiarity with PostgreSQL, ClickHouse, or SQLite in production environments.</li>
</ul>
<p><strong>Benefits</strong> include medical/dental/vision insurance, retirement plans, flexible PTO, mental health support, parental leave, and stock participation.</p>
`.trim(),
        location: "Austin, Texas",
        department: "Data Residency Architecture (DRA)",
        jobType: "FULL_TIME",
        remotePolicy: "HYBRID",
        stipend: "Not specified",
        duration: "Permanent",
        applyUrl: "https://job-boards.greenhouse.io/cloudflare/jobs/8015230",
      },
    ],
  },
  {
    slug: "pylon",
    name: "Pylon",
    tagline: "AI-native B2B post-sales support platform",
    about:
      "Pylon is the all-in-one B2B post-sales support platform, bringing together ticketing, omnichannel support (Slack Connect, Microsoft Teams), a chat widget, knowledge base, and an AI support bot for customer success and support teams. Backed by a16z and BCV, it's used by 1,500+ companies including Linear, Cognition, and Modal Labs.",
    logoUrl: "https://bookface-images.s3.us-west-2.amazonaws.com/logos/1a9690e8b8b1a3f2d8331e0ec28282de4aef8008.png",
    fundingStage: "SERIES_B",
    remotePolicy: "ONSITE",
    visaSponsorship: false,
    employeeCountRange: "51-200",
    websiteUrl: "https://usepylon.com",
    categories: ["saas", "ai-ml"],
    technologies: ["react", "go", "graphql", "aws"],
    location: { city: "San Francisco", country: "USA" },
    founders: [
      {
        name: "Marty Kausas",
        title: "Co-founder & CEO",
        linkedinUrl: "https://www.linkedin.com/in/martykausas",
      },
      {
        name: "Advith Chelikani",
        title: "Co-founder & CTO",
        linkedinUrl: "https://www.linkedin.com/in/advith/",
      },
      {
        name: "Robert Eng",
        title: "Co-founder & CPO",
        linkedinUrl: "https://www.linkedin.com/in/robert-eng/",
      },
    ],
    links: [
      { type: "linkedin", url: "https://www.linkedin.com/company/usepylon/" },
      { type: "twitter", url: "https://x.com/usepylon" },
    ],
    internships: [
      {
        slug: "pylon-software-engineer-intern",
        title: "Software Engineer, Intern",
        description: `
<p>We're building the all-in-one B2B post-sales support platform powered by conversational data and layered with intelligence to help our customers run their operations in real-time. We're backed by a16z, BCV, General Catalyst, and Y Combinator. Currently more than 1,500 companies — including Linear, Cognition (makers of Devin), Modal Labs, and Incident.io — run their support and customer success workflows with Pylon.</p>
<p>Our product has a very large problem space so there's a ton of stuff to build and take ownership of — we'd be excited to get your help as we're hiring several extremely talented software engineers across the stack.</p>
<p><strong>What You'll Do</strong></p>
<ul>
<li>Build features so our customers in post-sales roles (Customer Support & Customer Success) run their operations more efficiently by leveraging AI.</li>
<li>Build prototypes, work independently, iterate quickly, and ship fast.</li>
<li>Have high autonomy, own things end to end, and project manage your own work.</li>
<li>Work with PMs, designers, and other engineers in a highly collaborative, non-waterfall way.</li>
<li>Collaborate with a strong technical team of senior engineers from places like Samsara, Affinity, Airbnb, and Meta.</li>
</ul>
<p><strong>What We're Looking For</strong></p>
<ul>
<li>You are pursuing a bachelor's or master's degree in computer science, engineering, or another related field and are graduating between December 2026 and Summer 2027.</li>
<li>You have a growth mindset, want to constantly improve, and want to receive feedback.</li>
<li>You're in SF or you're willing to relocate (the internship will take place in Summer 2027).</li>
</ul>
<p><strong>Nice to Have</strong></p>
<ul>
<li>Relevant internship experience or side projects building product features, with a demonstration of strong full-stack fundamentals.</li>
<li>Internship experience at high-growth startups and the ability to navigate ambiguous environments.</li>
<li>Heavy use of AI for software development and the ability to juggle multiple workstreams at the same time.</li>
<li>Experience with Pylon's tech stack (React, Golang, GraphQL, and AWS).</li>
</ul>
<p><strong>Perks</strong> include commuter benefits, parental leave, 14 company holidays plus unlimited PTO, an annual offsite, lunch/dinner/snacks at the office, and a fitness stipend.</p>
`.trim(),
        location: "San Francisco",
        department: "Engineering",
        jobType: "INTERNSHIP",
        remotePolicy: "ONSITE",
        stipend: "Not specified",
        duration: "Summer 2027",
        applyUrl: "https://jobs.ashbyhq.com/pylon-labs/fcea8b52-81f1-4b0c-b575-d7b180faec4d",
      },
    ],
  },
  {
    slug: "meshy",
    name: "Meshy",
    tagline: "The leading 3D generative AI company",
    about:
      "Meshy is a 3D generative AI company on a mission to unleash 3D creativity by transforming the content creation pipeline — turning text and images into textured 3D models in minutes. Headquartered in Silicon Valley, it's backed by Sequoia and GGV, with 5M+ users and 40M+ models generated. Founder and CEO Yuanming (Ethan) Hu earned his Ph.D. in graphics and AI from MIT, where he developed the Taichi GPU programming language.",
    logoUrl: "https://www.meshy.ai/icon3.png",
    fundingStage: "SERIES_A",
    remotePolicy: "ONSITE",
    visaSponsorship: false,
    employeeCountRange: "51-200",
    websiteUrl: "https://www.meshy.ai",
    categories: ["ai-ml", "consumer"],
    technologies: ["python", "go", "typescript", "react", "pytorch", "aws", "gcp", "kubernetes"],
    location: { city: "Sunnyvale", country: "USA" },
    founders: [
      {
        name: "Yuanming (Ethan) Hu",
        title: "Founder & CEO",
        linkedinUrl: "https://www.linkedin.com/in/ethan-yuanming-hu/",
      },
    ],
    links: [
      { type: "linkedin", url: "https://www.linkedin.com/company/meshyai/" },
      { type: "twitter", url: "https://twitter.com/MeshyAI" },
      { type: "instagram", url: "https://www.instagram.com/meshy.ai/" },
      { type: "youtube", url: "https://www.youtube.com/@MeshyAI" },
      { type: "discord", url: "https://discord.com/invite/KgD5yVM9Y4" },
      { type: "tiktok", url: "https://www.tiktok.com/@meshy.ai" },
    ],
    internships: [
      {
        slug: "meshy-fullstack-engineer-intern",
        title: "Fullstack Engineer Intern",
        description: `
<p>We're looking for talented and motivated interns to join our engineering team and help build the next generation of AI-powered 3D and creative tools. As a Fullstack Engineer Intern, you'll work on real production projects alongside experienced engineers and researchers — from designing scalable systems to training large-scale machine learning models, or building product features that reach users worldwide.</p>
<p>This is a high-impact role for someone who loves learning fast, solving complex problems, and building things that matter.</p>
<p><strong>What We're Looking For</strong></p>
<ul>
<li>Currently pursuing a Bachelor's or Master's degree in Computer Science, Engineering, or related field.</li>
<li>Strong programming fundamentals and familiarity with at least one of: Python, Go, or JavaScript/TypeScript.</li>
<li>Solid understanding of data structures, algorithms, and software design principles.</li>
<li>Curiosity and ability to quickly pick up new tools and frameworks.</li>
<li>Excellent communication and collaboration skills — you enjoy working in a fast-paced, high-ownership environment.</li>
</ul>
<p><strong>Nice to Have</strong></p>
<ul>
<li>Experience with distributed systems or cloud platforms (AWS, GCP, Kubernetes).</li>
<li>Web development (React, Node.js).</li>
<li>Machine learning frameworks (e.g. PyTorch).</li>
<li>Graphics / 3D systems or GPU programming (CUDA, Triton).</li>
<li>Contributions to open-source projects or personal side projects.</li>
</ul>
<p><strong>Why You'll Love It Here</strong></p>
<ul>
<li>Work on cutting-edge technology at the intersection of AI, 3D, and creativity.</li>
<li>Collaborate with a world-class, globally distributed engineering and research team.</li>
<li>Learn directly from senior engineers and gain hands-on experience in large-scale systems and modern AI workflows.</li>
<li>Potential return offer for outstanding interns.</li>
</ul>
<p><strong>Compensation:</strong> the hourly rate for this position is $40–$50 per hour, determined based on the candidate's qualifications, experience, and skills.</p>
<p><strong>Benefits</strong> include comprehensive health, dental, and vision insurance, and the latest and best office equipment.</p>
`.trim(),
        location: "Bay Area, CA",
        department: "Engineering",
        jobType: "INTERNSHIP",
        remotePolicy: "ONSITE",
        stipend: "$40–$50/hour",
        duration: "Not specified",
        applyUrl: "https://jobs.ashbyhq.com/meshy/262d74c7-8aab-474e-9fc6-8c8c48ec6572",
      },
    ],
  },
  {
    slug: "didi-autonomous-driving",
    name: "DiDi Autonomous Driving",
    tagline: "Level 4 autonomous driving for shared mobility",
    about:
      "DiDi's autonomous driving division was established in 2016 and became an independent company in August 2019, focused on Level 4 autonomous driving technology to make transportation safer and more efficient through shared-mobility fleet integration (robotaxis). Headquartered in Beijing with U.S. R&D operations in the San Francisco Bay Area, it's led by co-founder and CEO Zhang Bo and backed by investors including SoftBank Vision Fund 2, GAC Capital, and Valeo, having raised over $1.5B across multiple rounds including a 2-billion-yuan Series D in October 2025.",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/7/75/DiDi_Logo.svg",
    fundingStage: "SERIES_C_PLUS",
    remotePolicy: "ONSITE",
    visaSponsorship: false,
    employeeCountRange: "1000+",
    websiteUrl: "https://www.didiglobal.com/science/intelligent-driving",
    categories: ["ai-ml", "consumer"],
    technologies: ["cpp"],
    location: { city: "Beijing", country: "China" },
    founders: [{ name: "Zhang Bo", title: "Co-founder & CEO, Autonomous Driving" }],
    links: [
      { type: "linkedin", url: "https://www.linkedin.com/company/didi-autonomous-driving/" },
      { type: "twitter", url: "https://x.com/didiglobal" },
    ],
    internships: [
      {
        slug: "didi-motion-planning-engineer-phd-intern",
        title: "Motion Planning Engineer (PhD, Intern)",
        description: `
<p>DiDi's autonomous driving division, established in 2016, became independent in August 2019. The organization focuses on Level 4 autonomous driving technology to make transportation safer and more efficient through shared-mobility fleet integration.</p>
<p>This position targets PhD graduates with strong research backgrounds to develop next-generation planning systems for autonomous vehicles using algorithm design and system integration expertise.</p>
<p><strong>Responsibilities</strong></p>
<ul>
<li>Implement behavioral planning solutions for lane changes, merges, yields, and multi-agent interactions.</li>
<li>Design motion planning algorithms combining geometry-based path reasoning and context-aware speed reasoning.</li>
<li>Develop core geometry and velocity planning systems for feasibility and comfort.</li>
<li>Model driving environments and agent behaviors for robust world representation.</li>
<li>Formulate cost functions balancing safety, comfort, and efficiency.</li>
<li>Analyze system performance through simulation and real-world data analysis.</li>
<li>Collaborate across Perception, Prediction, and Control teams.</li>
</ul>
<p><strong>Qualifications</strong></p>
<ul>
<li>PhD (completed or in-progress) in Robotics, Computer Science, Electrical Engineering, or a related field.</li>
<li>Research/internship experience in motion planning algorithms, behavioral planning, trajectory optimization, or multi-agent modeling.</li>
<li>Publications in top conferences (RSS, ICRA, IROS, CVPR, NeurIPS, CoRL).</li>
<li>C++ proficiency for real-time algorithm implementation.</li>
<li>Strong analytical and communication skills with a collaborative approach.</li>
</ul>
<p><strong>Benefits:</strong> top-performing interns may convert to full-time positions upon program completion; eligible for intern benefits.</p>
`.trim(),
        location: "San Jose, CA",
        department: "Autonomous Driving",
        jobType: "INTERNSHIP",
        remotePolicy: "ONSITE",
        stipend: "$46/hour",
        duration: "Not specified",
        applyUrl: "https://job-boards.greenhouse.io/didi/jobs/8056492",
      },
    ],
  },
  {
    slug: "blaze",
    name: "Blaze",
    tagline: "Global Venmo for cross-border payments",
    about:
      "Blaze (YC S24) is a peer-to-peer payments app that uses USDC to make cross-border payments fast and cheap between any two people anywhere in the world, built for digital nomads and expats who want the seamless \"Venmo experience\" globally.",
    logoUrl: "https://bookface-images.s3.us-west-2.amazonaws.com/logos/052bc2e2a09c898237e40b2e50a9b471dc81330b.png",
    fundingStage: "SEED",
    remotePolicy: "ONSITE",
    visaSponsorship: false,
    employeeCountRange: "1-10",
    websiteUrl: "https://blaze.money",
    categories: ["fintech"],
    technologies: ["react", "nodejs", "typescript", "graphql", "postgres"],
    location: { city: "San Francisco", country: "USA" },
    founders: [
      {
        name: "Faiyam Rahman",
        title: "Co-founder & CEO",
        linkedinUrl: "https://www.linkedin.com/in/faiyam-rahman/",
      },
      {
        name: "Luc Succès",
        title: "Co-founder",
        linkedinUrl: "https://www.linkedin.com/in/lucsucces/",
      },
    ],
    links: [
      { type: "linkedin", url: "https://www.linkedin.com/company/blazepayments" },
      { type: "twitter", url: "https://x.com/blaze_payments" },
      { type: "instagram", url: "https://www.instagram.com/blaze.payments/" },
    ],
    internships: [
      {
        slug: "blaze-junior-software-engineer",
        title: "Junior Software Engineer",
        description: `
<p>YC-backed fintech startup building cross-border payment solutions using USDC technology for US, Latin America, and global markets.</p>
<p><strong>Key Responsibilities</strong></p>
<ul>
<li>Leverage AI tools (Cursor, code generation) to accelerate frontend and backend feature development.</li>
<li>Build end-to-end features using React, React Native, and NodeJS.</li>
<li>Debug technical issues across platforms, combining AI workflows with hands-on problem-solving.</li>
<li>Collaborate on secure, scalable code for high-reliability financial applications.</li>
<li>Engage in system design discussions, proposing AI-enhanced solutions.</li>
<li>Stay current on AI advancements in software engineering.</li>
</ul>
<p><strong>Required Qualifications</strong></p>
<ul>
<li>Demonstrated project portfolio (school, personal, hackathons, open-source work).</li>
<li>Strong JavaScript, CSS, and modern web technology foundation.</li>
<li>Familiarity with React, React Native, or similar frameworks.</li>
<li>Proficiency in AI development tools (Cursor, Windsurf, GitHub Copilot).</li>
<li>Graduating senior or recent CS graduate.</li>
<li>Strong problem-solving and mathematical abilities.</li>
<li>Fintech passion.</li>
</ul>
<p><strong>Preferred Qualifications</strong></p>
<ul>
<li>Experience with Next.js, GraphQL, PostgreSQL, TypeScript, NestJS.</li>
<li>Hackathon wins or coding competition achievements.</li>
<li>AI-driven project experience.</li>
</ul>
`.trim(),
        location: "Mexico City, CDMX, Mexico",
        department: "Engineering",
        jobType: "FULL_TIME",
        remotePolicy: "ONSITE",
        stipend: "$10K–$18K/yr + 0.25%–0.50% equity",
        duration: "Permanent",
        applyUrl: "https://www.workatastartup.com/jobs/77590",
      },
    ],
  },
  {
    slug: "peakflo",
    name: "Peakflo",
    tagline: "Agentic workflows that automate back-office operations",
    about:
      "Peakflo (YC W22) builds agentic workflows and one-click ERP integrations that help finance teams eliminate manual work across invoice-to-cash, procure-to-pay, and travel & expense reimbursement. 100+ businesses use Peakflo to save 1,000+ man-hours/month on finance ops and get paid 15-25 days faster.",
    logoUrl: "https://bookface-images.s3.us-west-2.amazonaws.com/logos/c54017d959d79a792abd80ffdf6f95e446befaee.png",
    fundingStage: "SEED",
    remotePolicy: "REMOTE",
    visaSponsorship: false,
    employeeCountRange: "11-50",
    websiteUrl: "https://peakflo.co",
    categories: ["saas", "fintech", "ai-ml"],
    technologies: ["python", "gcp", "postgres", "mongodb"],
    location: { city: "Singapore", country: "Singapore" },
    founders: [
      {
        name: "Saurabh Chauhan",
        title: "Founder & CEO",
        linkedinUrl: "https://www.linkedin.com/in/saurabh-chauhan/",
      },
      { name: "Dmitry Vedenyapin", title: "Co-founder & CTO" },
    ],
    links: [
      { type: "linkedin", url: "https://www.linkedin.com/company/peakflo" },
      { type: "twitter", url: "https://x.com/getpeakflo" },
    ],
    internships: [
      {
        slug: "peakflo-forward-deployed-engineer",
        title: "Forward Deployed Engineer (FDE)",
        description: `
<p>Peakflo seeks a Forward Deployed Engineer to bridge agentic AI technology with real-world financial workflows, focusing on developing machine learning solutions for business growth and product optimization.</p>
<p><strong>Voice AI &amp; Prompt Engineering</strong></p>
<ul>
<li>Design conversational flows accounting for natural speech patterns, pauses, and interruptions optimized for voice-only interactions.</li>
<li>Implement LLM feedback loops and self-reflection mechanisms to detect hallucinations and improve prompts.</li>
<li>Establish A/B testing pipelines and performance QA tailored to financial use cases.</li>
<li>Integrate prompts with speech recognition, intent extraction, and telephony APIs while maintaining real-time responsiveness.</li>
</ul>
<p><strong>Agentic Architecture, LLMs &amp; RAG</strong></p>
<ul>
<li>Develop hierarchical finance AI agents coordinating multiple sub-agents for modularity.</li>
<li>Optimize performance using leading LLM platforms (Gemini, GPT, Claude).</li>
<li>Integrate retrieval-augmented generation with enterprise knowledge bases and financial APIs.</li>
<li>Architect LLM systems with third-party tools, email interactions, and user chat interfaces.</li>
</ul>
<p><strong>Data Analytics &amp; Workflow Automation</strong></p>
<ul>
<li>Analyze business processes and operational bottlenecks to identify improvements.</li>
<li>Automate workflows and reporting using Python and SQL.</li>
<li>Build dashboards and data monitoring frameworks.</li>
<li>Collaborate with product, engineering, and operational teams on requirements.</li>
</ul>
<p><strong>Required Qualifications</strong></p>
<ul>
<li>Bachelor's or Master's degree in Statistics, Machine Learning, Data Science, Computer Science, or related field.</li>
<li>0.5–2 years industry experience with ML, NLP, LLM fine-tuning, and prompt engineering.</li>
<li>Strong Python proficiency (back-end development focus).</li>
<li>Fluent English communication skills (written and verbal).</li>
<li>Production ML deployment experience.</li>
<li>Cloud platform familiarity (Google Cloud preferred).</li>
</ul>
<p><strong>Preferred Qualifications</strong></p>
<ul>
<li>Experience with multiple LLM platforms and orchestration frameworks (LangChain, LlamaIndex).</li>
<li>Advanced NLP techniques and library knowledge.</li>
<li>Software engineering best practices and Git version control expertise.</li>
</ul>
<p><strong>Benefits</strong> include a competitive compensation package, rapid career growth and skill development opportunities, a collaborative and innovative work environment, and flexible hours with remote work options.</p>
`.trim(),
        location: "India (Remote)",
        department: "Engineering",
        jobType: "FULL_TIME",
        remotePolicy: "REMOTE",
        stipend: "₹1M–₹1.3M/year",
        duration: "Permanent",
        applyUrl: "https://www.workatastartup.com/jobs/91111",
      },
      {
        slug: "peakflo-product-manager-intern",
        title: "Product Manager Intern",
        description: `
<p><strong>Key Responsibilities</strong></p>
<ul>
<li>Design and optimize autonomous workflows for Procure-to-Pay and Invoice-to-Cash processes.</li>
<li>Assist in defining product strategy and roadmap for specific modules.</li>
<li>Take ownership of high-impact features including multi-channel process triggers and vendor/customer portals.</li>
<li>Bridge engineering, design, and go-to-market teams.</li>
<li>Engage directly with B2B clients to uncover operational pain points and translate insights into actionable epics.</li>
<li>Drive product development from ideation to launch using Agile methodologies.</li>
<li>Define and track key product metrics like workflow completion rates and error reduction.</li>
</ul>
<p><strong>Core Requirements</strong></p>
<ul>
<li>Currently pursuing or recently completed Bachelor's or Master's degree in Business, Computer Science, Engineering, Finance, or related field.</li>
<li>Exceptional written and verbal English communication skills.</li>
<li>Strong analytical and problem-solving abilities with a systems-thinking approach.</li>
<li>High user empathy focused on friction elimination.</li>
<li>Extreme attention to detail in fast-paced startup environments.</li>
<li>Genuine passion for Agentic AI.</li>
</ul>
<p><strong>Preferred Qualifications</strong></p>
<ul>
<li>Experience with Jira, Linear, Figma, or Notion.</li>
<li>Background in B2B SaaS, FinTech, or accounting operations.</li>
<li>Familiarity with ERP functionality and API/SFTP integrations.</li>
<li>Understanding of LLM capabilities and AI agents.</li>
</ul>
<p><strong>Benefits</strong> include a competitive stipend, performance-based full-time conversion opportunity, comprehensive benefits post-conversion, mentorship from founders and product leaders, and flexible hours with remote work options.</p>
`.trim(),
        location: "India (Remote)",
        department: "Product",
        jobType: "INTERNSHIP",
        remotePolicy: "REMOTE",
        stipend: "₹360K–₹480K/year",
        duration: "Not specified",
        applyUrl: "https://www.workatastartup.com/jobs/95821",
      },
      {
        slug: "peakflo-technical-operations-ai-automation-engineer-bangkok",
        title: "Technical Operations & AI Automation Engineer (Bangkok/Hybrid)",
        description: `
<p>Peakflo seeks an engineer to own escalated production issues and build AI automation to prevent recurring problems. This L2 support and automation position reports directly to the CTO.</p>
<p><strong>L2 Investigation &amp; Incident Response</strong></p>
<ul>
<li>Manage escalated production issues including database anomalies, failed transactions, and data corruption.</li>
<li>Analyze PostgreSQL/MongoDB queries, slow logs, and index performance.</li>
<li>Resolve payment failures across Southeast Asian payment rails and PSP integrations.</li>
<li>Execute complex data migrations with zero data loss.</li>
<li>Document post-mortems and develop runbooks.</li>
</ul>
<p><strong>AI-Powered Automation</strong></p>
<ul>
<li>Build internal AI agents automating repetitive investigation workflows.</li>
<li>Deploy LLM-powered diagnostics for log analysis and anomaly detection.</li>
<li>Instrument systems with observability tools (Langfuse, OpenLLMetry).</li>
<li>Automate manual tasks identified as repetitive.</li>
</ul>
<p><strong>Platform &amp; Developer Tooling</strong></p>
<ul>
<li>Build CLI tools, dashboards, and internal scripts.</li>
<li>Manage CI/CD pipelines and deployment workflows.</li>
<li>Maintain GCP infrastructure (IAM, secrets, Docker/K8s).</li>
<li>Partner on ERP integrations (NetSuite, Xero) and payment provider onboarding.</li>
</ul>
<p><strong>Required Skills</strong></p>
<ul>
<li>PostgreSQL/MongoDB fluency with query optimization expertise.</li>
<li>Payment flow debugging and financial data pipeline experience.</li>
<li>Python and bash scripting proficiency.</li>
<li>Comfort managing ambiguous, high-pressure incidents.</li>
</ul>
<p><strong>Preferred Qualifications</strong></p>
<ul>
<li>Southeast Asian payment provider experience (GrabPay, PayNow, PromptPay, Xendit).</li>
<li>Hands-on AI coding agent usage (Claude Code, Cursor, Copilot).</li>
<li>LLMOps production deployment experience.</li>
<li>Fintech or B2B SaaS background.</li>
<li>ERP integration familiarity.</li>
</ul>
`.trim(),
        location: "Bangkok, Thailand",
        department: "Engineering",
        jobType: "FULL_TIME",
        remotePolicy: "HYBRID",
        stipend: "Not specified",
        duration: "Permanent",
        applyUrl: "https://www.workatastartup.com/jobs/92435",
      },
      {
        slug: "peakflo-technical-operations-ai-automation-engineer-india",
        title: "Technical Operations & AI Automation Engineer (India/Remote)",
        description: `
<p>Peakflo seeks an engineer combining technical operations expertise with AI automation capabilities — an L2 support and automation role serving as the final escalation point for production database issues, complex migrations, and payment flow failures, while automating repeatable solutions.</p>
<p><strong>L2 Investigation &amp; Incident Response</strong></p>
<ul>
<li>Own escalated production issues including database anomalies, failed transactions, and data corruption.</li>
<li>Conduct deep PostgreSQL/MongoDB query analysis: explain plans, slow query logs, lock contention evaluation.</li>
<li>Triage payment failures across Southeast Asian payment rails and reconciliation gaps.</li>
<li>Lead complex data migrations with zero data loss tolerance.</li>
<li>Author post-mortems and runbooks.</li>
</ul>
<p><strong>AI-Powered Automation</strong></p>
<ul>
<li>Build internal AI agents automating investigation workflows.</li>
<li>Deploy LLM-powered diagnostics for log summarization and anomaly detection.</li>
<li>Instrument production systems with observability tooling (Langfuse, OpenLLMetry).</li>
<li>Automate any manually repeated task.</li>
</ul>
<p><strong>Platform &amp; Developer Tooling</strong></p>
<ul>
<li>Build CLI tools, internal dashboards, and deployment scripts.</li>
<li>Manage CI/CD pipelines and staging/production alignment.</li>
<li>Maintain GCP infrastructure: IAM, secrets, Docker/Kubernetes deployments.</li>
<li>Support ERP integrations (NetSuite, Xero) and payment provider onboarding.</li>
</ul>
<p><strong>Required Qualifications</strong></p>
<ul>
<li>Fluency with PostgreSQL and/or MongoDB with explain plan proficiency.</li>
<li>Experience debugging payment flows and financial data pipelines.</li>
<li>Strong Python and bash scripting capabilities.</li>
<li>Ability to own ambiguous, high-pressure incidents with limited documentation.</li>
</ul>
<p><strong>Preferred Qualifications</strong></p>
<ul>
<li>Southeast Asian payment provider experience (GrabPay, PayNow, PromptPay, Xendit).</li>
<li>AI coding agent experience (Claude Code, Cursor, Copilot).</li>
<li>LLMOps exposure in production environments.</li>
<li>Fintech, B2B SaaS, or finance operations background.</li>
<li>NetSuite or Xero integration familiarity.</li>
</ul>
<p><strong>Benefits</strong> include competitive compensation, comprehensive health and wellness coverage, direct CTO access from day one, flexible hours and remote work options, and deep engineering platform exposure.</p>
`.trim(),
        location: "India (Remote)",
        department: "Engineering",
        jobType: "FULL_TIME",
        remotePolicy: "REMOTE",
        stipend: "₹1.2M–₹1.6M/year",
        duration: "Permanent",
        applyUrl: "https://www.workatastartup.com/jobs/91984",
      },
      {
        slug: "peakflo-machine-learning-engineer-intern",
        title: "Machine Learning (ML) Engineer Intern",
        description: `
<p>Peakflo is an AI-powered fintech startup backed by Y Combinator (W22) and Google AI Accelerator, automating accounts payable and receivable processes for over 100 companies globally.</p>
<p><strong>Key Responsibilities</strong></p>
<ul>
<li><strong>Voice-Optimized Prompt Design</strong> — design conversational flows that account for natural speech patterns (pauses, interruptions, intonation) while ensuring clarity for text-to-speech systems.</li>
<li><strong>Agentic Architecture Development</strong> — build hierarchical finance AI agents coordinating sub-agents for research, analysis, and reporting across sequential or plan-and-execute workflows.</li>
<li><strong>Continuous Prompt Refinement</strong> — implement feedback loops, A/B testing, prompt versioning, and fine-tune leading LLMs (Gemini, GPT, Claude) for financial applications.</li>
<li><strong>RAG Integration &amp; Grounding</strong> — integrate retrieval-augmented generation with enterprise knowledge bases and financial APIs while maintaining domain-specific context control.</li>
<li><strong>Voice Integration &amp; Tech Stack Collaboration</strong> — partner with engineering teams integrating prompts with speech recognition, intent extraction, LiveKit voice infrastructure, and telephony APIs.</li>
<li><strong>AI Solution Development</strong> — create complementary components including OCR models, chatbots, and automated approval systems supporting financial workflows.</li>
</ul>
<p><strong>Experience Requirements</strong></p>
<ul>
<li>Bachelor's or Master's degree in Statistics, Machine Learning, Data Science, or related field.</li>
<li>0.5–2 years of industry experience with ML, Statistics, LLM fine-tuning, or prompt engineering.</li>
<li>Fluent English (written and verbal).</li>
<li>Strong Python back-end development experience.</li>
<li>Production-level ML product deployment experience.</li>
</ul>
<p><strong>Preferred Qualifications</strong></p>
<ul>
<li>Experience with multiple LLM platforms.</li>
<li>Familiarity with NLP libraries and techniques.</li>
<li>Software engineering best practices knowledge.</li>
<li>Git version control proficiency.</li>
</ul>
<p><strong>Benefits</strong> include a performance-based full-time role conversion opportunity, benefits package upon conversion, career growth and skill development, and flexible hours.</p>
`.trim(),
        location: "India (Remote)",
        department: "Engineering",
        jobType: "INTERNSHIP",
        remotePolicy: "REMOTE",
        stipend: "₹480K–₹600K/year",
        duration: "Not specified",
        applyUrl: "https://www.workatastartup.com/jobs/90065",
      },
      {
        slug: "peakflo-data-analyst",
        title: "Data Analyst",
        description: `
<p><strong>Responsibilities</strong></p>
<ul>
<li>Examine business workflows, identify data quality gaps, and pinpoint operational inefficiencies to drive improvements.</li>
<li>Engineer scalable solutions targeting recurring operational problems.</li>
<li>Build Python and SQL-based automation for workflows, data transformations, and reporting systems.</li>
<li>Develop dashboards, monitoring frameworks, and comprehensive reporting infrastructure.</li>
<li>Work with product, engineering, and operations teams to establish specifications and execute implementations.</li>
<li>Execute root cause investigations and communicate findings with strategic recommendations.</li>
<li>Optimize existing automation frameworks and data pipelines for increased scalability.</li>
<li>Provide transparent documentation of processes and solutions for organizational stakeholders.</li>
</ul>
<p><strong>Required Qualifications</strong></p>
<ul>
<li>Approximately 1 year of professional experience in analytics, automation, or operational data roles.</li>
<li>Demonstrated expertise building and deploying cursor-based agents (or comparable tools) with MCP server integration.</li>
<li>Strong Python capabilities, particularly for data handling, automation, and API integration.</li>
<li>Solid SQL competency including complex operations and query optimization.</li>
<li>Logical problem-solving ability with analytical depth.</li>
<li>Capacity to architect extensible solutions rather than temporary patches.</li>
<li>Skill translating unclear specifications into logical workflows.</li>
<li>Strong interpersonal and documentation abilities.</li>
<li>Detail-oriented with an action-oriented mindset.</li>
<li>Cross-functional collaboration and multitasking proficiency.</li>
<li>Git version control familiarity.</li>
</ul>
<p><strong>Preferred Qualifications</strong></p>
<ul>
<li>Cloud infrastructure experience (Docker, Kubernetes, GCP).</li>
<li>Exposure to workflow automation platforms like n8n, Airflow, or dbt.</li>
</ul>
`.trim(),
        location: "India (Remote)",
        department: "Engineering",
        jobType: "FULL_TIME",
        remotePolicy: "REMOTE",
        stipend: "₹700K–₹1M/year",
        duration: "Permanent",
        applyUrl: "https://www.workatastartup.com/jobs/86654",
      },
    ],
  },
  {
    slug: "venu-ai",
    name: "Venu AI",
    tagline: "Meet qualified leads in person by automating conference production",
    about:
      "Venu AI (YC W21) helps B2B companies meet qualified sales leads in person by automating conference production — hosting a conference and meeting ~100 qualified sales leads every 3 months, fully automated. Based in San Jose, CA.",
    logoUrl: "https://bookface-images.s3.amazonaws.com/small_logos/9c457be8f075da33530f9e844d5a01a959451c8d.png",
    fundingStage: "SEED",
    remotePolicy: "REMOTE",
    visaSponsorship: false,
    employeeCountRange: "1-10",
    websiteUrl: "https://venu3d.com",
    categories: ["saas", "consumer"],
    technologies: ["python", "react", "django", "azure"],
    location: { city: "San Jose", country: "USA" },
    founders: [
      {
        name: "Jeremy Lam",
        title: "Founder & CEO",
        linkedinUrl: "https://www.linkedin.com/in/jeremyclam/",
      },
      {
        name: "Justin Chen",
        title: "Founder",
        linkedinUrl: "https://www.linkedin.com/in/chenjustint",
      },
    ],
    links: [
      { type: "linkedin", url: "https://www.linkedin.com/company/venu3d" },
      { type: "twitter", url: "https://x.com/venu_3d" },
    ],
    internships: [
      {
        slug: "venu-ai-software-engineering-intern",
        title: "Software Engineering Intern",
        description: `
<p>This is a part-time AI software engineering opportunity with significant responsibilities and high impact, initially unpaid.</p>
<p><strong>Key Responsibilities</strong></p>
<ul>
<li>Build AI features automating manual tasks and solving customer pain points on the Venu platform.</li>
<li>Serve as a customer, using Venu AI to host conferences and develop customer empathy.</li>
<li>Rapidly acquire proficiency in Python, React, Django, Microsoft Azure AI/ML, databases, and GitHub DevOps automation.</li>
<li>Deliver a first feature within 2 weeks; contribute to complete product delivery within 2 months.</li>
<li>Demonstrate passion, proactivity, strong communication, and commitment to team success.</li>
</ul>
<p><strong>Required Skills:</strong> Microsoft Azure, Python, React.</p>
<p><strong>Interview Process</strong></p>
<ul>
<li>Identify a B2B SaaS startup CEO via LinkedIn and the company website.</li>
<li>Complete the provided email template with relevant information.</li>
<li>Send the email to jeremy@venu3d.com.</li>
<li>Watch the onboarding video before scheduling a call.</li>
<li>Schedule an onboarding call to receive an offer letter.</li>
</ul>
`.trim(),
        location: "Remote",
        department: "Engineering",
        jobType: "INTERNSHIP",
        remotePolicy: "REMOTE",
        stipend: "Unpaid",
        duration: "Part-time, up to 5 hrs/week",
        applyUrl: "https://www.workatastartup.com/jobs/71363",
      },
      {
        slug: "venu-ai-conference-director",
        title: "Conference Director",
        description: `
<p>Candidates will host their own conference using Venu's platform and generate income through conference sponsorships. Venu AI is a Harvard and Y Combinator-backed startup founded by Jeremy Lam. The company helps founders build top-of-funnel sales, achieve 40% response rates from qualified leads, establish communities, and host automated 100-person conferences within 90 days.</p>
<p><strong>Key Responsibilities</strong></p>
<ul>
<li>Own conference production, strategy, and execution end-to-end, hosting a 100-person conference within 3 months.</li>
<li>Utilize Venu AI to automate conference production workflows.</li>
<li>Analyze weekly campaign data, identify challenges, develop strategy solutions, and iterate continuously.</li>
<li>Demonstrate passionate, proactive teamwork with strong communication skills and positive energy.</li>
<li>Support team members in achieving success and fulfillment.</li>
</ul>
<p><strong>Application Process:</strong> candidates must research a B2B SaaS startup CEO, personalize an outreach email using a provided template, and send it to jeremy@venu3d.com. Selected applicants complete onboarding training and schedule calls with the team.</p>
`.trim(),
        location: "Remote",
        department: "Sales",
        jobType: "CONTRACT",
        remotePolicy: "REMOTE",
        stipend: "$500–$1.5K/month",
        duration: "Not specified",
        applyUrl: "https://www.workatastartup.com/jobs/75840",
      },
    ],
  },
  {
    slug: "superkalam",
    name: "SuperKalam",
    tagline: "AI-powered super mentor for test prep",
    about:
      "SuperKalam (YC W23) is India's first AI-led personal mentor for students preparing for competitive exams, starting with UPSC Civil Services and expanding into K-12. It serves 60,000+ students with instant answer evaluation, unlimited MCQ practice, and 24/7 doubt resolution, and is backed by Y Combinator and Google for Startups.",
    logoUrl: "https://superkalam.com/assets/images/LogoWithTextV2.webp",
    fundingStage: "SEED",
    remotePolicy: "REMOTE",
    visaSponsorship: false,
    employeeCountRange: "11-50",
    websiteUrl: "https://superkalam.com",
    categories: ["edtech", "ai-ml"],
    technologies: ["python", "nodejs", "postgres", "typescript", "react-native", "nextjs", "redis", "mysql", "aws"],
    location: { city: "Bengaluru", country: "India" },
    founders: [
      {
        name: "Vimal Singh Rathore",
        title: "Founder & CEO",
        linkedinUrl: "https://www.linkedin.com/in/vimalsinghrathore",
      },
      {
        name: "Aseem Gupta",
        title: "Founder & CTO",
        linkedinUrl: "https://www.linkedin.com/in/-aseemgupta",
      },
    ],
    links: [
      { type: "twitter", url: "https://twitter.com/SuperKalam_" },
      { type: "instagram", url: "https://instagram.com/superkalam_" },
      { type: "youtube", url: "https://www.youtube.com/@superkalam_" },
      { type: "facebook", url: "https://www.facebook.com/superkalamofficial" },
    ],
    internships: [
      {
        slug: "superkalam-ai-ml-research-intern",
        title: "AI/ML Research (Internship)",
        description: `
<p>Seeking candidates with experience in traditional ML techniques and generative agentic workflows for a fast-paced environment. Applicants are encouraged to email a Loom demo with walkthroughs of their top two projects.</p>
<p><strong>Key Requirements</strong></p>
<ul>
<li>Prior internship in AI/ML, or quality projects using Python/NodeJS.</li>
<li>Experience building agentic workflows and AI pipelines (mandatory).</li>
<li>Work with AI voice agents using STT/TTS.</li>
<li>Experience with retrieval RAGs or knowledge graphs.</li>
<li>Prompt engineering proficiency.</li>
<li>GitHub and Google Colab comfort.</li>
</ul>
<p><strong>Bonus Skills</strong></p>
<ul>
<li>Model training in text, image, or voice domains.</li>
<li>Dashboard/workflow creation using Claude Code or Codex.</li>
<li>PostgreSQL, rate limiting, and basic security knowledge.</li>
</ul>
<p><strong>Core Responsibilities</strong></p>
<ul>
<li>Build pipelines and prepare high-quality datasets with the content team.</li>
<li>Research and implement approaches from academic papers/blogs.</li>
<li>Execute AI experiments and fine-tuning tasks.</li>
<li>Stay current with emerging models, training techniques, and tools.</li>
<li>Demonstrate smooth communication, ownership, and agility.</li>
</ul>
`.trim(),
        location: "India (Remote / Bengaluru preferred)",
        department: "Engineering, Machine Learning",
        jobType: "INTERNSHIP",
        remotePolicy: "REMOTE",
        stipend: "₹25,000–₹40,000/month",
        duration: "4 to 6+ months",
        applyUrl: "https://www.workatastartup.com/jobs/64551",
      },
      {
        slug: "superkalam-mobile-engineer-react-native-fullstack",
        title: "Mobile Engineer (React Native + Fullstack)",
        description: `
<p>SuperKalam is building an AI-powered education platform similar to Duolingo. This role involves developing features across mobile and backend systems during a significant growth period for the company.</p>
<p><strong>Key Responsibilities</strong></p>
<ul>
<li>Build new features and initiatives in backend and mobile applications.</li>
<li>Manage deployments, performance optimization, and push notifications.</li>
<li>Establish tooling and run experiments, including automation workflows and AI systems.</li>
<li>Participate in product and design reviews.</li>
<li>Advance team technical capabilities by staying current with evolving technologies.</li>
<li>Balance speed-to-production with quality considerations.</li>
<li>Demonstrate smooth communication, ownership, and agility.</li>
</ul>
<p><strong>Core Requirements</strong></p>
<ul>
<li>Strong JavaScript/TypeScript fundamentals and object-oriented programming.</li>
<li>React Native expertise with high-quality UI, smooth animations, and mobile optimization knowledge.</li>
<li>Backend skills: CRUD APIs, Redis, caching, PostgreSQL/MySQL, rate limiting, basic scaling and security.</li>
<li>Cloud platform experience (AWS, Azure, or GCP).</li>
<li>System design proficiency at both low and high levels.</li>
</ul>
<p><strong>Preferred Qualifications</strong></p>
<ul>
<li>2+ years product-based startup experience.</li>
<li>AI/ML background or production AI pipeline experience.</li>
<li>Elasticsearch familiarity.</li>
<li>Python proficiency.</li>
<li>Agentic workflow development.</li>
<li>Voice agent implementation.</li>
</ul>
`.trim(),
        location: "Bengaluru, India",
        department: "Engineering, Full Stack",
        jobType: "FULL_TIME",
        remotePolicy: "ONSITE",
        stipend: "₹1.5M–₹3.4M/year + ESOPs",
        duration: "Permanent",
        applyUrl: "https://www.workatastartup.com/jobs/90951",
      },
      {
        slug: "superkalam-mobile-engineer-react-native-intern",
        title: "Mobile Engineer - React Native (Internship)",
        description: `
<p>Position for developers with prior high-quality mobile app experience seeking a fast-paced environment. Applicants are encouraged to submit a Loom demo and project walkthrough.</p>
<p><strong>Key Requirements</strong></p>
<ul>
<li>Minimum 4+ months of prior internship experience in React Native (mandatory).</li>
<li>Previously built high-quality production mobile apps in React Native.</li>
<li>Solid JavaScript/TypeScript understanding and mastery of SOLID principles.</li>
<li>Capability to build exceptional UI layouts and fluid animations.</li>
<li>Native Android development knowledge, including bridge writing.</li>
</ul>
<p><strong>Bonus Skills</strong></p>
<ul>
<li>Push notifications, persistent notifications, and widgets.</li>
<li>Meta ad integration.</li>
<li>Personalization/gamification app experience.</li>
<li>PostgreSQL, rate limiting basics, and security fundamentals.</li>
</ul>
<p><strong>Responsibilities</strong></p>
<ul>
<li>Build high-quality features from scratch in a lean team.</li>
<li>Prioritize smooth communication, ownership, and agility.</li>
</ul>
<p><strong>Growth Opportunity:</strong> 50%+ of the team converted from internships to full-time roles with 1-2+ year tenure.</p>
`.trim(),
        location: "India (Remote / Bengaluru preferred)",
        department: "Engineering, Android",
        jobType: "INTERNSHIP",
        remotePolicy: "REMOTE",
        stipend: "₹25,000–₹45,000/month",
        duration: "4 to 6+ months",
        applyUrl: "https://www.workatastartup.com/jobs/67538",
      },
      {
        slug: "superkalam-fullstack-engineer-intern",
        title: "Fullstack Engineer (Internship)",
        description: `
<p>This role targets developers who have previously built high-quality web apps and worked on backend systems, and thrive in fast-paced environments. Candidates should submit a Loom video walkthrough of their top two projects to stand out.</p>
<p><strong>Key Responsibilities</strong></p>
<ul>
<li>Build landing pages, payment interfaces, and interactive applications on superkalam.com and heyhomi.in.</li>
<li>Allocate approximately 80% effort toward frontend development initially.</li>
<li>Create student dashboards with personalization features, streaks, and other modules.</li>
<li>Develop backend features, AI integrations, and experimental projects.</li>
<li>Optimize page performance and ensure responsive design.</li>
<li>Take on increasing responsibilities as you progress.</li>
</ul>
<p><strong>Requirements</strong></p>
<ul>
<li>Demonstrated experience building multiple Next.js projects with quality UI and performance optimization.</li>
<li>Backend expertise including database design, scalable architecture, caching, and complete feature implementation.</li>
<li>Proficiency in JavaScript, Node.js, and TypeScript.</li>
<li>Prior internship experience showing production-level work depth.</li>
<li>Bonus: experience with AI projects using LangGraph, RAG implementations, or voice technologies.</li>
<li>Strong communication skills and a natural ownership mindset.</li>
</ul>
<p><strong>Tech Stack:</strong> Next.js/React Native, Tailwind CSS, Express.js/NestJS, PostgreSQL, Redis.</p>
<p><strong>Growth Opportunity:</strong> over 50% of the team transitioned from internships to full-time roles with 1-2+ year tenure.</p>
`.trim(),
        location: "Bengaluru, India (Remote preferred)",
        department: "Engineering, Full Stack",
        jobType: "INTERNSHIP",
        remotePolicy: "REMOTE",
        stipend: "₹25,000–₹35,000/month",
        duration: "4 to 6+ months",
        applyUrl: "https://www.workatastartup.com/jobs/64578",
      },
      {
        slug: "superkalam-lead-product-designer",
        title: "Lead Product Designer (Core Team, 3-4yrs experience)",
        description: `
<p>SuperKalam seeks a designer with exceptional quality standards and strong ownership to create phenomenal user experiences for an AI-powered education platform comparable to Duolingo.</p>
<p><strong>Key Responsibilities</strong></p>
<ul>
<li>Collaborate closely with founders and the engineering team on strategic initiatives.</li>
<li>Lead prototyping using Figma and AI-powered design tools.</li>
<li>Create visual enhancements through illustrations and animations (Jitter, Rive, Lottie).</li>
<li>Conduct user research including surveys and user interviews.</li>
<li>Make data-driven design decisions with awareness of cross-platform challenges.</li>
<li>Implement organized design thinking with competitive analysis.</li>
</ul>
<p><strong>Required Qualifications</strong></p>
<ul>
<li>3-4 years demonstrating both functional and beautiful design execution.</li>
<li>Proven product thinking from product-based organizations.</li>
<li>Strong design portfolio.</li>
<li>Experience with dark/light modes and design systems.</li>
<li>AI integration in design processes and workflows.</li>
<li>Proficiency with Figma.</li>
<li>Multidisciplinary thinking (motion design, animation tools).</li>
</ul>
<p><strong>Preferred Skills</strong></p>
<ul>
<li>Gamification and personalization flow experience.</li>
<li>Rapid learning mindset for early-stage startup growth.</li>
<li>Balance between design perfection and speed.</li>
<li>Strong individual contributor mentality.</li>
</ul>
`.trim(),
        location: "Bengaluru, India",
        department: "Design",
        jobType: "FULL_TIME",
        remotePolicy: "ONSITE",
        stipend: "₹1.8M–₹3M/year + ESOPs",
        duration: "Permanent",
        applyUrl: "https://www.workatastartup.com/jobs/65916",
      },
    ],
  },
  {
    slug: "verisk",
    name: "Verisk",
    tagline: "Leading data analytics and technology partner to the global insurance industry",
    about:
      "For over 50 years, Verisk (NASDAQ: VRSK) has been the leading data analytics and technology partner to the global insurance industry, empowering communities and businesses to make better decisions on risk, faster. Verisk's ~7,000 employees serve customers across underwriting, claims, property estimating, specialty business, catastrophe risk, marketing, and life insurance solutions. Verisk has been recognized as a Great Place to Work in the US, UK, Spain, India, and Poland, and named a Best-Managed Company by The Wall Street Journal and a World's Best Employer by Forbes.",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Verisk_Analytics_Logo.svg",
    fundingStage: "PUBLIC",
    remotePolicy: "HYBRID",
    visaSponsorship: false,
    employeeCountRange: "1000+",
    websiteUrl: "https://www.verisk.com",
    categories: ["saas", "ai-ml"],
    technologies: ["aws", "azure", "gcp", "python", "java", "csharp", "angular", "react", "typescript", "postgres", "mysql", "docker", "kubernetes", "fastapi"],
    location: { city: "Jersey City", country: "USA" },
    founders: [
      {
        name: "Lee Shavel",
        title: "President & CEO",
        linkedinUrl: "https://www.linkedin.com/in/lee-shavel-521a5036",
      },
    ],
    links: [
      { type: "linkedin", url: "https://www.linkedin.com/company/verisk-analytics" },
      { type: "twitter", url: "https://twitter.com/Verisk" },
      { type: "youtube", url: "https://www.youtube.com/c/Verisk_VRSK" },
    ],
    internships: [
      {
        slug: "verisk-tech-2026-summer-internship-program",
        title: "Tech | 2026 Summer Internship Program",
        description: `
<p><strong><u>Program Overview: </u></strong></p><p>Verisk‘s Summer Internship Program is designed to provide you with real work experience, professional development, and networking opportunities. This is a full-time (40 hours/ week) paid internship program spanning ten weeks from June through August 2026. Participation in the internship program requires that you are located near your assigned office as the program is a hybrid work schedule, requiring you to be in the office at least 2 days per week.</p><p><strong>We are hiring in the following U.S. locations</strong>: </p><ul><li>Lehi, UT</li><li>Jersey City, NJ</li><li>Holmdel, NJ</li></ul><p>We have opportunities for students interested in exploring careers in tech around the globe. Verisk is a leading data analytics provider serving customers in insurance. Our team of nearly 7,000 helps customers make crucial decisions every day about risk—with greater precision, efficiency, and discipline.</p><p><strong><u>Internship Roles We’re Looking to Fill:</u></strong></p><ul><li>Software Developer</li><li>DevOps</li><li>Technical Analyst</li></ul><p><strong><u>Application Deadline:</u></strong> Monday, October 6th, 2025</p><p><strong><u>Recruitment Process:</u></strong></p><p>We want to get to know YOU. Once you apply, our team will review your application. Successful candidates will be invited to a two-stage interview process including:</p><ol><li><strong>Technical Assessment:</strong> Should your profile be a match, we will ask you to complete a HackerRank technical assessment. In the assessment, you'll have an opportunity to code in a language of your choice, and also answer some basic multiple-choice questions. This will help us understand how you approach and solve technical challenges. During this assessment, you'll also have an opportunity to tell us more about your location and job interests.</li><li><strong>Recruiter Screening Call:</strong> During this round, you’ll connect with a member of our campus recruiting team for a brief conversation. We’ll review your background, discuss your interests and goals, and share more about the Summer Internship Program. This is also a great opportunity for you to ask questions and learn more about what it’s like to start your career at Verisk.</li><li><strong>Final Live Virtual Interview</strong>: During this round, you'll speak with members of our technical recruitment committee, who represent all our businesses across the US. At this point, we know you have the technical skills to succeed at Verisk and have the passion for this field. In this final round, it’s all about determining if you are the right fit for Verisk, and Verisk is the right fit for you. </li><li><strong>Offer:</strong> Our committee will then meet and discuss your candidacy. We will discuss your location, industry, and technical interests, as well as your ability to add to our culture at Verisk. If we extend you an offer, we will advise you as to the business and location where we are placing you.</li></ol>
<p><strong>Responsibilities</strong></p>
<p><strong><u>What You Could Learn:</u></strong></p><ul><li>Analyze and develop custom made solutions for global company and high-profile clients</li><li>Employ proficient programming knowledge to create new applications to optimize business </li><li>Uncover and anticipate breaches or security flaws to protect customer information and prevent online threats </li><li>Perform hands-on coding, configuration and testing with a team and individually</li><li>Contribute to new and existing applications along with creating enhancements to websites, web applications, and infrastructure </li><li>Partner with several Project Managers from our Agile Project Management organization to learn firsthand how agile project management practices are used to plan, deliver, and continuously improve value delivery for our business partners</li><li>Working cross-functionally across Data Science, Business Analysis and other teams</li></ul>
<p><strong>Qualifications</strong></p>
<p><strong><u>What We’re Looking For:</u></strong></p><p><strong>Skills and Knowledge  </strong></p><ul><li>Eagerness to learn, take on new projects, and experience all aspects of software development</li><li>Basic working knowledge with program/coding terminology, web/app design, and data management </li><li>Ability to learn and adapt to continuously changing technology</li><li>Engaged, focused, organized, and detail-oriented problem solvers</li></ul><p>You'll notice we did not list specific skills. That's because the "stuff" that matters, the passion, the quantitative mindset, the ability to be a good teammate but also operate independently - these are what we are evaluating you on. We seek innovators who can add to our culture, contribute to our growth, and strive for excellence.  </p><p><strong>Experience  </strong></p><ul><li>Enrolled in bachelors or masters program or bootcamp with coursework in computer science, data structures, logic and computation, etc. </li><li>Verisk businesses leverage a wide variety of tech stacks, and you may be working on Java, .Net, or something else, depending on the business where you are assigned. It would be helpful (though not required) if you have some of the following experience:<ul><li>Infrastructure: AWS, Azure, GCP</li><li>Front-End: Angular, React, NodeJS</li><li>Back-End: Python, Java, C++, Spring, C#, Microsoft SQL, and other database technologies from Microsoft and/ or AWS</li></ul></li><li>Don’t worry about knowing all the technologies involved - we’ll teach you, but if you have any prior experience, it’s a definite plus, so please be sure to include your technical skillset on your resume, so we can see your experience and interests </li></ul><p><i><strong>The Internship Program is not eligible for work visa sponsorship.  If you will require work visa sponsorship (e.g., H1-B visa)” after completing your degree, you do not meet the basic requirements of the summer intern role.</strong></i></p><p><i><strong></strong></i></p>
`.trim(),
        location: "Jersey City, NJ / Lehi, UT / Holmdel, NJ",
        department: "Technical Product Development",
        jobType: "INTERNSHIP",
        remotePolicy: "HYBRID",
        stipend: "Not specified",
        duration: "10 weeks, June\u2013August 2026",
        applyUrl: "https://fa-ewmy-saasfaprod1.fa.ocs.oraclecloud.com/hcmUI/CandidateExperience/en/sites/CX_1/job/2257",
      },
      {
        slug: "verisk-mid-full-stack-developer-csharp-angular",
        title: "Mid Full Stack Developer (C#/Angular)",
        description: `
<p>As a Mid FullStack Developer, you will be involved in the design, development, and maintenance of modern software solutions used by global clients. You will work closely with senior developers, technical leads, and other stakeholders across the development lifecycle, contributing high‑quality code and continuously improving our applications. This role offers exposure to complex systems, collaborative teamwork, and opportunities for professional growth.</p><p><strong>Why Join Us?</strong></p><ul><li>Work in a collaborative, international team based in <strong>Málaga</strong></li><li>Contribute to meaningful, long‑term products used by global clients</li><li>Learn from experienced engineers and grow your technical expertise</li><li>Enjoy a supportive environment that values quality, learning, and teamwork</li></ul>
<p><strong>Responsibilities</strong></p>
<ul><li>Design, develop, maintain, and test new and existing .NET applications and components</li><li>Contribute to the implementation of new features, enhancements, and system improvements</li><li>Write clean, maintainable, and well‑tested code following best practices</li><li>Collaborate with developers, QA, product owners, and other stakeholders to deliver agreed objectives</li><li>Participate actively in Agile ceremonies such as planning sessions, daily stand‑ups, reviews, and retrospectives</li><li>Support code reviews and contribute to technical discussions and design decisions</li><li>Produce and maintain technical documentation when required</li><li>Assist with third‑level support and troubleshooting for business‑critical systems</li><li>Continuously learn and apply new technologies and approaches to improve product quality and performance</li></ul>
<p><strong>Qualifications</strong></p>
<ul><li>Degree in Computer Science or a related field, or equivalent professional experience</li><li>Solid experience with <strong>.NET / C#</strong> and object‑oriented programming principles</li><li>Experience in front end development: Angular, React, Typescript.</li><li>Experience working across the software development lifecycle</li><li>Knowledge of relational databases and database design</li><li>Familiarity with web applications, multi‑tier architectures, and modern development practices</li><li>Understanding of Agile methodologies (Scrum experience is a plus)</li><li>Ability to work independently while knowing when to collaborate or seek support</li><li>Strong problem‑solving skills and willingness to learn and adapt in a changing technical environment</li><li>Good communication skills and a collaborative mindset</li></ul>
`.trim(),
        location: "Malaga, Spain",
        department: "Technical Product Development",
        jobType: "FULL_TIME",
        remotePolicy: "HYBRID",
        stipend: "Not specified",
        duration: "Permanent",
        applyUrl: "https://fa-ewmy-saasfaprod1.fa.ocs.oraclecloud.com/hcmUI/CandidateExperience/en/sites/CX_1/job/3600",
      },
      {
        slug: "verisk-sdet-ii",
        title: "SDET II (hybrid)",
        description: `
<p>Do you have 3+ years of experience and thrive in a small, dynamic, and fast-paced team? Are you curious about how things work and enjoy trying to break things? Do you want work where you are valued as a key member of the engineering team? If this entices you, read on...</p><p><br>The candidate will report directly to a special project team that has been charged with redesigning and enhancing ISO ClaimSearch®, the insurance industry’s premier and only all claims database. He/she will work closely with a small number of agile teams serving as the “Automation Test Lead”, and drive all processes and tools used to achieve automated regression & functional testing. Prior experience developing and implementing automated regression testing suites is required.<br> </p>
<p><strong>Responsibilities</strong></p>
<ul><li>Own the Software QA process, including developing, implementing, and maintaining test plans, test scenarios, and test cases</li><li>Analyze requirements and design specifications for test case development</li><li>Recommend test automation approach, tools, and frameworks</li><li>Develop test infrastructure and custom automation tools as needed to expand test coverage and enable non-functional testing</li><li>Perform manual and automated tests for our website and applications</li><li>Prioritize test execution</li><li>Find and report defects with detailed, accurate, and concise steps to reproduce</li><li>Assist developers in discovering and researching defects, and recommend system enhancements</li><li>Complete ownership for all testing across multiple applications built with a varied set of tools/technologies</li><li>Hands-on testing that includes analyzing requirements, preparing test plans, and building appropriate test cases to validate the functionality being built</li><li>Support and execution of the application testing phase (functional & non-functional) to ensure all software meets requirements before changes are placed in production.</li><li>Liaison/co-ordination with other technology groups (across sites) to coordinate/execute end-end testing</li><li>Drive all efforts on test automation, including planning, hands-on scripting, and oversight of other resources working on automation.<br></li></ul>
<p><strong>Qualifications</strong></p>
<ul><li>Experience breaking complex software systems</li><li>Experience evaluating software architectures and designs to identify potential quality, performance, and scalability weaknesses or limitations and developing an automated test regimen to fully exercise these suspect areas</li><li>Experience leading QA process development, execution, and documentation</li><li>A strong command of manual and automated testing methodologies and general quality concepts</li><li>Experience with Agile and Scrum</li><li>Experience with scripting software automation testing products, including Selenium, Cucumber and Playwright</li><li>Experience with Automation Framework Development using Selenium, Java and TypeScript</li><li>Experience in TDD, BDD, and ATDD</li><li>Experience in designing automation testing tools to test databases and APIs using</li><li>Experience in Mobile Automation Testing tools</li><li>Experience with LoadRunner/JMeter load testing</li><li>Extensive knowledge of web technologies and experience testing web APIs/REST services</li><li>Experience in automating complex systems integration (End-To-End)</li><li>Experience integrating the execution of Selenium regression scripts with Continuous Integration build servers like Jenkins</li><li>Experience testing hosted/cloud SaaS web applications is highly desirable</li><li>Experience in Mobile Automation testing and tools</li><li>Experience testing native mobile applications is desirable</li><li>Bachelor’s in Computer Science, or related field or equivalent experience</li></ul><p><br></p>
`.trim(),
        location: "Jersey City, NJ",
        department: "Technical Product Development",
        jobType: "FULL_TIME",
        remotePolicy: "HYBRID",
        stipend: "Not specified",
        duration: "Permanent",
        applyUrl: "https://fa-ewmy-saasfaprod1.fa.ocs.oraclecloud.com/hcmUI/CandidateExperience/en/sites/CX_1/job/3651",
      },
      {
        slug: "verisk-senior-analyst-software-engineering",
        title: "Senior Analyst, Software Engineering | Software Engineer II",
        description: `
<p>The Software Engineer II is an early- to mid-career professional responsible for contributing to the design, development, testing, and delivery of high-quality software solutions that support Verisk Weather Solutions products and services. This role focuses on building reliable, scalable systems that ingest, process, and deliver radar-based and other meteorological data products, with a strong emphasis on correctness, performance, and data integrity.</p><p>The individual will work closely with software engineers, product managers, scientists, and software architects to implement well-defined designs and support applications that rely heavily on radar and weather data formats. While the role may interact with data-driven or model-assisted workflows, the primary emphasis is on software engineering excellence and hands-on experience working with radar and meteorological data, rather than AI or model development.</p>
<p><strong>Responsibilities</strong></p>
<p>- Design, implement, test, and maintain software components using Python and C/C++.</p><p>- Implement architectural designs and technical patterns defined by senior engineers and software architects.</p><p>- Develop and maintain systems that ingest, transform, validate, and serve radar and weather data products.</p><p>- Own well-defined features or services from development through deployment and operational support.</p><p>- Write clean, maintainable, and well-tested code that meets performance, reliability, and quality standards.</p><p>- Participate in technical design discussions and provide implementation-focused input on proposed solutions.</p><p>- Work cross-functionally with product managers and scientists to translate domain-specific requirements into technical solutions.</p><p>- Contribute to peer code reviews and shared engineering best practices.</p>
<p><strong>Qualifications</strong></p>
<p>- Bachelor’s degree or equivalent practical experience in Computer Engineering, Software Engineering, or a related scientific or engineering discipline such as Atmospheric Science, Meteorology, Hydrology, Physics, Mathematics, or Engineering.</p><p>- At least 2 years of professional software engineering experience in an industry environment.</p><p>- Professional experience with Python and C/C++.</p><p>- Experience working across the full Software Development Lifecycle.</p><p>- Familiarity with CI/CD workflows and tools such as GitLab CI, Jenkins, or Bamboo.</p><p>- Experience using version control systems (e.g., Git).</p><p>- Hands-on professional experience working with radar and weather data.</p><p>- Direct experience with one or more weather or radar data formats such as NEXRAD Level II, GRIB2, or NetCDF.</p><p>Preferred Qualifications</p><p>- Strong experience developing or maintaining systems that process radar data at scale, including real-time or near–real-time pipelines.</p><p>- Familiarity with geospatial data concepts and coordinate systems.</p><p>- Experience collaborating closely with scientists or domain experts.</p><p>- Exposure to data-driven or analytics-enabled systems.</p><p>- Experience in high-performance, data-intensive, or scientific computing environments.</p><p>Additional Information</p><p>- Travel Required: Less than 1%</p><p>- Work Environment: Remote</p>
`.trim(),
        location: "Lehi, UT (Remote)",
        department: "Technical Product Development",
        jobType: "FULL_TIME",
        remotePolicy: "REMOTE",
        stipend: "Not specified",
        duration: "Permanent",
        applyUrl: "https://fa-ewmy-saasfaprod1.fa.ocs.oraclecloud.com/hcmUI/CandidateExperience/en/sites/CX_1/job/3815",
      },
      {
        slug: "verisk-user-experience-product-designer",
        title: "User Experience Product Designer",
        description: `
<p>We’re looking for a strategic, hands-on UX Design Lead to shape intuitive, high-impact experiences across our claims solutions. This is a true player/coach opportunity for a design leader who loves solving complex enterprise challenges while also mentoring and elevating a team. You’ll drive UX strategy, create scalable design patterns, and partner closely with product and engineering to deliver experiences that improve usability, productivity, and business outcomes.</p><p>If you’re energized by turning complexity into clarity, building modern design systems, and championing user-centered thinking across an organization, this role offers the chance to make a visible, lasting impact.</p>
<p><strong>Responsibilities</strong></p>
<p><strong>What You’ll Do</strong></p><p><strong>Lead design strategy and execution</strong></p><ul><li>Define and drive the UX strategy for claims-focused products and next-generation applications.</li><li>Design end-to-end user experiences across workflows, page layouts, interaction models, and product features.</li><li>Create intuitive, efficient interfaces that help users navigate complex enterprise tasks with confidence.</li><li>Translate end-user needs and business goals into clear, thoughtful design solutions.</li></ul><p><strong>Build and scale design systems</strong></p><ul><li>Develop high-fidelity prototypes, reusable components, and scalable design patterns.</li><li>Create and maintain visual design guidelines and shared UX standards.</li><li>Partner with product and engineering teams to ensure consistency across the application suite.</li><li>Champion accessibility and usability best practices, including WCAG considerations.</li></ul><p><strong>Collaborate cross-functionally</strong></p><ul><li>Work closely with product managers, developers, and stakeholders to align design direction with customer and business priorities.</li><li>Communicate design rationale clearly and influence decisions through strong storytelling and strategic thinking.</li><li>Help teams make better product decisions by bringing a user-centered lens to planning and prioritization.</li></ul><p><strong>Coach and mentor designers</strong></p><ul><li>Guide and support junior designers through feedback, mentorship, and best-practice coaching.</li><li>Help build a collaborative, high-performing design culture grounded in curiosity, craft, and continuous improvement.</li><li>Contribute to team growth through process improvements, standards, and thoughtful leadership.</li></ul>
<p><strong>Qualifications</strong></p>
<p><strong>What You Bring</strong></p><ul><li><p>5+ years of experience designing complex enterprise desktop and web applications.</p></li><li><p>3+ years of people leadership or mentorship experience preferred.</p></li><li><p>A strong track record of delivering polished, user-centered solutions on time and with high quality.</p></li><li><p>Deep expertise in UX methods, including user-centered design, information architecture, interaction design, and usability evaluation.</p></li><li><p>Experience creating low- and high-fidelity wireframes, prototypes, and design systems.</p></li><li><p>Knowledge of modern web technologies and front-end concepts such as HTML5, CSS, JavaScript, and responsive design.</p></li><li><p>Experience gathering business, functional, and user requirements and translating them into effective product experiences.</p></li><li><p>Strong collaboration and communication skills, with the ability to influence across multidisciplinary teams.</p></li><li><p>Proficiency with modern design tools such as Figma, Sketch, or Adobe XD.</p></li><li><p>Bachelor’s degree in Human-Computer Interaction, Design, or a related field.</p></li></ul><p><strong>Why Join Us</strong></p><p>This is an opportunity to lead meaningful design work, mentor other designers, and help shape how enterprise users interact with critical tools every day. You’ll join a collaborative environment where design has influence, your ideas will be heard, and your work will directly improve the experience of real users.</p><p>If you’re a UX leader who enjoys balancing strategy, execution, and team development, we’d love to hear from you.</p>
`.trim(),
        location: "Jersey City, NJ",
        department: "Technical Product Development",
        jobType: "FULL_TIME",
        remotePolicy: "HYBRID",
        stipend: "Not specified",
        duration: "Permanent",
        applyUrl: "https://fa-ewmy-saasfaprod1.fa.ocs.oraclecloud.com/hcmUI/CandidateExperience/en/sites/CX_1/job/3920",
      },
      {
        slug: "verisk-senior-manager-software-engineering",
        title: "Senior Manager Software Engineering",
        description: `
<p>Are you a technology leader who thrives at the intersection of innovation, operational excellence, and AI-driven engineering? We are seeking a Senior Manager, Software Engineering to lead high-performing teams responsible for mission-critical, data-intensive platforms in a complex and highly regulated environment. In this role, you will empower engineers and technical leads to deliver scalable, resilient solutions while leveraging AI as a core component of the software development lifecycle. The ideal candidate is a force-multiplier leader who can translate ambiguity into clear direction, balance platform stability with delivery velocity, and foster a culture of accountability, autonomy, and continuous improvement across engineering, DevOps, product, and compliance teams.</p><p><strong>Responsibilities</strong></p>
<p>They are a <strong>force-multiplier development manager</strong> who:</p><ul><li>Leads engineering teams that have fully embraced AI tooling as a first-class part of the SDLC</li><li>Stabilizes and scales complex, compliance-sensitive platforms</li><li>Enables strong tech lead autonomy without losing accountability</li><li>Translates ambiguous organizational intent into clear guardrails, priorities, and operating norms</li><li>Drives delivery across product, engineering, DevOps, and compliance</li></ul>
<p><strong>Qualifications</strong></p>
<p><strong>Required Experience</strong></p><ul><li>8–12+ years in software engineering or systems development</li><li>5+ years leading complex delivery through other engineers (formal or informal leadership)</li><li>Proven track record leading engineering teams that have fully leveraged AI tools (Copilot, Cursor, Claude, Kiro, etc.) as a first-class part of SDLC, with demonstrated productivity gains in code generation, code review, and testing</li><li>Hands-on experience with large, high-transaction data systems, including RDBMS-centric architectures (Oracle strongly preferred)</li><li>Proven exposure to:<ul><li>Production change control</li><li>Incident response</li><li>Data integrity and operational risk</li></ul></li><li>Experience operating in regulated or audit-bound environments (SOC 2-like rigor is a strong positive)</li></ul><p><strong>Nice To Have</strong></p><ul><li>Insurance, fintech, or government-adjacent systems</li><li>Cloud + legacy hybrid environments</li><li>Transitioning teams through role ambiguity and operating-model change</li><li>Prior responsibility spanning engineering + DevOps + platform operations</li></ul><p><strong>Technical Skills</strong></p><ul><li>Experience designing systems that fully exploit the benefits of AI, leveraging agentic workflows, AI orchestration, prompt and context engineering, RAG, and MCP</li><li>Evaluate architectural tradeoffs objectively</li><li>Ask the right technical questions of tech leads</li><li>Understand database-centric performance and scalability drivers</li><li>Participate meaningfully in risk, incident, and readiness discussions</li></ul><p><strong>Leadership Skills</strong></p><ul><li>Actively hires and upskills talent to thrive in the rapidly evolving AI landscape, normalizing AI-assisted development as a baseline expectation</li><li>Creates autonomy through clarity, not control</li><li>Exercises strong judgment in delegation, intentionally deciding when to lead, when to empower, and when to step in</li><li>Is comfortable with tech leads owning design and implementation while providing constraints, risk signals, and organizational context</li><li>Can operate calmly when:<ul><li>Expectations are misaligned</li><li>Authority boundaries are shifting</li><li>Organizational memory is inconsistent</li></ul></li><li>Actively coach and develop senior engineers</li><li>Recognize burnout and sustainability risks early</li><li>Be able to "manage up" without becoming adversarial</li><li>Communicate candidly but with emotional intelligence</li></ul><p><strong>Operational Excellence</strong></p><p>The candidate must excel at:</p><ul><li>Turning ambiguity into minimal, visible operating guideposts</li><li>Maintaining forward motion when priorities compete</li><li>Balancing long-term platform health against short-term delivery pressure</li><li>Coordinating across product, DevOps, security, and compliance without creating friction</li></ul><p><br></p>
`.trim(),
        location: "College Station, TX (Remote)",
        department: "Information Technology",
        jobType: "FULL_TIME",
        remotePolicy: "REMOTE",
        stipend: "Not specified",
        duration: "Permanent",
        applyUrl: "https://fa-ewmy-saasfaprod1.fa.ocs.oraclecloud.com/hcmUI/CandidateExperience/en/sites/CX_1/job/3921",
      },
      {
        slug: "verisk-gen-ai-developer-python-fastapi",
        title: "Gen AI Developer- Python, FAST API",
        description: `
<p>This role is focused on building real-world GenAI solutions — not just experimentation or research. The candidate should be comfortable writing production-quality code, building APIs, integrating LLMs, and working with modern AI engineering frameworks and cloud platforms.<br>You will work closely with product managers, architects, data scientists, and engineering teams to develop scalable, secure, and efficient AI-powered applications.<br> </p>
<p><strong>Responsibilities</strong></p>
<ul><li>Design, develop, and deploy Generative AI applications using Large Language Models (LLMs) and modern AI frameworks.</li><li>Build and maintain scalable backend services and REST APIs using Python frameworks such as FastAPI, Flask, or Django.</li><li>Implement Retrieval-Augmented Generation (RAG) pipelines and semantic search solutions using vector databases.</li><li>Integrate commercial and open-source LLMs into enterprise applications.</li><li>Develop prompt engineering workflows and support AI model evaluation and optimization.</li><li>Deploy and support AI applications on AWS cloud platforms.</li><li>Participate in troubleshooting and optimizing AI systems for latency, reliability, scalability, and cost efficiency.</li><li>Collaborate with cross-functional teams across onshore and offshore locations.</li><li>Write clean, maintainable, and testable code following software engineering best practices.</li><li>Participate in code reviews, unit testing, integration testing, and CI/CD processes.</li></ul>
<p><strong>Qualifications</strong></p>
<ul><li>3–5 years of experience in software engineering, AI/ML, or related technical roles.</li><li>Strong hands-on programming skills in Python.</li><li>Experience building backend applications and REST APIs using FastAPI, Flask, or Django.</li><li>Practical experience working with Generative AI or LLM-based applications.</li><li>Understanding of Retrieval-Augmented Generation (RAG) concepts and semantic search.</li><li>Experience with vector databases such as Pinecone, OpenSearch, or similar technologies.</li><li>Experience integrating AI models or services such as OpenAI, Anthropic, AWS Bedrock, Hugging Face, or open-source LLMs.</li><li>Experience with AWS cloud services and deploying applications in cloud environments.</li><li>Understanding of software engineering best practices including:<br>o    Unit testing<br>o    Integration testing<br>o    Git/version control<br>o    CI/CD workflows</li><li>Strong debugging, analytical, and problem-solving skills.</li><li>Good communication and collaboration skills.</li></ul><p><strong>Must have Qualifications</strong><br>•    Experience with prompt optimization and AI evaluation techniques.<br>•    Exposure to NLP </p>
`.trim(),
        location: "Hyderabad, India",
        department: "Information Technology",
        jobType: "FULL_TIME",
        remotePolicy: "HYBRID",
        stipend: "Not specified",
        duration: "Permanent",
        applyUrl: "https://fa-ewmy-saasfaprod1.fa.ocs.oraclecloud.com/hcmUI/CandidateExperience/en/sites/CX_1/job/4131",
      },
      {
        slug: "verisk-software-engineer-ii-java-angular",
        title: "Software Engineer II \u2013 Java & Angular",
        description: `
<p>Join a dynamic team at Verisk CRS, a leader in catastrophe risk modeling and analytics. As a Software Engineer II, you'll help design and build scalable, high-performance applications using modern technologies while solving complex business challenges.</p><p>Working in an Agile environment, you'll collaborate with cross-functional teams to develop innovative solutions, write clean and maintainable code, and contribute to products that make a meaningful impact. At CRS, you'll find opportunities for continuous learning, career growth, and a culture where innovation and new ideas are encouraged.</p>
<p><strong>Responsibilities</strong></p>
<ul><li>Design, develop, and maintain scalable backend and frontend applications.</li><li>Collaborate with cross-functional and distributed teams to deliver high-quality software solutions.</li><li>Participate in system design and architectural discussions.</li><li>Write clean, maintainable, and well-documented code.</li><li>Develop automated tests and ensure strong code quality.</li><li>Conduct code reviews and provide constructive feedback.</li><li>Troubleshoot and resolve application and production issues.</li><li>Participate in Agile ceremonies including sprint planning, stand-ups, and retrospectives.</li><li>Contribute to continuous improvement of development processes and engineering practices.</li><li>Learn and adopt new technologies to enhance products and workflows.</li></ul>
<p><strong>Qualifications</strong></p>
<p><strong>Required Qualifications</strong></p><ul><li>Bachelor's degree in Computer Science, Engineering, or a related field (or equivalent experience).</li><li>2+ years of software development experience.</li><li>Strong proficiency in Java and Spring Boot.</li><li>Experience building cloud-native applications using AWS.</li><li>Hands-on experience with Kubernetes and containerized deployments.</li><li>Proficiency in TypeScript and Angular.</li><li>Strong knowledge of MySQL, SQL optimization, and database design.</li><li>Experience with Git and collaborative development workflows.</li><li>Understanding of software design principles, testing methodologies, and Agile development practices.</li></ul><p><strong>Preferred Qualifications</strong></p><ul><li>Experience with Keycloak for authentication and authorization.</li><li>Familiarity with microservices architecture and gRPC.</li><li>Experience with CI/CD pipelines and GitHub Actions/Workflows.</li><li>Knowledge of OpenAPI specifications and REST API design.</li><li>Exposure to OLAP workloads and analytical systems.</li><li>Strong problem-solving and communication skills.</li></ul>
`.trim(),
        location: "Hyderabad, India",
        department: "Technical Product Development",
        jobType: "FULL_TIME",
        remotePolicy: "HYBRID",
        stipend: "Not specified",
        duration: "Permanent",
        applyUrl: "https://fa-ewmy-saasfaprod1.fa.ocs.oraclecloud.com/hcmUI/CandidateExperience/en/sites/CX_1/job/4170",
      },
      {
        slug: "verisk-training-lead",
        title: "Training Lead",
        description: `
<p>The Training lead is responsible for leading the design, development, and delivery of Rulebook training, ensuring high-quality onboarding and upskilling across configuration teams and clients.  </p><p>The role works in close partnership with the Training Owner, contributing to the overall training strategy while taking direct ownership of Rulebook-specific training execution and delivery. A key focus of the role is building practical, scalable training content and learning experiences, reducing reliance on informal knowledge transfer and ensuring consistent capability across teams. </p>
<p><strong>Responsibilities</strong></p>
<ul><li>Lead the end-to-end delivery of Rulebook training programmes, including onboarding, upskilling, and certification pathways</li><li>Design and develop high-quality training content and learning journeys, translating complex product functionality into structured, practical learning experiences</li><li>Act as the subject matter lead for training delivery, ensuring training reflects real-world use case, configuration patterns, and delivery standards</li><li>Introduce AI-driven learning and knowledge tools to reduce reliance on senior team members</li><li>Partner with Config team, including Tech Leads, Consultants, SME and the Training Owner to shape training approach, identify gaps, and align training with product roadmap and delivery needs</li><li>Drive training adoption and effectiveness, supporting internal teams and clients through structured rollouts, feedback loops, and continuous improvement</li><li>Contribute to the development and ongoing enhancement of Rulebook Academy, ensuring content is scalable, consistent, and aligned with broder training objectives <br> </li></ul>
<p><strong>Qualifications</strong></p>
<p><strong>Must have:</strong></p><ul><li>Proven experience designing and delivering technical training or instructional design solutions</li><li>Strong hands-on experience with e-learning content development tools (e.g. Articulate, Captivate, or similar)</li><li>Experience creating training for software platforms, technical systems or product-based environments</li><li>Ability to translate complex technical concepts into structured learning content  </li><li>Strong collaboration skills working with SMEs, product teams, and cross-functional stakeholders  </li><li>Excellent communication skills, with the ability to explain technical concepts clearly</li></ul><p><strong>Nice to have:</strong></p><ul><li>Experience working with LMS platforms, internal training academies, certification frameworks</li><li>Exposure to SaaS or configuration-based systems, data-driven or rules-based platforms</li><li>Experience with AI-assisted content creation, modern learning tools and techniques</li><li>Understanding of technical concepts (e.g. configuration, data, or basic coding) <br> </li></ul>
`.trim(),
        location: "Krakow, Poland",
        department: "Technical Product Development",
        jobType: "FULL_TIME",
        remotePolicy: "HYBRID",
        stipend: "Not specified",
        duration: "Permanent",
        applyUrl: "https://fa-ewmy-saasfaprod1.fa.ocs.oraclecloud.com/hcmUI/CandidateExperience/en/sites/CX_1/job/4216",
      },
      {
        slug: "verisk-principal-gen-ai-software-engineer",
        title: "Principal Gen AI Software Engineer",
        description: `
<p>We are looking for a <strong>Principal AI Engineer</strong> to serve as our highest-level individual technical contributor in AI engineering. You will set the technical direction for AI across the organisation, drive architectural decisions, own cross-functional delivery of strategic AI initiatives, and establish the engineering culture and standards that scale our capabilities. This is a role for a recognized expert who can lead from the front — hands-on, opinionated, and deeply trusted.</p><p><strong>About Verisk</strong></p><p>Verisk Analytics is a global supplier of risk assessment services and decision analytics for customers across insurance, healthcare, financial services, and supply chain. We are a thriving public company with offices worldwide, continually expanding into new markets with excellent growth potential. At Verisk, you will be part of an organisation committed to the long-term interests of our stakeholders and communities.</p>
<p><strong>Responsibilities</strong></p>
<ul><li><p>Set the technical direction for AI engineering across the organization — establishing architecture principles, technology choices, and long-term capability roadmap.</p></li><li><p>Own the design of the most complex, strategic AI initiatives — from early ideation through production delivery and ongoing evolution.</p></li><li><p>Define and enforce engineering standards for AI systems: security, scalability, evaluation, observability, and governance.</p></li><li><p>Lead enterprise AI integration strategy — connecting AI models to Snowflake, AWS, ThoughtSpot, and broader data ecosystems via MCP and custom integrations.</p></li><li><p>Act as the primary technical authority on LLM systems, agentic architectures, RAG, and emerging AI frameworks within the organization.</p></li><li><p>Drive cross-functional alignment between engineering, data, product, and business teams on AI strategy and priorities.</p></li><li><p>Champion AI governance at the organizational level — data access, PII, security, cost controls, and responsible deployment.</p></li><li><p>Lead code reviews and technical design reviews across teams; elevate the overall quality and consistency of AI engineering practice.</p></li><li><p>Present technical vision and AI strategy to senior leadership and external stakeholders.</p></li><li><p>Build and scale the AI engineering function — mentoring principals-in-training, defining levelling criteria, and contributing to hiring and team structure.</p></li><li><p>Represent Verisk AI engineering externally — thought leadership, technical writing, or industry engagement where relevant.</p></li></ul><p><strong>You will work within the following core technology environment:</strong></p><ul><li><p>Cloud Platform: AWS (S3, EC2, Lambda, SageMaker, Bedrock, IAM)</p></li><li><p>Data Warehouse: Snowflake (Snowpark, virtual warehouses, stages, streams)</p></li><li><p>Analytics & BI: ThoughtSpot</p></li><li><p>Search & Vector: OpenSearch, pgvector (Postgres)</p></li><li><p>LLM Providers: OpenAI, Anthropic / Claude, AWS Bedrock</p></li><li><p>AI Connectivity: Model Context Protocol (MCP) servers and integrations</p></li><li><p>Version Control & Project Tooling: Bitbucket, Jira, Confluence</p></li><li><p>Dev Tooling: Docker, Python, AI coding assistants (Cursor, GitHub Copilot, Claude Code)</p></li></ul>
<p><strong>Qualifications</strong></p>
<ul><li>Bachelor's degree or higher in AI, Computer Science, Data Science, Software Engineering, or a related field (or equivalent experience).</li><li>7+ years of software engineering experience, including 4+ years in AI/ML engineering, with demonstrated organizational impact.</li><li>Proven track record of defining technical strategy, enterprise architecture, and engineering standards; external recognition (publications, speaking, or open source) is an advantage.</li><li>Ability to define the long-term AI engineering strategy and technology roadmap, driving adoption of emerging AI capabilities where they deliver business value.</li><li>Architects enterprise-scale AI platforms across AWS, Snowflake, ThoughtSpot, MCP-connected systems, and hybrid cloud environments.</li><li>Executive communication with the ability to clearly articulate AI strategy, technical vision, and complex concepts to senior leaders and diverse stakeholders.</li><li>Strategic thinking that connects AI engineering decisions to long-term business objectives and anticipates future organizational needs.</li><li>Influential leadership that shapes engineering culture, drives alignment, and builds consensus across teams and functions.</li><li>Strong decision-making and sound judgement.</li><li>Coaching and mentoring mindset, with a proven ability to develop senior engineering talent and strengthen organizational capability.</li></ul><p><strong>We offer:</strong></p><ul><li>The opportunity to define and lead the enterprise AI strategy, shaping the adoption of cutting-edge LLM, agentic AI, RAG, and emerging AI technologies across the organization.</li><li>Ownership of enterprise-scale AI architecture, platforms, and engineering standards spanning AWS, Snowflake, ThoughtSpot, and hybrid cloud environments.</li><li>The autonomy to influence technology direction, governance, engineering culture, and long-term platform evolution while mentoring the next generation of AI leaders.</li><li>A hybrid work model with flexible working hours. </li><li>A benefits package, including private health insurance, medical care, and a Multisport card.</li></ul>
`.trim(),
        location: "Krakow, Poland",
        department: "Information Technology",
        jobType: "FULL_TIME",
        remotePolicy: "HYBRID",
        stipend: "Not specified",
        duration: "Permanent",
        applyUrl: "https://fa-ewmy-saasfaprod1.fa.ocs.oraclecloud.com/hcmUI/CandidateExperience/en/sites/CX_1/job/4280",
      },
      {
        slug: "verisk-gen-ai-software-engineer",
        title: "Gen AI Software Engineer",
        description: `
<p><strong>About the role</strong></p><p>We are looking for a <strong>m</strong><strong>id-level AI Engineer</strong> to take ownership of end-to-end AI feature development and play a key role in shaping the architecture and design of our AI solutions. In this role, you will build and deploy production-grade LLM applications, advanced RAG pipelines, and agentic workflows integrated with our AWS and Snowflake data platform. You'll collaborate closely with data engineers, solution architects, and business stakeholders to deliver scalable, high-impact AI capabilities that solve real-world business challenges.</p><p><strong>About Verisk</strong></p><p>Verisk is a global leader in data analytics and risk assessment, serving customers across the insurance, healthcare, financial services, and supply chain industries. As a publicly traded company with a strong global presence, we continue to expand into new markets while investing in innovation and long-term growth.</p>
<p><strong>Responsibilities</strong></p>
<ul><li><p>Own end-to-end delivery of AI features and integrations — from requirements through to deployed, monitored solutions.</p></li><li><p>Design and implement advanced RAG pipelines including chunking strategy, retrieval architecture, hybrid search, and evaluation frameworks (RAGAs, LangSmith).</p></li><li><p>Build adaptive agentic workflows and multi-step AI systems using frameworks such as LangChain, LlamaIndex, LangGraph, or AutoGen.</p></li><li><p>Develop and maintain MCP servers and integrations connecting AI models to Snowflake, AWS services, and enterprise APIs.</p></li><li><p>Integrate AI capabilities with our AWS data platform — S3, SageMaker, Lambda, Bedrock — and surface insights through ThoughtSpot.</p></li><li><p>Contribute to technical design discussions, proposing scalable, secure, and cost-efficient architectural patterns.</p></li><li><p>Evaluate AI model outputs systematically; own optimization of cost, latency, and quality metrics.</p></li><li><p>Apply AI governance practices — PII handling, data access controls, and prompt injection mitigations.</p></li><li><p>Translate business requirements into technical specifications in collaboration with subject matter experts and project managers.</p></li><li><p>Conduct and participate in code reviews; actively support the growth of junior engineers.</p></li></ul><p><strong>You will work within the following core technology environment:</strong></p><ul><li><p>Cloud Platform: AWS (S3, EC2, Lambda, SageMaker, Bedrock, IAM)</p></li><li><p>Data Warehouse: Snowflake (Snowpark, virtual warehouses, stages, streams)</p></li><li><p>Analytics & BI: ThoughtSpot</p></li><li><p>Search & Vector: OpenSearch, pgvector (Postgres)</p></li><li><p>LLM Providers: OpenAI, Anthropic / Claude, AWS Bedrock</p></li><li><p>AI Connectivity: Model Context Protocol (MCP) servers and integrations</p></li><li><p>Version Control & Project Tooling: Bitbucket, Jira, Confluence</p></li><li><p>Dev Tooling: Docker, Python, AI coding assistants (Cursor, GitHub Copilot, Claude Code)</p></li></ul>
<p><strong>Qualifications</strong></p>
<p><strong>Education, experience & technical skills:</strong></p><ul><li>Bachelor's degree (or higher) in <strong>Computer Science, AI, Data Science</strong>, or a related field.</li><li><strong>2–4 years</strong> of hands-on experience in software or AI engineering, with a proven track record of delivering AI/ML solutions.</li><li>Strong Python skills, including <strong>pytest</strong>, async programming, type hints, packaging, and code reviews, with experience building production services.</li><li>Experience designing and deploying end-to-end <strong>RAG</strong> pipelines using OpenSearch, pgvector, reranking, and evaluation frameworks.</li><li>Hands-on experience building <strong>agentic AI</strong> workflows, including tool-use agents and human-in-the-loop patterns.</li><li>Experience with <strong>MCP</strong> integrations connecting AI applications to Snowflake, REST APIs, and enterprise systems.</li><li>Familiarity with AI evaluation, model observability, prompt security, and guardrails across OpenAI, Anthropic, and Amazon Bedrock.</li><li>Experience deploying AI solutions on <strong>AWS</strong> (S3, Lambda, SageMaker, ECR, IAM).</li><li>Working knowledge of <strong>Snowflake</strong>, including Snowpark and core platform features.</li><li>Experience with <strong>Docker</strong>, REST APIs, CI/CD, and AWS deployment pipelines.</li><li>Understanding of data security, PII handling, and responsible AI practices.</li></ul><p><strong>Soft skills:</strong></p>
`.trim(),
        location: "Krakow, Poland",
        department: "Information Technology",
        jobType: "FULL_TIME",
        remotePolicy: "HYBRID",
        stipend: "Not specified",
        duration: "Permanent",
        applyUrl: "https://fa-ewmy-saasfaprod1.fa.ocs.oraclecloud.com/hcmUI/CandidateExperience/en/sites/CX_1/job/4281",
      },
      {
        slug: "verisk-financial-systems-associate",
        title: "Financial Systems Associate",
        description: `
<p>We're looking for a <strong>Junior Financial Systems Associate </strong>to help support and enhance the financial applications that power our global business.</p><p>This role is ideal for someone early in their career who is interested in <strong>finance systems, ERP platforms, data</strong>, and <strong>business processes</strong>. You'll gain exposure to core finance operations, work closely with Finance and IT teams, and contribute to projects that improve how we work.</p><p>You'll have the opportunity to learn from experienced professionals, build expertise in enterprise financial systems, and play an active role in ensuring financial data and processes remain accurate, reliable, and efficient.</p>
<p><strong>Responsibilities</strong></p>
<ul><li>Provide first-line support for financial system users across the business</li><li>Investigate and resolve system, access, and data-related issues</li><li>Monitor system integrations, scheduled processes, and daily operational activities</li><li>Escalate complex issues to technical teams or vendors when needed</li><li>Support application configuration, testing, and system administration activities</li><li>Maintain system documentation, procedures, and knowledge articles</li><li>Assist with data validation, reconciliations, and quality assurance checks</li><li>Prepare and maintain financial and operational reports</li><li>Review data discrepancies and help identify root causes</li><li>Support finance transformation initiatives, system upgrades, and enhancement projects</li><li>Participate in requirements gathering, testing, and user acceptance testing (UAT)</li><li>Help identify opportunities to improve processes, controls, and user experience</li><li>Create user guides and training materials</li><li>Support end-user training and communication of system updates and best practices</li></ul>
<p><strong>Qualifications</strong></p>
<ul><li>Bachelor's degree in Finance, Accounting, Economics, Information Systems, IT, or a related field</li><li>Basic understanding of financial processes:  Procure-to-Pay (P2P) Order-to-Cash (O2C) Record-to-Report (R2R)</li><li>Experience using Microsoft Excel, including Pivot Tables and VLOOKUP/XLOOKUP</li><li>Experience with ERP systems</li><li>Strong analytical skills and attention to detail</li><li>Ability to follow structured processes and maintain accurate documentation</li><li>Strong communication skills with the ability to explain technical concepts clearly</li><li>Fluent English skills</li></ul><p><strong>What We Offer</strong></p><ul><li>Work for a global leader in data analytics, technology, and risk intelligence</li><li>Gain hands-on experience with enterprise financial systems and business-critical processes</li><li>Build expertise across finance, technology, data, and process improvement</li><li>Learn from experienced professionals in a supportive and collaborative environment</li><li>Private life insurance, private medical care, and a Multisport card</li><li>A hybrid work model with at least 2 days per week in the office</li></ul>
`.trim(),
        location: "Krakow, Poland",
        department: "Technical Product Development",
        jobType: "FULL_TIME",
        remotePolicy: "HYBRID",
        stipend: "Not specified",
        duration: "Permanent",
        applyUrl: "https://fa-ewmy-saasfaprod1.fa.ocs.oraclecloud.com/hcmUI/CandidateExperience/en/sites/CX_1/job/4296",
      },
      {
        slug: "verisk-software-engineer-iii-technical-lead",
        title: "Software Engineer III - Technical Lead",
        description: `
<p>The Senior Software Engineer operates as a senior/lead team member of a team, assisting assigned Insurance Carrier project teams (“our clients”) to implement, integrate, leverage and enhance the FAST platform.  We rely on a dynamic team of engineers to create solutions for our rapidly evolving technical stack. We’re seeking a full stack developer who is smart, proactive, and results-oriented to build elegant solutions for the Life insurance industry's complex business domain and make our industry-leading products even better. </p><p>The ideal candidate has experience building products across the stack and a firm understanding of web frameworks, APIs, databases, and multiple back-end languages for a SaaS application. The full stack developer will join a small team to solve challenges for both the front-end and back-end architecture, ultimately delivering amazing experiences for the Life insurance industry.</p>
<p><strong>Responsibilities</strong></p>
<p><strong>Objectives of this role</strong></p><ul><li>Provide guidance to junior and mid-level engineers, helping them develop their technical skills, career growth, and problem-solving abilities</li><li>Work across the full stack, building highly scalable distributed solutions that enable positive user experiences and measurable business growth</li><li>Develop new features and infrastructure in support of rapidly emerging business and project objectives</li><li>Ensure application performance, uptime, and scale, and maintain high standards for code quality and application design</li><li>Develop new features and infrastructure in support of rapidly emerging business and project requirements</li><li>Be a leading voice in the continuous modernization of the SaaS offering</li><li>Be the primary point of contact with customers for all aspects of the FAST platform</li></ul><p><strong>Responsibilities</strong></p><ul><li>Serve as the primary point of contact for technical discussions with senior management, other engineering teams, and business units. </li><li>Translate complex technical topics into clear, understandable language for non-technical stakeholders both internally and for the customer. </li><li>Participate in all aspects of agile software development, including design, implementation, and deployment</li><li>Design and provide guidance on building end-to-end systems optimized for speed and scale leveraging SOA design principles on J2EE and .NET platforms</li><li>Work primarily in technologies like .NET, Angular/REACT, Java Script, SQL Server, Postgres, etc.</li><li>Engage with inspiring designers and front-end engineers, and collaborate with leading back-end engineers to create reliable APIs</li><li>Develop next generation user interfaces for all applications and innovate on integration patterns using Microservice design</li><li>Strong analytical skills to breakdown complex objectives and provide appropriate solutions within the context of the FAST application. </li><li>A strong focus on delivering value to clients, ensuring that their needs are prioritized while balancing operational and regulatory constraints. </li><li>Communication & Presentation: Excellent communication skills, particularly in articulating complex product features and benefits to clients in a clear, concise, and persuasive manner.</li><li>Communication and Interpersonal skills: Excellent verbal and written communication skills to convey complex information clearly to various stakeholders. Strong relationship-building skills to foster collaboration across departments.</li></ul>
<p><strong>Qualifications</strong></p>
<p><strong>Soft Skills and Personal Attributes</strong></p><ul><li>Strong analytical skills to breakdown complex objectives and provide appropriate solutions within the context of the FAST application. </li><li>A strong focus on delivering value to clients, ensuring that their needs are prioritized while balancing operational and regulatory constraints. </li><li>Communication & Presentation: Excellent communication skills, particularly in articulating complex product features and benefits to clients in a clear, concise, and persuasive manner.</li><li>Communication and Interpersonal skills: Excellent verbal and written communication skills to convey complex information clearly to various stakeholders. Strong relationship-building skills to foster collaboration across departments.</li></ul><p><strong>Required Technical Skills and qualifications</strong></p><ul><li>At least 5-7 of Industry experience in working and building large-scale software applications</li><li>Experience in building web applications</li><li>Demonstrated programing expertise in Java, C#, or .Net </li><li>Experience with data design and working with relational databases (postgres, sqlserver)</li><li>Experience with tuning stored procedures</li><li>Strong skills with object-oriented programming and Enterprise software design principles</li><li>Development experience with javascript frameworks (React, Angular, ExtJS) a plus </li><li>Prior development utilizing SOA concepts and methodologies. Experience with Microfrontends and Microservices a plus</li><li>Strong leader capable of motivating and energizing resources </li><li>Prior leadership and/or management experience of on-shore and off-shore resources </li><li>Experience in designing and integrating RESTful APIs</li><li>Excellent debugging and optimization skills</li><li>Experience in unit/integration testing</li><li>Experience with AWS Services</li></ul><p><strong>Preferred skills and qualifications</strong></p><ul><li>Experience building configurable enterprise applications</li><li>Bachelor’s degree (or equivalent) in computer science, information technology, or engineering (Masters a plus)</li><li>Interest in learning new tools, languages, workflows, and philosophies</li><li>Professional certifications</li></ul><p><br></p>
`.trim(),
        location: "Holmdel, NJ",
        department: "Technical Product Development",
        jobType: "FULL_TIME",
        remotePolicy: "HYBRID",
        stipend: "Not specified",
        duration: "Permanent",
        applyUrl: "https://fa-ewmy-saasfaprod1.fa.ocs.oraclecloud.com/hcmUI/CandidateExperience/en/sites/CX_1/job/4300",
      },
      {
        slug: "verisk-lead-data-engineer",
        title: "Lead Data Engineer",
        description: `
<p>We are looking for an experienced <strong>Lead Data Engineer</strong> to lead the architecture, evolution, and delivery of our modern AWS-native data platform. This platform powers underwriting intelligence, GenAI-driven insights, and large-scale content processing, serving as the foundation for data products across the organization.</p><p>You will own the full data lifecycle—from ingestion and transformation to storage, retrieval, and AI consumption—working across Python-based processing pipelines, .NET services, Aurora PostgreSQL, OpenSearch, and LangGraph-powered agentic workflows.</p><p>This is a senior individual contributor role with significant technical leadership responsibilities. You will define engineering standards, drive architectural decisions, mentor engineers, and collaborate closely with product, platform, and AI teams to build reliable, scalable, and high-performing data systems.</p>
<p><strong>Responsibilities</strong></p>
<ul><li>Design, build, and evolve scalable, fault-tolerant data pipelines across ingestion, transformation, storage, and serving layers on AWS.</li><li>Own the delivery of cloud-native data solutions, including AWS Batch, Lambda, Python, .NET APIs (REST/GraphQL), Aurora PostgreSQL, and OpenSearch.</li><li>Define data architecture, schema design, indexing strategies, and data contracts to support analytics and GenAI-powered applications.</li><li>Establish and enforce data quality, testing, monitoring, and operational standards using CloudWatch, Splunk, Pentaho, and ThoughtSpot.</li><li>Partner with AI/ML and product teams to enable LangGraph-based agentic RAG solutions, ensuring reliable, high-quality, and retrieval-optimized data.</li><li>Develop and optimize data pipelines supporting LLM evaluation, prompt engineering, ground-truth datasets, and synthetic test data generation.</li><li>Review and validate AI-assisted engineering outputs, ensuring production readiness and technical excellence.</li><li>Drive technical design through architecture documents, RFCs, and engineering best practices, balancing scalability, maintainability, and business needs.</li><li>Lead deployment strategies, incident investigations, and continuous improvements to platform reliability and operational resilience.</li><li>Mentor engineers, establish data engineering standards, and provide technical leadership through design reviews and hands-on guidance.</li><li>Collaborate across engineering teams to manage data dependencies, align technical direction, and communicate delivery plans, risks, and architectural decisions.</li></ul>
<p><strong>Qualifications</strong></p>
<ul><li>Solid software and data engineering experience building and operating scalable, production-grade data platforms.</li><li>Strong Python skills for data processing and transformation, including structured and unstructured data.</li><li>Experience building data services and APIs using .NET (C#), REST, and GraphQL.</li><li>Hands-on expertise with AWS services, including S3, Batch, Lambda, Aurora PostgreSQL, EKS, SNS, and CloudWatch.</li><li>Strong SQL and PostgreSQL skills, including schema design, query optimization, and data modeling.</li><li>Experience designing distributed, fault-tolerant systems with robust testing, observability, and operational excellence.</li><li>Proficiency troubleshooting complex data pipelines using logs, metrics, and monitoring tools.</li><li>Experience with CI/CD, modern DevOps practices, and Agile software delivery.</li><li>Excellent communication skills, with the ability to document technical designs and influence architectural decisions.</li></ul><p><strong>Nice to have:</strong></p><ul><li>Experience building GenAI or Retrieval-Augmented Generation (RAG) applications using LangGraph, LangChain, or similar frameworks.</li><li>Familiarity with OpenSearch, vector search, or AI retrieval architectures.</li><li>Experience with API gateways (e.g., Kong) or Model Context Protocol (MCP).</li><li>Experience processing unstructured documents and content transformation pipelines.</li><li>Exposure to BI and analytics platforms such as ThoughtSpot or Pentaho.</li></ul><p><strong>We offer:</strong></p><ul><li>The opportunity to own and shape a cloud-native data platform powering AI, analytics, and intelligent underwriting solutions.</li><li>The chance to work with modern technologies, including AWS, GenAI, agentic workflows, and large-scale distributed data systems.</li><li>A high-impact technical leadership role with the autonomy to influence architecture, engineering standards, and platform evolution.</li><li>A collaborative, international engineering environment that values innovation, knowledge sharing, and continuous learning.</li><li>A hybrid work model with flexible working hours.</li><li>A benefits package, including private health insurance, medical care, and a Multisport card.</li></ul>
`.trim(),
        location: "Krakow, Poland",
        department: "Information Technology",
        jobType: "FULL_TIME",
        remotePolicy: "HYBRID",
        stipend: "Not specified",
        duration: "Permanent",
        applyUrl: "https://fa-ewmy-saasfaprod1.fa.ocs.oraclecloud.com/hcmUI/CandidateExperience/en/sites/CX_1/job/4315",
      },
      {
        slug: "verisk-cloud-finops-engineer",
        title: "Cloud FinOps Engineer",
        description: `
<p>Working as a Cloud FinOps Engineer at Verisk means being part of and contributing to a large, dynamic, and innovative community. In this role you will be learning from experienced team members and developing your cloud infrastructure and FinOps expertise. You will support our customers through cost optimization initiatives while building your technical knowledge under the guidance of senior engineers.</p><p>Purpose of the role</p><ul><li><p>Support the identification of cost optimization opportunities in the cloud under senior guidance.</p></li><li><p>Assist in cloud cost management and optimization initiatives.</p></li><li><p>Learn and support existing FinOps practices for AWS and Azure.</p></li><li><p>Participate in development of FinOps practices and contribute to team initiatives.</p></li><li><p>Support ongoing development of a self-service environment for cloud cost transparency.</p></li></ul>
<p><strong>Responsibilities</strong></p>
<ul><li><p>Assist in research of AWS cloud service offerings to identify cost optimization opportunities.</p></li><li><p>Support initiatives to identify cost-saving opportunities through rightsizing, reserved instances, and workload scheduling.</p></li><li><p>Participate in architecture reviews with a focus on cloud best practices, learning from technical leadership across enterprise initiatives.</p></li><li><p>Support engineering, product, and finance teams with cloud cost information under senior engineer guidance.</p></li><li><p>Build knowledge of cloud pricing models and FinOps best practices.</p></li><li><p>Leverage the AWS CLI to retrieve metadata for cost transparency.</p></li><li><p>Support the Kubex product analysis and contribute insights on actionable items.</p></li><li><p>Assist in developing processes to identify cost transparency in AWS and Azure.</p></li><li><p>Assist in creating and maintaining KPIs as measures of cost optimization.</p></li><li><p>Support the AWS Cost and Usage Report (CUR) platform in Athena and PowerBI.</p></li><li><p>Learn the financial side of FinOps to support an interdisciplinary approach to cloud cost optimization.</p></li><li><p>Participate in the ongoing development of our FinOps solution and contribute to team projects.</p></li><li><p>Assist with cloud cost estimation for migrations.</p></li><li><p>Support cloud financials reporting and cost optimization presentations.</p></li></ul>
<p><strong>Qualifications</strong></p>
<ul><li><p>Bachelor’s degree in Computer Science, Information Technology, or related field, or equivalent work experience.</p></li><li><p>2-5 years of experience in cloud infrastructure or systems support.</p></li><li><p>Basic understanding of CPU, memory, and performance metrics.</p></li><li><p>SQL experience to parse datasets from the CUR files.</p></li><li><p>Interest in AI and emerging technologies, with a willingness to learn how they apply to cloud optimization.</p></li><li><p>Strong communication and collaboration skills.</p></li><li><p>Willingness to learn and take on new challenges.</p></li><li><p>AWS cloud experience preferred.</p></li><li><p>AWS or cloud computing certifications (e.g., AWS Cloud Practitioner) preferred.</p></li><li><p>Python or other programming language experience preferred.</p></li></ul>
`.trim(),
        location: "Jersey City, NJ",
        department: "Information Technology",
        jobType: "FULL_TIME",
        remotePolicy: "HYBRID",
        stipend: "Not specified",
        duration: "Permanent",
        applyUrl: "https://fa-ewmy-saasfaprod1.fa.ocs.oraclecloud.com/hcmUI/CandidateExperience/en/sites/CX_1/job/4345",
      },
    ],
  },
  {
    slug: "fin",
    name: "Fin",
    tagline: "The highest-performing Customer Agent (formerly Intercom)",
    about:
      "Fin — formerly Intercom, founded in 2011 by Eoghan McCabe, Des Traynor, Ciaran Lee, and David Barrett — is the AI Customer Agent company, serving nearly 30,000 businesses across service, sales, and ecommerce channels. The company renamed itself from Intercom to Fin in May 2026 to reflect its AI agent product becoming the core of the business (the Intercom name lives on as its customer service software platform). Headquartered in San Francisco with offices in Dublin, London, Chicago, and Sydney, Fin has ~1,400 employees and has raised $242M in venture funding plus $250M in venture debt from Hercules Capital. In late 2026, Fin agreed to be acquired by Salesforce for approximately $3.6B, a deal expected to close in Q4 of Salesforce's fiscal year 2027.",
    logoUrl: "https://fin.ai/favicons/favicon-black-96x96.png",
    fundingStage: "SERIES_C_PLUS",
    remotePolicy: "HYBRID",
    visaSponsorship: false,
    employeeCountRange: "1000+",
    websiteUrl: "https://fin.ai",
    categories: ["saas", "ai-ml"],
    technologies: ["python", "ruby", "aws"],
    location: { city: "San Francisco", country: "USA" },
    founders: [
      {
        name: "Eoghan McCabe",
        title: "Co-founder & CEO",
        linkedinUrl: "https://www.linkedin.com/in/eoghanmccabe/",
      },
      {
        name: "Des Traynor",
        title: "Co-founder",
        linkedinUrl: "https://ie.linkedin.com/in/destraynor",
      },
      {
        name: "Ciaran Lee",
        title: "Co-founder & Chief Engineer",
        linkedinUrl: "https://www.linkedin.com/in/ciaran-lee-51bb402/",
      },
      { name: "David Barrett", title: "Co-founder & Engineer" },
    ],
    links: [
      { type: "linkedin", url: "https://www.linkedin.com/company/fin" },
      { type: "twitter", url: "https://x.com/fin_ai" },
      { type: "youtube", url: "https://www.youtube.com/channel/UCJG0MvLP03kyzzAkD-w98aQ" },
    ],
    internships: [
      {
        slug: "fin-forward-deployed-software-engineer-dublin",
        title: "Forward Deployed Software Engineer",
        description: `
<p>Fin is the AI Customer Agent company on a mission to help businesses provide perfect customer experiences, serving nearly 30,000 global businesses. This role bridges the gap between customer needs and product innovation, working on AI Agent for Customer Service implementations for strategic accounts.</p>
<p><strong>Key Responsibilities</strong></p>
<ul>
<li>Enable customer adoption by helping prospects leverage Fin's AI capabilities.</li>
<li>Embed with strategic customers to understand business challenges and technical requirements.</li>
<li>Code alongside customer technical teams as a trusted expert.</li>
<li>Collaborate with Sales, Success, and Product teams for seamless delivery.</li>
<li>Contribute to scaling the Forward Deployed Engineering function.</li>
</ul>
<p><strong>Required Skills</strong></p>
<ul>
<li>Strong engineering background (Computer Science, Math, or Physics preferred).</li>
<li>SaaS product experience; startup background advantageous.</li>
<li>AI/ML interest with ability to learn novel architectures quickly.</li>
<li>Cross-functional collaboration abilities.</li>
<li>Proficiency in a high-level programming language (JavaScript, Python, Ruby, etc.).</li>
<li>Rapid prototyping and shipping capabilities.</li>
<li>REST API expertise.</li>
<li>Strong communication across technical and non-technical audiences.</li>
<li>Willingness to travel and work on-site with customers.</li>
</ul>
<p><strong>Benefits</strong> include competitive salary and equity, daily lunch and snacks, pension matching (up to 4%), comprehensive health/dental insurance, flexible PTO, parental leave, Cycle-to-Work Scheme support, and a standard-issue MacBook.</p>
`.trim(),
        location: "Dublin, Ireland",
        department: "Forward Deployed Engineering",
        jobType: "FULL_TIME",
        remotePolicy: "HYBRID",
        stipend: "Not specified",
        duration: "Permanent",
        applyUrl: "https://job-boards.greenhouse.io/intercom/jobs/7982566",
      },
      {
        slug: "fin-forward-deployed-software-engineer-london",
        title: "Forward Deployed Software Engineer",
        description: `
<p>Fin is the AI Customer Agent company on a mission to help businesses provide perfect customer experiences, serving nearly 30,000 global businesses.</p>
<p><strong>Key Responsibilities</strong></p>
<ul>
<li>Facilitate Fin adoption by helping prospects unlock the power of Fin's AI capabilities to automate and scale their support operations.</li>
<li>Embed with strategic customers to understand challenges and provide technical guidance.</li>
<li>Code alongside customer technical teams as a trusted expert.</li>
<li>Collaborate with Sales, Success, and Product teams for seamless delivery.</li>
<li>Contribute to scaling the Forward Deployed function through documented best practices.</li>
</ul>
<p><strong>Required Qualifications</strong></p>
<ul>
<li>Strong engineering background (Computer Science, Mathematics, Software Engineering, or Physics).</li>
<li>SaaS product development experience.</li>
<li>Interest in AI/ML with ability to understand novel problems and architectures.</li>
<li>Cross-functional collaboration skills.</li>
<li>Proficiency in at least one high-level programming language.</li>
<li>Ability to prototype and ship quality software quickly.</li>
<li>REST API expertise.</li>
<li>Strong communication across technical and non-technical audiences.</li>
<li>Willingness to travel and work on-site with customers.</li>
</ul>
<p><strong>Benefits</strong> include competitive salary and equity, weekday meals, health/dental insurance, pension matching (4%), flexible PTO, parental leave, and a standard-issue MacBook.</p>
`.trim(),
        location: "London, England",
        department: "Forward Deployed Engineering",
        jobType: "FULL_TIME",
        remotePolicy: "HYBRID",
        stipend: "Not specified",
        duration: "Permanent",
        applyUrl: "https://job-boards.greenhouse.io/intercom/jobs/7556413",
      },
      {
        slug: "fin-it-systems-engineer-sf",
        title: "IT Systems Engineer",
        description: `
<p>This role focuses on evolving IT infrastructure with a focus on deliverability, identity & access management, and compliance.</p>
<p><strong>Key Responsibilities</strong></p>
<ul>
<li>Solve automation and integration challenges across teams and business processes.</li>
<li>Design and maintain automations addressing identity management, endpoint management, security, compliance, and email deliverability.</li>
<li>Participate in cross-organizational infrastructure projects emphasizing infrastructure-as-code.</li>
<li>Promote automation adoption through education and enablement.</li>
<li>Evaluate emerging tools and beta features to optimize operations.</li>
<li>Drive IT incident response coordination.</li>
<li>Integrate AI tools and automate infrastructure via platforms like Tines and Workato.</li>
</ul>
<p><strong>Core Requirements</strong></p>
<ul>
<li>Passion for systems and automation.</li>
<li>3-5 years of systems engineering experience.</li>
<li>Good knowledge of high-level programming languages (Ruby, Python, Perl).</li>
<li>Cloud systems experience. Primary infrastructure includes AWS, Okta, Google Workspace, Jamf Pro, Intune, Tines, and Workato.</li>
</ul>
<p><strong>Nice to Have:</strong> NetSuite ERP and billing system integration experience.</p>
<p><strong>Compensation:</strong> $142,000–$162,000 base (San Francisco Bay Area), plus equity, comprehensive medical/dental/vision coverage, unlimited Claude Code access, flexible PTO, parental leave, 401(k) matching, and equipment flexibility.</p>
`.trim(),
        location: "San Francisco, CA",
        department: "IT",
        jobType: "FULL_TIME",
        remotePolicy: "HYBRID",
        stipend: "$142,000–$162,000/year",
        duration: "Permanent",
        applyUrl: "https://job-boards.greenhouse.io/intercom/jobs/7918638",
      },
      {
        slug: "fin-it-systems-engineer-dublin-london",
        title: "IT Systems Engineer",
        description: `
<p>Fin seeks a Systems Engineer to evolve IT infrastructure with emphasis on deliverability, identity & access management, and compliance. The role suits professionals from traditional systems engineering or DevOps backgrounds seeking cloud-native experience, or those in identity management looking to advance.</p>
<p><strong>Key Responsibilities</strong></p>
<ul>
<li>Solve team and organizational automation/integration problems.</li>
<li>Design and maintain automations addressing identity & access management, endpoint management, security, compliance, and enterprise email deliverability.</li>
<li>Execute infrastructure-as-code projects across the organization.</li>
<li>Promote automation adoption through enablement and education.</li>
<li>Participate in emerging AI tools and infrastructure initiatives.</li>
<li>Drive IT incident response coordination.</li>
<li>Integrate AI tooling and develop automated infrastructure via Tines and Workato.</li>
</ul>
<p><strong>Required Qualifications</strong></p>
<ul>
<li>Passion for systems and automation in fast-moving environments.</li>
<li>3-5 years of Systems Engineer experience with strong problem-solving abilities.</li>
<li>Proficiency in high-level programming languages (Ruby, Python, Perl, etc.).</li>
<li>Cloud systems experience; primary infrastructure uses AWS, Okta, Google Workspace, Jamf Pro, Intune, Tines, and Workato.</li>
</ul>
<p><strong>Preferred Experience</strong></p>
<ul>
<li>iPaaS platforms and enterprise email deliverability expertise.</li>
<li>Integration experience between billing systems and NetSuite ERP.</li>
</ul>
`.trim(),
        location: "Dublin, Ireland / London, England",
        department: "IT",
        jobType: "FULL_TIME",
        remotePolicy: "HYBRID",
        stipend: "Not specified",
        duration: "Permanent",
        applyUrl: "https://job-boards.greenhouse.io/intercom/jobs/7930382",
      },
      {
        slug: "fin-senior-data-scientist-london",
        title: "Senior Data Scientist",
        description: `
<p>Fin is an AI Customer Agent company serving nearly 30,000 businesses. The Research, Analytics & Data Science (RAD) team drives decision-making through data science and research, generating insights that shape customer empathy and product strategy.</p>
<p><strong>Key Responsibilities</strong></p>
<ul>
<li>Partner with product teams to identify critical questions and provide data-driven answers.</li>
<li>Develop product success metrics, set targets, and measure outcomes.</li>
<li>Design and maintain end-to-end data pipelines with stakeholder collaboration.</li>
<li>Work with product researchers to understand customers and business dynamics.</li>
<li>Influence product roadmap through exploratory analysis.</li>
<li>Use AI tools to accelerate analysis and automate workflows.</li>
<li>Build scalable dashboards and self-serve analytics capabilities.</li>
<li>Communicate compelling data stories across the organization.</li>
</ul>
<p><strong>Required Skills</strong></p>
<ul>
<li>5+ years of experience working with data to solve problems and drive evidence-based decisions.</li>
<li>SQL proficiency and statistical grounding.</li>
<li>Product team collaboration experience.</li>
<li>Track record delivering actionable insights with minimal oversight.</li>
<li>Strong communication abilities.</li>
<li>Scientific computing language experience (e.g. Python).</li>
<li>AI tool proficiency increasingly important.</li>
</ul>
<p><strong>Bonus Skills:</strong> data modeling, ETL/dbt experience, internal tool building.</p>
<p><strong>Benefits</strong> include competitive salary, equity, unlimited Claude Code access, lunches, insurance, and flexible time off.</p>
`.trim(),
        location: "London, England",
        department: "Research, Analytics & Data Science (RAD)",
        jobType: "FULL_TIME",
        remotePolicy: "HYBRID",
        stipend: "Not specified",
        duration: "Permanent",
        applyUrl: "https://job-boards.greenhouse.io/intercom/jobs/7749323",
      },
      {
        slug: "fin-senior-engineer-infrastructure-platform",
        title: "Senior Engineer, Infrastructure Platform",
        description: `
<p>Fin is an AI Customer Agent company founded in 2011, serving nearly 30,000 global businesses. The company emphasizes shipping velocity and reliable infrastructure as competitive advantages. This role builds infrastructure platforms where "shipping is our heartbeat" — making reliability, observability, secure deployment, and velocity the default experience. The team leverages AI extensively, using coding agents and self-authored skills to automate work.</p>
<p><strong>Key Responsibilities</strong></p>
<ul>
<li>Automate everything: eradicate manual, repetitive, and unscalable work.</li>
<li>Drive architectural evolution and plan generational infrastructure changes.</li>
<li>Own reliability of core services and engineer preventative solutions.</li>
<li>Adopt full-stack problem-solving across infrastructure and application layers.</li>
<li>Abstract shared concerns through enablement and documentation.</li>
<li>Hold accountability with empathy while raising team standards.</li>
<li>Lead complex initiatives independently with complete ownership.</li>
<li>Build AI-native leverage using coding agents and agent skills.</li>
</ul>
<p><strong>Required Skills</strong></p>
<ul>
<li>Cloud infrastructure expertise (AWS preferred) with distributed systems experience.</li>
<li>Deep programming knowledge, treating infrastructure as software engineering.</li>
<li>Operational obsession with reliability metrics and telemetry focus.</li>
<li>Developer empathy — understanding product team friction points.</li>
<li>Proven independent execution on cross-team initiatives.</li>
<li>Strong technical communication and asynchronous collaboration abilities.</li>
<li>"AI-first by default" approach with a demonstrated automation track record.</li>
</ul>
<p><strong>Benefits</strong> include competitive salary, equity, daily catered lunch, unlimited Claude access, pension matching (4%), comprehensive health/dental coverage, flexible PTO, parental leave, Cycle-to-Work Scheme support, and a standard-issue MacBook.</p>
`.trim(),
        location: "Dublin, Ireland",
        department: "Infra-Platform, Infraservices",
        jobType: "FULL_TIME",
        remotePolicy: "HYBRID",
        stipend: "Not specified",
        duration: "Permanent",
        applyUrl: "https://job-boards.greenhouse.io/intercom/jobs/7731665",
      },
      {
        slug: "fin-senior-forward-deployed-engineer-dublin",
        title: "Senior Forward Deployed Engineer",
        description: `
<p>Fin is the AI Customer Agent company on a mission to help businesses provide perfect customer experiences, serving nearly 30,000 global businesses.</p>
<p><strong>Key Responsibilities</strong></p>
<ul>
<li>Facilitate Fin adoption with prospects by showcasing AI capabilities for support automation.</li>
<li>Embed with strategic customers to understand business challenges and technical requirements.</li>
<li>Provide hands-on technical expertise, coding side-by-side to drive projects to completion.</li>
<li>Collaborate with Sales, Success, and Product teams for seamless customer experiences.</li>
<li>Shape the Forward Deployed Engineering function and codify best practices.</li>
</ul>
<p><strong>Required Qualifications</strong></p>
<ul>
<li>Deep knowledge of high-level programming languages (JavaScript, Python, Ruby, etc.).</li>
<li>Strong AI/ML interest and ability to understand novel problems and trade-offs.</li>
<li>REST API proficiency for system integration.</li>
<li>Fast prototyping and shipping capability with a quality focus.</li>
<li>Cross-functional collaboration skills.</li>
<li>Strong communication across technical and non-technical audiences.</li>
<li>Willingness to travel and work on-site with customers.</li>
</ul>
`.trim(),
        location: "Dublin, Ireland",
        department: "Forward Deployed Engineering",
        jobType: "FULL_TIME",
        remotePolicy: "HYBRID",
        stipend: "Not specified",
        duration: "Permanent",
        applyUrl: "https://job-boards.greenhouse.io/intercom/jobs/7218259",
      },
      {
        slug: "fin-senior-forward-deployed-engineer-london",
        title: "Senior Forward Deployed Engineer",
        description: `
<p>Fin is an AI Customer Agent company founded in 2011, serving nearly 30,000 businesses globally with AI-powered customer support solutions integrated with Intercom's help desk platform. This is a founding Senior Forward Deployed Engineer role designed to bridge strategic customers' business goals with Fin's AI capabilities, offering ownership, creativity, and the opportunity to lead R&D and Go-to-Market teams.</p>
<p><strong>Key Responsibilities</strong></p>
<ul>
<li>Drive Fin adoption by helping prospects leverage AI capabilities for support automation.</li>
<li>Embed with strategic customers to understand business challenges and technical requirements.</li>
<li>Work hands-on alongside customer technical teams as expert advisor and coder.</li>
<li>Collaborate with Sales, Success, and Product teams for seamless experiences.</li>
<li>Establish best practices and codify insights from customer engagements.</li>
</ul>
<p><strong>Required Skills</strong></p>
<ul>
<li>SaaS product building experience.</li>
<li>AI/ML interest with ability to understand novel problems and architectural trade-offs.</li>
<li>Strong cross-functional collaboration capabilities.</li>
<li>Proficiency in high-level programming languages (JavaScript, Python, Ruby, etc.).</li>
<li>Ability to prototype and ship quality software quickly.</li>
<li>REST API expertise.</li>
<li>Excellent communication across technical and non-technical audiences.</li>
<li>Willingness to travel and work on-site with customers.</li>
</ul>
<p><strong>Benefits</strong> include competitive salary, equity, daily lunch, pension matching (4%), comprehensive health/dental insurance, flexible PTO, parental leave, Cycle-to-Work Scheme, and a standard-issue MacBook.</p>
`.trim(),
        location: "London, England",
        department: "Forward Deployed Engineering",
        jobType: "FULL_TIME",
        remotePolicy: "HYBRID",
        stipend: "Not specified",
        duration: "Permanent",
        applyUrl: "https://job-boards.greenhouse.io/intercom/jobs/7462098",
      },
      {
        slug: "fin-director-product-analytics",
        title: "Director, Product Analytics",
        description: `
<p>This leadership position guides product analytics in an AI-native B2B SaaS environment, emphasizing strategic influence over traditional experimentation frameworks. Also referred to internally as "Product Data Science Leader, Fin."</p>
<p><strong>Key Responsibilities</strong></p>
<ul>
<li>Support leaders in prioritizing Fin's strategic focus areas.</li>
<li>Analyze ambiguous product questions with structured data-driven insights.</li>
<li>Identify product performance gaps and intervention opportunities.</li>
<li>Influence zero-to-one product direction in evolving areas.</li>
<li>Define engagement depth for product data science initiatives.</li>
<li>Architect AI-enhanced analytical methodologies while maintaining rigor standards.</li>
<li>Enhance visibility into product performance and business impact.</li>
<li>Collaborate across product, engineering, design, research, and sales functions.</li>
<li>Challenge weak reasoning while building stakeholder trust.</li>
<li>Design operating models for product data science functions.</li>
<li>Coach teams and prioritize high-impact analytical work.</li>
</ul>
<p><strong>Required Qualifications</strong></p>
<ul>
<li>Leadership experience navigating complex product landscapes.</li>
<li>Demonstrated ability shaping organizational strategy.</li>
<li>Comfort with ambiguity and sound judgment under incomplete information.</li>
<li>Senior stakeholder influence capabilities.</li>
<li>Strong analytical and technical competencies.</li>
<li>A clear viewpoint on AI-native product data science practices.</li>
<li>Experience evolving team composition and capabilities.</li>
<li>Discernment regarding data scientist specialization needs.</li>
<li>Judgment on responsible AI application in analytics.</li>
<li>Cross-functional translation and stakeholder management skills.</li>
<li>Strong credibility and communication presence.</li>
<li>Operating model design or evolution experience.</li>
<li>Ideally, AI-native or fast-moving SaaS background.</li>
</ul>
<p><strong>Benefits</strong> include competitive salary, equity, pension matching up to 4%, health/dental insurance, flexible PTO, parental leave, and Cycle-to-Work Scheme.</p>
`.trim(),
        location: "Berlin, Germany / Dublin, Ireland / London, England / EMEA Remote",
        department: "Product Data Science",
        jobType: "FULL_TIME",
        remotePolicy: "HYBRID",
        stipend: "Not specified",
        duration: "Permanent",
        applyUrl: "https://job-boards.greenhouse.io/intercom/jobs/8030046",
      },
      {
        slug: "fin-senior-data-scientist-ai-tooling",
        title: "Senior Data Scientist - AI Tooling",
        description: `
<p>Fin is an AI Customer Agent company enabling businesses to deliver customer support across service, sales, and ecommerce channels using proprietary AI models. The Research, Analytics & Data Science (RAD) team transforms insights into action through customer, product, and business analytics. This role focuses on building LLM and agent-powered workflows that automate GTM processes, moving beyond static dashboards to actionable tools.</p>
<p><strong>Key Responsibilities</strong></p>
<ul>
<li>Design, evaluate, and ship AI-powered internal tools for GTM use cases including account research, next-best-action recommendations, renewal propensity modeling, and post-call summarization.</li>
<li>Own the full lifecycle from problem definition through production deployment.</li>
<li>Rapidly prototype with users, then productionize for iteration.</li>
<li>Define success through usage metrics and measurable business impact.</li>
<li>Document playbooks and enable team adoption.</li>
</ul>
<p><strong>Required Skills</strong></p>
<ul>
<li>At least 3 years of Product or GTM analytics experience.</li>
<li>Proven GTM data science impact with shipped models/tools affecting conversion, cycle time, or retention.</li>
<li>LLM/ML application experience with RAG, prompt design, vector search, and evaluations.</li>
<li>Strong SQL proficiency and Python or R fluency.</li>
<li>Experience with orchestration tools (DBT, Airflow).</li>
<li>Excellent communication translating data concepts for non-technical audiences.</li>
<li>Collaborative product mindset working with Sales and Success teams.</li>
</ul>
<p><strong>Benefits</strong> include competitive equity, daily lunch, health/dental insurance, flexible vacation, parental leave, and a standard-issue MacBook.</p>
`.trim(),
        location: "Dublin, Ireland / London, England",
        department: "Research, Analytics & Data Science (RAD)",
        jobType: "FULL_TIME",
        remotePolicy: "HYBRID",
        stipend: "Not specified",
        duration: "Permanent",
        applyUrl: "https://job-boards.greenhouse.io/intercom/jobs/7314809",
      },
      {
        slug: "fin-senior-data-scientist-product-analytics",
        title: "Senior Data Scientist - Product Analytics",
        description: `
<p>The Research, Analytics & Data Science (RAD) team uses data to enable evidence-based decision-making, partnering across R&D to help the company understand users, products, and business metrics.</p>
<p><strong>Key Responsibilities</strong></p>
<ul>
<li>Partner with product teams, identifying important questions and answering them through data analysis.</li>
<li>Collaborate with product managers, designers, and engineers developing success metrics and measuring outcomes.</li>
<li>Design and maintain end-to-end data pipelines, working with stakeholders on data collection and refinement.</li>
<li>Build understanding of customers and products alongside product researchers.</li>
<li>Influence product roadmap through experimentation and quantitative research.</li>
<li>Build and automate models and dashboards.</li>
<li>Communicate findings across the organization.</li>
<li>Shape RAD foundations and organizational operations.</li>
</ul>
<p><strong>Required Skills</strong></p>
<ul>
<li>5+ years of data problem-solving experience.</li>
<li>Excellent SQL skills and statistical/analytical competency.</li>
<li>Track record delivering actionable insights with minimal supervision.</li>
<li>Strong technical and non-technical communication abilities.</li>
<li>Growth mindset with an ownership focus.</li>
<li>Scientific computing language experience (such as R or Python).</li>
</ul>
<p><strong>Bonus Skills</strong></p>
<ul>
<li>BI/visualization tools (Tableau, Superset, Looker).</li>
<li>Data modeling and ETL pipeline experience.</li>
<li>Product team experience.</li>
<li>AI tool proficiency for data science workflows.</li>
</ul>
`.trim(),
        location: "London, England",
        department: "Research, Analytics & Data Science (RAD)",
        jobType: "FULL_TIME",
        remotePolicy: "HYBRID",
        stipend: "Not specified",
        duration: "Permanent",
        applyUrl: "https://job-boards.greenhouse.io/intercom/jobs/6317929",
      },
    ],
  },
  {
    slug: "microsoft",
    name: "Microsoft",
    tagline: "Empowering every person and organization on the planet to achieve more",
    about:
      "Microsoft, founded in 1975 by Bill Gates and Paul Allen, is a multinational technology company headquartered in Redmond, Washington, led by Chairman and CEO Satya Nadella. Publicly traded (NASDAQ: MSFT), Microsoft builds products spanning cloud computing (Azure), productivity software (Microsoft 365), operating systems (Windows), gaming (Xbox), and AI (Copilot).",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg",
    fundingStage: "PUBLIC",
    remotePolicy: "HYBRID",
    visaSponsorship: false,
    employeeCountRange: "1000+",
    websiteUrl: "https://www.microsoft.com",
    categories: ["saas", "ai-ml", "infrastructure"],
    technologies: [],
    location: { city: "Redmond", country: "USA" },
    founders: [
      {
        name: "Bill Gates",
        title: "Co-founder",
        linkedinUrl: "https://www.linkedin.com/in/williamhgates/",
      },
      { name: "Paul Allen", title: "Co-founder" },
      {
        name: "Satya Nadella",
        title: "Chairman & CEO",
        linkedinUrl: "https://www.linkedin.com/in/satyanadella/",
      },
    ],
    links: [
      { type: "linkedin", url: "https://www.linkedin.com/company/microsoft" },
      { type: "twitter", url: "https://x.com/microsoft" },
    ],
    internships: [
      {
        slug: "microsoft-software-engineering-intern-brazil",
        title: "Software Engineering INTERN",
        description: `
<p>Come build community, explore your passions and do your best work at Microsoft with thousands of students from every corner of the world. This opportunity will allow you to bring your aspirations, talent, potential — and excitement for the journey ahead.</p>
<p>As a Software Engineering (SWE) Intern, you will work with teammates to solve problems and build innovative software solutions. You will apply your passion for customers and product quality as you provide technical guidance to Technical Program Managers and Product Managers. You will also be expected to demonstrate an ability to learn and adopt relevant new technologies, tools, methods and processes to leverage in your solutions. This opportunity will enable you to advance your career by designing, developing, and testing next-generation software that will empower every person and organization on the planet to achieve more.</p>
<p>At Microsoft, interns work on real-world projects in collaboration with teams across the world. Microsoft's mission is to empower every person and every organization on the planet to achieve more.</p>
<p><strong>Responsibilities</strong></p>
<ul>
<li>Apply engineering principles to solve complex problems through sound and creative engineering.</li>
<li>Work with appropriate stakeholders to determine user requirements for a feature.</li>
<li>Quickly learn new engineering methods and incorporate them into work processes.</li>
<li>Seek feedback and apply internal or industry best practices to improve technical solutions.</li>
<li>Demonstrate skill in time management and completing software projects in a cooperative team environment.</li>
<li>Review current developments and proactively seek new knowledge that will improve the availability, reliability, efficiency, observability, and performance of products while also driving consistency in monitoring and operations at scale.</li>
</ul>
<p><strong>Required Qualifications</strong></p>
<ul>
<li>Currently pursuing a bachelor's degree in Engineering, Computer Science, or a related field.</li>
<li>Intermediate or advanced English proficiency.</li>
</ul>
<p><strong>Preferred Qualifications</strong></p>
<ul>
<li>Ability to demonstrate an understanding of computer science fundamentals, including data structures and algorithms.</li>
<li>Experience programming in an object-oriented language.</li>
</ul>
`.trim(),
        location: "Brazil (Multiple Locations)",
        department: "Software Engineering",
        jobType: "INTERNSHIP",
        remotePolicy: "ONSITE",
        stipend: "Not specified",
        duration: "Not specified",
        applyUrl: "https://apply.careers.microsoft.com/careers/job/1970393556875247",
      },
      {
        slug: "microsoft-software-engineering-intern-india",
        title: "Software Engineering INTERN",
        description: `
<p>Come build community, explore your passions and do your best work at Microsoft with thousands of university interns from every corner of the world. This opportunity will allow you to bring your aspirations, talent, potential — and excitement for the journey ahead.</p>
<p>As a Software Engineering Intern, you will work with teammates to solve problems and build innovative software solutions. You will apply your passion for customers and product quality as you provide technical guidance to Technical Program Managers and Product Managers. You will learn and adopt relevant new technologies, tools, methods, and processes to leverage in your solutions.</p>
<p>At Microsoft, interns work on real-world projects in collaboration with teams across the world. Microsoft's mission is to empower every person and every organization on the planet to achieve more.</p>
<p><strong>Responsibilities</strong></p>
<ul>
<li>Apply engineering principles to solve complex problems through sound and creative engineering.</li>
<li>Work with appropriate stakeholders to determine user requirements for a feature.</li>
<li>Quickly learn new engineering methods and incorporate them into work processes.</li>
<li>Seek feedback and apply internal or industry best practices to improve technical solutions.</li>
<li>Demonstrate skill in time management and completing software projects in a cooperative team environment.</li>
<li>Review current developments and proactively seek new knowledge that will improve the availability, reliability, efficiency, observability, and performance of products while also driving consistency in monitoring and operations at scale.</li>
</ul>
<p><strong>Required Qualifications</strong></p>
<ul>
<li>Currently pursuing a Bachelor's or Master's degree in Computer Science, Engineering, or a related field.</li>
<li>Must have at least 1 semester/term remaining following the completion of the internship.</li>
<li>One year of programming experience in an object-oriented language.</li>
</ul>
<p><strong>Preferred Qualifications</strong></p>
<ul>
<li>Ability to demonstrate an understanding of computer science fundamentals, including data structures and algorithms.</li>
</ul>
`.trim(),
        location: "India (Multiple Locations)",
        department: "Software Engineering",
        jobType: "INTERNSHIP",
        remotePolicy: "ONSITE",
        stipend: "Not specified",
        duration: "Not specified",
        applyUrl: "https://apply.careers.microsoft.com/careers/job/1970393556911730",
      },
    ],
  },
  {
    slug: "nvidia",
    name: "NVIDIA",
    tagline: "The engine of AI, powering the next era of computing",
    about:
      "NVIDIA, founded in 1993 by Jensen Huang, Chris Malachowsky, and Curtis Priem, is headquartered in Santa Clara, California. Publicly traded (NASDAQ: NVDA), NVIDIA pioneered GPU computing and has become a leading force in AI, robotics, and accelerated computing, with its GPUs acting as the brains of computers, robots, and self-driving cars.",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/a/a4/NVIDIA_logo.svg",
    fundingStage: "PUBLIC",
    remotePolicy: "ONSITE",
    visaSponsorship: false,
    employeeCountRange: "1000+",
    websiteUrl: "https://www.nvidia.com",
    categories: ["ai-ml", "infrastructure"],
    technologies: ["python", "cpp", "pytorch", "cuda", "ros2"],
    location: { city: "Santa Clara", country: "USA" },
    founders: [
      {
        name: "Jensen Huang",
        title: "Founder & CEO",
        linkedinUrl: "https://www.linkedin.com/in/jenhsunhuang/",
      },
      { name: "Chris Malachowsky", title: "Co-founder" },
      { name: "Curtis Priem", title: "Co-founder" },
    ],
    links: [
      { type: "linkedin", url: "https://www.linkedin.com/company/nvidia" },
      { type: "twitter", url: "https://x.com/nvidia" },
    ],
    internships: [
      {
        slug: "nvidia-robotics-software-intern-deployment-humanoids",
        title: "Robotics Software Intern, Deployment and Humanoids - 2026",
        description: `
<p>NVIDIA has been transforming computer graphics, PC gaming, and accelerated computing for more than 25 years. Today, NVIDIA is tapping into the unlimited potential of AI to define the next era of computing — an era in which its GPUs act as the brains of computers, robots, and self-driving cars that can understand the world.</p>
<p>As a Robotics Software Intern on the Isaac Applications Team, you will help build the platform for Physical AI robots — enabling sim-first development, real-world deployment, and continuous learning to make them smarter over time. The ideal candidate will have strong software engineering skills for (soft) realtime robotics applications and real-world experience with multi-body robots, such as humanoids or quadrupeds.</p>
<p><strong>What You'll Be Doing</strong></p>
<ul>
<li>Bring the latest advancements in Physical AI to simulated and real humanoid robots by building the humanoid reference platform showcasing the power of NVIDIA's technology.</li>
<li>Collaborate across team boundaries to integrate NVIDIA robotics products such as Thor and Isaac Sim / Isaac Lab into one solution for humanoid robots.</li>
<li>Work in a professional software development team in a corporate environment.</li>
</ul>
<p><strong>What We Need to See</strong></p>
<ul>
<li>Currently pursuing a degree in Computer Science, Robotics, Engineering, or a related field (MS or PhD).</li>
<li>Proficiency in C++ and Python programming languages.</li>
<li>Experience with simulated and real robots.</li>
<li>Knowledge of common tools and libraries for robotics and learning (e.g. PyTorch, CUDA, ROS2, physics simulators like Isaac Sim and MuJoCo).</li>
<li>Academic classes or coursework in machine learning, control, and robotics systems.</li>
<li>Deployment experience on robots (sim2real).</li>
</ul>
<p><strong>Ways to Stand Out from the Crowd</strong></p>
<ul>
<li>Previous internships or hands-on experience with robotic systems in a commercial or academic setting.</li>
<li>Experience with NVIDIA robotics tools (Isaac Lab, Isaac ROS) and hardware (Jetson platform).</li>
<li>Experience with humanoid robots.</li>
</ul>
`.trim(),
        location: "Shanghai, China",
        department: "Isaac Applications Team, Robotics",
        jobType: "INTERNSHIP",
        remotePolicy: "ONSITE",
        stipend: "Not specified",
        duration: "Not specified",
        applyUrl: "https://nvidia.wd5.myworkdayjobs.com/en-US/nvidiaexternalcareersite/job/China-Shanghai/Robotics-Software-Intern--Deployment-and-Humanoids---2026_JR2019641",
      },
    ],
  },
  {
    slug: "rivian-vw-group-technologies",
    name: "Rivian and Volkswagen Group Technologies",
    tagline: "Building the software-defined vehicle platform for Rivian and Volkswagen",
    about:
      "Rivian and Volkswagen Group Technologies (RV Tech) is a joint venture between Rivian and Volkswagen Group, established in 2024 to advance software-defined vehicles — spanning operating systems, zonal controllers, and cloud and connectivity solutions. Owned equally by both companies, it's co-led by Rivian's Chief Software Officer Wassym Bensaid and Volkswagen Group's Chief Technology Officer Carsten Helbing. Volkswagen has committed up to $5.8B to the venture, including equity investment and milestone-based funding.",
    fundingStage: "SERIES_C_PLUS",
    remotePolicy: "ONSITE",
    visaSponsorship: false,
    employeeCountRange: "1000+",
    websiteUrl: "https://rivianvw.tech",
    categories: ["ai-ml", "infrastructure"],
    technologies: ["java", "cpp"],
    location: { city: "Vancouver", country: "Canada" },
    founders: [
      {
        name: "Wassym Bensaid",
        title: "Co-CEO (Chief Software Officer, Rivian)",
        linkedinUrl: "https://www.linkedin.com/in/wassymbensaid/",
      },
      {
        name: "Carsten Helbing",
        title: "Co-CEO (Chief Technology Officer, Volkswagen Group)",
        linkedinUrl: "https://www.linkedin.com/in/carsten-helbing-918412142/",
      },
    ],
    links: [
      { type: "linkedin", url: "https://www.linkedin.com/company/rivian-and-vw-group-technologies" },
    ],
    internships: [
      {
        slug: "rvtech-software-engineer-intern-android-connectivity",
        title: "Software Engineer Intern - Android Connectivity (Fall-Spring Co-op)",
        description: `
<p>Rivian and Volkswagen Group Technologies is a joint venture between two industry leaders with a clear vision for automotive's next chapter. From operating systems to zonal controllers to cloud and connectivity solutions, the joint venture addresses the challenges of electric vehicles through technology that will set the standards for software-defined vehicles around the world.</p>
<p>As a Software Engineer Intern - Android Connectivity, you will collaborate with a dynamic team to design, develop, and ship features in Kotlin, Java, and C++ that power Bluetooth, Wi-Fi, and cellular experiences in Rivian and Volkswagen vehicles. You will integrate Android connectivity APIs and broadcast vehicle states across distributed ECUs, debugging complex issues across the app, framework, and hardware layers.</p>
<p><strong>Duration:</strong> Full-time, September 21, 2026 – April 23, 2027. Applicants must be available to work from the Yaletown Office (Vancouver) for the full duration of the co-op.</p>
<p><strong>Responsibilities</strong></p>
<ul>
<li>Design, develop, and ship Android features in Kotlin, Java, and C++ across the apps and shared libraries that power Bluetooth, Wi-Fi, Hotspot, and Cellular experiences in Rivian and Volkswagen vehicles.</li>
<li>Integrate Android platform connectivity APIs and contribute to the services that broadcast connectivity state across distributed in-vehicle ECUs.</li>
<li>Debug and resolve issues spanning app, framework, and hardware layers, working to root-cause field-reported connectivity problems.</li>
<li>Participate in code reviews, design discussions, and architecture modelling, taking a feature from design through merge.</li>
<li>Collaborate with product, UI/UX, platform, and embedded counterparts to translate connectivity requirements into shippable user experiences.</li>
</ul>
<p><strong>Minimum Qualifications</strong></p>
<ul>
<li>Currently pursuing a B.S. or M.S. in Computer Science, Software Engineering, Computer Engineering, Electrical Engineering, or equivalent, enrolled at an accredited Canadian university.</li>
<li>Must have the intent to return to school full-time following completion of this internship.</li>
<li>Proficient in at least one of the following: Java, Kotlin, or C++.</li>
</ul>
<p><strong>Preferred Qualifications</strong></p>
<ul>
<li>Working knowledge of Bluetooth concepts (Classic vs. BLE, GATT, pairing/bonding) and exposure to common profiles (A2DP, AVRCP, HFP, PBAP, MAP).</li>
<li>Working knowledge of networking concepts: TCP/IP, DHCP, DNS, IP routing, iptables, Wi-Fi (STA/SoftAP), and tethering/hotspot fundamentals.</li>
<li>Familiarity with the Android ConnectivityManager, NetworkCallback, WifiManager, or BluetoothAdapter APIs.</li>
</ul>
`.trim(),
        location: "Vancouver, British Columbia, Canada",
        department: "CTO",
        jobType: "INTERNSHIP",
        remotePolicy: "ONSITE",
        stipend: "Not specified",
        duration: "September 21, 2026 – April 23, 2027",
        applyUrl: "https://jobs.ashbyhq.com/rivianvw.tech/75874976-540a-4e5c-aa72-1b23669c5211",
      },
    ],
  },
];

export async function seedCompanies(db: PrismaClient, taxonomy: SeededTaxonomy) {
  for (const c of COMPANIES) {
    const company = await db.company.upsert({
      where: { slug: c.slug },
      update: {
        name: c.name,
        tagline: c.tagline,
        about: c.about,
        logoUrl: c.logoUrl,
        fundingStage: c.fundingStage,
        remotePolicy: c.remotePolicy,
        visaSponsorship: c.visaSponsorship,
        employeeCountRange: c.employeeCountRange,
        websiteUrl: c.websiteUrl,
        verificationStatus: "VERIFIED",
      },
      create: {
        slug: c.slug,
        name: c.name,
        tagline: c.tagline,
        about: c.about,
        logoUrl: c.logoUrl,
        fundingStage: c.fundingStage,
        remotePolicy: c.remotePolicy,
        visaSponsorship: c.visaSponsorship,
        employeeCountRange: c.employeeCountRange,
        websiteUrl: c.websiteUrl,
        verificationStatus: "VERIFIED",
      },
    });

    // Categories / technologies (join rows; skip duplicates on re-run).
    for (const slug of c.categories) {
      const categoryId = taxonomy.categories[slug];
      if (!categoryId) continue;
      await db.companyCategory.upsert({
        where: { companyId_categoryId: { companyId: company.id, categoryId } },
        update: {},
        create: { companyId: company.id, categoryId },
      });
    }
    for (const slug of c.technologies) {
      const technologyId = taxonomy.technologies[slug];
      if (!technologyId) continue;
      await db.companyTechnology.upsert({
        where: {
          companyId_technologyId: { companyId: company.id, technologyId },
        },
        update: {},
        create: { companyId: company.id, technologyId },
      });
    }

    // Location + founders (only add if none exist yet, to stay idempotent).
    const existingLocations = await db.companyLocation.count({
      where: { companyId: company.id },
    });
    if (existingLocations === 0) {
      await db.companyLocation.create({
        data: {
          companyId: company.id,
          city: c.location.city,
          country: c.location.country,
          isHQ: true,
        },
      });
    }
    const existingFounders = await db.founder.count({
      where: { companyId: company.id },
    });
    if (existingFounders === 0) {
      await db.founder.createMany({
        data: c.founders.map((f) => ({
          companyId: company.id,
          name: f.name,
          title: f.title,
          linkedinUrl: f.linkedinUrl,
          twitterUrl: f.twitterUrl,
          isHiringManager: f.isHiringManager ?? false,
        })),
      });
    }

    // Social links (only add if none exist yet, to stay idempotent).
    if (c.links?.length) {
      const existingLinks = await db.companyLink.count({
        where: { companyId: company.id },
      });
      if (existingLinks === 0) {
        await db.companyLink.createMany({
          data: c.links.map((l) => ({
            companyId: company.id,
            type: l.type,
            url: l.url,
          })),
        });
      }
    }

    // Internships (published).
    for (const i of c.internships) {
      await db.internship.upsert({
        where: { slug: i.slug },
        update: {
          title: i.title,
          description: i.description,
          location: i.location,
          department: i.department,
          jobType: i.jobType,
          remotePolicy: i.remotePolicy,
          stipend: i.stipend,
          duration: i.duration,
          applyUrl: i.applyUrl,
          status: "PUBLISHED",
        },
        create: {
          companyId: company.id,
          slug: i.slug,
          title: i.title,
          description: i.description,
          location: i.location,
          department: i.department,
          jobType: i.jobType,
          remotePolicy: i.remotePolicy,
          stipend: i.stipend,
          duration: i.duration,
          applyUrl: i.applyUrl,
          status: "PUBLISHED",
          publishedAt: new Date(),
        },
      });
    }
  }
  console.log(`  ✓ companies: ${COMPANIES.length} verified (with internships)`);
}
