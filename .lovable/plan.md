

# Remove Lovable Branding from Link Previews

The issue is in `index.html` — the Open Graph and Twitter meta tags still point to Lovable's default image and Twitter handle. That's why sharing the link shows Lovable branding.

## Changes to `index.html`

1. **Remove line 15** (`og:image`) — replace the Lovable OG image URL with a custom CompartGuard OG image. I'll generate a simple dark-themed OG image (1200x630) with the CompartGuard name and description, save it to `public/og-image.png`, and reference it.
2. **Line 17-18** — Remove `@Lovable` from `twitter:site`, update `twitter:image` to the same custom image.
3. **Line 7** — Remove the `<!-- TODO -->` comment.

## Custom OG Image

Create a simple SVG-based OG image (converted to PNG) with:
- Dark background matching the app theme (`#0a0e1a`)
- "COMPARTGUARD" in bold white tracking text
- "Real-time compartment syndrome monitoring" subtitle
- Medical shield icon accent

This will ensure link previews on WhatsApp, Telegram, Twitter, etc. show CompartGuard branding instead of Lovable.

