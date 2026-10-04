export const REGIONS = {
  "Tibesti": { adminCenter: "Bardaï", zone: "Saharienne", soil: "Rocailleux/désertique", rainStart: 8, rainEnd: 8, rainPeakMM: 5, avgTemp: 32 },
  "Borkou": { adminCenter: "Faya-Largeau", zone: "Saharienne", soil: "Sableux désertique", rainStart: 7, rainEnd: 9, rainPeakMM: 8, avgTemp: 38 },
  "Ennedi Est": { adminCenter: "Amdjarass", zone: "Saharienne", soil: "Rocailleux/sableux", rainStart: 7, rainEnd: 9, rainPeakMM: 12, avgTemp: 36 },
  "Ennedi Ouest": { adminCenter: "Fada", zone: "Saharienne", soil: "Rocailleux/sableux", rainStart: 7, rainEnd: 9, rainPeakMM: 15, avgTemp: 36 },
  "Kanem": { adminCenter: "Mao", zone: "Sahélo-saharienne", soil: "Sableux", rainStart: 7, rainEnd: 9, rainPeakMM: 25, avgTemp: 37 },
  "Lac": { adminCenter: "Bol", zone: "Sahélienne sèche", soil: "Sablo-limoneux (proche lac Tchad)", rainStart: 6, rainEnd: 9, rainPeakMM: 35, avgTemp: 35 },
  "Barh el Gazel": { adminCenter: "Moussoro", zone: "Sahélienne sèche", soil: "Sableux", rainStart: 6, rainEnd: 9, rainPeakMM: 30, avgTemp: 36 },
  "Wadi Fira": { adminCenter: "Biltine", zone: "Sahélienne sèche", soil: "Sablo-rocailleux", rainStart: 6, rainEnd: 9, rainPeakMM: 40, avgTemp: 35 },
  "Batha": { adminCenter: "Ati", zone: "Sahélienne sèche", soil: "Sablo-limoneux", rainStart: 6, rainEnd: 9, rainPeakMM: 45, avgTemp: 36 },
  "N'Djaména": { adminCenter: "N'Djaména (capitale)", zone: "Sahélienne", soil: "Sableux", rainStart: 6, rainEnd: 9, rainPeakMM: 90, avgTemp: 34 },
  "Hadjer-Lamis": { adminCenter: "Massakory", zone: "Sahélienne", soil: "Sablo-argileux", rainStart: 6, rainEnd: 9, rainPeakMM: 85, avgTemp: 34 },
  "Chari-Baguirmi": { adminCenter: "Massenya", zone: "Sahélienne", soil: "Argilo-sableux", rainStart: 6, rainEnd: 10, rainPeakMM: 95, avgTemp: 33 },
  "Guéra": { adminCenter: "Mongo", zone: "Sahélienne", soil: "Ferrugineux", rainStart: 6, rainEnd: 9, rainPeakMM: 100, avgTemp: 33 },
  "Ouaddaï": { adminCenter: "Abéché", zone: "Sahélienne", soil: "Sablo-limoneux", rainStart: 6, rainEnd: 9, rainPeakMM: 70, avgTemp: 35 },
  "Sila": { adminCenter: "Goz Beïda", zone: "Sahélienne", soil: "Sablo-argileux", rainStart: 6, rainEnd: 9, rainPeakMM: 75, avgTemp: 34 },
  "Salamat": { adminCenter: "Am Timan", zone: "Sahélienne", soil: "Argilo-sableux", rainStart: 5, rainEnd: 10, rainPeakMM: 110, avgTemp: 33 },
  "Mayo-Kebbi Est": { adminCenter: "Bongor", zone: "Sahélo-soudanienne", soil: "Argilo-sableux", rainStart: 5, rainEnd: 10, rainPeakMM: 150, avgTemp: 31 },
  "Tandjilé": { adminCenter: "Laï", zone: "Sahélo-soudanienne", soil: "Argilo-sableux", rainStart: 5, rainEnd: 10, rainPeakMM: 160, avgTemp: 31 },
  "Mayo-Kebbi Ouest": { adminCenter: "Pala", zone: "Soudanienne", soil: "Argilo-sableux", rainStart: 4, rainEnd: 10, rainPeakMM: 190, avgTemp: 30 },
  "Logone Occidental": { adminCenter: "Moundou", zone: "Soudanienne", soil: "Argilo-sableux", rainStart: 4, rainEnd: 10, rainPeakMM: 220, avgTemp: 30 },
  "Logone Oriental": { adminCenter: "Doba", zone: "Soudanienne", soil: "Ferrugineux", rainStart: 4, rainEnd: 10, rainPeakMM: 230, avgTemp: 29 },
  "Mandoul": { adminCenter: "Koumra", zone: "Soudanienne", soil: "Ferrugineux", rainStart: 4, rainEnd: 10, rainPeakMM: 225, avgTemp: 29 },
  "Moyen-Chari": { adminCenter: "Sarh", zone: "Soudanienne", soil: "Ferrugineux", rainStart: 4, rainEnd: 10, rainPeakMM: 200, avgTemp: 31 },
};


