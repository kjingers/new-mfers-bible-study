# Feature Request: Bible Verse Auto-Linking

## The Problem

When reading assignments or discussion questions reference Bible verses (like "Romans 8:28" or "John 3:16-17"), users currently have to leave the app, open a separate Bible app, and look them up manually. This breaks the flow, especially during a live discussion.

## What I Want

**Automatic detection:** When text is saved (reading assignments, discussion questions, etc.), scan it for Bible verse references and turn them into clickable links.

**Quick lookup:** When someone taps a verse link, show a modal with the verse text. Include tabs for 4 translations:
- NIV (New International Version)
- KJV (King James Version)  
- NLT (New Living Translation)
- MSG (The Message)

This way people can quickly see the verse in their preferred translation without leaving the app.

## Technical Context

- Use **Microsoft Azure OpenAI** (I have access via the same Azure account the app is hosted on) to fetch the verse text
- GPT-4 or whatever model is available should work - I've done this before in a previous version and it worked well
- The verse detection/linking should happen:
  - When content is first created
  - When content is edited
  - Maybe on initial deploy to catch existing content

## Things to Figure Out

I'll leave these decisions to you:

- **Verse detection approach** - Regex? AI-powered parsing? Some combination? Bible references can be tricky ("Romans 8:28", "Rom 8:28", "Romans 8:28-30", "Genesis 1:1-2:3", etc.)
- **When to process** - On save? On render? Cache the results?
- **Modal UX** - How should it look on mobile? How do the translation tabs work?
- **Error handling** - What if a verse lookup fails? What if the AI returns weird results?
- **Performance** - Should verses be fetched on-demand or pre-cached?

## Example

**Before (raw text):**
> "Read Romans 8:1-11 and reflect on what it means to live by the Spirit. Compare with Galatians 5:16-25."

**After (with links):**
> "Read [Romans 8:1-11] and reflect on what it means to live by the Spirit. Compare with [Galatians 5:16-25]."

User taps "Romans 8:1-11" → Modal opens with the passage in all 4 translations.

## Notes

- This is a nice-to-have feature, not critical path - get the core app working first
- I know this is doable because I built it before, but feel free to improve on my old approach
- If you think a different set of translations would be better, I'm open to it
- Make sure it works well on mobile since that's how most people will use it