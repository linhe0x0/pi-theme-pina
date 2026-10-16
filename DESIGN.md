# Piña Design System

Piña is a TUI theme for [Pi](https://pi.dev). It targets a calm, flat, layered interface: neutral
gray-blue surfaces carry the layout, and a single warm gold accent marks everything interactive or
important. Dark mode comes first; light mode is planned on the same token system.

This document is the source of truth for every color. `themes/*.json` implements it and must not
drift from these values.

## Principles

1. **One accent.** Gold is the only brand color. It marks focus, selection labels, headings, and
   the cursor. If everything is gold, nothing is.
2. **Layered neutrals.** Emphasis comes from surface lightness levels, not from more color. Panels
   step up one level at a time; nothing jumps.
3. **Quiet states.** Success is the expected outcome and stays on a neutral surface. Only errors
   tint their surface. Motion (spinners) signals progress, not color.
4. **Contrast floor.** Body text keeps ≥ 4.5:1 (WCAG AA) on the surface it renders on. Decorative
   chrome (borders, tracks) stays between 1.1:1 and 1.7:1 so it reads as structure, not content.

## Contrast basis

Terminal backgrounds vary. Ratios below are measured against a representative dark terminal
background, `BASE #1e2126`. The three given surface levels are used exactly as specified.

## Surfaces

Backgrounds are a strictly ordered ramp. Each step up is a deliberate emphasis increase.

| Token | Hex | vs BASE | Usage |
| --- | --- | --- | --- |
| `surface-0` | `#22252b` | 1.05 | Shadow level. Only where the terminal background cannot be used: HTML export page background. |
| `surface-1` | `#32363f` | 1.33 | Level 1 — resting panels: tool execution boxes (pending, success). |
| `surface-2` | `#414853` | 1.75 | Level 2 — interactive surfaces: user messages, selected items, export info panels. |
| `surface-3` | `#515c67` | 2.37 | Level 3 — highest emphasis: custom (system-injected) message panels, scrollbar thumb. |
| `surface-error` | `#45343a` | 1.39 | Signal surface. Tool execution boxes in error state only (desaturated red, same lightness as Level 1). |

Search matches use a gold-tinted surface instead of the neutral ramp so find-results are scannable
without breaking the neutral panel language: `surface-gold #4a4331`.

## Text

| Token | Hex | Contrast | Usage |
| --- | --- | --- | --- |
| `text` | `#e8ebf1` | 13.5 on BASE, 7.7 on L2 | Primary text, user messages, tool titles. |
| `muted` | `#b0b9c5` | 8.1 on BASE, 6.1 on L1, 4.7 on L2 | Secondary text: tool output, link URLs, diff context. |
| `dim` | `#79828f` | 4.2 on BASE, 3.1 on L1 | Tertiary text: comments, horizontal rules, quote borders. Never for body copy. |
| `text-on-l3` | `#d8dee6` | 5.0 on L3 | Text on Level 3 panels (custom messages), where `muted` would drop below 4.5:1. |

## Accent and semantic colors

| Token | Hex | Contrast on BASE | Usage |
| --- | --- | --- | --- |
| `gold` (accent) | `#ffd859` | 11.7 | Brand accent: logo, cursor, headings, inline code, list bullets, custom message labels, selected-item highlights. |
| `gold-deep` | `#8f762f` | 3.7 | Accent borders (focused editor, bash mode would override). Loud enough to read as focus, quiet enough to live next to text. |
| `green` | `#86d993` | 9.5 | Success, diff additions, code block content, bash mode border. |
| `red` | `#ff8d8d` | 7.3 | Errors, diff removals. 5.2:1 on `surface-error`. |
| `orange` | `#f5a95a` | 8.2 | Warnings and number literals. Hue-shifted from `gold` (~32° vs ~48°) so the two never read as the same color. |
| `blue` | `#79a8ff` | 6.8 | Links, keywords. Shares the cool hue family of the neutral ramp. |
| `teal` | `#63cfc9` | 8.7 | Type names. Keeps syntax at six hues with no amber collision. |

## Syntax highlighting

| Token | Value | Rationale |
| --- | --- | --- |
| `syntaxComment` | `dim` | Comments recede. |
| `syntaxKeyword` | `blue` | Structure. |
| `syntaxFunction` | `gold` | The accent lands on the interesting part of the code. |
| `syntaxVariable` | `text` | Default reading color; variables are most of the code. |
| `syntaxString` | `green` | |
| `syntaxNumber` | `orange` | |
| `syntaxType` | `teal` | |
| `syntaxOperator` | `muted` | |
| `syntaxPunctuation` | `muted` | |

## Thinking level ramp

Borders only; a cool-to-warm heat ramp signals increasing reasoning effort:
`off #566070` → `minimal #6e829c` → `low #6f9be0` → `medium #9d8cf2` → `high #c98ef2` →
`xhigh #f18fd2` → `max #ff8f6b`.

## Chrome

| Token | Hex | Notes |
| --- | --- | --- |
| `border` | `#3f4550` | 1.7 vs BASE. Normal borders. |
| `borderMuted` | `#30363e` | 1.3 vs BASE. Subtle separators. |
| `borderAccent` | `gold-deep` | 3.7 vs BASE. Focused borders. |
| `scrollbarTrack` | `#262a31` | 1.1 vs BASE. A groove, not a stripe. |
| `scrollbarThumb` | `surface-3` | 2.1 vs track. |
| `searchMatchBg` | `surface-gold` | 1.6 vs BASE. Subtle highlight for every match. The current match inverts (`searchMatchText #e8ebf1` as background, `searchMatchBg` as text, 8.2:1). |

## Theme token map

Mapping from Pi theme tokens to this document. `themes/pina-dark.json` mirrors this table.

| Pi token | Value |
| --- | --- |
| `accent` | `gold` |
| `border` / `borderMuted` / `borderAccent` | `#3f4550` / `#30363e` / `gold-deep` |
| `success` / `error` / `warning` | `green` / `red` / `orange` |
| `text` / `muted` / `dim` | `text` / `muted` / `dim` |
| `thinkingText` | `muted` |
| `selectedBg` | `surface-2` |
| `scrollbarTrack` / `scrollbarThumb` | `#262a31` / `surface-3` |
| `searchMatchBg` / `searchMatchText` | `surface-gold` / `text` |
| `userMessageBg` / `userMessageText` | `surface-2` / `text` |
| `customMessageBg` / `customMessageText` / `customMessageLabel` | `surface-3` / `text-on-l3` / `gold` |
| `toolPendingBg` / `toolSuccessBg` | `surface-1` / `surface-1` |
| `toolErrorBg` | `surface-error` |
| `toolTitle` / `toolOutput` | `text` / `muted` |
| `mdHeading` / `mdListBullet` | `gold` |
| `mdLink` / `mdLinkUrl` | `blue` / `muted` |
| `mdCode` / `mdCodeBlock` / `mdCodeBlockBorder` | `gold` / `green` / `muted` |
| `mdQuote` / `mdQuoteBorder` / `mdHr` | `muted` / `dim` / `dim` |
| `toolDiffAdded` / `toolDiffRemoved` / `toolDiffContext` | `green` / `red` / `muted` |
| `bashMode` | `green` |
| `export.pageBg` / `export.cardBg` / `export.infoBg` | `surface-0` / `surface-1` / `surface-2` |

## Editor treatment (extension)

`extensions/pina-editor.ts` applies the panel language to the input editor.
The theme JSON cannot express structure, so the extension reads live theme
tokens and owns three structural rules:

- Left bar `▌` colored through the editor border color (follows bash mode).
- Panel background `surface-2` (`selectedBg`) on every row.
- 2-column inner padding, one blank panel row above and below. The horizontal
  rules are suppressed unless they carry information (working status, scroll
  indicator).

## Light mode rules (planned)

- Keep `gold #ffd859` as the accent but verify ≥ 3:1 against light surfaces; if it fails, darken
  the accent for text usage instead of changing the hue.
- Invert the surface ramp: L1 is lightest, page is darkest. Never reuse dark-mode hex values.
- Re-derive every contrast ratio; do not port the dark table.

## Roadmap

1. Dark theme (this release).
2. Terminal screenshots against real Pi screens; add `pi.image` gallery preview.
3. Light theme on the same token names.
