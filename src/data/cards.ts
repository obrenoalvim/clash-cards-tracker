export type CardCategory = "elixir" | "dark-elixir" | "builder-base" | "super-troop";

export interface Card {
  id: string;
  name: string;
  category: CardCategory;
  rarity: "common" | "rare" | "epic" | "legendary";
  description: string;
  descriptionPt: string;
  emoji: string;
  wikiUrl: string;
  imageUrl: string;
}

const WIKI_BASE = "https://clashofclans.fandom.com/wiki";

function wiki(page: string): string {
  return `${WIKI_BASE}/${page.replace(/ /g, "_")}`;
}

export const CATEGORY_META: Record<
  CardCategory,
  {
    label: string;
    labelPt: string;
    short: string;
    shortPt: string;
    color: string;
    glow: string;
    ring: string;
    bg: string;
    text: string;
    icon: string;
  }
> = {
  elixir: {
    label: "Elixir Cards",
    labelPt: "Cartas de Elixir",
    short: "Elixir",
    shortPt: "Elixir",
    color: "#E0287E",
    glow: "rgba(224, 40, 126, 0.45)",
    ring: "ring-pink-500/40",
    bg: "from-pink-500/20 to-pink-600/5",
    text: "text-pink-400",
    icon: "💧",
  },
  "dark-elixir": {
    label: "Dark Elixir Cards",
    labelPt: "Cartas de Elixir Negro",
    short: "Dark Elixir",
    shortPt: "Elixir Negro",
    color: "#8B2BE2",
    glow: "rgba(139, 43, 226, 0.45)",
    ring: "ring-purple-500/40",
    bg: "from-purple-600/20 to-purple-700/5",
    text: "text-purple-400",
    icon: "🌑",
  },
  "builder-base": {
    label: "Builder Base Cards",
    labelPt: "Cartas da Base do Construtor",
    short: "Builder Base",
    shortPt: "Base do Construtor",
    color: "#F5A623",
    glow: "rgba(245, 166, 35, 0.45)",
    ring: "ring-amber-500/40",
    bg: "from-amber-500/20 to-orange-600/5",
    text: "text-amber-400",
    icon: "🔨",
  },
  "super-troop": {
    label: "Super Troop Cards",
    labelPt: "Cartas de Super Tropa",
    short: "Super Troop",
    shortPt: "Super Tropa",
    color: "#00C2FF",
    glow: "rgba(0, 194, 255, 0.45)",
    ring: "ring-cyan-500/40",
    bg: "from-cyan-500/20 to-blue-600/5",
    text: "text-cyan-400",
    icon: "⚡",
  },
};

export const RARITY_META: Record<
  Card["rarity"],
  { label: string; labelPt: string; color: string; border: string; gem: string }
> = {
  common: { label: "Common", labelPt: "Comum", color: "#B0B7C3", border: "border-slate-400/50", gem: "🪙" },
  rare: { label: "Rare", labelPt: "Raro", color: "#3B82F6", border: "border-blue-400/60", gem: "🔷" },
  epic: { label: "Epic", labelPt: "Épico", color: "#A855F7", border: "border-fuchsia-400/60", gem: "💜" },
  legendary: { label: "Legendary", labelPt: "Lendário", color: "#F59E0B", border: "border-amber-400/70", gem: "👑" },
};

