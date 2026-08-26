# Lorenzo Lombardi — Personal Site

Personal site built with [Hugo](https://gohugo.io/) and the [PaperMod](https://github.com/adityatelange/hugo-PaperMod) theme, hosted on GitHub Pages.

🌐 Live at: [https://lorenzolombardi.it](https://lorenzolombardi.it)

---

## Quick Start (macOS)

### 1. Install Hugo

```bash
brew install hugo
hugo version
```

### 2. Clone the repo

```bash
git clone https://github.com/thrama/thrama.github.io.git
cd thrama.github.io
git submodule update --init --recursive
```

### 3. Run local server

```bash
hugo server -D
```

Open [http://localhost:1313](http://localhost:1313) in your browser.

---

## Project Structure

```
thrama.github.io/
├── assets/
│   └── js/moon-runner.js       # Game logic (processed via Hugo Pipes)
├── content/
│   ├── about.md
│   ├── links/
│   │   └── _index.md           # Curated links feed (managed via Telegram bot)
│   └── projects/
│       ├── _index.md
│       ├── aipaf.md
│       ├── coding-test.md
│       ├── infa-automation-examples.md
│       └── lyrixgram.md
├── layouts/
│   ├── 404.html                # Easter egg: serves Moon Runner
│   ├── partials/
│   │   └── moon-runner.html    # Single source of truth (markup + CSS + script)
│   └── shortcodes/
│       └── moon-runner.html    # Thin delegate to the partial
├── static/
│   └── css/custom.css
├── themes/PaperMod/
├── .prettierignore             # Keeps the formatter away from Go templates
└── hugo.toml
```

---

## Content Management

### Add a new project

Create a new file in `content/projects/`:

```bash
hugo new projects/project-name.md
```

### Add a link

Links are managed automatically via the [Hugo Links Bot](https://github.com/thrama/hugo-links-bot).
Send a message to the Telegram bot and the link is added to `content/links/_index.md` and deployed automatically.

---

## Moon Runner

Hitting any 404 URL serves **Moon Runner**, an endless runner on HTML5 Canvas.
All markup, CSS, and script loading live in `layouts/partials/moon-runner.html`;
`layouts/shortcodes/moon-runner.html` simply delegates to the partial, so the same
implementation serves both templates and content pages.

The script auto-initializes on every `[data-moon-runner]` element that hasn't
booted yet, so a double inclusion on the same page is harmless.

`moon.lorenzolombardi.it` redirects straight to the game.

> ⚠️ Never run Prettier on `layouts/` — it breaks Go template actions. See `.prettierignore`.

---

## Deploy

Every push to `main` triggers the GitHub Actions workflow (`.github/workflows/hugo.yaml`) which builds and deploys the site to GitHub Pages.

```bash
git add .
git commit -m "your message"
git push
```

### Enable GitHub Pages (first time only)

Go to **Settings → Pages → Source → GitHub Actions**.

---

## Useful Commands

```bash
# Local server with drafts visible
hugo server -D

# Production build
hugo --minify

# New project page
hugo new projects/project-name.md

# Check configuration
hugo config
```

---

## Theme

[PaperMod](https://github.com/adityatelange/hugo-PaperMod) — installed as a git submodule.

To update:

```bash
cd themes/PaperMod
git pull origin master
```
