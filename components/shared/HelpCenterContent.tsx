import { Mail } from "lucide-react";

const FAQS: { question: string; answer: string }[] = [
  {
    question: "How does company verification work?",
    answer:
      "Every company on Verity is manually reviewed before it appears in search or the directory. Once a company submits its profile, our team checks the details and either verifies it, requests changes, or rejects it — you'll see the outcome and reason on the company's verification status page.",
  },
  {
    question: "How do I bookmark a company or internship?",
    answer:
      "Click the bookmark icon on any company or internship card. Bookmarked items show up on your Bookmarks page, split into Companies and Internships tabs.",
  },
  {
    question: "How does the application tracker work?",
    answer:
      "Add any internship to your tracker and move it through stages — Saved, Applied, Interviewing, Offer, Rejected, or Withdrawn. Notes you add are private and never visible to companies or admins.",
  },
  {
    question: "Why can't I upload a resume directly?",
    answer:
      "Direct upload isn't available yet. In the meantime, paste a link to a resume hosted elsewhere (e.g. Google Drive, Dropbox) in your profile settings.",
  },
  {
    question: "I'm a company — how do I get verified faster?",
    answer:
      "Complete every required field in your company profile (locations, founders, funding stage, etc.) before submitting — incomplete submissions are the most common reason for delays or a request for changes.",
  },
];

/** Shared across student/company/admin portals — same static content, same shell chrome. */
export function HelpCenterContent() {
  return (
    <div className="max-w-2xl space-y-8">
      <div className="space-y-4">
        {FAQS.map((faq) => (
          <details key={faq.question} className="retro-card group p-4">
            <summary className="cursor-pointer list-none font-medium text-foreground marker:content-none">
              {faq.question}
            </summary>
            <p className="mt-2 text-body-sm text-muted-foreground">{faq.answer}</p>
          </details>
        ))}
      </div>

      <div className="retro-card flex items-center gap-4 p-4">
        <span className="grid size-10 shrink-0 place-items-center rounded-[3px] border-[3px] border-neutral-950 bg-tile-lavender">
          <Mail className="size-5 text-neutral-950" aria-hidden />
        </span>
        <div>
          <p className="font-medium text-foreground">Still need help?</p>
          <a
            href="mailto:support@verity.example.com"
            className="text-body-sm text-primary hover:underline"
          >
            support@verity.example.com
          </a>
        </div>
      </div>
    </div>
  );
}
