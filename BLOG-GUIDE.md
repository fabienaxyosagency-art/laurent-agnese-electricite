# Guide d'ajout d'articles de blog

Procédure pour ajouter un nouvel article au blog de Laurent Agnese Électricité Générale, en gardant le SEO local et l'optimisation IA cohérents.

---

## 🎯 Avant d'écrire — Stratégie SEO

Chaque nouvel article doit cibler **une question concrète** que se posent les habitants de la Combraille / Allier sud. Quelques angles porteurs :

- **Saisonnier** : "Préparer son installation électrique avant l'hiver", "Coup de foudre en juillet : que faire ?"
- **Géo précis** : "Diagnostic électrique avant achat à Commentry", "Travaux dans une grange à Marcillat"
- **Réglementaire** : "Nouvelle norme XYZ 2027", "Aides MaPrimeRénov' électrique"
- **Comparatif** : "Tableau Hager vs Schneider", "Quelle marque d'interrupteur choisir"
- **Erreur courante** : "Les 5 erreurs de câblage qu'on voit dans 80% des maisons rénovées"
- **Question client réelle** : tirée des appels reçus la semaine précédente — c'est l'or pur

**Cible** : 800 à 1 500 mots, 6 à 10 min de lecture, structure H2 + H3 + listes + 1 ou 2 box info.

---

## 📁 Étapes pour publier un article

### 1. Choisir le slug (URL)

Le slug doit être :
- En minuscules, avec des tirets, sans accents
- Court mais descriptif
- Contenir 1 mot-clé local si pertinent

✅ Bons exemples :
- `prise-electrique-cuisine-norme-2026`
- `panne-disjoncteur-hiver-marcillat`
- `eclairage-led-grange-renovation`

❌ À éviter :
- `article-3` (trop générique)
- `comment-installer-une-prise-electrique-dans-une-cuisine-aux-normes-2026` (trop long)
- `nouvelle_prise_à_la_cuisine` (caractères spéciaux, underscore)

### 2. Dupliquer le template

```bash
cd blog/
cp -r _template/ mon-nouveau-slug/
cd mon-nouveau-slug/
```

### 3. Modifier le fichier `index.html`

Le template contient des placeholders `[REMPLACER:XXX]`. Cherche-les tous (cmd+F dans ton éditeur) et remplace par les vraies valeurs :

**Métadonnées (HEAD)** — critique pour le SEO :
- `[REMPLACER:TITRE_DE_LARTICLE]` → titre 50-60 caractères (apparaît dans Google + onglet)
- `[REMPLACER:DESCRIPTION_SEO_140_160_CARACTERES]` → description Google (snippet)
- `[REMPLACER:5_A_10_MOTS_CLES_SEPARES_PAR_VIRGULE]` → mots-clés
- `[REMPLACER:SLUG]` → ton slug (occurrences multiples)
- `[REMPLACER:CATEGORIE]` → catégorie (ex : "Rénovation", "Dépannage", "Conseils")
- `[REMPLACER:YYYY-MM-DD]` → date publication ISO (ex : 2026-06-15)
- `[REMPLACER:NB_MOTS]` → nombre de mots du body (estimer)
- `[REMPLACER:MIN_LECTURE]` → minutes lecture (mots ÷ 200, arrondi)
- `[REMPLACER:IMAGE]` → nom du fichier image OG (sans extension), à mettre dans `/assets/chantiers/` ou `/assets/launch/`

**Corps de l'article (BODY)** :
- `[REMPLACER:TITRE_H1]` → titre principal (peut être identique au title HTML)
- `[REMPLACER:SOUS_TITRE_ITALIQUE]` → bout en italique (cursive) pour le punch
- `[REMPLACER:CHAPEAU_INTRODUCTIF]` → 2-4 phrases qui résument l'article et donnent envie de lire
- `[REMPLACER:DATE_FR]` → date visible humaine (ex : "15 juin 2026")
- `[REMPLACER:X]` → minutes de lecture
- Tous les `[REMPLACER:H2_SECTION_X]`, `[REMPLACER:PARAGRAPHE]`, etc.

**Articles liés (en bas)** :
- Choisis 2 articles existants thématiquement proches, mets leurs slugs dans les `[REMPLACER:AUTRE_ARTICLE_SLUG_X]`

### 4. Ajouter une carte sur la page listing

Ouvre `blog/index.html` et copie-colle une nouvelle carte `<a class="blog-card">...</a>` dans le `.blog-grid`, en t'inspirant des 4 cartes existantes. Ne pas oublier :
- `href="ton-nouveau-slug/"` (avec slash final !)
- Titre H2 court
- Description 1-2 phrases
- Catégorie (texte du `<span class="blog-card-cat">`)
- Date + temps de lecture

Pense aussi à mettre à jour le `<script type="application/ld+json">` JSON-LD Blog en haut du fichier listing pour ajouter ton nouvel article dans `blogPost`.

### 5. Mettre à jour le sitemap.xml

Ouvre `sitemap.xml` à la racine et ajoute 2 nouvelles entrées juste avant `</urlset>` :

```xml
<url>
    <loc>https://www.electricien-marcillat.fr/blog/MON-SLUG/</loc>
    <lastmod>2026-06-15</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
</url>
<url>
    <loc>https://www.electricien-marcillat.fr/blog/MON-SLUG/index.md</loc>
    <lastmod>2026-06-15</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.4</priority>
</url>
```

### 6. Générer le mirror Markdown (1 commande)

Depuis la racine du projet :

