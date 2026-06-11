// ─── Mocked RSVP Actions for Template Previews ─────────────────────────────
// This file simulates RSVP submissions and event fetches without direct DB access.

import type { InvitationEvent, RSVPEventEntry, RSVPSubmission } from "@/types/invitation";


// Simulated delay helper
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock ceremonies data
const MOCK_EVENTS: Record<string, InvitationEvent[]> = {
  default: [
    {
      id: "evt-haldi",
      name: "Haldi Ceremony",
      event_date: "2026-12-09",
      event_time: "10:00",
      venue_name: "Groom's Residence Courtyard",
    },
    {
      id: "evt-mehendi",
      name: "Mehndi Night",
      event_date: "2026-12-09",
      event_time: "18:00",
      venue_name: "Grand Ballroom, The Palace",
    },
    {
      id: "evt-wedding",
      name: "Wedding Ceremony",
      event_date: "2026-12-10",
      event_time: "09:30",
      venue_name: "Venkateswara Temple Hall",
    },
    {
      id: "evt-reception",
      name: "Grand Reception",
      event_date: "2026-12-10",
      event_time: "19:00",
      venue_name: "Royal Gardens Lawn",
    },
  ],
};

export async function getInvitationEvents(
  eventId: string
): Promise<InvitationEvent[]> {
  await delay(300);
  return MOCK_EVENTS[eventId] ?? MOCK_EVENTS.default;
}

export async function submitRSVP(submission: RSVPSubmission) {
  await delay(1000);
  console.log("[Mock RSVP Submit]:", submission);
  return { success: true, rsvpId: "mock-rsvp-id-" + Math.random().toString(36).substr(2, 9) };
}
