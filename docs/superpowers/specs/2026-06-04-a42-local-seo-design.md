# A42 Local SEO — Design Spec
**Date:** 2026-06-04  
**Stack:** Next.js 14 · Supabase · TypeScript · Tailwind CSS  
**Repo:** github.com/Ascension42/a42-local-seo

---

## 1. Concept

Site-annuaire SEO local pour praticiens bien-être (sophrologues, coachs, naturopathes…), dupliquable par ville et spécialité. Chaque déploiement = un domaine dédié (ex: `sophrologue-bordeaux.fr`). La valeur : ranker sur Google pour les requêtes locales, monétiser en proposant aux praticiens un abonnement Premium pour apparaître en position haute.

---

## 2. Architecture

### Multi-tenant par variables d'environnement

Un seul codebase Next.js. Chaque déploiement configure :
```
NEXT_PUBLIC_CITY=bordeaux
NEXT_PUBLIC_CITY_LABEL="Bordeaux"
NEXT_PUBLIC_SPECIALTY=sophrologue
NEXT_PUBLIC_SPECIALTY_LABEL="Sophrologue"
NEXT_PUBLIC_SITE_DOMAIN=sophrologue-bordeaux.fr
```

Toutes les instances partagent la même base Supabase. Le filtrage par ville+spécialité est fait côté API.

### Stack
- **Frontend :** Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Base de données :** Supabase (PostgreSQL)
- **Auth :** Supabase Auth (pour l'espace praticien)
- **Paiement :** Stripe (abonnements Premium) — phase 2
- **Déploiement :** Vercel (une instance par domaine)

---

## 3. Pages

| Route | Description |
|---|---|
| `/` | Homepage : hero ville, catégories, praticiens mis en avant, blog, texte SEO |
| `/praticiens` | Annuaire complet avec filtres (mode, spécialité, quartier, tarif) |
| `/praticiens/[slug]` | Profil praticien : bio, domaines, process, témoignages, liens, RDV |
| `/blog` | Liste des articles SEO |
| `/blog/[slug]` | Article de blog individuel |
| `/inscription` | Landing page praticiens avec plans Gratuit / Premium |
| `/dashboard` | Espace praticien (connexion, gestion profil) — phase 2 |

---

## 4. Schéma Supabase

### `cities`
| Colonne | Type | Notes |
|---|---|---|
| id | uuid PK | |
| name | text | "Bordeaux" |
| slug | text | "bordeaux" |
| region | text | "Nouvelle-Aquitaine" |
| country | text | "FR" |

### `specialties`
| Colonne | Type | Notes |
|---|---|---|
| id | uuid PK | |
| name | text | "Sophrologue" |
| slug | text | "sophrologue" |
| description | text | |

### `practitioners`
| Colonne | Type | Notes |
|---|---|---|
| id | uuid PK | |
| slug | text | unique |
| first_name | text | |
| last_name | text | |
| city_id | uuid FK → cities | |
| specialty_id | uuid FK → specialties | |
| bio | text | |
| photo_url | text | |
| certification | text | "RNCP Niveau 5" |
| school | text | |
| years_active | int | |
| hourly_rate | int | En euros |
| consultation_mode | enum | 'cabinet' \| 'online' \| 'both' |
| neighborhood | text | "Centre-ville" |
| website_url | text | |
| doctolib_url | text | |
| booking_url | text | URL générique RDV |
| instagram_url | text | |
| facebook_url | text | |
| is_premium | boolean | default false |
| is_verified | boolean | default false |
| created_at | timestamptz | |
| updated_at | timestamptz | |

### `practitioner_tags`
| Colonne | Type | Notes |
|---|---|---|
| id | uuid PK | |
| practitioner_id | uuid FK | |
| label | text | "Stress", "Anxiété"… |

### `testimonials`
| Colonne | Type | Notes |
|---|---|---|
| id | uuid PK | |
| practitioner_id | uuid FK | |
| author_name | text | |
| author_location | text | |
| content | text | |
| date | date | |

### `blog_posts`
| Colonne | Type | Notes |
|---|---|---|
| id | uuid PK | |
| slug | text | unique |
| title | text | |
| excerpt | text | |
| content | text | Markdown |
| city_id | uuid FK | nullable (article générique) |
| specialty_id | uuid FK | nullable |
| reading_time_min | int | |
| published_at | timestamptz | |
| updated_at | timestamptz | |

---

## 5. Charte graphique

Charte Ascension 42 v2.0 — Mars 2026 :

```css
:root {
  --green:       #5cbe83;   /* CTA, boutons, accents */
  --green-dark:  #2e5537;   /* Titres, header */
  --green-deep:  #284a30;   /* Nav, footer */
  --green-light: #80d3a2;   /* Badges, tags, hover */
  --surface:     #eaf7ef;   /* Fond cartes highlight */
  --bg:          #fbfaf8;   /* Fond principal */
  --bg-alt:      #f5f4f0;   /* Sections alternées */
  --text:        #1a1a1a;   /* Corps de texte */
  --muted:       #7a7a7a;   /* Labels, descriptions */
  --font:        'Plus Jakarta Sans';
}
```

---

## 6. Composants clés

- `PractitionerCard` — carte praticien (mode cabinet/online/both, badge premium)
- `PractitionerRow` — ligne annuaire avec filtres
- `CategoryGrid` — grille de problématiques cliquables
- `BlogCard` — carte article (featured + standard)
- `PlanCard` — carte pricing (Gratuit / Premium)
- `BookingCTA` — bouton de réservation externe

---

## 7. SEO

Chaque page génère statiquement (SSG) :
- `<title>` : "Sophrologues à Bordeaux — Trouvez votre praticien"
- `<meta description>` : contenu dynamique par ville+spécialité
- `<h1>` unique par page
- Schema.org `LocalBusiness` sur les pages praticien
- Sitemap.xml auto-généré
- Robots.txt

---

## 8. Phases

**Phase 1 (MVP) :** Pages statiques + Supabase lecture seule + inscription par email  
**Phase 2 :** Espace praticien (auth, gestion profil) + Stripe  
**Phase 3 :** Multi-ville automatisé (duplication par config)
