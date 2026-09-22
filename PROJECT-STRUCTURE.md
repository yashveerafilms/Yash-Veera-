# Yash Veera Films — Project Structure

A static HTML/CSS/JS website for Yash Veera Films (Indian cinema production company).
No build tooling required — open any `.html` file directly in a browser or deploy as-is.

---

## Folder Layout

```
YashVeeraFilm/
│
├── index.html                  # Home page
├── about.html                  # About Us — Pyarelal Gundecha
├── cast.html                   # Cast & Crew
├── contact.html                # Contact form
├── gallery.html                # Photo gallery (3 sections)
├── news.html                   # News & media articles
├── projects.html               # Film projects / portfolio
│
├── assets/
│   ├── css/
│   │   └── styles.css          # Global stylesheet (one file for the whole site)
│   │
│   ├── js/
│   │   └── script.js           # Global JavaScript (navbar, slider, lightbox, animations)
│   │
│   ├── video/
│   │   └── logo-video.mp4      # Animated brand mark used in navbar & hero
│   │
│   └── images/
│       ├── brand/
│       │   ├── favicon.webp              # Browser tab icon
│       │   ├── logo.svg                  # Static SVG logo (poster fallback for video)
│       │   └── yash-veera-films-logo.webp # Logo image used in the footer
│       │
│       ├── hero/               # Full-screen hero / slider images (home page)
│       │   ├── hero-1.webp
│       │   ├── hero-2.webp
│       │   ├── hero-3.webp
│       │   ├── slider1.webp
│       │   ├── slider2.webp
│       │   ├── slider3.webp
│       │   ├── slider4.webp
│       │   └── ester-anil-landscape.jpg
│       │
│       ├── films/              # Film poster / cover images
│       │   ├── ratna-poster.webp
│       │   ├── unexpected-poster.webp
│       │   ├── balu-thambi-manasile-poster.webp
│       │   └── expected-poster.jpg
│       │
│       ├── news/               # Images used in news articles
│       │   ├── news-pyarelal.jpeg
│       │   ├── news-uttarakhand.jpeg
│       │   ├── news-trending-1.jpeg
│       │   └── news-trending-2.jpeg
│       │
│       ├── about/              # Images used on the About Us page
│       │   └── about-us-hero.webp
│       │
│       └── gallery/            # Gallery page images (3 sub-categories)
│           ├── production/     # Production stills & notable meetings
│           │   ├── production-still-1.webp  … production-still-6.webp
│           │   ├── meeting-amit-shah.jpg
│           │   ├── meeting-prashant-narayanan.jpeg
│           │   ├── meeting-esther-anil.jpeg
│           │   ├── honouring-cp-radhakrishnan.jpeg
│           │   ├── on-set-production-still.jpeg
│           │   ├── pyarelal-gundecha.jpg
│           │   └── grandfather-grandchild.jpg
│           │
│           ├── honorable/      # Felicitation of Honorable Officials
│           │   ├── honorable-1.jpg … honorable-29.jpg
│           │
│           └── pillars/        # Supporting pillars section
│               ├── pillar-1.jpg … pillar-4.jpg
│
├── robots.txt                  # Search engine crawl rules
├── sitemap.xml                 # XML sitemap for SEO
├── CNAME                       # Custom domain config for GitHub Pages
├── push.bat                    # Helper script to push to GitHub
└── Run Website.bat             # Helper script to open site locally
```

---

## How to Update Common Things

### Add a new news article
1. Drop the image into `assets/images/news/`
2. Open `news.html`
3. Copy an existing `<article class="news-card">` block and update the `src`, title, date, and body text.

### Add a new film / project
1. Add the poster image to `assets/images/films/`
2. Open `projects.html`
3. Copy an existing `<article class="project-card">` and update the image, title, and description.

### Add a gallery image — Production Stills
1. Drop the image into `assets/images/gallery/production/`
2. Open `gallery.html`, find `<section id="gallery">`
3. Copy a `<button class="gallery-item">` block and update `src`, `data-image`, `data-title`, `data-number`, and the `alt` text.

### Add a gallery image — Honorable Officials
1. Drop the image into `assets/images/gallery/honorable/` (name it `honorable-30.jpg`, etc.)
2. Open `gallery.html`, find `<section id="honorable-officials">`
3. Copy the last button block and increment the number.

### Change a hero slider image
1. Replace or add the image in `assets/images/hero/`
2. Open `index.html`, find `<div class="hero-slides">`
3. Update the `<img src="...">` inside the relevant `<div class="hero-slide">`.

### Update CSS styles
- Edit `assets/css/styles.css` — one file controls the entire site.

### Update JavaScript behaviour
- Edit `assets/js/script.js` — one file controls all interactivity.

### Update the brand logo video
- Replace `assets/video/logo-video.mp4`.
  The `<video>` element in every page's navbar and on the home hero both point here.

---

## Deployment
The site is deployed via GitHub Pages using the `CNAME` file.
Use `push.bat` to commit and push changes, or push manually with git.
