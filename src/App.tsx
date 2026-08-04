import { useEffect, useMemo, useState, useCallback } from "react";
import {
  CARDS,
  CATEGORY_META,
  RARITY_META,
  SET_REWARDS,
  REWARDS,
  type Card,
  type CardCategory,
} from "@/data/cards";
import {
  Search,
  Check,
  X,
  RotateCcw,
  Share2,
  Link as LinkIcon,
  Trophy,
  Sparkles,
  Filter,
  ChevronDown,
  Eye,
  Lock,
  Copy,
  CheckCheck,
  Hammer,
  Zap,
  ExternalLink,
} from "lucide-react";

type Collection = Record<string, number>;
type FilterMode = "all" | "collected" | "missing";
type CategoryFilter = "all" | CardCategory;

const STORAGE_KEY = "coc-cards-collection";

function loadCollection(): Collection {
  try {
    const hash = window.location.hash;
    if (hash.startsWith("#c=")) {
      return decodeCollection(hash.slice(3));
    }
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function encodeCollection(col: Collection): string {
  const entries = Object.entries(col).filter(([, v]) => v > 0);
  if (entries.length === 0) return "";
  return entries.map(([k, v]) => `${k}:${v}`).join(",");
}

function decodeCollection(str: string): Collection {
  const col: Collection = {};
  for (const part of str.split(",")) {
    const [id, count] = part.split(":");
    if (id && count) col[id] = parseInt(count, 10) || 0;
  }
  return col;
}

export default function App() {
  const [collection, setCollection] = useState<Collection>(() => loadCollection());
  const [search, setSearch] = useState("");
  const [filterMode, setFilterMode] = useState<FilterMode>("all");
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all");
  const [showShare, setShowShare] = useState(false);
  const [copied, setCopied] = useState(false);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  const isSharedView = useMemo(() => {
    return window.location.hash.startsWith("#c=");
  }, []);

  useEffect(() => {
    if (!isSharedView) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(collection));
    }
  }, [collection, isSharedView]);

  const setCardCount = useCallback((cardId: string, count: number) => {
    if (isSharedView) return;
    setCollection((prev) => {
      const next = { ...prev };
      if (count <= 0) delete next[cardId];
      else next[cardId] = count;
      return next;
    });
  }, [isSharedView]);

  const toggleCard = useCallback((cardId: string) => {
    if (isSharedView) return;
    setCollection((prev) => {
      const next = { ...prev };
      const current = prev[cardId] || 0;
      if (current === 0) next[cardId] = 1;
      else delete next[cardId];
      return next;
    });
  }, [isSharedView]);

  const resetCollection = useCallback(() => {
    if (confirm("Reset your entire collection? This cannot be undone.")) {
      setCollection({});
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const shareUrl = useMemo(() => {
    const encoded = encodeCollection(collection);
    return encoded
      ? `${window.location.origin}${window.location.pathname}#c=${encoded}`
      : window.location.origin + window.location.pathname;
  }, [collection]);

  const copyShareLink = useCallback(() => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [shareUrl]);

  const filteredCards = useMemo(() => {
    return CARDS.filter((card) => {
      if (categoryFilter !== "all" && card.category !== categoryFilter) return false;
      if (search && !card.name.toLowerCase().includes(search.toLowerCase())) return false;
      const count = collection[card.id] || 0;
      if (filterMode === "collected" && count === 0) return false;
      if (filterMode === "missing" && count > 0) return false;
      return true;
    });
  }, [search, filterMode, categoryFilter, collection]);

  const stats = useMemo(() => {
    const total = CARDS.length;
    const collected = Object.keys(collection).filter((k) => (collection[k] || 0) > 0).length;
    const duplicates = Object.entries(collection).reduce(
      (sum, [, count]) => sum + Math.max(0, count - 1),
      0
    );

    const byCategory: Record<CardCategory, { total: number; collected: number }> = {
      elixir: { total: 0, collected: 0 },
      "dark-elixir": { total: 0, collected: 0 },
      "builder-base": { total: 0, collected: 0 },
      "super-troop": { total: 0, collected: 0 },
    };

    CARDS.forEach((card) => {
      byCategory[card.category].total++;
      if ((collection[card.id] || 0) > 0) byCategory[card.category].collected++;
    });

    return { total, collected, duplicates, byCategory };
  }, [collection]);

  const nextReward = useMemo(() => {
    return REWARDS.find((r) => stats.collected < r.count) || null;
  }, [stats.collected]);

  const categoryIcons: Record<CardCategory, React.ReactNode> = {
    elixir: <DropletIcon />,
    "dark-elixir": <MoonIcon />,
    "builder-base": <Hammer className="w-4 h-4" />,
    "super-troop": <Zap className="w-4 h-4" />,
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 relative overflow-hidden">
      {/* Background atmosphere: torchlight + stone grain */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,#241a10,transparent_60%)]" />
        <div className="absolute top-0 left-[10%] w-[500px] h-[500px] bg-ember-600/10 rounded-full blur-[140px]" />
        <div className="absolute top-1/4 right-[8%] w-[450px] h-[450px] bg-gold-600/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-0 left-1/3 w-[500px] h-[500px] bg-ember-600/5 rounded-full blur-[140px]" />
        <div className="absolute inset-0 bg-grain opacity-[0.05]" />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-gold-600/20 bg-gradient-to-b from-stone-900 to-stone-950/95 backdrop-blur-md sticky top-0 shadow-[0_4px_24px_rgba(0,0,0,0.5)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <CrestIcon className="w-11 h-11 shrink-0" />
              <div>
                <h1
                  className="font-display text-lg sm:text-2xl uppercase tracking-wide leading-tight"
                  style={{
                    background: "linear-gradient(135deg, #f0d98c, #d4af37 45%, #ff6a3d)",
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    color: "transparent",
                  }}
                >
                  Clash of Clans Tracker
                </h1>
                <p className="text-[11px] text-stone-400 font-semibold tracking-[0.15em] uppercase mt-0.5">
                  Clashiversary Event &middot; August 2026
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {isSharedView ? (
                <a
                  href={window.location.pathname}
                  className="flex items-center gap-2 px-4 py-2 rounded-md border border-gold-600/30 bg-stone-800/60 hover:bg-stone-800 transition text-sm font-semibold text-gold-300"
                >
                  <Eye className="w-4 h-4" />
                  My Collection
                </a>
              ) : (
                <>
                  <button
                    onClick={() => setShowShare(!showShare)}
                    className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-md border border-gold-600/30 bg-stone-800/60 hover:bg-stone-800 transition text-sm font-semibold text-gold-300"
                  >
                    <Share2 className="w-4 h-4" />
                    <span className="hidden sm:inline">Share</span>
                  </button>
                  <button
                    onClick={resetCollection}
                    className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-md border border-ember-600/30 bg-ember-950/20 hover:bg-ember-600/10 text-ember-400 transition text-sm font-semibold"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span className="hidden sm:inline">Reset</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Share bar */}
          {showShare && !isSharedView && (
            <div className="mt-4 flex items-center gap-2 p-3 rounded-md bg-stone-900 border border-gold-600/20">
              <LinkIcon className="w-4 h-4 text-gold-500/60 shrink-0" />
              <input
                readOnly
                value={shareUrl}
                className="flex-1 bg-transparent text-sm text-stone-300 outline-none min-w-0"
              />
              <button
                onClick={copyShareLink}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-gold-600/15 hover:bg-gold-600/25 text-gold-300 text-sm font-semibold shrink-0"
              >
                {copied ? <CheckCheck className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
          )}

          {isSharedView && (
            <div className="mt-4 flex items-center gap-2 px-4 py-2.5 rounded-md bg-gold-600/10 border border-gold-600/20">
              <Eye className="w-4 h-4 text-gold-400" />
              <p className="text-sm text-gold-200">
                Viewing a shared collection. Items are filtered to show collected only.
              </p>
            </div>
          )}
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Controls */}
        <section className="mb-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gold-600/50" />
              <input
                type="text"
                placeholder="Search cards..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-md bg-stone-900 border border-stone-700 text-sm placeholder:text-stone-500 focus:outline-none focus:border-gold-500/60 transition shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)]"
              />
            </div>

            <div className="flex gap-1 p-1 rounded-md bg-stone-900 border border-stone-700 shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)]">
              {(["all", "collected", "missing"] as FilterMode[]).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setFilterMode(mode)}
                  className={`px-3 sm:px-4 py-1.5 rounded text-sm font-semibold transition capitalize ${
                    filterMode === mode
                      ? "bg-gold-600/20 text-gold-300 shadow-[0_0_0_1px_rgba(212,175,55,0.3)]"
                      : "text-stone-400 hover:text-stone-200"
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          {/* Category chips */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            <button
              onClick={() => setCategoryFilter("all")}
              className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition border ${
                categoryFilter === "all"
                  ? "bg-gold-600/15 text-gold-300 border-gold-500/40"
                  : "bg-stone-900 text-stone-400 border-stone-700 hover:border-stone-600"
              }`}
            >
              All Cards
            </button>
            {(Object.keys(CATEGORY_META) as CardCategory[]).map((cat) => {
              const meta = CATEGORY_META[cat];
              const active = categoryFilter === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className="px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition flex items-center gap-1.5 border bg-stone-900"
                  style={{
                    borderColor: active ? meta.color : "#332415",
                    color: active ? meta.color : "#a8a29e",
                  }}
                >
                  <span style={{ color: meta.color }}>{categoryIcons[cat]}</span>
                  {meta.short}
                </button>
              );
            })}
          </div>
        </section>

        {/* Card grid */}
        <section>
          {filteredCards.length === 0 ? (
            <div className="text-center py-20 text-stone-500">
              <Filter className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p>No cards match your filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
              {filteredCards.map((card) => (
                <CardItem
                  key={card.id}
                  card={card}
                  count={collection[card.id] || 0}
                  isShared={isSharedView}
                  onToggle={() => toggleCard(card.id)}
                  onSetCount={(n) => setCardCount(card.id, n)}
                  expanded={expandedCard === card.id}
                  onExpand={() => setExpandedCard(expandedCard === card.id ? null : card.id)}
                />
              ))}
            </div>
          )}
        </section>

        {/* Overall progress */}
        <section className="mt-8 mb-8">
          <div className="rounded-xl bg-gradient-to-br from-stone-900 to-stone-950 border border-gold-600/20 p-6 sm:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.4)]">
            <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
              <div>
                <h2 className="font-title text-lg font-bold text-stone-100 tracking-wide">Collection Progress</h2>
                <p className="text-sm text-stone-400 mt-0.5">
                  {stats.collected} of {stats.total} unique cards collected
                </p>
              </div>
              <div className="text-right">
                <div
                  className="font-display text-3xl"
                  style={{
                    background: "linear-gradient(135deg, #f0d98c, #d4af37, #ff6a3d)",
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    color: "transparent",
                  }}
                >
                  {Math.round((stats.collected / stats.total) * 100)}%
                </div>
                {stats.duplicates > 0 && (
                  <p className="text-xs text-stone-500 mt-0.5">{stats.duplicates} duplicates for trading</p>
                )}
              </div>
            </div>

            {/* Progress bar */}
            <div
              className="relative h-4 rounded-full overflow-hidden mb-6"
              style={{ background: "#0d0904", boxShadow: "inset 0 2px 4px rgba(0,0,0,0.8)" }}
            >
              <div
                className="absolute inset-y-0 left-0 rounded-full overflow-hidden transition-all duration-700 ease-out"
                style={{
                  width: `${(stats.collected / stats.total) * 100}%`,
                  background: "linear-gradient(90deg, #b8912a, #e8c46a, #ff6a3d)",
                }}
              >
                <div className="absolute inset-y-0 w-1/3 bg-white/30 -skew-x-12 animate-shimmer" />
              </div>
              {REWARDS.map((r) => (
                <div
                  key={r.count}
                  className="absolute top-0 bottom-0 w-0.5 bg-stone-950/60"
                  style={{ left: `${(r.count / stats.total) * 100}%` }}
                  title={`${r.count} cards: ${r.name}`}
                />
              ))}
            </div>

            {/* Category progress */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {(Object.keys(CATEGORY_META) as CardCategory[]).map((cat) => {
                const meta = CATEGORY_META[cat];
                const s = stats.byCategory[cat];
                const pct = s.total > 0 ? Math.round((s.collected / s.total) * 100) : 0;
                const complete = s.collected === s.total;
                return (
                  <div
                    key={cat}
                    className="rounded-lg p-4 border transition cursor-pointer bg-stone-900/60 hover:bg-stone-900"
                    style={{ borderColor: categoryFilter === cat ? meta.color : "#332415" }}
                    onClick={() => setCategoryFilter(categoryFilter === cat ? "all" : cat)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-bold flex items-center gap-1.5" style={{ color: meta.color }}>
                        {categoryIcons[cat]}
                        {meta.short}
                      </span>
                      {complete && <Check className="w-4 h-4 text-gold-400" />}
                    </div>
                    <div className="flex items-baseline justify-between mb-2">
                      <span className="text-2xl font-black text-stone-100">
                        {s.collected}
                        <span className="text-sm text-stone-500 font-normal">/{s.total}</span>
                      </span>
                      <span className="text-xs text-stone-500">{pct}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-stone-950 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${pct}%`, backgroundColor: meta.color }}
                      />
                    </div>
                    {complete && (
                      <p className="text-xs text-gold-400 mt-2 flex items-center gap-1">
                        <Trophy className="w-3 h-3" /> {SET_REWARDS[cat].emoji} {SET_REWARDS[cat].name}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Rewards tracker */}
        <section className="mb-8">
          <div className="rounded-xl bg-gradient-to-br from-stone-900 to-stone-950 border border-gold-600/20 p-6 shadow-[0_8px_30px_rgba(0,0,0,0.4)]">
            <h3 className="font-title text-sm font-bold text-gold-400 mb-5 flex items-center gap-2 tracking-wide uppercase">
              <Sparkles className="w-4 h-4" /> Milestone Rewards
            </h3>
            <div className="relative">
              <div className="absolute left-4 right-4 top-7 h-0.5 bg-gradient-to-r from-stone-700 via-gold-600/30 to-stone-700" />
              <div className="relative grid grid-cols-3 sm:grid-cols-6 gap-3">
                {REWARDS.map((r) => {
                  const earned = stats.collected >= r.count;
                  const isNext = nextReward?.count === r.count;
                  return (
                    <div key={r.count} className="flex flex-col items-center text-center">
                      <div
                        className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl border-2 transition ${
                          isNext ? "animate-ember-pulse" : ""
                        }`}
                        style={{
                          background: earned
                            ? "radial-gradient(circle, #3a2a12, #1a130c)"
                            : "radial-gradient(circle, #150f09, #120d08)",
                          borderColor: earned ? "#e8c46a" : isNext ? "#ff6a3d" : "#332415",
                          boxShadow: earned
                            ? "0 0 16px rgba(232,196,106,0.45)"
                            : isNext
                            ? "0 0 12px rgba(255,106,61,0.4)"
                            : "none",
                        }}
                      >
                        {r.emoji}
                      </div>
                      <div className="text-xs font-bold text-gold-300 mt-1.5">{r.count}</div>
                      <div className="text-[10px] text-stone-500 leading-tight mt-0.5 max-w-[76px]">{r.name}</div>
                      {earned && <Check className="w-3 h-3 text-gold-400 mt-1" />}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-gold-600/10 mt-12">
        <div className="max-w-7xl mx-auto px-6 py-6 text-center">
          <p className="text-sm text-stone-500">
            Clash of Clans Tracker — Fan-made tool for the August 2026 Clashiversary Event
          </p>
          <p className="text-xs text-stone-600 mt-1">
            Card images from the{" "}
            <a
              href="https://clashofclans.fandom.com/wiki/Clash_of_Cards"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold-500/70 hover:text-gold-400 transition underline-offset-2 hover:underline"
            >
              Clash of Clans Wiki
            </a>
            . Not affiliated with Supercell. Clash of Clans is a trademark of Supercell.
          </p>
        </div>
      </footer>
    </div>
  );
}

function CardItem({
  card,
  count,
  isShared,
  onToggle,
  onSetCount,
  expanded,
  onExpand,
}: {
  card: Card;
  count: number;
  isShared: boolean;
  onToggle: () => void;
  onSetCount: (n: number) => void;
  expanded: boolean;
  onExpand: () => void;
}) {
  const meta = CATEGORY_META[card.category];
  const rarity = RARITY_META[card.rarity];
  const has = count > 0;
  const duplicates = Math.max(0, count - 1);
  const [imgError, setImgError] = useState(false);

  return (
    <div
      onClick={isShared ? undefined : onToggle}
      className={`relative rounded-lg border overflow-hidden group transition-all duration-300 ${
        isShared ? "" : "cursor-pointer active:scale-[0.98]"
      } ${expanded ? "ring-2 ring-gold-500/40 z-10" : ""}`}
      style={{
        borderColor: has ? rarity.color : "#2a1f14",
        background: "linear-gradient(160deg, #1a130c, #120d08)",
        boxShadow: has
          ? `inset 0 0 0 1px rgba(212,175,55,0.1), 0 4px 16px -4px ${rarity.color}55`
          : "inset 0 0 0 1px rgba(255,255,255,0.02)",
      }}
    >
      {/* Corner rivets */}
      <span className="absolute top-1.5 left-1.5 w-1.5 h-1.5 rounded-full bg-gradient-to-br from-gold-300/70 to-stone-700/70" />
      <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-gradient-to-br from-gold-300/70 to-stone-700/70" />

      {/* Rarity glow line */}
      <div
        className="h-1"
        style={{
          background: has
            ? `linear-gradient(90deg, transparent, ${rarity.color}, transparent)`
            : "transparent",
        }}
      />

      {/* Card body */}
      <div className="p-3 pt-3">
        {/* Image / emoji art */}
        <div
          className={`relative aspect-square rounded-md mb-2.5 flex items-center justify-center text-4xl overflow-hidden transition-all ${
            has ? "" : "grayscale opacity-30"
          }`}
          style={{
            background: "radial-gradient(circle at 50% 35%, rgba(212,175,55,0.10), transparent 70%)",
            boxShadow: "inset 0 2px 6px rgba(0,0,0,0.6), inset 0 0 0 1px rgba(212,175,55,0.08)",
          }}
        >
          {!imgError ? (
            <img
              src={card.imageUrl}
              alt={card.name}
              onError={() => setImgError(true)}
              className="w-full h-full object-contain p-1"
              loading="lazy"
            />
          ) : (
            <span>{card.emoji}</span>
          )}
          {!has && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <Lock className="w-6 h-6 text-stone-400" />
            </div>
          )}
          {duplicates > 0 && (
            <span className="absolute top-1 right-1 px-1.5 py-0.5 rounded-md bg-stone-950/80 border border-gold-600/30 text-[10px] font-bold text-gold-300">
              x{count}
            </span>
          )}
        </div>

        {/* Name */}
        <h3
          className={`font-title text-sm font-bold leading-tight mb-1 tracking-wide ${
            has ? "text-stone-100" : "text-stone-600"
          }`}
        >
          {card.name}
        </h3>

        {/* Rarity + category */}
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: rarity.color }}>
            {rarity.label}
          </span>
          <span className="text-[10px] text-stone-500">{meta.short}</span>
        </div>

        {/* Expand button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onExpand();
          }}
          className="w-full flex items-center justify-center gap-1 py-1 rounded border border-stone-700 hover:border-gold-600/40 text-[10px] text-stone-400 hover:text-gold-300 transition mb-2"
        >
          {expanded ? "Hide" : "Info"}
          <ChevronDown className={`w-3 h-3 transition-transform ${expanded ? "rotate-180" : ""}`} />
        </button>

        {expanded && (
          <>
            <p className="text-xs text-stone-400 leading-relaxed mb-2 italic">{card.description}</p>
            <a
              href={card.wikiUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center justify-center gap-1.5 py-1.5 mb-2 rounded border border-gold-600/20 hover:border-gold-500/50 text-[10px] text-gold-400 transition"
            >
              <ExternalLink className="w-3 h-3" />
              View on Wiki
            </a>
          </>
        )}

        {/* Action buttons */}
        {!isShared && (
          <div className="flex gap-1.5">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggle();
              }}
              className={`flex-1 flex items-center justify-center gap-1 py-2 rounded text-xs font-bold transition border ${
                has
                  ? "bg-gold-600/15 text-gold-300 border-gold-500/40 hover:bg-gold-600/25"
                  : "bg-stone-900 text-stone-500 border-stone-700 hover:border-stone-600"
              }`}
            >
              {has ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
              {has ? "Have" : "Missing"}
            </button>
            {has && (
              <div className="flex gap-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSetCount(count - 1);
                  }}
                  className="w-7 h-7 flex items-center justify-center rounded border border-stone-700 hover:border-gold-600/40 text-stone-400 hover:text-gold-300 text-sm font-bold transition"
                >
                  −
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSetCount(count + 1);
                  }}
                  className="w-7 h-7 flex items-center justify-center rounded border border-stone-700 hover:border-gold-600/40 text-stone-400 hover:text-gold-300 text-sm font-bold transition"
                >
                  +
                </button>
              </div>
            )}
          </div>
        )}

        {isShared && (
          <div
            className={`w-full py-2 rounded text-xs font-bold text-center border ${
              has
                ? "bg-gold-600/15 text-gold-300 border-gold-500/40"
                : "bg-stone-900 text-stone-500 border-stone-700"
            }`}
          >
            {has ? "Collected" : "Missing"}
          </div>
        )}
      </div>
    </div>
  );
}

function CrestIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none">
      <defs>
        <linearGradient id="crestGold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f0d98c" />
          <stop offset="50%" stopColor="#d4af37" />
          <stop offset="100%" stopColor="#ff6a3d" />
        </linearGradient>
      </defs>
      <path
        d="M24 3 L42 10 V22 C42 33 34.5 41 24 45 C13.5 41 6 33 6 22 V10 Z"
        fill="#1a130c"
        stroke="url(#crestGold)"
        strokeWidth="2"
      />
      <path
        d="M24 11 L28.5 20.5 L39 22 L31.5 29 L33.5 39.5 L24 34.5 L14.5 39.5 L16.5 29 L9 22 L19.5 20.5 Z"
        fill="url(#crestGold)"
      />
    </svg>
  );
}

function DropletIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
      <path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
      <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
    </svg>
  );
}
