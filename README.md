# Lorenzo Lombardi - Personal Site

Sito personale costruito con [Hugo](https://gohugo.io/) e tema [PaperMod](https://github.com/adityatelange/hugo-PaperMod).

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

**Opzione D - Download manuale:**
1. Vai su https://github.com/gohugoio/hugo/releases
2. Scarica `hugo_extended_X.XXX.X_windows-amd64.zip`
3. Estrai in una cartella (es. `C:\Hugo\bin`)
4. Aggiungi la cartella al PATH di sistema

Verifica l'installazione:
```powershell
hugo version
```

### 2. Setup Progetto

```powershell
# Clona il tuo repository
git clone https://github.com/thrama/thrama.github.io.git
cd thrama.github.io

# Copia il contenuto dello ZIP estratto nella cartella del repo
# (oppure estrai direttamente qui)

# Installa il tema PaperMod come submodule
git submodule add https://github.com/adityatelange/hugo-PaperMod.git themes/PaperMod
```

**Alternativa senza Git submodule:**
```powershell
# Scarica e estrai manualmente il tema
Invoke-WebRequest -Uri "https://github.com/adityatelange/hugo-PaperMod/archive/master.zip" -OutFile "papermod.zip"
Expand-Archive -Path "papermod.zip" -DestinationPath "themes"
Rename-Item "themes\hugo-PaperMod-master" "themes\PaperMod"
Remove-Item "papermod.zip"
```

### 3. Avvio Server Locale

```powershell
hugo server -D
```

Apri http://localhost:1313 nel browser.

> **Tip:** Usa Windows Terminal o VS Code integrato per una migliore esperienza.

## 📁 Struttura

```
lorenzo-site/
├── archetypes/          # Template per nuovi contenuti
│   ├── posts.md         # Template articoli
│   └── progetti.md      # Template progetti
├── content/
│   ├── about.md         # Pagina Chi Sono
│   ├── cv.md            # Curriculum Vitae
│   ├── posts/           # Articoli
│   ├── progetti/        # Progetti
│   └── links/           # Links e risorse
├── layouts/
│   └── shortcodes/      # Shortcode custom
├── static/
│   ├── css/custom.css   # Stili personalizzati
│   ├── images/          # Immagini
│   └── files/           # PDF, documenti
├── hugo.toml            # Configurazione principale
└── README.md
```

## ✍️ Creare Nuovi Contenuti

### Nuovo Articolo

```bash
hugo new posts/titolo-articolo.md
```

### Nuovo Progetto

```bash
hugo new progetti/nome-progetto.md
```

I file vengono creati con `draft: true`. Rimuovi o imposta `false` per pubblicare.

## ⚙️ Configurazione

Modifica `hugo.toml` per:

- **baseURL**: Il tuo dominio
- **title**: Nome del sito
- **params.socialIcons**: I tuoi link social
- **menu.main**: Voci del menu

## 🎨 Personalizzazione

### CSS Custom

Aggiungi stili in `static/css/custom.css`, poi referenzialo in `hugo.toml`:

```toml
[params]
  customCSS = ["css/custom.css"]
```

### Immagine Profilo

1. Aggiungi l'immagine in `static/images/profile.jpg`
2. Decommenta in `hugo.toml`:

```toml
[params]
  profileMode.enabled = true
  profileMode.imageUrl = "/images/profile.jpg"
```

## 🚀 Deploy

### GitHub Pages (il tuo repo: thrama/thrama.github.io)

Il workflow `.github/workflows/hugo.yaml` è già configurato. Per pubblicare:

```powershell
# Aggiungi tutti i file
git add .

# Commit
git commit -m "Initial site setup"

# Push
git push origin main
```

**Configurazione GitHub (una tantum):**
1. Vai su https://github.com/thrama/thrama.github.io/settings/pages
2. In **Source** seleziona: `GitHub Actions`
3. Il sito sarà disponibile su: **https://thrama.github.io**

Il deploy avviene automaticamente ad ogni push su `main`.

### Netlify

1. Connetti il repository a Netlify
2. Build command: `hugo --minify`
3. Publish directory: `public`

### Cloudflare Pages

1. Connetti il repository
2. Framework preset: Hugo
3. Build command: `hugo --minify`

## 📝 Comandi Utili (PowerShell)

```powershell
# Server con draft visibili
hugo server -D

# Server con live reload su rete locale (per test da mobile)
hugo server -D --bind 0.0.0.0

# Build produzione
hugo --minify

# Nuovo articolo
hugo new posts/nuovo-articolo.md

# Nuovo progetto
hugo new progetti/nome-progetto.md

# Verifica configurazione
hugo config

# Pulizia cache
Remove-Item -Recurse -Force resources\_gen -ErrorAction SilentlyContinue
```

## 🛠️ Setup Consigliato per Windows

### Editor
- **VS Code** con estensioni:
  - `Better TOML` - syntax highlighting per hugo.toml
  - `Markdown All in One` - preview e shortcuts
  - `Hugo Language and Syntax Support`

### Terminal
- **Windows Terminal** (da Microsoft Store)
- Oppure il terminale integrato di VS Code

### Git
- **Git for Windows**: https://git-scm.com/download/win
- Oppure **GitHub Desktop** se preferisci GUI

## 📚 Risorse

- [Hugo Documentation](https://gohugo.io/documentation/)
- [PaperMod Wiki](https://github.com/adityatelange/hugo-PaperMod/wiki)
- [Hugo Themes](https://themes.gohugo.io/)

---

## TODO

- [ ] Aggiornare informazioni CV
- [ ] Aggiungere foto profilo
- [ ] Completare link social
- [ ] Scrivere primo articolo
- [ ] Configurare dominio custom
- [ ] Setup analytics (opzionale)

---

*Creato con ❤️ usando Hugo + PaperMod*
