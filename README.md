# Terminal Portfolio (React + Ink)

A terminal-based portfolio with tabs, marquee, and keybindings.
To be deployed on ssh port

## Run in terminal (CMD or PowerShell)

**Important:** Ink needs a real TTY for input (Tab, q). Run from **Command Prompt** or **PowerShell** — not from an IDE terminal that doesn’t support raw mode.

```bash
# Install once
npm install

# Start the app
npm start
```

- **Tab** — switch between About and Links
- **Arrow Keys** - navitage through projects and links
- **q** — quit
- **Ctrl+C** — quit

Footer legend: `n` navigate, `t` theme, `q` quit.

## Structure

- `cli.js` — entry point
- `src/App.js` — loading state, `activeTab`, `useInput` / `useApp`
- `src/components/Header.js` — tabs + Marquee
- `src/components/Marquee.js` — scrolling “[ under construction ]” (200ms)
- `src/components/AboutContent.js` — ASCII placeholder + bio
- `src/components/LinksContent.js` — social links (Website, X, LinkedIn, GitHub)
- `src/components/Footer.js` — version (v0.0.1) + keybindings

Accent color: `#FF5F00`.