export const CARDS: Card[] = [
  // --- ELIXIR CARDS (19) ---
  { id: "barbarian", name: "Barbarian", category: "elixir", rarity: "common", description: "A fearless melee fighter with a mighty sword and an even mightier mustache.", descriptionPt: "Um guerreiro corpo a corpo destemido, com uma espada poderosa e um bigode ainda mais poderoso.", emoji: "🗡️", wikiUrl: wiki("Barbarian"), imageUrl: "https://static.wikia.nocookie.net/clashofclans/images/8/87/Avatar_Barbarian.png/revision/latest?cb=20170525070200" },
  { id: "archer", name: "Archer", category: "elixir", rarity: "common", description: "A ranged attacker who fires arrows with deadly precision from afar.", descriptionPt: "Atacante à distância que dispara flechas com precisão mortal.", emoji: "🏹", wikiUrl: wiki("Archer"), imageUrl: "https://static.wikia.nocookie.net/clashofclans/images/6/68/Avatar_Archer.png/revision/latest?cb=20200913014217" },
  { id: "giant", name: "Giant", category: "elixir", rarity: "rare", description: "A massive warrior who only cares about one thing: destroying defenses.", descriptionPt: "Guerreiro gigante que só liga pra uma coisa: destruir defesas.", emoji: "🗿", wikiUrl: wiki("Giant"), imageUrl: "https://static.wikia.nocookie.net/clashofclans/images/7/7d/Avatar_Giant.png/revision/latest?cb=20170525070402" },
  { id: "goblin", name: "Goblin", category: "elixir", rarity: "common", description: "Fast, greedy, and obsessed with resources. Will target loot above all else.", descriptionPt: "Rápido, ganancioso e obcecado por recursos. Vai atrás do saque acima de tudo.", emoji: "👺", wikiUrl: wiki("Goblin"), imageUrl: "https://static.wikia.nocookie.net/clashofclans/images/6/68/Avatar_Goblin.png/revision/latest?cb=20200913195137" },
  { id: "wall-breaker", name: "Wall Breaker", category: "elixir", rarity: "common", description: "A skeleton with a bomb, dedicated to blowing up walls and nothing else.", descriptionPt: "Um esqueleto com uma bomba, dedicado a explodir muralhas e nada mais.", emoji: "💣", wikiUrl: wiki("Wall Breaker"), imageUrl: "https://static.wikia.nocookie.net/clashofclans/images/3/36/Avatar_Wall_Breaker.png/revision/latest?cb=20200913015114" },
  { id: "balloon", name: "Balloon", category: "elixir", rarity: "rare", description: "A floating bomb delivery system that targets only buildings from the sky.", descriptionPt: "Um sistema de entrega de bombas flutuante que ataca só construções, direto do céu.", emoji: "🎈", wikiUrl: wiki("Balloon"), imageUrl: "https://static.wikia.nocookie.net/clashofclans/images/8/80/Avatar_Balloon.png/revision/latest?cb=20170525070200" },
  { id: "wizard", name: "Wizard", category: "elixir", rarity: "rare", description: "A master of fireballs who deals devastating splash damage from range.", descriptionPt: "Mestre das bolas de fogo, causa dano em área devastador à distância.", emoji: "🔥", wikiUrl: wiki("Wizard"), imageUrl: "https://static.wikia.nocookie.net/clashofclans/images/9/97/Avatar_Wizard.png/revision/latest?cb=20200913195243" },
  { id: "healer", name: "Healer", category: "elixir", rarity: "rare", description: "A gentle angel who keeps your troops alive with her healing touch.", descriptionPt: "Uma anja gentil que mantém suas tropas vivas com seu toque curativo.", emoji: "✨", wikiUrl: wiki("Healer"), imageUrl: "https://static.wikia.nocookie.net/clashofclans/images/9/9c/Avatar_Healer.png/revision/latest?cb=20170525070403" },
  { id: "dragon", name: "Dragon", category: "elixir", rarity: "epic", description: "A flying beast that rains fire upon ground and air targets alike.", descriptionPt: "Uma besta voadora que chove fogo sobre alvos terrestres e aéreos.", emoji: "🐉", wikiUrl: wiki("Dragon"), imageUrl: "https://static.wikia.nocookie.net/clashofclans/images/9/9c/Avatar_Dragon.png/revision/latest?cb=20200913195335" },
  { id: "pekka", name: "P.E.K.K.A", category: "elixir", rarity: "epic", description: "A heavily armored mechanical warrior with devastating melee power.", descriptionPt: "Guerreira mecânica pesadamente blindada, com poder de combate corpo a corpo devastador.", emoji: "🤖", wikiUrl: wiki("P.E.K.K.A"), imageUrl: "https://static.wikia.nocookie.net/clashofclans/images/1/1a/Avatar_P.E.K.K.A.png/revision/latest?cb=20170525070542" },
  { id: "baby-dragon", name: "Baby Dragon", category: "elixir", rarity: "rare", description: "A young dragon that enforces its territory with fiery splash attacks.", descriptionPt: "Um dragão jovem que defende seu território com ataques de fogo em área.", emoji: "🐲", wikiUrl: wiki("Baby Dragon"), imageUrl: "https://static.wikia.nocookie.net/clashofclans/images/7/7a/Avatar_Baby_Dragon.png/revision/latest?cb=20200913014509" },
  { id: "miner", name: "Miner", category: "elixir", rarity: "epic", description: "A digger who tunnels underground to appear anywhere on the battlefield.", descriptionPt: "Um escavador que cava túneis pra aparecer em qualquer lugar do campo de batalha.", emoji: "⛏️", wikiUrl: wiki("Miner"), imageUrl: "https://static.wikia.nocookie.net/clashofclans/images/7/7a/Avatar_Miner.png/revision/latest?cb=20170525070405" },
  { id: "electro-dragon", name: "Electro Dragon", category: "elixir", rarity: "epic", description: "A dragon that chains lightning between multiple targets with each strike.", descriptionPt: "Um dragão que encadeia raios entre vários alvos a cada ataque.", emoji: "⚡", wikiUrl: wiki("Electro Dragon"), imageUrl: "https://static.wikia.nocookie.net/clashofclans/images/9/97/Avatar_Electro_Dragon.png/revision/latest?cb=20200910094107" },
  { id: "yeti", name: "Yeti", category: "elixir", rarity: "epic", description: "A frosty giant that deploys Yetimites when damaged, overwhelming defenses.", descriptionPt: "Um gigante gélido que libera Yetimites ao ser danificado, sobrecarregando as defesas.", emoji: "🦍", wikiUrl: wiki("Yeti"), imageUrl: "https://static.wikia.nocookie.net/clashofclans/images/b/be/Avatar_Yeti.png/revision/latest?cb=20200913074419" },
  { id: "dragon-rider", name: "Dragon Rider", category: "elixir", rarity: "legendary", description: "A fearless rider atop a dragon, targeting defenses with relentless fury.", descriptionPt: "Uma cavaleira destemida montada em um dragão, atacando defesas com fúria implacável.", emoji: "🏇", wikiUrl: wiki("Dragon Rider"), imageUrl: "https://static.wikia.nocookie.net/clashofclans/images/5/50/Avatar_Dragon_Rider.png/revision/latest?cb=20210618061045" },
  { id: "electro-titan", name: "Electro Titan", category: "elixir", rarity: "legendary", description: "A towering titan crackling with energy, damaging all who dare approach.", descriptionPt: "Um titã gigantesco crepitando de energia, que dana qualquer um que ouse se aproximar.", emoji: "⚡", wikiUrl: wiki("Electro Titan"), imageUrl: "https://static.wikia.nocookie.net/clashofclans/images/6/67/Avatar_Electro_Titan.png/revision/latest?cb=20221010075230" },
  { id: "root-rider", name: "Root Rider", category: "elixir", rarity: "legendary", description: "A mystical warrior who roots through walls to reach her targets directly.", descriptionPt: "Uma guerreira mística que atravessa muralhas com raízes pra chegar direto aos alvos.", emoji: "🌳", wikiUrl: wiki("Root Rider"), imageUrl: "https://static.wikia.nocookie.net/clashofclans/images/0/0b/Avatar_Root_Rider.png/revision/latest?cb=20231213214829" },
  { id: "thrower", name: "Thrower", category: "elixir", rarity: "epic", description: "A ranged attacker who hurls boulders at defenses with immense force.", descriptionPt: "Atacante à distância que arremessa pedregulhos contra defesas com força imensa.", emoji: "🪨", wikiUrl: wiki("Thrower"), imageUrl: "https://static.wikia.nocookie.net/clashofclans/images/d/da/Avatar_Thrower.png/revision/latest?cb=20241123132731" },
  { id: "meteor-golem", name: "Meteor Golem", category: "elixir", rarity: "legendary", description: "A colossal boulder beast that rains meteors from above and splits into smaller golems when destroyed.", descriptionPt: "Uma besta colossal de pedra que chove meteoros do céu e se divide em golens menores ao ser destruída.", emoji: "☄️", wikiUrl: wiki("Meteor Golem"), imageUrl: "https://static.wikia.nocookie.net/clashofclans/images/2/21/Meteor_Golem_info.png/revision/latest?cb=20251116093652" },

  // --- DARK ELIXIR CARDS (13) ---
  { id: "minion", name: "Minion", category: "dark-elixir", rarity: "common", description: "A small flying imp that throws dark projectiles from the safety of the sky.", descriptionPt: "Um pequeno demônio voador que arremessa projéteis sombrios com segurança, lá do alto.", emoji: "👿", wikiUrl: wiki("Minion"), imageUrl: "https://static.wikia.nocookie.net/clashofclans/images/3/3b/Avatar_Minion.png/revision/latest?cb=20170525070405" },
  { id: "hog-rider", name: "Hog Rider", category: "dark-elixir", rarity: "rare", description: "A man who rides a hog and leaps over walls to destroy defenses. HOG RIDER!", descriptionPt: "Um homem que monta um javali e pula muralhas pra destruir defesas. HOG RIDER!", emoji: "🐗", wikiUrl: wiki("Hog Rider"), imageUrl: "https://static.wikia.nocookie.net/clashofclans/images/e/e9/Avatar_Hog_Rider.png/revision/latest?cb=20200913195505" },
  { id: "valkyrie", name: "Valkyrie", category: "dark-elixir", rarity: "rare", description: "A fierce warrior who spins her axe, dealing splash damage to all around her.", descriptionPt: "Uma guerreira feroz que gira seu machado, causando dano em área ao redor dela.", emoji: "🪓", wikiUrl: wiki("Valkyrie"), imageUrl: "https://static.wikia.nocookie.net/clashofclans/images/3/31/Avatar_Valkyrie.png/revision/latest?cb=20170525070543" },
  { id: "golem-de", name: "Golem", category: "dark-elixir", rarity: "epic", description: "A rock behemoth that splits into two Golemites upon death, soaking up damage.", descriptionPt: "Um behemoth de pedra que se divide em dois Golemitos ao morrer, absorvendo muito dano.", emoji: "🪨", wikiUrl: wiki("Golem"), imageUrl: "https://static.wikia.nocookie.net/clashofclans/images/4/44/Avatar_Golem.png/revision/latest?cb=20170525070403" },
  { id: "witch", name: "Witch", category: "dark-elixir", rarity: "epic", description: "A sorceress who raises skeletons from the dead to fight alongside her.", descriptionPt: "Uma feiticeira que ressuscita esqueletos pra lutar ao seu lado.", emoji: "🧙‍♀️", wikiUrl: wiki("Witch"), imageUrl: "https://static.wikia.nocookie.net/clashofclans/images/9/90/Avatar_Witch.png/revision/latest?cb=20170525070544" },
  { id: "lava-hound", name: "Lava Hound", category: "dark-elixir", rarity: "epic", description: "A fiery flying beast that bursts into Lava Pups when destroyed.", descriptionPt: "Uma besta voadora flamejante que explode em Filhotes de Lava ao ser destruída.", emoji: "🌋", wikiUrl: wiki("Lava Hound"), imageUrl: "https://static.wikia.nocookie.net/clashofclans/images/1/1b/Avatar_Lava_Hound.png/revision/latest?cb=20200913195616" },
  { id: "bowler", name: "Bowler", category: "dark-elixir", rarity: "rare", description: "A big guy who hurls boulders that bounce through multiple targets.", descriptionPt: "Um sujeito enorme que arremessa pedregulhos que quicam por vários alvos.", emoji: "🎳", wikiUrl: wiki("Bowler"), imageUrl: "https://static.wikia.nocookie.net/clashofclans/images/2/24/Avatar_Bowler.png/revision/latest?cb=20170525070202" },
  { id: "ice-golem", name: "Ice Golem", category: "dark-elixir", rarity: "rare", description: "A frosty tank that freezes nearby enemies when it shatters.", descriptionPt: "Um tanque gélido que congela inimigos próximos ao se despedaçar.", emoji: "🧊", wikiUrl: wiki("Ice Golem"), imageUrl: "https://static.wikia.nocookie.net/clashofclans/images/7/79/Avatar_Ice_Golem.png/revision/latest?cb=20200913014329" },
  { id: "headhunter", name: "Headhunter", category: "dark-elixir", rarity: "epic", description: "A deadly assassin who throws poison blades and targets heroes first.", descriptionPt: "Uma assassina mortal que arremessa lâminas envenenadas e ataca heróis primeiro.", emoji: "🎯", wikiUrl: wiki("Headhunter"), imageUrl: "https://static.wikia.nocookie.net/clashofclans/images/8/80/Avatar_Headhunter.png/revision/latest?cb=20200913074511" },
  { id: "apprentice-warden", name: "Apprentice Warden", category: "dark-elixir", rarity: "epic", description: "A young warden-in-training who grants a life aura to nearby troops.", descriptionPt: "Um jovem guardião em treinamento que concede uma aura de vida às tropas próximas.", emoji: "🧝", wikiUrl: wiki("Apprentice Warden"), imageUrl: "https://static.wikia.nocookie.net/clashofclans/images/8/8b/Avatar_Apprentice_Warden.png/revision/latest?cb=20230613002759" },
  { id: "druid", name: "Druid", category: "dark-elixir", rarity: "epic", description: "A nature wielder who heals allies and transforms into a bear in battle.", descriptionPt: "Um mestre da natureza que cura aliados e se transforma em urso na batalha.", emoji: "🐻", wikiUrl: wiki("Druid"), imageUrl: "https://static.wikia.nocookie.net/clashofclans/images/4/43/Avatar_Druid.png/revision/latest?cb=20241003084537" },
  { id: "furnace", name: "Furnace", category: "dark-elixir", rarity: "rare", description: "A living forge that spews fire spirits at any enemy foolish enough to approach.", descriptionPt: "Uma forja viva que expele espíritos de fogo contra quem tiver a ousadia de se aproximar.", emoji: "🔥", wikiUrl: wiki("Furnace"), imageUrl: "https://static.wikia.nocookie.net/clashofclans/images/e/e0/Avatar_Furnace.png/revision/latest?cb=20251117221817" },
  { id: "ruin-witch", name: "Ruin Witch", category: "dark-elixir", rarity: "legendary", description: "An ancient witch who commands the ruins themselves to crush her enemies.", descriptionPt: "Uma bruxa ancestral que comanda as próprias ruínas pra esmagar seus inimigos.", emoji: "💀", wikiUrl: wiki("Ruin Witch"), imageUrl: "https://static.wikia.nocookie.net/clashofclans/images/2/23/Ruin_Witch_info.png/revision/latest?cb=20260614153137" },

  // --- BUILDER BASE CARDS (11) ---
  { id: "raged-barbarian", name: "Raged Barbarian", category: "builder-base", rarity: "common", description: "A barbarian fueled by rage, hitting harder and faster than his normal cousin.", descriptionPt: "Um bárbaro movido pela fúria, batendo mais forte e mais rápido que seu primo normal.", emoji: "😠", wikiUrl: wiki("Raged Barbarian"), imageUrl: "https://static.wikia.nocookie.net/clashofclans/images/2/27/Raged_Barbarian_info.png/revision/latest?cb=20170927155033" },
  { id: "sneaky-archer", name: "Sneaky Archer", category: "builder-base", rarity: "common", description: "An archer cloaked in stealth, perfect for picking off isolated defenses.", descriptionPt: "Uma arqueira camuflada, perfeita pra eliminar defesas isoladas.", emoji: "🥷", wikiUrl: wiki("Sneaky Archer"), imageUrl: "https://static.wikia.nocookie.net/clashofclans/images/c/ca/Avatar_Sneaky_Archers.png/revision/latest?cb=20220811090948" },
  { id: "boxer-giant", name: "Boxer Giant", category: "builder-base", rarity: "common", description: "A giant with boxing gloves who punches through walls with ease.", descriptionPt: "Um gigante com luvas de boxe que soca muralhas com facilidade.", emoji: "🥊", wikiUrl: wiki("Boxer Giant"), imageUrl: "https://static.wikia.nocookie.net/clashofclans/images/1/17/Boxer_Giant_info.png/revision/latest?cb=20170613191751" },
  { id: "beta-minion", name: "Beta Minion", category: "builder-base", rarity: "common", description: "An evolved minion that fires a powerful long-range first shot.", descriptionPt: "Um minion evoluído que dispara um primeiro tiro poderoso de longo alcance.", emoji: "🦇", wikiUrl: wiki("Beta Minion"), imageUrl: "https://static.wikia.nocookie.net/clashofclans/images/6/63/Beta_Minion_info.png/revision/latest?cb=20170927155210" },
  { id: "bomber", name: "Bomber", category: "builder-base", rarity: "common", description: "A skeleton who tosses bombs at ground targets, dealing splash damage.", descriptionPt: "Um esqueleto que arremessa bombas em alvos terrestres, causando dano em área.", emoji: "💥", wikiUrl: wiki("Bomber"), imageUrl: "https://static.wikia.nocookie.net/clashofclans/images/f/fc/Avatar_Bomber.png/revision/latest?cb=20170525070201" },
  { id: "baby-dragon-bb", name: "Baby Dragon", category: "builder-base", rarity: "rare", description: "A pint-sized dragon exclusive to the Builder Base, whose fire breath grows fiercer the longer it survives in battle.", descriptionPt: "Um dragãozinho exclusivo da Base do Construtor, cujo sopro de fogo fica mais forte quanto mais tempo sobrevive na batalha.", emoji: "🐲", wikiUrl: wiki("Baby Dragon/Builder Base"), imageUrl: "https://static.wikia.nocookie.net/clashofclans/images/4/44/Baby_Dragon_info.png/revision/latest?cb=20260405214825" },
  { id: "cannon-cart", name: "Cannon Cart", category: "builder-base", rarity: "rare", description: "A mobile cannon that rolls into position and unleashes firepower.", descriptionPt: "Um canhão móvel que se posiciona e libera fogo pesado.", emoji: "🔫", wikiUrl: wiki("Cannon Cart"), imageUrl: "https://static.wikia.nocookie.net/clashofclans/images/4/4c/Cannon_Cart_info.png/revision/latest?cb=20230518100227" },
  { id: "night-witch", name: "Night Witch", category: "builder-base", rarity: "epic", description: "A witch who summons endless bats to swarm her enemies, growing more dangerous the longer she fights.", descriptionPt: "Uma bruxa que invoca morcegos sem parar pra cercar os inimigos, ficando mais perigosa quanto mais tempo luta.", emoji: "🦇", wikiUrl: wiki("Night Witch"), imageUrl: "https://static.wikia.nocookie.net/clashofclans/images/1/10/Night_Witch_info.png/revision/latest?cb=20170927155716" },
  { id: "drop-ship", name: "Drop Ship", category: "builder-base", rarity: "rare", description: "A flying vessel that drops skeletons onto defenses below.", descriptionPt: "Uma nave voadora que solta esqueletos sobre as defesas lá embaixo.", emoji: "🛩️", wikiUrl: wiki("Drop Ship"), imageUrl: "https://static.wikia.nocookie.net/clashofclans/images/1/17/Drop_Ship_info.png/revision/latest?cb=20260122220415" },
  { id: "power-pekka", name: "Power P.E.K.K.A", category: "builder-base", rarity: "legendary", description: "An upgraded P.E.K.K.A with electrified armor and overwhelming power.", descriptionPt: "Uma P.E.K.K.A aprimorada, com armadura eletrificada e poder avassalador.", emoji: "⚙️", wikiUrl: wiki("Power P.E.K.K.A"), imageUrl: "https://static.wikia.nocookie.net/clashofclans/images/3/3b/Avatar_Power_P.E.K.K.A.png/revision/latest?cb=20200913200749" },
  { id: "hog-glider", name: "Hog Glider", category: "builder-base", rarity: "epic", description: "A hog rider that crashes in from the sky, stunning defenses on impact.", descriptionPt: "Um cavaleiro de javali que cai do céu, atordoando defesas no impacto.", emoji: "🪂", wikiUrl: wiki("Hog Glider"), imageUrl: "https://static.wikia.nocookie.net/clashofclans/images/2/2d/Hog_Glider_info.png/revision/latest?cb=20190615155934" },

  // --- SUPER TROOP CARDS (17) ---
  { id: "super-barbarian", name: "Super Barbarian", category: "super-troop", rarity: "rare", description: "A barbarian on steroids, with more HP, more damage, and more rage.", descriptionPt: "Um bárbaro turbinado, com mais vida, mais dano e mais fúria.", emoji: "💪", wikiUrl: wiki("Super Barbarian"), imageUrl: "https://static.wikia.nocookie.net/clashofclans/images/8/81/Avatar_Super_Barbarian.png/revision/latest?cb=20200913075458" },
  { id: "super-archer", name: "Super Archer", category: "super-troop", rarity: "rare", description: "An archer whose arrows pierce through multiple targets in a line.", descriptionPt: "Uma arqueira cujas flechas atravessam vários alvos em linha.", emoji: "🏹", wikiUrl: wiki("Super Archer"), imageUrl: "https://static.wikia.nocookie.net/clashofclans/images/3/3a/Avatar_Super_Archer.png/revision/latest?cb=20200913075643" },
  { id: "super-giant", name: "Super Giant", category: "super-troop", rarity: "rare", description: "A giant who drops a bomb on death, dealing damage to all nearby enemies.", descriptionPt: "Um gigante que solta uma bomba ao morrer, causando dano em todos os inimigos próximos.", emoji: "💥", wikiUrl: wiki("Super Giant"), imageUrl: "https://static.wikia.nocookie.net/clashofclans/images/6/6b/Avatar_Super_Giant.png/revision/latest?cb=20200913075731" },
  { id: "super-goblin", name: "Sneaky Goblin", category: "super-troop", rarity: "rare", description: "A goblin cloaked in a stealth suit, invisible until he strikes.", descriptionPt: "Um goblin com traje furtivo, invisível até o momento do ataque.", emoji: "🥷", wikiUrl: wiki("Sneaky Goblin"), imageUrl: "https://static.wikia.nocookie.net/clashofclans/images/6/6e/Avatar_Sneaky_Goblin.png/revision/latest?cb=20200913075807" },
  { id: "super-wall-breaker", name: "Super Wall Breaker", category: "super-troop", rarity: "rare", description: "A wall breaker carrying twice the explosives, guaranteed to break through.", descriptionPt: "Um quebra-muralhas carregando o dobro de explosivos, garantia de arrombar qualquer coisa.", emoji: "🧨", wikiUrl: wiki("Super Wall Breaker"), imageUrl: "https://static.wikia.nocookie.net/clashofclans/images/c/ca/Avatar_Super_Wall_Breaker.png/revision/latest?cb=20210101081415" },
  { id: "rocket-balloon", name: "Rocket Balloon", category: "super-troop", rarity: "epic", description: "A balloon that fires rockets at defenses while floating toward its target.", descriptionPt: "Um balão que dispara foguetes contra defesas enquanto flutua até o alvo.", emoji: "🚀", wikiUrl: wiki("Rocket Balloon"), imageUrl: "https://static.wikia.nocookie.net/clashofclans/images/e/ed/Avatar_Rocket_Balloon.png/revision/latest?cb=20210618061142" },
  { id: "super-wizard", name: "Super Wizard", category: "super-troop", rarity: "epic", description: "A wizard who fires fireballs at multiple targets simultaneously.", descriptionPt: "Um mago que dispara bolas de fogo em vários alvos ao mesmo tempo.", emoji: "🔥", wikiUrl: wiki("Super Wizard"), imageUrl: "https://static.wikia.nocookie.net/clashofclans/images/f/f9/Avatar_Super_Wizard.png/revision/latest?cb=20201207184826" },
  { id: "super-dragon", name: "Super Dragon", category: "super-troop", rarity: "epic", description: "A dragon whose fire breath is so intense it leaves a burning trail of destruction.", descriptionPt: "Um dragão cujo sopro de fogo é tão intenso que deixa um rastro de destruição em chamas.", emoji: "🔥", wikiUrl: wiki("Super Dragon"), imageUrl: "https://static.wikia.nocookie.net/clashofclans/images/0/0f/Avatar_Super_Dragon.png/revision/latest?cb=20211209194802" },
  { id: "inferno-dragon", name: "Inferno Dragon", category: "super-troop", rarity: "epic", description: "A supercharged Baby Dragon whose breath melts through a single target like an Inferno Tower.", descriptionPt: "Um Dragão Bebê turbinado, cujo sopro derrete um único alvo como uma Torre Inferno.", emoji: "🔥", wikiUrl: wiki("Inferno Dragon"), imageUrl: "https://static.wikia.nocookie.net/clashofclans/images/0/0b/Avatar_Inferno_Dragon.png/revision/latest?cb=20200913075841" },
  { id: "super-miner", name: "Super Miner", category: "super-troop", rarity: "epic", description: "A miner who digs underground and drops a bomb on his target before escaping.", descriptionPt: "Um minerador que cava até o alvo, solta uma bomba e escapa por baixo da terra.", emoji: "🕳️", wikiUrl: wiki("Super Miner"), imageUrl: "https://static.wikia.nocookie.net/clashofclans/images/a/ad/Super_Miner_info.png/revision/latest?cb=20221212121841" },
  { id: "super-yeti", name: "Super Yeti", category: "super-troop", rarity: "legendary", description: "A yeti of immense size that releases a horde of Yetimites when destroyed.", descriptionPt: "Um yeti de tamanho imenso que libera uma horda de Yetimites ao ser destruído.", emoji: "🦣", wikiUrl: wiki("Super Yeti"), imageUrl: "https://static.wikia.nocookie.net/clashofclans/images/1/19/Super_Yeti_info.png/revision/latest?cb=20250326095436" },
  { id: "super-minion", name: "Super Minion", category: "super-troop", rarity: "rare", description: "A minion whose first shot is a devastating long-range laser.", descriptionPt: "Um minion cujo primeiro tiro é um laser devastador de longo alcance.", emoji: "👾", wikiUrl: wiki("Super Minion"), imageUrl: "https://static.wikia.nocookie.net/clashofclans/images/b/be/Avatar_Super_Minion.png/revision/latest?cb=20201013063740" },
  { id: "super-hog-rider", name: "Super Hog Rider", category: "super-troop", rarity: "epic", description: "A hog rider who rides a giant hog, dealing massive damage to everything he hits.", descriptionPt: "Um cavaleiro que monta um javali gigante, causando dano massivo em tudo que acerta.", emoji: "🐗", wikiUrl: wiki("Super Hog Rider"), imageUrl: "https://static.wikia.nocookie.net/clashofclans/images/c/c4/Avatar_Super_Hog_Rider.png/revision/latest?cb=20230613002801" },
  { id: "super-valkyrie", name: "Super Valkyrie", category: "super-troop", rarity: "epic", description: "A valkyrie with even more rage, spinning her axe with terrifying force.", descriptionPt: "Uma valquíria ainda mais furiosa, girando seu machado com força aterrorizante.", emoji: "🌀", wikiUrl: wiki("Super Valkyrie"), imageUrl: "https://static.wikia.nocookie.net/clashofclans/images/9/9e/Avatar_Super_Valkyrie.png/revision/latest?cb=20201012035954" },
  { id: "super-witch", name: "Super Witch", category: "super-troop", rarity: "epic", description: "A witch who summons a massive skeleton army to overwhelm her enemies.", descriptionPt: "Uma bruxa que invoca um exército enorme de esqueletos pra dominar os inimigos.", emoji: "☠️", wikiUrl: wiki("Super Witch"), imageUrl: "https://static.wikia.nocookie.net/clashofclans/images/1/18/Avatar_Super_Witch.png/revision/latest?cb=20200913075918" },
  { id: "ice-hound", name: "Ice Hound", category: "super-troop", rarity: "epic", description: "A frosty hound that freezes everything around it when it falls.", descriptionPt: "Um cão de gelo que congela tudo ao redor quando cai em batalha.", emoji: "❄️", wikiUrl: wiki("Ice Hound"), imageUrl: "https://static.wikia.nocookie.net/clashofclans/images/b/b0/Avatar_Ice_Hound.png/revision/latest?cb=20201207184828" },
  { id: "super-bowler", name: "Super Bowler", category: "super-troop", rarity: "epic", description: "A bowler whose boulders bounce even further, crushing everything in their path.", descriptionPt: "Um lançador cujos pedregulhos quicam ainda mais longe, esmagando tudo pelo caminho.", emoji: "🏐", wikiUrl: wiki("Super Bowler"), imageUrl: "https://static.wikia.nocookie.net/clashofclans/images/3/39/Avatar_Super_Bowler.png/revision/latest?cb=20211005090727" },
];

