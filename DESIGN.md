# Piña Design Tokens

Source of truth for every color in Piña. `themes/*.json` implements these values and must not
drift from this document.

Contrast ratios are measured against a representative dark terminal background, `BASE #1e2126`.
Body text keeps ≥ 4.5:1 (WCAG AA) on the surface it renders on.

## Surfaces

| Token | Hex | vs BASE | Usage |
| --- | --- | --- | --- |
| `surface-0` | `#22252b` | 1.05 | Shadow level. Only where the terminal background cannot be used: HTML export page background. |
| `surface-1` | `#32363f` | 1.33 | Level 1 — resting panels: tool execution boxes (pending, success). |
| `surface-2` | `#414853` | 1.75 | Level 2 — interactive surfaces: user messages, selected items, export info panels. |
| `surface-3` | `#515c67` | 2.37 | Level 3 — highest emphasis: custom (system-injected) message panels, scrollbar thumb. |
| `surface-error` | `#45343a` | 1.39 | Signal surface. Tool execution boxes in error state only (desaturated red, same lightness as Level 1). |
| `surface-gold` | `#4a4331` | 1.6 | Gold-tinted search-match background, so find-results are scannable outside the neutral ramp. |

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
| `gold-deep` | `#8f762f` | 3.7 | Accent borders (focused editor). |
| `green` | `#86d993` | 9.5 | Success, diff additions, code block content, bash mode border. |
| `red` | `#ff8d8d` | 7.3 | Errors, diff removals. 5.2:1 on `surface-error`. |
| `orange` | `#f5a95a` | 8.2 | Warnings and number literals. Hue-shifted from `gold` (~32° vs ~48°) so the two never read as the same color. |
| `blue` | `#79a8ff` | 6.8 | Links, keywords. Shares the cool hue family of the neutral ramp. |
| `teal` | `#63cfc9` | 8.7 | Type names. Keeps syntax at six hues with no amber collision. |

## Syntax highlighting

| Token | Value |
| --- | --- |
| `syntaxComment` | `dim` |
| `syntaxKeyword` | `blue` |
| `syntaxFunction` | `gold` |
| `syntaxVariable` | `text` |
| `syntaxString` | `green` |
| `syntaxNumber` | `orange` |
| `syntaxType` | `teal` |
| `syntaxOperator` | `muted` |
| `syntaxPunctuation` | `muted` |

## Thinking level ramp

`off #566070` → `minimal #6e829c` → `low #6f9be0` → `medium #9d8cf2` → `high #c98ef2` →
`xhigh #f18fd2` → `max #ff8f6b`

## Chrome

| Token | Hex | Notes |
| --- | --- | --- |
| `border` | `#3f4550` | 1.7 vs BASE. Normal borders. |
| `borderMuted` | `#30363e` | 1.3 vs BASE. Subtle separators. |
| `borderAccent` | `gold-deep` | 3.7 vs BASE. Focused borders. |
| `scrollbarTrack` | `#262a31` | 1.1 vs BASE. A groove, not a stripe. |
| `scrollbarThumb` | `surface-3` | 2.1 vs track. |
| `searchMatchBg` | `surface-gold` | 1.6 vs BASE. The current match inverts (`searchMatchText #e8ebf1` as background, `searchMatchBg` as text, 8.2:1). |

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
