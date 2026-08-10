# NepTechNews — Strengthened Product Requirements Document
## Dual-Language Nepali/English News Platform, Editorial CMS, AI-Assisted Newsroom & Automated Content Intelligence

**Document status:** Build-ready PRD  
**Version:** 2.0  
**Date:** 2026-08-10  
**Primary objective:** One-shot implementation of the public news platform, CMS, authentication/RBAC, editorial workflow, automated ingestion, AI-assisted translation/SEO, media processing, search, analytics, notifications, and deployment infrastructure.

---

# 1. Executive Summary

NepTechNews is a high-performance bilingual digital news platform serving **Nepali and English readers**, with a modern editorial experience inspired by the information density, category navigation, bilingual structure, and news-first layouts of established Nepali portals such as Ratopati and Setopati.

The product must not be a simple article publishing website. It is a **newsroom operating system** consisting of:

1. Public Nepali news portal.
2. Public English news portal.
3. Shared editorial CMS.
4. Journalist/editor authentication and RBAC.
5. Automated source discovery and ingestion.
6. AI-assisted summarization, rewriting, translation, SEO and metadata generation.
7. Human editorial approval before publication.
8. Automated featured-image generation.
9. Duplicate/story-cluster detection.
10. Source attribution and provenance tracking.
11. Search, tags, topics, authors and archives.
12. SEO, AEO, GEO and AI-search readiness.
13. News sitemap, XML sitemap, RSS feeds and structured data.
14. Performance-first delivery through Cloudflare.
15. Analytics, editorial metrics, audit logs and operational monitoring.

## Critical editorial principle

Automation is an **assistant, not the publisher**.

No automatically ingested or AI-generated article may become publicly visible without passing the configured editorial workflow. The system must preserve source attribution, distinguish original reporting from sourced/rewritten material, maintain an audit trail, and allow editors to inspect the source material before approval.

Google's current guidance explicitly warns against scaled content abuse, including scraping feeds and automatically translating/transforming content into large volumes of pages with little added value. Therefore the platform must optimize for **original editorial value, verification, attribution and human review**, not automated page volume.

---

# 2. Product Vision

Build a fast, trustworthy, bilingual Nepali news platform that feels like a modern publication rather than a generic CMS.

The public site should combine:

- Dense but clean news discovery.
- Strong breaking-news visibility.
- Fast mobile experience.
- Excellent Nepali typography.
- Excellent English typography.
- Clear hierarchy between breaking, latest, featured, opinion, analysis and evergreen content.
- Strong internal linking.
- Topic/entity pages.
- Author pages.
- Search.
- Related stories.
- Live/updated story capabilities.
- Audio/video-ready architecture.
- Editorial transparency.
- AI-assisted newsroom productivity.

---

# 3. Reference / Localization Direction

The product should study the information architecture and localization patterns of:

- Ratopati Nepali
- Ratopati English
- Setopati Nepali
- Setopati English

These are inspiration/reference points, not designs to copy.

The target product should improve on the references through:

- Cleaner visual hierarchy.
- Faster rendering.
- Better mobile navigation.
- Better typography.
- More useful article pages.
- Better search.
- Better topic pages.
- Better bilingual switching.
- Stronger author/source transparency.
- Better editorial tooling.
- Better related-story discovery.
- Better SEO metadata controls.
- Better AI-assisted editorial workflows.

---

# 4. Goals

## 4.1 Primary goals

- Launch a production-ready bilingual news portal.
- Support Nepali and English from the same content system.
- Make publishing fast enough for a real newsroom.
- Reduce repetitive editorial work through automation.
- Maintain human approval for automated content.
- Maximize organic search discoverability.
- Make content easy for search engines and answer engines to understand.
- Support high traffic spikes during breaking news.
- Maintain strong Core Web Vitals.
- Make the CMS usable by non-technical editors.
- Make the architecture maintainable and extensible.

## 4.2 Non-goals

The first release does not need:

- Public user-generated article publishing.
- Complex subscription/paywall infrastructure.
- Full social-network functionality.
- Cryptocurrency/web3 functionality.
- A native mobile app.
- Fully autonomous publishing.

These may be added later without redesigning the core architecture.

---

# 5. Architecture Decision

## 5.1 Recommended production architecture

### Public frontend
- Next.js 16+
- App Router
- React Server Components
- TypeScript
- Tailwind CSS
- Cloudflare Workers via OpenNext
- Cloudflare CDN/cache
- Cloudflare Images or object storage for media delivery

### CMS/API
- PHP 8.2+
- Lightweight Laravel-style architecture
- Slim/Laravel-compatible service structure
- REST API
- MySQL 8.x
- PDO/prepared statements
- Redis-compatible cache where available; otherwise application/cache tables

### Automation/orchestration
Use a separate scheduled/edge automation layer rather than relying entirely on shared-host cron.

Preferred:
- Cloudflare Workers
- Cloudflare Cron Triggers
- Cloudflare Queues where available

Fallback:
- cPanel cron jobs calling protected ingestion endpoints.

### AI provider abstraction
Create an internal AI service interface so the system is not locked to one provider.

Supported operations:
- Translation
- Summarization
- Headline generation
- SEO keyword suggestions
- Meta description generation
- Entity extraction
- Topic classification
- Duplicate detection assistance
- Article quality checks
- Featured-image prompt generation

---

# 6. Why Cloudflare Workers Instead of Cloudflare Pages

The original PRD specifies Cloudflare Pages and Edge ISR.

For the production implementation, deploy Next.js through the current Cloudflare OpenNext/Workers architecture.

Required capabilities:
- SSR
- SSG
- ISR/revalidation
- Route handlers where needed
- Streaming
- Server components
- Image optimization
- Cache control
- Edge delivery

Do not design around a Pages-only limitation.

---

# 7. High-Level System Architecture

```text
                         ┌──────────────────────────┐
                         │       Readers            │
                         └────────────┬─────────────┘
                                      │
                                      ▼
                         ┌──────────────────────────┐
                         │ Cloudflare CDN / WAF      │
                         └────────────┬─────────────┘
                                      │
                         ┌────────────▼─────────────┐
                         │ Next.js / OpenNext        │
                         │ Public Website            │
                         └────────────┬─────────────┘
                                      │
                              Cached / API requests
                                      │
                 ┌────────────────────▼──────────────────┐
                 │ PHP News API / CMS                     │
                 │ Auth • Articles • Media • Search       │
                 │ Editorial Workflow • Audit             │
                 └────────────┬──────────────────────────┘
                              │
                 ┌────────────▼─────────────┐
                 │ MySQL                    │
                 │ Content • Users • Logs   │
                 └──────────────────────────┘

      ┌─────────────────────────────────────────────────────────┐
      │                 Automation Layer                         │
      │ Cloudflare Cron → Source Fetch → Normalize → Deduplicate│
      │ → AI Assist → SEO → Image → Draft → Editorial Queue     │
      └───────────────────────────┬─────────────────────────────┘
                                  │
                    ┌─────────────▼─────────────┐
                    │ RSS / Atom / APIs /       │
                    │ licensed sources / feeds  │
                    └───────────────────────────┘
```

---

# 8. Repository Structure

Use a monorepo.

```text
neptechnews/
├── apps/
│   ├── web/                    # Next.js public website
│   └── cms/                    # Optional CMS frontend if separated
├── packages/
│   ├── ui/                     # Shared UI components
│   ├── types/                  # Shared TypeScript types
│   ├── seo/                    # SEO helpers
│   ├── i18n/                   # Language helpers
│   ├── editor/                 # Rich text/editor utilities
│   └── validation/             # Shared schemas
├── backend/
│   ├── api/                    # PHP API
│   ├── domain/
│   ├── application/
│   ├── infrastructure/
│   └── routes/
├── automation/
│   ├── ingestion/
│   ├── ai/
│   ├── dedupe/
│   ├── image/
│   └── scheduling/
├── database/
│   ├── migrations/
│   └── seeds/
├── docs/
├── scripts/
└── README.md
```

---

# 9. Public Website Information Architecture

## 9.1 Language routes

Nepali:

```text
/np/
/np/news/
/np/politics/
/np/business/
/np/sports/
/np/technology/
/np/entertainment/
/np/lifestyle/
/np/opinion/
/np/world/
/np/health/
/np/education/
/np/article/{slug}
/np/author/{slug}
/np/topic/{slug}
/np/search
```

English:

```text
/en/
/en/news/
/en/politics/
/en/business/
/en/sports/
/en/technology/
/en/entertainment/
/en/lifestyle/
/en/opinion/
/en/world/
/en/health/
/en/education/
/en/article/{slug}
/en/author/{slug}
/en/topic/{slug}
/en/search
```

Do not use `/articles/slug` as the only public URL pattern if a cleaner localized structure can be maintained.

---

# 10. Homepage Requirements

## 10.1 Header

Desktop:
- Logo.
- Language switcher.
- Primary categories.
- Search.
- Date/time.
- Optional live indicator.
- Optional radio/video link.
- Breaking-news strip.

Mobile:
- Logo.
- Search.
- Menu.
- Language switch.
- Sticky compact navigation.

## 10.2 Homepage sections

Configurable from CMS:

1. Breaking News
2. Lead Story
3. Secondary Lead Stories
4. Latest News
5. Politics
6. Business
7. Nepal / Province
8. World
9. Sports
10. Technology
11. Entertainment
12. Lifestyle
13. Health
14. Education
15. Opinion
16. Editor's Picks
17. Most Read
18. Trending Topics
19. Video
20. Photo Gallery
21. Newsletter

Editors must be able to:
- Reorder sections.
- Hide sections.
- Select featured stories.
- Pin stories.
- Set story priority.
- Configure language-specific homepage ordering.

---

# 11. Article Page Requirements

Every article page must include:

- Category.
- H1.
- Deck/summary.
- Author.
- Author profile link.
- Publication date.
- Updated date.
- Reading time.
- Featured image.
- Image caption.
- Image credit.
- Article body.
- Source attribution where applicable.
- Related stories.
- Topic/entity links.
- Share controls.
- Print option.
- Text-size controls.
- Language switcher.
- Breadcrumb.
- Newsletter CTA.
- Optional audio.
- Optional video.
- Correction/update notice.
- Last updated timestamp.

Article pages must support:
- Breaking updates.
- Live update blocks.
- Photo galleries.
- Embedded video.
- Embedded social posts.
- Pull quotes.
- Infoboxes.
- Tables.
- Lists.
- Source links.
- Inline related stories.

---

# 12. Editorial Content Types

The CMS must support:

- News
- Breaking News
- Analysis
- Investigation
- Opinion
- Editorial
- Interview
- Explainer
- Feature
- Photo Story
- Video Story
- Live Blog
- Press Release
- Sponsored Content
- Correction/Update

Each type can have different templates and metadata requirements.

---

# 13. Bilingual Content Model

Do NOT treat English and Nepali merely as two text columns.

Use a translation-aware content model.

Recommended:

```text
stories
story_translations
```

A story is the editorial entity.

Each translation is a language-specific representation.

Example:

```text
stories
- id
- canonical_story_id
- category_id
- content_type
- status
- published_at
- created_at
- updated_at

story_translations
- id
- story_id
- language
- title
- slug
- deck
- body
- meta_title
- meta_description
- focus_keyword
- excerpt
- translation_status
- translated_by
- reviewed_by
- reviewed_at
```

This allows:
- One story with two translations.
- Independent publishing states.
- Different localized headlines.
- Different localized SEO metadata.
- Different localized slugs.
- Human translation review.
- Future languages without schema redesign.

Supported languages initially:
- `np`
- `en`

Use `ne` internally only if required by a specific localization standard; the public URL can remain `/np/`.

