# Starknet Gaming

A public community hub and game directory for the Starknet gaming ecosystem.

The site helps players discover games, follow official project links, join Starknet Gaming community channels, and explore infrastructure used by onchain games.

## Live Site

This project is built as a static website and can be hosted on GitHub Pages, Vercel, Netlify, Cloudflare Pages, or any static server.

If GitHub Pages is enabled for this repository, the site will be available at:

```text
https://blackaporia.github.io/starknet-gaming/
```

## Features

- Responsive landing page for desktop and mobile.
- Searchable Starknet game registry.
- Status filters: `All`, `Live`, `New`, `Soon`.
- Game cards grouped by category.
- Official X and Website links for each listed game.
- Project logos and visual assets.
- Featured games section.
- Community and ecosystem mission sections.
- Dojo and Cartridge infrastructure cards.
- Language selector with custom translations for selected languages.
- Fun fullscreen `Rocket Jump` mini game with nickname entry, combo bonuses, powerups, hazards, melody, and a shared leaderboard API with local fallback.

## Languages

The site includes a custom language selector for:

- English
- Chinese
- Korean
- Turkish
- Russian
- Hindi
- Ukrainian
- Spanish

The translation system is local JavaScript. It does not use Google Translate widgets or external translation iframes.

## Project Structure

```text
.
├── index.html
├── README.md
├── .gitignore
├── .nojekyll
├── api/
│   └── leaderboard.js
├── assets/
│   ├── brand/
│   │   ├── background.png
│   │   ├── community-world.png
│   │   └── hero-brand.png
│   └── logos/
│       ├── art-peace.jpg
│       ├── blob-arena.jpg
│       ├── brove-royale.jpg
│       ├── cartridge.jpg
│       ├── corsair.jpg
│       ├── dark-shuffle.png
│       ├── dojo.jpg
│       ├── dope-wars.jpg
│       ├── gm-nft.jpg
│       ├── influence.jpg
│       ├── jokers-of-neon.jpg
│       ├── loot-survivor.png
│       ├── nums.jpg
│       ├── pistols-at-dawn.jpg
│       ├── ponziland.jpg
│       ├── realms-blitz.svg
│       ├── starknet-gaming.png
│       ├── zap-football.jpg
│       └── zkube.png
├── data/
│   └── rocket-jump-leaderboard.json
└── docs/
    └── project-links.txt
```

## Run Locally

Open `index.html` directly in a browser, or serve the folder with Python:

```bash
python3 -m http.server 8000
```

Then open:

```text
http://127.0.0.1:8000
```

## Rocket Jump Leaderboard

The mini game reads and posts scores to `api/leaderboard` when the site is deployed with serverless API support. The API stores scores in `data/rocket-jump-leaderboard.json` through the GitHub Contents API.

Set these environment variables on the host:

```text
GITHUB_TOKEN=github fine-grained token with Contents read/write access
GITHUB_OWNER=blackaporia
GITHUB_REPO=starknet-gaming
GITHUB_BRANCH=main
```

If the API is unavailable, the game automatically falls back to a local leaderboard in the browser.

## GitHub Pages Setup

To publish this repository with GitHub Pages:

1. Open the repository on GitHub.
2. Go to `Settings`.
3. Open `Pages`.
4. Under `Build and deployment`, choose `Deploy from a branch`.
5. Select branch `main` and folder `/root`.
6. Save.

The included `.nojekyll` file keeps GitHub Pages from running Jekyll processing and serves the static assets directly.

## Updating Games

Game data lives in the `GAMES` array inside `index.html`.

Each game entry should include:

- `name`
- `cat`
- `status`
- `desc`
- `twitter`
- `website`
- `logo`

Store new logos in `assets/logos/` and use clean lowercase file names with hyphens, for example:

```text
new-game-logo.png
```

## Source Links

The original collected project links are kept in:

```text
docs/project-links.txt
```

## Community Links

- [Telegram Channel](https://t.me/channel_starknet_gaming)
- [Official X](https://x.com/StarknetGaming)
- [Telegram Group](https://t.me/Starknet_Gaming)
- [Starknet Ecosystem](https://starknet-ecosystem.com/)
