# IMPLEMENTATION.md

# Invitara Templates Repository Implementation Guide

## Purpose

This document explains how the invitara-templates repository should be implemented.

The objective is to extract all invitation templates from the main Invitara platform into a dedicated repository while maintaining compatibility with the main platform's renderer and editor.

This repository will be used for:

- Template Development
- Template Preview
- Template Testing
- Designer Review
- QA Validation

This repository is NOT responsible for:

- Authentication
- Payments
- User Management
- Dashboard
- Invitation Storage
- Supabase Operations

Those responsibilities remain in the main invitara-platform repository.

---

# Project Goal

Current Situation:

Templates are stored inside the main platform repository.

Future Situation:

Templates are maintained separately in:

text invitara-templates 

This improves:

- Scalability
- Maintainability
- Team collaboration
- Template development speed

---

# Repository Structure

Expected structure:

text invitara-templates/  app/ │ ├── page.tsx │ ├── preview/ │   ├── royal-wedding/ │   ├── cinematic-wedding/ │   ├── luxury-wedding/ │   └── birthday-modern/ │  templates/ │ ├── royal-wedding/ │ ├── cinematic-wedding/ │ ├── luxury-wedding/ │ └── birthday-modern/ │  components/ │ ├── RSVP/ ├── MusicPlayer/ ├── Countdown/ ├── Footer/ ├── Gallery/ ├── Map/ │  types/ │ └── invitation.ts │  registry/ │ └── templates.ts │  utils/ │  README.md  IMPLEMENTATION.md 

---

# Step 1

Move Existing Templates

Source:

Current Invitara project

Example:

text invitara-platform/templates/* 

Destination:

text invitara-templates/templates/* 

Preserve:

- Existing design
- Existing animations
- Existing assets
- Existing structure

Do not redesign templates during migration.

Goal:

Move first.

Refactor later.

---

# Step 2

Create Shared Components

Review all templates.

Identify repeated features:

Examples:

- RSVP
- Music Player
- Countdown
- Footer
- Gallery
- Maps

Move reusable functionality into:

text components/ 

Templates should consume these shared components when possible.

Example:

tsx import RSVP from "@/components/RSVP"; 

Visual appearance can remain customizable.

Only shared functionality should be extracted.

---

# Step 3

Create Common Data Types

Create:

text types/invitation.ts 

Initial structure:

ts export interface InvitationData {   coupleName1: string;   coupleName2: string;    eventDate: string;   venue: string;    story?: string;    music?: string;    gallery?: string[]; } 

This structure will evolve.

Important:

Templates should rely on this interface rather than inventing custom field names.

---

# Step 4

Create Template Registry

Create:

text registry/templates.ts 

Purpose:

Central location for registering templates.

Example:

ts import RoyalWedding from "@/templates/royal-wedding";  export const templates = {   "royal-wedding": RoyalWedding }; 

This registry will later be consumed by the main Invitara platform.

---

# Step 5

Template Configuration

Each template should expose metadata.

Example:

ts export const templateConfig = {   name: "Royal Wedding",    slug: "royal-wedding",    category: "wedding",    sections: [     "hero",     "story",     "gallery",     "venue",     "rsvp",     "music"   ] }; 

Purpose:

Allows the editor to know which settings should be shown.

---

# Step 6

Create Preview Pages

Templates must be previewable independently.

Examples:

text /preview/royal-wedding  /preview/luxury-wedding  /preview/cinematic-wedding 

These pages should render templates using mock data.

Example:

ts const mockInvitation = {   coupleName1: "Arjun",   coupleName2: "Priya",    venue: "Chennai",    eventDate: "10 Dec 2026" }; 

Purpose:

Allows designers to review templates without real invitation records.

---

# Step 7

Responsive Validation

All templates must support:

- Mobile
- Tablet
- Desktop

Test:

320px
375px
768px
1024px
1440px

Priority:

Mobile-first.

---

# Step 8

Animation Validation

Ensure:

- Animations do not block rendering
- Reduced motion support exists
- No layout shifts
- Smooth scrolling performance

Target:

60fps experience on modern devices.

---

# Step 9

Music System Compatibility

Templates should support:

ts musicUrl 

through props.

Templates should never hardcode audio.

Music must be dynamic.

---

# Step 10

RSVP Compatibility

Templates should expose RSVP hooks.

Expected future integration:

ts onSubmitRSVP() 

The platform will provide submission logic.

Templates only provide UI.

---

# Step 11

Gallery Compatibility

Templates should support:

ts gallery: string[] 

Images should come from props.

Never hardcode gallery assets.

---

# Step 12

Platform Compatibility Requirements

Templates must remain presentation-only.

Templates must NOT:

- Access Supabase directly
- Fetch invitation data
- Handle authentication
- Handle payments
- Handle editor logic

Templates receive data.

Templates render UI.

Nothing more.

---

# Future Integration

Main Platform:

text invitara.in 

Preview Platform:

text templates.invitara.in 

Users:

text invitara.in/invite/[id] 

Designers:

text templates.invitara.in/preview/[template] 

---

# Hostinger Setup (Future)

After deployment:

1. Deploy repository to Vercel

2. Add domain:

text templates.invitara.in 

inside Vercel

3. Add DNS record in Hostinger

Example:

Type:

CNAME

Name:

templates

Target:

cname.vercel-dns.com
(or value provided by Vercel)

4. Wait for DNS propagation

Result:

text https://templates.invitara.in 

becomes the template preview environment.

---

# Final Architecture

Users
↓
invitara.in
↓
Invitation Renderer
↓
Template Registry
↓
Templates

---

Designers
↓
templates.invitara.in
↓
Preview Templates
↓
Approve Design

---

Final Principle

Templates should have unlimited design freedom.

However:

- Data structure must be standardized.
- Templates must be renderer-compatible.
- Templates must be editor-compatible.
- Templates must remain presentation-only.

This ensures Invitara can scale to hundreds of templates while maintaining a single editor and rendering system.