---

# 14. Editorial Workflow

Required state machine:

```text
INGESTED
   ↓
AI_PROCESSING
   ↓
DRAFT
   ↓
FACT_CHECK
   ↓
EDITOR_REVIEW
   ↓
APPROVED
   ↓
SCHEDULED
   ↓
PUBLISHED
   ↓
UPDATED / CORRECTED
   ↓
ARCHIVED
```

Manual articles may begin at DRAFT.

Automated articles must never skip human review.

## Editorial actions

- Save draft
- Submit for review
- Request changes
- Approve
- Reject
- Schedule
- Publish
- Unpublish
- Archive
- Duplicate
- Create translation
- Lock article
- Restore revision
- Compare revisions

---

# 15. Roles and Permissions

## Super Admin

Everything:
- Users
- Roles
- Settings
- Sources
- AI configuration
- API keys
- Security
- Editorial configuration
- System logs

## Chief Editor

- Publish/unpublish
- Edit everything
- Approve content
- Manage homepage
- Manage categories
- Review AI drafts
- Manage sources

## Category Editor

- Manage assigned categories
- Review articles
- Edit articles
- Publish if permitted
- Manage category homepage modules

## Journalist

- Create articles
- Edit own drafts
- Upload media
- Submit for review
- Create manual stories

## Translator

- Edit translations
- Submit translations
- Cannot publish unless explicitly granted

## Fact Checker

- Verify sources
- Add verification notes
- Mark claims verified/unverified
- Cannot publish unless granted

## Reader/Analyst

- Read CMS content
- View analytics
- No editorial mutation

Use permission-based authorization in addition to roles.

---

# 16. Authentication

Prefer secure server-side sessions for CMS users instead of exposing long-lived JWTs to browsers.

Requirements:
- Email/password.
- Password reset.
- Session rotation.
- Secure HTTP-only cookies.
- CSRF protection.
- Session revocation.
- Device/session list.
- Optional 2FA/TOTP.
- Login rate limiting.
- Brute-force protection.
- Audit logs.
- Account lockout policy.
- Admin session timeout.

API-to-API communication may use short-lived signed tokens.

Never store access tokens in localStorage.

---

# 17. Automated News Ingestion

## 17.1 Source types

Support:

1. RSS feeds.
2. Atom feeds.
3. XML sitemaps.
4. Publisher APIs.
5. Licensed news APIs.
6. Public structured endpoints where permitted.
7. Direct website fetching only where terms, robots directives and legal rights permit.

Do not build the product around unrestricted scraping.

## 17.2 Google News

Do not describe Google News as a generic official "Google News API" for article scraping.

Google News can be used as a discovery surface, but the ingestion engine should primarily support:
- RSS/Atom.
- Publisher feeds.
- Licensed APIs.
- Approved source integrations.

The system must allow source adapters so providers can be added or removed without changing the article system.

---

# 18. Source Management CMS

Admin screen:

```text
Sources
├── Local
├── International
├── Government
├── Agencies
├── Business
├── Sports
└── Specialized
```

Each source:

- Name.
- Domain.
- Feed URL.
- API endpoint.
- Source type.
- Language.
- Country.
- Category mapping.
- Fetch interval.
- Enabled/disabled.
- Trust level.
- Attribution template.
- Copyright policy.
- Allowed transformation.
- Last successful fetch.
- Error count.
- Rate limit.
- Parser configuration.

---

# 19. Ingestion Pipeline

```text
Scheduler
   ↓
Fetch Source
   ↓
Validate Feed / HTTP
   ↓
Normalize
   ↓
Extract title/date/author/image/content
   ↓
Canonical URL detection
   ↓
Hash / fingerprint
   ↓
Duplicate detection
   ↓
Story clustering
   ↓
Source rights/policy check
   ↓
AI processing
   ↓
Translation
   ↓
SEO metadata
   ↓
Featured image
   ↓
Editorial QA
   ↓
DRAFT
```

Each stage must be independently retryable.

---

# 20. Duplicate Detection

Use multiple signals:

- Canonical URL.
- Source URL.
- Exact title hash.
- Normalized title similarity.
- Content fingerprint.
- Named entity overlap.
- Publication time.
- Semantic similarity.

If multiple publishers report the same event, create a **story cluster**.

Example:

```text
Story Cluster:
"Government announces new budget"

Sources:
- Source A
- Source B
- Source C

Primary draft:
- NepTechNews editorial synthesis
```

This prevents publishing five near-identical articles.

---

# 21. AI-Assisted Editorial Pipeline

AI can generate:

- Summary.
- Draft headline options.
- Nepali translation.
- English translation.
- Focus keyword.
- Related keywords.
- Meta title.
- Meta description.
- URL slug suggestion.
- Article excerpt.
- Entity list.
- Category suggestion.
- Topic suggestion.
- Image prompt.
- FAQ candidates.
- Suggested internal links.
- Suggested related articles.
- Fact-check checklist.
- Potentially conflicting claims.

AI must NOT silently invent:
- Names.
- Quotes.
- Statistics.
- Locations.
- Dates.
- Sources.
- Events.

If a fact cannot be supported by source material, flag it.

---

# 22. Neutral Editorial Rewrite Rules

The AI editorial prompt must enforce:

- Neutral tone.
- No sensationalism unless the source itself is explicitly quoted and attribution is preserved.
- No fabricated quotes.
- No unsupported conclusions.
- No partisan framing.
- No ideological insertion.
- No plagiarism.
- No source content copied wholesale.
- Preserve factual meaning.
- Attribute claims.
- Clearly distinguish allegation from fact.
- Preserve uncertainty.
- Preserve conflicting claims.
- Flag missing context.
- Do not convert opinion into fact.

For sensitive subjects, require mandatory human fact-checking.

---

# 23. Translation System

Translation is a separate editorial object.

Pipeline:

```text
Source Article
     ↓
English Draft / Nepali Draft
     ↓
AI Translation
     ↓
Terminology Normalization
     ↓
Editorial Review
     ↓
Approved Translation
```

Requirements:
- Preserve names.
- Preserve organizations.
- Preserve places.
- Preserve quotations.
- Preserve numbers.
- Preserve dates.
- Preserve legal/political terminology.
- Avoid literal machine translation when it damages meaning.
- Support Nepali Devanagari.
- Support English.
- Maintain language-specific SEO metadata.

CMS should show source and translation side-by-side.

---

# 24. AI Quality Gate

Before an automated draft enters the editor queue, run:

### Structural checks
- Title exists.
- Body exists.
- Category exists.
- Language exists.
- Source exists.
- Date exists.
- Author attribution exists where available.

### Factual checks
- Claims traceable to source.
- Quotes traceable.
- Numbers match source.
- Named entities match source.
- No obvious hallucination.

### SEO checks
- H1 exists.
- Meta title exists.
- Meta description exists.
- Focus keyword exists.
- Slug exists.
- Image exists.
- Alt text exists.

### Editorial checks
- No duplicate.
- No excessive repetition.
- No clickbait.
- No unsupported claims.
- Source attribution present.

Failed checks create warnings, not silent fixes.

---

# 25. SEO System

SEO is a first-class product module.

Every article should have:

- SEO title.
- Meta description.
- Focus keyword.
- Secondary keywords.
- Slug.
- Canonical URL.
- H1.
- OpenGraph title.
- OpenGraph description.
- OpenGraph image.
- Twitter/X card metadata.
- Author metadata.
- Publisher metadata.
- Article published date.
- Article modified date.
- Breadcrumb schema.
- NewsArticle schema.
- InLanguage.
- Image metadata.

Do not keyword-stuff.

---

# 26. News SEO

Implement:

- News sitemap.
- XML sitemap index.
- Separate image sitemap where useful.
- RSS feed.
- Atom feed where useful.
- Stable category URLs.
- Crawlable HTML links.
- Canonical URLs.
- hreflang.
- Article structured data.
- NewsArticle structured data.
- Author pages.
- Publisher page.
- About page.
- Editorial policy.
- Corrections policy.
- Contact page.

News sitemap rules:
- Include fresh news URLs.
- Automatically remove articles from the news sitemap after the relevant freshness window.
- Never generate a new sitemap per article.

---

# 27. AEO / Answer Engine Optimization

AEO should not mean artificially stuffing FAQ blocks.

Instead:

- Write clear summaries.
- Answer obvious reader questions naturally.
- Use descriptive headings.
- Include concise definitions.
- Provide context.
- Cite sources.
- Link to authoritative references.
- Use structured data where appropriate.
- Make important facts visible as text.
- Use clear entity relationships.
- Maintain author and publisher transparency.

Optional article component:

```text
Key Takeaways
- ...
- ...
- ...
```

For explainer articles:

```text
What happened?
Why does it matter?
What happens next?
Who is affected?
What do we know?
What remains unclear?
```

---

# 28. GEO / Generative Search Optimization

Treat GEO as a content-quality and retrieval problem.

The system should maximize:
- Clear factual statements.
- Entity consistency.
- Source transparency.
- Author identity.
- Publisher identity.
- Internal linking.
- Topic clustering.
- Original reporting.
- Unique analysis.
- Strong contextual summaries.
- Stable URLs.
- High-quality page experience.

Do not generate artificial pages for every possible question.

---

# 29. AI Search / AIO Readiness

No proprietary "AI ranking" markup should be required.

The platform should follow normal high-quality SEO principles and make pages:
- Crawlable.
- Indexable.
- Textually accessible.
- Well structured.
- Internally linked.
- Clearly authored.
- Clearly sourced.
- Fast.
- Mobile friendly.

Provide structured data only when it accurately represents visible content.

---

# 30. Entity / Knowledge Graph System

Create first-class entities:

- Person
- Organization
- Political Party
- Government Body
- Location
- Country
- City
- Event
- Product
- Company
- Sports Team
- Sports Competition
- Topic

Each entity can have:
- Name.
- Localized names.
- Slug.
- Description.
- Image.
- Wikipedia URL.
- Wikidata ID.
- Official URL.
- Related entities.
- Articles.

This powers:
- Topic pages.
- Internal linking.
- Related stories.
- SEO.
- Knowledge graph consistency.

---

# 31. Featured Image System

When a source image is legally reusable:
- Store source attribution.
- Store license information.
- Store original URL.
- Store photographer/credit.
- Generate optimized derivatives.

When a reusable source image is unavailable:
- Generate an original editorial illustration.
- Never imply the generated image is a photograph of the event.
- Add appropriate internal metadata.
- Allow editors to replace the generated image.

Image pipeline:

```text
Source Image / AI Image
       ↓
Rights Check
       ↓
Crop
       ↓
Resize
       ↓
WebP/AVIF
       ↓
CDN
```

Required image sizes:
- 1200×675
- 900×506
- 600×338
- 400×225
- 300×169
- social preview 1200×630

Use responsive images and `srcset`.

---

# 32. Media Library

Features:
- Upload.
- Drag/drop.
- Chunked upload.
- Resize.
- Crop.
- Compress.
- Convert.
- Search.
- Filter.
- Attribution.
- Credit.
- Alt text.
- Caption.
- Photographer.
- License.
- Source URL.
- Usage history.
- Article association.
- Duplicate detection.

Supported:
- JPG
- PNG
- WebP
- AVIF
- GIF where necessary
- SVG only for trusted/admin-safe use

Reject executable uploads.

---

# 33. Rich Text Editor

Use a structured editor rather than storing arbitrary unsafe HTML.

Recommended:
- TipTap/ProseMirror-style editor.

Blocks:
- Paragraph
- Heading
- Image
- Gallery
- Quote
- Pull quote
- Video
- Embed
- Table
- List
- Link
- Related story
- Tweet/social embed
- Audio
- Infobox
- Key takeaways
- Source note

