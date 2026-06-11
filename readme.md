# Invitara Templates

This repository contains all invitation templates used by the Invitara platform.

## Purpose

The goal of this repository is to separate template development from the main Invitara platform.

This allows:

- Independent template development
- Easier maintenance
- Better scalability
- Faster designer workflows
- Template preview and testing
- Reusable invitation components

The main platform focuses on:

- Authentication
- Dashboard
- Payments
- Invitation Editor
- Invitation Rendering
- User Management

while this repository focuses only on invitation templates.

---

# Architecture Overview

Invitara consists of two primary repositories:

## invitara-platform

Production platform.

Responsibilities:

- Landing Page
- Authentication
- Dashboard
- Payments
- Admin Panel
- Invitation Editor
- Invitation Renderer

Domain:

text https://invitara.in 

---

## invitara-templates

Template development repository.

Responsibilities:

- Invitation Templates
- Shared Template Components
- Template Preview Environment
- Designer Testing
- QA Review

Domain:

text https://templates.invitara.in 

This domain is intended for internal preview and testing only.

Customers should never be redirected here.

---

# Important Concept

Users always access invitations through:

text https://invitara.in/invite/[invitation-id] 

Example:

text https://invitara.in/invite/abc123 

Templates are rendered through the main Invitara platform.

This repository exists only to develop and preview templates.

---

# Repository Structure

text invitara-templates/  ├── app/ │ ├── templates/ │   ├── royal-wedding/ │   ├── cinematic-wedding/ │   ├── luxury-wedding/ │   └── birthday-modern/ │ ├── components/ │   ├── RSVP/ │   ├── MusicPlayer/ │   ├── Countdown/ │   ├── Footer/ │   ├── Gallery/ │   └── Map/ │ ├── types/ │   └── invitation.ts │ ├── utils/ │ └── README.md 

---

# Shared Components

Many templates require similar functionality.

Examples:

- RSVP Forms
- Music Players
- Countdown Timers
- Maps
- Galleries
- Footers

These components should be placed inside:

text components/ 

and reused whenever possible.

Templates may have completely different visual designs while still sharing functionality.

---

# Template Development Rules

Templates should:

- Be self-contained
- Follow the common invitation data model
- Use reusable components when appropriate
- Be mobile-first
- Support responsive layouts
- Avoid hardcoded event data

Templates should not:

- Directly access Supabase
- Contain platform-specific logic
- Depend on dashboard code
- Depend on payment code

---

# Invitation Data Model

All templates should use a common data structure.

Example:

ts export interface InvitationData {   coupleName1: string;   coupleName2: string;    eventDate: string;   venue: string;    story?: string;   music?: string;    gallery?: string[]; } 

Templates may display data differently, but field names should remain consistent.

---

# Template Configuration

Templates can choose which sections they support.

Example:

ts export const templateConfig = {   sections: [     "hero",     "story",     "gallery",     "venue",     "rsvp",     "music"   ] }; 

This allows the editor to dynamically show the correct settings.

---

# Preview Environment

Each template should have a preview route.

Example:

text /templates/royal-wedding /templates/luxury-wedding /templates/birthday-modern 

These pages should use mock data for testing and design review.

Example:

ts const mockInvitation = {   coupleName1: "Arjun",   coupleName2: "Priya",   venue: "Chennai",   eventDate: "10 Dec 2026" }; 

This enables designers and QA teams to review templates without requiring real invitation data.

---

# Versioning

Templates should support versioning.

Example:

text Royal Wedding v1 Royal Wedding v2 Royal Wedding v3 

Existing invitations should continue functioning even when new versions are released.

---

# Deployment

This repository is deployed separately from the main platform.

Deployment target:

text templates.invitara.in 

Hosted on:

text Vercel 

DNS managed through:

text Hostinger 

This deployment is intended for:

- Designer review
- Internal testing
- QA approval

Not for customer-facing invitations.

---

# Future Goals

As Invitara grows, this repository will become the central location for:

- Wedding Templates
- Birthday Templates
- Engagement Templates
- Corporate Event Templates
- Festival Invitations
- Premium Template Collections

while maintaining a consistent development experience.

---

# Final Principle

Templates should have complete creative freedom in design.

However, all templates should:

- Follow a common data model
- Follow a common configuration structure
- Be compatible with the Invitara editor
- Be compatible with the Invitara renderer

This ensures unlimited design flexibility while maintaining platform scalability.