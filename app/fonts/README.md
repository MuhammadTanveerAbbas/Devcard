# Fonts in this project

Two families only. Nothing else is loaded.

| File | Family | Role | Source |
| --- | --- | --- | --- |
| `LTVeritas-Regular.ttf`, `LTVeritas-Medium.ttf`, `LTVeritas-Bold.ttf` | LT Veritas | Body and UI text | LT Veritas, free for personal and commercial use. |
| Familjen Grotesk | Familjen Grotesk | Display, name, title, buttons | Google Fonts, loaded through `next/font/google`. No file here. |

Definitions live in `app/fonts.ts`. The CSS tokens are `--font-display` and
`--font-sans`.

## Pecita was removed

Pecita shipped for a while as the handwritten accent on the availability line.
It is gone. The file and its OFL text were deleted from this folder. Three
families on a card this small was one too many, and the script pulled focus off
the work.

## Rules for use

1. Display for anything above 15px that carries identity: name, job title,
   buttons, headings.
2. Body for everything else: bio, status detail, labels, chips.
3. No third family. If something feels like it needs one, it is a spacing
   problem, not a font problem.