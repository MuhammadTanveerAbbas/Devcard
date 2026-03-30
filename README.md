# DevCard

An interactive 3D developer profile card  share your links, social profiles, and payment options in one polished page.

Live demo: [themvpguy.vercel.app](https://themvpguy.vercel.app/)

---

## What it looks like

- Animated shining border that moves around the card
- Smooth 3D tilt on mouse hover
- Profile photo, name, title, availability status
- Skill badges
- Book a Call + Portfolio buttons
- Email with one-click copy
- Social icons: LinkedIn, GitHub, Bluesky, Dev.to, X
- Resume / CV download button
- Dark / Light mode toggle
- Fully responsive on all screen sizes

---

## Quick start

```bash
git clone https://github.com/MuhammadTanveerAbbas/Devcard.git
cd Devcard
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## How to customize it for yourself

Everything you need to change lives in one place  the `PROFILE` constant at the top of `components/profile-card.tsx`.

```ts
const PROFILE = {
  name: "Your Name",
  title: "Your Title",           // shown in the pill badge below your name
  status: "Available for Work",  // the green dot line  change or remove
  about: "Your one-liner bio.",

  profileImage: "/Me.jfif",      // drop your photo in /public and update this path

  email: "you@example.com",
  calUrl: "https://cal.com/yourhandle",       // Book a Call button
  portfolioUrl: "https://yoursite.com",       // Portfolio button
  cvUrl: "/Resume.pdf",                           // drop your PDF in /public

  // Social links  leave as "" to hide that icon
  twitterUrl: "https://x.com/yourhandle",
  linkedinUrl: "https://linkedin.com/in/yourhandle",
  githubUrl: "https://github.com/yourhandle",
  blueskyUrl: "https://bsky.app/profile/yourhandle.bsky.social",
  devtoUrl: "https://dev.to/yourhandle",

  // Skill badges  add, remove, or rename freely
  skills: ["Next.js", "React", "TypeScript", "Node.js", "Stripe", "Auth", "PostgreSQL", "Vercel"],
}
```

That's it. Save the file and the card updates instantly.

---

## Replacing your photo

1. Drop your image into the `/public` folder (JPG, PNG, JFIF, WebP all work)
2. Update `profileImage` in the `PROFILE` constant:

```ts
profileImage: "/your-photo.jpg",
```

---

## Replacing your CV

1. Drop your PDF into `/public` and name it `Resume.pdf` (or anything you like)
2. Update `cvUrl`:

```ts
cvUrl: "/YourName-Resume.pdf",
```

---

## Hiding buttons or social icons

Set the value to an empty string `""`  the button/icon won't render at all:

```ts
calUrl: "",        // hides Book a Call
blueskyUrl: "",    // hides Bluesky icon
devtoUrl: "",      // hides Dev.to icon
```

---

## Changing the availability status

Update the `status` field:

```ts
status: "Open to Freelance"
// or
status: "Not Available"
```

To remove it entirely, delete the status line and remove the status block from the JSX in `components/profile-card.tsx`.

---

## Environment variables

None required. This is a fully static frontend app  no backend, no database, no API keys needed.

---

## Tech stack

- [Next.js 16](https://nextjs.org/)
- [React 19](https://react.dev/)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)  Radix UI components
- [next-themes](https://github.com/pacocoursey/next-themes)  dark mode
- [Lucide React](https://lucide.dev/)  icons
- [Vercel Analytics](https://vercel.com/analytics)

---

## Deployment

### Vercel (recommended)

Push to GitHub then import the repo at [vercel.com/new](https://vercel.com/new). Zero config needed.

Or via CLI:

```bash
pnpm i -g vercel
vercel
```

### Other platforms

```bash
pnpm build
pnpm start
```

Works on any Node.js 18+ host  Railway, Render, Fly.io, etc.

---

## Project structure

```
/
├── app/
│   ├── icon.png           # favicon (replace with your logo)
│   ├── apple-icon.png     # iOS home screen icon
│   ├── globals.css        # Tailwind theme tokens
│   ├── layout.tsx         # root layout  fonts, ThemeProvider
│   └── page.tsx           # home page
├── components/
│   ├── profile-card.tsx   # ← edit PROFILE here to customize
│   ├── theme-provider.tsx
│   └── ui/                # shadcn/ui components
├── public/
│   ├── Me.jfif            # profile photo
│   ├── Resume.pdf             # resume
│   └── Logo.png           # your logo
└── README.md
```

---

## License

MIT © [Muhammad Tanveer Abbas](https://themvpguy.vercel.app/)

- X: [x.com/m_tanveerabas](https://x.com/m_tanveerabas)
- LinkedIn: [linkedin.com/in/muhammadtanveerabas](https://linkedin.com/in/muhammadtanveerabas)
- GitHub: [github.com/muhammadtanveerabas](https://github.com/muhammadtanveerabas)