Sanitize rendered HTML.

---

# 34. Search

MVP:
- MySQL full-text search.

Scale-up:
- Meilisearch or another dedicated search service.

Search across:
- Title.
- Body.
- Author.
- Category.
- Tags.
- Entities.
- Source.
- Date.

Features:
- Typo tolerance.
- Nepali search.
- English search.
- Filters.
- Recent searches.
- Trending searches.
- Suggested queries.

---

# 35. Trending / Most Read

Track:
- Page views.
- Unique sessions.
- Reading time.
- Scroll depth where available.
- Shares.
- Search clicks.

Generate:
- Most read today.
- Most read this week.
- Trending topics.
- Rising stories.

Do not allow analytics manipulation through repeated requests.

---

# 36. Breaking News

CMS controls:
- Mark as breaking.
- Set expiration.
- Set priority.
- Push to breaking bar.
- Optional notification.
- Optional homepage takeover.

Public:
- Breaking news ticker.
- Breaking label.
- Live updates where appropriate.

Breaking state should expire automatically.

---

# 37. Live Blog

Data model:

```text
live_events
live_updates
```

Each update:
- Timestamp.
- Author.
- Content.
- Media.
- Verification status.

Features:
- Publish individual updates.
- Pin update.
- Delete/update with audit trail.
- Automatic chronological rendering.
- SEO-friendly static content.

---

# 38. Author Pages

Each journalist/author:
- Name.
- Photo.
- Bio.
- Role.
- Expertise.
- Social links.
- Articles.
- Languages.
- Published count.

Author structured data should link to a unique author page.

---

# 39. Category Pages

Each category has:
- Stable URL.
- Localized name.
- Description.
- Featured article.
- Latest articles.
- Most read.
- Topic links.
- Pagination or crawlable load-more links.

Do not rely entirely on JavaScript to expose article links to crawlers.

---

# 40. Topic Pages

Example:

```text
/np/topic/nepal-government
/en/topic/nepal-government
```

Topic page:
- Topic description.
- Key entities.
- Latest coverage.
- Timeline.
- Related topics.
- Related authors.

---

# 41. Corrections and Editorial Transparency

Every article must support:
- Correction.
- Update.
- Editor's note.
- Retraction.
- Version history.

Public correction format:

```text
Correction — [timestamp]
This article was updated to correct...
```

Never silently rewrite a materially incorrect published story without retaining an audit trail.

---

# 42. Source Attribution

For sourced stories:

- Source name.
- Source URL.
- Publication time.
- Attribution text.
- Original source.
- Whether the story is independently verified.

Example internal metadata:

```text
source_type = "external"
source_name = "Example Publisher"
source_url = "https://..."
attribution_required = true
```

Do not publish copied source text as original reporting.

---

# 43. Database Model

Core tables:

```text
users
roles
permissions
role_permissions
sessions
login_attempts

stories
story_translations
story_revisions
story_sources
story_clusters
story_entities
story_tags

categories
category_translations
tags
entities
entity_aliases

authors
author_translations

media
media_variants
media_credits
media_usage

sources
source_feeds
source_fetch_logs
source_items

ai_jobs
ai_outputs
ai_quality_checks
translation_jobs

homepage_sections
homepage_slots

live_events
live_updates

comments (optional)
newsletter_subscribers
notifications

analytics_events
article_metrics
search_metrics

audit_logs
system_settings
api_keys
webhook_events
failed_jobs
```

---

# 44. Important Database Constraints

Use:
- Foreign keys where appropriate.
- Composite indexes.
- Unique constraints.
- Soft-delete fields where needed.
- UTC timestamps internally.
- Localized display times at presentation level.

Critical indexes:

```text
stories(status, published_at)
stories(category_id, status, published_at)
story_translations(language, slug)
story_translations(language, published_at)
story_sources(source_id, published_at)
source_items(source_id, external_id)
story_entities(entity_id, story_id)
audit_logs(user_id, created_at)
```

Do not put all bilingual content into one giant article table.

---

# 45. API

Base:

```text
/api/v1
```

## Public

```text
GET /articles
GET /articles/{slug}
GET /categories
GET /categories/{slug}
GET /topics
GET /topics/{slug}
GET /authors
GET /authors/{slug}
GET /search
GET /breaking
GET /trending
GET /sitemap
GET /rss
```

## Auth

```text
POST /auth/login
POST /auth/logout
POST /auth/refresh
POST /auth/forgot-password
POST /auth/reset-password
POST /auth/2fa/enable
POST /auth/2fa/verify
GET  /auth/me
```

## CMS

```text
POST /cms/stories
PATCH /cms/stories/{id}
POST /cms/stories/{id}/submit
POST /cms/stories/{id}/approve
POST /cms/stories/{id}/publish
POST /cms/stories/{id}/schedule
POST /cms/stories/{id}/archive
POST /cms/stories/{id}/translate
GET  /cms/stories/{id}/revisions
POST /cms/stories/{id}/restore
```

## Ingestion

```text
POST /internal/ingestion/run
POST /internal/ingestion/source/{id}
GET  /internal/ingestion/jobs
```

Internal endpoints must require signed service authentication.

---

# 46. API Performance

Target:
- Cached public API: <100 ms where practical.
- Uncached API: <300 ms for normal reads.
- CMS writes: <500 ms excluding AI/media processing.
- AI jobs must be asynchronous.
- Image processing must be asynchronous for large files.

Never block article publishing on a long AI call.

---

# 47. Background Job System

All long-running work must be jobs:

- Feed fetching.
- Website parsing.
- AI generation.
- Translation.
- Image generation.
- Image conversion.
- Duplicate detection.
- Search indexing.
- Sitemap generation.
- Notifications.
- Analytics aggregation.

Job states:

```text
queued
processing
completed
failed
retrying
cancelled
```

Retries:
- Exponential backoff.
- Maximum attempts.
- Dead-letter/failure queue.
- Admin retry button.

---

# 48. Caching Strategy

Cache:
- Homepage.
- Category pages.
- Topic pages.
- Author pages.
- Article pages.
- Search suggestions.
- Public API reads.

Do not cache:
- CMS private data.
- User sessions.
- Admin actions.
- Drafts.

Use tag-based invalidation where supported.

When an article publishes:
1. Purge article.
2. Purge relevant category.
3. Purge topic/entity pages.
4. Purge author page if needed.
5. Purge homepage modules.
6. Revalidate sitemap/RSS.

---

# 49. Performance Budget

## Mobile targets

- LCP: <2.0 s target.
- INP: <200 ms target.
- CLS: <0.1.
- HTML document response: <500 ms cached target.
- JavaScript: aggressively minimize.
- Initial critical CSS: minimal.
- Images: responsive and optimized.

## Rules

- Server Components by default.
- Client Components only when interaction requires them.
- No giant UI libraries shipped to the browser.
- No unnecessary hydration.
- Lazy-load below-the-fold modules.
- Preload only the primary hero image/font when justified.
- Avoid layout shifts.
- Avoid autoplay video.
- Use native browser features where possible.

---

# 50. Mobile-First Design

Primary audience is mobile.

Design:
- Thumb-friendly navigation.
- Fast menu.
- Sticky compact header.
- Large readable headlines.
- Nepali font optimization.
- Comfortable article width.
- Share bar.
- Low data usage.
- Lazy-loaded media.
- Minimal intrusive advertising.

---

# 51. Accessibility

Target WCAG 2.2 AA where practical.

Requirements:
- Keyboard navigation.
- Visible focus.
- Semantic HTML.
- Proper headings.
- Alt text.
- Accessible forms.
- Screen-reader labels.
- Sufficient contrast.
- Reduced-motion support.
- Captions/transcripts for media.
- No interaction that blocks browser navigation.

---

# 52. Advertising Architecture

Do not hard-code advertising into article markup.

Support:
- Header ad.
- Homepage ad.
- In-feed ad.
- Article ad.
- Sidebar ad.
- Sticky mobile ad.
- Sponsored article.

Each placement configurable.

Sponsored content must be clearly labeled.

---

# 53. Analytics

Support:
- Cloudflare Web Analytics.
- GA4 optional.
- Search Console.
- Internal editorial analytics.

Track:
- Page views.
- Article views.
- Language.
- Category.
- Referrer.
- Search query.
- Reading time.
- Scroll depth.
- Shares.
- Related-story clicks.

Avoid collecting unnecessary personal data.

---

# 54. Admin Dashboard

Dashboard should feel like a modern newsroom, not a WordPress clone.

Widgets:
- Drafts awaiting review.
- AI-generated drafts.
- Articles published today.
- Scheduled articles.
- Breaking stories.
- Translation queue.
- Fact-check queue.
- Ingestion failures.
- Source failures.
- Most-read stories.
- Traffic snapshot.
- System health.

---

# 55. Editorial Queue

Filters:
- Language.
- Category.
- Author.
- Source.
- Status.
- AI-generated.
- Translation status.
- Fact-check status.
- Date.

Actions:
- Preview.
- Edit.
- Compare source.
- Compare translation.
- Fact-check.
- Approve.
- Reject.
- Assign editor.
- Publish.

---

# 56. CMS Article Editor Layout

Three-column desktop layout:

```text
┌──────────────┬──────────────────────────┬────────────────────┐
│ Story info   │ Editor                   │ Publishing / SEO   │
│              │                          │                    │
│ Category     │ Headline                 │ Status             │
│ Author       │ Deck                     │ Publish time       │
│ Source       │ Body                     │ Category           │
│ Tags         │ Media                    │ SEO score          │
│ Entities     │ Embeds                   │ Meta title         │
│              │                          │ Meta description   │
│              │                          │ Focus keyword      │
└──────────────┴──────────────────────────┴────────────────────┘
```

Mobile editor should become stacked sections.

---

# 57. SEO Assistant in CMS

Provide a non-blocking SEO panel:

```text
SEO Score
████████░░ 82

Checks:
✓ Keyword in title
✓ Keyword in introduction
✓ Meta description
✓ Canonical
✓ Image alt text
✓ Internal links
⚠ Headline could be more specific
⚠ Add related topic
```

Do not use simplistic scoring as a ranking prediction.

---

# 58. Internal Linking Engine

Automatically suggest:
- Related stories.
- Same entity stories.
- Same topic.
- Previous coverage.
- Explainers.
- Author articles.

Editors approve suggestions before insertion.

---

# 59. Content Recommendation

Ranking signals:
- Topic similarity.
- Entity overlap.
- Category.
- Recency.
- Popularity.
- Language.
- Editorial priority.

Avoid recommendation loops.

---

# 60. Notifications

CMS:
- New article awaiting review.
- Failed ingestion.
- Failed AI job.
- Source feed unavailable.
- Scheduled article ready.
- Breaking story published.

Optional:
- Email.
- Browser push.
- Webhook.

---

# 61. SEO URL Rules

Slugs:
- Lowercase where appropriate.
- Stable.
- Human-readable.
- No random IDs unless required.
- Avoid unnecessary dates in URLs.
- Preserve existing slug on updates.
- Redirect changed slugs with 301.

If Nepali Unicode slugs are used, test encoding and sharing extensively. Default to clean transliterated slugs if operationally more reliable.

---

# 62. Sitemap System

Generate:

```text
/sitemap.xml
/sitemap-news.xml
/sitemap-articles.xml
/sitemap-categories.xml
/sitemap-authors.xml
/sitemap-topics.xml
```

News sitemap should only contain eligible recent news content.

---

# 63. RSS / Feeds

Provide:

```text
/np/rss.xml
/en/rss.xml
/np/category/politics/rss.xml
/en/category/politics/rss.xml
```

