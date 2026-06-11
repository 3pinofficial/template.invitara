// ─── Common Invitation Data Types ──────────────────────────────────────────
// Step 3 of implementation.md: Templates should rely on this interface rather
// than inventing custom field names.

export interface InvitationData {
  coupleName1: string;
  coupleName2: string;
  eventDate: string;
  venue: string;
  story?: string;
  music?: string;
  gallery?: string[];
}