export const CROPS = {
  "Sorgho": { sowWindow: [6, 7], cycleDays: 110, waterNeed: "Moyen", minRainMM: 400 },
  "Mil": { sowWindow: [6, 7], cycleDays: 90, waterNeed: "Faible", minRainMM: 300 },
  "Arachide": { sowWindow: [6, 6], cycleDays: 100, waterNeed: "Moyen", minRainMM: 450 },
  "Maïs": { sowWindow: [5, 6], cycleDays: 95, waterNeed: "Élevé", minRainMM: 600 },
  // Cultures maraîchères — généralement irriguées, souvent conduites en contre-saison
  // (saison sèche) plutôt qu'en pluvial pur. minRainMM reste indicatif : l'irrigation
  // d'appoint est de toute façon nécessaire, quelle que soit la pluviométrie.
  "Tomate": { sowWindow: [10, 12], cycleDays: 90, waterNeed: "Élevé", minRainMM: 50 },
  "Poivron": { sowWindow: [10, 12], cycleDays: 100, waterNeed: "Élevé", minRainMM: 50 },
  "Chou": { sowWindow: [9, 11], cycleDays: 75, waterNeed: "Moyen", minRainMM: 50 },
  "Oignon": { sowWindow: [10, 11], cycleDays: 120, waterNeed: "Moyen", minRainMM: 50 },
  "Aubergine": { sowWindow: [9, 11], cycleDays: 100, waterNeed: "Moyen", minRainMM: 50 },
  "Carotte": { sowWindow: [10, 12], cycleDays: 90, waterNeed: "Moyen", minRainMM: 50 },
  "Piment": { sowWindow: [9, 11], cycleDays: 100, waterNeed: "Moyen", minRainMM: 50 },
  "Gombo": { sowWindow: [3, 6], cycleDays: 60, waterNeed: "Faible", minRainMM: 100 },
};

// Principes généraux de la culture de contre-saison (maraîchage en saison sèche),
// affichés en tête du guide pour les légumes. Bonnes pratiques communes en Afrique
// de l'Ouest et centrale — à adapter selon la disponibilité en eau locale.
export const OFF_SEASON_INTRO = {
  title: "Cultiver en contre-saison (saison sèche)",
  points: [
    "La contre-saison profite d'un ensoleillement fort et d'une pression parasitaire souvent plus faible qu'en saison des pluies, mais exige un accès fiable à l'eau (puits, forage, point bas de bas-fond, retenue).",
    "Prévoir une source d'irrigation avant de semer : arrosoir, système goutte-à-goutte artisanal, ou canaux gravitaires selon les moyens disponibles.",
    "Le paillage (paille, résidus de récolte) autour des plants réduit fortement l'évaporation et les besoins en arrosage.",
    "Une ombrière légère (filet ou branchages) protège les jeunes plants et certaines cultures sensibles (chou, laitue) pendant les heures les plus chaudes.",
    "Les cultures maraîchères se prêtent bien à un calendrier échelonné : semer une petite quantité toutes les 2-3 semaines assure une récolte étalée plutôt qu'un pic unique difficile à écouler.",
  ],
};

// Guide de culture — informations agronomiques générales indicatives.
// À valider et affiner avec un agronome / service agricole local avant diffusion aux producteurs.

