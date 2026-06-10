type CityContent = {
  about: {
    title: string
    intro: string[]
    wellbeing: string[]
  }
}

const cityContentMap: Record<string, CityContent> = {
  beziers: {
    about: {
      title: 'Béziers, votre ville au quotidien',
      intro: [
        "Avec environ 80 000 habitants, Béziers est l'une des villes principales du département de l'Hérault, en région Occitanie. Bâtie sur un promontoire dominant la vallée de l'Orb, elle conserve un riche patrimoine : la cathédrale Saint-Nazaire qui surplombe le fleuve, les allées Paul-Riquet — du nom de l'ingénieur biterrois du canal du Midi — et les célèbres Neuf Écluses de Fonséranes, inscrites au patrimoine mondial de l'UNESCO.",
        "Reliée à Montpellier et à Narbonne par l'autoroute A9 et desservie par une gare TGV, Béziers profite aussi de la proximité du littoral méditerranéen, à une quinzaine de kilomètres des plages de Valras-Plage. Au cœur du plus grand vignoble de France, la ville garde un art de vivre méridional, entre tradition viticole et animation locale, notamment lors de la feria chaque été.",
      ],
      wellbeing: [
        "En plein centre-ville, le Plateau des Poètes offre un vaste jardin à l'anglaise planté d'essences rares — un espace ombragé et calme, idéal pour une pause loin de l'agitation. Les allées Paul-Riquet, bordées de platanes centenaires, invitent elles aussi à la flânerie.",
        "Les berges du canal du Midi, avec leurs chemins de halage ombragés, se prêtent à la marche ou au vélo à un rythme tranquille. Entre patrimoine, nature et douceur de vivre, Béziers offre un cadre propice à la détente et à la prise de recul au quotidien.",
      ],
    },
  },
  pezenas: {
    about: {
      title: 'Pézenas, votre ville au quotidien',
      intro: [
        "Avec environ 8 000 habitants, Pézenas est une ville d'art et d'histoire du département de l'Hérault, en région Occitanie. Surnommée la « Versailles du Languedoc », elle conserve un exceptionnel patrimoine architectural : hôtels particuliers, ateliers d'artisans, et la mémoire de Molière qui y séjourna régulièrement au XVIIe siècle.",
        "Nichée au cœur de la plaine héraultaise, Pézenas est entourée de vignobles AOC Languedoc et se trouve à une trentaine de kilomètres de la Méditerranée. La ville propose un art de vivre tranquille, marqué par ses marchés, ses antiquaires et sa scène culturelle vivante tout au long de l'année.",
      ],
      wellbeing: [
        "La vieille ville piétonne invite à la flânerie le long de ses ruelles pavées et de ses cours intérieures. Les environs offrent des sentiers de randonnée à travers les garrigues et les vignobles, propices à la déconnexion.",
        "Ville à taille humaine, Pézenas favorise un rythme de vie apaisé et une relation de proximité avec ses prestataires de santé et de bien-être — un cadre idéal pour un accompagnement personnalisé.",
      ],
    },
  },
}

export function getCityContent(citySlug: string, cityLabel: string): CityContent {
  return cityContentMap[citySlug] ?? {
    about: {
      title: `${cityLabel}, votre ville au quotidien`,
      intro: [
        `${cityLabel} est une ville française avec un art de vivre qui lui est propre. Cadre de vie, patrimoine et dynamisme local en font un lieu de choix pour s'installer et trouver un accompagnement en bien-être.`,
        `Entourée d'une nature accessible et bénéficiant d'une vie locale animée, ${cityLabel} offre à ses habitants un équilibre entre vie quotidienne et ressourcement personnel.`,
      ],
      wellbeing: [
        `Dans un environnement propice à la détente, les habitants de ${cityLabel} bénéficient d'une offre de praticiens en bien-être à taille humaine, favorisant un suivi personnalisé et une relation de confiance.`,
        `Que ce soit en centre-ville ou en périphérie, les espaces verts et les lieux de calme ne manquent pas pour prendre du recul et se retrouver.`,
      ],
    },
  }
}
