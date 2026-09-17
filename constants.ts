
import { 
  Stethoscope, 
  Baby, 
  Syringe, 
  CalendarHeart, 
  Pill, 
  Sparkles,
  Ambulance,
  Building2,
  Users,
  Microscope,
  Activity
} from 'lucide-react';

export const NAV_LINKS = [
  { name: 'Accueil', href: '/' },
  { name: 'Services', href: '/services' },
  { name: 'Rendez-vous', href: '/appointment' },
  { name: 'À Propos', href: '/about' },
  { name: 'Conseils', href: '/audios' },
  { name: 'Galerie & Vidéos', href: '/gallery' },
  { name: 'Actualités', href: '/blog' },
  { name: 'Équipe', href: '/team' },
  { name: 'Contact', href: '/contact' },
];

// --- GESTION DES IMAGES DU SITE (EN DUR) ---
// Instructions : Remplacez les liens ci-dessous par les URL de VOS images.
// Vous pouvez utiliser des liens d'hébergement d'images ou des liens relatifs si vous ajoutez les fichiers au projet.
export const SITE_IMAGES = {
  // Grande image de la page d'accueil
  hero: "https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?auto=format&fit=crop&q=80&w=2000",
  
  // Image de la page "À propos"
  about: "https://images.unsplash.com/photo-1516574187841-693083f69802?auto=format&fit=crop&q=80&w=1000",
  
  // Image de la carte (Google Maps static ou photo du quartier)
  contactMap: "https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?auto=format&fit=crop&q=80&w=1000",
  
  // Image par défaut si une image ne charge pas
  placeholder: "https://via.placeholder.com/800x600?text=Image+Non+Disponible",

  // Avatar par défaut pour l'équipe
  team_placeholder: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?auto=format&fit=crop&q=80&w=500"
};

export const SERVICES = [
  {
    title: 'Dispensaire',
    description: 'Soins de santé primaires, consultations de médecine générale et traitements ambulatoires pour toute la famille.',
    icon: Stethoscope,
    color: 'bg-blue-100 text-blue-600',
    image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=800',
  },
  {
    title: 'Maternité',
    description: 'Suivi prénatal attentif, accouchements assistés par sages-femmes et soins post-nataux pour la mère et le nouveau-né.',
    icon: Baby,
    color: 'bg-pink-100 text-pink-600',
    image: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&q=80&w=800',
  },
  {
    title: 'Laboratoire',
    description: 'Analyses biomédicales (hématologie, paludisme, biochimie, parasitologie) pour un diagnostic rapide et fiable.',
    icon: Microscope,
    color: 'bg-red-100 text-red-600',
    image: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&q=80&w=800',
  },
  {
    title: 'Échographie',
    description: 'Imagerie médicale par ultrasons pour le suivi obstétrical régulier et les explorations pelviennes/abdominales.',
    icon: Activity,
    color: 'bg-indigo-100 text-indigo-600',
    image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=800',
  },
  {
    title: 'Vaccination',
    description: 'Programme Élargi de Vaccination (PEV) pour les nourrissons et enfants, et vaccinations d\'adulte selon les protocoles.',
    icon: Syringe,
    color: 'bg-green-100 text-green-600',
    image: 'https://images.unsplash.com/photo-1632053002927-4a0b6ffb4588?auto=format&fit=crop&q=80&w=800',
  },
  {
    title: 'Planification Familiale',
    description: 'Consultations confidentielles, conseils et accès aux méthodes contraceptives adaptées aux besoins du couple.',
    icon: CalendarHeart,
    color: 'bg-purple-100 text-purple-600',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=800',
  },
  {
    title: 'Pharmacie / Dépôt de Répartition',
    description: 'Disponibilité des médicaments essentiels génériques de qualité et conseils sur les posologies.',
    icon: Pill,
    color: 'bg-yellow-100 text-yellow-600',
    image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&q=80&w=800',
  },
  {
    title: 'Hygiène & Assainissement',
    description: 'Sensibilisation communautaire, prévention des maladies hydriques et maintien d\'un cadre de soins rigoureusement désinfecté.',
    icon: Sparkles,
    color: 'bg-cyan-100 text-cyan-600',
    image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=800',
  },
];

export const FACILITIES = [
  {
    title: 'Transferts d\'Urgence',
    description: 'Dispositif de transfert et coordination d\'évacuation vers les hôpitaux de référence en cas de complication.',
    icon: Ambulance,
  },
  {
    title: 'Salle de Réunion & COGES',
    description: 'Espace de concertation communautaire, gouvernance sanitaire et sessions de formation continue du personnel.',
    icon: Users,
  },
  {
    title: 'Bureau Médical & Consultations',
    description: 'Espace de confidentialité pour l\'examen clinique, l\'écoute bienveillante et l\'orientation médicale.',
    icon: Building2,
  },
];