Feeds should contain:
- Title.
- Description.
- URL.
- Published time.
- Author.
- Image.
- Category.

---

# 64. Structured Data

Article pages:
- `NewsArticle`
- `BreadcrumbList`
- `Organization`
- `Person`

Homepage:
- `Organization`
- `WebSite`

Search:
- `WebSite` with search action where appropriate.

Only output properties that are accurate and supported by visible page content.

---

# 65. Open Graph / Social

Every public page should have:
- OG title.
- OG description.
- OG image.
- Canonical URL.
- Locale.
- Article published time.
- Article modified time.

Generate article social cards automatically.

---

# 66. Security

Required:
- Prepared SQL.
- Output encoding.
- HTML sanitization.
- CSRF protection.
- Secure cookies.
- Content Security Policy.
- HSTS.
- X-Content-Type-Options.
- Referrer-Policy.
- Permissions-Policy.
- Rate limiting.
- Login throttling.
- Upload validation.
- Image re-encoding.
- Malware scanning where available.
- Secret management.
- Audit logging.

Never expose:
- Database credentials.
- AI API keys.
- JWT secrets.
- Service tokens.

---

# 67. CORS

Public read APIs may be selectively accessible.

CMS APIs:
- Same-origin where possible.
- Explicit origin allowlist.
- Credentials only when required.

Do not use wildcard CORS for authenticated CMS endpoints.

---

# 68. Media Security

For every upload:
1. Validate extension.
2. Validate MIME.
3. Inspect file signature.
4. Re-encode.
5. Strip unsafe metadata where appropriate.
6. Generate safe filename.
7. Store outside executable web root where possible.
8. Serve through CDN/object storage.

---

# 69. Audit Logging

Log:
- Login.
- Logout.
- Failed login.
- User creation.
- Role changes.
- Article creation.
- Article edits.
- Publish.
- Unpublish.
- Delete.
- Translation.
- AI output acceptance.
- Source changes.
- Settings changes.
- API key changes.

Audit record:
- User.
- Action.
- Entity.
- Entity ID.
- Timestamp.
- IP where legally appropriate.
- User agent where appropriate.
- Before/after metadata.

---

# 70. Backup and Recovery

Database:
- Daily full backup.
- More frequent incremental/binlog strategy if hosting supports it.
- Encrypted off-site backup.
- Retention policy.
- Restore testing.

Media:
- CDN/object storage copy.
- Backup policy.

Define:
- RPO.
- RTO.

Suggested initial targets:
- RPO: ≤24 hours.
- RTO: ≤4 hours.

---

# 71. Observability

Monitor:
- API latency.
- DB latency.
- Error rate.
- 5xx.
- Ingestion failures.
- AI failures.
- Queue depth.
- Image processing failures.
- Cache hit rate.
- Search failures.
- Cron health.

Create `/health` and `/ready` endpoints for services.

---

# 72. Editorial Reliability

The system must fail safely.

If AI provider fails:
- Article remains draft.
- Editor can continue manually.

If ingestion fails:
- Existing content remains available.

If MySQL becomes slow:
- Public cached pages remain available.

If image generation fails:
- Editor can select/upload an image.

If translation fails:
- Original-language article can still be published if policy permits.

---

# 73. Disaster Mode / Breaking News Mode

Admin toggle:

```text
NORMAL
BREAKING
HIGH TRAFFIC
```

High traffic mode:
- Aggressive public caching.
- Reduce nonessential API calls.
- Disable expensive recommendation calculations.
- Delay analytics aggregation.
- Prioritize article delivery.

---

# 74. Editorial Policy Engine

CMS setting:

```text
Auto-publish: OFF
AI rewrite: ON
AI translation: ON
AI image generation: ON
Human review: REQUIRED
Fact-check for sensitive categories: REQUIRED
Source attribution: REQUIRED
```

Rules can vary by:
- Category.
- Source.
- Content type.
- Language.

---

# 75. Sensitive Content Rules

Flag articles involving:
- Elections/politics.
- Crime allegations.
- Health.
- Deaths.
- Children/minors.
- Sexual violence.
- Financial claims.
- Breaking disasters.
- Conflict/war.
- Legal accusations.

Require:
- Source verification.
- Attribution.
- Human review.
- Optional second-editor approval.

---

# 76. Copyright / Source Rights

The ingestion engine must store source provenance.

Do not assume that because content is publicly accessible it can be republished.

For every source define:
- Allowed ingestion type.
- Allowed transformation.
- Attribution requirement.
- Image rights.
- Full-text permission.
- Summary-only permission.

If rights are unclear:
- Create a source reference draft rather than automatically republishing the source text.

---

# 77. Anti-Duplication / Anti-Thin-Content Policy

The platform must actively prevent:
- Near-identical stories.
- Translation-only pages with no editorial value.
- Feed-to-page mass generation.
- Keyword-stuffed articles.
- Empty topic pages.
- Thin tag pages.
- AI-generated filler.

Low-value pages can be:
- Noindexed.
- Consolidated.
- Redirected.
- Excluded from XML/news sitemaps.

---

# 78. Content Quality Score

Internal score:

```text
Source quality       20
Originality           20
Fact support          20
Editorial quality     15
SEO completeness      10
Entity completeness    5
Media quality          5
Internal linking       5
-------------------------
Total                100
```

This is an editorial workflow score, not a Google ranking score.

---

# 79. Testing Requirements

## Unit tests
- Auth.
- Permissions.
- Slug generation.
- Translation mapping.
- SEO metadata.
- Deduplication.
- Source parsing.
- Sitemap generation.

## Integration tests
- API + database.
- CMS + API.
- Ingestion + database.
- AI pipeline.
- Media pipeline.
- Cache invalidation.

## E2E
- Login.
- Create article.
- Upload image.
- Translate.
- Submit.
- Approve.
- Publish.
- Verify public page.
- Verify sitemap.
- Verify RSS.
- Verify structured data.

---

# 80. Automated QA

CI must run:
- TypeScript check.
- ESLint.
- Unit tests.
- Integration tests.
- Build.
- PHP static analysis.
- PHP tests.
- SQL migration validation.
- Security dependency scan.
- Lighthouse CI.
- Accessibility checks.

Build fails on critical errors.

---

# 81. Lighthouse / Performance Acceptance

Minimum release target:

- Performance: ≥90 on representative pages.
- Accessibility: ≥90.
- Best Practices: ≥90.
- SEO: ≥95.

These are engineering targets, not guarantees of search rankings.

---

# 82. SEO Acceptance Tests

For a published article:
- Canonical exists.
- Hreflang exists where translation exists.
- NewsArticle JSON-LD valid.
- Author URL exists.
- Publisher exists.
- Image metadata exists.
- Meta title exists.
- Meta description exists.
- Robots allows indexing.
- Sitemap inclusion works.
- RSS inclusion works.
- Internal links exist.
- Article is server-rendered and crawlable.

---

# 83. AI Acceptance Tests

AI-generated draft must:
- Preserve source facts.
- Preserve names.
- Preserve numbers.
- Preserve quotes.
- Not fabricate sources.
- Not fabricate citations.
- Identify uncertainty.
- Generate localized output.
- Remain in draft status.

The test suite should include deliberately misleading source text to ensure the AI does not blindly repeat unsupported claims.

---

# 84. Source Adapter Interface

Every source integration should implement:

```text
SourceAdapter
├── validate()
├── fetch()
├── parse()
├── normalize()
├── extractArticle()
├── extractMetadata()
├── extractImage()
├── getCanonicalUrl()
├── getPublishedAt()
└── getAttribution()
```

Adding a new source must not require changes to core article logic.

---

# 85. AI Provider Interface

```text
AIProvider
├── generateSummary()
├── translate()
├── generateHeadline()
├── generateSEO()
├── extractEntities()
├── classify()
├── checkQuality()
└── generateImagePrompt()
```

Store:
- Provider.
- Model.
- Prompt version.
- Input hash.
- Output.
- Token/usage metadata where available.
- Timestamp.
- Human acceptance status.

---

# 86. Prompt Versioning

Never hard-code one unversioned editorial prompt.

Store:

```text
prompt_name
prompt_version
language
content_type
system_instruction
editorial_rules
```

Allow admins to roll back prompt versions.

---

# 87. Admin AI Review

Editor should see:

```text
SOURCE
Original source material

AI DRAFT
Generated article

AI NOTES
Potential uncertainty
Potential unsupported claim
Entities detected

SEO
Suggested title
Keywords
Meta description

TRANSLATION
English ↔ Nepali comparison
```

Editor can:
- Accept.
- Edit.
- Regenerate section.
- Reject.
- Mark issue.

---

# 88. Featured Image Prompt Rules

AI image prompts must:
- Describe the subject.
- Avoid fake documentary realism for events unless explicitly approved.
- Avoid depicting identifiable people inaccurately.
- Avoid fabricated logos.
- Avoid false quotations.
- Avoid misleading visual claims.

Prefer:
- Editorial illustrations.
- Maps.
- Conceptual compositions.
- Abstract topic imagery.

---

# 89. Content Freshness

Every article stores:
- Created.
- First published.
- Last updated.
- Last materially changed.
- Last fact checked.

Do not update `dateModified` for meaningless automated metadata changes.

---

# 90. Editorial Calendar

CMS:
- Calendar view.
- Scheduled stories.
- Category.
- Author.
- Language.
- Breaking flag.

Drag/drop rescheduling with permission controls.

---

# 91. Homepage Configuration

Do not hard-code homepage ordering.

CMS objects:

```text
homepage
homepage_section
homepage_slot
homepage_rule
```

Examples:
- Manual story.
- Latest from category.
- Most read.
- Trending.
- Editor's picks.

Allow editors to override automated ranking.

---

# 92. Internationalization

All UI strings must use translation keys.

No hard-coded interface text.

Support:
- English.
- Nepali.

Date formatting:
- Nepali/English localized formats.
- Nepali calendar can be added as a presentation layer.

---

# 93. Typography

Nepali typography must be treated as a first-class design requirement.

Requirements:
- Test multiple Devanagari-capable fonts.
- Use font subsets.
- Preload only required weights.
- Avoid excessive font families.
- Ensure line-height is comfortable.
- Test headlines at small mobile widths.

---

# 94. Design System

Create reusable components:

```text
Header
BreakingBar
CategoryNav
StoryCard
LeadStory
CompactStory
SectionHeader
ArticleHeader
ArticleBody
AuthorCard
TopicChip
RelatedStories
TrendingList
SearchBox
Footer
AdSlot
MediaCard
Gallery
VideoCard
NewsletterForm
```

CMS components:

```text
DataTable
FilterBar
RichEditor
MediaPicker
SEOPanel
SourcePanel
TranslationPanel
AIReviewPanel
WorkflowBar
RevisionDiff
```

---

# 95. Visual Direction

Design should be:

- Modern.
- Editorial.
- Trustworthy.
- Fast.
- High information density.
- White/light-first by default.
- Strong typographic hierarchy.
- Restrained use of color.
- Minimal glass effects.
- Minimal animations.
- No excessive rounded cards.
- No unnecessary gradients.
- No generic SaaS dashboard aesthetic.

---

# 96. Public Navigation

Desktop:
- Main category navigation.
- Secondary navigation.
- Trending topics.

Mobile:
- Bottom or compact category navigation where useful.
- Fast menu.
- Search.
- Language switch.

Do not let navigation become a JavaScript-heavy application shell.

---

# 97. Search Engine Crawlability

Important article links must exist in HTML.

Do not require:
- Client-side click handlers.
- Infinite scroll only.
- JS-only article discovery.

For pagination:
- Use crawlable links.
- Maintain stable category URLs.

