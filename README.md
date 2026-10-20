# Sadia Anjum Mim — Academic Website

Plain HTML/CSS/JavaScript. Photos are picked up **automatically from folders**: add or remove photos and the site adjusts. You never change code for photos.

## Folder map

```
index.html            Home page (top section text is written directly in this file)
publications.html     All publications, with filters and BibTeX
projects.html         All projects
project.html          One project's own page (project.html?id=<slug>)
gallery.html          All photos, with a tab for each gallery folder
cv.html               CV summary plus the PDF
assets/js/data.js     ← ALL the text: news, research, papers, talks, teaching, projects, CV details
assets/js/photos.js   Photo list — made automatically, don't edit
assets/js/main.js     How the site behaves (no need to touch)
assets/css/style.css  Colors and layout (colors are at the very top)
cv/Sadia_Anjum_Mim_CV.pdf   The CV people download
images/               All photos go here (see below)
tools/preview.mjs     Preview the site on your computer
tools/build-photos.mjs  Makes the photo list (preview runs it for you)
.github/workflows/deploy.yml  Publishes the site after every push
```

## Your normal workflow

```
git pull
# 1. add / remove photos in the images folders, or edit text in assets/js/data.js
node tools/preview.mjs        # 2. check it at http://localhost:8000  (Ctrl + C to stop)
git add .
git commit -m "Add hiking photos"
git push                      # 3. live site updates in 1–2 minutes
```

`node tools/preview.mjs` refreshes the photo list and starts a local preview. It needs Node.js (free, nodejs.org) and nothing else.
If you push without previewing, that's fine: GitHub refreshes the photo list on every push anyway.

## Photos: just drop them in folders

| Folder | What it does |
|---|---|
| `images/profile/` | First photo here is the portrait at the top (tall shape, ~800 × 1000 px). Empty → shows "SM" initials. |
| `images/research/dld-optimization/` | Figure for the WSU research card. Extra photos show under "More details". Empty → card shows text only. |
| `images/research/non-newtonian-flow/` | Same, for the BUET thesis card. |
| `images/conferences/fedsm-2026/` | FEDSM talk photos. Home shows 3 (with "View all N photos" if more). Also appear in the Gallery under "Conferences". |
| `images/projects/<slug>/` | Project photos (`volcanic-ash`, `nlp-summarizer`, `robotic-fish`, `radiator`, `ev-battery`). A file named `cover.jpg` (or `cover.png` …) goes on the card; if there is no "cover", the first photo is used. All other photos appear on the project's page. Empty → a neat text cover. |
| `images/gallery/<anything>/` | Each folder becomes a Gallery tab: `hiking/` → "Hiking", `travel/` → "Travel". **Make a new folder (e.g. `photography/`) and a new tab appears.** |

How it behaves:
- **Any number of photos** in any folder. Grids reshape for 1, 2, 3, 4 or 5+ photos, so there are never empty boxes.
- The home "Beyond the Lab" strip shows up to 5 photos, taking turns between gallery folders (not conference photos).
- If there are no gallery or conference photos at all, the Gallery link and section hide themselves.

**Captions come from the file name:**
- `mount-rainier_washington.jpg` → "Mount Rainier, Washington" (`-` = space, `_` = comma)
- `02-seattle_USA.jpg` → "Seattle, USA" (a leading number sets the **order** and is not shown; capital letters you type stay capital)
- `IMG_2034.jpg`, `DSC_0042.jpg`, `cover.jpg` → no caption

Accepted types: `.jpg .jpeg .png .webp .gif .avif`. Keep each photo under ~500 KB so the site stays fast (squoosh.app or tinypng.com can shrink them).

**New research item or talk?** Add it in `data.js` with `photoFolder: "research/<new-folder>"` (or `"conferences/<new-folder>"`), then create that folder.
**New project?** Add it to `projects` in `data.js` with a `slug`, then create `images/projects/<slug>/`.

## Edit text

- **Top of the home page** (name, one-line focus, intro, advisor/lab facts): `index.html`, inside `<section class="hero">`.
- **Everything else**: `assets/js/data.js`. Each part has a comment explaining it.
- **Your name in bold in author lists**: write it exactly as `S. A. Mim` in `authors`.
- **Google Scholar / ORCID**: paste the link into `profile.links` in `data.js`. Empty links stay hidden.
- **Gallery tab names / order**: `galleryTabs` in `data.js` (optional).
- **New CV**: replace `cv/Sadia_Anjum_Mim_CV.pdf` (keep the same name).

## First-time setup on GitHub (once)

1. Create a **public** repository named **`<username>.github.io`** (e.g. `sadiamim.github.io`).
2. Push this folder to it:
   ```
   git init
   git add .
   git commit -m "First version of website"
   git branch -M main
   git remote add origin https://github.com/<username>/<username>.github.io.git
   git push -u origin main
   ```
3. On GitHub: **Settings → Pages → Build and deployment → Source: "GitHub Actions"**.
4. Open the **Actions** tab: "Deploy website" runs (green tick = done). The site is live at `https://<username>.github.io`.

From then on, every `git push` to `main` republishes the site automatically.

If the Actions run ever shows a red ✗, click it to see which step failed. The usual cause is step 3 not being set to "GitHub Actions".

> A repository with another name (e.g. `portfolio`) also works: the site is then at `https://<username>.github.io/portfolio/`.

## Custom domain later (optional)

1. Buy a domain (e.g. `sadiamim.com`) from Cloudflare, Namecheap or Porkbun.
2. **Settings → Pages → Custom domain**: type it, **Save**, then tick **Enforce HTTPS** when offered.
3. At the domain seller, add the DNS records GitHub shows (four `A` records for the main domain, and a `CNAME` for `www` pointing to `<username>.github.io`).

## Change colors

At the top of `assets/css/style.css`: `--acc` is the navy accent (`#14365F`). In the `[data-theme="dark"]` block, `--acc` is the gold accent (`#C9A66B`).