export const TEAM_STRUCTURE = [
  {
    category: "Administration & Gestion",
    members: [
      { role: "Médecin Chef", id: "medecin_chef", image: SITE_IMAGES.team_placeholder },
      { role: "Comptable", id: "comptable", image: SITE_IMAGES.team_placeholder },
      { role: "Vérificateur", id: "verificateur", image: SITE_IMAGES.team_placeholder },
      { role: "Délégué du Personnel", id: "delegue", image: SITE_IMAGES.team_placeholder }
    ]
  },
  {
    category: "Responsables de Services",
    members: [
      { role: "Responsable Dispensaire", id: "resp_dispensaire", image: SITE_IMAGES.team_placeholder },
      { role: "Responsable Maternité", id: "resp_maternite", image: SITE_IMAGES.team_placeholder },
      { role: "Responsable Laboratoire", id: "resp_labo", image: SITE_IMAGES.team_placeholder },
      { role: "Responsable Echographie", id: "resp_echo", image: SITE_IMAGES.team_placeholder },
      { role: "Responsable P.F.", id: "resp_pf", image: SITE_IMAGES.team_placeholder },
      { role: "Responsable Vaccination", id: "resp_vaccination", image: SITE_IMAGES.team_placeholder },
      { role: "Responsable Hygiène", id: "resp_hygiene", image: SITE_IMAGES.team_placeholder }
    ]
  },
  {
    category: "Agents de Santé Communautaires Qualifiés (ASCQ)",
    members: [
      { role: "Agent ASCQ 1", id: "ascq_1", image: SITE_IMAGES.team_placeholder },
      { role: "Agent ASCQ 2", id: "ascq_2", image: SITE_IMAGES.team_placeholder }
    ]
  },
  {
    category: "COGES (Comité de Gestion)",
    members: [
      { role: "Président du COGES", id: "president_coges", image: SITE_IMAGES.team_placeholder },
      { role: "Secrétaire Général", id: "sg_coges", image: SITE_IMAGES.team_placeholder }
    ]
  }
];

export const CONTACT_INFO = {
  address: "99VQ+2W5, Rue 2723, Cotonou, Bénin",
  quartier: "Zogbo",
  city: "Cotonou",
  country: "Bénin",
  phone: "+229 01 98 98 86 18",
  phoneRaw: "+2290198988618",
  email: "contact@cszogbo.bj",
  emailNote: "[À confirmer par la direction]",
  emergencyNote: "Permanence des soins d'urgence assurée 24h/24 et 7j/7",
  consultationHours: "Lundi au Vendredi : 08h00 - 18h00",
  founded: 1990
};

// NOTE: Images d'illustration (Unsplash)
// IMPORTANT : Remplacez les liens 'url' par VOS propres liens d'images.
export const GALLERY_IMAGES = [
  {
    id: 'gallery_facade',
    url: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&q=80&w=800',
    caption: 'Façade Principale',
    category: 'Locaux'
  },
  {
    id: 'gallery_dispensaire',
    url: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=800',
    caption: 'Dispensaire',
    category: 'Équipe'
  },
  {
    id: 'gallery_maternite',
    url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800',
    caption: 'Maternité',
    category: 'Installations'
  },
  {
    id: 'gallery_vaccination',
    url: 'https://images.unsplash.com/photo-1632053001308-3075c31758c5?auto=format&fit=crop&q=80&w=800',
    caption: 'Service de Vaccination',
    category: 'Équipe'
  },
  {
    id: 'gallery_laboratoire',
    url: 'https://images.unsplash.com/photo-1585435557343-3b092031a831?auto=format&fit=crop&q=80&w=800',
    caption: 'Laboratoire',
    category: 'Locaux'
  },
  {
    id: 'gallery_ambulance',
    url: 'https://images.unsplash.com/photo-1552063806-a9792193b2a3?auto=format&fit=crop&q=80&w=800',
    caption: 'Notre Ambulance',
    category: 'Installations'
  }
];

export const BLOG_POSTS = [
  {
    id: 1,
    title: "Lancement de la campagne de vaccination contre la polio",
    excerpt: "Le centre de santé de Zogbo participe activement à la nouvelle campagne nationale de vaccination pour les enfants de 0 à 5 ans.",
    date: "15 Oct 2023",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=800",
    category: "Vaccination"
  },
  {
    id: 2,
    title: "Les bienfaits de l'allaitement maternel",
    excerpt: "Notre responsable maternité partage des conseils essentiels pour les nouvelles mamans sur l'importance de l'allaitement exclusif.",
    date: "02 Nov 2023",
    image: "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&q=80&w=800",
    category: "Maternité"
  },
  {
    id: 3,
    title: "Journée portes ouvertes : Hygiène et Santé",
    excerpt: "Retour en images sur notre journée de sensibilisation aux bonnes pratiques d'hygiène organisée dans le quartier Zogbo.",
    date: "20 Nov 2023",
    image: "https://images.unsplash.com/photo-1584634731339-252c581abfc5?auto=format&fit=crop&q=80&w=800",
    category: "Hygiène"
  }
];