---

# 98. Rendering Strategy

### Article pages
ISR / cached SSR.

### Category pages
ISR.

### Homepage
ISR with rapid revalidation.

### CMS
Dynamic/private.

### Search
Dynamic/cached.

### Author/topic
ISR.

Use on-demand revalidation after publication.

---

# 99. Cache TTL Suggestions

Initial values:

```text
Homepage: 30–120 seconds
Breaking: 15–30 seconds
Article: 5–15 minutes + on-demand purge
Category: 1–5 minutes
Topic: 5–15 minutes
Author: 15–60 minutes
Static pages: 1 day+
Assets: 1 year immutable
```

Tune using real traffic.

---

# 100. Database Performance

Avoid:
- N+1 queries.
- SELECT *.
- Unbounded queries.
- Large joins on public requests.
- Counting huge datasets synchronously.

Use:
- Pagination.
- Cursor pagination where appropriate.
- Covering indexes.
- Query caching.
- Aggregated metrics.

---

# 101. Shared Hosting Constraints

The backend must be designed to survive constrained PHP hosting.

Do not depend on:
- Long-running PHP workers.
- WebSockets.
- Shell commands for every request.
- Heavy image processing synchronously.
- Unlimited background workers.

Use asynchronous/edge automation for expensive tasks.

---

# 102. Cloudflare Configuration

Use:
- CDN.
- WAF.
- Bot protection.
- Rate limiting.
- Cache rules.
- Workers.
- Cron.
- Queues where available.
- Images/object storage where appropriate.

Do not cache authenticated responses.

---

# 103. Rate Limits

Example starting limits:

```text
Public API: 120 requests/min/IP
Login: 10 attempts/15 min/IP
CMS mutation: 60/min/user
Ingestion trigger: 10/min/service
AI generation: job-based
Media upload: size + rate limits
```

Tune after load testing.

---

# 104. API Error Format

Standardize:

```json
{
  "success": false,
  "error": {
    "code": "ARTICLE_NOT_FOUND",
    "message": "Article not found",
    "request_id": "..."
  }
}
```

Every request receives a request ID.

---

# 105. Logging

Structured JSON logs.

Include:
- request_id
- route
- status
- latency
- user_id if authenticated
- service
- error code

Never log passwords, tokens or secret keys.

---

# 106. Environment Configuration

Required:

```text
APP_ENV
APP_URL
API_URL

DB_HOST
DB_NAME
DB_USER
DB_PASSWORD

SESSION_SECRET

OPENAI_API_KEY / AI_PROVIDER_KEY

CLOUDFLARE_ACCOUNT_ID
CLOUDFLARE_API_TOKEN

MEDIA_STORAGE_KEY
MEDIA_STORAGE_SECRET

SMTP_HOST
SMTP_USER
SMTP_PASSWORD

ANALYTICS_KEYS
```

Use `.env.example`.

---

# 107. Seed Data

Provide development seeds:
- Categories.
- Admin user placeholder.
- Roles.
- Permissions.
- Demo sources.
- Demo authors.
- Demo articles.
- Demo topics.

Never ship real production passwords in seed files.

---

# 108. Deployment

## Frontend

```text
Git push
→ CI
→ tests
→ Next build
→ OpenNext build
→ Cloudflare deployment
```

## Backend

```text
Git push
→ CI
→ PHP tests
→ migration check
→ deployment package
→ cPanel deployment
```

## Database

Use versioned migrations.

Never manually alter production schema without migration tracking.

---

# 109. One-Shot Build Requirement

The implementation agent must not stop after scaffolding.

It must implement:

- Frontend.
- Public routes.
- CMS.
- Authentication.
- RBAC.
- Database.
- API.
- Editorial workflow.
- Source ingestion.
- AI pipeline abstraction.
- Translation.
- SEO.
- Sitemap.
- RSS.
- Search.
- Media.
- Image generation integration.
- Analytics.
- Audit logs.
- Notifications.
- Testing.
- Deployment configuration.
- Seed data.
- Documentation.

If an external credential is unavailable, implement the integration behind a clearly defined adapter and provide an environment-variable placeholder plus a working mock/local mode.

Do not replace missing integrations with hard-coded fake production functionality.

---

# 110. Antigravity / Coding-Agent Execution Strategy

Run the build as coordinated expert workstreams.

## Agent 1 — Product / UX
Validate:
- Information architecture.
- Navigation.
- Responsive behavior.
- Editorial UX.

## Agent 2 — Frontend
Implement:
- Next.js.
- Components.
- Routes.
- SSR/ISR.
- SEO.
- Performance.

## Agent 3 — Backend
Implement:
- PHP architecture.
- API.
- Auth.
- RBAC.
- Security.

## Agent 4 — Database
Implement:
- Schema.
- Migrations.
- Indexes.
- Seed data.
- Query optimization.

## Agent 5 — Editorial Automation
Implement:
- Sources.
- RSS/Atom.
- Source adapters.
- Deduplication.
- Story clustering.
- Draft pipeline.

## Agent 6 — AI
Implement:
- AI abstraction.
- Translation.
- Summarization.
- SEO.
- Quality checks.
- Prompt versioning.

## Agent 7 — Media
Implement:
- Upload.
- Image processing.
- Image variants.
- Featured-image generation.
- Attribution.

## Agent 8 — SEO / Search
Implement:
- Structured data.
- Sitemap.
- RSS.
- Search.
- Internal linking.
- Entity system.

## Agent 9 — Security
Audit:
- Auth.
- RBAC.
- Uploads.
- API.
- CORS.
- CSP.
- Rate limits.
- Secrets.

## Agent 10 — Performance
Audit:
- Core Web Vitals.
- Bundle size.
- Database latency.
- API latency.
- Cache hit ratio.
- Image payload.

## Agent 11 — QA
Run:
- Unit.
- Integration.
- E2E.
- Accessibility.
- Lighthouse.
- Security.
- Crawlability.

## Agent 12 — Release
Validate:
- Build.
- Environment variables.
- Migration.
- Deployment.
- Smoke tests.
- Rollback plan.

---

# 111. Agent Coordination Rules

Agents must not independently redesign core architecture.

Create:

```text
/docs/ARCHITECTURE.md
/docs/DATABASE.md
/docs/API.md
/docs/EDITORIAL.md
/docs/SEO.md
/docs/SECURITY.md
/docs/DEPLOYMENT.md
```

All agents must read these before implementation.

If an agent identifies a contradiction:
1. Document it.
2. Resolve it against product priorities.
3. Update architecture documentation.
4. Continue implementation.

Do not leave conflicting implementations.

---

# 112. Build Order

```text
1. Repository
2. Architecture
3. Database
4. API foundation
5. Authentication/RBAC
6. Public design system
7. Public pages
8. CMS
9. Editorial workflow
10. Media
11. Search
12. Source ingestion
13. AI pipeline
14. Translation
15. SEO
16. Analytics
17. Caching
18. Testing
19. Security audit
20. Performance audit
21. Deployment
22. Production smoke test
```

---

# 113. Definition of Done

The build is not complete until:

### Public
- Both languages work.
- Homepage works.
- Categories work.
- Article pages work.
- Search works.
- Author pages work.
- Topic pages work.
- Responsive design works.

### CMS
- Login works.
- RBAC works.
- Article creation works.
- Editing works.
- Revisions work.
- Approval works.
- Scheduling works.
- Publishing works.
- Translation works.
- Media works.

### Automation
- Source ingestion works.
- Duplicate detection works.
- AI draft generation works.
- Translation works.
- SEO generation works.
- Featured image pipeline works.
- Failed jobs can be retried.

### SEO
- Metadata works.
- Structured data works.
- Sitemap works.
- News sitemap works.
- RSS works.
- hreflang works.
- Canonicals work.

### Security
- Passwords hashed.
- Sessions secure.
- RBAC enforced server-side.
- Uploads sanitized.
- API protected.
- Secrets hidden.
- Audit logs work.

### Performance
- CDN caching works.
- ISR/revalidation works.
- Images optimized.
- JS minimized.
- No major layout shifts.

### Operations
- Backups configured.
- Logs available.
- Health checks work.
- Errors observable.
- Deployment documented.
- Rollback documented.

---

# 114. Launch Checklist

## Infrastructure
- [ ] Domain configured
- [ ] Cloudflare configured
- [ ] SSL active
- [ ] DNS verified
- [ ] WAF enabled
- [ ] Rate limits enabled

## Database
- [ ] Production database created
- [ ] Migrations executed
- [ ] Indexes verified
- [ ] Backup configured
- [ ] Restore tested

## CMS
- [ ] Super admin created securely
- [ ] Roles verified
- [ ] Password recovery tested
- [ ] 2FA tested if enabled

## Editorial
- [ ] Categories configured
- [ ] Authors configured
- [ ] Source policies configured
- [ ] Editorial guidelines loaded
- [ ] AI prompts reviewed

## SEO
- [ ] Search Console
- [ ] Sitemap submitted
- [ ] News sitemap verified
- [ ] Robots verified
- [ ] Structured data validated
- [ ] Canonicals verified
- [ ] hreflang verified

## Performance
- [ ] Lighthouse
- [ ] Mobile testing
- [ ] Image payload testing
- [ ] Cache testing
- [ ] Load testing

---

# 115. Key Product Principle

The platform should be optimized for **quality-adjusted publishing velocity**, not raw publishing volume.

The desired loop is:

```text
DISCOVER
   ↓
VERIFY
   ↓
UNDERSTAND
   ↓
DRAFT
   ↓
TRANSLATE
   ↓
OPTIMIZE
   ↓
HUMAN REVIEW
   ↓
PUBLISH
   ↓
DISTRIBUTE
   ↓
MEASURE
   ↓
IMPROVE
```

Automation should make journalists faster while preserving editorial accountability.

---

# 116. Final Technical Decisions

Unless implementation constraints force a documented change:

- Next.js App Router.
- TypeScript.
- React Server Components by default.
- Tailwind CSS.
- Cloudflare Workers + OpenNext.
- Cloudflare CDN/WAF.
- PHP 8.2+ API.
- MySQL 8.x.
- Server-side CMS sessions.
- RBAC + permissions.
- Structured content model.
- Translation-aware schema.
- RSS/Atom/API source adapters.
- Human approval required for automated drafts.
- AI provider abstraction.
- MySQL full-text search initially.
- Dedicated search engine later if needed.
- WebP/AVIF responsive media.
- News sitemap.
- RSS feeds.
- NewsArticle structured data.
- hreflang.
- Entity/topic architecture.
- Audit logs.
- Background jobs.
- Automated testing.
- CI/CD.
- Backup and rollback procedures.

---

# 117. Important Research / Implementation Notes

1. Google News is not to be treated as an unrestricted article-republishing API.
2. Automated scraping must respect source rights, robots directives, terms, rate limits and applicable law.
3. Publicly accessible source content is not automatically licensed for republication.
4. AI-generated mass content must not be used primarily to manipulate search rankings.
5. Automated translation/rewrite must add editorial value and remain subject to human review.
6. Search optimization should follow people-first SEO fundamentals.
7. There is no guaranteed "AIO/GEO" ranking mechanism; build for crawlability, clarity, authority, originality and usefulness.
8. Google News eligibility and search visibility are not guaranteed by schema alone.
9. The system should be designed so that editorial policies can override automation.

---

# 118. Success Metrics

## Editorial
- Time from source discovery to draft.
- Time from draft to publication.
- Articles reviewed per editor.
- Translation turnaround.
- Correction rate.
- AI rejection rate.

## Technical
- LCP.
- INP.
- CLS.
- API latency.
- DB latency.
- Cache hit rate.
- Error rate.