export const GUIDE = {
  "Sorgho": {
    growsRainSeason: true,
    growsOffSeason: false,
    soils: ["Sols sablo-argileux profonds", "Tolère les sols pauvres et peu fertiles"],
    soilNote: "Culture rustique, peu exigeante, mais préfère un sol bien drainé sans excès d'eau stagnante.",
    yieldRange: "700 – 1 300 kg/ha (systèmes traditionnels pluvial, faible intrant)",
    stages: [
      { title: "Avant semis", timing: "J-30 à J-7", icon: "soil", actions: [
        "Labour ou grattage du sol après les premières pluies utiles",
        "Épandage de fumure organique si disponible (compost, fumier)",
        "Sélection de semences saines de la campagne précédente ou certifiées",
      ]},
      { title: "Semis", timing: "J0", icon: "seed", actions: [
        "Semis en poquets à 3-4 cm de profondeur, écartement ~0,8 x 0,4 m",
        "2-3 graines par poquet, démariage prévu 2 semaines après levée",
      ]},
      { title: "Entretien", timing: "J15 – J60", icon: "care", actions: [
        "Démariage à 1-2 plants par poquet vers J15",
        "1er sarclage à J15-20, 2e sarclage à J35-40",
        "Buttage léger si nécessaire pour limiter la verse",
      ]},
      { title: "Récolte", timing: "J95 – J110", icon: "harvest", actions: [
        "Récolte quand les grains sont durs et les panicules sèches",
        "Coupe des panicules, séchage au champ 3-5 jours avant battage",
      ]},
      { title: "Après récolte", timing: "Post-récolte", icon: "storage", actions: [
        "Battage et vannage, séchage final à moins de 13% d'humidité",
        "Stockage en sacs ou greniers traditionnels, à l'abri de l'humidité et des insectes",
      ]},
    ],
  },
  "Mil": {
    growsRainSeason: true,
    growsOffSeason: false,
    soils: ["Sols sableux légers, bien drainés"],
    soilNote: "Très tolérant à la sécheresse et aux sols pauvres — souvent la culture de dernier recours en zone sahélienne sèche.",
    yieldRange: "400 – 900 kg/ha (systèmes traditionnels pluvial, faible intrant)",
    stages: [
      { title: "Avant semis", timing: "J-20 à J-5", icon: "soil", actions: [
        "Grattage léger du sol, pas de labour profond nécessaire",
        "Épandage de matière organique si disponible sur les points de semis",
      ]},
      { title: "Semis", timing: "J0", icon: "seed", actions: [
        "Semis en poquets à 2-3 cm de profondeur, écartement ~1 x 0,5 m",
        "4-6 graines par poquet",
      ]},
      { title: "Entretien", timing: "J10 – J45", icon: "care", actions: [
        "Démariage à 2-3 plants par poquet vers J10-12",
        "Sarclage précoce dès J10, car le mil est sensible à la concurrence des adventices en début de cycle",
      ]},
      { title: "Récolte", timing: "J80 – J90", icon: "harvest", actions: [
        "Récolte à maturité des épis (grains durs, épis penchés)",
        "Coupe des épis, séchage au soleil avant battage",
      ]},
      { title: "Après récolte", timing: "Post-récolte", icon: "storage", actions: [
        "Battage manuel, vannage soigné (grain léger et fragile)",
        "Stockage en greniers ventilés, protection contre les charançons",
      ]},
    ],
  },
  "Arachide": {
    growsRainSeason: true,
    growsOffSeason: false,
    soils: ["Sols sableux à sablo-limoneux, meubles et bien drainés"],
    soilNote: "Un sol trop compact ou argileux gêne la formation des gousses en terre — éviter les sols lourds.",
    yieldRange: "650 – 950 kg/ha (systèmes traditionnels pluvial, faible intrant)",
    stages: [
      { title: "Avant semis", timing: "J-20 à J-5", icon: "soil", actions: [
        "Labour léger et émiettement fin du sol (favorise la pénétration des gynophores)",
        "Éviter les parcelles ayant reçu de la fumure fraîche non décomposée",
      ]},
      { title: "Semis", timing: "J0", icon: "seed", actions: [
        "Semis à 3-5 cm de profondeur, écartement ~0,5 x 0,2 m",
        "1-2 graines décortiquées par poquet",
      ]},
      { title: "Entretien", timing: "J15 – J55", icon: "care", actions: [
        "1er sarclage à J15-20, 2e sarclage à J35-40",
        "Buttage léger au stade floraison pour faciliter l'entrée des gynophores dans le sol",
      ]},
      { title: "Récolte", timing: "J90 – J100", icon: "harvest", actions: [
        "Arrachage quand les feuilles jaunissent et les gousses ont une coque marquée",
        "Séchage en petits tas (andains) au champ 5-8 jours",
      ]},
      { title: "Après récolte", timing: "Post-récolte", icon: "storage", actions: [
        "Égoussage puis séchage final des gousses avant stockage",
        "Stockage au sec, ventilé, vigilance contre l'aflatoxine (moisissures) en cas d'humidité",
      ]},
    ],
  },
  "Maïs": {
    growsRainSeason: true,
    growsOffSeason: false,
    soils: ["Sols profonds, riches en matière organique, bien drainés"],
    soilNote: "Le plus exigeant des quatre cultures en fertilité du sol et en eau — à réserver aux zones les mieux arrosées.",
    yieldRange: "950 – 1 300 kg/ha en culture traditionnelle (jusqu'à 3-4,5 t/ha avec intrants et bonne pluviométrie)",
    stages: [
      { title: "Avant semis", timing: "J-30 à J-7", icon: "soil", actions: [
        "Labour profond, apport de fumure organique ou minérale de fond",
        "Choix de variétés adaptées à la durée de la saison des pluies locale",
      ]},
      { title: "Semis", timing: "J0", icon: "seed", actions: [
        "Semis à 4-5 cm de profondeur, écartement ~0,8 x 0,4 m",
        "2 graines par poquet",
      ]},
      { title: "Entretien", timing: "J15 – J60", icon: "care", actions: [
        "Démariage à 1 plant par poquet vers J15",
        "Sarclage-buttage à J20-25, apport d'engrais azoté de couverture si disponible",
        "Surveillance renforcée des ravageurs (chenilles légionnaires)",
      ]},
      { title: "Récolte", timing: "J85 – J95", icon: "harvest", actions: [
        "Récolte quand les spathes jaunissent et les grains sont fermes",
        "Séchage des épis avant égrenage",
      ]},
      { title: "Après récolte", timing: "Post-récolte", icon: "storage", actions: [
        "Égrenage puis séchage final à moins de 13% d'humidité",
        "Stockage en sacs hermétiques ou silos métalliques pour limiter les pertes post-récolte",
      ]},
    ],
  },

  // ---------------------------------------------------------------------
  // Cultures maraîchères de contre-saison — pratiques générales, communes
  // à de nombreux pays d'Afrique de l'Ouest et centrale, d'Afrique du Nord
  // et au-delà. À ajuster selon le climat et les variétés locales.
  // ---------------------------------------------------------------------
  "Tomate": {
    growsRainSeason: false,
    growsOffSeason: true,
    soils: ["Sols limoneux à sablo-limoneux, riches en matière organique, bien drainés"],
    soilNote: "Sensible à l'excès d'eau au niveau des racines — éviter les terrains qui retiennent l'eau. Rotation conseillée (éviter de replanter après aubergine, poivron, piment, pomme de terre).",
    yieldRange: "15 – 35 t/ha en maraîchage irrigué avec bonne conduite (variable selon variété et intrants)",
    stages: [
      { title: "Pépinière", timing: "J-30 à J-25", icon: "seed", actions: [
        "Semis en pépinière ombragée, terreau léger, arrosage quotidien",
        "Repiquage lorsque les plants ont 4-5 vraies feuilles (environ 25-30 jours)",
      ]},
      { title: "Avant repiquage", timing: "J-25 à J-1", icon: "soil", actions: [
        "Labour profond, apport de compost ou fumier bien décomposé",
        "Buttes ou billons pour améliorer le drainage",
      ]},
      { title: "Repiquage", timing: "J0", icon: "seed", actions: [
        "Écartement ~0,5 x 0,6 m, repiquage en fin de journée pour limiter le stress",
        "Arrosage immédiat après repiquage",
      ]},
      { title: "Entretien", timing: "J10 – J60", icon: "care", actions: [
        "Tuteurage ou paillage pour éviter le contact des fruits avec le sol",
        "Irrigation régulière et constante (le stress hydrique irrégulier favorise la pourriture apicale)",
        "Suppression des gourmands sur variétés à tuteurer",
      ]},
      { title: "Récolte", timing: "J60 – J90", icon: "harvest", actions: [
        "Récolte échelonnée dès la coloration des premiers fruits, tous les 3-4 jours",
      ]},
    ],
  },

  "Poivron": {
    growsRainSeason: false,
    growsOffSeason: true,
    soils: ["Sols légers, riches, bien drainés, pH proche de neutre"],
    soilNote: "Exigeant en chaleur mais sensible aux excès d'eau. Éviter les parcelles ayant porté aubergine, tomate ou piment l'année précédente.",
    yieldRange: "10 – 20 t/ha en maraîchage irrigué",
    stages: [
      { title: "Pépinière", timing: "J-45 à J-35", icon: "seed", actions: [
        "Semis en pépinière, germination plus lente que la tomate (10-15 jours)",
      ]},
      { title: "Avant repiquage", timing: "J-35 à J-1", icon: "soil", actions: [
        "Sol bien ameubli, apport de matière organique",
      ]},
      { title: "Repiquage", timing: "J0", icon: "seed", actions: [
        "Écartement ~0,4 x 0,5 m",
      ]},
      { title: "Entretien", timing: "J10 – J70", icon: "care", actions: [
        "Irrigation régulière, sol maintenu frais mais non détrempé",
        "Tuteurage léger conseillé pour les variétés à gros fruits",
      ]},
      { title: "Récolte", timing: "J75 – J100", icon: "harvest", actions: [
        "Récolte au stade vert ou à maturité colorée selon le marché visé, cueillette régulière pour stimuler la production",
      ]},
    ],
  },

  "Chou": {
    growsRainSeason: false,
    growsOffSeason: true,
    soils: ["Sols riches, profonds, à bonne rétention en eau"],
    soilNote: "Grand consommateur d'eau et de matière organique. Sensible à la chaleur excessive — préférer les semis en saison fraîche ou avec ombrage.",
    yieldRange: "20 – 40 t/ha en maraîchage irrigué",
    stages: [
      { title: "Pépinière", timing: "J-30 à J-25", icon: "seed", actions: [
        "Semis en pépinière ombragée",
      ]},
      { title: "Avant repiquage", timing: "J-25 à J-1", icon: "soil", actions: [
        "Labour profond, fumure organique généreuse",
      ]},
      { title: "Repiquage", timing: "J0", icon: "seed", actions: [
        "Écartement ~0,5 x 0,5 m, arrosage immédiat",
      ]},
      { title: "Entretien", timing: "J10 – J50", icon: "care", actions: [
        "Arrosage fréquent et régulier, surtout à la formation de la pomme",
        "Surveillance des chenilles (fausse-arpenteuse, noctuelles)",
      ]},
      { title: "Récolte", timing: "J60 – J75", icon: "harvest", actions: [
        "Récolte quand la pomme est ferme et compacte au toucher",
      ]},
    ],
  },

  "Oignon": {
    growsRainSeason: false,
    growsOffSeason: true,
    soils: ["Sols légers, meubles, bien drainés"],
    soilNote: "Sensible à la concurrence des adventices, surtout en début de cycle (système racinaire superficiel). Rotation conseillée pour limiter les maladies fongiques.",
    yieldRange: "15 – 25 t/ha en maraîchage irrigué",
    stages: [
      { title: "Pépinière", timing: "J-60 à J-50", icon: "seed", actions: [
        "Semis dense en pépinière",
      ]},
      { title: "Avant repiquage", timing: "J-50 à J-1", icon: "soil", actions: [
        "Sol finement travaillé, apport de matière organique bien décomposée",
      ]},
      { title: "Repiquage", timing: "J0", icon: "seed", actions: [
        "Écartement ~0,1 x 0,2 m en lignes",
      ]},
      { title: "Entretien", timing: "J10 – J90", icon: "care", actions: [
        "Désherbage fréquent et minutieux (racines superficielles)",
        "Irrigation régulière, réduite progressivement en fin de cycle pour favoriser le mûrissement du bulbe",
      ]},
      { title: "Récolte", timing: "J110 – J130", icon: "harvest", actions: [
        "Récolte quand les feuilles jaunissent et se couchent, séchage au sol 2-3 jours avant stockage",
      ]},
    ],
  },

  "Aubergine": {
    growsRainSeason: false,
    growsOffSeason: true,
    soils: ["Sols riches, profonds, bien drainés"],
    soilNote: "Bonne tolérance à la chaleur, sensible au froid. Éviter la succession avec tomate, poivron ou piment (maladies communes).",
    yieldRange: "15 – 30 t/ha en maraîchage irrigué",
    stages: [
      { title: "Pépinière", timing: "J-35 à J-25", icon: "seed", actions: [
        "Semis en pépinière ombragée",
      ]},
      { title: "Avant repiquage", timing: "J-25 à J-1", icon: "soil", actions: [
        "Labour profond, fumure organique",
      ]},
      { title: "Repiquage", timing: "J0", icon: "seed", actions: [
        "Écartement ~0,6 x 0,6 m",
      ]},
      { title: "Entretien", timing: "J10 – J70", icon: "care", actions: [
        "Irrigation régulière, paillage conseillé",
        "Surveillance de la punaise et des chenilles foreuses de fruits",
      ]},
      { title: "Récolte", timing: "J70 – J100", icon: "harvest", actions: [
        "Récolte quand le fruit est ferme et brillant, avant que les graines ne durcissent, cueillette régulière",
      ]},
    ],
  },

  "Carotte": {
    growsRainSeason: false,
    growsOffSeason: true,
    soils: ["Sols meubles, profonds, sans cailloux ni croûte, sablo-limoneux"],
    soilNote: "Un sol trop compact ou caillouteux déforme les racines. Éviter la fumure fraîche non décomposée (favorise la fourche des racines).",
    yieldRange: "15 – 30 t/ha en maraîchage irrigué",
    stages: [
      { title: "Avant semis", timing: "J-20 à J-5", icon: "soil", actions: [
        "Labour profond et émiettement fin, sol débarrassé des cailloux et débris",
      ]},
      { title: "Semis", timing: "J0", icon: "seed", actions: [
        "Semis direct en ligne, faible profondeur (~1 cm), pas de repiquage (racine pivotante)",
      ]},
      { title: "Entretien", timing: "J10 – J70", icon: "care", actions: [
        "Éclaircissage à 4-5 cm entre plants vers J20-25",
        "Arrosage léger et régulier, surtout à la levée",
        "Désherbage manuel soigné (sensible à la concurrence)",
      ]},
      { title: "Récolte", timing: "J90 – J110", icon: "harvest", actions: [
        "Récolte quand le collet atteint le diamètre souhaité, arrachage après un arrosage pour faciliter le déterrage",
      ]},
    ],
  },

  "Piment": {
    growsRainSeason: false,
    growsOffSeason: true,
    soils: ["Sols légers, bien drainés, riches en matière organique"],
    soilNote: "Proche de la conduite du poivron mais plus tolérant à la chaleur et à la sécheresse modérée.",
    yieldRange: "5 – 12 t/ha en maraîchage irrigué (frais) — rendement variable selon variété piquante/douce",
    stages: [
      { title: "Pépinière", timing: "J-40 à J-30", icon: "seed", actions: [
        "Semis en pépinière ombragée",
      ]},
      { title: "Avant repiquage", timing: "J-30 à J-1", icon: "soil", actions: [
        "Sol ameubli, apport de compost",
      ]},
      { title: "Repiquage", timing: "J0", icon: "seed", actions: [
        "Écartement ~0,4 x 0,5 m",
      ]},
      { title: "Entretien", timing: "J10 – J70", icon: "care", actions: [
        "Irrigation modérée mais régulière",
        "Récolte régulière stimule la production sur une longue période",
      ]},
      { title: "Récolte", timing: "J70 – J100+", icon: "harvest", actions: [
        "Récolte échelonnée sur plusieurs mois selon variété et entretien",
      ]},
    ],
  },

  "Gombo": {
    growsRainSeason: true,
    growsOffSeason: true,
    soils: ["Sols variés, tolère les sols moyennement pauvres, bien drainés"],
    soilNote: "Culture rustique et résistante à la chaleur — se cultive aussi bien en saison des pluies qu'en début de contre-saison avec un peu d'irrigation d'appoint.",
    yieldRange: "6 – 12 t/ha (fruits frais), culture traditionnelle à intrants modérés",
    stages: [
      { title: "Avant semis", timing: "J-15 à J-5", icon: "soil", actions: [
        "Labour léger, apport de fumure organique si disponible",
      ]},
      { title: "Semis", timing: "J0", icon: "seed", actions: [
        "Semis direct en poquets, écartement ~0,6 x 0,4 m, 2-3 graines par poquet",
      ]},
      { title: "Entretien", timing: "J10 – J50", icon: "care", actions: [
        "Démariage à 1-2 plants par poquet",
        "Sarclage régulier, arrosage d'appoint si conduite en contre-saison",
      ]},
      { title: "Récolte", timing: "J55 – J55+", icon: "harvest", actions: [
        "Récolte des fruits jeunes et tendres tous les 2-3 jours dès J55 — une récolte tardive donne des fruits fibreux",
      ]},
    ],
  },
};


export const MONTH_NAMES = ["Jan","Fév","Mar","Avr","Mai","Juin","Juil","Août","Sep","Oct","Nov","Déc"];

