# Observabilité & Analytics

Ce projet utilise deux couches complémentaires pour suivre le trafic et le comportement des utilisateurs.

## Stack

| Outil | Rôle | Dashboard |
|-------|------|-----------|
| **Vercel Analytics** | Pageviews, visiteurs uniques, pays, devices, referrers | Vercel → Analytics |
| **PostHog EU** | Events comportementaux, funnels, session replay | https://eu.posthog.com |

---

## Setup initial

### 1. Vercel Analytics

Déjà activé via `@vercel/analytics/react` dans le layout. Pour l'activer dans Vercel :

1. Aller sur [vercel.com](https://vercel.com) → ton projet → onglet **Analytics**
2. Cliquer **Enable**

C'est tout. Pas de compte externe, pas de cookie, RGPD-compliant nativement.

### 2. PostHog

1. Créer un compte sur [eu.posthog.com](https://eu.posthog.com) (serveurs EU = conformité RGPD)
2. Créer un projet
3. Copier la clé depuis **Project Settings → Project API key**
4. Ajouter dans `.env.local` :
   ```
   NEXT_PUBLIC_POSTHOG_KEY=phc_xxxxxxxxxxxxxxxx
   NEXT_PUBLIC_POSTHOG_HOST=https://eu.i.posthog.com
   ```
5. Ajouter les mêmes variables dans Vercel → Settings → Environment Variables

---

## Ce qui est tracké

### Pageviews automatiques (Vercel Analytics)
- Toutes les pages automatiquement
- Données : URL, pays, device type, referrer, durée de session

### Events PostHog

| Event | Déclenché quand | Propriétés |
|-------|-----------------|------------|
| `hero_cta_practitioners_clicked` | Clic "Voir les praticiens" (Hero) | — |
| `hero_cta_inscription_clicked` | Clic "Inscrire mon cabinet" (Hero) | — |
| `inscription_plan_cta_clicked` | Clic sur un plan (Standard ou Premium) | `plan`, `location` |
| `inscription_form_started` | Premier champ rempli dans le formulaire | `plan` |
| `inscription_form_submitted` | Formulaire soumis avec succès | `plan`, `specialty` |
| `inscription_form_error` | Erreur lors de la soumission | `plan`, `error` |
| `booking_button_clicked` | Clic "Prendre RDV" sur un profil praticien | `practitioner_id` |
| `practitioner_profile_viewed` | Ouverture d'une page profil praticien | `practitioner_id`, `referrer` |

### Propriétés des events
- `plan` : `'standard'` ou `'premium'`
- `location` : `'cards'` (cards de prix) ou `'bottom_cta'` (section bas de page)
- `specialty` : slug de la spécialité (ex: `sophrologue`)
- `practitioner_id` : UUID Supabase du praticien

---

## Funnels clés à créer dans PostHog

### Funnel "Conversion praticien"
```
inscription_plan_cta_clicked
→ inscription_form_started
→ inscription_form_submitted
```
Ce funnel te montre combien de praticiens voient la page de prix, cliquent, commencent le formulaire, et le terminent.

### Funnel "Engagement patient"
```
Pageview /praticiens
→ practitioner_profile_viewed
→ booking_button_clicked
```

---

## Ajouter un nouvel event

1. Ajouter le type dans `lib/analytics.ts` :
   ```ts
   | { name: 'mon_nouvel_event'; properties: { ma_prop: string } }
   ```

2. Appeler `track()` dans le composant client :
   ```tsx
   import { track } from '@/lib/analytics'
   
   track({ name: 'mon_nouvel_event', properties: { ma_prop: 'valeur' } })
   ```

3. Documenter l'event dans ce fichier.

> **Règle** : `track()` ne fonctionne que dans les composants `'use client'`. Pour les server components, extraire les éléments interactifs en client components séparés (voir `HeroCTAs.tsx` pour exemple).

---

## Session Replay

PostHog enregistre automatiquement les sessions utilisateurs (anonymisées). Accessible dans **PostHog → Session Recording**.

Très utile pour comprendre pourquoi les utilisateurs abandonnent le formulaire d'inscription.

---

## RGPD

- **Vercel Analytics** : pas de cookie, pas de consentement requis
- **PostHog EU** : données hébergées en Europe, `person_profiles: 'identified_only'` → pas de profil créé pour les visiteurs anonymes
- Aucun des deux outils ne collecte de PII (Personally Identifiable Information) dans les events