export const REWARDS = [
  { count: 10, name: "Card Collector Decoration", namePt: "Decoração Colecionador de Cartas", emoji: "📖" },
  { count: 20, name: "5,000 Shiny Ore", namePt: "5.000 Minério Brilhante", emoji: "✨" },
  { count: 30, name: "500 Glowy Ore", namePt: "500 Minério Reluzente", emoji: "🌟" },
  { count: 40, name: "50 Starry Ore", namePt: "50 Minério Estelar", emoji: "⭐" },
  { count: 50, name: "2 Builder Potions", namePt: "2 Poções de Construtor", emoji: "🧪" },
  { count: 60, name: "Manga Fury Prince Skin", namePt: "Visual Príncipe Fúria Mangá", emoji: "👑" },
];

export const SET_REWARDS: Record<CardCategory, { name: string; namePt: string; emoji: string }> = {
  elixir: { name: "Rune of Elixir", namePt: "Runa de Elixir", emoji: "💧" },
  "dark-elixir": { name: "Rune of Dark Elixir", namePt: "Runa de Elixir Negro", emoji: "🌑" },
  "builder-base": { name: "Rune of Gold", namePt: "Runa de Ouro", emoji: "🪙" },
  "super-troop": { name: "Legendary Chest", namePt: "Baú Lendário", emoji: "🧰" },
};
