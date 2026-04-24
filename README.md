# Laurent Agnese Électricité Générale — Marcillat-en-Combraille (03)

Site vitrine premium pour Laurent Agnese Électricité Générale, artisan électricien basé à Bournet, 03420 Marcillat-en-Combraille (Allier, Combraille).

## Stack

Site statique `HTML` + `CSS` + `JavaScript` vanilla — zéro build step, zéro dépendance runtime.

- **index.html** — Structure sémantique complète avec schemas JSON-LD (`Electrician` / `LocalBusiness` / `HomeAndConstructionBusiness` / `FAQPage` / `BreadcrumbList`)
- **styles.css** — Palette charte Laurent (bleu cyan `#1E9FD9` + rouge `#E63946`) modernisée, typographies Caveat (script) + Inter (sans) + Space Grotesk (display)
- **script.js** — Canvas particules électriques, highlights rotatifs, marquee avis Google, reveals au scroll, scroll progress, formulaire fallback mailto
- **llms.txt** / **robots.txt** / **sitemap.xml** — Référencement SEO classique + GEO (IA-ready)
- **manifest.webmanifest** — PWA, icône SVG inline

## Charte graphique

Reprend fidèlement la carte de visite de Laurent tout en la modernisant :
- **Bleu cyan** (signature manuscrite du nom) — conservée, approfondie via dégradés
- **Rouge vif** (Électricité Générale + éclair) — conservé pour CTA et urgence
- **Typographie Caveat** pour l'effet manuscrit original
- **Inter + Space Grotesk** pour un rendu professionnel contemporain

## Fonctionnalités signature

- **Signature ECG animée** dans le hero (reprend le motif prise → courbe → ampoule de la carte)
- **Canvas particules bleues et rouges** subtiles en hero (électricité qui circule)
- **Highlights rotatifs** (4,5 ★ / 7 ans / 7 services / 24h devis)
- **7 services spécialisés** avec cartes éditoriales : Rénovation · Dépannage · Remise aux normes · Bornes IRVE · Tableaux · Groupes électrogènes · Luminaires
- **Zone d'intervention** avec carte OpenStreetMap + 28 communes listées (rayon 50 km)
- **Avis Google en marquee** défilant, pause au survol, base 4,5/5 sur 9 avis
- **Section confiance** (à propos + fiche légale complète : SIREN, SIRET, TVA, assurances)
- **Galerie chantiers** avec emplacements prêts pour les photos de Laurent
- **FAQ** avec 8 réponses directes + Schema.org FAQPage
- **Devis** avec formulaire complet + fallback mailto automatique
- **SEO/GEO complet** : schemas riches, llms.txt, mots-clés géolocalisés Combraille/Allier

## Informations client (source de vérité)

- **Raison sociale** : LAURENT AGNESE ÉLECTRICITÉ GÉNÉRALE (SARL)
- **SIREN** : 847 545 803 · **SIRET** : 84754580300011
- **TVA** : FR89847545803 · **APE** : 4321A
- **Siège** : Bournet, 03420 Marcillat-en-Combraille
- **Téléphone** : 06 49 79 70 33
- **Email** : elecgenerale.laurentagnese@gmail.com
- **Dirigeants** : Laurent Agnese (gérant) + Isabelle Agnese (co-gérante depuis oct. 2022)
- **Créée** : 15 janvier 2019
- **Certifications** : IRVE (bornes) · Assurance décennale · RC Pro · NF C 15-100 · Consuel

## Ce qui reste à personnaliser

1. **Photos de chantiers réels** (section `#realisations`) — 6 emplacements prêts, remplacer `.gallery-placeholder` par `<img src="assets/chantier-X.webp" alt="…">`
2. **URL Facebook** — ajouter au footer si la page pro existe (demande en cours au client)
3. **Domaine final** — remplacer `laurent-agnese-electricite.fr` dans sitemap + schemas + canonical
4. **Avis Google en direct** — optionnel : remplacer le marquee statique par une fetch à l'API Google Places (nécessite Place ID + clé API via Vercel serverless function)

## Développement local

```bash
npx serve -l 5174 .
# ou
python3 -m http.server 5174
```

Puis ouvrir [http://localhost:5174](http://localhost:5174).

## Déploiement Vercel

```bash
vercel --prod
```

Headers de sécurité, cache long sur assets immutables et Content-Type corrects pour sitemap/robots/llms pré-configurés dans `vercel.json`.

---

© 2026 Laurent Agnese Électricité Générale · Contact : 06 49 79 70 33 · elecgenerale.laurentagnese@gmail.com
