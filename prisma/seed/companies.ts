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
      {
        slug: "nvidia-performance-engineer-intern-systems-software",
        title: "Performance Engineer Intern, Systems Software - Fall 2026",
        description: `
<p>NVIDIA is a worldwide technology company headquartered in Santa Clara, California. NVIDIA manufactures graphics processing units (GPUs), as well as system on a chip units (SOCs) for the expanding markets. Our work in visual computing has led to thousands of patented inventions, breakthrough technologies, deep industry relationships and a globally recognized brand.</p>
<p>You would join the team responsible for the maintenance, development, and execution of Desktop Gaming Performance testing in Linux and Windows environments for the world's fastest, power efficient GPUs. This job has a preferred duration of 8-12 months.</p>
<p><strong>What You'll Be Doing</strong></p>
<ul>
<li>Writing and maintaining containerized GPU accelerated workloads for the financial services industry, from deep learning training and inference, to portfolio optimization and backtesting.</li>
<li>Running, validating, and analyzing benchmarking models at scale on HPC clusters.</li>
<li>Visualizing performance data, building charts and dashboards using internal schemas and tooling.</li>
<li>Working closely with the latest and greatest in financial AI models and tooling to help build reference models for NVIDIA.</li>
</ul>
<p><strong>What We Need to See</strong></p>
<ul>
<li>Enrolled in a Bachelor's program majoring in Computer Engineering, Software Engineering, Computer Science, or related field.</li>
<li>Desire to improve code quality by learning and applying computer science fundamentals, algorithms, and data structures.</li>
<li>Comfort with teamwork, collaboration, and a desire to reach across functional borders to develop new partnerships.</li>
<li>Active experience with Python.</li>
<li>Working comfort in a Linux command-line environment with version control.</li>
<li>Foundational understanding and interest of the machine learning lifecycle (training, evaluation, and inference).</li>
</ul>
<p><strong>Ways to Stand Out from the Crowd</strong></p>
<ul>
<li>Familiarity with PyTorch and/or training, testing, and evaluating machine learning models.</li>
<li>Experience with GPU computing or CUDA and libraries like cuOPT, CUTLASS, cuDNN, etc.</li>
<li>Exposure to workload orchestration and job schedulers (Kubernetes, Slurm).</li>
<li>Experience with containerized applications and resource management.</li>
<li>Interest in quantitative finance and applying performance data to real-world problems.</li>
</ul>
`.trim(),
        location: "St. Louis, MO",
        department: "Systems Software",
        jobType: "INTERNSHIP",
        remotePolicy: "ONSITE",
        stipend: "$20–$71/hour",
        duration: "8-12 months",
        applyUrl: "https://nvidia.wd5.myworkdayjobs.com/NVIDIAExternalCareerSite/job/US-MO-St-Louis/Performance-Engineer-Intern--Systems-Software---Fall-2026_JR2015779",
      },
      {
        slug: "nvidia-quantum-research-scientist-intern",
        title: "Quantum Research Scientist Intern - Fall 2026",
        description: `
<p>Today, NVIDIA is tapping into the unlimited potential of AI to define the next era of computing. NVIDIA is deeply invested in the future of quantum computing, building the accelerated platforms (cuQuantum, CUDA-Q, and NVIDIA Ising) that researchers around the world rely on to design, simulate, and scale quantum systems. This role works at the intersection of design, calibration, and quantum error correction, prototyping large-scale pipelines to computationally tackle fundamental problems in quantum hardware.</p>
<p><strong>What You'll Be Doing</strong></p>
<ul>
<li>Develop agentic AI systems for quantum computing applications.</li>
<li>Prototype a high-performance agentic pipeline for quantum EDA (Electronic Design Automation) of superconducting qubits.</li>
<li>Collect, organize, and curate data to support digital twin development and NVIDIA Ising model workflows.</li>
<li>Accelerate and deploy quantum calibration primitives.</li>
<li>Combine electromagnetic and quantum simulations to extract relevant parameters and construct accurate Hamiltonians of the devices.</li>
</ul>
<p><strong>What We Need to See</strong></p>
<ul>
<li>Pursuing a Master's or PhD in Physics, Electrical/Computer Engineering, Computer Science, or related field.</li>
<li>Proficiency in Python and a strong background in quantum computing fundamentals, including a deep understanding of at least one qubit modality.</li>
<li>Familiarity with, or the ability to quickly ramp up on, standard design software.</li>
<li>Exposure to electromagnetic simulation tools such as Ansys HFSS, Palace, or comparable solvers.</li>
<li>Strong teamwork, communication, and documentation skills.</li>
</ul>
<p><strong>Ways to Stand Out from the Crowd</strong></p>
<ul>
<li>Hands-on experience with the design, simulation, calibration, and operation of quantum hardware systems (including superconducting qubits, Ion Traps, Neutral Atoms, or other leading physical modalities).</li>
<li>Experience building agentic or LLM-driven workflows for scientific automation and tool orchestration.</li>
<li>GPU-accelerated simulation experience with cuQuantum, CUDA-Q, or related NVIDIA quantum software.</li>
<li>Familiarity with classical machine learning methods.</li>
<li>A track record of publications in premier quantum computing or applied physics venues (e.g., PRX Quantum, Quantum, npj Quantum Information).</li>
</ul>
`.trim(),
        location: "Remote (CA)",
        department: "Quantum Computing",
        jobType: "INTERNSHIP",
        remotePolicy: "REMOTE",
        stipend: "$20–$71/hour",
        duration: "Not specified",
        applyUrl: "https://nvidia.wd5.myworkdayjobs.com/NVIDIAExternalCareerSite/job/US-CA-Remote/Quantum-Research-Scientist-Intern---Fall-2026_JR2018244",
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
  {
    slug: "tower-research-capital",
    name: "Tower Research Capital",
    tagline: "A leading quantitative trading firm",
    about:
      "Tower Research Capital is a leading quantitative trading firm founded in 1998, built on a high-performance platform and independent trading teams. Tower is home to some of the world's best systematic trading and engineering talent, with a 25+ year track record of innovation. Headquartered in NYC's historic Equitable Building, Tower has over a dozen offices worldwide including Chicago, London, Amsterdam, Singapore, and Hong Kong.",
    logoUrl: "https://tower-research.com/wp-content/uploads/2024/06/Logo.svg",
    fundingStage: "BOOTSTRAPPED",
    remotePolicy: "ONSITE",
    visaSponsorship: false,
    employeeCountRange: "1000+",
    websiteUrl: "https://tower-research.com",
    categories: ["fintech"],
    technologies: ["cpp", "python"],
    location: { city: "New York", country: "USA" },
    founders: [
      {
        name: "Mark Gorton",
        title: "Founder & Chairman",
        linkedinUrl: "https://www.linkedin.com/in/mark-gorton-9729701b1/",
      },
      { name: "Alistair Brown", title: "Co-founder" },
      { name: "Albert An", title: "CEO" },
    ],
    links: [],
    internships: [
      {
        slug: "tower-research-quantitative-developer-intern",
        title: "Quantitative Developer Intern - Summer 2027",
        description: `
<p>Tower Research Capital is a leading quantitative trading firm founded in 1998. Tower has built its business on a high-performance platform and independent trading teams. We have a 25+ year track record of innovation and a reputation for discovering unique market opportunities.</p>
<p>Tower is home to some of the world's best systematic trading and engineering talent. We empower portfolio managers to build their teams and strategies independently while providing the economies of scale that come from a large, global organization.</p>
<p>Engineers thrive at Tower while developing electronic trading infrastructure at a world class level. Our engineers solve challenging problems in the realms of low-latency programming, FPGA technology, hardware acceleration and machine learning.</p>
<p><strong>Responsibilities</strong></p>
<ul>
<li>Architect and optimize performant low-latency trading and high-throughput training systems.</li>
<li>Work extensively with traders and researchers.</li>
<li>Create tools to analyze data for patterns.</li>
<li>Make market observations and conduct post-trade analysis.</li>
<li>Develop, augment, and calibrate exchange simulators.</li>
<li>Operate the team's high-frequency trading strategies.</li>
</ul>
<p><strong>Qualifications</strong></p>
<ul>
<li>Bachelor's, Master's, or PhD student.</li>
<li>Majoring in computer science, mathematics, physics, electrical engineering, or related fields.</li>
<li>Proficient in an object-oriented programming language (C++ and Python preferred).</li>
<li>A working knowledge of Linux/Unix.</li>
<li>Strong problem-solving abilities.</li>
<li>A passion for new technologies and ideas.</li>
<li>The ability to manage multiple tasks in a fast-paced environment.</li>
<li>Strong communication skills.</li>
<li>Interest in financial markets.</li>
</ul>
<p><strong>Preferred Qualifications (not required)</strong></p>
<ul>
<li>Past industry experience.</li>
<li>Experience as a Teaching Assistant and/or participation in relevant Olympiads.</li>
<li>Familiarity with machine learning, data analysis, market research and data modeling.</li>
</ul>
<p><strong>Benefits</strong> include a competitive compensation package, housing accommodation, free breakfast/lunch/snacks daily, networking and social events, and mentorship from senior management.</p>
`.trim(),
        location: "New York, NY / Chicago, IL",
        department: "Engineering",
        jobType: "INTERNSHIP",
        remotePolicy: "ONSITE",
        stipend: "$3,500–$5,700/week",
        duration: "Summer 2027",
        applyUrl: "https://tower-research.com/open-positions/?gh_jid=8044334",
      },
    ],
  },
  {
    slug: "imc-trading",
    name: "IMC Trading",
    tagline: "A global market maker and proprietary trading firm",
    about:
      "IMC (International Marketmaker's Combination) is a proprietary trading firm and market maker founded in 1989 by Robert Defares and René Schelvis, two traders on the floor of the Amsterdam Equity Options Exchange. Headquartered in Amsterdam's Zuidas business district, IMC employs over 1,600 people across offices in Chicago, Sydney, Mumbai, Zug, Seoul, London, New York, and Hong Kong.",
    fundingStage: "BOOTSTRAPPED",
    remotePolicy: "ONSITE",
    visaSponsorship: false,
    employeeCountRange: "1000+",
    websiteUrl: "https://www.imc.com",
    categories: ["fintech", "ai-ml"],
    technologies: ["java", "cpp", "python", "pytorch", "tensorflow", "jax"],
    location: { city: "Amsterdam", country: "Netherlands" },
    founders: [
      { name: "Robert Defares", title: "Co-founder & CEO" },
      { name: "René Schelvis", title: "Co-founder" },
    ],
    links: [],
    internships: [
      {
        slug: "imc-software-engineer-intern",
        title: "Software Engineer Intern - Summer 2027",
        description: `
<p>IMC is a proprietary trading firm and market maker. This 10-week internship gives you the chance to engage with meaningful projects that could influence business outcomes, alongside classroom training covering financial markets, IMC technology, and coding fundamentals.</p>
<p><strong>Core Responsibilities</strong></p>
<ul>
<li>Engage with meaningful projects that could influence business outcomes.</li>
<li>Participate in classroom training covering financial markets overview, IMC technology, and coding fundamentals.</li>
<li>Build relationships with traders and technologists in a problem-solving-focused environment.</li>
<li>Attend professional development sessions exploring career trajectory at IMC.</li>
<li>Participate in summer events and social activities with cohort members.</li>
</ul>
<p><strong>Required Skills &amp; Experience</strong></p>
<ul>
<li>Strong algorithmic and data structure knowledge.</li>
<li>Proficiency in Java or C++ (preferred).</li>
<li>Strong analytical abilities and programmatic problem-solving interest.</li>
<li>Collaborative mindset for cross-functional teamwork.</li>
<li>Ability to begin June 7, 2027.</li>
</ul>
<p>Prior financial markets experience is not required, but interest in the field is encouraged. Selected interns meeting performance standards may receive graduate position offers.</p>
`.trim(),
        location: "Chicago, IL",
        department: "Engineering/Technology",
        jobType: "INTERNSHIP",
        remotePolicy: "ONSITE",
        stipend: "$200,000/year",
        duration: "10 weeks, Summer 2027",
        applyUrl: "https://job-boards.eu.greenhouse.io/imc/jobs/4823924101",
      },
      {
        slug: "imc-machine-learning-research-intern",
        title: "Machine Learning Research Intern - Summer 2027 - Chicago",
        description: `
<p>IMC is seeking PhD candidates for a 10–12 week in-person Machine Learning Research internship in Chicago, conducting hands-on research designing and applying original machine learning algorithms.</p>
<p><strong>Core Responsibilities</strong></p>
<ul>
<li>Conduct hands-on research designing and applying original machine learning algorithms.</li>
<li>Analyze large-scale datasets to develop predictive models.</li>
<li>Build research skills through mentorship and feedback.</li>
<li>Deepen understanding of quantitative trading via classroom instruction.</li>
</ul>
<p><strong>Required Skills &amp; Experience</strong></p>
<ul>
<li>Strong foundations in machine learning, probability, and statistics.</li>
<li>Demonstrated hands-on experience with deep learning (neural networks, sequence modeling, optimization).</li>
<li>Python proficiency and expertise with PyTorch, TensorFlow, and/or JAX.</li>
<li>Proven research excellence via publications at NeurIPS, ICML, ICLR, or equivalent venues.</li>
<li>Must start in-person June 7, 2027.</li>
</ul>
<p>Travel and accommodation are covered. High-performing interns may advance to full-time Graduate Researcher roles post-graduation.</p>
`.trim(),
        location: "Chicago, IL",
        department: "Machine Learning Research",
        jobType: "INTERNSHIP",
        remotePolicy: "ONSITE",
        stipend: "$300,000/year",
        duration: "10–12 weeks, Summer 2027",
        applyUrl: "https://job-boards.eu.greenhouse.io/imc/jobs/4907430101",
      },
    ],
  },
  {
    slug: "walleye-capital",
    name: "Walleye Capital",
    tagline: "A global multi-strategy investment firm",
    about:
      "Walleye Capital is a global multi-strategy investment firm founded in 2005 as an options market-making firm in Minnesota by Irving Kessler and Peter Goddard. Headquartered in New York with offices in London and Dubai, Walleye has surpassed $10B in assets under management, focusing on innovation through fundamental research, quantitative methods, and AI to generate alpha across global markets.",
    logoUrl: "https://walleyecapital.com/i/svg/logo_walleye_color.svg",
    fundingStage: "BOOTSTRAPPED",
    remotePolicy: "ONSITE",
    visaSponsorship: false,
    employeeCountRange: "201-500",
    websiteUrl: "https://walleyecapital.com",
    categories: ["fintech", "ai-ml"],
    technologies: ["python"],
    location: { city: "New York", country: "USA" },
    founders: [
      { name: "Irving Kessler", title: "Co-founder" },
      { name: "Peter Goddard", title: "Co-founder" },
      {
        name: "Will England",
        title: "Partner, CEO & Co-Chief Investment Officer",
        linkedinUrl: "https://www.linkedin.com/in/wiengland/",
      },
    ],
    links: [],
    internships: [
      {
        slug: "walleye-investment-data-science-intern",
        title: "Investment Data Science Intern (Summer 2027)",
        description: `
<p>Walleye Capital seeks interns for high-impact projects supporting long/short discretionary investment strategies through alternative data research, thematic investment analysis, and stock-specific assessments. This 10-week internship runs June–August 2027 in NYC.</p>
<p><strong>Key Responsibilities</strong></p>
<ul>
<li>Partner with Central Data Science on research initiatives, supporting both production insight pipelines and ad hoc analytics.</li>
<li>Collaborate with portfolio managers identifying areas where alternative/fundamental data strengthens investment theses.</li>
<li>Conduct exploratory data analysis, signal validation, and performance attribution studies.</li>
<li>Evaluate new data vendors through quantitative and qualitative assessment.</li>
<li>Learn data science workflows on cloud and Linux infrastructure.</li>
<li>Clean, transform, and manage structured/unstructured datasets while maintaining code quality and documentation.</li>
</ul>
<p><strong>Required Qualifications</strong></p>
<ul>
<li>Pursuing undergraduate or non-MBA master's in a STEM field, expected graduation December 2027–June 2028.</li>
<li>Strong quantitative skills, programming proficiency, statistical knowledge, and problem-solving ability.</li>
<li>Self-motivation, adaptability, attention to detail, and enthusiasm for leveraging AI tools.</li>
<li>Thrives in collaborative environments valuing intellectual humility and continuous learning.</li>
</ul>
<p><strong>Application Deadline:</strong> Friday, July 31 at 11:59pm ET.</p>
`.trim(),
        location: "New York, NY",
        department: "Central Data Science / Investment",
        jobType: "INTERNSHIP",
        remotePolicy: "ONSITE",
        stipend: "$14,000/month + $10,000 housing stipend",
        duration: "10 weeks, Summer 2027",
        applyUrl: "https://job-boards.greenhouse.io/walleyecapital-external-students/jobs/4676587006",
      },
      {
        slug: "walleye-quantic-quantitative-developer-intern",
        title: "Quantic – Quantitative Developer Intern (Summer 2027)",
        description: `
<p>Walleye Capital seeks technically proficient interns for the Quantic team, one of the most successful trading teams in the industry, operating in equities, options, and futures markets.</p>
<p><strong>Key Responsibilities</strong></p>
<ul>
<li>Create quantitative infrastructure for alpha generation and algorithmic trading.</li>
<li>Design data pipelines and ensure data quality in financial datasets.</li>
<li>Collaborate with traders on proprietary strategy development.</li>
<li>Build reporting tools for strategy risk and trade execution analysis.</li>
<li>Oversee automated trading systems using coding and AI tools.</li>
</ul>
<p><strong>Required Qualifications</strong></p>
<ul>
<li>Pursuing undergraduate or advanced degree in computer science, engineering, statistics, mathematics, or related field, expected graduation December 2027–June 2028.</li>
<li>Strong quantitative skills with proficiency in a scripting language (Python/Bash/Perl) and UNIX/Linux experience.</li>
<li>Familiarity with machine learning packages.</li>
<li>Self-starter mentality for complex problem-solving.</li>
<li>Interest in systematic investing and AI applications.</li>
<li>Collaborative mindset valuing intellectual humility, creativity, and continuous learning.</li>
</ul>
<p><strong>Application Deadline:</strong> Friday, July 31 at 11:59pm ET.</p>
`.trim(),
        location: "Boston, MA",
        department: "Quantic (Quantitative Investment)",
        jobType: "INTERNSHIP",
        remotePolicy: "ONSITE",
        stipend: "$20,000/month + $10,000 housing stipend",
        duration: "10 weeks, Summer 2027",
        applyUrl: "https://job-boards.greenhouse.io/walleyecapital-external-students/jobs/4679168006",
      },
      {
        slug: "walleye-volatility-trading-developer-intern",
        title: "Volatility Trading Developer Intern (Summer 2027)",
        description: `
<p>Support Walleye Capital's Equity Volatility business by collaborating with traders, developers, quants, and operations teams to develop and optimize tools for trading operations and infrastructure across a 10-week summer internship (June–August 2027).</p>
<p><strong>Responsibilities</strong></p>
<ul>
<li>Collaborate with traders implementing and scaling strategies, building datasets, automating workflows, and integrating trading signals.</li>
<li>Design tools supporting trading inputs (earnings, dividends, interest rates, model parameters) and critical processes like Early Exercise and Expiration workflows.</li>
<li>Assist modernizing legacy systems across risk, P&amp;L, operations, and execution for improved reliability and performance.</li>
<li>Research financial and technical contexts to ensure design decisions reflect real-world applications.</li>
<li>Utilize AI tools to enhance efficiency and workflows.</li>
</ul>
<p><strong>Required Qualifications</strong></p>
<ul>
<li>Pursuing undergraduate or non-MBA master's degree in mathematics, computer science, engineering, or related field, expected graduation December 2027–June 2028.</li>
<li>Strong quantitative and analytical skills with programming proficiency (Python, Java, or C++).</li>
<li>Self-motivated, adaptable, detail-oriented with ability managing multiple priorities.</li>
<li>Clear communication abilities, both written and verbal.</li>
<li>Collaborative mindset valuing intellectual humility, creativity, and continuous learning.</li>
</ul>
<p><strong>Application Deadline:</strong> Friday, July 31 at 11:59pm ET.</p>
`.trim(),
        location: "New York, NY",
        department: "Equity Volatility",
        jobType: "INTERNSHIP",
        remotePolicy: "ONSITE",
        stipend: "$14,000/month + $10,000 housing stipend",
        duration: "10 weeks, Summer 2027",
        applyUrl: "https://job-boards.greenhouse.io/walleyecapital-external-students/jobs/4679434006",
      },
    ],
  },
  {
    slug: "ellipsis-labs",
    name: "Ellipsis Labs",
    tagline: "Building sustainable and efficient DeFi protocols",
    about:
      "Ellipsis Labs is a profitable, venture-backed New York startup building sustainable and efficient DeFi protocols on high-throughput decentralized infrastructure. Its flagship product, Phoenix Perpetuals, brings professional-grade perpetual futures to Solana; it also operates SolFi, a proprietary automated market maker, and Phoenix Legacy, a limit order book on Solana. Combined, these products have facilitated over $285B in trading volume across Solana markets.",
    logoUrl: "https://cdn.prod.website-files.com/6682d4d014f82df8a5f50485/66d9f238b66f6d2933d63def_logo.svg",
    fundingStage: "SERIES_A",
    remotePolicy: "HYBRID",
    visaSponsorship: false,
    employeeCountRange: "11-50",
    websiteUrl: "https://www.ellipsislabs.xyz",
    categories: ["fintech", "ai-ml"],
    technologies: ["typescript", "rust", "python", "react", "docker"],
    location: { city: "New York", country: "USA" },
    founders: [
      {
        name: "Eugene Chen",
        title: "Co-founder",
        linkedinUrl: "https://www.linkedin.com/in/eugene-chen-a4940880/",
      },
      {
        name: "Jarry Xiao",
        title: "Co-founder",
        linkedinUrl: "https://www.linkedin.com/in/jarryxiao/",
      },
    ],
    links: [{ type: "linkedin", url: "https://www.linkedin.com/company/ellipsis-labs" }],
    internships: [
      {
        slug: "ellipsis-labs-software-engineer-2027-intern",
        title: "Software Engineer - 2027 Interns",
        description: `
<p>Ellipsis Labs is a profitable, venture-backed New York-based startup building sustainable and efficient DeFi protocols on high-throughput decentralized infrastructure. Our long-term goal is to build a better financial system.</p>
<p>Our flagship product, Phoenix Perpetuals, brings professional-grade perpetual futures to Solana. Building on our experience developing efficient markets, Ellipsis Labs also operates SolFi, a proprietary automated market maker that provides efficient liquidity for key trading pairs. Our foundational product, Phoenix Legacy, is a limit order book on the Solana blockchain that established our expertise in operating high-performance markets. Combined, these products have facilitated over $285B in trading volume across Solana markets.</p>
<p>Ellipsis Labs is seeking software engineering summer interns to join our team in 2027. As an early-stage startup, we appreciate bright generalists who can iterate and ship quickly.</p>
<p><strong>In this role, you will</strong></p>
<ul>
<li>Build real product features and/or platform components across the stack — front end, back end, infra, or on-chain — based on your skills and interest.</li>
<li>Own scoped projects end-to-end: problem definition → design → implementation → testing → deployment → monitoring.</li>
<li>Collaborate with design and engineering to deliver fast, reliable, and secure experiences.</li>
<li>Instrument and improve performance, reliability, and observability; write clear tests and documentation.</li>
</ul>
<p><strong>Qualifications — Required</strong></p>
<ul>
<li>Hands-on experience building software (courses, personal projects, research, or internships) in one or more languages such as TypeScript/JavaScript, Python, Rust, Java, C/C++; you write clear, tested code.</li>
<li>Solid CS fundamentals (data structures, algorithms, systems thinking) and familiarity with Git and basic debugging.</li>
<li>Ability to make informed trade-offs with business context; high agency and a team-first mindset.</li>
<li>Curiosity about DeFi/crypto (prior domain experience not required).</li>
</ul>
<p><strong>Qualifications — Preferred</strong></p>
<ul>
<li>Experience in one or more areas: full-stack web (React/JavaScript), backend APIs/services, infrastructure/DevOps (Docker, CI/CD, cloud), or on-chain/low-level systems.</li>
<li>Familiarity with blockchain technology (Solana a plus).</li>
<li>Interest or experience in fintech/trading.</li>
<li>Rust or TypeScript proficiency.</li>
</ul>
`.trim(),
        location: "New York, NY",
        department: "Engineering",
        jobType: "INTERNSHIP",
        remotePolicy: "HYBRID",
        stipend: "Not specified",
        duration: "Summer 2027",
        applyUrl: "https://jobs.ashbyhq.com/ellipsislabs/02136b22-35b1-4b3d-8bef-567c3380a849",
      },
    ],
  },
  {
    slug: "uber-freight",
    name: "Uber Freight",
    tagline: "AI-powered logistics network connecting shippers and carriers",
    about:
      "Uber Freight is a logistics technology company launched by Uber in 2017, connecting long-haul truck drivers with companies needing cargo shipping. Led by CEO Rebecca Tinucci (former Tesla charging infrastructure lead) since 2025, and chaired by founder Lior Ron, Uber Freight has built a scaled AI logistics network with its own logistics-specific large language model integrated into an upgraded Transportation Management System.",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/5/58/Uber_logo_2018.svg",
    fundingStage: "PUBLIC",
    remotePolicy: "HYBRID",
    visaSponsorship: false,
    employeeCountRange: "1000+",
    websiteUrl: "https://www.uberfreight.com",
    categories: ["logistics", "saas", "ai-ml"],
    technologies: ["python"],
    location: { city: "Bellevue", country: "USA" },
    founders: [
      {
        name: "Lior Ron",
        title: "Founder & Chairman",
        linkedinUrl: "https://www.linkedin.com/in/lioron/",
      },
      {
        name: "Rebecca Tinucci",
        title: "CEO",
        linkedinUrl: "https://www.linkedin.com/in/rebecca-tinucci",
      },
    ],
    links: [],
    internships: [
      {
        slug: "uber-freight-data-scientist-intern",
        title: "Data Scientist Intern - Fall 2026",
        description: `
<p>The intern will work across cross-functional teams on data-driven logistics challenges at Uber Freight.</p>
<p><strong>Key Responsibilities</strong></p>
<ul>
<li>Collaborate with data scientists, engineers, and stakeholders to address business problems.</li>
<li>Implement statistical and machine learning approaches such as causal inference, recommender systems, and time series forecasting.</li>
<li>Manage projects independently from initial exploration through production deployment.</li>
<li>Contribute to internal data product enhancements.</li>
<li>Communicate findings to technical and non-technical audiences.</li>
</ul>
<p><strong>Required Qualifications</strong></p>
<ul>
<li>Currently pursuing a Bachelor's, Master's, or PhD in a quantitative field with expected graduation Fall 2026 or Spring 2027.</li>
<li>Programming proficiency in Python or R for model development.</li>
<li>SQL competency for data manipulation.</li>
<li>Understanding of statistical/ML methods including regression, classification trees, unsupervised learning, and causal inference.</li>
<li>Strong problem-solving abilities in ambiguous settings.</li>
<li>Collaborative approach and willingness to grow in a dynamic environment.</li>
</ul>
<p><strong>Note:</strong> No immigration sponsorship or transfer is available for this role.</p>
`.trim(),
        location: "Chicago, IL 60607",
        department: "Data Science",
        jobType: "INTERNSHIP",
        remotePolicy: "HYBRID",
        stipend: "$30/hour",
        duration: "Not specified",
        applyUrl: "https://job-boards.greenhouse.io/uberfreight/jobs/5194491008",
      },
    ],
  },
  {
    slug: "figure-ai",
    name: "Figure AI",
    tagline: "Building general-purpose humanoid robots",
    about:
      "Figure AI is an artificial intelligence and robotics company founded in May 2022 by Brett Adcock, developing general-purpose humanoid robots. Figure has raised over $1B in funding at a $39B post-money valuation from investors including Jeff Bezos, Microsoft, NVIDIA, Intel, and the startup-funding divisions of Amazon and OpenAI.",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/6/6a/Figure-ai-logo.svg",
    fundingStage: "SERIES_C_PLUS",
    remotePolicy: "ONSITE",
    visaSponsorship: false,
    employeeCountRange: "201-500",
    websiteUrl: "https://www.figure.ai",
    categories: ["ai-ml"],
    technologies: ["cpp", "python"],
    location: { city: "Sunnyvale", country: "USA" },
    founders: [
      {
        name: "Brett Adcock",
        title: "Founder & CEO",
        linkedinUrl: "https://www.linkedin.com/in/brettadcock/",
      },
    ],
    links: [],
    internships: [
      {
        slug: "figure-ai-firmware-intern",
        title: "Firmware Intern [Fall 2026]",
        description: `
<p>Figure seeks a firmware engineering intern to support robotics development by enabling board bring-up, developing and validating new firmware features, and assisting with integration and testing.</p>
<p><strong>Responsibilities</strong></p>
<ul>
<li>Design, implement, and test firmware in C/C++ for motor controllers, battery management systems, and sensing hardware.</li>
<li>Develop Python tools for test automation and hardware calibration.</li>
<li>Contribute to CI/CD infrastructure development.</li>
<li>Support hardware/software integration in laboratory settings.</li>
</ul>
<p><strong>Core Requirements</strong></p>
<ul>
<li>Undergraduate senior or recent graduate in Computer Engineering, Computer Science, or related field.</li>
<li>Fluency in C, C++, and Python.</li>
<li>Experience implementing low level software on bare-metal systems and RTOS.</li>
<li>Strong computer architecture knowledge.</li>
<li>Deep understanding of communication buses and protocols like Ethernet, EtherCAT, Serial, CAN, or USB.</li>
<li>Proficiency with oscilloscopes, logic analyzers, and in-circuit debugging tools.</li>
</ul>
<p><strong>Bonus Qualifications</strong></p>
<ul>
<li>Motor controller or battery management systems experience.</li>
<li>CI/CD infrastructure implementation background.</li>
<li>Agile and test-driven development familiarity.</li>
</ul>
`.trim(),
        location: "San Jose, CA",
        department: "Firmware Engineering",
        jobType: "INTERNSHIP",
        remotePolicy: "ONSITE",
        stipend: "$40–$45/hour",
        duration: "Minimum 10 weeks (1–2 terms preferred)",
        applyUrl: "https://job-boards.greenhouse.io/figureai/jobs/4691070006",
      },
    ],
  },
  {
    slug: "intuitive-surgical",
    name: "Intuitive",
    tagline: "Robotic-assisted surgery, pioneered",
    about:
      "Intuitive (Intuitive Surgical), incorporated in 1995 by Frederic Moll, John Freund, and Robert Younge, pioneered robotic-assisted surgery with its da Vinci and Ion platforms. Publicly traded (NASDAQ: ISRG) and headquartered in Sunnyvale, California, Intuitive is led by CEO Dave Rosa, who succeeded longtime CEO Gary Guthart (now Executive Chair) in July 2025.",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/0/01/Intuitive_Surgical_logo.svg",
    fundingStage: "PUBLIC",
    remotePolicy: "ONSITE",
    visaSponsorship: false,
    employeeCountRange: "1000+",
    websiteUrl: "https://www.intuitive.com",
    categories: ["healthtech", "ai-ml"],
    technologies: ["python", "cpp", "pytorch", "opencv"],
    location: { city: "Sunnyvale", country: "USA" },
    founders: [
      { name: "Frederic Moll", title: "Co-founder" },
      { name: "Dave Rosa", title: "CEO" },
      { name: "Gary Guthart", title: "Executive Chair (former CEO)" },
    ],
    links: [{ type: "linkedin", url: "https://www.linkedin.com/company/intuitivesurgical" }],
    internships: [
      {
        slug: "intuitive-computer-vision-engineering-intern",
        title: "Computer Vision Engineering Intern - Fall 2026",
        description: `
<p>Join an R&amp;D team advancing computer vision for robotic endoscopic video technologies, focusing on vision foundation/diffusion models, feature detection, and multimodal video analysis.</p>
<p><strong>Essential Duties</strong></p>
<ul>
<li>Explore and experiment with state-of-the-art computer vision models.</li>
<li>Prototype algorithms and evaluate performance on public/proprietary datasets.</li>
<li>Conduct literature surveys and summarize key findings in reports and presentations.</li>
</ul>
<p><strong>Required Skills &amp; Experience</strong></p>
<ul>
<li>Hands-on expertise in computer vision, deep learning, video analysis.</li>
<li>Knowledge in vision-language models, diffusion models, feature detection, or multimodal learning.</li>
<li>Proficiency in programming with Python or C++.</li>
<li>Experience with PyTorch, OpenCV, DINO/CLIP, HuggingFace Transformers.</li>
<li>Strong research and communication abilities.</li>
<li>Self-driven; ability for rapid prototyping.</li>
</ul>
<p><strong>Education:</strong> currently enrolled in PhD or Master's in Computer Science, Robotics, Engineering, or related field, returning to degree program Spring 2027.</p>
<p><strong>Availability:</strong> full-time (40 hours/week) for 10-12 weeks starting August/September 2026.</p>
`.trim(),
        location: "Sunnyvale, CA",
        department: "R&D",
        jobType: "INTERNSHIP",
        remotePolicy: "ONSITE",
        stipend: "$62–$82/hour (region-dependent)",
        duration: "10-12 weeks",
        applyUrl: "https://jobs.smartrecruiters.com/Intuitive/744000133458290",
      },
    ],
  },
  {
    slug: "samsung-research-america",
    name: "Samsung Research America",
    tagline: "Samsung Electronics' U.S. research and innovation arm",
    about:
      "Samsung Research America (SRA) is Samsung Electronics' U.S.-based research organization, headquartered in Mountain View, California, with locations across the U.S. SRA conducts long-term research across AI, multimodal understanding and generation, and other advanced technologies with potential for direct impact on future Samsung products. Samsung Electronics is publicly traded (KRX: 005930).",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/b/b4/Samsung_wordmark.svg",
    fundingStage: "PUBLIC",
    remotePolicy: "ONSITE",
    visaSponsorship: false,
    employeeCountRange: "1000+",
    websiteUrl: "https://sra.samsung.com",
    categories: ["ai-ml", "consumer"],
    technologies: ["python", "pytorch"],
    location: { city: "Mountain View", country: "USA" },
    founders: [],
    links: [],
    internships: [
      {
        slug: "samsung-research-america-fall-intern-computer-vision-ai",
        title: "2026 Fall Intern, Computer Vision/AI",
        description: `
<p>The Vision Intelligence lab at Samsung's Mountain View research center seeks interns to conduct long-term research with potential for direct impact on future Samsung products. The team focuses on advancing multimodal understanding and generation technologies.</p>
<p><strong>Core Responsibilities</strong></p>
<ul>
<li>Research multi-modal models in retrieval, question answering, reasoning, generation, and editing.</li>
<li>Develop maintainable code implementing research concepts.</li>
<li>Collaborate with team members discussing findings and refining methodologies.</li>
<li>Execute experiments while documenting progress and presenting insights.</li>
<li>Prepare findings for major conference or journal submissions.</li>
</ul>
<p><strong>Required Qualifications</strong></p>
<ul>
<li>Currently enrolled in MS or PhD program.</li>
<li>Proficiency in Python, PyTorch, and Transformers frameworks.</li>
<li>Prior publications in top-tier venues (CVPR, ECCV, ICCV, ICML, NeurIPS, AAAI).</li>
<li>Expertise in VLMs, diffusion models, efficient multi-modal design, or Vision Language Action Models.</li>
<li>Strong communication abilities.</li>
</ul>
`.trim(),
        location: "Mountain View, CA",
        department: "Samsung AI Research Center (SAIC), Vision Intelligence Lab",
        jobType: "INTERNSHIP",
        remotePolicy: "ONSITE",
        stipend: "$48–$63/hour",
        duration: "Not specified",
        applyUrl: "https://job-boards.greenhouse.io/samsungresearchamericainternship/jobs/8560657002",
      },
    ],
  },
  {
    slug: "solopulse",
    name: "SoloPulse",
    tagline: "Architecting the foundational layer of signal intelligence",
    about:
      "SoloPulse Corp is a dual-use radar company founded in 2022 by Allyson McKinney, Victoria Rische, and Michael McKinney, headquartered in Norcross, GA. Using novel advanced wave theory algorithms underpinned by the principles of special relativity, SoloPulse achieves state-of-the-art resolution and latency metrics for products like SIGMA (target fixes and situational awareness) and NOVA (real-time actionable intelligence), serving civilian and military autonomy and safety needs. The company has raised $9.75M across two funding rounds.",
    logoUrl: "https://solopulse.com/wp-content/uploads/2026/03/SoluPulse-logo-2-Vectorized.png",
    fundingStage: "SEED",
    remotePolicy: "HYBRID",
    visaSponsorship: false,
    employeeCountRange: "11-50",
    websiteUrl: "https://solopulse.com",
    categories: ["ai-ml", "infrastructure"],
    technologies: ["python", "cpp", "cuda", "pytorch"],
    location: { city: "Norcross", country: "USA" },
    founders: [
      {
        name: "Allyson McKinney",
        title: "CEO & Co-founder",
        linkedinUrl: "https://www.linkedin.com/in/allyson-mckinney-31b534b3/",
      },
      {
        name: "Victoria Rische",
        title: "Co-founder & COO",
        linkedinUrl: "https://www.linkedin.com/in/victoria-rische11",
      },
      { name: "Michael McKinney", title: "Co-founder" },
    ],
    links: [{ type: "linkedin", url: "https://www.linkedin.com/company/solopulse-corp" }],
    internships: [
      {
        slug: "solopulse-software-engineer-intern-co-op",
        title: "Software Engineer Intern/Co-Op - Fall 2026",
        description: `
<p>SoloPulse Corp is a dual-use radar company committed to the relentless exploration of the frontiers of radar sensing technology. Through the utilization of novel advanced wave theory algorithms, underpinned by the principles of special relativity, SoloPulse can achieve state of the art resolution and latency metrics. Located in Atlanta, GA, SoloPulse stands as a venture-backed startup, diligently cultivating strategic collaborations to proactively address critical safety imperatives and emerging autonomy needs across both civilian and military domains.</p>
<p>As a Software Engineer Intern/Co-op at SoloPulse, you will play a critical role in the development of our software solutions. You will work on a wide range of tasks, from algorithm development to frontend-backend integration.</p>
<p><strong>Responsibilities</strong></p>
<ul>
<li>Design, develop, test, and deploy software solutions using a variety of programming languages and technologies.</li>
<li>Implement and maintain both frontend and backend components of our applications.</li>
<li>Develop and optimize algorithms to solve complex problems.</li>
<li>Engineer low-latency solutions to proprietary computational operations.</li>
<li>Collaborate with cross-functional teams to understand and define software requirements.</li>
</ul>
<p><strong>Qualifications</strong></p>
<ul>
<li>Must be pursuing a Bachelor's, Master's, or PhD in Computer Science, Computer Engineering or related quantitative field from an accredited 4-year university.</li>
<li>Proficiency in Python and C++.</li>
<li>Familiarity with embedded and real-time systems programming.</li>
<li>Knowledge of software architecture and design paradigms.</li>
<li>Strong communication and teamwork skills.</li>
<li>Willingness to take ownership of projects and work autonomously.</li>
</ul>
<p><strong>Bonus Qualifications</strong></p>
<ul>
<li>A strong portfolio of personal software or hardware-related projects.</li>
<li>Familiarity with the CUDA toolkit and associated programming practices.</li>
<li>Familiarity with GPU-accelerated libraries such as PyTorch and OpenGL/ThreeJS.</li>
</ul>
`.trim(),
        location: "Peachtree Corners, GA",
        department: "Engineering",
        jobType: "INTERNSHIP",
        remotePolicy: "HYBRID",
        stipend: "Not specified",
        duration: "Not specified",
        applyUrl: "https://jobs.lever.co/solopulseco/00fbde18-a387-4c9f-97d4-77059aec7b56",
      },
    ],
  },
  {
    slug: "qualcomm",
    name: "Qualcomm",
    tagline: "Inventing the technologies that keep the world connected",
    about:
      "Qualcomm was established on July 1, 1985 by Irwin Jacobs and six other former Linkabit employees (Andrew Viterbi, Franklin Antonio, Adelia Coffman, Andrew Cohen, Klein Gilhousen, and Harvey White). Headquartered in San Diego, California, Qualcomm is publicly traded (NASDAQ: QCOM) and led by President & CEO Cristiano Amon. Qualcomm pioneered 5G technology and Snapdragon chips that power most Android devices.",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/f/fc/Qualcomm-Logo.svg",
    fundingStage: "PUBLIC",
    remotePolicy: "ONSITE",
    visaSponsorship: false,
    employeeCountRange: "1000+",
    websiteUrl: "https://www.qualcomm.com",
    categories: ["ai-ml", "infrastructure"],
    technologies: [],
    location: { city: "San Diego", country: "USA" },
    founders: [
      { name: "Irwin Jacobs", title: "Co-founder" },
      { name: "Andrew Viterbi", title: "Co-founder" },
      {
        name: "Cristiano Amon",
        title: "President & CEO",
        linkedinUrl: "https://www.linkedin.com/in/cristiano-r-amon/",
      },
    ],
    links: [
      { type: "linkedin", url: "https://www.linkedin.com/company/qualcomm" },
      { type: "twitter", url: "https://x.com/Qualcomm" },
    ],
    internships: [
      {
        slug: "qualcomm-interim-engineering-intern-hardware",
        title: "Interim Engineering Intern (1 Year) - Hardware",
        description: `
<p><strong>Company:</strong> Qualcomm India Private Limited</p>
<p><strong>Job Area:</strong> Interns Group &gt; Interim Engineering Intern - HW</p>
<p>Qualcomm is a company of inventors that unlocked 5G, ushering in an age of rapid acceleration in connectivity and new possibilities that will transform industries, create jobs, and enrich lives. It takes inventive minds with diverse skills, backgrounds, and cultures to transform 5G's potential into world-changing technologies and products.</p>
<p><em>Note: the detailed Responsibilities, Required Qualifications, and Preferred Qualifications sections were not filled in on this posting at the source (Qualcomm's own career site shows placeholder text in place of the actual content) — reproduced here as published rather than invented.</em></p>
<p>Qualcomm offers continuous learning and development programs, tuition reimbursement, and mentorships alongside comprehensive benefits.</p>
`.trim(),
        location: "Bangalore, Karnataka, India",
        department: "Interim Engineering Intern - HW",
        jobType: "INTERNSHIP",
        remotePolicy: "ONSITE",
        stipend: "Not specified",
        duration: "1 year",
        applyUrl: "https://careers.qualcomm.com/careers/job/446717035054?domain=qualcomm.com&hl=en",
      },
    ],
  },
  {
    slug: "payu",
    name: "PayU",
    tagline: "Powering payments for online businesses",
    about:
      "PayU is a fintech company founded in 2002 and headquartered in Hoofddorp, Netherlands, empowering businesses to accept and process online payments across web and mobile applications. Owned by Prosus (Naspers Group) and led by Global CEO Anirban Mukherjee, PayU has ~3,350 employees and a valuation of ~$2.87B as of late 2024. This listing is with PayU Payments Private Limited, its India entity.",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/c/cd/PayU.svg",
    fundingStage: "SERIES_C_PLUS",
    remotePolicy: "ONSITE",
    visaSponsorship: false,
    employeeCountRange: "1000+",
    websiteUrl: "https://payu.in",
    categories: ["fintech"],
    technologies: [],
    location: { city: "Hoofddorp", country: "Netherlands" },
    founders: [
      { name: "Nitin Gupta", title: "Co-founder" },
      { name: "Amrish Rau", title: "Co-founder" },
      { name: "Anirban Mukherjee", title: "Global CEO" },
    ],
    links: [
      { type: "linkedin", url: "https://www.linkedin.com/company/payu" },
      { type: "twitter", url: "https://twitter.com/payuindia" },
    ],
    internships: [
      {
        slug: "payu-fpa-intern",
        title: "Intern (Financial Planning & Analysis)",
        description: `
<p>The FP&amp;A team functions as a strategic pillar within PayU's Finance Organization, driving analytical decision-making and financial insights across the company. The team manages budgeting, quarterly reviews, financial modeling, and performance analytics while supporting growth in the fintech sector.</p>
<p><strong>Key Responsibilities</strong></p>
<ul>
<li>Assist with monthly, quarterly, and annual financial planning and forecasting across business units.</li>
<li>Develop and maintain financial models, dashboards, and reporting templates.</li>
<li>Analyze variance between actual performance and budget/forecast.</li>
<li>Support executive-level presentations and board materials.</li>
<li>Conduct financial analysis on new business initiatives and market expansion.</li>
<li>Maintain and enhance automated reporting using Excel and BI tools.</li>
<li>Assist in annual budgeting processes.</li>
<li>Monitor KPIs and business metrics.</li>
<li>Support ad-hoc financial analysis requests.</li>
<li>Collaborate cross-functionally and streamline FP&amp;A processes.</li>
<li>Research industry benchmarks and competitive analysis.</li>
</ul>
<p><strong>Required Qualifications</strong></p>
<ul>
<li>Advanced Microsoft Excel proficiency (financial modeling, pivot tables, complex formulas).</li>
<li>Basic understanding of financial statements and accounting principles.</li>
<li>Strong analytical and quantitative problem-solving skills.</li>
<li>Excellent attention to detail.</li>
<li>Outstanding written and verbal communication abilities.</li>
<li>Ability to manage multiple priorities independently.</li>
</ul>
<p><strong>Preferred Qualifications</strong></p>
<ul>
<li>Data visualization tools experience (Power BI, Tableau).</li>
<li>Previous finance/consulting/analytics internship experience.</li>
<li>ERP systems familiarity (SAP, Oracle).</li>
<li>Understanding of fintech and digital payments.</li>
<li>SQL, Python, or data analysis tool experience.</li>
<li>Professional certifications (CFA, FRM, CPA) in progress.</li>
</ul>
<p><strong>Commitment:</strong> 6-month full-time internship with potential extension; immediate availability preferred.</p>
`.trim(),
        location: "Gurgaon, Haryana, India",
        department: "Finance (FP&A)",
        jobType: "INTERNSHIP",
        remotePolicy: "ONSITE",
        stipend: "Not specified",
        duration: "6 months",
        applyUrl: "https://www.linkedin.com/jobs/view/4435957773/",
      },
    ],
  },
  {
    slug: "meesho",
    name: "Meesho",
    tagline: "Democratising internet commerce for everyone",
    about:
      "Meesho (Meri Shop) is a social commerce platform founded in December 2015 by Vidit Aatrey and Sanjeev Barnwal, both IIT Delhi alumni, with a mission to be an e-commerce destination for Indian consumers and enable small businesses to succeed online. Meesho offers sellers zero commission and affordable shipping, connecting them with customers across urban, semi-urban, and rural India via a pan-India logistics network. Headquartered in Bengaluru, Meesho has raised $1.36B from investors including SoftBank, Prosus, Elevation Capital, and Peak XV Partners.",
    logoUrl: "https://www.meesho.io/img/meesho-logo.png",
    fundingStage: "SERIES_C_PLUS",
    remotePolicy: "ONSITE",
    visaSponsorship: false,
    employeeCountRange: "1000+",
    websiteUrl: "https://www.meesho.com",
    categories: ["consumer", "saas"],
    technologies: ["android", "kotlin", "java", "python", "aws", "kubernetes", "docker", "postgres", "mysql", "elasticsearch"],
    location: { city: "Bengaluru", country: "India" },
    founders: [
      {
        name: "Vidit Aatrey",
        title: "Founder & CEO",
        linkedinUrl: "https://in.linkedin.com/in/vidit-aatrey-a3639120",
      },
      { name: "Sanjeev Barnwal", title: "Co-founder & CTO" },
    ],
    links: [{ type: "linkedin", url: "https://in.linkedin.com/company/meesho" }],
    internships: [
      {
        slug: "meesho-architect-android",
        title: "Architect - Android",
        description: `
<p><strong>About the Team</strong><strong></strong>When 10% of Indian households shop with us, it’s important to build resilient systems to manage millions of orders every day. We’ve done this – with zero downtime! 😎 </p><p>Sounds impossible? Well, that’s the kind of Engineering muscle that has helped Meesho become the e-commerce giant that it is today. We value speed over perfection, and see failures as opportunities to become better. We’ve taken steps to inculcate a strong ‘Founder’s Mindset’ across our engineering teams, making us grow and move fast.</p><p>We want Meesho to be at everyone’s fingertips! And, YOU can make that happen. </p><p>We place special emphasis on the continuous growth of each team member - and we do this with regular 1-1s and open communication. As Android Architect, you will be part of self-starters who thrive on teamwork and constructive feedback. </p><p>We know how to party as hard as we work! If we aren’t building unparalleled tech solutions, you can find us debating the plot points of our favourite books and games – or even gossiping over chai. So, if a day filled with building impactful solutions with a fun team sounds appealing to you, join us.</p><p><strong>About the Role </strong><strong></strong></p><p>As our Android Architect, you will join us in the Android Platform team. This is your opportunity to be a trailblazer in your industry. </p><p>In this role, you will primarily focus on building a roadmap for our Android Platform. You will lead and contribute to all our engineering efforts – from planning and organisation to execution and delivery. You will collaborate closely with QA, other Engineers, Product Managers, and Designers across the company to shape the future of our Android platform.</p><p>In addition, you will also actively participate in external conferences and conduct knowledge sharing sessions for the team.</p><p><strong>What you will do</strong></p><ul><li><p>Define and evolve the long-term Android architecture strategy, including modularization and migration paths away from legacy stacks</p></li><li><p>Drive cross-team architectural decisions and write ADRs that align mobile and platform teams on shared patterns</p></li><li><p>Lead architectural reviews, deep-dive design sessions, and refactoring of high-impact surfaces</p></li><li><p>Set engineering standards for code quality, testing strategy, and release readiness</p></li><li><p>Own end-to-end app performance — startup, jank, memory, ANRs, battery.</p></li><li><p>Champion AI-assisted developer workflows — Claude Code, Cursor, Codex, AI-driven code review and test generation and measure productivity impact.&nbsp;</p></li><li><p>Identify and lead 2–3 crucial strategic projects per year from problem framing through rollout.&nbsp;</p></li><li><p>Build the next generation of internal SDKs, design system components, and platform libraries consumed by other Android engineers.</p></li><li><p>Recruit, mentor, and grow Android engineers; partner on hiring loops and career growth</p></li><li><p>Perform deep code reviews that raise the technical bar</p></li><li><p>Represent Android in cross-functional planning and shape the broader mobile roadmap</p></li></ul><p><strong>What you will need</strong></p><ul><li>8+ years of Android development experience, with at least 2 shipped production apps</li><li><p>Strong command of Jetpack Compose, state management, and the modern Android UI toolkit</p></li><li><p>Hands-on experience with the modern Jetpack stack: Hilt, Room, DataStore, WorkManager, Navigation, Paging</p></li><li><p>Solid understanding of architecture patterns — unidirectional data flow, MVI, clean architecture — and how to make them testable</p></li><li><p>Proven debugging skills — memory leaks, ANRs, jank, cold-start regressions.</p></li><li><p>Experience with performance tooling: Macrobenchmark, Baseline Profiles, App Startup, and R8 optimization</p></li><li><p>Proficiency with modern networking and serialization (Retrofit + OkHttp, kotlinx.serialization or Moshi) and image loading.</p></li><li><p>Strong grasp of concurrency, structured concurrency with Coroutines, and reactive streams.</p></li><li><p>Experience with modularization at scale, Gradle build optimization (KSP, configuration cache, build cache), and CI/CD pipelines</p></li><li><p>Comfort with AI-assisted development tools (Claude Code, Cursor, Codex) in day-to-day workflow</p></li><li><p>Understanding of advanced Android internals — custom Compose layouts, background execution constraints, process lifecycle, security best practices</p></li><li><p>Strong Git, code review, and collaboration habits</p></li></ul>
`.trim(),
        location: "Bangalore, Karnataka",
        department: "Demand",
        jobType: "FULL_TIME",
        remotePolicy: "ONSITE",
        stipend: "Not specified",
        duration: "Permanent",
        applyUrl: "https://jobs.lever.co/meesho/040a5a75-28d2-4b56-904b-071c41d4ea90",
      },
      {
        slug: "meesho-senior-principal-data-scientist",
        title: "Senior Principal Data Scientist",
        description: `
<p><strong>About the role</strong><strong></strong></p><p>Are you a strategic thinker with a passion for solving large-scale problems using data? Do you enjoy mentoring high-performing teams and building ML systems that directly impact millions of users? We're looking for a <strong>Senior Principal Data Scientist</strong> to lead a team of skilled data scientists in building intelligent systems that power Meesho’s next phase of growth.</p><p>In this role, you’ll own the data science roadmap for a key business charter, guiding the team through ambiguity and complexity to deliver production-grade ML solutions. You’ll work closely with product, tech, and business leaders to translate complex challenges into scalable, measurable, and impactful outcomes. As a people and technical leader, you’ll ensure model efficiency, system reliability, and scientific excellence while fostering a culture of innovation, collaboration, and continuous improvement.</p><p><strong>What You Will Do</strong></p><ul><h2>&nbsp;</h2><li><p>Lead, grow, and mentor a high-performing team of data scientists.</p></li><li><p>Own all data science systems and models in your charter — from strategy to deployment and monitoring.</p></li><li><p>Collaborate with senior product, engineering, and business leaders to define and prioritize impactful DS initiatives.</p></li><li><p>Drive platformization, system architecture decisions, and ML lifecycle improvements across the charter.</p></li><li><p>Ensure model scalability, performance, and cost efficiency, while upholding best practices in experimentation and statistical rigor.</p></li><li><p>Guide the team in reading and implementing state-of-the-art research, and facilitate build vs. buy decisions.</p></li><li><p>Lead RCA for critical production issues and improve system observability, documentation, and service uptime.</p></li></ul><p><strong>What You Will Need</strong></p><ul><li><p>Master’s degree (PhD preferred) in Machine Learning, Statistics, Computer Science, or a related quantitative field.</p></li><li><p>10+ years of experience in Data Science or Analytics, with at least 2–3 years of people management experience.</p></li><li><p>Proven track record of building and deploying ML models in production at scale.</p></li><li><p>Experience managing teams of 10+ data scientists and delivering across cross-functional charters.</p></li><li><p>Deep expertise in ML algorithms, experimental design, and performance monitoring.</p></li><li><p>Strong coding skills (Python, SQL) and familiarity with Big Data technologies like Spark, Hive, or Redshift.</p></li><li><p>Ability to translate business needs into technical solutions, prioritize roadmaps, and estimate effort accurately.</p></li><li><p>Strong communication and stakeholder management skills with a bias for action and clarity in execution.</p></li><h3><strong>Bonus Points For</strong></h3><li><p>Experience leading ML initiatives in B2C or e-commerce settings.</p></li><li><p>Contributions to internal tools, open-source libraries, or research publications.</p></li><li><p>Experience in personalization, recommendations, ranking, or supply chain ML problems.</p></li><li><p>Strong understanding of ML system performance trade-offs — latency, cost, and throughput.</p></li><p><strong></strong></p></ul>
`.trim(),
        location: "Bangalore, Karnataka",
        department: "Data Science",
        jobType: "FULL_TIME",
        remotePolicy: "ONSITE",
        stipend: "Not specified",
        duration: "Permanent",
        applyUrl: "https://jobs.lever.co/meesho/322aaf36-0d79-4190-876f-8b2e91b707bf",
      },
      {
        slug: "meesho-principal-data-scientist",
        title: "Principal Data Scientist",
        description: `
<strong>About the Team</strong> Our Data Science team is the Avengers to Meesho’s S.H.I.E.L.D 🛡️. And why not? We are the ones who assemble during the toughest challenges and devise creative solutions, building intelligent systems for millions of our users looking at a thousand different categories of products. We’ve barely scratched the surface, and have amazing challenges in charting the future of commerce for Bharat. Our typical day involves dealing with fraud detection, inventory optimisation, and platform vernacularisation. <strong>About the Role</strong> As a Principal Data Scientist in our AdTech team, you’ll drive innovation in our advertising platform using advanced machine learning and statistical methods. You’ll tackle complex problems in real-time bidding, ad ranking optimization, budget efficiency, and performance measurement that directly impact our business’s bottom line. This role requires technical excellence and business acumen and you’ll collaborate with cross-functional teams to transform data insights into actionable strategies that enhance our advertising ecosystem.<p><strong>What you will do</strong></p><ul><li>Design and develop sophisticated bidding, budget pacing and other algorithms that optimize ad spend or ROI.</li><li>Create frameworks and experimental design to measure ad effectiveness and ROI.</li><li>Collaborate with product and engineering teams to translate business requirements into efficient AI/ML solutions.</li><li>Communicate long-term roadmap, insights and recommendations to tech and business leadership.</li><li>Mentor junior data scientists and provide technical <a rel="noopener noreferrer" href="http://guidance.Lead">guidance.</a></li><li>Lead research initiatives in machine learning, auction theory and advertising technology.</li></ul><p><strong>What you will need</strong></p><ul><li>B.Tech in Computer Science, Machine Learning, or a related field with at least 6+ years of experience in AI/ML research.</li><li>Experience in auction theory, predictive modelling, causal inference, and reinforcement learning.</li><li>Expertise in PyTorch or TensorFlow, and proficiency in Python as well as big data technologies.</li><li>History of mentoring junior data scientists, and comfortable in driving multiple problem statements.</li><li>Excellent communication skills, able to explain complex concepts to both technical and non-technical audiences.</li><strong>Preferred Qualifications:</strong><li>M.Tech or Ph.d in Computer Science with a specialization in Machine Learning.</li><li>3+ years of experience applying machine learning and statistical modeling in AdTech, or related domains.</li><li>Exposure in real-time bidding systems, programmatic advertising, or ad exchanges.</li><li>Track record of successful research-to-product transitions.</li><li>Strong publication record in top AI conferences (e.g., NeurIPS, ICML, ICLR, KDD, CVPR, AAAI).</li></ul>
`.trim(),
        location: "Bangalore, Karnataka",
        department: "Data Science",
        jobType: "FULL_TIME",
        remotePolicy: "ONSITE",
        stipend: "Not specified",
        duration: "Permanent",
        applyUrl: "https://jobs.lever.co/meesho/3d5bf582-493f-4298-b7de-e42a7d58a358",
      },
      {
        slug: "meesho-data-scientist-iii",
        title: "Data Scientist III",
        description: `
<strong>About the Team</strong> Our Data Science team is the Avengers to Meesho’s S.H.I.E.L.D 🛡️. And why not? We are the ones who assemble during the toughest challenges and devise creative solutions, building intelligent systems for millions of our users looking at a thousand different categories of products. We’ve barely scratched the surface, and have amazing challenges in charting the future of commerce for Bharat. Our typical day involves dealing with fraud detection, inventory optimisation, and platform vernacularisation. As Data Scientist, you will navigate uncharted territories with us, discovering new paths to creating solutions for our users.🔍 You will be at the forefront of interesting challenges and solve unique customer problems in an untapped market. But wait – there’s more to us. Our team is huge on having a well-rounded personal and professional life. When we aren't nose-deep in data, you will most likely find us belting “Summer of 69” at the nearest Karaoke bar, or debating who the best Spider-Man is: Maguire, Garfield, or Holland? You tell us ☺️ <strong>About the Role </strong> Love deep data? Love discussing solutions instead of problems? Then you could be our next Data Scientist. In a nutshell, your primary responsibility will be enhancing the productivity and utilisation of the generated data. Other things you will do include working closely with the business stakeholders, transforming scattered pieces of information into valuable data and sharing and presenting your valuable insights with peers.<p><strong>What you will do </strong></p><ul><li>Develop models and run experiments to infer insights from hard data</li><li>Improve our product usability and identify new growth opportunities</li><li>Understand reseller preferences to provide them with the most relevant products</li><li>Designing discount programs to help our resellers sell more&nbsp;</li><li>Help resellers better recognise end-customer preferences to improve their revenue</li><li>Use data to identify bottlenecks that will help our suppliers meet their SLA requirements</li><li>Model seasonal demand to predict key organisational metrics</li><li>Mentor junior data scientists in the team</li></ul><p><strong>What you will need</strong></p><ul><li>Bachelor's/Master's degree in computer science (or similar degrees)</li><li>4-7 years of experience as a Data Scientist in a fast-paced organization, preferably B2C</li><li>Familiarity with Neural Networks, Machine Learning etc.</li><li>Familiarity with tools like SQL, R, Python, etc.</li><li>Strong understanding of Statistics and Linear Algebra&nbsp;</li><li>Strong understanding of hypothesis/model testing and ability to identify common model testing errors</li><li>Experience designing and running A/B tests and drawing insights from them &nbsp;</li><li>Proficiency in machine learning algorithms&nbsp;</li><li>Excellent analytical skills to fetch data from reliable sources to generate accurate insights</li><li>Experience in tech and product teams is a plus&nbsp;</li> Bonus points for: <li>Experience in working on personalization or other ML problems&nbsp;</li><li>Familiarity with Big Data tech stacks like Apache Spark, Hadoop, Redshift</li></ul>
`.trim(),
        location: "Bangalore, Karnataka",
        department: "Data Science",
        jobType: "FULL_TIME",
        remotePolicy: "ONSITE",
        stipend: "Not specified",
        duration: "Permanent",
        applyUrl: "https://jobs.lever.co/meesho/489fe662-5d28-4305-953e-91ee21e8538c",
      },
      {
        slug: "meesho-software-development-engineer-iii-devops",
        title: "Software Development Engineer III DevOps",
        description: `
<strong>About the team</strong> DevOps - because even the best developers need heroes. Whether you agree or not, a Senior DevOps Engineer is definitely nothing less than a hero to us - and with good reason! When 5% of Indian households shop with us, it’s important to build resilient systems to manage millions of orders every day. We’ve done this – with zero downtime! 😎 Sounds impossible? Well, that’s the kind of Engineering muscle that has helped Meesho become the e-commerce giant that it is today. We value speed over perfection, and see failures as opportunities to become better. We’ve taken steps to inculcate a strong ‘Founder’s Mindset’ across our engineering teams, making us grow and move fast. We place special emphasis on the continuous growth of each team member - and we do this with regular 1-1s and open communication. As Senior DevOps Engineer, you will be part of self-starters who thrive on teamwork and constructive feedback. We know how to party as hard as we work! If we aren’t building unparalleled tech solutions, you can find us debating the plot points of our favourite books and games – or even gossipping over chai. So, if a day filled with building impactful solutions with a fun team sounds appealing to you, join us. <strong>About the role</strong> As DevOps Engineer with us, your primary responsibility will be to create systems that serve as the brains of complex distributed products. You will closely mentor younger engineers on the team. You will work on code modularity, scalability, reusability and contribute to team building in the Engineering org.<p><strong>What you will do</strong></p><ul><li>Develop reusable Infrastructure code and testing frameworks for Infrastructure</li><li>Develop tools and frameworks to allow Meesho engineers to provision infrastructure and manage access controls&nbsp;</li><li>Design and develop solutions for cloud security, secrets management and key rotations&nbsp;</li><li>Design a centralised logging and metrics platform that can handle Meesho’s scale</li><li>Take on new infrastructure requirements and develop infrastructure as code</li><li>Work with the Applications teams to help them onboard container platform</li><li>Scale the Meesho platform to handle millions of requests concurrently&nbsp;</li><li>Reduce Mean Time To Recovery (MTTR), enable High Availability and Disaster Recovery&nbsp;</li></ul><p><strong>What you will need</strong></p><ul><li>Bachelors / Masters degree in Computer Science</li><li>At least 4 to 7 years of in-depth and hands-on professional experience in DevOps/Infrastructure Engineering domain</li><li>Proficiency in Strong Systems, Linux, OpenSource, InfraStructure Engineering, DevOps fundamentals&nbsp;</li><li>Understanding of compliance and security&nbsp;</li><li>Must have an in-depth understanding of SDL</li><li>Ability to write infrastructure as code for public or private clouds&nbsp;</li><li>Ability to implement modern cloud Integration architecture&nbsp;</li><li>Knowledge of configuration and infra management (Chef/Puppet/Ansible and Terraform)&nbsp; or CI tools (Any)&nbsp;</li><li>Knowledge of scripting language: Python, Shell, Go (proficiency in any one)&nbsp;</li><li>Knowledge of container services like Docker, Kubernetes, EKS/GKE, etc.&nbsp;</li><li>Knowledge of designing and implementing end-to-end monitoring solutions in the cloud</li></ul>
`.trim(),
        location: "Bangalore, Karnataka",
        department: "Infrastructure",
        jobType: "FULL_TIME",
        remotePolicy: "HYBRID",
        stipend: "Not specified",
        duration: "Permanent",
        applyUrl: "https://jobs.lever.co/meesho/60e0d986-abe8-42ee-b172-0d9aecb307b7",
      },
      {
        slug: "meesho-software-development-engineer-iii-data",
        title: "Software Development Engineer III Data",
        description: `
When 5% of Indian households shop with us, it’s important to build data-backed, resilient systems to manage millions of orders every day. We’ve done this – with zero downtime! 😎 Sounds impossible? Well, that’s the kind of Engineering muscle that has helped Meesho become the e-commerce giant that it is today. We value speed over perfection, and see failures as opportunities to become better. We’ve taken steps to inculcate a strong ‘Founder’s Mindset’ across our engineering teams, making us grow and move fast. We place special emphasis on the continuous growth of each team member - and we do this with regular 1-1s and open communication. Tech Culture We have a unique tech culture where engineers are seen as problem solvers. The engineering org is divided into multiple pods and each pod is aligned to a particular business theme. It is a culture driven by logical debates & arguments rather than authority. At Meesho, you get to solve hard technical problems at scale as well as have a significant impact on the lives of millions of entrepreneurs. You are expected to contribute to the Solutioning of product problems as well as challenge existing solutions. Meesho’s user base has grown 4x in the last 1 year and we have more than 50 million downloads of our app. Here are a few projects we have completed last year to scale oursystems for this growth: ● We have developed API gateway aggregators using frameworks like Hystrix and spring-cloud-gateway for circuit breaking and parallel processing. ● Our serving microservices handle more than 15K RPS on normal days and during saledays this can go to 30K RPS. Being a consumer app, these systems have SLAs of ~10ms ● Our distributed scheduler tracks more than 50 million shipments periodically fromdifferent partners and does async processing involving RDBMS. ● We use an in-house video streaming platform to support a wide variety of devices and networks. <p><strong>What You’ll Do</strong></p><ul><li>Design and implement <strong>scalable and fault-tolerant data pipelines</strong> (batch and streaming) using frameworks like <strong>Apache Spark</strong>, <strong>Flink</strong>, and <strong>Kafka</strong>.</li><li>Lead the <strong>design and development of data platforms and reusable frameworks</strong> that serve multiple teams and use cases.</li><li>Build and optimize <strong>data models and schemas</strong> to support large-scale <strong>operational and analytical</strong> workloads.</li><li><strong>Deeply understand Apache Spark internals</strong> and be capable of modifying or extending the <strong>open-source Spark codebase</strong> as needed.</li><li>Develop <strong>streaming solutions</strong> using tools like <strong>Apache Flink</strong>, <strong>Spark Structured Streaming</strong>.</li><li>Drive initiatives that <strong>abstract infrastructure complexity</strong>, enabling <strong>ML, analytics, and product teams</strong> to build faster on the platform.</li><li>Champion a <strong>platform-building mindset</strong> focused on <strong>reusability</strong>, <strong>extensibility</strong>, and <strong>developer self-service</strong>.</li><li>Ensure <strong>data quality, consistency, and governance</strong> through validation frameworks, observability tooling, and access controls.</li><li>Optimize infrastructure for <strong>cost, latency, performance</strong>, and <strong>scalability</strong> in <strong>modern cloud-native environments</strong>.</li><li><strong>Mentor and guide junior engineers</strong>, contribute to architecture reviews, and uphold high engineering standards.</li><li>Collaborate cross-functionally with product, ML, and data teams to align technical solutions with business needs.</li></ul><p><strong>What We’re Looking For</strong></p><ul><li><strong>5-8 years</strong> of professional experience in software/data engineering with a focus on <strong>distributed data systems</strong>.</li><li>Strong programming skills in <strong>Java</strong>, <strong>Scala</strong>, or <strong>Python</strong>, and expertise in <strong>SQL</strong>.</li><li>At least <strong>2 years of hands-on experience</strong> with big data systems including <strong>Apache Kafka</strong>, <strong>Apache Spark/EMR/Dataproc</strong>, <strong>Hive</strong>, <strong>Delta Lake</strong>, <strong>Presto/Trino</strong>, <strong>Airflow</strong>, and <strong>data lineage tools</strong> (e.g., Datahb,Marquez, OpenLineage).</li><li>Experience implementing and <strong>tuning Spark/Delta Lake/Presto</strong> at <strong>terabyte-scale</strong> or beyond.</li><li>Strong understanding of <strong>Apache Spark internals</strong> (Catalyst, Tungsten, shuffle, etc.) with experience customizing or contributing to open-source code.</li><li>Familiarity&nbsp; and worked with modern open-source and cloud-native data stack components such as:</li><li><strong>Apache Iceberg</strong>, <strong>Hudi</strong>, or <strong>Delta Lake</strong></li><li><strong>Trino/Presto</strong>, <strong>DuckDB</strong>, or <strong>ClickHouse,Pinot ,Druid</strong></li><li><strong>Airflow</strong>, <strong>Dagster</strong>, or <strong>Prefect</strong></li><li><strong>DBT</strong>, <strong>Great Expectations</strong>, <strong>DataHub</strong>, or <strong>OpenMetadata</strong></li><li><strong>Kubernetes</strong>, <strong>Terraform</strong>, <strong>Docker</strong></li><li>Strong <strong>analytical and problem-solving skills</strong>, with the ability to debug complex issues in large-scale systems.</li><li>Exposure to <strong>data security, privacy, observability</strong>, and <strong>compliance</strong> frameworks is a plus.</li></ul><p><strong>Good to Have</strong></p><ul><li>Contributions to open-source projects in the <strong>big data ecosystem</strong> (e.g., Spark, Kafka, Hive, Airflow)</li><li>Hands-on <strong>data modeling</strong> experience and exposure to <strong>end-to-end data pipeline development</strong></li><li>Familiarity with <strong>OLAP data cubes</strong> and BI/reporting tools such as <strong>Tableau, Power BI, Superset, or Looker</strong></li><li>Working knowledge of tools and technologies like <strong>ELK Stack (Elasticsearch, Logstash, Kibana)</strong>, <strong>Redis</strong>, and <strong>MySQL</strong></li><li>Exposure to backend technologies including <strong>RxJava</strong>, <strong>Spring Boot</strong>, and <strong>Microservices architecture</strong></li></ul>
`.trim(),
        location: "Bangalore, Karnataka",
        department: "Data Engineering",
        jobType: "FULL_TIME",
        remotePolicy: "ONSITE",
        stipend: "Not specified",
        duration: "Permanent",
        applyUrl: "https://jobs.lever.co/meesho/7bb1de7e-8756-412b-8c71-0ba40863edc8",
      },
      {
        slug: "meesho-associate-compliance-manager",
        title: "Associate Compliance Manager",
        description: `
<p><strong>About the Team </strong></p><p>Meesho's Security & Compliance team safeguards a platform that 5% of Indian households shop with - millions of orders, billions of data points, zero downtime as a baseline. We own the Information Security Management System, drive every external certification, and shape how Meesho earns trust with sellers, buyers, partners and regulators. We move fast, default to automation, and obsess over evidence.</p><p><strong>About the Role</strong></p><p>This is a <strong>hands-on individual contributor role</strong> for someone who wants to <strong>drive</strong> - not just oversee - a multi-framework compliance program. You'll be the DRI for ISO 27001:2022 and SOC 2 Type II, run end-to-end ITGC and TPRM cycles, and help operationalise India's DPDP Rules 2025 across a product organisation that processes data at meaningful scale. You'll work directly with Engineering, IT, Legal, Product, and external auditors.</p><p><strong>What you will do</strong></p><ul><li><p><strong>Certifications &amp; external audits</strong></p></li><li><p>Own the certification and surveillance cycle for <strong>ISO 27001:2022</strong> and <strong>SOC 2 Type II</strong>; act as the single point of contact for external auditors.</p></li><li><p>Plan and execute readiness assessments, gap closure, evidence collection, control walkthroughs, and management responses.</p></li><li><p>Maintain audit calendars, evidence repositories, and bridge letters between audit windows.</p></li><li><p>Drive <strong>PCI DSS v4.0.1</strong> scope-reduction and assessment activities for in-scope environments.</p></li><p><strong>ISMS, policies &amp; frameworks</strong></p><li><p>Maintain Meesho's ISMS aligned to ISO 27001:2022 - all 93 Annex A controls mapped across Organizational, People, Physical and Technological themes, with named owners and live evidence.</p></li><li><p>Author, review, version-control and socialise security policies, standards, and procedures.</p></li><li><p>Map controls across frameworks: <strong>ISO 27001:2022, SOC 2 TSC, PCI DSS v4.0.1, NIST CSF 2.0, CIS Controls v8, DPDP</strong>.</p></li><p><strong>ITGC &amp; internal audits</strong></p><li><p>Design, test and continuously improve <strong>IT General Controls</strong>: access management, change management, IT operations, and SDLC.</p></li><li><p>Plan and execute internal audits; track findings to closure with engineering and IT.</p></li><li><p>Build and maintain the enterprise risk register; run <strong>RCSA</strong>, define KRIs, drive risk treatment plans and residual-risk acceptance with leadership.</p></li><p><strong>Third-Party Risk Management (TPRM)</strong></p><li><p>Run the full vendor lifecycle: intake → tiering → security due diligence (SIG / CAIQ / SOC 2 / ISO reviews) → contractual controls → continuous monitoring → offboarding.</p></li><li><p>Partner with Legal and Procurement to embed security clauses in MSAs, DPAs, and sub-processor agreements.</p></li><li><p>Conduct on-site / virtual vendor audits for tier-1 vendors and report to the security council.</p></li><p><strong>Privacy &amp; data protection</strong></p><li><p>Operationalise the <strong>DPDP Act 2023 + DPDP Rules 2025</strong> across the business: DPIAs, consent and notice flows, data-principal rights, 72-hour breach notification, and Records of Processing Activity.</p></li><li><p>Prepare Meesho for likely <strong>Significant Data Fiduciary (SDF)</strong> obligations: independent data-auditor coordination, DPO interfacing, algorithmic transparency, and children's-data safeguards.</p></li><li><p>Track IT Act, CERT-In directions, and sector-specific guidelines as relevant.</p></li><p><strong>Business continuity</strong></p><li><p>Maintain BCP and DR aligned to <strong>ISO 22301</strong> - BIAs, RTO/RPO definitions, and annual DR / failover testing.</p></li><p><strong>Awareness &amp; culture</strong></p><li><p>Run organisation-wide security and privacy awareness: onboarding, refreshers, phishing simulations, and role-based modules.</p></li><p><strong>Partner &amp; customer trust</strong></p><li><p>Respond to seller, partner and enterprise security questionnaires; maintain the Trust Center and security collateral.</p></li></ul><p><strong>What you will need</strong></p><ul><p>&nbsp;</p><li><p>4–6 years in security compliance, IT audit, or GRC at a <strong>product company</strong> (SaaS, fintech, e-commerce, payments, consumer internet).</p></li><li><p>Hands-on experience driving <strong>ISO 27001:2022</strong> end-to-end: gap → implementation → certification → surveillance.</p></li><li><p>Hands-on experience driving <strong>SOC 2 Type II</strong> end-to-end, including auditor management.</p></li><li><p>Strong <strong>ITGC</strong> experience: access, change, ops, and SDLC control design and testing.</p></li><li><p>Strong <strong>TPRM</strong> experience across the full vendor lifecycle.</p></li><li><p>Working knowledge of <strong>cloud (AWS and/or GCP)</strong> - shared-responsibility model, CIS benchmarks, native services for evidence (AWS Config, GCP SCC, CloudTrail, IAM Analyzer).</p></li><li><p>Demonstrated stakeholder management with Engineering, IT, Legal, Product, and external auditors.</p></li><li><p>Excellent written communication - you'll author policies, audit responses, and risk reports read by senior leadership.</p></li><p><strong>Nice to have</strong></p><li><p>DPDP Act 2023 / DPDP Rules 2025 implementation experience; familiarity with GDPR or ISO 27701.</p></li><li><p>Hands-on with a GRC platform: <strong>Sprinto, Vanta, Drata, OneTrust, AuditBoard, MetricStream, ServiceNow GRC, or Archer</strong>.</p></li><li><p>ISO 22301 BCMS experience.</p></li><li><p>Exposure to RBI / SEBI / IRDAI sectoral compliance.</p></li><li><p>PCI DSS v4.0.1 experience.</p></li><p><strong>Certifications</strong></p><li><p>ISO 27001:2022 <strong>Lead Auditor / Lead Implementer</strong></p></li><li><p><strong>CISA</strong></p></li><li><p><strong>CIPP/E or DCPP</strong> (privacy)</p></li></ul>
`.trim(),
        location: "Bangalore, Karnataka",
        department: "Infrastructure",
        jobType: "FULL_TIME",
        remotePolicy: "ONSITE",
        stipend: "Not specified",
        duration: "Permanent",
        applyUrl: "https://jobs.lever.co/meesho/80ab7795-de6b-4dfe-9a66-a8ad5e7b8a83",
      },
      {
        slug: "meesho-software-architect-supply",
        title: "Software Architect - Supply",
        description: `
<strong>About the team</strong> When 14%+ of Indian households shop with us, it’s important to build resilient systems to manage millions of orders every day. We’ve done this – with zero downtime! 😎 Sounds impossible? Well, that’s the kind of Engineering muscle that has helped Meesho become the e-commerce giant that it is today. We value speed over perfection, and see failures as opportunities to become better. We’ve taken steps to inculcate a strong ‘Founder’s Mindset’ across our engineering teams, making us grow and move fast. We know how to party as hard as we work! If we aren’t building unparalleled tech solutions, you can find us debating the plot points of our favourite books and games – or even gossipping over chai. So, if a day filled with building impactful solutions with a fun team sounds appealing to you, join us. <strong>Tech Culture</strong> We have a unique tech culture where engineers are seen as problem solvers. The engineering org is divided into multiple pods and each pod is aligned to a particular business theme. It is a culture driven by logical debates & arguments rather than authority. At Meesho, you get to solve hard technical problems at scale as well as have a significant impact on the lives of millions of users and entrepreneurs. You are expected to contribute to the solutioning of product problems as well as challenge existing solutions. <strong>Our tech stack reflects the diverse requirements of our company:</strong> ● Backend: Java, Spring, MySQL, Go, Hbase,Redis, Kafka, Spark, Elastic-Search, Airflow, Presto, Redis, Dragonfly ● Mobile: Swift, Kotlin, RxJava, Dagger, MVVM with Data Binding, Mesh Design Library ● Web: ReactJS, Redux, NodeJS, Typescript ● Automation: RestAssured, Appium, Java, Jenkins, CircleCI ● Infrastructure: AWS, GCP <strong>About the role</strong> In the Fulfilment org, we are building systems at scale that determine product serviceability, predict delivery timelines for each Meesho package and building India's most reliable logistics service by leveraging our deep tech expertise. This space requires deep research, graph algorithms and high-scale systems to model our real world network and drive efficiency as well as re-route packages when node or transport services are disrupted. We place special emphasis on the continuous growth of each engineer. As Architect, you will have a special role to play in technical mentorship and influence over a large number of engineers and helping them learn to make sound technical decisions team member - and we do this with regular 1-1s and open communication. As an Architect, you will be part of self-starters who thrive on teamwork and constructive feedback. A typical day in your role would involve thinking about long term evolution of our systems, building in flexibility to support future use cases, reviewing design documents from various engineers. You'll be debugging hard technical problems, making tradeoffs on how to solve for now, while incorporating and kicking off long-term solutions. You'll help unblock junior engineers, lead exploration of new technologies and work with other architects in the company to ensure across the board we're building top-notch tech.<p><strong>What you will do</strong></p><ul><li>Design and architect highly scalable systems delivering best in class performance and service robustness</li><li>Collaborate with teams to develop and support the smooth 24x7 operation of our service</li><li>Create prototypes and proofs-of-concept for iterative development&nbsp;</li><li>Take complete ownership of projects and their development cycle</li><li>Drive internal and external activities to build Meesho’s tech brand and attract top tech talent</li><li>Design, participate and constantly improve our hiring process for engineering roles</li><li>Lead complex projects and collaborate across teams</li><li>Constantly explore ways to improve our systems and drive implementation</li></ul><p><strong>What you will need</strong></p><ul><li>Bachelors / Masters in Computer Science with at least 8 years of professional experience.</li><li>Exceptional design and architectural skills; experience in building large scale distributed systems</li><li>Experience in low latency and scalable systems (B2C)</li><li>Expertise in Java/J2EE and multithreading</li><li>Deep understanding of transactional and NoSQL DBs</li><li>Deep understanding of messaging systems like Kafka</li><li>Good experience on cloud infrastructure preferably AWS</li><li>Good to have: Data pipelines, Spark</li><li>Ability to think and analyze both breadth-wise and depth-wise while designing and implementing services</li><li>Excellent teamwork skills, flexibility, and ability to handle multiple tasks</li></ul>
`.trim(),
        location: "Bangalore, Karnataka",
        department: "Supply & Fulfilment",
        jobType: "FULL_TIME",
        remotePolicy: "ONSITE",
        stipend: "Not specified",
        duration: "Permanent",
        applyUrl: "https://jobs.lever.co/meesho/be6609b0-539b-41c4-aa79-d2cc0916d3d8",
      },
      {
        slug: "meesho-engineering-manager-backend",
        title: "Engineering Manager -Backend",
        description: `
<strong>About Meesho </strong><strong>Mission and Vision </strong> Meesho is India’s fastest-growing internet commerce company, driven by the mission to democratize internet commerce for everyone (DICE). Our vision is to enable 100 million small businesses and entrepreneurs in India to succeed online, making online commerce accessible to all. This core purpose guides us in empowering sellers across the country and bringing a diverse range of products to first-time internet shoppers. By leveraging technology and a unique zero commission model, Meesho has opened the doors of e-commerce to millions who were previously underserved. <strong>Technological Scale & Innovation</strong><strong></strong>At Meesho, technology is at the heart of our success. We have invested in a scalable infrastructure and innovative solutions to meet the demands of a vast user base and complex marketplace. Some key highlights include: <strong>Massive Scale: </strong>Our backend systems handle millions of orders per day from across India, reaching about 5% of all Indian households, all with near-zero downtime to date. Achieving this level of reliability and performance in a hyper-growth environment is a testament to our engineering excellence. <strong>Marketplace Reach</strong>: Over 1.75 million sellers are registered on Meesho’s platform, supported by our state-of-the-art tech infrastructure and pan-India logistics network. This wide reach — covering virtually every serviceable pin code in the country — presents unique engineering challenges in areas like search, personalization, and payments at scale. <strong>Scalable Architecture: </strong>We continually innovate our architecture for growth.. Our quest to serve a billion Indian users has helped us evolve our technologies from a monolith to microservices to now a high scale federated architecture. This evolution allows us to build and deploy features rapidly while maintaining stability for a fast-growing user base. <strong>Cutting-edge Tech Stack: </strong>Our platform is built using modern, open-source technologies on the cloud while ensuring high efficiency. We strategically choose proven tools (for example, Java and Golang for services, Kafka for messaging, Dragonfly and Redis for caching, ScyllaDB, MySQL and Mongo for Data) and leverage GCP infrastructure to ensure high performance, reliability, and flexibility. By focusing on the right tools for the right problems, we innovate pragmatically rather than chasing every new tech hype, which helps us solve real-world problems effectively. <strong>Engineering Culture & Challenges </strong> Engineering at Meesho is driven by a bold and inclusive culture that values innovation, ownership, and continuous improvement. We believe that building great products goes hand-in-hand with building a great team. Key aspects of our engineering culture include: <strong>Long Term Thinking</strong>: We believe in thinking for tomorrow while building for today, this approach has helped us not only to handle and evolve for scale but also focus on extensibility and stability by investing in the platform <strong>Lightspeed:</strong> We prioritize rapid iteration and delivery. Engineers are encouraged to ship fast and refine continuously, as we value in order to learn and adapt quickly. <strong>Continuous Improvement</strong>: We view failures and bugs as opportunities to improve. A blameless post-mortem culture ensures that mistakes become lessons, fostering an environment where learning from failure drives resilience and innovation. <strong> Ownership Mindset:</strong> Every engineer is empowered to act like an owner. We instill a “Founder’s Mindset,” encouraging engineers to take end-to-end ownership of projects and drive them with an entrepreneurial spirit. This means our teams proactively identify problems and champion solutions, just as a founder would for their own product. Engineering at Meesho is more than just writing code – it's about solving complex, impactful problems at an unprecedented scale. Our engineers tackle challenging use cases (from enabling real-time logistics across India to optimizing a vast product catalog for the next billion users), making a tangible impact on millions of entrepreneurs and customers. We maintain a professional, yet passionate work environment where the drive to innovate is balanced with a pragmatic approach to problem-solving. <strong>About the Role</strong> We are looking for Engineering Manager well-versed with emerging technologies to join our team. As an Engineering Manager, you will ensure consistency and quality by shaping the right strategies. You will keep an eye on all engineering projects and ensure all duties are fulfilled . You will analyse other employees’ tasks and carry on collaborations effectively. You will also transform newbies into experts and build reports on the progress of all projects.<p><strong>What you will do</strong></p><ul><li>Design tasks for other engineers as per Meesho’s guidelines</li><li>Perform regular performance evaluation and share and seek feedback</li><li>Keep a closer look on various projects and monitor the progress</li><li>Carry on smooth collaborations with the sales team and design teams to innovate on new products</li><li>Manage engineers and take ownership of the project while ensuring product scalability</li><li>Conduct regular meetings to plan and develop reports on the progress of projects&nbsp;</li></ul><p><strong> What you will need</strong></p><ul><li>Bachelor's/Master’s in computer science</li><li>At least 7+ years professional experience</li><li>At least 2 years of experience in managing software development teams</li><li>Able to drive sprints and OKRs</li><li>Deep understanding of transactional and NoSQL DBs</li><li>Deep understanding of Messaging systems – Kafka</li><li>Good experience on cloud infrastructure - AWS/GCS</li><li>Good to have: Data pipelines, ES</li><li>Exceptional team managing skills; experience in building large scale distributed Systems</li><li>Experience in Scalable Systems</li><li>Expertise in Java/Python and multithreading&nbsp;</li></ul>
`.trim(),
        location: "Bangalore, Karnataka",
        department: "Supply & Fulfilment",
        jobType: "FULL_TIME",
        remotePolicy: "ONSITE",
        stipend: "Not specified",
        duration: "Permanent",
        applyUrl: "https://jobs.lever.co/meesho/cb16706c-296f-4567-a41f-86206a54ee29",
      },
      {
        slug: "meesho-security-architect-ai-powered-security-engineering",
        title: "Security Architect - AI-Powered Security Engineering",
        description: `
<h2><strong>Security Architect - AI-Powered Security EngineeringAbout the Team</strong></h2><p>The security team at Meesho is like the Avengers to Meesho's S.H.I.E.L.D. When 5% of Indian households shop with us, it’s important to build resilient systems to manage millions of orders every day. We’ve done this, with zero downtime! We value speed over perfection, and see failures as opportunities to become better. By 2030, Meesho will be the world’s most trusted and secure digital ecosystem, operating on an AI-native, Zero-Trust, self-healing architecture. As we shift toward an era where autonomous agents generate and deploy code, we want to ensure our security scales seamlessly with engineering velocity. We place special emphasis on the continuous growth of each team member, fostering a strong 'Founder’s Mindset' that helps us move fast.</p><h2><strong>About the Role</strong></h2><p>We are looking for a highly technical, hands-on Security Architect (Individual Contributor) to guide and lead our AI-Powered Security Engineering charter. In this role, you will bridge the gap between conventional DevSecOps, infrastructure security, and the rapidly evolving landscape of AI. You will optimize our AI-driven Software Development Lifecycle (SDLC) by designing secure-by-default guardrails for both human developers and AI coding agents. Your mission is to ensure near-zero vulnerabilities from application and data security failures reach production. A significant portion of your focus will involve advanced Red Teaming, utilizing LLMs to improve Meesho's security posture, and architecting defenses for our autonomous AI systems against prompt injection, data leakage, and jailbreaking attacks.</p><p><strong>What You Will Do</strong></p><ul><h2>&nbsp;</h2><ul><li><p><strong>Lead AI Security Architecture:</strong> Drive the technical roadmap and high-level design to continuously prevent, detect, and autonomously contain threats across our systems and AI agents.</p></li><li><p><strong>Hands-on Prototyping &amp; POCs:</strong> Build proof-of-concepts for autonomous agent harnesses that automatically detect, analyze, and mitigate security vulnerabilities in real-time.</p></li><li><p><strong>AI SDLC Optimization:</strong> Architect non-bypassable security guardrails across the SDLC for both developers and AI coding agents to ensure production systems are secured by default.</p></li><li><p><strong>Red Teaming &amp; Adversarial Validation:</strong> Proactively execute adversarial testing by simulating real attack scenarios across APIs, AI systems, and infrastructure to validate defense mechanisms.</p></li><li><p><strong>Protect AI Systems:</strong> Design deep technical defenses to protect all AI agents and experimental features from prompt injection, system misuse, manipulation, and unauthorized actions.</p></li><li><p><strong>Zero-Trust Governance:</strong> Architect a Zero Trust Identity Control Plane that eliminates implicit trust, ensuring access for both humans and autonomous agents is time-bound, least-privileged, and continuously verified.</p></li><li><p><strong>Technical Leadership &amp; Influence:</strong> Act as a security expert and IC leader. Mentor security engineers, provide architectural guidance across the organization, and partner closely with ML, DevOps, and Platform teams to evangelize secure coding practices without direct reporting lines.</p></li></ul></ul><p><strong>What You Will Need</strong></p><ul><h2>&nbsp;</h2><ul><li><p><strong>Experience:</strong> 10+ years of hands-on technical experience across different areas of security, including infrastructure security, product security, system design, and DevSecOps.</p></li><li><p><strong>AI/ML Security Expertise:</strong> Proven track record of leveraging coding agents and LLMs for security workflows, Red Teaming GenAI models, and building defenses against jailbreaking, adversarial ML, and model hallucination risks.</p></li><li><p><strong>DevSecOps &amp; Cloud Mastery:</strong> Deep technical proficiency with cloud platforms like AWS or GCP, including their security tools, Docker, and containerization technologies.</p></li><li><p><strong>Technical Proficiency:</strong> Proficiency in programming languages such as Java, Node.js, and Python, combined with hands-on experience securing production code, developing security tooling, and performing manual source code reviews.</p></li><li><p><strong>Strategic Vision &amp; Threat Modeling:</strong> Ability to architect secure-by-default platform capabilities so all services inherit baseline security automatically, paired with advanced threat modeling skills for AI-native and distributed architectures.</p></li><h2><strong>Bonus Points</strong></h2><ul><li><p>Relevant certifications such as GIAC Web Application Penetration Tester (GWAPT) or OffSec’s Advanced Web Attacks and Exploitation (WEB-300).</p></li><li><p>Strong understanding of emerging AI security frameworks (e.g., MITRE ATLAS, NIST AI RMF).</p></li><li><p>Experience participating in bug bounty programs or speaking at meetups/conferences.</p></li><li><p>Developing Security products and frameworks.</p></li></ul></ul></ul>
`.trim(),
        location: "Bangalore, Karnataka",
        department: "Infrastructure",
        jobType: "FULL_TIME",
        remotePolicy: "ONSITE",
        stipend: "Not specified",
        duration: "Permanent",
        applyUrl: "https://jobs.lever.co/meesho/f2de8c5f-1636-428d-aaea-af1400142975",
      },
      {
        slug: "meesho-security-engineer-iv",
        title: "Security Engineer IV",
        description: `
<strong>About the Team</strong> The security team at Meesho is like the Avengers to Meesho's S.H.I.E.L.D. After all, when 5% of Indian households shop with us, it’s important to build resilient systems to manage millions of orders every day. We’ve done this – with zero downtime! 😎 Sounds impossible? Well, that’s the kind of Engineering muscle that has helped Meesho become the e-commerce giant it is today. We value speed over perfection, and see failures as opportunities to become better. We’ve taken steps to inculcate a strong ‘Founder’s Mindset’ across our engineering teams, making us grow and move fast. We place special emphasis on the continuous growth of each team member - and we do this with regular 1-1s and open communication. As a Security Engineer, you will be part of self-starters who thrive on teamwork and constructive feedback. We know how to party as hard as we work! If we aren’t building unparalleled tech solutions, you can find us debating the plot points of our favorite books and games – or even gossiping over chai. So, if a day filled with building impactful solutions with a fun team sounds appealing to you, join us. <strong>About the Role</strong> As a Security Engineer 4, your role is integral in ensuring the security of our products throughout their development lifecycle. You will be involved from the very beginning, participating in threat modeling and design reviews to identify potential risks early. You'll also integrate and manage SAST tools within our CI/CD pipeline, ensuring continuous security testing as code evolves. Additionally, you'll lead and conduct vulnerability assessments and penetration testing (VAPT) to proactively uncover and address security vulnerabilities before they reach production. <p><strong>What you will do</strong></p><ul><li>Lead and manage all aspects of the Secure Software Development Lifecycle (SDLC).</li><li>Implement and manage security tools within the CI/CD pipeline (DevSecOps).</li><li>Conduct and oversee VAPT for web applications, APIs, iOS, and Android apps.</li><li>Perform threat modeling, design, and architecture reviews to identify potential risks.</li><li>Execute manual source code reviews and enhance security in production environments.</li><li>Manage and optimize a self-managed bug bounty program.</li><li>Provide security architectural guidance to Engineering and IT teams.</li><li>Manage issues identified from penetration tests and bug bounty programs.</li><li>Lead security training and awareness campaigns across the organization.</li><li>Manage Web Application Firewalls (WAF) to ensure robust protection.</li><li>Engage in the Security Champions program to integrate security practices within teams.</li><li>Assist in creating and maintaining Security Risk Models for both new and existing systems.</li></ul><p><strong>What you will need</strong></p><ul><li>7+ years of experience in product security, with a focus on application security and Dev SecOps.</li><li>Proven experience in leading architectural changes or cross-team efforts to mitigate security vulnerabilities.</li><li>Proficiency in programming languages such as Java, React, Node.js, and Python.</li><li>Hands-on experience with manual source code reviews and securing production code.</li><li>Expertise in deploying and managing security tools in CI/CD pipelines.</li><li>Experience with Git, Jenkins, Artifactory, or other similar technologies.</li><li>Strong background in securing the software development lifecycle, including eliminating classes of vulnerabilities.</li><li>Proficiency with cloud platforms like AWS or GCP, including their security tools.</li><li>Experience with Docker and containerization technologies is highly desirable.</li><li>Additional experience in infrastructure security, particularly in GCP, Docker, and containerization, is a bonus.</li></ul><p><strong>Bonus Points</strong></p><ul><li>Relevant certifications such as GIAC Web Application Penetration Tester (GWAPT), OffSec’s Advanced Web Attacks and Exploitation (WEB-300), etc.</li><li>Strong understanding of SSO protocols, including OAuth and SAML.</li><li>Experience speaking at meetups or conferences.</li><li>Experience participating in bug bounty programs.</li></ul>
`.trim(),
        location: "Bangalore, Karnataka",
        department: "Infrastructure",
        jobType: "FULL_TIME",
        remotePolicy: "ONSITE",
        stipend: "Not specified",
        duration: "Permanent",
        applyUrl: "https://jobs.lever.co/meesho/f4e2e8e1-6863-4fe0-85fb-7840189cad3f",
      },
      {
        slug: "meesho-engineering-manager-data-platform",
        title: "Engineering Manager- Data Platform",
        description: `
<strong>About the Role</strong> We are looking for a seasoned Engineering Manager to lead our Data Platform. You will own the architecture and evolution of a Petabyte-scale Data Lakehouse and a Self-serve Analytics Platform, enabling real-time decision-making across the organization. In this role, you will drive consistency and quality by defining the right engineering strategies. You will oversee multiple engineering projects, ensure timely execution, collaborate across functions, and mentor engineers to grow into high-performing contributors. <p><strong>What You Will Do</strong></p><ul><li>Drive technical roadmap and architecture for driving efficiency across the platform along with automated data governance.</li><li>Define and monitor SLOs/SLAs for data availability, latency, and quality across real-time and batch pipelines.</li><li>Drive excellence in engineering quality and lead solutioning for complex product problems</li><li>Collaborate with Analytics, Data Science and Product teams to drive adoption of the Self-Serve Platform and reduce time to high quality insights.</li><li>Champion robust data security standards, including RBAC, PII masking, and encryption, to ensure DPDP compliance in a democratized data environment.</li><li>Manage engineers end-to-end, taking ownership of project delivery and product scalability</li><li>Conduct regular planning, review, and retrospective meetings</li><li>Create and present progress reports for ongoing projects and initiatives</li></ul><p><strong>What You Will Need</strong></p><ul><li>Bachelor’s or Master’s degree in Computer Science or a related field</li><li>8+ years of overall professional experience</li><li>2+ years of experience managing software development teams</li><li>Experience managing a high-performing team of engineers with varying seniority.</li><li>Proven ability to develop and implement distributed systems and platforms at scale.</li><li>Expertise in Scala, Java, Python, or Go</li><li>Proficiency in Apache Spark and its core architecture, including platform-based optimization on Spark batch and streaming workloads.</li><li>Deep experience with Open Table Formats like Delta Lake, Apache Iceberg or Apache Hudi.</li><li>Deep understanding of transactional and NoSQL databases</li><li>Knowledge of messaging systems, especially Kafka</li><li>Hands-on experience with cloud infrastructure, preferably GCP/AWS</li><li>Good understanding of streaming and real-time data pipelines</li><li>Expertise in data modeling, data quality, and utilizing data validation tools is essential.</li><li>Proficiency in Business Intelligence (BI) tools, including but not limited to Tableau, Metabase, and Superset.</li><li>Proficiency in Real-time OLAP engines (Apache Pinot, Apache Druid, or ClickHouse) and Stream Processing (Apache Flink or Spark Streaming).</li></ul><p><strong>Good to Have</strong></p><ul><li>Experience managing infrastructure utilizing Kubernetes and Helm.</li><li>Understanding of workflow orchestration utilizing Apache Airflow etc.</li><li>Experience designing dynamic DAGs, managing backfills, and optimizing scheduler performance at scale.</li><li>Experience managing infrastructure components utilizing Kubernetes and Helm.</li><li>Experience implementing centralized data access control layers (e.g., Apache Ranger) and auditing frameworks</li></ul><p><strong>Leadership & Collaboration</strong></p><ul><li>Ability to drive sprints and OKRs effectively.</li><li>Strong stakeholder management and cross-functional collaboration skills.</li><li>Exceptional people management and mentorship capabilities.</li></ul><p><strong>Why Join Meesho</strong></p><ul><li>Work on data systems at massive scale impacting millions of users</li><li>Own and influence core data infrastructure powering one of India’s fastest-growing platforms</li><li>Collaborate with smart, driven engineers and leaders in a high-ownership culture</li><li>Opportunity to shape technology, people, and processes in a rapidly evolving ecosystem</li></ul>
`.trim(),
        location: "Bangalore, Karnataka",
        department: "Data Engineering",
        jobType: "FULL_TIME",
        remotePolicy: "ONSITE",
        stipend: "Not specified",
        duration: "Permanent",
        applyUrl: "https://jobs.lever.co/meesho/fc6d0443-48a8-4535-9d2b-5f9b32a136e3",
      },
      {
        slug: "meesho-engineering-manager-infrastructure-platform",
        title: "Engineering Manager- Infrastructure platform",
        description: `
<strong>About Meesho</strong><strong>Mission and Vision</strong> Meesho is India’s fastest-growing internet commerce company, driven by the mission todemocratize e-commerce for everyone. Our vision is to enable 100 million small businessesand entrepreneurs in India to succeed online, making online commerce accessible to all. Thiscore purpose guides us in empowering sellers across the country and bringing a diverse rangeof products to first-time internet shoppers. By leveraging technology and a uniquesocial-commerce model, Meesho has opened the doors of e-commerce to millions who werepreviously underserved. <strong>Technological Scale & Innovation</strong> At Meesho, technology is at the heart of our success. We have invested in a scalableinfrastructure and innovative solutions to meet the demands of a vast user base and complexmarketplace. Some key highlights include: ● <strong>Massive Scale:</strong> Our backend systems handle millions of orders per day from acrossIndia, reaching about 5% of all Indian households, all with near-zero downtime to <a rel="noopener noreferrer" href="http://date.Achieving">date.Achieving</a> this level of reliability and performance in a hyper-growth environment is atestament to our engineering excellence. ● <strong>Scale converted to Infrastructure:</strong> Our production systems in its peak handle a cumulative 14 M RPS, powered by over 1000+ microservices spawning over 450K cores running on public cloud. Every service is containerised and runs on multiple Kubernetes clusters with inter and intra cluster traffic doing pod-to-pod direct communication. ● <strong>Marketplace Reach:</strong> Over <a rel="noopener noreferrer" href="http://1.75">1.75</a> million sellers are registered on Meesho’s platform,supported by our state-of-the-art tech infrastructure and pan-India logistics <a rel="noopener noreferrer" href="http://network.This">network.This</a> wide reach — covering virtually every serviceable pin code in the country —presents unique engineering challenges in areas like search, personalization, andpayments at scale. ● <strong>Scalable Architecture: </strong>We continually innovate our architecture for growth. Meeshobegan with a monolithic codebase but quickly evolved to a microservices-drivenarchitecture, re-architecting critical systems to seamlessly handle current and futurescale. This evolution allows us to build and deploy features rapidly while maintainingstability for a fast-growing user base. ● <strong>Cutting-edge Tech Stack</strong>: Our platform is built using modern, open-source technologieson the cloud. We strategically choose proven tools (example, Kubernetes for containerisation, Java and Golang forservices, Kafka, Redis, ScyllaDB, mysql etc) and leverage GCP cloudinfrastructure to ensure high performance, reliability, and flexibility. By focusing on theright tools for the right problems, we innovate pragmatically rather than chasing everynew tech hype, which helps us solve real-world problems effectively. <strong>Engineering Culture & Challenges</strong> Engineering at Meesho is driven by a bold and inclusive culture that values innovation,ownership, and continuous improvement. We believe that building great products goeshand-in-hand with building a great team. Key aspects of our engineering cultureinclude: ●<strong> Speed Over Perfection</strong>: We prioritize rapid iteration and delivery. Engineers areencouraged to ship fast and refine continuously, as we value speed over perfection inorder to learn and adapt quickly. ● <strong>Continuous Improvement:</strong> We view failures and bugs as opportunities to improve. Ablameless post-mortem culture ensures that mistakes become lessons, fostering anenvironment where learning from failure drives resilience and innovation. ● <strong>Ownership Mindset: </strong>Every engineer is empowered to act like an owner. We instill a“Founder’s Mindset,” encouraging engineers to take end-to-end ownership of projectsand drive them with an entrepreneurial spirit. This means our teams proactively identifyproblems and champion solutions, just as a founder would for their own product. Engineering at Meesho is more than just writing code – it's about solving complex, impactfulproblems at an unprecedented scale. Our engineers tackle challenging use cases (from enabling real-time logistics across India to optimizing a vast product catalog for the next billionusers), making a tangible impact on millions of entrepreneurs and customers. We maintain aprofessional, yet passionate work environment where the drive to innovate is balanced with apragmatic approach to problem-solving. <strong>About the role</strong> We are looking for an technically driven Engineering Manager well-versed with emerging technologies to join our team.As an Engineering Manager, you will ensure consistency and quality by shaping the rightstrategies. You will keep an eye on all engineering projects and ensure all duties are fulfilled. You will analyse other employees’ tasks and carry on collaborations effectively. You will also transform newbies into experts and build reports on the progress of all projects.<p><strong>What you will do</strong></p><ul><li>Own Meesho’s compute and network Platform</li><li>Perform regular performance evaluations and share and seek feedback with the team members</li><li>Conduct regular meetings to plan and develop reports on project progress</li><li>Collaborate with the product-engineering and architect counterparts to innovate on new features on platform</li><li>Manage engineers and take ownership of projects while ensuring product scalability</li><li>Own and maintain the uptime of Meesho tech systems</li></ul><p><strong>What you will need</strong></p><ul><li>Bachelor’s or Master’s degree in Computer Science</li><li>At least 9+ years of professional experience</li><li>Minimum 2 years of experience managing (around 10 member) software development teams</li><li>Ability to drive projects in accordance with OKRs</li><li>Exceptional team management skills and experience in running large complex projects with clear articulation to leadership</li><li>Experience in handling and leading teams across any of SRE/AIOps and Platform&nbsp;</li><li>Deep understanding of containerisation and Automation of infrastructure(Kubernetes, Terraform)</li><li>Good understanding of programming languages(Python or GO)</li><li>Strong expertise in handling at scale infrastructure with high stability, uptime, and cost effectiveness</li><li>Deep expertise in building scalable platforms, on cloud or on-prem</li><li>Preferably to have experience on public clouds like GCP or AWS</li></ul>
`.trim(),
        location: "Bangalore, Karnataka",
        department: "Infrastructure",
        jobType: "FULL_TIME",
        remotePolicy: "ONSITE",
        stipend: "Not specified",
        duration: "Permanent",
        applyUrl: "https://jobs.lever.co/meesho/fcebd937-47fd-4efe-b1de-1ad8ba571e32",
      },
    ],
  },
  {
    slug: "superside",
    name: "Superside",
    tagline: "AI-powered creative partner for enterprise teams",
    about:
      "Superside (formerly Konsus) is a YC-backed, always-on design company co-founded by Fredrik Thomassen and Jing Kjeldsen, pairing AI tools with a global network of vetted creative talent to deliver design, video, and marketing creative for enterprise teams like Amazon and Meta. Remote-first with employees across 60+ countries, Superside has raised $33.5M from investors including Y Combinator, Freestyle, and Slack Fund.",
    logoUrl: "https://cdn.sanity.io/images/k0dlbavy/production/790d16cce09755bcd60b3ad8ed511ba85bf72937-48x48.svg",
    fundingStage: "SERIES_B",
    remotePolicy: "REMOTE",
    visaSponsorship: false,
    employeeCountRange: "201-500",
    websiteUrl: "https://www.superside.com",
    categories: ["saas", "ai-ml"],
    technologies: [],
    location: { city: "Wilmington", country: "USA" },
    founders: [
      {
        name: "Fredrik Thomassen",
        title: "Co-founder & CEO",
        linkedinUrl: "https://no.linkedin.com/in/fredrikthomassen",
      },
      { name: "Jing Kjeldsen", title: "Co-founder" },
      { name: "Haakon Heir", title: "Co-founder & COO" },
    ],
    links: [],
    internships: [
      {
        slug: "superside-staff-product-manager",
        title: "Staff Product Manager",
        description: `
<p>Superside seeks a Staff Product Manager to oversee Superspace, its main platform serving customers and internal creative teams. The role involves leading Superside's largest product pod and shaping the future of how customers, creatives, and AI work together.</p>
<p><strong>Key Responsibilities</strong></p>
<ul>
<li>Own product strategy and execution for Superspace while balancing customer value, business impact, and operational efficiency.</li>
<li>Lead cross-functional teams including designers and engineers.</li>
<li>Partner with Operations and Services to enhance workflows.</li>
<li>Define Superspace's approach for multiple user segments.</li>
<li>Create cohesive experiences across product teams.</li>
<li>Build AI-native workflows integrating human expertise and AI agents.</li>
<li>Establish prioritization frameworks.</li>
<li>Prototype and validate product concepts.</li>
<li>Drive adoption and engagement metrics.</li>
<li>Influence strategy alongside senior leadership.</li>
</ul>
<p><strong>Required Qualifications</strong></p>
<ul>
<li>8+ years in product management; 4+ years at Senior or Staff level.</li>
<li>Complex B2B, platform, marketplace, or AI product experience.</li>
<li>Demonstrated ability delivering measurable business outcomes.</li>
<li>Deep curiosity about AI and hands-on experience working with AI-powered products.</li>
<li>Multi-stakeholder management capabilities.</li>
<li>Technical acumen discussing architecture and implementation trade-offs.</li>
<li>Data-driven decision-making experience.</li>
</ul>
`.trim(),
        location: "Remote",
        department: "Product",
        jobType: "FULL_TIME",
        remotePolicy: "REMOTE",
        stipend: "Not specified",
        duration: "Permanent",
        applyUrl: "https://careers.superside.com/jobs/staff-product-manager",
      },
    ],
  },
  {
    slug: "floy",
    name: "Floy",
    tagline: "AI second opinion for radiologists",
    about:
      "Floy GmbH is a Munich-based health-tech company founded in 2021 by Benedikt Schneider and Leander Maerkisch, developing AI software that analyzes CT and MRI scans as a second opinion for radiologists, detecting incidental findings and hard-to-see abnormalities. Floy has raised roughly €9M from investors including HV Capital, All Iron Ventures, and 10x Founders.",
    logoUrl: "https://cdn.prod.website-files.com/66f7b48c0855a2b7dbf4f206/698db765d122fb099ee7b3fe_scarlet_logo_rgb_charcoal.svg",
    fundingStage: "SEED",
    remotePolicy: "REMOTE",
    visaSponsorship: false,
    employeeCountRange: "11-50",
    websiteUrl: "https://www.floy.com",
    categories: ["healthtech", "ai-ml"],
    technologies: ["react", "react-native", "typescript", "nodejs", "docker", "kubernetes"],
    location: { city: "Munich", country: "Germany" },
    founders: [
      {
        name: "Benedikt Schneider",
        title: "Co-founder & CEO",
        linkedinUrl: "https://de.linkedin.com/in/benediktschneider",
      },
      { name: "Leander Maerkisch", title: "Co-founder" },
    ],
    links: [],
    internships: [
      {
        slug: "floy-senior-full-stack-engineer-react",
        title: "(Senior) Full Stack Engineer (React)",
        description: `
<p><strong>Your mission</strong></p>
<p>We are seeking a highly skilled and experienced Software Engineer to join our team. Even the best of algorithms are worthless without excellent integration into practice. You drive the adoption of our deep learning models by building the surrounding user experience. Your role will be critical in building reliable, scalable, and accessible services directly impacting patients' lives.</p>
<p><strong>Your Responsibilities</strong></p>
<ul>
<li>Design, develop, and maintain full-stack web applications using React, React Native, and TypeScript on the front end and NestJS or similar technologies on the back end.</li>
<li>Write clean, scalable, and maintainable code with a strong emphasis on TypeScript best practices.</li>
<li>Architect and implement solutions to meet both functional and non-functional requirements, ensuring performance, scalability, and security.</li>
<li>Collaborate with product managers, designers, and other engineers.</li>
<li>Lead code reviews and mentor junior engineers to uphold high engineering standards.</li>
</ul>
<p><strong>What Are We Looking For?</strong></p>
<ul>
<li>A degree in a relevant scientific (Computer Science, Software Engineering) discipline or equivalent experience in a related field.</li>
<li>5+ years of professional experience in software development, with a focus on React and TypeScript.</li>
<li>Strong expertise in building and deploying scalable front-end architectures with modern frameworks and libraries.</li>
<li>Knowledge of database systems, both SQL and NoSQL.</li>
<li>Knowledge in Docker, Kubernetes, CI/CD pipelines, and the use of cloud platforms.</li>
<li>A keen eye for detail and a commitment to accuracy.</li>
<li>Excellent English skills.</li>
<li>Strong commitment to teamwork.</li>
</ul>
<p><strong>Good-to-have</strong></p>
<ul>
<li>Experience working with DICOM and/or in the radiology field.</li>
<li>Experience in computer graphics, especially WebGL, GLSL, Three.js.</li>
</ul>
<p><strong>Why Us</strong></p>
<p>Pioneer medical AI to maximize human health. Become part of an ambitious team valuing individuals, dedication and a joyful work experience. Solve novel challenges with life-saving implications. We accelerate your learning with rapid feedback, biweekly 1:1 sessions and inspiring problems. We give you autonomy, flexibility and the opportunity to connect with brilliant minds, plus a flexible remote team culture, company retreats and fair compensation.</p>
`.trim(),
        location: "Hamburg, Germany",
        department: "Engineering",
        jobType: "FULL_TIME",
        remotePolicy: "REMOTE",
        stipend: "Not specified",
        duration: "Permanent",
        applyUrl: "https://floy.jobs.personio.com/job/2606936",
      },
    ],
  },
  {
    slug: "ory",
    name: "Ory",
    tagline: "The leading open-source identity and access management ecosystem",
    about:
      "Ory Corp, founded in 2019 by Thomas Aidan Curran, Aeneas Rekkas, and Simon Kohl, is the leading open-source identity management, authentication, and authorization ecosystem, with more than 30,000 community members. Headquartered in Munich, Germany, Ory provides a modern, modular, cloud-agnostic, API-first approach to IAM that scales with unmatched UX and deployment flexibility. Ory has raised $27.5M in a Series A led by Insight Partners and Balderton Capital.",
    logoUrl: "https://www.ory.com/icon.svg",
    fundingStage: "SERIES_A",
    remotePolicy: "REMOTE",
    visaSponsorship: false,
    employeeCountRange: "51-200",
    websiteUrl: "https://www.ory.com",
    categories: ["infrastructure", "devtools"],
    technologies: ["go", "kubernetes", "rust"],
    location: { city: "Munich", country: "Germany" },
    founders: [
      {
        name: "Thomas Aidan Curran",
        title: "Founder & CEO",
        linkedinUrl: "https://www.linkedin.com/in/thomasaidancurran/",
      },
      {
        name: "Aeneas Rekkas",
        title: "Co-founder & CTO",
        linkedinUrl: "https://www.linkedin.com/in/aeneasr/",
      },
      { name: "Simon Kohl", title: "Co-founder" },
    ],
    links: [],
    internships: [
      {
        slug: "ory-software-engineer",
        title: "Software Engineer",
        description: `
<p>With more than 30,000 members, Ory is the leading open-source identity management, authentication, and authorization ecosystem and community in the world. Ory provides a modern and modular approach to IAM programs that scales, provides unmatched UX and deployment flexibility supporting enterprise deployments across the world.</p>
<p>This role is responsible for designing, engineering, testing, running, automating, and documenting Ory services in both closed and open source work.</p>
<p><strong>Key Tasks and Deliverables</strong></p>
<ul>
<li>Design, implement and maintain production code for Ory Network and Ory Open Source, that is well tested, follows security best practices and is easy-to-use.</li>
<li>Implement Identity and Access Management industry standards.</li>
<li>Implement proof of concepts for products and features.</li>
<li>Write documentation (internal &amp; external) for built features.</li>
<li>Collaborate with other teams on cross-platform and cross-application technical challenges.</li>
<li>Contribute to Ory's Open Source projects and the team's Software Development Life Cycle.</li>
<li>Devise innovative ideas for solving Ory Network customer problems and translate these ideas into technical designs.</li>
<li>Provide technical leadership and solve end-to-end problems — software design, efficient implementation, and product offering.</li>
<li>Participate in on-call rotations (shifts).</li>
</ul>
<p><strong>Minimum Requirements</strong></p>
<ul>
<li>5+ years of professional software development experience.</li>
<li>Experience with the Go programming language (must have). Experience with other languages such as Java, C/C++, C#, Rust, Kotlin, Python, or JavaScript is also welcome.</li>
<li>Experience architecting and developing solutions to ambiguous problems.</li>
<li>Experience working with Kubernetes and Cloud Provider products.</li>
<li>A Bachelor's degree in Computer Science or related technical field or equivalent practical experience.</li>
<li>Previous experience in Identity and Access Management is a plus.</li>
</ul>
<p><strong>Mindset:</strong> a desire to excel, act with courage, persevere, learn and innovate; alignment with Ory's core values (think big, move fast, passion &amp; excellence, innovation, customer centricity, respect); results-oriented delivery on KPIs.</p>
`.trim(),
        location: "Munich, Germany",
        department: "Engineering",
        jobType: "FULL_TIME",
        remotePolicy: "ONSITE",
        stipend: "Not specified",
        duration: "Permanent",
        applyUrl: "https://ory.jobs.personio.de/job/2334461",
      },
    ],
  },
  {
    slug: "spacexai",
    name: "SpaceXAI",
    tagline: "Understand the Universe",
    about:
      "SpaceXAI (formerly xAI) was founded by Elon Musk in March 2023 with a mission to create AI systems that can accurately understand the universe and aid humanity in its pursuit of knowledge, building the Grok family of models. xAI acquired X Corp (formerly Twitter) in 2025, and in February 2026 xAI itself was acquired by SpaceX, becoming a subsidiary as part of SpaceX's AI consolidation — rebranding to SpaceXAI in July 2026. The company is led by President Michael Nicolls (formerly VP of Starlink Engineering at SpaceX), and is headquartered in Palo Alto, California, with a $230B valuation as of its January 2026 Series E round.",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/9/93/XAI_Logo.svg",
    fundingStage: "SERIES_C_PLUS",
    remotePolicy: "ONSITE",
    visaSponsorship: false,
    employeeCountRange: "1000+",
    websiteUrl: "https://x.ai",
    categories: ["ai-ml", "infrastructure"],
    technologies: ["cpp", "python", "go", "kubernetes"],
    location: { city: "Palo Alto", country: "USA" },
    founders: [
      { name: "Elon Musk", title: "Founder" },
      { name: "Igor Babuschkin", title: "Co-founder (departed 2025)" },
      {
        name: "Michael Nicolls",
        title: "President",
        linkedinUrl: "https://www.linkedin.com/in/michael-nicolls-84989a50/",
      },
    ],
    links: [{ type: "linkedin", url: "https://www.linkedin.com/company/xai" }],
    internships: [
      {
        slug: "xai-software-engineer-networking-software-services-dublin",
        title: "Software Engineer - Networking Software and Services",
        description: `
<h3><strong>ABOUT xAI</strong></h3><p>xAI’s mission is to create AI systems that can accurately understand the universe and aid humanity in its pursuit of knowledge. Our team is small, highly motivated, and focused on engineering excellence. This organization is for individuals who appreciate challenging themselves and thrive on curiosity. We operate with a flat organizational structure. All employees are expected to be hands-on and to contribute directly to the company’s mission. Leadership is given to those who show initiative and consistently deliver excellence. Work ethic and strong prioritization skills are important. All employees are expected to have strong communication skills. They should be able to concisely and accurately share knowledge with their teammates.</p><h2>About the Role</h2><p>As part of the Network Software and Services for AI (nssAI) team at xAI, you'll build cutting-edge software, services, and frameworks to empower our Network Development Engineers. Working hands-on, you’ll tackle all facets of network management—metric collection, configuration, zero-touch provisioning, monitoring, and auto-remediation—driving automation-first solutions for xAI’s production and ancillary networks. Expect to develop extensible tools, streamline complex processes, and ensure rock-solid reliability to support xAI’s mission of accelerating human scientific discovery through AI.</p><h2>Location</h2><p>Dublin, Ireland</p><h2>Focus</h2><ul><li>Building software and tools with extensive metrics coverage for some of the world’s largest GPU supercomputing network fabrics used for AI training and serving customer inference queries.</li><li>Implement IaC best practices, enhancing deployment pipelines, and ensuring robust, secure service delivery across our production environments.</li></ul><h2>Preferred Skills and Experience</h2><ul><li>Deep experience collaborating with network engineers daily using extensive knowledge of network topologies, physical and logical, and network protocols.</li><li>Expert knowledge and proven history with designing scalable and reliable software from the ground up that can build and orchestrate tens of thousands of network devices at lightning speeds.</li><li>Ability to thrive in ambiguity, creating metrics that will help prioritize the focus of the team and your own.</li></ul><h2>Tech Stack</h2><ul><li>Python</li><li>Go</li><li>TCP/IP</li><li>BGP</li><li>RDMA<br></li></ul><h2>Annual Salary Range</h2><p>€65,000k - €150,000k Base</p><h2>Benefits</h2><p>Base salary is just one part of our total rewards package at xAI, which also includes equity, comprehensive medical, vision, and dental coverage, access to a 401(k) retirement plan, short & long-term disability insurance, life insurance, and various other discounts and perks.</p><p><em>xAI is an equal opportunity employer. For details on data processing, view our </em><em><a href="https://x.ai/legal/recruitment-privacy-notice" target="_blank">Recruitment Privacy Notice</a>.</em></p>
`.trim(),
        location: "Dublin, Ireland",
        department: "Networking",
        jobType: "FULL_TIME",
        remotePolicy: "ONSITE",
        stipend: "Not specified",
        duration: "Permanent",
        applyUrl: "https://job-boards.greenhouse.io/xai/jobs/4794532007",
      },
      {
        slug: "xai-network-operations-technician-starlink",
        title: "Network Operations Technician (xAI / Starlink)",
        description: `
<h3><strong>ABOUT xAI</strong></h3><p>xAI’s mission is to create AI systems that can accurately understand the universe and aid humanity in its pursuit of knowledge. Our team is small, highly motivated, and focused on engineering excellence. This organization is for individuals who appreciate challenging themselves and thrive on curiosity. We operate with a flat organizational structure. All employees are expected to be hands-on and to contribute directly to the company’s mission. Leadership is given to those who show initiative and consistently deliver excellence. Work ethic and strong prioritization skills are important. All employees are expected to have strong communication skills. They should be able to concisely and accurately share knowledge with their teammates.</p><h3>ABOUT THE ROLE:</h3><p>As a Network Operations Technician, you will be directly responsible for operating the growing Starlink Network as we scale to millions of users around the globe as well as the world largest SuperCompute Datacenter Networks. You will execute operational response to real-time network events and anomalies – mitigating their impact before significant service degradation occurs. You will facilitate incident response, engaging and supporting engineering teams to triage and resolve major issues. You will work with engineers across disciplines and external partners to ensure that all problems are root-caused and mitigated to prevent future recurrence. You will manage changes and maintenance required to improve and sustain service for users, while ensuring minimal network downtime. As an embedded operator within the NOC you will work with operations engineering to improve operational processes, increase operational efficiency, and maximize operational capabilities.</p><h3><strong>RESPONSIBILITIES:</strong></h3><ul><li>Detect and triage emerging anomalies on satellites, ground stations, terrestrial network interop, terrestrial network interconnections, network co-location sites, and internet points of presence</li><li>Provide centralized awareness and management of routine and emergency maintenance performed by SpaceX personnel and partner contractors</li><li>Execute rapid incident response for major network disruptions</li><li>Own investigation, troubleshooting and resolution efforts for common network issues</li><li>Provide advanced troubleshooting support and resolution for complex residential and enterprise escalations in coordination with internal teams</li><li>Measure, preserve, and improve the uptime and performance of the Starlink Network</li><li>Follow and improve processes used for operating the Starlink Network</li></ul><h3><strong>BASIC QUALIFICATIONS:</strong></h3><ul><li>High school diploma or equivalency certificate</li><li>1+ year of professional experience troubleshooting and operating computer systems in a network, IT, or security setting including but not limited to a Network Operations Center (NOC), Security Operations Center (SOC), Data Center Operations etc. </li></ul><h3><strong>PREFERRED SKILLS AND EXPERIENCE:</strong></h3><ul><li>Ability to take on projects that require taking initiative and developing new expertise</li><li>Ability to work effectively in a dynamic environment that includes working with fast changing needs and requirements</li><li>Experience in mission-critical operations where outstanding attention to detail and communication is required to ensure success</li><li>Industry recognized technical certifications (i.e. Network+, Security+, CCNA, JNCIA, etc)</li><li>Ability to perform network troubleshooting using packet captures and/or device telemetry to root cause network issues</li><li>Familiarity with modern networking technologies including but not limited to:</li><li>Connectivity (MAC, WiFi, WDM, IPv4 and IPv6)</li><li>Switching (STP, VLANs, VXLANs, QinQ)</li><li>Routing (BGP, OSPF, IS-IS, RDMA)</li><li>Network services (DNS, DHCP, NTP, NAT)</li><li>Network security (MACsec, ACLs) and Anti-DDoS measures</li><li>Knowledge and troubleshooting of common consumer devices (IoT, Home security and Smart devices)</li><li>Residential or business customer interaction experience, customer support preferred</li><li>Experience with debugging complex systems using data analysis</li><li>Basic software experience in Python, SQL, Bash or similar languages</li><li>Bachelor’s degree in IT, Computer Science, Cybersecurity or STEM discipline</li></ul><h3><strong>ADDITIONAL REQUIREMENTS:</strong></h3><ul><li>Must be available for day time on-shift rotations and weekends as needed</li></ul><h3><strong>COMPENSATION AND BENEFITS: </strong></h3><p>$44,000 - $88,000 USD</p><p>Your actual level and base salary will be determined on a case-by-case basis and may vary based on the following considerations: location, job-related knowledge and skills, education, and experience.</p><p>Base salary is just one part of our total rewards package at xAI, which also includes equity, comprehensive medical, vision, and dental coverage, access to a 401(k) retirement plan, short & long-term disability insurance, life insurance, and various other discounts and perks</p><p><em>xAI is an equal opportunity employer. For details on data processing, view our </em><em><a href="https://x.ai/legal/recruitment-privacy-notice" target="_blank">Recruitment Privacy Notice</a>.</em></p>
`.trim(),
        location: "Dublin, Ireland",
        department: "Networking",
        jobType: "FULL_TIME",
        remotePolicy: "ONSITE",
        stipend: "Not specified",
        duration: "Permanent",
        applyUrl: "https://job-boards.greenhouse.io/xai/jobs/5169675007",
      },
      {
        slug: "xai-senior-data-engineer-consumer-subscriptions",
        title: "Senior Data Engineer - Consumer Subscriptions",
        description: `
<h3><strong>ABOUT xAI</strong></h3><p>xAI’s mission is to create AI systems that can accurately understand the universe and aid humanity in its pursuit of knowledge. Our team is small, highly motivated, and focused on engineering excellence. This organization is for individuals who appreciate challenging themselves and thrive on curiosity. We operate with a flat organizational structure. All employees are expected to be hands-on and to contribute directly to the company’s mission. Leadership is given to those who show initiative and consistently deliver excellence. Work ethic and strong prioritization skills are important. All employees are expected to have strong communication skills. They should be able to concisely and accurately share knowledge with their teammates.</p><h3><strong>ABOUT THE ROLE:</strong></h3><p>We’re seeking a Senior Data Engineer to join the Consumer Subscriptions team. You will own the analytics foundation for X Premium and SuperGrok — one of X’s fastest-growing revenue organizations. You will dive deep into the entire consumer subscription ecosystem, turning massive-scale data into clear, actionable insights that drive strategic decisions, optimize revenue, and shape product direction. This high-impact role combines rigorous statistical analysis, compelling visualization, and hands-on data engineering to monitor performance, measure impact, surface opportunities, and ensure every initiative moves the needle.</p><h3><strong>RESPONSIBILITIES:</strong></h3><ul><li>Own end-to-end analysis of the consumer subscriptions ecosystem — including acquisition, conversion, retention, churn, revenue, pricing, promotions, bundles, and global performance.</li><li>Build and maintain high-impact dashboards and visualizations that give the team real-time visibility into key metrics and trends.</li><li>Perform deep statistical analysis and experimentation to quantify the impact of new features, offers, communications, and market expansions.</li><li>Identify where the team should focus next by uncovering growth opportunities, user behavior patterns, and optimization levers.</li><li>Design and run ongoing monitoring systems and automated audits to ensure data accuracy, integrity, and compliance at scale.</li><li>Write efficient code (SQL, Python, etc.) to extract, transform, and analyze complex datasets from multiple sources.</li><li>Translate complex findings into clear, compelling narratives and recommendations that influence engineering, product, and business strategy.</li></ul><h3><strong>BASIC QUALIFICATIONS:</strong></h3><ul><li>5+ years of experience as a data analyst (or equivalent) with a proven track record in revenue, subscription, or growth analytics.</li><li>Strong SQL and Python proficiency (pandas, numpy, etc.) for data extraction, cleaning, and analysis.</li><li>Deep experience with statistical methods, A/B testing, cohort analysis, and causal inference.</li><li>Strong familiarity with subscription metrics and modeling (LTV, churn, retention, conversion, revenue attribution, etc.).</li><li>Skilled at building intuitive dashboards and visualizations (Looker, Tableau, Metabase, or Python-based tools).</li><li>Ability to handle large-scale data with a strong emphasis on accuracy, rigor, and storytelling.</li></ul><h3><strong>PREFERRED SKILLS AND EXPERIENCE:</strong></h3><ul><li>Prior work in consumer subscriptions, billing, payments, or monetization analytics at scale.</li><li>Experience with BigQuery and real-time analytics pipelines.</li><li>Strong product intuition and the ability to connect data insights directly to business outcomes.</li></ul><h3><strong>COMPENSATION AND BENEFITS;</strong></h3><p>$180,000 - $440,000 USD</p><p>Base salary is just one part of our total rewards package at xAI, which also includes equity, comprehensive medical, vision, and dental coverage, access to a 401(k) retirement plan, short & long-term disability insurance, life insurance, and various other discounts and perks.</p><p><em>xAI is an equal opportunity employer. For details on data processing, view our </em><em><a href="https://x.ai/legal/recruitment-privacy-notice" target="_blank">Recruitment Privacy Notice</a>.</em></p>
`.trim(),
        location: "New York, NY / Palo Alto, CA",
        department: "Data Engineering",
        jobType: "FULL_TIME",
        remotePolicy: "ONSITE",
        stipend: "Not specified",
        duration: "Permanent",
        applyUrl: "https://job-boards.greenhouse.io/xai/jobs/5109703007",
      },
      {
        slug: "xai-backend-engineer-api-london",
        title: "Backend Engineer - API",
        description: `
<h3><strong>ABOUT xAI</strong></h3><p>xAI’s mission is to create AI systems that can accurately understand the universe and aid humanity in its pursuit of knowledge. Our team is small, highly motivated, and focused on engineering excellence. This organization is for individuals who appreciate challenging themselves and thrive on curiosity. We operate with a flat organizational structure. All employees are expected to be hands-on and to contribute directly to the company’s mission. Leadership is given to those who show initiative and consistently deliver excellence. Work ethic and strong prioritization skills are important. All employees are expected to have strong communication skills. They should be able to concisely and accurately share knowledge with their teammates.</p><h3 data-pm-slice="1 1 []">ABOUT THE ROLE:</h3><p>As an ideal candidate you have a good understanding of how highly scalable and reliable production infrastructure is built. Most of our backend infrastructure is written in Rust. So familiarity with a compiled language such as C++, Rust, or Go is highly beneficial.</p><h3>RESPONSIBILITIES:</h3><ul><li>Build the xAI API that serves our models to developers worldwide</li><li>Own the end-to-end system responsible for high-throughput inference, handling billions of tokens per minute with low latency and high availability, including model serving infrastructure, request routing, SDK development, rate limiting, observability, and efficient scaling</li></ul><h3>BASIC QUALIFICATIONS:</h3><ul><li>Expert knowledge of either Rust or C++</li><li>Experience in designing, implementing, and maintaining reliable and horizontally scalable distributed systems</li><li>Knowledge of service observability and reliability best practices</li><li>Experience in operating commonly used databases such as PostgreSQL, Clickhouse, and MongoDB</li></ul><h3>PREFERRED SKILLS AND EXPERIENCE:</h3><ul><li>Experience with LLM inference engines and serving frameworks (e.g., SGLang, TensorRT, vLLM)</li><li>Experience designing or building with agent SDKs and agent orchestration frameworks</li><li>Experience with Docker, Kubernetes, and containerized applications</li><li>Expert knowledge of gRPC (unary, response streaming, bi-directional streaming, REST mapping)</li></ul><h3><strong>COMPENSATION AND BENEFITS:</strong></h3><p>£107,000 - £262,000 GBP</p><p>Base salary is just one part of our total rewards package at xAI, which also includes equity, comprehensive healthcare and dental coverage, cash plan, income protection, life insurance, and various other discounts and perks.</p><p><em>xAI is an equal opportunity employer. For details on data processing, view our </em><em><a href="https://x.ai/legal/recruitment-privacy-notice" target="_blank">Recruitment Privacy Notice</a>.</em></p>
`.trim(),
        location: "London, UK",
        department: "Engineering",
        jobType: "FULL_TIME",
        remotePolicy: "ONSITE",
        stipend: "Not specified",
        duration: "Permanent",
        applyUrl: "https://job-boards.greenhouse.io/xai/jobs/5120536007",
      },
      {
        slug: "xai-x-developer-platform-forward-deployed-engineer",
        title: "X Developer Platform \u2013 Forward Deployed Engineer, X API",
        description: `
<h3><strong>ABOUT xAI</strong></h3><p>xAI’s mission is to create AI systems that can accurately understand the universe and aid humanity in its pursuit of knowledge. Our team is small, highly motivated, and focused on engineering excellence. This organization is for individuals who appreciate challenging themselves and thrive on curiosity. We operate with a flat organizational structure. All employees are expected to be hands-on and to contribute directly to the company’s mission. Leadership is given to those who show initiative and consistently deliver excellence. Work ethic and strong prioritization skills are important. All employees are expected to have strong communication skills. They should be able to concisely and accurately share knowledge with their teammates.</p><h3 data-pm-slice="1 1 []">ABOUT THE ROLE:</h3><p>X Developer Platform is responsible for the partner ecosystem of B2B and B2C developers that build solutions using X’s extensive API set. With more than 500 million active users and billions of posts per week, X offers robust, real-time and historical data, insights and engagement opportunities across a wide range of organizations and industries. Our API gives you the ability to learn from and engage with the conversation on X and we supply developers with the tools to further uncover, build on, and share the value of this conversation with the world.</p><p>Our mission broadly is to achieve the state of X, “The Everything App”, and be the clear digital townsquare of Earth. We make our ever-expanding universe of social media data available via our extensive API suite with consistent and reliable architecture so the world can realize the full potential of this amazing stream of information. Our team helps collect, process, enrich and deliver hundreds of billions of signals a day through the X API platform. Our products are highly available, scalable, optimized, respectful of X's user base, and truly essential for our customers who build their businesses on X data.</p><p><strong>We are seeking an exceptional Forward Deployed Engineer</strong> who will work at the intersection of deep technical implementation and world-class developer experience. In this hands-on role, you will be on the front lines building production solutions for Enterprise customers, creating sample apps for both Enterprise and Indie developers, improving DevEx tools (SDKs, MCPs, CLIs, sandbox environments, and more), and authoring comprehensive how-to-guides — with an emphasis for X API + Agentic/AI use cases and integrations. You are genuinely obsessed with developers, our documentation, and making every X API product super accessible, intuitive, and delightful to build with. You will work directly with customers while collaborating closely with internal product and engineering teams to drive adoption, reduce friction, and maximize long-term value across the entire developer ecosystem.</p><p><strong>X Developer API Products Include:</strong></p><ul><li>Real time streaming access to X data</li><li>Historical access to archived X data</li><li>Insight into X engagement data</li><li>Enrichments on X objects derived from the latest machine learning technologies</li><li>Flexible access to aggregate data</li><li>End to end developer experience</li></ul><h3>RESPONSIBILITIES:</h3><ul><li>Partner directly with Enterprise customers to understand their business needs and rapidly build production-grade solutions, prototypes, integrations, and accelerators using the X API platform.</li><li>Design, develop, and maintain high-quality sample applications, starter kits, reference implementations, and code examples for both Enterprise teams and Indie developers to accelerate adoption and showcase best practices.</li><li>Build, enhance, and ship developer experience tools such as SDKs, MCPs, CLIs, Sandbox/Test Environments, and other internal/external tooling that dramatically improves developer productivity and ease of use.</li><li>Research, write, and continuously improve comprehensive how-to guides, tutorials, cookbook recipes, technical blogs, and educational content — with special emphasis on X API integrations, real-time data, AI Agents, LLMs, and emerging use cases.</li><li>Obsess over every aspect of developer experience: continuously audit and elevate our documentation, onboarding flows, code samples, and overall accessibility to make X API products the most approachable and powerful in the industry.</li><li>Gather real-world feedback from customers and the broader developer community, advocate passionately for their needs internally, and collaborate with Product and Engineering teams to influence roadmap and feature prioritization.</li><li>Diagnose complex technical issues, bugs, and edge cases; provide expert-level troubleshooting, workarounds, and long-term solutions while turning learnings into public guides and tooling improvements.</li><li>Streamline support processes and create scalable materials that close knowledge gaps and accelerate success for both managed partners and self-serve developers.</li></ul><h3>BASIC QUALIFICATIONS:</h3><ul><li>5+ years of experience in a customer-facing technical role (partner engineering, solutions architecture, developer relations, forward-deployed engineering, or similar) working directly with enterprise customers.</li><li>Write and review production-grade code across frontend and backend (Python, JavaScript/TypeScript, Java, etc.) with a proven track record of shipping production-quality software, sample apps, prototypes, and developer tools.</li><li>Strong understanding of API design principles, REST/GraphQL, real-time streaming systems, authentication, and modern AI/agent workflows.</li><li>Hands-on experience building developer-facing assets: sample applications, reference implementations, DevEx tools, and high-quality technical documentation/guides.</li><li>Deep, genuine passion for developer experience (DevEx) — you instinctively identify friction and love removing it through better docs, tools, and accessible APIs.</li><li>Ability to work comfortably and professionally with diverse stakeholders (software developers, product managers, technical executives, and business leaders) to define and deliver shared objectives.</li><li>Excellent project management skills with the ability to scope, execute, and drive initiatives autonomously in a fast-paced environment.</li><li>Outstanding verbal and written communication skills, including the ability to translate complex technical topics into clear, engaging documentation and presentations.</li><li>Strong attention to detail and a solution-oriented mindset that turns customer problems into scalable improvements.</li></ul><h3>PREFERRED SKILLS AND EXPERIENCE:</h3><ul><li>Previous experience building or significantly contributing to developer platforms, tools, SDKs, interactive playgrounds, or educational content.</li><li>Hands-on knowledge of AI/Agent frameworks, LLM integrations, or building AI-powered applications on top of data APIs.</li><li>Industry experience in social media, enterprise software, data analytics, real-time/streaming data, or related spaces.</li><li>Strong familiarity with Rust, Scala (ideally), or JVM-based programming languages.</li><li>A public portfolio of sample apps, open-source contributions, technical blogs, guides, or DevEx tools that demonstrate your builder mindset and developer obsession.</li></ul><h3><strong>COMPENSATION AND BENEFITS:</strong></h3><p>$180,000 - $440,000 USD</p><p>Base salary is just one part of our total rewards package at xAI, which also includes equity, comprehensive medical, vision, and dental coverage, access to a 401(k) retirement plan, short & long-term disability insurance, life insurance, and various other discounts and perks.</p><p><em>xAI is an equal opportunity employer. For details on data processing, view our </em><em><a href="https://x.ai/legal/recruitment-privacy-notice" target="_blank">Recruitment Privacy Notice</a>.</em></p>
`.trim(),
        location: "New York, NY / Palo Alto, CA",
        department: "X Developer Platform",
        jobType: "FULL_TIME",
        remotePolicy: "ONSITE",
        stipend: "Not specified",
        duration: "Permanent",
        applyUrl: "https://job-boards.greenhouse.io/xai/jobs/5136287007",
      },
      {
        slug: "xai-data-engineer",
        title: "Data Engineer",
        description: `
<h3><strong>ABOUT xAI</strong></h3><p>xAI’s mission is to create AI systems that can accurately understand the universe and aid humanity in its pursuit of knowledge. Our team is small, highly motivated, and focused on engineering excellence. This organization is for individuals who appreciate challenging themselves and thrive on curiosity. We operate with a flat organizational structure. All employees are expected to be hands-on and to contribute directly to the company’s mission. Leadership is given to those who show initiative and consistently deliver excellence. Work ethic and strong prioritization skills are important. All employees are expected to have strong communication skills. They should be able to concisely and accurately share knowledge with their teammates.</p><h3 data-pm-slice="1 1 []">ABOUT THE ROLE:</h3><p>At xAI, we are building AI systems that push the frontier of human knowledge and scientific discovery. High-quality data is fundamental to every stage of that mission. Our Data team is responsible for ensuring that the models are trained on the right data, in the right form, at the right quality, across every phase of the training lifecycle. This includes partnering closely with acquisition teams to identify where valuable data can be sourced, determining what data is needed to improve model performance, and building the production pipelines and systems that transform raw inputs into high-quality training data at scale. We work at the intersection of data, infrastructure, and machine learning to ensure our models train effectively and reliably.</p><p>As a Data Engineer / AI Engineer on xAI’s Data team, you will be responsible for developing the systems, processes, and production code that power data acquisition, preparation, quality evaluation, and delivery for model training. You will work closely with acquisition teams, ML engineers, and software engineers to identify data needs, build scalable data pipelines, and continuously improve the quality of the data that shapes model behavior. The ideal candidate combines strong software engineering fundamentals and excellent coding practices with deep intuition for statistics, neural networks, and how data quality influences training outcomes.</p><h3>RESPONSIBILITIES:</h3><ul><li>Analyze the performance and impact of data used throughout the model training lifecycle</li><li>Investigate anomalous model behavior and rigorously identify the data issues that drive poor downstream performance</li><li>Design, build, and improve the data cleaning, transformation, and quality-control steps required to produce high-quality training data</li><li>Research, evaluate, and develop frontier methods for improving data quality and effectiveness in AI model development</li><li>Apply statistical techniques and empirical analysis to make informed, data-driven decisions about dataset quality and model outcomes</li><li>Partner across teams to identify where data needs exist and define the highest-impact opportunities for new data acquisition and improvement</li><li>Build and maintain production-grade data pipelines, tooling, and software systems that ingest, process, validate, and deliver data for training</li><li>Develop metrics, evaluation frameworks, and monitoring systems to assess how data quality influences model behavior at scale</li><li>Fuse data from multiple sources into reliable, usable datasets for research and production model training</li><li>Create shared datasets, tooling, and internal data products that enable other teams to analyze, debug, and improve model performance</li></ul><h3>BASIC QUALIFICATIONS:</h3><ul><li>Bachelor’s degree in computer science, data science, physics, mathematics, or a STEM discipline</li><li>1+ years of data/software engineering experience (internship experience is applicable)</li><li>Experience in implementing or analyzing language models or neural networks </li></ul><h3>PREFERRED SKILLS AND EXPERIENCE:</h3><ul><li>Professional experience in analytics, data science, machine learning, or data engineering</li><li>Experience building and operating production data pipelines for neural network or large-scale machine learning workloads</li><li>Strong experience with Python and the broader ecosystem of libraries and tools used in modern machine learning and data development</li><li>Experience working with Parquet or similar columnar storage formats in large-scale data systems</li><li>Familiarity with Kubernetes and distributed production environments</li><li>Experience developing predictive models and machine learning pipelines, including clustering, forecasting, anomaly detection, or related techniques</li><li>Experience working with very large-scale datasets, including terabyte- to petabyte-scale data systems</li><li>Strong statistical intuition and the ability to use quantitative analysis to guide technical and product decision, including familiarity of scaling ladder design studies</li><li>Ability to operate effectively in a dynamic environment with evolving priorities, changing requirements, and fast-moving technical challenges</li><li>Demonstrated ability to take ownership of ambiguous problems, drive projects independently, and develop new expertise where needed</li></ul><h3><strong>COMPENSATION AND BENEFITS</strong></h3><p>$150,000 - $210,000 USD</p><p>Base salary is just one part of our total rewards package at xAI, which also includes equity, comprehensive medical, vision, and dental coverage, access to a 401(k) retirement plan, short & long-term disability insurance, life insurance, and various other discounts and perks.</p><p><em>xAI is an equal opportunity employer. For details on data processing, view our </em><em><a href="https://x.ai/legal/recruitment-privacy-notice" target="_blank">Recruitment Privacy Notice</a>.</em></p>
`.trim(),
        location: "Palo Alto, CA",
        department: "Data Engineering",
        jobType: "FULL_TIME",
        remotePolicy: "ONSITE",
        stipend: "Not specified",
        duration: "Permanent",
        applyUrl: "https://job-boards.greenhouse.io/xai/jobs/5120884007",
      },
      {
        slug: "xai-software-engineer-data",
        title: "Software Engineer - Data",
        description: `
<h3><strong>ABOUT xAI</strong></h3><p>xAI’s mission is to create AI systems that can accurately understand the universe and aid humanity in its pursuit of knowledge. Our team is small, highly motivated, and focused on engineering excellence. This organization is for individuals who appreciate challenging themselves and thrive on curiosity. We operate with a flat organizational structure. All employees are expected to be hands-on and to contribute directly to the company’s mission. Leadership is given to those who show initiative and consistently deliver excellence. Work ethic and strong prioritization skills are important. All employees are expected to have strong communication skills. They should be able to concisely and accurately share knowledge with their teammates.</p><h3><strong>ABOUT THE ROLE:</strong></h3><p>At xAI, we are building AI systems that push the frontier of human knowledge and scientific discovery. High-quality data is fundamental to every stage of that mission. Our Data team is responsible for ensuring that the models are trained on the right data, in the right form, at the right quality, across every phase of the training lifecycle. This includes partnering closely with acquisition teams to identify where valuable data can be sourced, determining what data is needed to improve model performance, and building the production pipelines and systems that transform raw inputs into high-quality training data at scale. We work at the intersection of software, data, infrastructure, and machine learning to ensure our models train effectively and reliably.</p><p>As a Software Engineer on xAI’s Data team, you will be responsible for developing applications that power data acquisition, preparation, training, quality evaluation, and delivery for model training. You will provide the ability to run training in a reliable, scalable and repeatable manner. You will also provide visibility on training status and data lineage. You will work closely with acquisition teams, ML engineers, and data engineers to build a reliable data pipeline to run training at scale. The ideal candidate combines strong software engineering fundamentals and excellent coding practices. </p><h3><strong>RESPONSIBILITIES:</strong></h3><ul><li>Develop a highly reliable and scalable enterprise data platform to orchestrate data acquisition, preparation, training, quality evaluation, and delivery for model training</li><li>Create new features such as data lineage, visibility, and monitoring for end-to-end training that improve the quality of the data and model performance</li><li>Collaborate with peers on architecture, design, and code reviews</li><li>Build prototypes to prove out key design concepts and quantify technical constraints</li><li>Own all aspects of software engineering and product development</li><li>Deep dive into business problems, find efficient solutions and apply first principles thinking</li></ul><h3><strong>BASIC QUALIFICATIONS:</strong></h3><ul><li>Bachelor's degree in computer science, data science, engineering, math, physics, or scientific discipline; OR 2+ years of professional experience building software in lieu of a degree</li><li>1+ years of experience in application development, software engineering, data engineering, or data science</li></ul><h3><strong>PREFERRED SKILLS AND EXPERIENCE:</strong></h3><ul><li>Programming experience in Python, Rust, Java, C#, Scala, Go or similar languages</li><li>Frontend experience in Angular, React, or similar JavaScript frameworks</li><li>Hands-on experience with Kubernetes and containerized deployments</li><li>Experience with Ray, AI training and orchestration</li><li>Experience with relational and non-relational databases, data lakes e.g. PostgreSQL, Iceberg, Clickhouse, or similar</li><li>Experience with data exploration tools like Grafana, Superset, or similar</li><li>Good understanding of version control, testing, continuous integration, build, deployment and monitoring</li><li>Good understanding of statistics, machine learning algorithms and frameworks</li></ul><h3><strong>COMPENSATION AND BENEFITS:</strong></h3><p>$150,000 - $250,000 USD</p><p>Base salary is just one part of our total rewards package at xAI, which also includes equity, comprehensive medical, vision, and dental coverage, access to a 401(k) retirement plan, short & long-term disability insurance, life insurance, and various other discounts and perks.</p><p><em>xAI is an equal opportunity employer. For details on data processing, view our </em><em><a href="https://x.ai/legal/recruitment-privacy-notice" target="_blank">Recruitment Privacy Notice</a>.</em></p>
`.trim(),
        location: "Palo Alto, CA",
        department: "Engineering",
        jobType: "FULL_TIME",
        remotePolicy: "ONSITE",
        stipend: "Not specified",
        duration: "Permanent",
        applyUrl: "https://job-boards.greenhouse.io/xai/jobs/5124616007",
      },
      {
        slug: "xai-software-engineer-networking-software-services-paloalto",
        title: "Software Engineer - Networking Software and Services",
        description: `
<h3><strong>ABOUT xAI</strong></h3><p>xAI’s mission is to create AI systems that can accurately understand the universe and aid humanity in its pursuit of knowledge. Our team is small, highly motivated, and focused on engineering excellence. This organization is for individuals who appreciate challenging themselves and thrive on curiosity. We operate with a flat organizational structure. All employees are expected to be hands-on and to contribute directly to the company’s mission. Leadership is given to those who show initiative and consistently deliver excellence. Work ethic and strong prioritization skills are important. All employees are expected to have strong communication skills. They should be able to concisely and accurately share knowledge with their teammates.</p><h2>About the Role</h2><p>As part of the Network Software and Services for AI (nssAI) team at xAI, you'll build cutting-edge software, services, and frameworks to empower our Network Development Engineers. Working hands-on, you’ll tackle all facets of network management—metric collection, configuration, zero-touch provisioning, monitoring, and auto-remediation—driving automation-first solutions for xAI’s production and ancillary networks. Expect to develop extensible tools, streamline complex processes, and ensure rock-solid reliability to support xAI’s mission of accelerating human scientific discovery through AI.</p><h2>Location</h2><p>The role is based in the offices of Palo Alto - California.</p><h2>Focus</h2><ul><li>Building software and tools with extensive metrics coverage for some of the world’s largest GPU supercomputing network fabrics used for AI training and serving customer inference queries.</li><li>Implement IaC best practices, enhancing deployment pipelines, and ensuring robust, secure service delivery across our production environments.</li></ul><h2>Preferred Skills and Experience</h2><ul><li>Deep experience collaborating with network engineers daily using extensive knowledge of network topologies, physical and logical, and network protocols.</li><li>Expert knowledge and proven history with designing scalable and reliable software from the ground up that can build and orchestrate tens of thousands of network devices at lightning speeds.</li><li>Ability to thrive in ambiguity, creating metrics that will help prioritize the focus of the team and your own.</li></ul><h2>Tech Stack</h2><ul><li>Python</li><li>Go</li><li>TCP/IP</li><li>BGP</li><li>RDMA<br></li></ul><h2>Annual Salary Range:</h2><p>$150,000 - 250,000k Base</p><h2>Benefits</h2><p>Base salary is just one part of our total rewards package at xAI, which also includes equity, comprehensive medical, vision, and dental coverage, access to a 401(k) retirement plan, short & long-term disability insurance, life insurance, and various other discounts and perks.</p><p><em>xAI is an equal opportunity employer. For details on data processing, view our </em><em><a href="https://x.ai/legal/recruitment-privacy-notice" target="_blank">Recruitment Privacy Notice</a>.</em></p>
`.trim(),
        location: "Palo Alto, CA",
        department: "Networking",
        jobType: "FULL_TIME",
        remotePolicy: "ONSITE",
        stipend: "Not specified",
        duration: "Permanent",
        applyUrl: "https://job-boards.greenhouse.io/xai/jobs/4946696007",
      },
      {
        slug: "xai-software-engineer-x-data",
        title: "Software Engineer - X Data",
        description: `
<h3><strong>ABOUT xAI</strong></h3><p>xAI’s mission is to create AI systems that can accurately understand the universe and aid humanity in its pursuit of knowledge. Our team is small, highly motivated, and focused on engineering excellence. This organization is for individuals who appreciate challenging themselves and thrive on curiosity. We operate with a flat organizational structure. All employees are expected to be hands-on and to contribute directly to the company’s mission. Leadership is given to those who show initiative and consistently deliver excellence. Work ethic and strong prioritization skills are important. All employees are expected to have strong communication skills. They should be able to concisely and accurately share knowledge with their teammates.</p><h3 data-pm-slice="1 1 []">ABOUT THE ROLE:</h3><p>As a Data Engineer in X product engineering team, you will play a key role in providing comprehensive data solutions that own or serve a wide range of stakeholders, including our end-users and internal teams such as Product engineering, Algorithm, Legal, Finance and Sales. Our work utilizes AI, distributed computing and hybrid storage technologies, but extends beyond purely data-centric solutions, encompassing non-data-related challenges, ultimately maximizing the potential of data for the benefit of our diverse user base.</p><h3>RESPONSIBILITIES:</h3><p>You'll help build and operate a distributed data platform that powers hundreds of realtime and batch pipelines processing billions of events per day. The team runs like an internal startup — we own problems end to end, from raw event streams to the datasets, tooling, and metrics that product, growth, safety, and business teams depend on daily. In this role you will:</p><ul><li>Design, build, and operate production-grade realtime and batch pipelines that ingest, process, validate, and deliver data powering user-behavior insights and product decisions.</li><li>Create shared datasets, fact tables, and internal data products that let other teams analyze, debug, and improve product performance.</li><li>Prototype and build tooling that automates and accelerates internal data workflows — backfills, dashboards, report generation, and self-serve access to data.</li><li>Own data correctness end to end: validate with output invariants, denominator reconciliation, and independent recomputation, and lead root-cause investigations when key metrics move unexpectedly.</li><li>Move fluidly across query engines and frameworks (e.g., BigQuery, Trino, Clickhouse for analytics; Flink, Kafka, Spark/Scalding for streaming and batch), choosing the right tool and adapting quickly to new infrastructure and environments.</li><li>Partner across product and business teams to surface where data gaps exist and prioritize the highest-impact opportunities for new data acquisition and improvement.</li><li>Iterate quickly on feedback, shipping the smallest useful increment with a strong bias toward efficient, accurate, and reliable solutions.</li></ul><h3><strong>BASIC QUALIFICATIONS:</strong></h3><p>We are looking for an engineer with 3+ years of professional software engineering experience, ideally in data engineering or distributed systems.</p><ul><li>Hands-on expertise in Python, Rust, Scala, Go or Java, and data pipeline toolings and distributed systems. </li><li>Knowledge of realtime and batch data processing tools such as Spark/Kafka/Flink/SQL and various storage systems in RMDBs/NoSQL</li><li>Experience solving large scale problems and comfortable doing incremental quality work while building brand new systems to enable future quality improvements. </li><li>Proven records of interpreting product requirements into engineering implementation plans, and effectively communicating with different groups (AI, product, marketing/sales and engineering). </li></ul><h3><strong>COMPENSATION AND BENEFITS:</strong></h3><p>$125,000 - $400,000 USD</p><p>Base salary is just one part of our total rewards package at xAI, which also includes equity, comprehensive medical, vision, and dental coverage, access to a 401(k) retirement plan, short & long-term disability insurance, life insurance, and various other discounts and perks.</p><p><em>xAI is an equal opportunity employer. For details on data processing, view our </em><em><a href="https://x.ai/legal/recruitment-privacy-notice" target="_blank">Recruitment Privacy Notice</a>.</em></p>
`.trim(),
        location: "Palo Alto, CA",
        department: "Engineering",
        jobType: "FULL_TIME",
        remotePolicy: "ONSITE",
        stipend: "Not specified",
        duration: "Permanent",
        applyUrl: "https://job-boards.greenhouse.io/xai/jobs/5182183007",
      },
      {
        slug: "xai-software-engineer-ads-product",
        title: "Software Engineer, Ads Product",
        description: `
<h3><strong>ABOUT xAI</strong></h3><p>xAI’s mission is to create AI systems that can accurately understand the universe and aid humanity in its pursuit of knowledge. Our team is small, highly motivated, and focused on engineering excellence. This organization is for individuals who appreciate challenging themselves and thrive on curiosity. We operate with a flat organizational structure. All employees are expected to be hands-on and to contribute directly to the company’s mission. Leadership is given to those who show initiative and consistently deliver excellence. Work ethic and strong prioritization skills are important. All employees are expected to have strong communication skills. They should be able to concisely and accurately share knowledge with their teammates.</p><h3><strong>ABOUT THE ROLE:</strong></h3><p>X Ads is one of the highest-leverage product areas at X. You’ll work on systems that operate at massive scale, directly affect the business, and are being rebuilt with modern infrastructure and AI at the center. This is an opportunity to join a small, fast-moving team where early-career engineers can take on real ownership, learn from strong engineers, and ship products that matter.<br>We’re looking for high-slope software engineers who want to help rebuild and transform the X Ads Platform using xAI’s infrastructure and AI stack.</p><p>This role is a great fit for engineers who are early in their careers but learn quickly, ship fast, and want to work on products and systems that operate at massive scale. You do not need to have deep ads experience already, but you should be excited to learn how large-scale advertising systems work and how AI can make ads more relevant, useful, and effective.</p><p>You’ll work across product, backend systems, infrastructure, and AI-powered features that directly impact the majority of X’s revenue.</p><h3><strong>RESPONSIBILITIES:</strong></h3><ul><li>Build and ship product features across the X Ads Platform.</li><li>Work on systems related to ad delivery, targeting, optimization, measurement, and advertiser experience.</li><li>Use xAI’s infrastructure and AI capabilities to improve the performance and quality of advertising products.</li><li>Contribute to distributed systems that need to be reliable, fast, and scalable.</li><li>Collaborate closely with engineers, product leads, and cross-functional partners to turn ideas into working products.</li><li>Learn quickly, take ownership, and operate in a fast-moving environment where high-quality execution matters.</li><li>Debug, maintain, and improve production systems that serve real users and drive significant business impact.</li></ul><h3><strong>BASIC QUALIFICATIONS:</strong></h3><ul><li>Strong software engineering fundamentals.</li><li>Ability to write clean, maintainable code and learn new codebases quickly.</li><li>Strong problem-solving skills and comfort working through ambiguity.</li><li>Experience building software through internships, projects, research, open-source work, startups, or full-time roles.</li><li>Interest in backend systems, distributed systems, data pipelines, product engineering, or AI applications.</li><li>A bias toward action: you like shipping, learning from real users, and improving quickly.</li><li>Strong ownership mindset and willingness to take responsibility for meaningful parts of the product.</li><li>Excitement about building high-quality product experiences for advertisers and users.</li></ul><h3><strong>PREFERRED SKILLS AND EXPERIENCE:</strong></h3><ul><li>Experience with ads, recommendations, search, ranking, marketplaces, payments, analytics, or growth systems.</li><li>Experience working with large-scale backend systems or data processing pipelines.</li><li>Experience with React, Golang, Python, Rust, gRPC, Java, or Scala.</li><li>Experience with machine learning, LLMs, experimentation, ranking, or optimization systems.</li><li>Prior startup, research, internship, or high-impact project experience.</li></ul><p>You do not need to know every technology listed below. We care more about strong fundamentals, learning speed, and ability to ship.</p><ul><li>React</li><li>Golang</li><li>Python</li><li>Rust</li><li>gRPC</li><li>Java / Scala</li></ul><h3><strong>COMPENSATION AND BENEFITS:</strong></h3><p>$150,000 - $350,000 USD</p><p>Base salary is just one part of our total rewards package at xAI, which also includes equity, comprehensive medical, vision, and dental coverage, access to a 401(k) retirement plan, short & long-term disability insurance, life insurance, and various other discounts and perks.</p><p><em>xAI is an equal opportunity employer. For details on data processing, view our </em><em><a href="https://x.ai/legal/recruitment-privacy-notice" target="_blank">Recruitment Privacy Notice</a>.</em></p>
`.trim(),
        location: "Palo Alto, CA",
        department: "Engineering",
        jobType: "FULL_TIME",
        remotePolicy: "ONSITE",
        stipend: "Not specified",
        duration: "Permanent",
        applyUrl: "https://job-boards.greenhouse.io/xai/jobs/5152408007",
      },
      {
        slug: "xai-software-engineer-network-cpp",
        title: "Software Engineer - Network (C++)",
        description: `
<h3><strong>ABOUT xAI</strong></h3><p>xAI’s mission is to create AI systems that can accurately understand the universe and aid humanity in its pursuit of knowledge. Our team is small, highly motivated, and focused on engineering excellence. This organization is for individuals who appreciate challenging themselves and thrive on curiosity. We operate with a flat organizational structure. All employees are expected to be hands-on and to contribute directly to the company’s mission. Leadership is given to those who show initiative and consistently deliver excellence. Work ethic and strong prioritization skills are important. All employees are expected to have strong communication skills. They should be able to concisely and accurately share knowledge with their teammates.</p><h3><strong>ABOUT THE ROLE:</strong></h3><p>At xAI, we design, build, and operate Colossus from the ground up. This includes the massive GPU clusters, high-speed interconnect fabric, and the software that makes it all work at unprecedented scale. Colossus powers Grok and our frontier AI models with a custom, high-performance datacenter network that delivers ultra-low latency and massive bandwidth across hundreds of thousands of GPUs.</p><p>As a Software Engineer on the Colossus Networking team, you will develop the core networking software that maximizes the performance and reliability of our datacenter fabric. Your work will directly impact training efficiency, model convergence, and the speed at which we can push the frontier of AI.</p><p>Our engineers own the full lifecycle of their software — from design and implementation to deployment, monitoring, and iteration based on real-world performance at scale. You will solve hard problems in distributed systems, high-performance networking, and real-time control of one of the largest AI supercomputers on Earth.</p><h3><strong>RESPONSIBILITIES:</strong></h3><ul><li>Develop routing and traffic-engineering algorithms for the Colossus high-performance datacenter network.</li><li>Develop highly reliable, real-time software designed to run on the switches that form the backbone of our low-latency, high-bandwidth AI training fabric.</li><li>Participate in and lead architecture, design, and code reviews.</li><li>Develop prototypes and run experiments to validate key design decisions at both small and full-cluster scale.</li><li>Build tools for software development, deployment, data analysis, visualization, and testing across virtualized environments, hardware-in-the-loop setups, and live production clusters.</li><li>Deploy reliable software updates through continuous integration and release systems with rigorous testing and monitoring.</li></ul><h3><strong>BASIC QUALIFICATIONS:</strong></h3><ul><li>Bachelor’s degree in computer science, engineering, math, or a related technical discipline; OR 2+ years of professional software development experience in lieu of a degree.</li><li>Strong development experience in C or C++.</li></ul><h3><strong>PREFERRED SKILLS AND EXPERIENCE:</strong></h3><ul><li>Strong professional experience writing high-performance C/C++ in production environments.</li><li>Experience developing, debugging, and deploying software that runs at scale in real-world systems.</li><li>Deep knowledge of networking protocols (UDP, TCP/IP, RDMA, etc.), distributed systems, and large-scale datacenter fabrics.</li><li>Background in real-time systems, high-performance computing, low-latency networking, or resource-constrained environments.</li><li>Creative problem-solving ability with exceptional analytical skills and strong engineering fundamentals.</li><li>Excellent written and verbal communication skills.</li><li>Ability to thrive in a fast-paced, dynamic environment with evolving requirements.</li><li>Experience with security considerations in large-scale distributed systems.</li></ul><h3><strong>ADDITIONAL REQUIREMENTS:</strong></h3><ul><li>Must be willing to work extended hours and weekends as needed.</li></ul><h3><strong>COMPENSATION AND BENEFITS</strong></h3><p>$180,000 - $440,000 USD</p><p>Base salary is just one part of our total rewards package at xAI, which also includes equity, comprehensive medical, vision, and dental coverage, access to a 401(k) retirement plan, short & long-term disability insurance, life insurance, and various other discounts and perks.</p><p><em>xAI is an equal opportunity employer. For details on data processing, view our </em><em><a href="https://x.ai/legal/recruitment-privacy-notice" target="_blank">Recruitment Privacy Notice</a>.</em></p>
`.trim(),
        location: "Palo Alto, CA / Seattle, WA",
        department: "Networking",
        jobType: "FULL_TIME",
        remotePolicy: "ONSITE",
        stipend: "Not specified",
        duration: "Permanent",
        applyUrl: "https://job-boards.greenhouse.io/xai/jobs/5179367007",
      },
      {
        slug: "xai-security-engineer-detection-response-japan",
        title: "Security Engineer - Detection & Response (Japan)",
        description: `
<h3><strong>ABOUT xAI</strong></h3><p>xAI’s mission is to create AI systems that can accurately understand the universe and aid humanity in its pursuit of knowledge. Our team is small, highly motivated, and focused on engineering excellence. This organization is for individuals who appreciate challenging themselves and thrive on curiosity. We operate with a flat organizational structure. All employees are expected to be hands-on and to contribute directly to the company’s mission. Leadership is given to those who show initiative and consistently deliver excellence. Work ethic and strong prioritization skills are important. All employees are expected to have strong communication skills. They should be able to concisely and accurately share knowledge with their teammates.</p><h3 data-pm-slice="1 1 []"><strong>ABOUT THE ROLE:</strong></h3><p>You will be responsible for leading day-to-day security threat management. You will help identify and manage potential incidents and work with partner teams on known or suspected security threats. You will support threat intelligence, threat hunting, intrusion detection, and incident response efforts that adhere to, and push forward, best practices. </p><h3><strong>RESPONSIBILITIES:</strong></h3><ul><li>Certifications like CISA, CRISC, CGEIT, Security+, CASP+, or similar preferred.</li><li>Drive continual improvement in processes, procedures and automations to improve the quality and effectiveness of the team.</li><li>Participate in a 24/7 on-call rotation performing security incident response</li><li>Commandeering security incidents and updating stakeholders.</li><li>Identify and develop new detection use cases and optimize existing detections.</li><li>Collaborate on technical directions and solutions with other teams.</li><li>Research and analyze patterns in security events across X’s global infrastructure.</li><li>Identify, design, and lead threat hunting missions to quantify and reduce threats.</li><li>Manage and support the log collection, security scanning, intrusion detection, and other security-related systems.</li><li>Design and assist in the development of automation to reduce false positives and handle events automatically.</li><li>Analyze the security posture of systems via testing and vulnerability impact analysis.</li></ul><h3><strong>BASIC QUALIFICATIONS:</strong></h3><ul><li>2+ years of relevant information security experience</li><li>Self starter, can receive a task and execute with minimal supervision</li><li>Strong Python scripting skills for implementing security automation</li><li>Knowledge of networking and macOS, Windows or Linux operating systems.</li><li>Knowledge of cloud security fundamentals and practices (vendor agnostic).</li><li>Experience managing and/or deploying security technology.</li><li>Experience with building queries and dashboards for security monitoring.</li><li>Knowledge of current threats and techniques and a desire to research and learn more.</li><li>Experience with malware analysis, forensics or penetration testing.</li><li>Problem solving skills or experience with troubleshooting.</li></ul><h3>PREFERRED SKILLS AND EXPERIENCE:</h3><ul><li>Elastic / OpenSearch or similar platforms </li><li>Open Source security automation tooling</li></ul><p><em>xAI is an equal opportunity employer. For details on data processing, view our </em><em><a href="https://x.ai/legal/recruitment-privacy-notice" target="_blank">Recruitment Privacy Notice</a>.</em></p>
`.trim(),
        location: "Tokyo, Japan",
        department: "Security",
        jobType: "FULL_TIME",
        remotePolicy: "ONSITE",
        stipend: "Not specified",
        duration: "Permanent",
        applyUrl: "https://job-boards.greenhouse.io/xai/jobs/5143756007",
      },
    ],
  },
  {
    slug: "finn",
    name: "FINN",
    tagline: "Simply drive a car for a fixed monthly price",
    about:
      "FINN is Germany's largest car subscription platform, founded in 2019 in Munich by Maximilian Wühr, Max-Josef Meier, Andreas Stryz, Nikolai Schröder, and Max Beyer. FINN offers flexible vehicle subscriptions with no purchase or long-term commitment — a monthly fixed price covering insurance, maintenance, registration, and CO₂ compensation. Now led by CEO Maximilian Wühr, FINN has expanded from Germany into the US and manages tens of thousands of subscriptions, having raised over $1B across multiple rounds including a Series C at a €600M valuation.",
    logoUrl: "https://www.finn.com/assets/favicon/favicon-32x32.png",
    fundingStage: "SERIES_C_PLUS",
    remotePolicy: "REMOTE",
    visaSponsorship: false,
    employeeCountRange: "201-500",
    websiteUrl: "https://www.finn.com",
    categories: ["mobility", "consumer"],
    technologies: ["sap", "python", "aws", "gcp"],
    location: { city: "Munich", country: "Germany" },
    founders: [
      { name: "Maximilian Wühr", title: "Co-founder & CEO" },
      {
        name: "Max-Josef Meier",
        title: "Co-founder (former CEO)",
        linkedinUrl: "https://de.linkedin.com/in/maxjosefmeier",
      },
      { name: "Andreas Stryz", title: "Co-founder" },
      { name: "Nikolai Schröder", title: "Co-founder" },
      { name: "Max Beyer", title: "Co-founder" },
    ],
    links: [
      { type: "linkedin", url: "https://www.linkedin.com/company/finn-auto" },
      { type: "instagram", url: "https://www.instagram.com/finn.auto/" },
      { type: "youtube", url: "https://www.youtube.com/c/FINNauto" },
    ],
    internships: [
      {
        slug: "finn-associate-sap-software-engineer",
        title: "Associate SAP Software Engineer (m/f/x)",
        description: `
<strong>Your Role </strong>
 
As Associate SAP Software Engineer, you are part of the ERP Product team, which develops Products in close collaboration with our Finance &amp; Legal Department. In a highly integrated and automated system landscape, you design and implement solutions in S/4HANA that are scalable and seamlessly integrated with the rest of our tech stack.<h3>Your Mission</h3><ul><li><p><strong>Build in S/4HANA: </strong>Develop, extend and maintain ABAP solutions in our S/4HANA Cloud system. You start with bounded, well-scoped pieces and ramp up quickly into bigger ones.</p></li><li><p><strong>Own Something Early: </strong>Ownership is core to how we work. Within your first months you take a feature, interface or process and make it yours — design, build, ship, support.</p></li><li><p><strong>Work Across the FINN Stack:</strong> SAP doesn't live in isolation. You touch Make, Node, Python, Retool and our Data Warehouse as you trace data end-to-end from upstream automation, through SAP to downstream analytics.</p></li><li><p><strong>Investigate, Don't Just Implement: </strong>Work directly with Finance stakeholders. Understand the actual pain — not just the ticket. Propose better solutions when the ticket misses the point.</p></li><li><p><strong>Learn Modern SAP:</strong> Clean Core principles, Released APIs, RAP, OData, side-by-side extensibility on BTP. You bring the hunger; we invest in your growth.</p></li></ul><h3>Your Profile</h3><ul><li><p>1+ years of software engineering experience.</p></li><li><p>Basic SAP/ABAP skills required — internship, working student role, certification, bootcamp or first job all count. We don't expect years of ABAP; we expect that you've seen it and want more.</p></li><li><p>Strong openness toward non-SAP technology in the FINN stack: Make, Node, Python, Retool, DWH, dbt. Hands-on prerequisites here are a strong plus, not a requirement.</p></li><li><p>Genuine interest in modern SAP development — Clean Core, Released APIs, RAP, BTP, side-by-side extensibility — and willingness to make it part of your toolbelt.</p></li><li><p>Analytical, data-driven and comfortable digging into systems you don't yet fully understand.</p></li><li><p>Strong communication and collaboration skills — you'll talk to Finance stakeholders from week one.</p></li><li><p>Fluent in English. German is a plus.</p></li></ul><h3>Why FINN?</h3><ul><li>Flexibility to work either in our modern Munich office or remotely within the EU/EMEA region (+/- 3 hours of the German time zone).</li><li>With massive growth potential, FINN allows you to quickly develop and succeed in a highly motivating startup environment with ambitious challenges in cross-functional teams.</li><li>Excellent fixed salary, significant virtual equity share of the company, along a yearly personal development budget of 1,500€.</li><li>Visa and relocation support for you and your family.</li><li>Kindergarten and daycare allowance for employees working in Germany.</li><li>You want to drive your own car with FINN? – Get one with our employee discount program.</li></ul>€55,000 - €68,000 a year<small>This is the salary range for this position. Additionally, you will benefit from virtual company shares (VSOP - Virtual Stock Option Plan).
 
Your individual placement within this range will be determined during the application process and is based on your experience, qualifications, and specific expertise. The stated range reflects our current planning at the time of publication; we reserve the right to make future adjustments in line with market developments.</small><div
`.trim(),
        location: "Europe (Remote)",
        department: "Tech",
        jobType: "FULL_TIME",
        remotePolicy: "REMOTE",
        stipend: "Not specified",
        duration: "Permanent",
        applyUrl: "https://jobs.lever.co/finn/fca68fd4-f1d8-4b65-b6c2-cbf7e8ea31b8",
      },
      {
        slug: "finn-data-scientist",
        title: "Data Scientist (m/f/x)",
        description: `
<strong>Your Role </strong>
 
<span>As a Data Scientist in Operations, you will be at the forefront of optimizing how FINN manages and scales its operational infrastructure. You will leverage advanced forecasting and optimization models to predict capacity needs, drive efficient resource distribution, and solve operationally critical challenges that directly impact the business. Your work will uncover hidden patterns, validate the impact of operational strategies, and deliver actionable recommendations to the operations team. This role is perfect for a proactive problem solver who thrives at the intersection of data science and logistics, and is passionate about turning operational complexity into scalable, data-driven solutions. We’ve fully embraced AI-assisted development to amplify our impact, and we’re looking for a teammate who is excited to build and innovate using modern, AI-driven workflows too.</span><h3>Your Responsibilities</h3><ul><li><p><strong>Generate data-driven insights</strong>: Perform in-depth data analyses to understand operational patterns, capacity dynamics, and resource utilization, delivering actionable insights that drive efficiency improvements.</p></li><li><p><strong>Build and validate proof-of-concepts</strong>: Develop POCs for innovative operational strategies, test and validate their impact on key performance metrics.</p></li><li><p><strong>Design and own advanced optimization models</strong>: Create and maintain forecasting and optimization models using machine learning and operations research techniques to ensure scalable and efficient operations.</p></li><li><p><strong>Shape and evolve operational strategy</strong>: Leverage your analytical expertise to refine and enhance FINN's operational processes, ensuring alignment with growth targets and business objectives.</p></li><li><p><strong>Collaborate</strong>: Partner with other data and tech teams as well as operations stakeholders in a cross-functional setup and align your work with business objectives.</p></li></ul><h3>Your Profile</h3><ul><li>Graduated with a Master's degree in a relevant data field of study (e.g., Industrial Engineering, Data Science, Statistics, Applied mathematics), a PhD is a plus.</li><li>3+ years of professional experience in operations-heavy environments (preferably logistics, supply chain, mobility, or e-commerce fulfillment).</li><li>Technical expertise: Proven track record in data and time-series analysis, statistical modelling, and implementing forecasting and optimization models from scratch.</li><li>Proven experience integrating AI tools (e.g., Claude, Cursor) into your daily analytics workflow to write code, explore data, and ship work.</li><li>Proficient in Agentic development.</li><li>Proficient in the data stack: SQL, Python, GCP.</li><li>Operations &amp; optimization expertise: Experience in building and deploying capacity planning, resource allocation, or logistics optimization solutions end-to-end.</li><li>Stakeholder engagement: Skilled at presenting technical concepts to non-technical audiences, including C-level.</li><li>Problem-solving: Exceptional ability to break down complex operational problems and develop data-driven solutions.</li><li>Flexibility: Comfortable working in a fast-paced environment and adapting to changing priorities – operations doesn't wait.</li><li>Fluent in English. German is a plus.</li></ul><h3>Why FINN?</h3><ul><li><strong data-path-to-node="2,0,0" data-index-in-node="0">Remote Work:</strong> You have the flexibility to work either in our Munich office or remotely in Germany.</li><li><p><strong data-path-to-node="2,0,0" data-index-in-node="0">Shared Success (VSOP Equity Program):</strong> We win together. Through our Virtual Stock Option Program, you benefit directly from the long-term growth and success of FINN.</p></li><li><p><strong data-path-to-node="2,1,0" data-index-in-node="0">Fuel your Growth (3.000€ Development Budget):</strong> Standing still is not an option. With your annual development budget for further training and seminars, you decide how you want to grow personally and professionally.</p></li><li><p><strong data-path-to-node="2,2,0" data-index-in-node="0">Family First (Childcare Subsidy &amp; Flexibility):</strong> We support you and your family. Benefit from a monthly childcare subsidy, exclusive access to daycare spots in Munich, and maximum flexibility to balance work and family life stress-free.</p></li><li><p><strong data-path-to-node="2,3,0" data-index-in-node="0">Company Pension Scheme (bAV):</strong> We think about your future. FINN subsidizes your company pension plan with a strong employer contribution of 66%.</p></li><li><p><strong data-path-to-node="2,4,0" data-index-in-node="0">Experience our Product (25% Car Subscription Discount):</strong> Become a FINN driver yourself! You will receive a generous employee discount or can alternatively take advantage of our attractive bike leasing scheme.</p></li><li><p><strong data-path-to-node="2,5,0" data-index-in-node="0">Health &amp; Mindset (Sports &amp; Wellbeing):</strong> Your energy is our drive. Benefit from a subsidized EGYM Wellpass membership for fitness and sports, as well as professional mental health support.</p></li><li><p><strong data-path-to-node="2,6,0" data-index-in-node="0">Munich Office Life:</strong> Barista-style coffee, matcha, and a luscious fruit basket await you at our modern headquarters in Munich. On top of that, there is a daily lunch subsidy for those in the office.</p></li><li><p><strong data-path-to-node="2,7,0" data-index-in-node="0">Team Spirit &amp; Corporate Events:</strong> We are more than just colleagues. Whether it's summer events by the lake or simply a relaxed after-work drink, we celebrate our milestones together at regular team events.</p></li></ul> €69,000 - €80,000 a year<small><span>The fixed gross salary for this position is between €69,000 and €80,000 per year. Additionally, you will benefit from virtual company shares (VSOP - Virtual Stock Option Plan).</span>
 
<span>Your individual placement within this range will be determined during the application process and is based on your experience, qualifications, and specific expertise. The stated range reflects our current planning at the time of publication; we reserve the right to make future adjustments in line with market developments.</span></small><div
`.trim(),
        location: "Germany (Remote)",
        department: "Tech",
        jobType: "FULL_TIME",
        remotePolicy: "REMOTE",
        stipend: "Not specified",
        duration: "Permanent",
        applyUrl: "https://jobs.lever.co/finn/a9ba9967-8d58-44a1-8254-64b33fb0eb0f",
      },
      {
        slug: "finn-engineering-manager-cloud-security",
        title: "Engineering Manager - Cloud & Security (m/f/x)",
        description: `
<h3><span><strong>Your Role</strong></span></h3><p>As an Engineering Manager in our Tooling &amp; Security department, you are directly responsible for maintaining and improving our internal tooling, cloud governance and security. You will lead an international, world-class team of engineers, and will help the rest of FINN work efficiently and securely in their day to day jobs.</p><h3>Your Mission</h3><ul><li><p><strong>Hire and lead an incredible team</strong>: Be the technical role model and go the extra mile to build, develop, and coach the team members on a daily basis.</p></li><li><p><strong>Best software for FINN</strong>: Actively contribute to and lead the further development of our internal tooling for cloud governance, security detection and automation, IT management, and much more. </p></li><li><p><strong>Strive for excellence</strong>: Strive to deliver the best possible user experience and to follow engineering best practices.</p></li><li><p><strong>Build it, run it</strong>: Build features with a ‘build it, run it’ mindset and be responsible for testing, deploying, and monitoring your code. We believe in Serverless!</p></li></ul><h3>Your Profile</h3><ul><li><p>Graduated with a Bachelor’s degree (or equivalent) in Computer Science or in a similar field.</p></li><li><p>Proven track record with 5+ years of software engineering experience in larger projects.</p></li><li><p>2+ years of experience building and leading a team of software engineers in a fast-pace development environment.</p></li><li><p>Experience with platform or security engineering practices. Ideally, you have hands-on experience with leading disaster recovery and incident response efforts. (Those are not a daily reality at FINN, but you will be expected to own them if need be.)</p></li><li><p>Ability to own and drive company-wide technical projects (e.g., migrations, patching, etc.) from the position of a coordinator.</p></li><li><p>Solid knowledge of TS, Python, or Go, with ability to code and review code without AI if need be.</p></li><li><p>Deep knowledge of AWS or GCP, and are willing to learn the other quickly.</p></li><li><p>Fluent in English with excellent communication skills.</p></li></ul><h3>Why FINN?</h3><ul><li><strong data-path-to-node="2,0,0" data-index-in-node="0">Remote Work:</strong> You have the flexibility to work either in our Munich office or remotely ±3 hours of the Munich time zone (CET/ CEST) within the EU.</li><li><p><strong data-path-to-node="2,0,0" data-index-in-node="0">Shared Success (VSOP Equity Program):</strong> We win together. Through our Virtual Stock Option Program, you benefit directly from the long-term growth and success of FINN.</p></li><li><p><strong data-path-to-node="2,1,0" data-index-in-node="0">Fuel your Growth (3.000€ Development Budget):</strong> Standing still is not an option. With your annual development budget for further training and seminars, you decide how you want to grow personally and professionally.</p></li><li><p><strong data-path-to-node="2,2,0" data-index-in-node="0">Family First (Childcare Subsidy &amp; Flexibility):</strong> We support you and your family. Benefit from a monthly childcare subsidy, exclusive access to daycare spots in Munich, and maximum flexibility to balance work and family life stress-free.</p></li><li><p><strong data-path-to-node="2,3,0" data-index-in-node="0">Company Pension Scheme (bAV):</strong> We think about your future. FINN subsidizes your company pension plan with a strong employer contribution of 66%.</p></li><li><p><strong data-path-to-node="2,4,0" data-index-in-node="0">Experience our Product (25% Car Subscription Discount):</strong> Become a FINN driver yourself! You will receive a generous employee discount or can alternatively take advantage of our attractive bike leasing scheme.</p></li><li><p><strong data-path-to-node="2,5,0" data-index-in-node="0">Health &amp; Mindset (Sports &amp; Wellbeing):</strong> Your energy is our drive. Benefit from a subsidized EGYM Wellpass membership for fitness and sports, as well as professional mental health support.</p></li><li><p><strong data-path-to-node="2,6,0" data-index-in-node="0">Munich Office Life:</strong> Barista-style coffee, matcha, and a luscious fruit basket await you at our modern headquarters in Munich. On top of that, there is a daily lunch subsidy for those in the office.</p></li><li><p><strong data-path-to-node="2,7,0" data-index-in-node="0">Team Spirit &amp; Corporate Events:</strong> We are more than just colleagues. Whether it's summer events by the lake or simply a relaxed after-work drink, we celebrate our milestones together at regular team events.</p></li></ul> €105,000 - €116,000 a year<small>This is the salary range for this position. Additionally, you will benefit from virtual company shares (VSOP - Virtual Stock Option Plan).
 
Your individual placement within this range will be determined during the application process and is based on your experience, qualifications, and specific expertise. The stated range reflects our current planning at the time of publication; we reserve the right to make future adjustments in line with market developments.</small><div
`.trim(),
        location: "Munich, Germany",
        department: "Tech",
        jobType: "FULL_TIME",
        remotePolicy: "HYBRID",
        stipend: "Not specified",
        duration: "Permanent",
        applyUrl: "https://jobs.lever.co/finn/ea2dec72-8a5d-4cf8-83a1-caa6652a9559",
      },
      {
        slug: "finn-sap-mm-analyst",
        title: "SAP MM Analyst (m/f/x)",
        description: `
<strong>Your Role </strong>
 
<p>As SAP MM Analyst, you will play a dual role in our Tech organisation. You will ensure the stability and reliability of our financial core while simultaneously acting as a functional lead in high-impact projects. You will be the bridge between finance and our broader tech ecosystem, ensuring that our End-to-End processes remain scalable and standardised.</p><h3>Your Mission</h3><ul><li><p>Act as the first point of contact for MM operations (Purchasing, Inventory, Vendor Master Data, Invoice Verification), identifying root causes across work-streams and applying structured analysis to resolve them independently.</p></li><li><p>Partner with business teams, including Fleet and Operations, in order to own and evolve FINN's Procure-to-Pay process end-to-end, from purchase requisition through goods receipt to invoice posting, ensuring tight integration with FI-AP.</p></li><li><p>Continuously monitor and improve procurement workflows, ensuring they align with SAP Global Standards and  Clean Core principles.</p></li><li><p>Support and enable others within the team by documenting best practices for lean development and system usage.</p></li><li><p>Drive the implementation of technical solutions within larger business projects, overseeing initial design, integration, and deployment — including the strategic re-implementation of standard P2P at FINN.</p></li><li><p>Support the design of modern integrations using SAP Business Technology Platform (BTP) to connect S/4HANA with procurement platforms and internal tools.</p></li><li><p>Challenge the status quo. Proactively look for configuration, release strategies, or automation solutions that save time and enhance the requester and approver experience in SAP.</p></li></ul><h3>Your Profile</h3><ul><li><p>3+ years of hands-on experience in SAP MM.</p></li><li><p>Solid understanding of the MM-FI integration (automatic account determination, GR/IR, tax handling, asset accounting) and MM-SD touchpoints.</p></li><li><p>Proven experience with interface design in SAP Integration Suites (CPI, BTP).</p></li><li><p>You are obsessed with SAP Standards and shy away from custom solutions in order to keep the system maintainable. You actively advocate for returning to standard.</p></li><li><p>You have experience in full-cycle implementations or major roll-outs (ideally including a P2P or procurement rollout) and feel comfortable moving between deep technical tasks and high-level project management.</p></li><li><p>You are proactive, decisive, and grow stronger by solving complex problems in a fast-paced environment.</p></li><li><p>Excellent communication and collaboration skills to work effectively with procurement, finance, and cross-functional tech teams.</p></li><li><p>Highly analytical and data-driven, coupled with customer obsession and eagerness to work in a fast paced and impact-driven environment.</p></li></ul><h3>Why FINN?</h3><ul><li><strong data-path-to-node="2,0,0" data-index-in-node="0">Remote Work:</strong> You have the flexibility to work either in our Munich office or remotely ±3 hours of the Munich time zone (CET/ CEST) within the EU.</li><li><p><strong data-path-to-node="2,0,0" data-index-in-node="0">Shared Success (VSOP Equity Program):</strong> We win together. Through our Virtual Stock Option Program, you benefit directly from the long-term growth and success of FINN.</p></li><li><p><strong data-path-to-node="2,1,0" data-index-in-node="0">Fuel your Growth (3.000€ Development Budget):</strong> Standing still is not an option. With your annual development budget for further training and seminars, you decide how you want to grow personally and professionally.</p></li><li><p><strong data-path-to-node="2,2,0" data-index-in-node="0">Family First (Childcare Subsidy &amp; Flexibility):</strong> We support you and your family. Benefit from a monthly childcare subsidy, exclusive access to daycare spots in Munich, and maximum flexibility to balance work and family life stress-free.</p></li><li><p><strong data-path-to-node="2,3,0" data-index-in-node="0">Company Pension Scheme (bAV):</strong> We think about your future. FINN subsidizes your company pension plan with a strong employer contribution of 66%.</p></li><li><p><strong data-path-to-node="2,4,0" data-index-in-node="0">Experience our Product (25% Car Subscription Discount):</strong> Become a FINN driver yourself! You will receive a generous employee discount or can alternatively take advantage of our attractive bike leasing scheme.</p></li><li><p><strong data-path-to-node="2,5,0" data-index-in-node="0">Health &amp; Mindset (Sports &amp; Wellbeing):</strong> Your energy is our drive. Benefit from a subsidized EGYM Wellpass membership for fitness and sports, as well as professional mental health support.</p></li><li><p><strong data-path-to-node="2,6,0" data-index-in-node="0">Munich Office Life:</strong> Barista-style coffee, matcha, and a luscious fruit basket await you at our modern headquarters in Munich. On top of that, there is a daily lunch subsidy for those in the office.</p></li><li><p><strong data-path-to-node="2,7,0" data-index-in-node="0">Team Spirit &amp; Corporate Events:</strong> We are more than just colleagues. Whether it's summer events by the lake or simply a relaxed after-work drink, we celebrate our milestones together at regular team events.</p></li></ul>€68,000 - €81,000 a year<small>Additionally, you will benefit from virtual company shares (VSOP - Virtual Stock Option Plan).
 
Your individual placement within this range will be determined during the application process and is based on your experience, qualifications, and specific expertise. The stated range reflects our current planning at the time of publication; we reserve the right to make future adjustments in line with market developments.</small><div
`.trim(),
        location: "Europe (Remote)",
        department: "Tech",
        jobType: "FULL_TIME",
        remotePolicy: "REMOTE",
        stipend: "Not specified",
        duration: "Permanent",
        applyUrl: "https://jobs.lever.co/finn/141d402b-1349-4078-aac6-e1e9507fa372",
      },
      {
        slug: "finn-sap-sd-analyst",
        title: "SAP SD Analyst (m/f/x)",
        description: `
<strong>Your Role </strong><p>As SAP SD Analyst, you will play a dual role in our Tech organisation. You will ensure the stability and reliability of our commercial core while simultaneously acting as a functional lead in high-impact projects. You will be the bridge between sales, operations and our broader tech ecosystem, ensuring that our End-to-End processes remain scalable and standardised.</p><h3>Your Responsibilities</h3><ul><li><p>Act as the first point of contact for SD operations (Remarketing Invoicing, Pricing &amp; Conditions, Subscription Billing), identifying root causes across work-streams and applying structured analysis to resolve them independently.</p></li><li><p>Partner with business teams, including Growth, Fleet and Operations, in order to own and evolve FINN's Order-to-Cash process end-to-end, from sales order creation through delivery and billing to revenue posting, ensuring tight integration with FI-AR.</p></li><li><p>Continuously monitor and improve sales order and billing workflows, ensuring they align with SAP Standard and Clean Core principles.</p></li><li><p>Support and enable others within the team by documenting best practices for lean development and system usage.</p></li><li><p>Drive the implementation of technical solutions within larger business projects, overseeing initial design, integration and deployment.</p></li><li><p>Support the design of modern integrations using SAP Business Technology Platform (BTP) to connect S/4HANA with customer-facing platforms and internal tools.</p></li><li><p>Challenge the status quo. Proactively look for configuration, pricing automation, or output management solutions that save time and enhance the customer and sales experience in SAP.</p></li></ul><h3>Your Profile</h3><ul><li>3+ years of hands-on experience in SAP SD.</li><li>Solid understanding of the SD-FI integration (subscription billing, revenue account determination, billing document transfer, credit management) and SD-MM touchpoints.</li><li>Proven experience with interface design in SAP Integration Suites (CPI, BTP).</li><li>You are obsessed with SAP Standards and shy away from custom solutions in order to keep the system maintainable. You actively advocate for returning to standard.</li><li>You have experience in full-cycle implementations or major roll-outs (ideally including an O2C or sales rollout) and feel comfortable moving between deep technical tasks and high-level project management.</li><li>You are proactive, decisive, and grow stronger by solving complex problems in a fast-paced environment.</li><li>Excellent communication and collaboration skills to work effectively with sales, finance, and cross-functional tech teams.</li><li>Highly analytical and data-driven, coupled with customer obsession and eagerness to work in a fast paced and impact-driven environment.</li><li>Experience in product development and Agile methodologies.</li><li>Fluent in English.</li><li>Understanding of adjacent systems in the data chain (DWH, automation tools) is a plus.</li></ul><h3>Why FINN?</h3><ul><li><strong data-path-to-node="2,0,0" data-index-in-node="0">Remote Work:</strong> You have the flexibility to work either in our Munich office or remotely ±3 hours of the Munich time zone (CET/ CEST) within the EU.</li><li><p><strong data-path-to-node="2,0,0" data-index-in-node="0">Shared Success (VSOP Equity Program):</strong> We win together. Through our Virtual Stock Option Program, you benefit directly from the long-term growth and success of FINN.</p></li><li><p><strong data-path-to-node="2,1,0" data-index-in-node="0">Fuel your Growth (3.000€ Development Budget):</strong> Standing still is not an option. With your annual development budget for further training and seminars, you decide how you want to grow personally and professionally.</p></li><li><p><strong data-path-to-node="2,2,0" data-index-in-node="0">Family First (Childcare Subsidy &amp; Flexibility):</strong> We support you and your family. Benefit from a monthly childcare subsidy, exclusive access to daycare spots in Munich, and maximum flexibility to balance work and family life stress-free.</p></li><li><p><strong data-path-to-node="2,3,0" data-index-in-node="0">Company Pension Scheme (bAV):</strong> We think about your future. FINN subsidizes your company pension plan with a strong employer contribution of 66%.</p></li><li><p><strong data-path-to-node="2,4,0" data-index-in-node="0">Experience our Product (25% Car Subscription Discount):</strong> Become a FINN driver yourself! You will receive a generous employee discount or can alternatively take advantage of our attractive bike leasing scheme.</p></li><li><p><strong data-path-to-node="2,5,0" data-index-in-node="0">Health &amp; Mindset (Sports &amp; Wellbeing):</strong> Your energy is our drive. Benefit from a subsidized EGYM Wellpass membership for fitness and sports, as well as professional mental health support.</p></li><li><p><strong data-path-to-node="2,6,0" data-index-in-node="0">Munich Office Life:</strong> Barista-style coffee, matcha, and a luscious fruit basket await you at our modern headquarters in Munich. On top of that, there is a daily lunch subsidy for those in the office.</p></li><li><p><strong data-path-to-node="2,7,0" data-index-in-node="0">Team Spirit &amp; Corporate Events:</strong> We are more than just colleagues. Whether it's summer events by the lake or simply a relaxed after-work drink, we celebrate our milestones together at regular team events.</p></li></ul> €68,000 - €81,000 a year<small><span>The fixed gross salary for this position is between €68,000 and €81,000 per year. Additionally, you will benefit from virtual company shares (VSOP - Virtual Stock Option Plan).</span><span>Your individual placement within this range will be determined during the application process and is based on your experience, qualifications, and specific expertise. The stated range reflects our current planning at the time of publication; we reserve the right to make future adjustments in line with market developments.</span></small><div
`.trim(),
        location: "Europe (Remote)",
        department: "Tech",
        jobType: "FULL_TIME",
        remotePolicy: "REMOTE",
        stipend: "Not specified",
        duration: "Permanent",
        applyUrl: "https://jobs.lever.co/finn/0ee44bde-4df6-4fc6-a47c-08b6f31fb4ee",
      },
      {
        slug: "finn-senior-data-analyst-operations",
        title: "Senior Data Analyst - Operations (m/f/x)",
        description: `
<strong>Your Role </strong><p>As Data Analyst in Operations at FINN, you will be at the heart of driving our business operations through data-driven insights. By leveraging advanced analytics tools and techniques, you will uncover trends, forecast outcomes, and provide actionable recommendations that validate the impact of strategic decisions. This role is perfect for a proactive problem solver who thrives in a data-rich environment. We’ve fully embraced AI-assisted development to amplify our impact, and we’re looking for a teammate who is excited to build and innovate using modern, AI-driven workflows too.</p><h3>Your Responsibilities</h3><ul><li><strong>Be a Domain Expert</strong>: As a domain expert, lead in-depth and advanced analysis of Operations data to uncover actionable insights that elevate performance and drive strategic decisions in areas like logistics, customer service, damage management, and risk assessment.</li><li><strong>Own the semantics of Operations data</strong>: As the authority on Operations metrics, you ensure a unified data language across the domain. By standardizing key terminology, you enable deeper insights and faster decision-making for accelerated growth and improved operational efficiency and customer satisfaction.</li><li><strong>Craft Compelling Narratives</strong>: Transform complex data into visually stunning dashboards, reports and appealing data stories that tell a clear status and allow actionable insights.</li><li><strong>Be a Data Evangelist</strong>: Partner with cross-functional business, tech teams and data teams to continuously enhance data processes and tools, ensuring every move is backed by cutting-edge analytics.</li></ul><h3>Your Profile</h3><ul><li>Graduated with a Master’s degree in a quantitative field of study.</li><li>3+ years of professional experience in data analytics with a focus on Operations Domain at a scaleup.</li><li>Advanced SQL modeling with dbt (Data Build Tool).</li><li>Proficiency in data visualization with Looker (or similar BI tool).</li><li>Proficiency in applying statistical analysis.</li><li>Python skills with strong willingness to learn more.</li><li>Proven experience integrating AI tools (e.g., Claude, Cursor) into your daily analytics workflow to write code, explore data, and ship work.</li><li>Fluent in English. German is a plus.</li></ul><h3>Why FINN?</h3><ul><li><strong data-path-to-node="2,0,0" data-index-in-node="0">Remote Work:</strong> You have the flexibility to work either in our Munich office or remotely in Germany.</li><li><p><strong data-path-to-node="2,0,0" data-index-in-node="0">Shared Success (VSOP Equity Program):</strong> We win together. Through our Virtual Stock Option Program, you benefit directly from the long-term growth and success of FINN.</p></li><li><p><strong data-path-to-node="2,1,0" data-index-in-node="0">Fuel your Growth (3.000€ Development Budget):</strong> Standing still is not an option. With your annual development budget for further training and seminars, you decide how you want to grow personally and professionally.</p></li><li><p><strong data-path-to-node="2,2,0" data-index-in-node="0">Family First (Childcare Subsidy &amp; Flexibility):</strong> We support you and your family. Benefit from a monthly childcare subsidy, exclusive access to daycare spots in Munich, and maximum flexibility to balance work and family life stress-free.</p></li><li><p><strong data-path-to-node="2,3,0" data-index-in-node="0">Company Pension Scheme (bAV):</strong> We think about your future. FINN subsidizes your company pension plan with a strong employer contribution of 66%.</p></li><li><p><strong data-path-to-node="2,4,0" data-index-in-node="0">Experience our Product (25% Car Subscription Discount):</strong> Become a FINN driver yourself! You will receive a generous employee discount or can alternatively take advantage of our attractive bike leasing scheme.</p></li><li><p><strong data-path-to-node="2,5,0" data-index-in-node="0">Health &amp; Mindset (Sports &amp; Wellbeing):</strong> Your energy is our drive. Benefit from a subsidized EGYM Wellpass membership for fitness and sports, as well as professional mental health support.</p></li><li><p><strong data-path-to-node="2,6,0" data-index-in-node="0">Munich Office Life:</strong> Barista-style coffee, matcha, and a luscious fruit basket await you at our modern headquarters in Munich. On top of that, there is a daily lunch subsidy for those in the office.</p></li><li><p><strong data-path-to-node="2,7,0" data-index-in-node="0">Team Spirit &amp; Corporate Events:</strong> We are more than just colleagues. Whether it's summer events by the lake or simply a relaxed after-work drink, we celebrate our milestones together at regular team events.</p></li></ul> €73,000 - €84,000 a year<small><span>The fixed gross salary for this position is between €73,000 and €84,000 per year. Additionally, you will benefit from virtual company shares (VSOP - Virtual Stock Option Plan).</span><span>Your individual placement within this range will be determined during the application process and is based on your experience, qualifications, and specific expertise. The stated range reflects our current planning at the time of publication; we reserve the right to make future adjustments in line with market developments.</span></small><div
`.trim(),
        location: "Germany (Remote)",
        department: "Tech",
        jobType: "FULL_TIME",
        remotePolicy: "REMOTE",
        stipend: "Not specified",
        duration: "Permanent",
        applyUrl: "https://jobs.lever.co/finn/e79dcd50-2487-4b40-a169-b80dc81ee2e8",
      },
      {
        slug: "finn-senior-product-manager-growth-ecommerce",
        title: "Senior Product Manager (m/f/x) Growth / E-Commerce",
        description: `
<strong>Your Role</strong>
 
As Senior Product Manager - Growth (m/f/x), you own the critical moment a visitor lands on finn.com and decides whether to choose a FINN car subscription. Leading our Onboarding and Shopping product team, you will shape how customers discover, compare, and select their ideal vehicle, turning top-of-funnel web traffic into loyal users through relentless experimentation and personalization. Your strategic vision and execution are core drivers in scaling our platform to over 100,000 active subscribers on the road.<h3>Your Mission</h3><ul><li><p data-path-to-node="3,0,0"><strong data-path-to-node="3,0,0" data-index-in-node="0">Run a high-velocity experimentation engine:</strong> Embed conversion-rate optimization and A/B testing into the team's core operating rhythm, testing bold hypotheses fast and adapting product choices based on clean empirical data.</p></li><li><p data-path-to-node="3,1,0"><strong data-path-to-node="3,1,0" data-index-in-node="0">Architect a personalized discovery journey:</strong> Scale our digital shopping experience by building intelligent search, dynamic vehicle filtering, relevance ranking, and segment-aware user flows that deliver the right car to the right user.</p></li><li><p data-path-to-node="3,2,0"><strong data-path-to-node="3,2,0" data-index-in-node="0">Diagnose user friction points:</strong> Synthesize quantitative funnel signals from product analytics tools with qualitative depth from direct user interviews to build a prioritized roadmap targeting highest-leverage growth drops.</p></li><li><p data-path-to-node="3,3,0"><strong data-path-to-node="3,3,0" data-index-in-node="0">Define the top-of-funnel vision:</strong> Own the product strategy and execution for our onboarding ecosystem, aligning your team's tactical goals directly with FINN's overarching revenue and customer acquisition targets.</p></li><li><p data-path-to-node="3,4,0"><strong data-path-to-node="3,4,0" data-index-in-node="0">Foster high-performing cross-functional alignment:</strong> Champion transparent, precise communication to create seamless collaboration across engineering, design, data, marketing, brand, and pricing stakeholders.</p></li><li><p data-path-to-node="3,5,0"><strong data-path-to-node="3,5,0" data-index-in-node="0">Optimize for true commercial outcomes:</strong> Relentlessly focus on driving conversion lift, revenue expansion, and early-stage retention metrics over purely tracking completed features or engineering outputs.</p></li></ul><h3>Your Profile</h3><strong data-path-to-node="6,0,0" data-index-in-node="0">Must have:</strong><ul><li><strong data-path-to-node="6,0,0" data-index-in-node="0">Extensive growth product track record:</strong> Deep, proven experience in product management with a track record of owning scalable, customer-facing growth, e-commerce, or marketplace products.</li><li><strong data-path-to-node="6,1,0" data-index-in-node="0">Mastery of experimentation methodologies:</strong> Exceptional, demonstrable skill in designing, launching, and analyzing high-velocity A/B tests as a primary mechanism for validating product value and optimizing conversion funnels.</li><li><strong data-path-to-node="6,2,0" data-index-in-node="0">Advanced data self-service capabilities:</strong> Highly analytical mindset with professional comfort in data exploration platforms (e.g., Amplitude, Looker, or similar tools) to independently pull data, build hypotheses, and challenge performance metrics.</li><li><strong data-path-to-node="6,3,0" data-index-in-node="0">Outcome-driven stakeholder management:</strong> Outstanding communication and alignment skills in English, backed by an entrepreneurial mindset that takes total end-to-end ownership of business outcomes.</li></ul><p data-path-to-node="7"><strong data-path-to-node="7" data-index-in-node="0">Nice-to-have:</strong> </p><ul><li data-path-to-node="7"><strong data-path-to-node="7" data-index-in-node="17">AI-native optimization frameworks:</strong> Proactive integration of modern AI tools within your daily discovery and engineering refinement routines to accelerate product delivery and analysis speed.</li><li data-path-to-node="7"><strong data-path-to-node="7" data-index-in-node="211">Dynamic digital subscription background:</strong> Direct experience navigating localized customer acquisition dynamics within rapidly scaling international subscription or high-consideration digital platforms.</li></ul><h3>WHY FINN</h3><ul><li><strong data-path-to-node="2,0,0" data-index-in-node="0">Shared Success (VSOP Equity Program):</strong> We win together. Through our Virtual Stock Option Program, you benefit directly from the long-term growth and success of FINN.</li><li><strong data-path-to-node="2,1,0" data-index-in-node="0">Fuel your Growth (1.500€ Development Budget):</strong> Standing still is not an option. With an annual development budget of <strong>1.500</strong><strong data-path-to-node="2,1,0" data-index-in-node="113">€ for further training and seminars</strong>, you decide how you want to grow personally and professionally.</li><li><strong data-path-to-node="2,2,0" data-index-in-node="0">Family First (Childcare Subsidy &amp; Flexibility):</strong> We support you and your family. Benefit from a monthly <strong data-path-to-node="2,2,0" data-index-in-node="103">childcare subsidy</strong>, exclusive access to daycare spots in <strong data-path-to-node="2,2,0" data-index-in-node="159">Munich</strong>, and maximum flexibility to balance work and family life stress-free.</li><li><strong data-path-to-node="2,3,0" data-index-in-node="0">Company Pension Scheme (bAV):</strong> We think about your future. FINN subsidizes your company pension plan with a strong <strong data-path-to-node="2,3,0" data-index-in-node="114">employer contribution of 66%</strong>.</li><li><strong data-path-to-node="2,4,0" data-index-in-node="0">Experience our Product (25% Car Subscription Discount):</strong> Become a FINN driver yourself! You will receive a generous <strong data-path-to-node="2,4,0" data-index-in-node="115">employee discount of 25% on your car subscription</strong> or can alternatively take advantage of our attractive <strong data-path-to-node="2,4,0" data-index-in-node="219">bike leasing</strong> scheme.</li><li><strong data-path-to-node="2,5,0" data-index-in-node="0">Health &amp; Mindset (Sports &amp; Wellbeing):</strong> Your energy is our drive. Benefit from a subsidized <strong data-path-to-node="2,5,0" data-index-in-node="91">EGYM Wellpass membership</strong> for fitness and sports, as well as professional mental health support.</li><li><strong data-path-to-node="2,6,0" data-index-in-node="0">Munich Office Life:</strong> Barista-style coffee, matcha, and the legendary fruit basket await you at our modern headquarters in <strong data-path-to-node="2,6,0" data-index-in-node="157">Munich</strong>. On top of that, there is a daily <strong data-path-to-node="2,6,0" data-index-in-node="198">allowance for your lunch (lunch subsidy)</strong>.</li><li><strong data-path-to-node="2,7,0" data-index-in-node="0">Team Spirit &amp; Corporate Events:</strong> We are more than just colleagues. Whether it's summer events by the lake or simply a relaxed after-work drink. We celebrate our milestones together at regular <strong data-path-to-node="2,7,0" data-index-in-node="192">team events</strong>.</li></ul><h3>About Us</h3><p>FINN is Germany’s leading car subscription platform and one of the country's few unicorns in the mobility sector. With over 400 colleagues from more than 50 nations, we are building the future of mobility and making access to your own car more seamless than ever before.<br><br aria-hidden="true">What truly makes us proud, however, isn’t just the numbers, but what lies behind them: our strong team drive, the will to challenge the status quo, and the ambition to make a real difference.<br><br aria-hidden="true">With us, you have the opportunity to take on direct responsibility in one of the fastest-growing scale-ups in Germany and actively shape our success story. We´re just getting started!<br><br>More information: <a rel="noopener noreferrer" href="https://www.finn.com/">www.finn.com</a></p><p> </p><h3><strong>Equal Opportunities for Everyone</strong></h3><p>FINN is an equal opportunity employer. We embrace and celebrate diversity and are committed to creating an inclusive environment for all employees. We are open to all groups of people without regard to age, color, national origin, race, religion, gender, sex, sexual orientation, gender identity and/or expression, marital status, or any other legally protected characteristics.</p> €85,000 - €94,000 a year<small>Additionally, you will benefit from virtual company shares (VSOP - Virtual Stock Option Plan).
 
Your individual placement within this range will be determined during the application process and is based on your experience, qualifications, and specific expertise. The stated range reflects our current planning at the time of publication; we reserve the right to make future adjustments in line with market developments.</small><div
`.trim(),
        location: "Munich, Germany",
        department: "Tech",
        jobType: "FULL_TIME",
        remotePolicy: "ONSITE",
        stipend: "Not specified",
        duration: "Permanent",
        applyUrl: "https://jobs.lever.co/finn/2c8b9d92-9b7f-47c8-a5fc-03203d33a8a8",
      },
      {
        slug: "finn-senior-product-manager-operations",
        title: "Senior Product Manager (m/f/x) Operations",
        description: `
<span><strong>Your Role</strong></span><span>As a Senior Product Manager - Operations (m/f/x), you own the digital architecture and systems that control how every single FINN vehicle transitions from the manufacturer to a ready-to-deliver state. This role sits directly at the intersection of software and physical reality, managing the complex operational flow of thousands of cars across partner compounds and logistics sites. By transforming real-world bottlenecks into highly automated software solutions, you will directly optimize our unit economics and ensure we hit our delivery promises to our customers.</span><h3>Your Mission</h3><ul><li><p data-path-to-node="3,0,0"><strong data-path-to-node="3,0,0" data-index-in-node="0">Translate complex operations into scalable tech:</strong> Build a deep understanding of our online workflows and compound realities to engineer robust product requirements that handle edge cases and peak volume constraints.</p></li><li><p data-path-to-node="3,1,0"><strong data-path-to-node="3,1,0" data-index-in-node="0">Build predictive, high-trust inflow systems:</strong> Move beyond manual firefighting by architecting systems that anticipate compound bottlenecks, surface logistics risks early, and dynamically adapt to capacity constraints.</p></li><li><p data-path-to-node="3,2,0"><strong data-path-to-node="3,2,0" data-index-in-node="0">Protect the end-customer experience:</strong> Connect deeply operational root causes directly to subscriber impact, ensuring that software trade-offs always prioritize and protect the moment of truth at the customer's doorstep.</p></li><li><p data-path-to-node="3,3,0"><strong data-path-to-node="3,3,0" data-index-in-node="0">Define the operations product vision:</strong> Shape and drive the strategic roadmap for how FINN's fulfillment layer runs at scale, establishing clear OKRs that directly move the needle on company growth and unit economics.</p></li><li><p data-path-to-node="3,4,0"><strong data-path-to-node="3,4,0" data-index-in-node="0">Bridge the gap between Tech and Field Operations:</strong> Collaborate closely with a cross-functional team of engineering, design, and data to ensure software products seamlessly land and succeed with operators in the field.</p></li><li><p data-path-to-node="3,5,0"><strong data-path-to-node="3,5,0" data-index-in-node="0">Maximize data self-service and throughput:</strong> Formulate performance hypotheses, pull and analyze your own process data using platforms like Looker, and use metrics to consistently pressure-test operational efficiency.</p></li></ul><h3>Your Profile</h3><strong data-path-to-node="5" data-index-in-node="0">Must-have:</strong><ul><li data-path-to-node="6,0,0"><strong data-path-to-node="6,0,0" data-index-in-node="0">Extensive operational product track record:</strong> Deep, proven experience in product management with a strong record of owning fulfillment, supply chain, internal tooling, or logistics products at scale.</li><li data-path-to-node="6,1,0"><strong data-path-to-node="6,1,0" data-index-in-node="0">Deep process &amp; commercial acumen:</strong> Solid understanding of real-world physical operations (e.g., automotive, warehousing, fulfillment, or last-mile) coupled with strong instincts for unit economics and logistics throughput.</li><li data-path-to-node="6,2,0"><strong data-path-to-node="6,2,0" data-index-in-node="0">Data-driven analytical capabilities:</strong> Highly proficient in analytical data self-service, with a natural habit of pulling your own data, building hypotheses, and navigating platforms like Looker (or similar analytics tools).</li><li data-path-to-node="6,3,0"><strong data-path-to-node="6,3,0" data-index-in-node="0">Impact-driven cross-functional communicator:</strong> Outstanding communication and alignment skills in English, with a strong ability to break down complex issues into actionable steps and take total end-to-end ownership of outcomes.</li></ul><strong data-path-to-node="7" data-index-in-node="0">Nice-to-have:</strong> 
<ul><li><strong data-path-to-node="7" data-index-in-node="17">German language proficiency:</strong> Professional fluency or strong communication skills in German to optimize collaboration with local compound and logistics partners. </li><li><strong data-path-to-node="7" data-index-in-node="181">AI-native workflow integration:</strong> Demonstrated ability to leverage AI tools within your daily discovery, documentation, and product execution routines to maximize speed and quality.</li></ul><h3>WHY FINN</h3><ul><li><p><strong data-path-to-node="2,0,0" data-index-in-node="0">Shared Success (VSOP Equity Program):</strong> We win together. Through our Virtual Stock Option Program, you benefit directly from the long-term growth and success of FINN.</p></li><li><p><strong data-path-to-node="2,1,0" data-index-in-node="0">Fuel your Growth (1.500€ Development Budget):</strong> Standing still is not an option. With an annual development budget of <strong>1.500</strong><strong data-path-to-node="2,1,0" data-index-in-node="113">€ for further training and seminars</strong>, you decide how you want to grow personally and professionally.</p></li><li><p><strong data-path-to-node="2,2,0" data-index-in-node="0">Family First (Childcare Subsidy &amp; Flexibility):</strong> We support you and your family. Benefit from a monthly <strong data-path-to-node="2,2,0" data-index-in-node="103">childcare subsidy</strong>, exclusive access to daycare spots in <strong data-path-to-node="2,2,0" data-index-in-node="159">Munich</strong>, and maximum flexibility to balance work and family life stress-free.</p></li><li><p><strong data-path-to-node="2,3,0" data-index-in-node="0">Company Pension Scheme (bAV):</strong> We think about your future. FINN subsidizes your company pension plan with a strong <strong data-path-to-node="2,3,0" data-index-in-node="114">employer contribution of 66%</strong>.</p></li><li><p><strong data-path-to-node="2,4,0" data-index-in-node="0">Experience our Product (25% Car Subscription Discount):</strong> Become a FINN driver yourself! You will receive a generous <strong data-path-to-node="2,4,0" data-index-in-node="115">employee discount of 25% on your car subscription</strong> or can alternatively take advantage of our attractive <strong data-path-to-node="2,4,0" data-index-in-node="219">bike leasing</strong> scheme.</p></li><li><p><strong data-path-to-node="2,5,0" data-index-in-node="0">Health &amp; Mindset (Sports &amp; Wellbeing):</strong> Your energy is our drive. Benefit from a subsidized <strong data-path-to-node="2,5,0" data-index-in-node="91">EGYM Wellpass membership</strong> for fitness and sports, as well as professional mental health support.</p></li><li><p><strong data-path-to-node="2,6,0" data-index-in-node="0">Munich Office Life:</strong> Barista-style coffee, matcha, and the legendary fruit basket await you at our modern headquarters in <strong data-path-to-node="2,6,0" data-index-in-node="157">Munich</strong>. On top of that, there is a daily <strong data-path-to-node="2,6,0" data-index-in-node="198">allowance for your lunch (lunch subsidy)</strong>.</p></li><li><strong data-path-to-node="2,7,0" data-index-in-node="0">Team Spirit &amp; Corporate Events:</strong> We are more than just colleagues. Whether it's summer events by the lake or simply a relaxed after-work drink. We celebrate our milestones together at regular <strong data-path-to-node="2,7,0" data-index-in-node="192">team events</strong>.</li></ul><h3>About Us</h3><p>FINN is Germany’s leading car subscription platform and one of the country's few unicorns in the mobility sector. With over 400 colleagues from more than 50 nations, we are building the future of mobility and making access to your own car more seamless than ever before.<br><br aria-hidden="true">What truly makes us proud, however, isn’t just the numbers, but what lies behind them: our strong team drive, the will to challenge the status quo, and the ambition to make a real difference.<br><br aria-hidden="true">With us, you have the opportunity to take on direct responsibility in one of the fastest-growing scale-ups in Germany and actively shape our success story. We´re just getting started!<br><br>More information: <a rel="noopener noreferrer" href="https://www.finn.com/">www.finn.com</a></p><p> </p><h3><strong>Equal Opportunities for Everyone</strong></h3><p>FINN is an equal opportunity employer. We embrace and celebrate diversity and are committed to creating an inclusive environment for all employees. We are open to all groups of people without regard to age, color, national origin, race, religion, gender, sex, sexual orientation, gender identity and/or expression, marital status, or any other legally protected characteristics.</p> €85,000 - €94,000 a year<small>Additionally, you will benefit from virtual company shares (VSOP - Virtual Stock Option Plan).
 
Your individual placement within this range will be determined during the application process and is based on your experience, qualifications, and specific expertise. The stated range reflects our current planning at the time of publication; we reserve the right to make future adjustments in line with market developments.</small><div
`.trim(),
        location: "Munich, Germany",
        department: "Tech",
        jobType: "FULL_TIME",
        remotePolicy: "ONSITE",
        stipend: "Not specified",
        duration: "Permanent",
        applyUrl: "https://jobs.lever.co/finn/ea3b24dc-8cba-43b4-a314-61045c1ab282",
      },
    ],
  },
  {
    slug: "tines",
    name: "Tines",
    tagline: "The intelligent workflow platform",
    about:
      "Tines is a no-code workflow automation platform that applies AI, automation, and integration to help security, IT, and engineering teams build and run powerful workflows without writing code. Born in security, it's now used across security operations, IT, and engineering teams at companies like Canva, Databricks, Elastic, and McKesson. Founded in 2018, Tines is co-headquartered in Dublin, Ireland and Boston, Massachusetts, and reached a $1.13 billion valuation with its Series C round led by Goldman Sachs and SoftBank in February 2025.",
    logoUrl: "https://www.tines.com/icons/icon-256x256.png",
    fundingStage: "SERIES_C_PLUS",
    remotePolicy: "REMOTE",
    visaSponsorship: false,
    employeeCountRange: "501-1000",
    websiteUrl: "https://www.tines.com",
    categories: ["infrastructure", "devtools"],
    technologies: ["ruby", "typescript", "aws", "docker"],
    location: { city: "Dublin", country: "Ireland" },
    founders: [
      { name: "Eoin Hinchy", title: "Co-founder & CEO" },
      { name: "Thomas Kinsella", title: "Co-founder & CCO" },
    ],
    links: [
      { type: "linkedin", url: "https://www.linkedin.com/company/tines-io/" },
      { type: "twitter", url: "https://twitter.com/tines_hq" },
      { type: "youtube", url: "https://www.youtube.com/@TinesHQ" },
    ],
    internships: [
      {
        slug: "tines-senior-site-reliability-engineer-government-cloud",
        title: "Senior Site Reliability Engineer - Government Cloud",
        description: `
<p>Join the team building and operating the AWS GovCloud environment for Tines' federal customers. You'll own infrastructure-as-code, container pipelines, and day-to-day operations while shaping technical direction and company culture. You can work fully remotely from anywhere in the US, with a preference for being based in the Greater Boston Area.</p>
<h3>Key Responsibilities</h3>
<ul>
<li>Build and operate the AWS GovCloud environment, from foundational network architecture through production-ready infrastructure</li>
<li>Design and implement repeatable infrastructure-as-code for dedicated customer environments</li>
<li>Own the container image pipeline: building, hardening, scanning, and promoting FIPS-compliant images via CI/CD</li>
<li>Identify and fix availability risks; ensure environments remain healthy, observable, and auditable</li>
<li>Work with assessment partners on FedRAMP authorization documentation and architecture diagrams</li>
<li>Enable product engineers building features across commercial and government environments</li>
<li>Define separation of compliance-restricted functions from day-to-day engineering operations</li>
<li>Support self-hosted federal customers in a CMMC environment; handle escalations and on-call responsibilities</li>
</ul>
<h3>Required Qualifications</h3>
<ul>
<li>5+ years in infrastructure, DevOps, or cloud engineering with meaningful AWS experience</li>
<li>Hands-on experience designing VPC architectures and operating AWS services in production</li>
<li>Infrastructure-as-code experience (CDK or Terraform) in compliance environments</li>
<li>Understanding of compliance-regulated environments (FedRAMP, FISMA, or similar)</li>
<li>Comfort with container image pipelines and hardening practices</li>
<li>Clear writing skills for technical documentation and assessments</li>
<li>Broad technical foundation and willingness to learn across the stack</li>
</ul>
<p><strong>Salary Range:</strong> $210,000 - $220,000 + equity</p>
`.trim(),
        location: "United States - East (Remote)",
        department: "Engineering",
        jobType: "FULL_TIME",
        remotePolicy: "REMOTE",
        stipend: "Not specified",
        duration: "Permanent",
        applyUrl: "https://job-boards.greenhouse.io/tines/jobs/6019545004",
      },
      {
        slug: "tines-senior-software-engineer-government-cloud",
        title: "Senior Software Engineer - Government Cloud",
        description: `
<p>Tines is seeking a software engineer to join the team bringing Tines to federal customers in AWS GovCloud. The role focuses on building product features and tooling that let Tines run seamlessly in compliance-regulated environments while preserving the experience commercial users get. You can work fully remotely from anywhere in the US, with a preference for being based in the Greater Boston Area.</p>
<h3>What You Will Be Doing</h3>
<ul>
<li>Design, build, and harden product features within compliance-regulated cloud environments, with emphasis on security controls, data privacy, and auditability</li>
<li>Build AWS GovCloud-specific features including federal authentication methods, audit capabilities, and tenant operation tooling</li>
<li>Create abstractions that reduce friction for engineers authoring and testing government cloud features without direct access</li>
<li>Enable seamless feature development across commercial and government environments through observability and logging solutions</li>
<li>Analyze applications for security gaps and implement hardening measures meeting government standards</li>
<li>Collaborate cross-functionally to translate compliance requirements into engineering solutions</li>
<li>Mentor engineers on secure design patterns for regulated environments</li>
<li>Support self-hosted federal customers and handle on-call responsibilities</li>
</ul>
<h3>Key Requirements</h3>
<ul>
<li>Approximately 7+ years of professional software engineering experience as a senior-level engineer</li>
<li>Direct experience building software using high-level programming languages</li>
<li>Experience in compliance-regulated or security-sensitive environments (FedRAMP, FISMA, SOC 2, HIPAA) preferred</li>
<li>Demonstrated ability reasoning about application-layer security</li>
<li>Curiosity and eagerness to learn across diverse technical domains</li>
<li>Customer-focused approach with willingness to investigate complex technical issues</li>
<li>U.S. citizenship required; applicants must work within the United States</li>
</ul>
<p><strong>Target salary range:</strong> $210,000 - $220,000 + equity</p>
`.trim(),
        location: "United States (Remote)",
        department: "Engineering",
        jobType: "FULL_TIME",
        remotePolicy: "REMOTE",
        stipend: "Not specified",
        duration: "Permanent",
        applyUrl: "https://job-boards.greenhouse.io/tines/jobs/6017339004",
      },
      {
        slug: "tines-software-engineer-backend",
        title: "Software Engineer (back-end)",
        description: `
<p>Join the team responsible for scaling the throughput and performance of the backend job processing system and code execution engines that power Tines' intelligent workflows. This role extends beyond coding to shaping technical direction, product, and culture within a collaborative engineering team. You can work fully remotely from anywhere in Ireland, with optional access to Dublin office space.</p>
<h3>Key Responsibilities</h3>
<ul>
<li>Influence technical direction for critical systems</li>
<li>Deploy production changes within minutes of merging code</li>
<li>Shape job and code execution at the core of the application</li>
<li>Write and review high-quality, well-tested code</li>
<li>Identify improvements in the codebase and team processes</li>
<li>Own problems through to production, responding to customer feedback</li>
</ul>
<h3>Potential Projects</h3>
<ul>
<li>Build high-availability systems supporting massive data throughput</li>
<li>Improve action throughput for scaling customers</li>
<li>Create job prioritization controls for workflow execution</li>
<li>Build customer code execution features</li>
<li>Ensure fair, balanced job execution in multitenant stacks</li>
<li>Share engineering learnings via blog posts</li>
</ul>
<h3>Requirements</h3>
<ul>
<li>6+ years of professional software engineering experience</li>
<li>Background in Linux systems, container runtimes, filesystems, low-level system primitives, or debugging</li>
<li>Willingness to work across the full stack when needed</li>
<li>Focus on solving important problems pragmatically</li>
<li>Collaborative, inclusive approach to teamwork</li>
</ul>
<h3>What Tines Values</h3>
<p>Simplicity, Speed, and Soundness — with an emphasis on sustainable work practices, engineer productivity, and an inclusive culture.</p>
`.trim(),
        location: "Ireland (Remote)",
        department: "Engineering",
        jobType: "FULL_TIME",
        remotePolicy: "REMOTE",
        stipend: "Not specified",
        duration: "Permanent",
        applyUrl: "https://job-boards.greenhouse.io/tines/jobs/6108006004",
      },
      {
        slug: "tines-staff-software-engineer-backend",
        title: "Staff Software Engineer (backend)",
        description: `
<p>Founded in 2018 with co-headquarters in Dublin and Boston, Tines powers some of the world's most important workflows. The intelligent workflow platform applies AI, automation, and integration with human ingenuity to drive real business results, serving customers including Canva, Databricks, Elastic, Kayak, Intercom, and McKesson.</p>
<p>Join the team responsible for scaling the throughput and performance of the backend job processing system and code execution engines. This role carries an influential voice in shaping technical direction, product, and culture within a small, growing software engineering organization. You can work fully remotely from anywhere in EST states, with a preference for the Boston area.</p>
<h3>Responsibilities</h3>
<ul>
<li>Lead technical direction for critical systems</li>
<li>Make valuable codebase changes deployed to production within minutes</li>
<li>Shape job and code execution at the core of the application</li>
<li>Write and review high-quality, well-tested code</li>
<li>Identify improvement areas in the codebase and team workflows</li>
<li>Own problems from conception through production and customer feedback</li>
<li>Mentor other engineers on the team</li>
</ul>
<h3>Projects You Might Work On</h3>
<ul>
<li>Build robust, high-availability systems supporting massive data throughput</li>
<li>Improve action throughput for growing customer scale</li>
<li>Create controls enabling job prioritization configuration</li>
<li>Build features allowing customer code execution</li>
<li>Ensure balanced, fair job execution on multitenant stacks</li>
<li>Write blog posts sharing engineering learnings with the community</li>
</ul>
<h3>Requirements</h3>
<ul>
<li><strong>10+ years of professional software engineering experience</strong> with a proven staff-level track record</li>
<li>Preferred expertise in Linux systems (namespaces, file descriptors, Unix sockets, mounts, networking, process isolation), container runtimes/orchestration, filesystem and storage internals, or low-level system primitives in Rust or Go</li>
<li>Strong debugging skills for complex kernel, runtime, and storage issues</li>
<li>Willingness to work across the full stack despite a specialized backend focus</li>
<li>Commitment to solving important problems pragmatically, with a focus on engineer productivity and developer experience</li>
</ul>
<h3>Technology Stack</h3>
<p>Ruby, Rails, React, TypeScript, Rust, Go, Postgres, Redis, AWS CDK, and Docker.</p>
<p><strong>Target salary range:</strong> $230,000 - $250,000 + equity</p>
`.trim(),
        location: "United States (Remote)",
        department: "Engineering",
        jobType: "FULL_TIME",
        remotePolicy: "REMOTE",
        stipend: "Not specified",
        duration: "Permanent",
        applyUrl: "https://job-boards.greenhouse.io/tines/jobs/6014045004",
      },
      {
        slug: "tines-senior-product-security-engineer",
        title: "Senior Product Security Engineer",
        description: `
<p>Tines is looking for a Senior Product Security Engineer passionate about building and scaling robust security programs in an AI-forward engineering environment. Reporting to the Head of IT Operations & Information Security, this role leads efforts to mature product security initiatives as the product expands, ensuring security keeps pace with AI-assisted development workflows. This position can be based remotely in the United States.</p>
<h3>Key Responsibilities</h3>
<ul>
<li>Partner with product and engineering teams to integrate security throughout the development lifecycle</li>
<li>Leverage AI and automation to scale product security coverage across engineering</li>
<li>Design and implement security controls and architecture that scale with product portfolio growth</li>
<li>Conduct comprehensive security reviews and threat modeling to identify vulnerabilities, including risks from AI-generated code</li>
<li>Contribute to vulnerability management, including triaging bug bounty reports and driving remediation</li>
<li>Develop automated security testing, monitoring, and response capabilities</li>
<li>Serve as incident responder during security events and lead post-incident reviews</li>
<li>Champion security awareness and provide technical guidance on secure AI-assisted development</li>
</ul>
<h3>Qualifications</h3>
<ul>
<li>8+ years in application or product security roles with cloud-native application expertise</li>
<li>Strong understanding of modern application security principles, OWASP Top 10, and secure SDLC</li>
<li>Experience leveraging AI and automation to scale security programs</li>
<li>Cloud security expertise (AWS preferred) and containerized environment experience</li>
<li>Proficiency in modern programming languages; Ruby, TypeScript, and/or Rust highly desirable</li>
<li>Knowledge of security testing methodologies (SAST, DAST, SCA) and CI/CD security integration</li>
<li>Strong incident response skills and on-call rotation experience</li>
</ul>
<h3>Nice to Haves</h3>
<ul>
<li>Experience securing AI/ML systems and LLM-powered features, including LLM red-teaming and AI threat modeling</li>
<li>Hands-on agentic or automated security workflow building</li>
<li>Open-source security contributions or security research participation</li>
<li>Bug bounty triage or VDP/bug bounty program management</li>
<li>Multi-tenant SaaS security or FedRAMP/DoD Impact Level environment experience</li>
</ul>
<p><strong>Target Annual Compensation:</strong> $218,000 - $235,000 + equity</p>
<p>Applicants for this opportunity must be authorized to work for any employer in the U.S. Tines is unable to sponsor or take over sponsorship of an employment visa at this time.</p>
`.trim(),
        location: "United States (Remote)",
        department: "Technology",
        jobType: "FULL_TIME",
        remotePolicy: "REMOTE",
        stipend: "Not specified",
        duration: "Permanent",
        applyUrl: "https://job-boards.greenhouse.io/tines/jobs/6011382004",
      },
      {
        slug: "tines-senior-security-operations-engineer",
        title: "Senior Security Operations Engineer",
        description: `
<p>Founded in 2018 with co-headquarters in Dublin and Boston, Tines powers some of the world's most important workflows, applying AI, automation, and integration with human ingenuity to drive real business results.</p>
<p>Tines is looking for a Senior Security Operations Engineer passionate about security and automation to help grow and mature its security program, reporting to the Security Operations Manager. You'll have the opportunity to make your mark and build new projects from the ground up.</p>
<h3>What You'll Be Doing</h3>
<ul>
<li>Drive security projects that facilitate the business function and protect customers, brand, and employees</li>
<li>Stay apprised of security trends and incidents, reviewing and implementing controls based on lessons learned</li>
<li>Perform security reviews of infrastructure and product features to ensure high standards</li>
<li>Assist with updating policies and procedures to maintain Tines' security standards</li>
<li>Scale detection and response capabilities across the environment and systems</li>
<li>Track and drive vulnerability remediation across production and corporate environments, partnering with engineering and infrastructure teams</li>
<li>Assist with security training and keeping employees up to date on the latest threats</li>
<li>Act as an escalation point for automated detections raised for human review, and proactively hunt for threats</li>
<li>Perform regular on-call duties, including incident commander responsibilities during security incidents</li>
<li>Ensure security controls are deployed and tested across cloud environments and corporate endpoints — automating as much of this as possible using Tines itself</li>
</ul>
<h3>What You Bring</h3>
<ul>
<li>8+ years in a security role managing complex cloud environments</li>
<li>Deep familiarity with cloud security, including deploying, managing, securing, and monitoring services in AWS or Azure</li>
<li>Familiarity with securing container technologies like Docker, AWS ECS, and Kubernetes</li>
<li>Skilled with AWS (or similar) security management and monitoring tools such as CloudTrail, GuardDuty, CloudWatch, Security Hub, Inspector, and Config</li>
<li>Experience implementing and monitoring controls around frameworks such as SOC2, ISO, CMMC, and FedRAMP</li>
<li>Background automating security tasks with SOAR tools and/or languages like Python/Go</li>
<li>Knowledge of command-line, log analysis, common attacks, and OS hardening for Linux and macOS</li>
<li>Experience working an on-call rotation in a fast-paced environment</li>
</ul>
<p><strong>Target Salary:</strong> $160,000 - $170,000</p>
<p>Due to the nature of this role and associated U.S. Government customer requirements, applicants must be U.S. citizens and must perform work while located within the United States.</p>
`.trim(),
        location: "United States (Remote)",
        department: "Technology",
        jobType: "FULL_TIME",
        remotePolicy: "REMOTE",
        stipend: "Not specified",
        duration: "Permanent",
        applyUrl: "https://job-boards.greenhouse.io/tines/jobs/5973812004",
      },
    ],
  },
  {
    slug: "wayflyer",
    name: "Wayflyer",
    tagline: "Revenue-based financing for e-commerce brands",
    about:
      "Wayflyer gives e-commerce and consumer brands fast, non-dilutive financing based on their real revenue performance, assessing businesses in minutes and sending funds in as little as 24 hours. Founded in 2019 by Aidan Corbett and Jack Pierse, Wayflyer has deployed over $6 billion to thousands of businesses worldwide, backed by Tier 1 banks including J.P. Morgan. It's headquartered in Dublin, Ireland, with offices in London, New York, Charlotte, Berlin, and Sydney.",
    logoUrl: "https://wayflyer.com/apple-icon.png",
    fundingStage: "SERIES_C_PLUS",
    remotePolicy: "HYBRID",
    visaSponsorship: false,
    employeeCountRange: "201-500",
    websiteUrl: "https://wayflyer.com",
    categories: ["fintech"],
    technologies: ["python", "django", "react", "typescript", "postgres", "aws"],
    location: { city: "Dublin", country: "Ireland" },
    founders: [
      { name: "Aidan Corbett", title: "Co-founder & CEO" },
      { name: "Jack Pierse", title: "Co-founder" },
    ],
    links: [
      { type: "linkedin", url: "https://www.linkedin.com/company/wayflyer" },
      { type: "twitter", url: "https://twitter.com/wayflyerapp" },
    ],
    internships: [
      {
        slug: "wayflyer-backend-software-engineer",
        title: "Backend Software Engineer",
        description: `
<h3>About Wayflyer</h3><p>Today's small businesses need a capital provider that keeps pace with their growth ambitions. Traditional financing options are slow, cumbersome and often out of reach. That's why we built Wayflyer.</p><p>Our technology allows us to assess businesses in minutes, generate financing offers that reflect their growth potential and send funds in as little as 24 hours. To date, we've deployed over $6bn to thousands of businesses worldwide, backed by Tier 1 banks like J.P. Morgan.</p><p>You'll be collaborating with ambitious colleagues from around the world. We have offices in Dublin, London, New York, Charlotte, Berlin and Sydney.</p><h3>The challenge</h3><p>We assess businesses in minutes and send funds in as little as 24 hours. The systems that make that possible need to be fast, reliable, and built to scale as we grow into new markets.</p><h3>What you'll actually do</h3><ul><li>Design and develop scalable backend services using Python and Django, focusing on our core financial products</li><li>Build and maintain RESTful APIs that power our customer-facing applications and internal tools</li><li>Implement robust data models and database schemas to support our financial services infrastructure</li><li>Write clean, testable code with comprehensive unit and integration tests</li><li>Collaborate with cross-functional teams to design and implement new features and improvements</li><li>Optimize application performance and ensure high availability of our services</li><li>Participate in code reviews and contribute to technical documentation</li><li>Monitor and maintain production systems, ensuring reliability and security</li></ul><h3>Who thrives here</h3><p>You should be comfortable making and defending technical decisions, while remaining open to feedback and alternative approaches. You'll need to balance technical excellence with business needs and help guide the team toward pragmatic solutions.</p><p>You excel at stakeholder management and can effectively communicate technical concepts to non-technical audiences. You're proactive in identifying and addressing potential issues before they become problems.</p><p>We look for candidates with most or all of the below traits that can point to real experience applying them.</p><ul><li>Bachelor's degree in Computer Science, Engineering, or related field, or equivalent practical experience</li><li>5+ years of professional experience in backend development with Python</li><li>Strong proficiency in Django, or other Python API frameworks (e.g. FastAPI, Flask)</li><li>Experience with SQL databases (preferably PostgreSQL) and ORM frameworks</li><li>Knowledge of API design principles and microservices architecture</li><li>Experience with AWS or similar cloud platforms</li><li>Solid understanding of version control with Git</li><li>Experience with testing frameworks (e.g., pytest, unittest)</li><li>Understanding of security best practices and data protection</li><li>Strong problem-solving skills and attention to detail</li><li>Excellent communication abilities and proven track record of successful team collaboration</li></ul><p>Given what we do, experience in financial services, fintech and business-to-business organisations is particularly interesting to us.</p><h3>What this role could turn into</h3><p>Engineers here tend to grow in the direction they're most interested in - whether that's deepening technical specialism, moving into architecture, or taking on more cross-functional ownership as we scale.</p><h3>Location and working policy</h3><p>Fully remote, Europe.</p><h3>The good stuff</h3><p>25 days off, plus public holidays. Private healthcare, life insurance, and a pension. Equity - because you should own a piece of what you're building. Generous parental leave for primary and secondary caregivers. 60 days a year to work abroad from wherever you want.</p>
`.trim(),
        location: "Remote Europe",
        department: "Technology",
        jobType: "FULL_TIME",
        remotePolicy: "REMOTE",
        stipend: "Not specified",
        duration: "Permanent",
        applyUrl: "https://jobs.ashbyhq.com/wayflyer/8b4052a5-9e11-4acd-babc-963e5f5111ba",
      },
      {
        slug: "wayflyer-frontend-software-engineer",
        title: "Frontend Software Engineer",
        description: `
<h3>About Wayflyer</h3><p>Today's small businesses need a capital provider that keeps pace with their growth ambitions. Traditional financing options are slow, cumbersome and often out of reach. That's why we built Wayflyer.</p><p>Our technology allows us to assess businesses in minutes, generate financing offers that reflect their growth potential and send funds in as little as 24 hours. To date, we've deployed over $6bn to thousands of businesses worldwide, backed by Tier 1 banks like J.P. Morgan.</p><p>You'll be collaborating with ambitious colleagues from around the world. We have offices in Dublin, London, New York, Charlotte, Berlin and Sydney.</p><h3>The challenge</h3><p>When a founder logs into Wayflyer, what they see, and how easily they can make sense of it, directly affects whether they trust us with their business. We're building financial products that need to feel effortless.</p><h3>What you'll actually do</h3><ul><li>Provide technical leadership in architectural decisions and champion our existing frontend best practices, advocating for our standards and helping push them forward across the team</li><li>Lead the design and implementation of complex frontend features using TypeScript and React, ensuring high-quality, reusable components that scale across our financial products</li><li>Partner with product and design teams to shape product outcomes, defining intuitive experiences that help e-commerce brands access and manage their funding. This goes beyond delivering UI; every engineer here plays a meaningful role in what we build and how it serves our customers</li><li>Own end-to-end delivery: shape solutions with product/design, build and test, ship to production and monitor/iterate using our observability stack</li><li>Drive improvements in performance, accessibility, and user experience across our platform</li><li>Mentor engineers across the team and conduct thorough code reviews to maintain high quality standards</li><li>Work closely alongside our backend engineers, contributing across the stack when needed. We actively encourage curiosity and flexibility about where you can add value</li><li>Lead technical discussions and contribute to the team's technical strategy</li><li>Identify and proactively address technical debt and system scalability challenges</li></ul><h3>Who thrives here</h3><p>You should be comfortable making and defending technical decisions, while remaining open to feedback and alternative approaches. You'll need to balance technical excellence with business needs and help guide the team toward pragmatic solutions.</p><p>You excel at stakeholder management and can effectively communicate technical concepts to non-technical audiences. You're proactive in identifying and addressing potential issues before they become problems. We look for candidates with most or all of the below traits that can point to real experience applying them.</p><ul><li>Bachelor's degree in Computer Science, Engineering, or related field, or equivalent practical experience</li><li>5+ years of experience with deep expertise in frontend development</li><li>Advanced proficiency in TypeScript and extensive experience with React and modern frontend architectures</li><li>Expert knowledge of HTML5, CSS3 and JavaScript fundamentals with a focus on performance optimisation</li><li>Strong experience designing and implementing RESTful APIs and managing complex state, including hands-on experience with TanStack Query</li><li>Experience contributing to and working with design systems</li><li>Familiarity with backend technologies (Python, Django) and a willingness to contribute across the stack. This isn't a hard requirement, but that flexibility matters to us.</li><li>Experience with CI/CD pipelines (especially GitHub Actions) and maintaining high-quality testing practices using tools like Storybook/Chromatic, Playwright, and Vitest</li><li>Proven track record of leading technical initiatives and mentoring engineers</li><li>Strong problem-solving skills with the ability to break down complex problems</li><li>Excellent communication abilities and experience managing stakeholder relationships</li></ul><p>Given what we do, experience in financial services, fintech and business-to-business organisations is particularly interesting to us.</p><h3>What this role could turn into</h3><p>Frontend engineers here tend to grow in a few different directions: shaping architecture across multiple products, moving into staff or principal engineering tracks, or stepping into engineering management. Some engineers want to go deep on the technical track; others find their strengths pull them toward leading and growing people. We support both paths, and the direction depends on where your interests are strongest.</p><h3>Location and working policy</h3><p>Fully remote, Europe.</p><h3>The good stuff</h3><p>25 days off, plus public holidays. Private healthcare, life insurance, and a pension. Equity - because you should own a piece of what you're building. Generous parental leave for primary and secondary caregivers. 60 days a year to work abroad from wherever you want.</p>
`.trim(),
        location: "Remote Europe",
        department: "Technology",
        jobType: "FULL_TIME",
        remotePolicy: "REMOTE",
        stipend: "Not specified",
        duration: "Permanent",
        applyUrl: "https://jobs.ashbyhq.com/wayflyer/f907ed95-7d42-45da-ba6c-983d7e0d31aa",
      },
      {
        slug: "wayflyer-senior-credit-risk-data-scientist",
        title: "Senior Credit Risk Data Scientist",
        description: `
<h3>About Wayflyer</h3><p>Today's small businesses need a capital provider that keeps pace with their growth ambitions. Traditional financing options are slow, cumbersome and often out of reach. That's why we built Wayflyer.</p><p>Our technology allows us to assess businesses in minutes, generate financing offers that reflect their growth potential and send funds in as little as 24 hours. To date, we've deployed over $6bn to thousands of businesses worldwide, backed by Tier 1 banks like J.P. Morgan.</p><p>You'll be collaborating with ambitious colleagues from around the world. We have offices in Dublin, London, New York, Charlotte, Berlin and Sydney.</p><h3>The challenge</h3><p>Wayflyer has deployed over $6bn in funding and we're not slowing down. Every credit decision we make is a bet on a business's real trajectory, and the models behind those bets need to get sharper and faster than they were yesterday. We're building the next generation of commercial credit, with AI running through every layer of the stack.</p><h3>What you'll actually do</h3><p>You'll own the full lifecycle of our credit risk models. We treat Machine Learning as a branch of software engineering here, so you'll write production-grade code, not just notebooks.</p><ul><li>Lead the end-to-end build of credit risk models, treating ML as software engineering so everything you ship is fast, reproducible and robust</li><li>Design modelling frameworks for decisioning, pricing and fraud that move company-wide P&amp;L, not just a dashboard metric</li><li>Build credit policies and lending strategies that expand our addressable market safely, pushing conversion and profitability up together</li></ul><p>Scientific integrity is non-negotiable. Model improvements need to be statistically significant, with no data leakage and no bias hiding in the numbers. You'll turn technical findings into business trade-offs leadership can act on, mapping ROC AUC straight to revenue and loss, and you'll set the bar for code quality: reviewing, mentoring, and contributing to the libraries the whole team relies on.</p><p>You'll stand out if you've worked on highly automated lending, price sensitivity modelling, or Customer Lifetime Value.</p><h3>What this role could turn into</h3><p>Senior Data Scientists here tend to grow into Staff or leadership roles with broader influence over risk strategy and team direction. We're building a quantitative risk function that genuinely drives P&amp;L. The people who shape it early will have significant influence over where it goes.</p><h3>Who thrives here</h3><ul><li>Gets restless when a model is "good enough" but not great</li><li>4+ years building and maintaining production-grade ML systems</li><li>Cares as much about code quality as the statistics behind it</li><li>Strong grip on predictive modeling and credit risk concepts (IV, ROC AUC, SHAP, PD, EAD, LGD, EL)</li><li>As comfortable in a modern monorepo (Python, SQL, Snowflake, dbt, and the rest of the stack) as a software engineer would be</li><li>Would rather walk a commercial stakeholder through a ROC AUC curve and make them care about the revenue impact than hide behind jargon</li><li>Uses AI as an accelerant, not a crutch</li><li>Comfortable owning outcomes, not just tickets</li></ul><h3>We hire for range</h3><p>You'll need real depth on credit risk concepts (PD, EAD, LGD), a solid grasp of modelling techniques like IV and SHAP, and comfort working across Snowflake, dbt, ZenML, Dagster and Weights &amp; Biases. Experience in automated lending, price sensitivity modelling or CLV is a strong plus.</p><h3>Location and working policy</h3><p>Dublin HQ or London, hybrid.</p><h3>The good stuff</h3><p>25 days off, plus public holidays. Private healthcare, life insurance, and a pension. Equity, because you should own a piece of what you're building. Generous parental leave for primary and secondary caregivers. 60 days a year to work abroad from wherever you want.</p>
`.trim(),
        location: "Dublin or London",
        department: "Technology",
        jobType: "FULL_TIME",
        remotePolicy: "HYBRID",
        stipend: "Not specified",
        duration: "Permanent",
        applyUrl: "https://jobs.ashbyhq.com/wayflyer/384acf8f-8762-4351-aa31-d957e92ce71e",
      },
      {
        slug: "wayflyer-senior-staff-product-designer",
        title: "Senior / Staff Product Designer",
        description: `
<h3>About Wayflyer</h3><p>Today's small businesses need a capital provider that keeps pace with their growth ambitions. Traditional financing options are slow, cumbersome and often out of reach. That's why we built Wayflyer.</p><p>Our technology allows us to assess businesses in minutes, generate financing offers that reflect their growth potential and send funds in as little as 24 hours. To date, we've deployed over $6bn to thousands of businesses worldwide, backed by Tier 1 banks like J.P. Morgan.</p><p>You'll be collaborating with ambitious colleagues from around the world. We have offices in Dublin, London, New York, Charlotte, Berlin and Sydney.</p><h3>The Challenge</h3><p>Wayflyer moves fast, and the product has to keep up. We're building financial tools that businesses actually rely on - complex workflows, dense data, high stakes - and we need a designer who can make all of that feel effortless. That's a hard problem. It's also a genuinely exciting one.</p><p>We're hiring at Senior+ or Staff level depending on where you are, what you've built, and how far your influence reaches.</p><h3>What You'll Actually Do</h3><ul><li>Own complex product problems from discovery through delivery, helping define what we build, why it matters, and how success is measured</li><li>Design end-to-end journeys, workflows, interaction models, and high-fidelity experiences across web and mobile products</li><li>Prototype concepts early and often to explore ideas, align stakeholders, and accelerate learning</li><li>Translate complex financial concepts, workflows, and data into intuitive and scalable user experiences</li><li>Contribute to and evolve our design system, balancing consistency with thoughtful innovation</li><li>Collaborate closely with engineers throughout implementation to ensure quality and thoughtful execution</li><li>Challenge assumptions and help shape product decisions with a long-term platform mindset</li><li>Participate in design critiques and contribute to a culture of feedback, learning, and continuous improvement</li><li>For Staff-level candidates, help elevate design quality across teams through influence, mentorship, and strategic design leadership</li></ul><h3>Who Thrives Here</h3><ul><li>You don't wait for perfect requirements and enjoy helping define the problem before designing the solution</li><li>You thrive in ambiguity and enjoy creating clarity where none exists</li><li>You have strong product instincts and can balance customer needs, business goals, and technical realities</li><li>You care deeply about design craft and believe details matter</li><li>You know that trust is built through hundreds of small interactions, especially in financial products</li><li>You believe simplification is one of the hardest and most valuable design skills</li><li>You are comfortable challenging assumptions, advocating for customers, and raising the quality bar when it matters</li><li>You enjoy collaborating across disciplines and influencing decisions through strong thinking and communication</li><li>You use AI as part of your workflow to learn, explore, prototype, and improve the quality of your work</li><li>You want to work in a fast-moving environment where initiative, curiosity, and impact are valued</li></ul><h3>How You Think and Work</h3><ul><li>You have experience designing digital products, ideally within fintech, banking, lending, payments, or similarly complex domains</li><li>You have a portfolio that demonstrates strong product thinking, interaction design excellence, and exceptional visual craft</li><li>You connect customer needs, business objectives, and technical constraints to create meaningful product outcomes</li><li>You are comfortable navigating ambiguity and independently driving work forward</li><li>You know how to simplify complexity without oversimplifying the problem</li><li>You use evidence, and data to inform decisions while maintaining strong product intuition</li><li>You communicate clearly, tell compelling stories, and can influence decisions across different audiences</li><li>You care about outcomes as much as outputs and understand how design contributes to business success</li><li>You continuously raise the bar for yourself and the people around you through feedback, collaboration, and high standards</li><li>Excellent communication and storytelling skills, with the ability to frame challenges and guide teams through decision making</li></ul><h3>Bonus Points</h3><ul><li>Experience designing lending, underwriting, credit, risk, payments, or financial operations products</li><li>Experience working in high-growth startup environments</li><li>Strong understanding of accessibility and inclusive design practices</li><li>Experience designing AI-powered products and understanding how emerging technologies can create meaningful customer and business value</li><li>Experience contributing to design systems, platform initiatives, or cross-product experiences at scale</li></ul><h3>Location and working policy</h3><p>Remote in Europe.</p><h3>The good stuff</h3><p>25 days off, plus public holidays. Private healthcare, life insurance, and a pension. Equity - because you should own a piece of what you're building. Generous parental leave for primary and secondary caregivers. 60 days a year to work abroad from wherever you want.</p>
`.trim(),
        location: "Remote Europe",
        department: "Technology",
        jobType: "FULL_TIME",
        remotePolicy: "REMOTE",
        stipend: "Not specified",
        duration: "Permanent",
        applyUrl: "https://jobs.ashbyhq.com/wayflyer/8379c33a-f708-4965-9acc-f63f10218d25",
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
