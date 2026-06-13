-- Ajoute les colonnes zone et niche aux praticiens
ALTER TABLE practitioners
  ADD COLUMN IF NOT EXISTS zone  text,
  ADD COLUMN IF NOT EXISTS niche text;

-- Contrainte d'unicité : 1 seul praticien par (ville, zone, niche) en ignorant la casse
CREATE UNIQUE INDEX IF NOT EXISTS practitioners_city_zone_niche_unique
  ON practitioners (city_id, lower(trim(zone)), lower(trim(niche)))
  WHERE zone IS NOT NULL AND niche IS NOT NULL AND zone <> '' AND niche <> '';

-- Ajoute aussi sur les demandes d'inscription (pour pré-réserver le slot)
ALTER TABLE inscription_requests
  ADD COLUMN IF NOT EXISTS zone  text,
  ADD COLUMN IF NOT EXISTS niche text;