## SEO
- Indexed pages.
- Search impressions.
- Search clicks.
- CTR.
- News impressions.
- Top Stories visibility where applicable.
- Organic traffic.
- Query coverage.

## Audience
- Returning readers.
- Session depth.
- Reading time.
- Related-story CTR.
- Search usage.
- Language distribution.

---

# 119. Final Acceptance Statement

NepTechNews is considered production-ready only when the complete newsroom loop works end-to-end:

```text
External Source
      ↓
Automated Discovery
      ↓
Source Normalization
      ↓
Duplicate / Story Cluster Detection
      ↓
AI Draft + Translation + SEO
      ↓
Featured Image
      ↓
Quality / Fact Checks
      ↓
Human Editor
      ↓
Approval
      ↓
Publication
      ↓
Cloudflare Cache
      ↓
Search / News / RSS / Social
      ↓
Analytics
      ↓
Editorial Feedback
```

The implementation should prioritize **speed, reliability, editorial trust, maintainability and search discoverability** over unnecessary technical complexity.



# 120. Native First-Party Analytics & Measurement Platform

The platform must include a **native first-party analytics system** rather than making Google Analytics, Google Tag Manager, or other third-party analytics products the system of record.

Third-party platforms may be connected later as optional destinations, but the authoritative event stream and KPI database must belong to NepTechNews.

## 120.1 Design principle

```text
Browser / Server
      ↓
Native First-Party Tracking
      ↓
Event Collector
      ↓
Validation / Enrichment
      ↓
Event Queue / Batch
      ↓
Analytics Database
      ↓
Aggregation Engine
      ↓
Native Analytics Dashboard
      ↓
Optional Export / Integrations
```

The tracking system must be designed so that the same first-party events can later be forwarded to:
- Google Analytics
- Google Ads
- Meta
- TikTok
- LinkedIn
- CRM
- Data warehouse
- Internal BI systems
- Other APIs

The external destination must never become the source of truth.

---

# 121. Native Tracking Requirements

Track first-party events for:

## Page behavior

- Page view.
- Article view.
- Category view.
- Topic view.
- Author view.
- Search page view.
- Homepage view.
- 404 view.
- Error page view.
- Scroll milestones.
- Reading progress.
- Time engaged.
- Visibility duration.
- Exit.
- Back/forward navigation.

## Interaction

- Internal link click.
- Related article click.
- Navigation click.
- Search submission.
- Search result click.
- Language switch.
- Share button click.
- Copy article link.
- Print.
- Text-size change.
- Dark/light mode change.
- Video play/pause/completion.
- Audio play/pause/completion.
- Gallery interaction.
- Newsletter signup.
- Advertisement impression/click.
- Download.
- External link click.

## Editorial/product events

- Breaking-news click.
- Trending-story click.
- Homepage module click.
- Recommended-story click.
- Topic/entity click.
- Author click.
- Source link click.

---

# 122. Native Identity Model

Do not depend on third-party cookies.

Create first-party identifiers:

```text
anonymous_id
visitor_id
session_id
user_id
```

## Anonymous visitor

A random first-party identifier generated by the application.

## Logged-in user

If public accounts are introduced, associate events with the application's internal user ID.

Never send unnecessary personally identifiable information into the analytics event payload.

Do not store raw passwords, authentication tokens or sensitive personal data in analytics.

If an email address is ever required for a specific analytics use case, store a privacy-safe derived identifier rather than the raw address.

---

# 123. Session Model

Every visit receives:

```text
session_id
visitor_id
started_at
last_seen_at
landing_page
landing_referrer
landing_campaign
device_type
browser
os
country
region
language
```

Session timeout should be configurable.

Default:
- 30 minutes of inactivity.

---

# 124. Event Schema

Every event should have:

```text
event_id
event_name
occurred_at
received_at

visitor_id
session_id
user_id nullable

page_id
article_id nullable
category_id nullable
topic_id nullable

language
url
path
referrer

device_type
browser
browser_version
os
os_version
screen_width
screen_height
viewport_width
viewport_height
connection_type

country
region
city nullable

utm_source
utm_medium
utm_campaign
utm_term
utm_content

event_properties JSON
```

Add:

```text
request_id
trace_id
```

where the event is connected to a server request.

---

# 125. Server-Side + Client-Side Tracking

Use both.

## Client-side

Captures:
- clicks
- scroll
- engagement
- media interaction
- viewport
- browser/device data
- navigation behavior

## Server-side

Captures:
- request
- route
- status
- response latency
- cache state
- article ID
- language
- server errors
- bot classification
- request ID
- trace ID

The two streams should be joinable without exposing unnecessary user identity.

---

# 126. Tracking Endpoint

Use a first-party endpoint:

```text
POST /api/v1/analytics/events
```

Requirements:
- Lightweight.
- Batched events.
- Beacon API support.
- `keepalive`.
- Compression.
- Validation.
- Rate limiting.
- Bot filtering.
- Schema versioning.

Example:

```json
{
  "schema_version": 1,
  "events": [
    {
      "event_name": "article_view",
      "occurred_at": "2026-08-10T17:55:00Z",
      "visitor_id": "...",
      "session_id": "...",
      "article_id": 123,
      "language": "np"
    }
  ]
}
```

Do not make analytics failure block page rendering.

---

# 127. Analytics Data Layers

Use separate tables/storage for:

```text
raw_events
sessions
page_views
article_views
engagement_events
conversion_events
error_events
performance_events

daily_page_metrics
daily_article_metrics
daily_category_metrics
daily_source_metrics
daily_device_metrics
daily_country_metrics
daily_campaign_metrics
```

Raw events may be retained for a shorter period.

Aggregated metrics should have longer retention.

---

# 128. Native KPI Dashboard

CMS navigation:

```text
Analytics
├── Overview
├── Realtime
├── Content
├── Acquisition
├── Audience
├── Technology
├── Search
├── Engagement
├── Conversion
├── Performance
├── Errors
└── Exports
```

---

# 129. Analytics Overview

Display:

- Pageviews.
- Unique visitors.
- Sessions.
- Engaged sessions.
- Average engagement time.
- Articles viewed.
- Pages/session.
- Returning visitor rate.
- Bounce/low-engagement rate.
- CTR.
- Internal CTR.
- Share rate.
- Newsletter conversion.
- Search usage.
- Error rate.
- 404 rate.
- Core Web Vitals.
- API latency.

Compare:
- Today.
- Yesterday.
- 7 days.
- 28 days.
- Custom date range.

---

# 130. Content Analytics

For each article:

```text
Views
Unique readers
Sessions
Average engaged time
Scroll completion
Internal CTR
Related-story CTR
Social shares
External referrers
Search traffic
Direct traffic
Language
Country
Device
New vs returning
Publication → first 1h / 6h / 24h performance
```

Useful editorial KPIs:

- Views per article.
- Views per author.
- Views per category.
- Median article performance.
- Top 10%.
- Underperforming articles.
- Headline CTR.
- Homepage-to-article CTR.
- Related-story CTR.

---

# 131. Acquisition Analytics

Track:

- Direct.
- Organic search.
- Referral.
- Social.
- Campaign/UTM.
- Newsletter.
- Internal navigation.

UTM parameters:

```text
utm_source
utm_medium
utm_campaign
utm_term
utm_content
```

Also preserve first-touch and last-touch attribution where practical.

---

# 132. Search Analytics

Native site search must track:

- Search query.
- Language.
- Result count.
- Result clicks.
- No-result searches.
- Search CTR.
- Query-to-article conversion.
- Search refinements.

Dashboard:

```text
Top Searches
Zero Result Searches
Highest Search CTR
Lowest Search CTR
Searches by Language
Searches by Device
```

This can directly inform:
- new content.
- taxonomy.
- synonyms.
- topic creation.

---

# 133. Device / Technology Analytics

Collect:

- Device category.
- Mobile/tablet/desktop.
- OS.
- Browser.
- Browser version.
- Screen resolution.
- Viewport.
- Device pixel ratio.
- Connection type where available.
- Language.
- Reduced-motion preference.
- Dark-mode preference where relevant.

Use this to identify performance regressions.

---

# 134. Geographic Analytics

Where technically available and legally appropriate:

- Country.
- Region.
- City at coarse granularity.
- Language.
- Timezone.

Do not store precise GPS coordinates.

Dashboard:

```text
Readers by country
Readers by region
Country → top articles
Country → language
Country → device
Country → engagement
```

---

# 135. Real-Time Dashboard

Show approximately real-time:

- Active sessions.
- Active readers.
- Current pages.
- Current articles.
- Current countries.
- Traffic source.
- Device.
- Current errors.
- Current 404s.

Use short-lived aggregation rather than expensive per-event dashboard queries.

---

# 136. Native CTR Measurement

Track CTR for:

- Homepage story cards.
- Category story cards.
- Trending.
- Related stories.
- Search results.
- Internal recommendations.
- Newsletter.
- Ads.
- Navigation.

Example:

```text
Homepage Politics Module
Impressions: 120,000
Clicks: 14,400
CTR: 12.0%
```

Store both impressions and clicks so CTR is reproducible.

Never rely only on a calculated UI value.

---

# 137. Native Search Performance vs Google Search Performance

The system can natively collect **site-search** data and all on-site behavioral data.

It cannot independently know Google's private search impressions, clicks, average position or Search Console query data merely from browser tracking.

Therefore implement an optional **Google Search Console integration** that imports Search Console data into the native dashboard.

The native analytics database remains the system of record, while Search Console is treated as an external data source.

Import where available:

- Search queries.
- Impressions.
- Clicks.
- CTR.
- Average position.
- Search country.
- Device.
- Search appearance.
- Page.
- Date.

Similarly, external advertising platforms can be imported into the native analytics system without becoming the primary event store.

---

# 138. Native Tag/Data Layer

Create an internal event/data layer:

```text
window.__NPN_DATA__
```

and a typed event API:

```text
track("article_view", payload)
track("story_click", payload)
track("search", payload)
track("share", payload)
```

Do not expose sensitive internal state.

This makes future integrations possible without rewriting the application.

---

# 139. Analytics Export Layer

Admin can export:

- CSV.
- JSON.
- API.
- Scheduled reports.

Filters:
- Date.
- Language.
- Article.
- Category.
- Author.
- Device.
- Country.
- Source.
- Campaign.

Future:
- Webhooks.
- BigQuery.
- Snowflake.
- PostHog-compatible event export if desired.
- CRM destinations.

---

# 140. Data Retention / Privacy

Define configurable retention.

Example:

```text
Raw event data: 90 days
Detailed sessions: 180 days
Aggregated analytics: 24+ months
Error logs: 180 days
Audit logs: 24+ months
```

Retention must be configurable based on applicable privacy/legal requirements.

Provide:
- Privacy policy.
- Cookie/consent controls where legally required.
- Data deletion workflow.
- User data export workflow if accounts exist.
- Analytics opt-out.
- Do-not-track consideration.

First-party does not automatically mean privacy-free; collect only what is needed.

---

# 141. Analytics Reliability

Analytics must never become a critical dependency for the public site.

If analytics is down:

```text
Public page: WORKS
Article: WORKS
CMS: WORKS
Analytics dashboard: DEGRADED
```

Events should be buffered/retried when practical.

---

# 142. Deep Error Tracking & Observability Platform

The platform must have **native application observability**.

The goal is:

> Never ask "what happened?" when an error occurs.

Every meaningful failure should produce enough context to determine:

1. What failed?
2. Where did it fail?
3. Which release introduced it?
4. What triggered it?
5. Which user/session/request was affected?
6. What was the system doing immediately before failure?
7. What dependencies were involved?
8. What was the response/status?
9. How often is it happening?
10. What code changed recently?
11. What is the likely root cause?
12. How can it be reproduced?

