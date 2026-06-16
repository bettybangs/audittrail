Prompt Engineering Strategy — Risk Whisperer
Overview
Risk Whisperer uses a structured prompting approach to get Claude to behave like a senior GRC analyst, returning consistent, audit-ready outputs every time. This document explains the key decisions behind the prompt design.

The System Prompt
The core system prompt does four things:
1. Role Assignment
Claude is instructed to act as a senior GRC analyst and security control assessor specializing in a specific cloud environment and compliance framework. This is injected dynamically based on the user's dropdown selections:
"You are a senior GRC analyst and security control assessor specializing in {env} cloud environments and {framework} compliance."
Giving Claude a specific professional role produces more authoritative, domain-accurate outputs than a generic prompt.
2. Dynamic Context Injection
The framework, cloud environment, and optional control family are all injected into the system prompt at runtime. This means the same prompt engine produces HIPAA-specific outputs for healthcare and FedRAMP-specific outputs for government — without separate prompts for each.
"Be specific to {env} services and {framework} requirements."
3. Structured JSON Output
Claude is instructed to return only valid JSON with exact key names. No markdown, no backticks, no preamble. This makes the response directly parseable without regex cleanup:
"Return ONLY valid JSON (no markdown, no backticks) with these exact keys:

assessmentQuestions (array of 6-8 strings)
evidenceToCollect (array of 6-8 strings)
potentialWeaknesses (array of objects with {name, description, severity, recommendation})
nistControls (array of objects with {id, name, rationale})
overallRiskScore (number 1-10)
riskJustification (string)
controlMaturity (one of: Initial/Developing/Defined/Managed/Optimizing)
maturityJustification (string)"

Specifying exact key names and types prevents Claude from inventing its own schema, which would break the UI.
4. Severity Constraints
The potentialWeaknesses severity field is constrained to High/Medium/Low only. Without this constraint, Claude might return values like "Critical" or "Informational" which would break the color-coding logic in the UI.

Why This Approach Works
DecisionReasonSystem prompt vs user promptRole and output format go in system; control description goes in user message. Keeps concerns separated.Dynamic injectionOne prompt handles 13 frameworks × 9 environments without branching logicJSON-only outputEliminates need for complex parsing; response goes directly into React stateConstrained enum valuesPrevents unexpected values from breaking UI rendering logic4000 max tokensEnough for full structured output across all 8 fields without truncation

Lessons Learned

Be explicit about what you don't want. "No markdown, no backticks" was necessary — Claude defaults to wrapping JSON in code fences.
Name your keys exactly. Vague instructions like "return a list of questions" produce inconsistent key names across responses.
Inject context, don't repeat prompts. Dynamic injection kept the codebase clean and the prompt maintainable.
Constrain open-ended fields. Any field that drives UI logic (colors, labels) needs an explicit list of allowed values.
