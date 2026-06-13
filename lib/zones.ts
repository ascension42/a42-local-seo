export type Zone = { slug: string; label: string; description: string }

export const cityZones: Record<string, Zone[]> = {
  lumevale: [
    { slug: 'centre-ville',  label: 'Centre-ville',           description: 'Cœur de Lumévale, ruelles pavées et commerces' },
    { slug: 'berges-vele',   label: 'Les Berges de la Vèle',  description: 'Bords de rivière, cadre calme et nature' },
    { slug: 'collines',      label: 'Collines & Périphérie',  description: 'Résidentiel, familles, cadre verdoyant' },
  ],
  pezenas: [
    { slug: 'centre-historique', label: 'Centre historique',           description: 'Vieille ville piétonne, tourisme et commerces' },
    { slug: 'peripherie',        label: 'Périphérie & Villages',       description: 'Communes environnantes et zones résidentielles' },
  ],
  beziers: [
    { slug: 'centre-ville',   label: 'Centre-ville',                description: 'Centre historique, Plateau des Poètes, Allées Paul Riquet' },
    { slug: 'rive-droite',    label: 'Rive Droite',                 description: 'Résidentiel haut de gamme, rive est du Canal/Orb' },
    { slug: 'saint-jacques',  label: 'Saint-Jacques & Les Arènes',  description: 'Quartier vivant, proche centre, bon trafic piéton' },
    { slug: 'montimaran',     label: 'Montimaran',                  description: 'Familial, calme, secteur Fonseranes' },
    { slug: 'deveze',         label: 'La Devèze',                   description: 'Grand bassin de population, sous-desservi en bien-être' },
    { slug: 'crouzette',      label: 'La Crouzette',                description: 'Calme, nature, abords du Canal du Midi' },
  ],
  montpellier: [
    { slug: 'ecusson',     label: 'Écusson & Centre',              description: 'Centre historique, Place de la Comédie' },
    { slug: 'antigone',    label: 'Antigone & Port Marianne',      description: 'Résidentiel moderne, CSP+, premium' },
    { slug: 'beaux-arts',  label: 'Beaux-Arts & Boutonnet',        description: 'Quartier bobo/étudiant, bien-être très recherché' },
    { slug: 'hopitaux',    label: 'Hôpitaux-Facultés',             description: 'Étudiants, soignants, préparation examens' },
    { slug: 'mosson',      label: 'Mosson & Paillade',             description: 'Grand bassin de population, sous-desservi' },
    { slug: 'pres-arenes', label: "Près-d'Arènes & Croix-d'Argent", description: 'Familial, actif, bonne cible burn-out' },
    { slug: 'cevennes',    label: 'Cévennes & Pas-du-Loup',        description: 'Résidentiel calme, familles' },
    { slug: 'millenaire',  label: 'Millénaire & Grisettes',        description: 'Quartier en développement, jeunes actifs' },
    { slug: 'castelnau',   label: 'Castelnau & Pompignane',        description: 'Résidentiel aisé, cible périnatal/sport' },
    { slug: 'lattes',      label: 'Lattes & Sud',                  description: 'Périphérie, nature, positionnement lâcher-prise' },
  ],
}

export const SUGGESTED_NICHES = [
  'Stress & burn-out',
  'Sommeil & anxiété',
  'Sport & performance',
  'Périnatal & maternité',
  'Enfants & ados',
  'Entreprises & RH',
]

export function getZonesForCity(citySlug: string): Zone[] {
  return cityZones[citySlug] ?? []
}
