export type CardCategory = "elixir" | "dark-elixir" | "builder-base" | "super-troop";

export interface Card {
  id: string;
  name: string;
  category: CardCategory;
  rarity: "common" | "rare" | "epic" | "legendary";
  description: string;
  emoji: string;
  wikiUrl: string;
  imageUrl: string;
}

const WIKI_BASE = "https://clashofclans.fandom.com/wiki";
const IMG_BASE = "https://clashofclans.fandom.com/wiki/Special:FilePath";

function wiki(page: string): string {
  return `${WIKI_BASE}/${page.replace(/ /g, "_")}`;
}

function img(file: string): string {
  return `${IMG_BASE}/${file.replace(/ /g, "_")}`;
}

export const CATEGORY_META: Record<
  CardCategory,
  { label: string; short: string; color: string; glow: string; ring: string; bg: string; text: string; icon: string }
> = {
  elixir: {
    label: "Elixir Cards",
    short: "Elixir",
    color: "#E0287E",
    glow: "rgba(224, 40, 126, 0.45)",
    ring: "ring-pink-500/40",
    bg: "from-pink-500/20 to-pink-600/5",
    text: "text-pink-400",
    icon: "💧",
  },
  "dark-elixir": {
    label: "Dark Elixir Cards",
    short: "Dark Elixir",
    color: "#8B2BE2",
    glow: "rgba(139, 43, 226, 0.45)",
    ring: "ring-purple-500/40",
    bg: "from-purple-600/20 to-purple-700/5",
    text: "text-purple-400",
    icon: "🌑",
  },
  "builder-base": {
    label: "Builder Base Cards",
    short: "Builder Base",
    color: "#F5A623",
    glow: "rgba(245, 166, 35, 0.45)",
    ring: "ring-amber-500/40",
    bg: "from-amber-500/20 to-orange-600/5",
    text: "text-amber-400",
    icon: "🔨",
  },
  "super-troop": {
    label: "Super Troop Cards",
    short: "Super Troop",
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
  { label: string; color: string; border: string; gem: string }
> = {
  common: { label: "Common", color: "#B0B7C3", border: "border-slate-400/50", gem: "🪙" },
  rare: { label: "Rare", color: "#3B82F6", border: "border-blue-400/60", gem: "🔷" },
  epic: { label: "Epic", color: "#A855F7", border: "border-fuchsia-400/60", gem: "💜" },
  legendary: { label: "Legendary", color: "#F59E0B", border: "border-amber-400/70", gem: "👑" },
};

export const CARDS: Card[] = [
  // --- ELIXIR CARDS (19) ---
  { id: "barbarian", name: "Barbarian", category: "elixir", rarity: "common", description: "A fearless melee fighter with a mighty sword and an even mightier mustache.", emoji: "🗡️", wikiUrl: wiki("Barbarian"), imageUrl: "https://static.wikia.nocookie.net/clashofclans/images/8/87/Avatar_Barbarian.png/revision/latest?cb=20170525070200" },
  { id: "archer", name: "Archer", category: "elixir", rarity: "common", description: "A ranged attacker who fires arrows with deadly precision from afar.", emoji: "🏹", wikiUrl: wiki("Archer"), imageUrl: "https://static.wikia.nocookie.net/clashofclans/images/6/68/Avatar_Archer.png/revision/latest?cb=20200913014217" },
  { id: "giant", name: "Giant", category: "elixir", rarity: "rare", description: "A massive warrior who only cares about one thing: destroying defenses.", emoji: "🗿", wikiUrl: wiki("Giant"), imageUrl: "https://static.wikia.nocookie.net/clashofclans/images/7/7d/Avatar_Giant.png/revision/latest?cb=20170525070402" },
  { id: "goblin", name: "Goblin", category: "elixir", rarity: "common", description: "Fast, greedy, and obsessed with resources. Will target loot above all else.", emoji: "👺", wikiUrl: wiki("Goblin"), imageUrl: "https://static.wikia.nocookie.net/clashofclans/images/6/68/Avatar_Goblin.png/revision/latest?cb=20200913195137" },
  { id: "wall-breaker", name: "Wall Breaker", category: "elixir", rarity: "common", description: "A skeleton with a bomb, dedicated to blowing up walls and nothing else.", emoji: "💣", wikiUrl: wiki("Wall Breaker"), imageUrl: "https://static.wikia.nocookie.net/clashofclans/images/3/36/Avatar_Wall_Breaker.png/revision/latest?cb=20200913015114" },
  { id: "balloon", name: "Balloon", category: "elixir", rarity: "rare", description: "A floating bomb delivery system that targets only buildings from the sky.", emoji: "🎈", wikiUrl: wiki("Balloon"), imageUrl: "https://static.wikia.nocookie.net/clashofclans/images/8/80/Avatar_Balloon.png/revision/latest?cb=20170525070200" },
  { id: "wizard", name: "Wizard", category: "elixir", rarity: "rare", description: "A master of fireballs who deals devastating splash damage from range.", emoji: "🔥", wikiUrl: wiki("Wizard"), imageUrl: "https://static.wikia.nocookie.net/clashofclans/images/9/97/Avatar_Wizard.png/revision/latest?cb=20200913195243" },
  { id: "healer", name: "Healer", category: "elixir", rarity: "rare", description: "A gentle angel who keeps your troops alive with her healing touch.", emoji: "✨", wikiUrl: wiki("Healer"), imageUrl: "https://static.wikia.nocookie.net/clashofclans/images/9/9c/Avatar_Healer.png/revision/latest?cb=20170525070403" },
  { id: "dragon", name: "Dragon", category: "elixir", rarity: "epic", description: "A flying beast that rains fire upon ground and air targets alike.", emoji: "🐉", wikiUrl: wiki("Dragon"), imageUrl: "https://static.wikia.nocookie.net/clashofclans/images/9/9c/Avatar_Dragon.png/revision/latest?cb=20200913195335" },
  { id: "pekka", name: "P.E.K.K.A", category: "elixir", rarity: "epic", description: "A heavily armored mechanical warrior with devastating melee power.", emoji: "🤖", wikiUrl: wiki("P.E.K.K.A"), imageUrl: "https://static.wikia.nocookie.net/clashofclans/images/1/1a/Avatar_P.E.K.K.A.png/revision/latest?cb=20170525070542" },
  { id: "baby-dragon", name: "Baby Dragon", category: "elixir", rarity: "rare", description: "A young dragon that enforces its territory with fiery splash attacks.", emoji: "🐲", wikiUrl: wiki("Baby Dragon"), imageUrl: "https://static.wikia.nocookie.net/clashofclans/images/7/7a/Avatar_Baby_Dragon.png/revision/latest?cb=20200913014509" },
  { id: "miner", name: "Miner", category: "elixir", rarity: "epic", description: "A digger who tunnels underground to appear anywhere on the battlefield.", emoji: "⛏️", wikiUrl: wiki("Miner"), imageUrl: "https://static.wikia.nocookie.net/clashofclans/images/7/7a/Avatar_Miner.png/revision/latest?cb=20170525070405" },
  { id: "electro-dragon", name: "Electro Dragon", category: "elixir", rarity: "epic", description: "A dragon that chains lightning between multiple targets with each strike.", emoji: "⚡", wikiUrl: wiki("Electro Dragon"), imageUrl: "https://static.wikia.nocookie.net/clashofclans/images/9/97/Avatar_Electro_Dragon.png/revision/latest?cb=20200910094107" },
  { id: "yeti", name: "Yeti", category: "elixir", rarity: "epic", description: "A frosty giant that deploys Yetimites when damaged, overwhelming defenses.", emoji: "🦍", wikiUrl: wiki("Yeti"), imageUrl: "https://static.wikia.nocookie.net/clashofclans/images/b/be/Avatar_Yeti.png/revision/latest?cb=20200913074419" },
  { id: "dragon-rider", name: "Dragon Rider", category: "elixir", rarity: "legendary", description: "A fearless rider atop a dragon, targeting defenses with relentless fury.", emoji: "🏇", wikiUrl: wiki("Dragon Rider"), imageUrl: "https://static.wikia.nocookie.net/clashofclans/images/5/50/Avatar_Dragon_Rider.png/revision/latest?cb=20210618061045" },
  { id: "electro-titan", name: "Electro Titan", category: "elixir", rarity: "legendary", description: "A towering titan crackling with energy, damaging all who dare approach.", emoji: "⚡", wikiUrl: wiki("Electro Titan"), imageUrl: "https://static.wikia.nocookie.net/clashofclans/images/6/67/Avatar_Electro_Titan.png/revision/latest?cb=20221010075230" },
  { id: "root-rider", name: "Root Rider", category: "elixir", rarity: "legendary", description: "A mystical warrior who roots through walls to reach her targets directly.", emoji: "🌳", wikiUrl: wiki("Root Rider"), imageUrl: "https://static.wikia.nocookie.net/clashofclans/images/0/0b/Avatar_Root_Rider.png/revision/latest?cb=20231213214829" },
  { id: "thrower", name: "Thrower", category: "elixir", rarity: "epic", description: "A ranged attacker who hurls boulders at defenses with immense force.", emoji: "🪨", wikiUrl: wiki("Thrower"), imageUrl: "https://static.wikia.nocookie.net/clashofclans/images/d/da/Avatar_Thrower.png/revision/latest?cb=20241123132731" },
  { id: "elephant-rider", name: "Elephant Rider", category: "elixir", rarity: "legendary", description: "The newest troop — a mighty rider atop a battle elephant, crushing all in its path.", emoji: "🐘", wikiUrl: wiki("Elephant Rider"), imageUrl: "https://static.wikia.nocookie.net/clashofclans/images/5/5f/Elephant_Rider_info.png/revision/latest?cb=20260801024128" },

  // --- DARK ELIXIR CARDS (13) ---
  { id: "minion", name: "Minion", category: "dark-elixir", rarity: "common", description: "A small flying imp that throws dark projectiles from the safety of the sky.", emoji: "👿", wikiUrl: wiki("Minion"), imageUrl: "https://static.wikia.nocookie.net/clashofclans/images/3/3b/Avatar_Minion.png/revision/latest?cb=20170525070405" },
  { id: "hog-rider", name: "Hog Rider", category: "dark-elixir", rarity: "rare", description: "A man who rides a hog and leaps over walls to destroy defenses. HOG RIDER!", emoji: "🐗", wikiUrl: wiki("Hog Rider"), imageUrl: "https://static.wikia.nocookie.net/clashofclans/images/e/e9/Avatar_Hog_Rider.png/revision/latest?cb=20200913195505" },
  { id: "valkyrie", name: "Valkyrie", category: "dark-elixir", rarity: "rare", description: "A fierce warrior who spins her axe, dealing splash damage to all around her.", emoji: "🪓", wikiUrl: wiki("Valkyrie"), imageUrl: "https://static.wikia.nocookie.net/clashofclans/images/3/31/Avatar_Valkyrie.png/revision/latest?cb=20170525070543" },
  { id: "golem-de", name: "Golem", category: "dark-elixir", rarity: "epic", description: "A rock behemoth that splits into two Golemites upon death, soaking up damage.", emoji: "🪨", wikiUrl: wiki("Golem"), imageUrl: "https://static.wikia.nocookie.net/clashofclans/images/4/44/Avatar_Golem.png/revision/latest?cb=20170525070403" },
  { id: "witch", name: "Witch", category: "dark-elixir", rarity: "epic", description: "A sorceress who raises skeletons from the dead to fight alongside her.", emoji: "🧙‍♀️", wikiUrl: wiki("Witch"), imageUrl: "https://static.wikia.nocookie.net/clashofclans/images/9/90/Avatar_Witch.png/revision/latest?cb=20170525070544" },
  { id: "lava-hound", name: "Lava Hound", category: "dark-elixir", rarity: "epic", description: "A fiery flying beast that bursts into Lava Pups when destroyed.", emoji: "🌋", wikiUrl: wiki("Lava Hound"), imageUrl: "https://static.wikia.nocookie.net/clashofclans/images/1/1b/Avatar_Lava_Hound.png/revision/latest?cb=20200913195616" },
  { id: "bowler", name: "Bowler", category: "dark-elixir", rarity: "rare", description: "A big guy who hurls boulders that bounce through multiple targets.", emoji: "🎳", wikiUrl: wiki("Bowler"), imageUrl: "https://static.wikia.nocookie.net/clashofclans/images/2/24/Avatar_Bowler.png/revision/latest?cb=20170525070202" },
  { id: "ice-golem", name: "Ice Golem", category: "dark-elixir", rarity: "rare", description: "A frosty tank that freezes nearby enemies when it shatters.", emoji: "🧊", wikiUrl: wiki("Ice Golem"), imageUrl: "https://static.wikia.nocookie.net/clashofclans/images/7/79/Avatar_Ice_Golem.png/revision/latest?cb=20200913014329" },
  { id: "headhunter", name: "Headhunter", category: "dark-elixir", rarity: "epic", description: "A deadly assassin who throws poison blades and targets heroes first.", emoji: "🎯", wikiUrl: wiki("Headhunter"), imageUrl: "https://static.wikia.nocookie.net/clashofclans/images/8/80/Avatar_Headhunter.png/revision/latest?cb=20200913074511" },
  { id: "apprentice-warden", name: "Apprentice Warden", category: "dark-elixir", rarity: "epic", description: "A young warden-in-training who grants a life aura to nearby troops.", emoji: "🧝", wikiUrl: wiki("Apprentice Warden"), imageUrl: "https://static.wikia.nocookie.net/clashofclans/images/8/8b/Avatar_Apprentice_Warden.png/revision/latest?cb=20230613002759" },
  { id: "druid", name: "Druid", category: "dark-elixir", rarity: "epic", description: "A nature wielder who heals allies and transforms into a bear in battle.", emoji: "🐻", wikiUrl: wiki("Druid"), imageUrl: "https://static.wikia.nocookie.net/clashofclans/images/4/43/Avatar_Druid.png/revision/latest?cb=20241003084537" },
  { id: "furnace", name: "Furnace", category: "dark-elixir", rarity: "rare", description: "A living forge that spews fire spirits at any enemy foolish enough to approach.", emoji: "🔥", wikiUrl: wiki("Furnace"), imageUrl: "https://static.wikia.nocookie.net/clashofclans/images/e/e0/Avatar_Furnace.png/revision/latest?cb=20251117221817" },
  { id: "ruin-witch", name: "Ruin Witch", category: "dark-elixir", rarity: "legendary", description: "An ancient witch who commands the ruins themselves to crush her enemies.", emoji: "💀", wikiUrl: wiki("Ruin Witch"), imageUrl: "https://static.wikia.nocookie.net/clashofclans/images/2/23/Ruin_Witch_info.png/revision/latest?cb=20260614153137" },

  // --- BUILDER BASE CARDS (11) ---
  { id: "raged-barbarian", name: "Raged Barbarian", category: "builder-base", rarity: "common", description: "A barbarian fueled by rage, hitting harder and faster than his normal cousin.", emoji: "😠", wikiUrl: wiki("Raged Barbarian"), imageUrl: "https://static.wikia.nocookie.net/clashofclans/images/2/27/Raged_Barbarian_info.png/revision/latest?cb=20170927155033" },
  { id: "sneaky-archer", name: "Sneaky Archer", category: "builder-base", rarity: "common", description: "An archer cloaked in stealth, perfect for picking off isolated defenses.", emoji: "🥷", wikiUrl: wiki("Sneaky Archer"), imageUrl: "https://static.wikia.nocookie.net/clashofclans/images/c/ca/Avatar_Sneaky_Archers.png/revision/latest?cb=20220811090948" },
  { id: "boxer-giant", name: "Boxer Giant", category: "builder-base", rarity: "common", description: "A giant with boxing gloves who punches through walls with ease.", emoji: "🥊", wikiUrl: wiki("Boxer Giant"), imageUrl: "https://static.wikia.nocookie.net/clashofclans/images/1/17/Boxer_Giant_info.png/revision/latest?cb=20170613191751" },
  { id: "beta-minion", name: "Beta Minion", category: "builder-base", rarity: "common", description: "An evolved minion that fires a powerful long-range first shot.", emoji: "🦇", wikiUrl: wiki("Beta Minion"), imageUrl: "https://static.wikia.nocookie.net/clashofclans/images/6/63/Beta_Minion_info.png/revision/latest?cb=20170927155210" },
  { id: "bomber", name: "Bomber", category: "builder-base", rarity: "common", description: "A skeleton who tosses bombs at ground targets, dealing splash damage.", emoji: "💥", wikiUrl: wiki("Bomber"), imageUrl: "https://static.wikia.nocookie.net/clashofclans/images/f/fc/Avatar_Bomber.png/revision/latest?cb=20170525070201" },
  { id: "baby-dragon-bb", name: "Guard Post", category: "builder-base", rarity: "rare", description: "A fortified guard post that deploys troops to defend its territory.", emoji: "🏰", wikiUrl: wiki("Guard Post"), imageUrl: "https://static.wikia.nocookie.net/clashofclans/images/0/0f/Guard_Post_level5_info.png/revision/latest?cb=20250320141049" },
  { id: "cannon-cart", name: "Cannon Cart", category: "builder-base", rarity: "rare", description: "A mobile cannon that rolls into position and unleashes firepower.", emoji: "🔫", wikiUrl: wiki("Cannon Cart"), imageUrl: "https://static.wikia.nocookie.net/clashofclans/images/4/4c/Cannon_Cart_info.png/revision/latest?cb=20230518100227" },
  { id: "drop-ship", name: "Drop Ship", category: "builder-base", rarity: "rare", description: "A flying vessel that drops skeletons onto defenses below.", emoji: "🛩️", wikiUrl: wiki("Drop Ship"), imageUrl: "https://static.wikia.nocookie.net/clashofclans/images/1/17/Drop_Ship_info.png/revision/latest?cb=20260122220415" },
  { id: "hog-glider", name: "Hog Glider", category: "builder-base", rarity: "epic", description: "A hog rider that crashes in from the sky, stunning defenses on impact.", emoji: "🪂", wikiUrl: wiki("Hog Glider"), imageUrl: "https://static.wikia.nocookie.net/clashofclans/images/2/2d/Hog_Glider_info.png/revision/latest?cb=20190615155934" },
  { id: "electrofire-wizard", name: "Electrofire Wizard", category: "builder-base", rarity: "epic", description: "A wizard who combines fire and lightning into devastating chain attacks.", emoji: "🌩️", wikiUrl: wiki("Electrofire Wizard"), imageUrl: "https://static.wikia.nocookie.net/clashofclans/images/6/6f/Avatar_Electrofire_Wizard.png/revision/latest?cb=20230515203151" },
  { id: "power-pekka", name: "Power P.E.K.K.A", category: "builder-base", rarity: "legendary", description: "An upgraded P.E.K.K.A with electrified armor and overwhelming power.", emoji: "⚙️", wikiUrl: wiki("Power P.E.K.K.A"), imageUrl: "https://static.wikia.nocookie.net/clashofclans/images/3/3b/Avatar_Power_P.E.K.K.A.png/revision/latest?cb=20200913200749" },

  // --- SUPER TROOP CARDS (17) ---
  { id: "super-barbarian", name: "Super Barbarian", category: "super-troop", rarity: "rare", description: "A barbarian on steroids, with more HP, more damage, and more rage.", emoji: "💪", wikiUrl: wiki("Super Barbarian"), imageUrl: "https://static.wikia.nocookie.net/clashofclans/images/8/81/Avatar_Super_Barbarian.png/revision/latest?cb=20200913075458" },
  { id: "super-archer", name: "Super Archer", category: "super-troop", rarity: "rare", description: "An archer whose arrows pierce through multiple targets in a line.", emoji: "🏹", wikiUrl: wiki("Super Archer"), imageUrl: "https://static.wikia.nocookie.net/clashofclans/images/3/3a/Avatar_Super_Archer.png/revision/latest?cb=20200913075643" },
  { id: "super-giant", name: "Super Giant", category: "super-troop", rarity: "rare", description: "A giant who drops a bomb on death, dealing damage to all nearby enemies.", emoji: "💥", wikiUrl: wiki("Super Giant"), imageUrl: "https://static.wikia.nocookie.net/clashofclans/images/6/6b/Avatar_Super_Giant.png/revision/latest?cb=20200913075731" },
  { id: "super-wizard", name: "Super Wizard", category: "super-troop", rarity: "epic", description: "A wizard who fires fireballs at multiple targets simultaneously.", emoji: "🔥", wikiUrl: wiki("Super Wizard"), imageUrl: "https://static.wikia.nocookie.net/clashofclans/images/f/f9/Avatar_Super_Wizard.png/revision/latest?cb=20201207184826" },
  { id: "super-goblin", name: "Sneaky Goblin", category: "super-troop", rarity: "rare", description: "A goblin cloaked in a stealth suit, invisible until he strikes.", emoji: "🥷", wikiUrl: wiki("Sneaky Goblin"), imageUrl: "https://static.wikia.nocookie.net/clashofclans/images/6/6e/Avatar_Sneaky_Goblin.png/revision/latest?cb=20200913075807" },
  { id: "super-wall-breaker", name: "Super Wall Breaker", category: "super-troop", rarity: "rare", description: "A wall breaker carrying twice the explosives, guaranteed to break through.", emoji: "🧨", wikiUrl: wiki("Super Wall Breaker"), imageUrl: "https://static.wikia.nocookie.net/clashofclans/images/c/ca/Avatar_Super_Wall_Breaker.png/revision/latest?cb=20210101081415" },
  { id: "super-minion", name: "Super Minion", category: "super-troop", rarity: "rare", description: "A minion whose first shot is a devastating long-range laser.", emoji: "👾", wikiUrl: wiki("Super Minion"), imageUrl: "https://static.wikia.nocookie.net/clashofclans/images/b/be/Avatar_Super_Minion.png/revision/latest?cb=20201013063740" },
  { id: "super-valkyrie", name: "Super Valkyrie", category: "super-troop", rarity: "epic", description: "A valkyrie with even more rage, spinning her axe with terrifying force.", emoji: "🌀", wikiUrl: wiki("Super Valkyrie"), imageUrl: "https://static.wikia.nocookie.net/clashofclans/images/9/9e/Avatar_Super_Valkyrie.png/revision/latest?cb=20201012035954" },
  { id: "super-bowler", name: "Super Bowler", category: "super-troop", rarity: "epic", description: "A bowler whose boulders bounce even further, crushing everything in their path.", emoji: "🏐", wikiUrl: wiki("Super Bowler"), imageUrl: "https://static.wikia.nocookie.net/clashofclans/images/3/39/Avatar_Super_Bowler.png/revision/latest?cb=20211005090727" },
  { id: "super-witch", name: "Super Witch", category: "super-troop", rarity: "epic", description: "A witch who summons a massive skeleton army to overwhelm her enemies.", emoji: "☠️", wikiUrl: wiki("Super Witch"), imageUrl: "https://static.wikia.nocookie.net/clashofclans/images/1/18/Avatar_Super_Witch.png/revision/latest?cb=20200913075918" },
  { id: "super-dragon", name: "Super Dragon", category: "super-troop", rarity: "epic", description: "A dragon whose fire breath is so intense it leaves a burning trail of destruction.", emoji: "🔥", wikiUrl: wiki("Super Dragon"), imageUrl: "https://static.wikia.nocookie.net/clashofclans/images/0/0f/Avatar_Super_Dragon.png/revision/latest?cb=20211209194802" },
  { id: "super-hog-rider", name: "Super Hog Rider", category: "super-troop", rarity: "epic", description: "A hog rider who rides a giant hog, dealing massive damage to everything he hits.", emoji: "🐗", wikiUrl: wiki("Super Hog Rider"), imageUrl: "https://static.wikia.nocookie.net/clashofclans/images/c/c4/Avatar_Super_Hog_Rider.png/revision/latest?cb=20230613002801" },
  { id: "super-miner", name: "Super Miner", category: "super-troop", rarity: "epic", description: "A miner who digs underground and drops a bomb on his target before escaping.", emoji: "🕳️", wikiUrl: wiki("Super Miner"), imageUrl: "https://static.wikia.nocookie.net/clashofclans/images/a/ad/Super_Miner_info.png/revision/latest?cb=20221212121841" },
  { id: "ice-hound", name: "Ice Hound", category: "super-troop", rarity: "epic", description: "A frosty hound that freezes everything around it when it falls.", emoji: "❄️", wikiUrl: wiki("Ice Hound"), imageUrl: "https://static.wikia.nocookie.net/clashofclans/images/b/b0/Avatar_Ice_Hound.png/revision/latest?cb=20201207184828" },
  { id: "rocket-balloon", name: "Rocket Balloon", category: "super-troop", rarity: "epic", description: "A balloon that fires rockets at defenses while floating toward its target.", emoji: "🚀", wikiUrl: wiki("Rocket Balloon"), imageUrl: "https://static.wikia.nocookie.net/clashofclans/images/e/ed/Avatar_Rocket_Balloon.png/revision/latest?cb=20210618061142" },
  { id: "super-yeti", name: "Super Yeti", category: "super-troop", rarity: "legendary", description: "A yeti of immense size that releases a horde of Yetimites when destroyed.", emoji: "🦣", wikiUrl: wiki("Super Yeti"), imageUrl: "https://static.wikia.nocookie.net/clashofclans/images/1/19/Super_Yeti_info.png/revision/latest?cb=20250326095436" },
  { id: "mega-sparky", name: "Mega Sparky", category: "super-troop", rarity: "legendary", description: "A walking cannon of massive scale that charges up and unleashes a devastating blast.", emoji: "🌟", wikiUrl: wiki("Mega Sparky"), imageUrl: "https://static.wikia.nocookie.net/clashofclans/images/9/9e/Avatar_Mega_Sparky.png/revision/latest?cb=20260123222744" },
];

export const REWARDS = [
  { count: 10, name: "Card Collector Decoration", emoji: "📖" },
  { count: 20, name: "5,000 Shiny Ore", emoji: "✨" },
  { count: 30, name: "500 Glowy Ore", emoji: "🌟" },
  { count: 40, name: "50 Starry Ore", emoji: "⭐" },
  { count: 50, name: "2 Builder Potions", emoji: "🧪" },
  { count: 60, name: "Manga Fury Prince Skin", emoji: "👑" },
];

export const SET_REWARDS: Record<CardCategory, { name: string; emoji: string }> = {
  elixir: { name: "Rune of Elixir", emoji: "💧" },
  "dark-elixir": { name: "Rune of Dark Elixir", emoji: "🌑" },
  "builder-base": { name: "Rune of Gold", emoji: "🪙" },
  "super-troop": { name: "Legendary Chest", emoji: "🧰" },
};
