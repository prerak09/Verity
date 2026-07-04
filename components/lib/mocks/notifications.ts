import type { NotificationDTO } from "@/types";

const now = Date.now();
const hoursAgo = (n: number) => new Date(now - n * 3_600_000).toISOString();

export const MOCK_NOTIFICATIONS: NotificationDTO[] = [
  {
    id: "notif_1",
    type: "BOOKMARKED_COMPANY_NEW_INTERNSHIP",
    title: "Ledgerly posted a new internship",
    body: "Backend Engineering Intern — New York, NY (Hybrid).",
    url: "/internships/backend-engineering-intern",
    read: false,
    createdAt: hoursAgo(4),
  },
  {
    id: "notif_2",
    type: "TEAM_INVITE",
    title: "You've been invited to join Arclight AI",
    body: "Dr. Alina Voss invited you as a Recruiter.",
    url: "/company/team",
    read: false,
    createdAt: hoursAgo(20),
  },
  {
    id: "notif_3",
    type: "VERIFICATION_APPROVED",
    title: "Your company was verified",
    body: "Ledgerly is now live with the verified badge.",
    url: "/company",
    read: true,
    createdAt: hoursAgo(96),
  },
  {
    id: "notif_4",
    type: "REPORT_RESOLVED",
    title: "A report on your profile was resolved",
    body: "Thanks for the update — the duplicate listing has been removed.",
    url: "/company/profile",
    read: true,
    createdAt: hoursAgo(200),
  },
];
