#!/usr/bin/env python3
"""
Régénère tous les markdown mirrors du blog.

Usage (depuis la racine du projet) :
    python3 scripts/regenerate-blog-mirrors.py

Ce script :
- Parcourt tous les blog/<slug>/index.html
- Strip HTML/CSS/JS/SVG/scripts pour ne garder que le contenu lisible
- Génère un index.md propre avec en-tête YAML (title, description, url, last_updated)
- Met aussi à jour /blog/index.md (listing)
- Met aussi à jour /index.md (homepage)

Dépendance : pip3 install markdownify
"""
import re
import os
import sys
from datetime import date
from pathlib import Path

try:
    from markdownify import markdownify as md
except ImportError:
    print("❌ Module 'markdownify' manquant.")
    print("   Installer avec : pip3 install markdownify")
    sys.exit(1)


# Patterns à supprimer du HTML avant conversion en markdown
STRIP_PATTERNS = [
    (r'<head[\s\S]*?</head>', ''),
    (r'<header[\s\S]*?</header>', ''),
    (r'<footer[\s\S]*?</footer>', ''),
    (r'<script[\s\S]*?</script>', ''),
    (r'<style[\s\S]*?</style>', ''),
    (r'<svg[\s\S]*?</svg>', ''),
    (r'<canvas[^/]*?(?:/>|></canvas>)', ''),
    (r'<iframe[\s\S]*?</iframe>', ''),
    (r'<form[\s\S]*?</form>', '[Formulaire de devis disponible sur le site]'),
    (r'<input[^>]*>', ''),
    (r'<select[\s\S]*?</select>', ''),
    (r'<textarea[\s\S]*?</textarea>', ''),
    (r'<button[^>]*>[^<]*</button>', ''),
    (r'<div class="reading-progress"[^>]*></div>', ''),
    (r'<a class="article-back"[\s\S]*?</a>', ''),
    (r'<div class="article-share"[\s\S]*?</div>\s*</footer>', '</footer>'),
    (r'<section class="article-related"[\s\S]*?</section>', ''),
    (r'<details class="legal-details"[\s\S]*?</details>', ''),
    (r'<section id="legal"[\s\S]*?</section>', ''),
    (r'<a href="#[^"]+"[^>]*class="skip-link[^"]*">[^<]+</a>', ''),
    (r'aria-hidden="true"', ''),
    (r'class="[^"]*"', ''),
    (r'data-[a-z-]+="[^"]*"', ''),
    (r'\s+>', '>'),
]


def extract_meta(html, name='description'):
    """Extrait une balise meta du HTML."""
    pattern = rf'<meta\s+name="{name}"\s+content="([^"]+)"'
    m = re.search(pattern, html)
    return m.group(1) if m else ''


def extract_title(html):
    m = re.search(r'<title>([^<]+)</title>', html)
    return m.group(1) if m else ''


def html_to_markdown(html_path, url, author=None):
    """Convertit un fichier HTML en markdown avec front-matter YAML."""
    with open(html_path, 'r', encoding='utf-8') as f:
        html = f.read()

    title = extract_title(html)
    description = extract_meta(html, 'description')

    # Strip
    cleaned = html
    for pat, repl in STRIP_PATTERNS:
        cleaned = re.sub(pat, repl, cleaned, flags=re.IGNORECASE)

    # Convert
    markdown = md(cleaned, heading_style='ATX', bullets='-',
                  escape_asterisks=False, escape_underscores=False)
    markdown = re.sub(r'\n{3,}', '\n\n', markdown)
    markdown = re.sub(r'^\s+$', '', markdown, flags=re.MULTILINE)
    markdown = markdown.strip()

    # Build front-matter
    author_line = f'\nauthor: {author}\npublisher: Laurent Agnese Électricité Générale' if author else ''
    front_matter = f"""---
title: "{title}"
description: "{description[:200]}"
url: {url}
last_updated: {date.today().isoformat()}
canonical: {url}{author_line}
---

{markdown}
"""
    return front_matter


def main():
    # Travailler depuis la racine du projet (parent du dossier scripts/)
    root = Path(__file__).resolve().parent.parent
    os.chdir(root)

    print(f"📂 Working dir : {root}\n")

    count = 0

    # 1. Mirror de la home /index.md
    if Path('index.html').exists():
        content = html_to_markdown(
            'index.html',
            'https://www.electricien-marcillat.fr/'
        )
        with open('index.md', 'w', encoding='utf-8') as f:
            f.write(content)
        kb = os.path.getsize('index.md') // 1024
        print(f"✅ index.md · {kb} KB")
        count += 1

    # 2. Mirror du listing /blog/index.md
    if Path('blog/index.html').exists():
        content = html_to_markdown(
            'blog/index.html',
            'https://www.electricien-marcillat.fr/blog/'
        )
        with open('blog/index.md', 'w', encoding='utf-8') as f:
            f.write(content)
        kb = os.path.getsize('blog/index.md') // 1024
        print(f"✅ blog/index.md · {kb} KB")
        count += 1

    # 3. Mirrors de chaque article /blog/<slug>/index.md
    blog_dir = Path('blog')
    for article_dir in sorted(blog_dir.iterdir()):
        if not article_dir.is_dir():
            continue
        if article_dir.name.startswith('_'):  # skip _template/
            continue
        html_file = article_dir / 'index.html'
        md_file = article_dir / 'index.md'
        if not html_file.exists():
            continue

        slug = article_dir.name
        url = f'https://www.electricien-marcillat.fr/blog/{slug}/'
        content = html_to_markdown(str(html_file), url, author='Laurent Agnese')
        with open(md_file, 'w', encoding='utf-8') as f:
            f.write(content)
        kb = md_file.stat().st_size // 1024
        print(f"✅ {md_file} · {kb} KB")
        count += 1

    print(f"\n🎉 {count} fichiers markdown générés.")
    print(f"\nProchaine étape : commit + push.")
    print(f"    git add -A && git commit -m 'blog: regen mirrors' && git push")


if __name__ == '__main__':
    main()
