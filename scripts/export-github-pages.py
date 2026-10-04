#!/usr/bin/env python3
"""Export the rendered landing and About pages for GitHub Pages.

Prerequisites: run `npm run build` and `npm run start` in the project first.
The exporter fetches the same SSR HTML served locally, strips Next/vinext
hydration payloads, and writes a self-contained static site to docs/.
"""
from html import escape
from pathlib import Path
from urllib.request import urlopen
import re
import shutil

ROOT = Path(__file__).resolve().parents[1]
DOCS = ROOT / "docs"
BASE = "/offcut-to-order"
REPO_URL = "https://github.com/climate-hacktion-2026/offcut-to-order"
SERVER = "http://127.0.0.1:8787"


def fetch(path: str) -> str:
    with urlopen(SERVER + path, timeout=30) as response:
        if response.status != 200:
            raise RuntimeError(f"{path} returned HTTP {response.status}")
        return response.read().decode("utf-8")


def body_markup(document: str) -> tuple[str, str, str]:
    html_tag = re.search(r"<html\b([^>]*)>", document, re.I)
    body_tag = re.search(r"<body\b([^>]*)>", document, re.I)
    body = re.search(r"<body\b[^>]*>(.*?)</body>", document, re.I | re.S)
    if not (html_tag and body_tag and body):
        raise RuntimeError("Expected complete server-rendered HTML document")
    html_class = re.search(r'\bclass="([^"]*)"', html_tag.group(1))
    body_class = re.search(r'\bclass="([^"]*)"', body_tag.group(1))
    content = re.sub(r"<script\b[^>]*>.*?</script\s*>", "", body.group(1), flags=re.I | re.S)
    content = re.sub(r"<script\b[^>]*/\s*>", "", content, flags=re.I)
    return (html_class.group(1) if html_class else "", body_class.group(1) if body_class else "", content)


def rewrite_links(markup: str) -> str:
    def attribute(match: re.Match[str]) -> str:
        name, quote, value = match.group(1), match.group(2), match.group(3)
        if name.lower() == "href":
            if value == "/app":
                value = "#pages-demo-note"
            elif value == "/":
                value = BASE + "/"
            elif value == "/about":
                value = BASE + "/about/"
            elif value.startswith("/#"):
                value = BASE + "/" + value[1:]
            elif value.startswith("/") and not value.startswith("//"):
                value = BASE + value
        elif name.lower() == "src" and value.startswith("/") and not value.startswith("//"):
            value = BASE + value
        return f"{name}={quote}{escape(value, quote=True)}{quote}"

    return re.sub(r'\b(href|src)=("|\')(.*?)\2', attribute, markup, flags=re.I | re.S)


def copy_assets(css: str) -> str:
    assets = DOCS / "assets"
    fonts_out = assets / "fonts"
    fonts_out.mkdir(parents=True, exist_ok=True)
    fonts_src = ROOT / "dist/client/_next/static/_vinext_fonts"
    for font in fonts_src.rglob("*.woff2"):
        shutil.copy2(font, fonts_out / font.name)
    for rel in ("favicon.svg", "hero-wave.svg", "logo"):
        src = ROOT / "dist/client" / rel
        dest = DOCS / rel
        if src.is_dir():
            shutil.copytree(src, dest, dirs_exist_ok=True)
        elif src.exists():
            dest.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(src, dest)

    return rewrite_css_urls(css)


def rewrite_css_urls(css: str) -> str:
    def url(match: re.Match[str]) -> str:
        path = match.group(1).strip().strip('"').strip("'")
        if path.startswith("/_next/static/_vinext_fonts/"):
            path = BASE + "/assets/fonts/" + Path(path).name
        elif path.startswith("/") and not path.startswith("//"):
            path = BASE + path
        return f'url("{path}")'

    return re.sub(r"url[(]([^)]*)[)]", url, css)


def font_style(document: str) -> str:
    match = re.search(r"<style[^>]*data-vinext-fonts[^>]*>(.*?)</style[ \t]*>", document, re.I | re.S)
    if not match:
        raise RuntimeError("Expected vinext local-font stylesheet in server HTML")
    return rewrite_css_urls(match.group(1))


def main() -> None:
    DOCS.mkdir(parents=True, exist_ok=True)
    client_css = sorted((ROOT / "dist/client/_next/static/css").glob("*.css"))
    if not client_css:
        raise RuntimeError("Build CSS not found; run npm run build first")
    css = copy_assets(client_css[0].read_text())
    css += "\n.pages-demo-note{background:var(--ink);color:var(--bg);padding:14px 0;font:14px/1.5 var(--f-body)}.pages-demo-note .site-wrap{display:flex;justify-content:space-between;align-items:center;gap:16px;flex-wrap:wrap}.pages-demo-note a{color:var(--accent);text-decoration:underline}\n"
    (DOCS / "assets").mkdir(parents=True, exist_ok=True)
    (DOCS / "assets/site.css").write_text(css)
    static_js = '''document.querySelectorAll(".about-feedback-form").forEach((form) => {
  form.querySelectorAll(".role-toggle, .rating-row").forEach((group) => {
    group.querySelectorAll("button").forEach((button) => {
      button.addEventListener("click", () => {
        group.querySelectorAll("button").forEach((choice) => choice.setAttribute("aria-pressed", String(choice === button)));
      });
    });
  });
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    form.innerHTML = '<div class="about-feedback-preview"><div class="stamp stamp--ok"><b>Thanks!</b></div><h3>Preview only</h3><p>This form is not connected. Your response was not sent or stored.</p><button class="about-text-button" type="button">Try again</button></div>';
    form.querySelector("button").addEventListener("click", () => window.location.reload());
  });
});
'''
    (DOCS / "assets/marketing.js").write_text(static_js)
    for route, target in (("/", DOCS / "index.html"), ("/about", DOCS / "about/index.html")):
        document = fetch(route)
        html_class, body_class, content = body_markup(document)
        fonts = font_style(document)
        content = rewrite_links(content)
        content += (
            '<aside id="pages-demo-note" class="pages-demo-note"><div class="site-wrap">'
            '<span>The interactive CircularCut app is not hosted on GitHub Pages; this is a static preview of the landing and About pages.</span>'
            f'<a href="{REPO_URL}" target="_blank" rel="noreferrer">Project source ↗</a>'
            '</div></aside>'
        )
        html_doc = (
            '<!doctype html><html lang="en"'
            + (f' class="{escape(html_class, quote=True)}"' if html_class else "")
            + '><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">'
            + f'<style data-vinext-fonts>{fonts}</style>'
            '<title>Offcut-to-Order — EarthSync</title>'
            '<meta name="description" content="Offcut-to-Order matches workshop orders with reusable timber offcuts.">'
            f'<link rel="icon" type="image/svg+xml" href="{BASE}/favicon.svg">'
            f'<link rel="stylesheet" href="{BASE}/assets/site.css">'
            '</head><body'
            + (f' class="{escape(body_class, quote=True)}"' if body_class else "")
            + '>' + content + f'<script src="{BASE}/assets/marketing.js" defer></script></body></html>'
        )
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text(html_doc)
        print(f"Wrote {target.relative_to(ROOT)} ({len(html_doc)} chars)")


if __name__ == "__main__":
    main()