```bash
python3 scripts/regenerate-blog-mirrors.py
```

Ce script :
- Parcourt tous les `blog/*/index.html`
- Génère un `index.md` propre à côté (strip HTML/scripts/svg, garde le contenu)
- Met à jour `blog/index.md` (listing)

### 7. Ajouter le lien dans `llms.txt`

Ouvre `llms.txt` à la racine, trouve la section `## Markdown Mirrors`, ajoute la ligne :

```
- https://www.electricien-marcillat.fr/blog/MON-SLUG/index.md
```

### 8. Commit + déploy

```bash
git add -A
git commit -m "blog: ajout article MON-SLUG"
git push
vercel --prod
```

Vercel re-déploie automatiquement en 10-30 secondes.

### 9. Demander indexation Google (optionnel mais recommandé)

Va sur [Google Search Console](https://search.google.com/search-console) :
1. Barre de recherche en haut → tape `https://www.electricien-marcillat.fr/blog/MON-SLUG/`
2. Clique "Demander une indexation"
3. Attends ~24h, l'article apparaît dans les résultats

---

## 📋 Checklist avant de publier

- [ ] Slug en minuscules avec tirets, sans accents
- [ ] Title 50-60 caractères avec keyword principal
- [ ] Description 140-160 caractères avec keyword + accroche
- [ ] H1 unique et différent du title (mais cohérent)
- [ ] 1 keyword principal dans le H1, 2-3 keywords secondaires dans les H2
- [ ] Au moins 1 mention de "Marcillat", "Combraille", ou "Allier" dans le body
- [ ] Au moins 2 liens internes (vers d'autres articles ou la home `/#devis`)
- [ ] 1 image OG en `/assets/` qui existe vraiment
- [ ] CTA milieu d'article + CTA bas (vers `/#devis`)
- [ ] 2 articles liés en bas
- [ ] Date au format YYYY-MM-DD en métadonnées + date FR en visible
- [ ] Aucun placeholder `[REMPLACER:XXX]` restant (cmd+F pour vérifier)
- [ ] Schema.org JSON-LD valide ([validator](https://validator.schema.org/))
- [ ] Sitemap.xml mis à jour
- [ ] Listing `blog/index.html` mis à jour
- [ ] `python3 scripts/regenerate-blog-mirrors.py` exécuté
- [ ] llms.txt enrichi avec le mirror du nouvel article

---

## 🎨 Boîtes utiles dans le contenu

### Info box (bleu, neutre — pour définitions, key takeaways)

```html
<div class="info-box">
    <strong>Bon à savoir</strong>
    <p>Votre contenu informatif ici.</p>
</div>
```

### Warning box (rouge — pour dangers, pièges)

```html
<div class="warning-box">
    <strong>Attention</strong>
    <p>Votre avertissement ici.</p>
</div>
```

### Blockquote (citation, conseil de Laurent)

```html
<blockquote>
    "Ne jamais brancher un groupe directement sur une prise de la maison sans inverseur — c'est dangereux pour les techniciens Enedis sur la ligne."
</blockquote>
```

### CTA mi-article

```html
<aside class="article-cta">
    <h3>Titre accrocheur lié au sujet</h3>
    <p>Phrase de transition vers le devis.</p>
    <a href="/#devis" class="btn btn-primary">Demander un devis gratuit</a>
</aside>
```

---

## 🚀 Idées d'articles (banque)

Pour ne jamais être en panne d'inspiration :

1. "5 erreurs de câblage qu'on voit dans 80 % des rénovations DIY"
2. "Combien coûte un dépannage d'urgence un dimanche en Combraille ?"
3. "Pompe à chaleur + voiture électrique : votre tableau tiendra-t-il ?"
4. "Aides 2026 pour la rénovation électrique d'une passoire thermique"
5. "Domotique en milieu rural : par où commencer sans se ruiner ?"
6. "Avant achat immobilier : 7 contrôles à faire sur l'électricité"
7. "Pourquoi le parafoudre est obligatoire en Combraille"
8. "LED extérieur en zone classée : règles + bonnes pratiques"
9. "Mon installation est-elle assurée en cas d'incendie ?"
10. "Refaire l'électricité d'une grange : ce qui change vs une maison"

Privilégie un article toutes les 2-4 semaines pour un signal SEO frais sans saturer.

---

## ❓ FAQ

**Q : Faut-il regénérer tous les mirrors à chaque ajout ?**
R : Oui, le script `scripts/regenerate-blog-mirrors.py` re-parse tous les articles. C'est rapide (~2s) et garantit la cohérence.

**Q : Combien d'articles avant de voir un effet SEO ?**
R : Compte 3-6 mois pour des effets mesurables. Les bots IA (ChatGPT, Perplexity) citeront ton site plus vite via les mirrors `.md` — souvent dans les 2-4 semaines.

**Q : Puis-je modifier un article publié sans souci ?**
R : Oui. Si la modification est substantielle, mets à jour la `dateModified` dans le JSON-LD (pas la `datePublished`) pour signaler à Google qu'il y a du frais.

**Q : Comment ajouter une image dans le corps de l'article ?**
R : Mets l'image dans `/assets/blog/` (à créer), puis dans le `<div class="article-body">` :
```html
<img src="/assets/blog/ton-image.jpg" alt="Description précise" loading="lazy" width="1200" height="800" style="border-radius: var(--radius-lg); margin: 1.5rem 0;">
```
Toujours JPEG/WebP optimisés &lt; 200 KB, `alt` descriptif, `loading="lazy"`.

---

Bon blog ! 📝