---

# 143. Error Classes

Track at minimum:

```text
JavaScript runtime errors
React rendering errors
Hydration errors
Route errors
404s
500s
API errors
Database errors
Authentication errors
Authorization errors
Validation errors
Media upload errors
Image processing errors
AI errors
Translation errors
Ingestion errors
Search errors
Cache errors
Cron errors
Queue errors
Third-party integration errors
Timeouts
Rate-limit errors
Deployment errors
```

---

# 144. Error Event Schema

Every error should contain:

```text
error_id
error_code
severity
timestamp

environment
release_id
git_commit_sha

service
route
method

request_id
trace_id
session_id
visitor_id
user_id nullable

status_code
error_message
error_stack

browser
browser_version
os
device
country

url
referrer

component
function
file
line
column

trigger_event

request_metadata
response_metadata

database_query_id nullable
job_id nullable
source_id nullable
article_id nullable

first_seen
last_seen
occurrence_count
```

Do not store secrets or sensitive request bodies.

---

# 145. Error Fingerprinting

Group repeated errors into a single issue.

Example:

```text
ERROR #NPN-API-0042
"Article query timeout"

Occurrences: 18,293
Affected users: 7,842
First seen: release abc123
Latest: release def456
Endpoint: GET /api/v1/articles
DB query: article_list
```

The system should avoid creating thousands of duplicate error records for the same underlying bug.

---

# 146. Error Severity

```text
P0 — Site/system unavailable
P1 — Major feature unavailable
P2 — Significant degradation
P3 — Non-critical error
P4 — Informational
```

Example:

- Blank homepage → P0.
- CMS publishing broken → P1.
- Search occasionally failing → P2.
- One malformed optional embed → P3.

---

# 147. Error Context / Breadcrumbs

Before an error occurs, store a short sequence of relevant application events:

```text
Page loaded
→ Homepage API requested
→ Article API requested
→ User clicked Politics
→ Navigation started
→ Category API returned 500
→ Error boundary rendered
```

This should be stored as a compact breadcrumb trail.

Do not record passwords, tokens or sensitive form fields.

---

# 148. Blank Screen Detection

Implement React error boundaries at multiple levels:

```text
Root Error Boundary
Layout Error Boundary
Homepage Error Boundary
Category Error Boundary
Article Error Boundary
Widget Error Boundary
CMS Error Boundary
```

If a component fails:
- Capture error.
- Capture stack.
- Capture route.
- Capture release.
- Capture component.
- Show a useful fallback UI.
- Provide retry.
- Continue rendering unaffected modules where possible.

A single broken widget should not blank the entire page.

---

# 149. 404 Intelligence

Every 404 should be tracked.

Capture:

```text
requested_url
referrer
language
country
device
timestamp
user/session
```

Dashboard:

```text
Top 404 URLs
404 sources
404 count
First seen
Last seen
Suggested redirect
```

Automatically detect:
- broken internal links.
- old article slugs.
- deleted pages.
- malformed URLs.
- bot-generated junk paths.

---

# 150. Automatic 404 Resolution Suggestions

For a 404:

1. Normalize requested path.
2. Search known historical slugs.
3. Search article title similarity.
4. Search topic/category.
5. Suggest nearest valid URL.
6. Allow editor to create a permanent redirect.

Do not automatically redirect unrelated URLs.

---

# 151. Request Tracing

Every request receives:

```text
request_id
trace_id
```

Example:

```text
Browser
 ↓
Cloudflare
 ↓
Next.js
 ↓
API
 ↓
MySQL
```

The same trace ID should follow the request where technically possible.

This makes cross-layer debugging possible.

---

# 152. Performance Tracing

Track:

- DNS time where available.
- TTFB.
- Server processing time.
- API latency.
- DB latency.
- Cache hit/miss.
- Image processing time.
- AI job time.
- Search latency.
- JS errors.
- Long tasks.
- Core Web Vitals.

Store release/commit association.

---

# 153. Release-Aware Error Tracking

Every deployment creates:

```text
release_id
git_commit_sha
build_time
environment
```

When an error occurs:

```text
Error → Release → Commit → PR → Changed files
```

Dashboard should answer:

> Did this error start after the latest deployment?

---

# 154. Error Dashboard

CMS:

```text
Observability
├── Overview
├── Errors
├── 404s
├── API
├── Database
├── Frontend
├── Jobs
├── Ingestion
├── AI
├── Performance
├── Releases
└── Health
```

Metrics:

- Error rate.
- Error-free sessions.
- 404 rate.
- 5xx rate.
- API latency.
- DB latency.
- JS exception rate.
- Hydration failure rate.
- Job failure rate.
- AI failure rate.
- Ingestion failure rate.

---

# 155. Error Detail Page

Each issue should show:

```text
Title
Severity
Status
First seen
Last seen
Occurrences
Affected users
Affected routes

Release
Commit
Environment

Stack trace
Breadcrumbs
Request trace
Browser/device
Country
Session context

Recent code changes
Related logs
Related deployments

Likely cause
Reproduction steps
Suggested fix
Resolution notes
```

The final three fields can be generated by an AI debugging assistant, but must be clearly labeled as AI-generated hypotheses.

---

# 156. AI Debugging Assistant

Given an error, the system/agent should be able to produce:

```text
Observed:
API returned 500.

Likely cause:
Database connection pool exhausted.

Evidence:
- 4,812 matching errors
- Started after commit abc123
- Average DB latency increased 6×
- Endpoint /articles

Likely fix:
Review connection lifecycle in...

Confidence:
High

Suggested tests:
...
```

AI must distinguish:
- observed evidence
- inference
- hypothesis

It must never present a guess as a confirmed root cause.

---

# 157. Learning / Error Knowledge Base

Create:

```text
/docs/learning/
```

Each resolved issue becomes a structured entry:

```text
Issue ID
Date
Symptoms
Root Cause
Evidence
Affected Components
Fix
Tests Added
Prevention
Related Commit
Related PR
Lessons
```

This becomes persistent engineering memory for future agents.

---

# 158. Incident Log

Create:

```text
/docs/incidents/
```

For major incidents:

```text
Incident ID
Severity
Start
End
Impact
Detection
Timeline
Root Cause
Resolution
Preventive Action
Tests Added
Commit
Deployment
```

---

# 159. Agent Continuity / Handover System

The project must assume that an AI coding session can terminate because of:

- Token exhaustion.
- Context compaction.
- Session timeout.
- Tool failure.
- Model failure.
- Agent crash.
- Authentication expiry.
- User switching agents.

Therefore progress cannot exist only in chat history.

The repository itself must contain the authoritative project state.

---

# 160. Required Agent Handover Files

Create:

```text
/AGENTS.md
/PROJECT_STATE.md
/TASKLIST.md
/HANDOVER.md
/LEARNINGS.md
/DECISIONS.md
/ERRORS.md
/CHANGELOG.md
/ARCHITECTURE.md
/IMPLEMENTATION_STATUS.md
```

These are living documents.

---

# 161. TASKLIST.md

Must contain:

```text
Epic
Task
Subtask
Status
Priority
Owner/Agent
Dependencies
Files
Tests
Commit
Notes
```

Statuses:

```text
BACKLOG
READY
IN_PROGRESS
BLOCKED
REVIEW
DONE
DEFERRED
```

No agent should claim a task is complete without verification.

---

# 162. PROJECT_STATE.md

Short machine-readable snapshot:

```text
Current phase:
Current task:
Last completed task:
Current blocker:
Last commit:
Tests status:
Build status:
Known errors:
Next exact action:
```

This file should be updated after every meaningful work session.

---

# 163. HANDOVER.md

At session end the agent must write:

```text
What was completed
What changed
Files changed
Tests run
Tests passed
Tests failed
Current problem
Why it exists
What was attempted
What should happen next
Exact command to continue
Relevant commit
```

The next agent should be able to continue without reading the entire conversation.

---

# 164. LEARNINGS.md

Record reusable knowledge:

```text
Problem
Discovery
Correct solution
Wrong approaches
Why they failed
Future rule
```

Examples:
- Cloudflare deployment quirk.
- MySQL connection issue.
- Next.js caching behavior.
- CMS authorization edge case.
- Nepali font issue.
- AI prompt failure.

---

# 165. DECISIONS.md

Architecture Decision Records:

```text
ADR-001
Decision:
Context:
Options:
Chosen:
Reason:
Trade-offs:
Date:
```

Never silently reverse an architectural decision.

---

# 166. CHANGELOG.md

Every meaningful implementation milestone:

```text
Version / Date
Added
Changed
Fixed
Security
Performance
Database
Migration
```

Git remains the authoritative code history; this file is the human/agent summary.

---

# 167. GitHub Micro-Commit Strategy

Use small, atomic commits.

Examples:

```text
feat(db): add story translation schema
feat(auth): add secure CMS sessions
feat(cms): add article editor
feat(analytics): add first-party event collector
feat(obs): add frontend error boundaries
fix(api): prevent article query timeout
perf(web): reduce homepage hydration
seo(article): add NewsArticle schema
test(auth): add role enforcement tests
docs(handover): record CMS implementation state
```

Do not create enormous "build everything" commits.

---

# 168. Commit Rules

Each commit should:
- Do one logical thing.
- Build successfully where practical.
- Have tests where applicable.
- Avoid unrelated formatting changes.
- Explain why when the change is non-obvious.

Never commit:
- Secrets.
- Production credentials.
- `.env`.
- Temporary debugging dumps.
- Generated personal data.

---

# 169. Git Branching

Recommended:

```text
main
develop
feature/*
fix/*
hotfix/*
```

For an AI-heavy project, keep feature branches short-lived.

Every merge should have:
- Tests.
- Build verification.
- Review.
- Clear commit history.

---

# 170. CI/CD Pipeline

GitHub Actions:

```text
Push
 ↓
Lint
 ↓
Type Check
 ↓
Unit Tests
 ↓
PHP Tests
 ↓
Integration Tests
 ↓
Security Scan
 ↓
Build
 ↓
Lighthouse
 ↓
E2E
 ↓
Migration Validation
 ↓
Deploy Staging
 ↓
Smoke Tests
 ↓
Production Approval
 ↓
Deploy
 ↓
Post-deploy Health Check
```

---

# 171. Deployment Rollback

Every production release must be traceable to a Git commit.

Rollback must support:

```text
Current release
      ↓
Previous known-good release
```

Database migrations must be designed carefully so application rollback does not immediately break the previous version.

Use expand/contract migration patterns for risky schema changes.

---

# 172. Post-Deployment Verification

Automatically verify:

- Homepage 200.
- Nepali homepage 200.
- English homepage 200.
- Sample article 200.
- Category 200.
- Search 200.
- Sitemap 200.
- RSS 200.
- API health.
- Database health.
- Auth health.
- Analytics ingestion.
- Error collector.
- No unexpected 5xx spike.

If critical checks fail:
- Mark deployment unhealthy.
- Alert.
- Roll back where safe.

---

# 173. Synthetic Monitoring

Create scheduled health checks for:

```text
Homepage
Article
Category
Search
CMS login
API
Sitemap
RSS
Analytics endpoint
```

Record:
- Response status.
- TTFB.
- Total time.
- Error body.
- Release ID.

This catches failures before users report them.

---

# 174. Test Failure Learning Loop

When CI fails:

```text
CI failure
 ↓
Create error record
 ↓
Classify
 ↓
Link commit
 ↓
Agent investigates
 ↓
Fix
 ↓
Add regression test
 ↓
Commit
 ↓
Close error
 ↓
Write learning
```

