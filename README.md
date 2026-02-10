# Lorenzo Lombardi - Personal Site

Sito personale bilingue (🇮🇹 Italiano / 🇬🇧 English) costruito con [Hugo](https://gohugo.io/) e tema [PaperMod](https://github.com/adityatelange/hugo-PaperMod).

## 🌍 Multilingua

Il sito supporta italiano e inglese con:
- Contenuti separati in `content/it/` e `content/en/`
- Selettore di lingua nel menu
- URL localizzati (es. `/about/` e `/en/about/`)

## 🚀 Quick Start (Windows)

### 1. Installazione Hugo

**Opzione A - Winget (Windows 11 / Windows 10 recente):**
```powershell
winget install Hugo.Hugo.Extended
```

**Opzione B - Chocolatey:**
```powershell
choco install hugo-extended
```

**Opzione C - Scoop:**
```powershell
scoop install hugo-extended
```

Verifica l'installazione:
```powershell
hugo version
```

### 2. Setup Progetto

```powershell
# Clona il repository
git clone https://github.com/thrama/thrama.github.io.git
cd thrama.github.io

# Installa il tema PaperMod come submodule
git submodule add https://github.com/adityatelange/hugo-PaperMod.git themes/PaperMod
git submodule update --init --recursive
```

### 3. Avvio Server Locale

```powershell
hugo server -D
```

Apri http://localhost:1313 nel browser.

## 📁 Struttura Multilingua

```
thrama-site/
├── content/
│   ├── it/                 # Contenuti italiani
│   │   ├── about.md
│   │   ├── cv.md
│   │   ├── posts/
│   │   ├── progetti/
│   │   └── links/
│   └── en/                 # Contenuti inglesi
│       ├── about.md
│       ├── cv.md
│       ├── posts/
│       ├── projects/       # Nome diverso per progetti
│       └── links/
├── archetypes/
│   ├── posts.md           # Template italiano
│   ├── posts.en.md        # Template inglese
│   ├── progetti.md
│   └── projects.md
├── layouts/
│   ├── partials/
│   │   └── extend_head.html
│   └── shortcodes/
│       ├── pixelart.html
│       └── rawhtml.html
├── static/
│   ├── css/custom.css
│   └── images/
└── hugo.toml              # Config multilingua
```

## ✍️ Creare Nuovi Contenuti

### Nuovo Articolo (Italiano)

```bash
hugo new it/posts/titolo-articolo.md
```

### Nuovo Articolo (Inglese)

```bash
hugo new en/posts/article-title.md
```

### Nuovo Progetto (Italiano)

```bash
hugo new it/progetti/nome-progetto.md
```

### Nuovo Progetto (Inglese)

```bash
hugo new en/projects/project-name.md
```

## ⚙️ Configurazione Multilingua

Il file `hugo.toml` contiene la configurazione per entrambe le lingue:

```toml
defaultContentLanguage = "it"

[languages]
  [languages.it]
    languageCode = "it"
    languageName = "Italiano"
    weight = 1
    # Menu italiano...

  [languages.en]
    languageCode = "en"
    languageName = "English"
    weight = 2
    # Menu inglese...
```

## 🚀 Deploy su GitHub Pages

Il workflow `.github/workflows/hugo.yaml` è già configurato. Per pubblicare:

```powershell
# Aggiungi tutti i file
git add .

# Commit
git commit -m "Add multilingual support"

# Push
git push origin main
```

Il sito sarà disponibile su: **https://thrama.github.io**

- Homepage italiana: `https://thrama.github.io/`
- Homepage inglese: `https://thrama.github.io/en/`

## 📝 Comandi Utili (PowerShell)

```powershell
# Server con draft visibili
hugo server -D

# Build produzione
hugo --minify

# Nuovo articolo italiano
hugo new it/posts/nuovo-articolo.md

# Nuovo articolo inglese
hugo new en/posts/new-article.md

# Verifica configurazione
hugo config

# Lista contenuti
hugo list all
```

## 🎨 Personalizzazione

### CSS Custom

Modifica `static/css/custom.css` per personalizzare lo stile.

### Shortcodes

- `{{< pixelart src="/images/icon.png" width="64" >}}` - Rendering pixel art
- `{{< rawhtml >}}HTML qui{{< /rawhtml >}}` - HTML raw

## 📚 Risorse

- [Hugo Documentation](https://gohugo.io/documentation/)
- [Hugo Multilingual Mode](https://gohugo.io/content-management/multilingual/)
- [PaperMod Wiki](https://github.com/adityatelange/hugo-PaperMod/wiki)

---

*Creato con ❤️ usando Hugo + PaperMod*
