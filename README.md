# Lorenzo Lombardi — Personal Site

Personal site built with [Hugo](https://gohugo.io/) and the [PaperMod](https://github.com/adityatelange/hugo-PaperMod) theme, hosted on GitHub Pages.

🌐 Live at: [https://thrama.github.io](https://thrama.github.io)

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
├── content/
│   ├── about.md
│   ├── links/
│   │   └── _index.md       # Curated links feed (managed via Telegram bot)
│   └── projects/
│       ├── _index.md
│       ├── coding-test.md
│       ├── infa-automation-examples.md
│       └── lyrixgram.md
├── layouts/
│   ├── partials/
│   └── shortcodes/
├── static/
│   └── css/custom.css
├── themes/PaperMod/
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
