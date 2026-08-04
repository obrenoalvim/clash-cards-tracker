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
    <div className="min-h-screen bg-[#0a0a12] text-white relative overflow-hidden">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/3 w-[600px] h-[600px] bg-amber-600/[0.06] rounded-full blur-[140px]" />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-white/5 bg-[#0a0a12]/80 backdrop-blur-md sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                Clash of Clans Tracker
              </h1>
              <p className="text-xs text-white/50">August 2026 Clashiversary Event</p>
            </div>

            <div className="flex items-center gap-2">
              {isSharedView ? (
                <a
                  href={window.location.pathname}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition text-sm font-semibold"
                >
                  <Eye className="w-4 h-4" />
                  My Collection
                </a>
              ) : (
                <>
                  <button
                    onClick={() => setShowShare(!showShare)}
                    className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition text-sm font-semibold"
                  >
                    <Share2 className="w-4 h-4" />
                    <span className="hidden sm:inline">Share</span>
                  </button>
                  <button
                    onClick={resetCollection}
                    className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition text-sm font-semibold"
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
            <div className="mt-4 flex items-center gap-2 p-3 rounded-lg bg-white/5 border border-white/10">
              <LinkIcon className="w-4 h-4 text-white/40 shrink-0" />
              <input
                readOnly
                value={shareUrl}
                className="flex-1 bg-transparent text-sm text-white/70 outline-none min-w-0"
              />
              <button
                onClick={copyShareLink}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-sm font-semibold shrink-0"
              >
                {copied ? <CheckCheck className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
          )}

          {isSharedView && (
            <div className="mt-4 flex items-center gap-2 px-4 py-2.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
              <Eye className="w-4 h-4 text-cyan-400" />
              <p className="text-sm text-cyan-300">
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
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                type="text"
                placeholder="Search cards..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm placeholder:text-white/30 focus:outline-none focus:border-white/30 transition"
              />
            </div>

            <div className="flex gap-2">
              {(["all", "collected", "missing"] as FilterMode[]).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setFilterMode(mode)}
                  className={`px-3 sm:px-4 py-2.5 rounded-lg text-sm font-semibold transition capitalize ${
                    filterMode === mode
                      ? "bg-white/15 text-white"
                      : "bg-white/5 text-white/50 hover:bg-white/10"
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
              className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition ${
                categoryFilter === "all" ? "bg-white/15 text-white" : "bg-white/5 text-white/50 hover:bg-white/10"
              }`}
            >
              All Cards
            </button>
            {(Object.keys(CATEGORY_META) as CardCategory[]).map((cat) => {
              const meta = CATEGORY_META[cat];
              return (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition flex items-center gap-1.5 ${
                    categoryFilter === cat ? "bg-white/15 text-white" : "bg-white/5 text-white/50 hover:bg-white/10"
                  }`}
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
            <div className="text-center py-20 text-white/40">
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
          <div className="rounded-2xl bg-gradient-to-br from-white/[0.07] to-white/[0.02] border border-white/10 p-6 sm:p-8">
            <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
              <div>
                <h2 className="text-lg font-bold text-white/90">Collection Progress</h2>
                <p className="text-sm text-white/50 mt-0.5">
                  {stats.collected} of {stats.total} unique cards collected
                </p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-black text-amber-400">
                  {Math.round((stats.collected / stats.total) * 100)}%
                </div>
                {stats.duplicates > 0 && (
                  <p className="text-xs text-white/40 mt-0.5">{stats.duplicates} duplicates for trading</p>
                )}
              </div>
            </div>

            {/* Progress bar */}
            <div className="relative h-4 rounded-full bg-white/5 overflow-hidden mb-6">
              <div
                className="absolute inset-y-0 left-0 rounded-full bg-amber-500 transition-all duration-700 ease-out"
                style={{ width: `${(stats.collected / stats.total) * 100}%` }}
              />
              {REWARDS.map((r) => (
                <div
                  key={r.count}
                  className="absolute top-0 bottom-0 w-0.5 bg-white/30"
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
                    className={`rounded-xl p-4 border transition cursor-pointer ${
                      categoryFilter === cat
                        ? "border-white/30 bg-white/10"
                        : "border-white/5 bg-white/[0.03] hover:bg-white/[0.06]"
                    }`}
                    onClick={() => setCategoryFilter(categoryFilter === cat ? "all" : cat)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-bold flex items-center gap-1.5" style={{ color: meta.color }}>
                        {categoryIcons[cat]}
                        {meta.short}
                      </span>
                      {complete && <Check className="w-4 h-4 text-green-400" />}
                    </div>
                    <div className="flex items-baseline justify-between mb-2">
                      <span className="text-2xl font-black">
                        {s.collected}
                        <span className="text-sm text-white/40 font-normal">/{s.total}</span>
                      </span>
                      <span className="text-xs text-white/40">{pct}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${pct}%`, backgroundColor: meta.color }}
                      />
                    </div>
                    {complete && (
                      <p className="text-xs text-green-400 mt-2 flex items-center gap-1">
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
          <div className="rounded-2xl bg-gradient-to-br from-amber-500/[0.08] to-transparent border border-amber-500/20 p-6">
            <h3 className="text-sm font-bold text-amber-400 mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4" /> Milestone Rewards
            </h3>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              {REWARDS.map((r) => {
                const earned = stats.collected >= r.count;
                const isNext = nextReward?.count === r.count;
                return (
                  <div
                    key={r.count}
                    className={`rounded-xl p-3 text-center border transition ${
                      earned
                        ? "border-green-500/30 bg-green-500/10"
                        : isNext
                        ? "border-amber-500/40 bg-amber-500/5 animate-pulse"
                        : "border-white/5 bg-white/[0.02]"
                    }`}
                  >
                    <div className="text-2xl mb-1">{r.emoji}</div>
                    <div className="text-xs font-bold text-white/80">{r.count}</div>
                    <div className="text-[10px] text-white/40 leading-tight mt-0.5">{r.name}</div>
                    {earned && <Check className="w-3 h-3 text-green-400 mx-auto mt-1" />}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 mt-12">
        <div className="max-w-7xl mx-auto px-6 py-6 text-center">
          <p className="text-sm text-white/40">
            Clash of Clans Tracker — Fan-made tool for the August 2026 Clashiversary Event
          </p>
          <p className="text-xs text-white/30 mt-1">
            Card images from the{" "}
            <a
              href="https://clashofclans.fandom.com/wiki/Clash_of_Cards"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400/60 hover:text-cyan-400 transition underline-offset-2 hover:underline"
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
      className={`relative rounded-xl border transition-all duration-300 overflow-hidden group ${
        has ? "border-white/15" : "border-white/5"
      } ${expanded ? "ring-2 ring-white/30 z-10" : ""} ${isShared ? "" : "cursor-pointer active:scale-[0.98]"}`}
      style={{
        background: has
          ? `linear-gradient(135deg, ${meta.bg.includes("pink") ? "rgba(224,40,126,0.12)" : meta.bg.includes("purple") ? "rgba(139,43,226,0.12)" : meta.bg.includes("amber") ? "rgba(245,166,35,0.12)" : "rgba(0,194,255,0.12)"}, transparent)`
          : "rgba(255,255,255,0.02)",
      }}
    >
      {/* Rarity stripe */}
      <div
        className="absolute top-0 left-0 right-0 h-1"
        style={{ backgroundColor: rarity.color, opacity: has ? 1 : 0.3 }}
      />

      {/* Card body */}
      <div className="p-3 pt-4">
        {/* Image / emoji art */}
        <div
          className={`relative aspect-square rounded-lg mb-2.5 flex items-center justify-center text-4xl transition-all overflow-hidden ${
            has ? "" : "grayscale opacity-30"
          }`}
          style={{
            background: has
              ? `radial-gradient(circle at center, ${meta.glow}, transparent 70%)`
              : "rgba(255,255,255,0.03)",
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
            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
              <Lock className="w-6 h-6 text-white/40" />
            </div>
          )}
          {duplicates > 0 && (
            <span className="absolute top-1 right-1 px-1.5 py-0.5 rounded-md bg-black/60 text-[10px] font-bold text-amber-300">
              x{count}
            </span>
          )}
        </div>

        {/* Name */}
        <h3 className={`text-sm font-bold leading-tight mb-1 ${has ? "text-white" : "text-white/40"}`}>
          {card.name}
        </h3>

        {/* Rarity + category */}
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: rarity.color }}>
            {rarity.label}
          </span>
          <span className="text-[10px] text-white/30">{meta.short}</span>
        </div>

        {/* Expand button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onExpand();
          }}
          className="w-full flex items-center justify-center gap-1 py-1 rounded-md bg-white/5 hover:bg-white/10 text-[10px] text-white/50 transition mb-2"
        >
          {expanded ? "Hide" : "Info"}
          <ChevronDown className={`w-3 h-3 transition-transform ${expanded ? "rotate-180" : ""}`} />
        </button>

        {expanded && (
          <>
            <p className="text-xs text-white/50 leading-relaxed mb-2 italic">{card.description}</p>
            <a
              href={card.wikiUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center justify-center gap-1.5 py-1.5 mb-2 rounded-md bg-white/5 hover:bg-white/10 text-[10px] text-cyan-400 transition"
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
              className={`flex-1 flex items-center justify-center gap-1 py-2 rounded-lg text-xs font-bold transition ${
                has
                  ? "bg-green-500/15 text-green-400 hover:bg-green-500/25"
                  : "bg-white/5 text-white/40 hover:bg-white/10"
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
                  className="w-7 h-7 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 text-white/60 text-sm font-bold transition"
                >
                  −
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSetCount(count + 1);
                  }}
                  className="w-7 h-7 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 text-white/60 text-sm font-bold transition"
                >
                  +
                </button>
              </div>
            )}
          </div>
        )}

        {isShared && (
          <div
            className={`w-full py-2 rounded-lg text-xs font-bold text-center ${
              has ? "bg-green-500/15 text-green-400" : "bg-white/5 text-white/30"
            }`}
          >
            {has ? "Collected" : "Missing"}
          </div>
        )}
      </div>
    </div>
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
