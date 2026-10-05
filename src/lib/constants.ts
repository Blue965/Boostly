export const PRESET_THEMES = [
  { id: 'clean', name: 'Clean', bg: '#0f172a', accent: '#2563eb' },
  { id: 'midnight', name: 'Midnight', bg: '#000000', accent: '#3b82f6' },
  { id: 'ocean', name: 'Ocean', bg: '#082f49', accent: '#06b6d4' },
  { id: 'dark', name: 'Dark Slate', bg: '#18181b', accent: '#a855f7' },
  { id: 'neon', name: 'Neon Glow', bg: '#050505', accent: '#22c55e' }
];

export const PROFILE_CARD_THEMES = [
  { id: 'glass', name: 'Verre', description: 'Verre dépoli et lumineux' },
  { id: 'futuristic', name: 'Futuriste', description: 'Grille tech bleu électrique' },
  { id: 'glitch', name: 'Glitch', description: 'Artefacts néon rose et cyan' },
  { id: 'neon', name: 'Néon', description: 'Contour lumineux violet' },
  { id: 'aurora', name: 'Aurore', description: 'Dégradé boréal' },
  { id: 'cyberpunk', name: 'Cyberpunk', description: 'Jaune acide et magenta' },
  { id: 'holographic', name: 'Holographique', description: 'Reflets irisés' },
  { id: 'minimal', name: 'Minimal', description: 'Sobre et élégant' },
  { id: 'cosmic', name: 'Cosmique', description: 'Violet profond et étoiles' },
  { id: 'terminal', name: 'Terminal', description: 'Console rétro verte' },
  { id: 'sunset', name: 'Sunset', description: 'Dégradé coucher de soleil' },
  { id: 'crystal', name: 'Cristal', description: 'Cristal bleu translucide' },
] as const;

export const PAGE_TEMPLATES = [
  { id: 'creator', name: 'Créateur', description: 'Un profil polyvalent pour partager tes réseaux et tes projets.', theme: 'clean', card: 'glass', background: '#0f172a', accent: '#3b82f6', button: 'rounded', font: 'Inter' },
  { id: 'artist', name: 'Artiste', description: 'Un look galerie avec un violet expressif.', theme: 'dark', card: 'holographic', background: '#171329', accent: '#a855f7', button: 'rounded', font: 'Georgia, serif' },
  { id: 'musician', name: 'Musicien', description: 'Une ambiance scène lumineuse pour tes sorties et écoutes.', theme: 'neon', card: 'neon', background: '#10091f', accent: '#d946ef', button: 'pill', font: 'Inter' },
  { id: 'gamer', name: 'Gamer', description: 'Un style cyber futuriste avec des accents électriques.', theme: 'ocean', card: 'futuristic', background: '#071526', accent: '#06b6d4', button: 'square', font: 'monospace' },
  { id: 'business', name: 'Business', description: 'Une présentation professionnelle, claire et contrastée.', theme: 'clean', card: 'minimal', background: '#111827', accent: '#0f766e', button: 'rounded', font: 'Arial, sans-serif' },
  { id: 'streamer', name: 'Streamer', description: 'Des couleurs vives et une carte qui attire le regard.', theme: 'neon', card: 'glitch', background: '#13091c', accent: '#ec4899', button: 'pill', font: 'Inter' },
  { id: 'photographer', name: 'Photographe', description: 'Une vitrine sobre pour laisser tes images respirer.', theme: 'ocean', card: 'crystal', background: '#081923', accent: '#0891b2', button: 'outline', font: 'Georgia, serif' },
  { id: 'writer', name: 'Auteur', description: 'Une atmosphère éditoriale et chaleureuse.', theme: 'dark', card: 'sunset', background: '#21151b', accent: '#c2410c', button: 'rounded', font: 'Georgia, serif' },
] as const;