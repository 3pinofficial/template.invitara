// ─── Common Invitation Data Types ──────────────────────────────────────────

export interface InvitationData {
  coupleName1: string;
  coupleName2: string;
  eventDate: string;
  venue: string;
  story?: string;
  music?: string;
  gallery?: string[];
}

export interface InvitationEvent {
  id: string;
  name: string;
  event_date: string | null;
  event_time: string | null;
  venue_name: string | null;
}

export interface RSVPEventEntry {
  invitation_event_id: string;
  is_attending: boolean;
  guest_count: number;
}

export interface RSVPSubmission {
  event_id: string;
  guest_name: string;
  guest_email?: string;
  guest_phone?: string;
  status: "attending" | "not_attending";
  guest_count: number;
  dietary_notes?: string;
  custom_responses?: Record<string, unknown>;
  event_responses: RSVPEventEntry[];
}

export interface RSVPThemeConfig {
  primaryColor: string;
  textColor: string;
  backgroundColor: string;
  fontFamily: string;
  buttonShape: "rounded-none" | "rounded-md" | "rounded-full";
}

export interface RSVPFieldConfig {
  requireEmail: boolean;
  showPhone: boolean;
  requirePhone: boolean;
  showDietary: boolean;
  showLeaveMessage: boolean;
  maxGuestsAllowed: number;
}