Do not repeatedly fix the same symptom without adding a regression test when appropriate.

---

# 175. Agent Context Efficiency Strategy

The project should be optimized for **retrieval instead of repeated full-repository reading**.

Use:

- Graphify.
- Caveman.
- Structured documentation.
- Small commits.
- Task files.
- Architecture records.
- Error knowledge.
- Searchable logs.

The agent should first retrieve relevant project context and only then inspect source files.

---

# 176. Graphify Integration

Use the official Graphify project:

urlGraphify GitHub repositoryhttps://github.com/Graphify-Labs/graphify

Graphify currently describes itself as a local knowledge-graph tool for codebases, documentation, schemas, configs and other project material. It parses code with ASTs and creates a graph that can be queried instead of repeatedly grepping/reading the repository. It also supports installation for Antigravity and multiple coding agents. citeturn0search3

## Required workflow

After initial architecture:

```text
graphify .
```

Generate:

```text
graphify-out/
├── graph.html
├── graph.json
└── GRAPH_REPORT.md
```

The graph should include:
- Source code.
- Docs.
- Database schema.
- API contracts.
- Architecture.
- Tasklist.
- Error knowledge.
- Deployment documentation.

Regenerate/update the graph after significant architecture changes.

---

# 177. Graphify Agent Rule

Add to `AGENTS.md`:

```text
Before broad codebase exploration:
1. Query Graphify.
2. Identify relevant modules/files.
3. Read only the required source.
4. Use raw search when Graphify does not contain enough detail.

Do not repeatedly scan the entire repository when a graph query can answer the structural question.
```

Graphify should reduce context consumption, but it must not become a source of truth over the actual code.

The source code and Git history remain authoritative.

---

# 178. Caveman Integration

Use the official Caveman project:

urlCaveman GitHub repositoryhttps://github.com/juliusbrussee/caveman

Caveman is intended to reduce coding-agent output verbosity while preserving technical information, and its current distribution supports multiple coding agents including Antigravity. citeturn0search1turn0search4

Use it for:
- Agent responses.
- Progress summaries.
- Tool-output compression where supported.
- Context-efficient development.

Do not use Caveman as a replacement for:
- Documentation.
- Error logging.
- Git.
- Tests.
- Source code.
- Architecture decisions.

---

# 179. Graphify + Caveman + Git + Handover Model

The complete agent continuity system is:

```text
                  ┌──────────────┐
                  │ Git History  │
                  │ Source Truth │
                  └──────┬───────┘
                         │
              ┌──────────▼──────────┐
              │     Graphify        │
              │ Structural Context  │
              └──────────┬──────────┘
                         │
        ┌────────────────▼────────────────┐
        │ Project Memory / Handover       │
        │ TASKLIST / STATE / LEARNINGS    │
        │ DECISIONS / ERRORS / ARCHITECTURE│
        └────────────────┬────────────────┘
                         │
                  ┌──────▼──────┐
                  │ AI Agent    │
                  │ + Caveman   │
                  └─────────────┘
```

This prevents a new session from needing to reconstruct the entire project from scratch.

---

# 180. Agent Startup Protocol

Every new agent/session must execute:

```text
1. Read AGENTS.md.
2. Read PROJECT_STATE.md.
3. Read TASKLIST.md.
4. Read HANDOVER.md.
5. Read relevant DECISIONS.md entries.
6. Query Graphify for the current task.
7. Inspect Git status.
8. Inspect latest commits.
9. Run relevant tests.
10. Continue only from the recorded state.
```

The agent must not assume previous work.

---

# 181. Agent Shutdown Protocol

Before ending a session:

```text
1. Finish or checkpoint current task.
2. Run relevant tests.
3. Commit work.
4. Update PROJECT_STATE.md.
5. Update TASKLIST.md.
6. Update HANDOVER.md.
7. Record new learning if applicable.
8. Record architectural decisions if applicable.
9. Record unresolved errors.
10. State exact next action.
```

If the session ends unexpectedly, the latest Git commit plus state files must still provide enough information to resume.

---

# 182. Native Observability vs External Observability

The system should own its core observability data.

Optional integrations can later send events to:
- Sentry.
- Datadog.
- Grafana.
- OpenTelemetry collectors.
- Cloudflare.
- Other monitoring platforms.

But the application must remain diagnosable without them.

Where OpenTelemetry-compatible tracing is used, preserve the native request/trace IDs so external systems can be connected later.

---

# 183. Native Analytics vs Third-Party Analytics

The same principle applies:

```text
Native event stream = source of truth

External platforms = destinations / comparison sources
```

This prevents:
- vendor lock-in.
- losing historical data.
- inconsistent event definitions.
- dependence on browser third-party scripts.
- performance impact from multiple analytics libraries.

---

# 184. Analytics Event Governance

Create:

```text
/docs/analytics/EVENTS.md
```

Every event must have:

```text
Event name
Description
Trigger
Required properties
Optional properties
Privacy classification
Destination
Owner
Version
```

Example:

```text
article_view

Trigger:
Article becomes visible and qualifies as a view.

Required:
article_id
language
session_id
visitor_id

Optional:
referrer
campaign
position
module

Version:
1
```

Do not allow developers to invent arbitrary event names without documentation.

---

# 185. Analytics Schema Versioning

Every event:

```text
schema_version
```

When the payload changes:
- Increment version.
- Maintain backward compatibility where practical.
- Update event documentation.
- Update aggregation logic.

---

# 186. Bot and Crawler Analytics

Separate:

```text
human traffic
known crawlers
unknown automation
suspicious traffic
```

Do not mix Googlebot/Bingbot/etc. with human KPI numbers.

Store bot classification and confidence.

Do not attempt to spoof crawler identity.

---

# 187. Privacy-Safe User Analytics

The requirement for "user ID" should mean an internal pseudonymous identifier.

Never expose:
- email
- password
- authentication token
- full IP address in dashboard
- sensitive personal information

unless explicitly required, legally permitted and protected.

Where IP is used for coarse geo/security:
- process it server-side.
- derive country/region.
- avoid unnecessary long-term storage of raw IP.

---

# 188. Performance Requirement for Native Tracking

Analytics must be nearly invisible to page performance.

Rules:
- Do not block rendering.
- Batch events.
- Use `sendBeacon` when appropriate.
- Defer non-critical processing.
- Compress payloads.
- Avoid giant analytics JavaScript.
- Avoid third-party tracking libraries by default.
- Keep tracking code modular and small.

Target:
- Tracking should not materially worsen LCP, INP or CLS.

---

# 189. Native Data Warehouse Readiness

Design event data so it can eventually be moved to a warehouse.

Use:
- immutable event IDs.
- UTC timestamps.
- versioned schemas.
- stable entity IDs.
- stable article IDs.
- stable session/visitor IDs.
- source metadata.

Future export:

```text
MySQL / Analytics Store
        ↓
Batch / Stream Export
        ↓
Warehouse
        ↓
BI / ML / Forecasting
```

---

# 190. Editorial Intelligence From Native Analytics

Use native analytics to automatically identify:

- High-performing topics.
- Underperforming headlines.
- Best publishing times.
- Best categories.
- Best homepage modules.
- Best internal-link targets.
- Search demand.
- Content decay.
- Returning-reader topics.
- Language-specific performance.
- Geographic content interests.

This can feed the newsroom recommendation engine.

---

# 191. Automated KPI Alerts

Allow admins to configure:

```text
Alert if:
- 5xx > threshold
- 404s spike
- article views spike
- article views collapse
- CTR drops
- API latency spikes
- DB latency spikes
- Core Web Vitals regress
- ingestion stops
- AI jobs fail
- source feed fails
```

Alerts can appear in:
- CMS.
- Email.
- Webhook.
- Slack/Discord later.

---

# 192. Error-to-Git Correlation

When possible:

```text
Error
 ↓
Release
 ↓
Commit
 ↓
Changed file
 ↓
Author/agent
 ↓
PR
 ↓
Test
```

This makes debugging significantly faster.

---

# 193. Production Debugging Workflow

When a problem occurs:

```text
1. Open Observability.
2. Identify error fingerprint.
3. Inspect occurrence spike.
4. Inspect release correlation.
5. Inspect trace.
6. Inspect breadcrumbs.
7. Inspect logs.
8. Inspect affected route.
9. Inspect related Git commit.
10. Reproduce locally/staging.
11. Fix.
12. Add regression test.
13. Deploy.
14. Verify error rate falls.
15. Document learning.
```

No blind trial-and-error debugging should be required.

---

# 194. New Project Documentation Tree

Final documentation structure:

```text
docs/
├── ARCHITECTURE.md
├── DATABASE.md
├── API.md
├── EDITORIAL.md
├── SEO.md
├── SECURITY.md
├── DEPLOYMENT.md
├── ANALYTICS.md
├── OBSERVABILITY.md
├── SOURCE_POLICY.md
├── AI.md
├── TESTING.md
├── PERFORMANCE.md
├── adr/
├── analytics/
│   └── EVENTS.md
├── incidents/
└── learning/

AGENTS.md
PROJECT_STATE.md
TASKLIST.md
HANDOVER.md
LEARNINGS.md
DECISIONS.md
ERRORS.md
CHANGELOG.md
IMPLEMENTATION_STATUS.md
```

---

# 195. Expanded Definition of Done — Observability

The build is not complete until:

- [ ] Native pageview tracking works.
- [ ] Native event tracking works.
- [ ] Anonymous visitor IDs work.
- [ ] Session IDs work.
- [ ] User IDs work for authenticated users if accounts are enabled.
- [ ] Country/device/language attribution works.
- [ ] Internal CTR works.
- [ ] Search analytics works.
- [ ] Real-time dashboard works.
- [ ] Historical dashboard works.
- [ ] CSV/JSON export works.
- [ ] Event schema is documented.
- [ ] Analytics failure does not break public pages.
- [ ] Frontend errors are captured.
- [ ] Backend errors are captured.
- [ ] API errors are captured.
- [ ] 404s are captured.
- [ ] Hydration failures are captured.
- [ ] Blank-screen protection exists.
- [ ] Request tracing exists.
- [ ] Release correlation exists.
- [ ] Error fingerprinting exists.
- [ ] Error dashboard exists.
- [ ] Error learning system exists.
- [ ] Synthetic monitoring exists.
- [ ] Git commit correlation exists.
- [ ] CI/CD exists.
- [ ] Rollback works.
- [ ] Handover files exist.
- [ ] Graphify is integrated into agent workflow.
- [ ] Caveman is integrated into agent workflow.
- [ ] New-session startup protocol is documented.
- [ ] New-session continuation has been tested.

---

# 196. Final Operating Principle

NepTechNews should be built as a **self-observing, self-documenting newsroom platform**.

The platform should not merely publish news.

It should know:

```text
WHAT was published
WHO published it
WHERE it came from
HOW it was produced
WHICH AI operations touched it
WHO approved it
WHEN it changed
WHO is reading it
HOW readers discovered it
WHAT readers clicked
WHICH stories perform
WHICH stories fail
WHICH pages return 404
WHICH code caused an error
WHICH deployment introduced the error
WHAT was done to fix it
WHAT the next agent needs to know
```

The system's source of truth is:

```text
Code       → Git
Architecture → ADR / docs
Project state → PROJECT_STATE
Work       → TASKLIST
Session continuity → HANDOVER
Learning   → LEARNINGS
Errors     → ERRORS / Observability
Analytics  → Native event store
Content    → Editorial database
Relationships → Entity/content model
Agent context → Graphify + project memory
```

This architecture is specifically intended to make the project resilient not only to production failures, but also to **AI-agent failure, context loss, token exhaustion and session changes**.
