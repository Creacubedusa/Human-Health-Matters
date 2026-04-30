---
name: Summarize
description: Summarize entire conversation into 5-7 bullets with critical context, decisions, and code snippets for copy-paste into new chat
---

Summarize this entire conversation into 5-7 bullet points.

Rules:
- Include: what was built, bugs fixed, key decisions, file paths changed, and any code snippets critical to continuing work
- Each bullet: one concrete fact or decision — no filler words
- Code snippets: inline backtick for short ones, fenced block for multi-line
- Format for direct copy-paste into a new Claude Code chat
- End with one bullet listing exact next steps

Output nothing except the bullet list.
