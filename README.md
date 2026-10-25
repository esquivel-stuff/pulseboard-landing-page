# Pulseboard — landing page demo (v2)

**Live demo: https://pulseboard-demo-sigma.vercel.app**

Portfolio demo by Ian Esquivel. **Pulseboard is a fictional product.** There are no real customers, logos, quotes or stats here. Prices and dashboard numbers are sample data.

## What's in here

- `index.html`: the page (dark look; Inter Tight, Inter and Geist Mono; one orange accent).
- `styles.css` and `main.js`: all styles and the small amount of JavaScript (scroll reveals, counters, ticker). No dependencies.
- `app/index.html`: the dashboard UI shown on the page, built in HTML/SVG with demo data. `node shoot-app.mjs` re-renders `img/pulseboard-app.png`.
- `img/`: art drawn with code (`tools/make_art.py`), plus the dashboard screenshot.
- `qa.mjs`: Playwright screenshots at 1440 and 390 plus basic checks (console errors, broken images, horizontal overflow). Results go to `qa/`.

## Run locally

Plain HTML, CSS and JavaScript with no build step. Open `index.html` in a browser, or run `python3 -m http.server 8000` and open http://localhost:8000.
