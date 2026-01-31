# Bible Study App - Build From Scratch

## Overview

Build a web application for a small group Bible study that meets every Tuesday. You're starting from scratch - no existing codebase to work with. You have full creative control over architecture, tech stack, UI/UX, and implementation decisions.

Use modern best practices. Make it beautiful. Make it work great on phones.

---

## Project Setup

**GitHub Repository:** https://github.com/kjingers/new-mfers-bible-study

**Hosting:** Microsoft Azure  
- Account: `kurtis.ingersoll@gmail.com`
- **Important:** Create ALL new resources in a NEW resource group. Do not use any existing Azure resources.
- Make sure you have access to this Azure account before proceeding.

---

## Documentation & Workflow

### Keep Implementation Docs

Save your plans and progress to a `/docs` folder in the repo. This is critical - if a new agent needs to pick up where you left off, they should be able to read these docs and understand:

- Overall architecture and tech decisions
- What's been completed
- What's in progress
- What's remaining

Suggested docs:
- `docs/ARCHITECTURE.md` - Tech stack, data model, key decisions
- `docs/PROGRESS.md` - What's done, what's next, current status
- `docs/SETUP.md` - How to run locally, environment setup
- `docs/DEPLOYMENT.md` - Azure setup and deployment process

Keep these updated as you work.

### GitHub Issues & PRs

Work through the project systematically:

1. **Create GitHub issues** for each major task/feature
2. **Pick up issues one by one** - don't try to do everything at once
3. **Use pull requests** for changes
4. **Close issues** as you complete them

This creates a clear trail of what's been done and what's left.

---

## Who This Is For

- A small group of families (~8-12 people)
- Not technical - the app needs to be intuitive
- Primary device: phones (especially during Tuesday meetings)
- Weekly routine: eat dinner together, then discuss the week's reading

---

## Core Domain

### Studies

A **study** is a multi-week series (typically 10-15 weeks). Studies don't overlap - when one ends, another begins. Each study focuses on a book or topic.

Examples:
- "The Book of Romans" (12 weeks)
- "Mere Christianity by C.S. Lewis" (10 weeks)

### Weeks

Each study consists of **weeks**. We meet every Tuesday, so:
- A study starts on a Tuesday and ends on a Tuesday
- Each week corresponds to one Tuesday meeting

Each week has:

1. **Required Reading**
   - Could be Bible passages (e.g., "Romans 5:1-21")
   - Could be book chapters (e.g., "Chapters 3-4")
   - Could be both

2. **Discussion Questions**
   - Numbered list (typically 8-12 questions)
   - Questions can be long (multiple sentences)
   - These are discussed during the Tuesday meeting

### Meals

One family brings dinner each week. We need:
- Sign-up system (one family per week)
- What they're bringing
- Head count (how many people are coming so they know how much to make)

Families should be able to RSVP with their count (adults + children). One person can RSVP for their whole family.

---

## Key User Flows

### "What's happening this week?"

Someone opens the app. They should immediately see:
- This week's reading assignment
- This week's discussion questions
- Who's bringing food / what's the meal
- RSVP status

*"This week" = the next upcoming Tuesday, including today if it's Tuesday*

### "What was the question again?"

During the meeting, the leader reads a discussion question. People think about their answer. Someone says "wait, can you repeat the question?"

This happens constantly because questions are long and hard to remember while formulating a thoughtful response.

**Desired solution:** Real-time sync so everyone can see which question is currently being discussed, highlighted on their phones. When the leader moves to question 5, everyone's screen shows question 5 highlighted.

Think through:
- How does the sync work?
- Who can control which question is highlighted?
- What's the UX during a live meeting?

### "Who's cooking? Should I bring anything?"

Before Tuesday, people check:
- Who signed up to bring food
- What they're making
- How many people are coming (total head count)

Someone might also sign up to bring food for an upcoming week, or RSVP for their family.

### Admin Tasks

Someone needs to:
- Create new studies
- Add weeks with reading assignments and questions
- Manage families/users

---

## What Matters

✅ Dead simple to use - no instructions needed  
✅ Looks modern and polished  
✅ Works great on mobile (primary use case)  
✅ The live question sync works reliably  
✅ Fast and responsive  

## What Doesn't Matter

❌ Specific tech stack - use whatever you think is best (as long as it deploys to Azure)  
❌ Scalability - this is for ~12 people  
❌ My implementation ideas - if you have better ones, use them  

---

## Your Decisions to Make

You have full control over:

- **Tech stack** - Framework, database, real-time solution, etc.
- **Architecture** - Monolith, serverless, whatever makes sense for Azure
- **UI/UX design** - Layout, colors, components, interactions
- **Data model** - How to structure studies, weeks, users, etc.
- **Features** - Add things I didn't mention, skip things that seem unnecessary
- **Authentication** - Could be simple codes, could be full auth, your call

Just document your decisions in the `/docs` folder.

---

## Suggested Approach

1. **Verify Azure access** - Make sure you can access the Azure account
2. **Plan first** - Think through the data model, tech choices, and architecture. Document in `/docs`
3. **Create GitHub issues** - Break the work into manageable pieces
4. **Set up project & deployment** - Get a basic "hello world" deployed to Azure first
5. **Build incrementally** - Pick up issues one by one, merge PRs, keep docs updated
6. **Mobile-first** - Design for phones, then make sure it works on desktop too

---

## Deliverables

1. Working application deployed on Azure
2. Source code in the GitHub repository
3. Documentation in `/docs`:
   - Architecture decisions
   - Setup instructions
   - Deployment process
   - Progress tracking
4. GitHub issues/PRs showing the development history

---

## One More Thing

This app is for real people who will use it every week. Keep that in mind - practical beats clever. If something seems overengineered for a 12-person Bible study group, it probably is.

Build something that makes Tuesday nights a little easier.