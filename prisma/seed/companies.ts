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
    technologies: ["python", "gcp"],
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
    technologies: ["python", "nodejs", "postgres"],
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
