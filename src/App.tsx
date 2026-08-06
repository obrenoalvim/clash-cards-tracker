import { useEffect, useMemo, useState, useCallback, useRef, memo } from "react";
import {
  CARDS,
  CATEGORY_META,
  RARITY_META,
  SET_REWARDS,
  REWARDS,
  GEM_COST_PER_CARD,
  type Card,
  type CardCategory,
} from "@/data/cards";
import { STRINGS, type Lang } from "@/i18n";
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
  Languages,
  Plus,
  Gem,
  ArrowRightLeft,
  Users,
  Download,
  Upload,
  Star,
  Package,
} from "lucide-react";

type Collection = Record<string, number>;
type FilterMode = "all" | "collected" | "missing";
type CategoryFilter = "all" | CardCategory;

interface Account {
  id: string;
  name: string;
  collection: Collection;
}

type UndoAction =
  | { type: "reset"; accountId: string; collection: Collection }
  | { type: "deleteAccount"; account: Account; index: number }
  | { type: "import"; accounts: Account[]; activeAccountId: string };

function isValidAccountsShape(value: unknown): value is Account[] {
  return (
    Array.isArray(value) &&
    value.length > 0 &&
    value.every(
      (a) =>
        a &&
        typeof a === "object" &&
        typeof (a as Account).id === "string" &&
        typeof (a as Account).name === "string" &&
        typeof (a as Account).collection === "object" &&
        (a as Account).collection !== null
    )
  );
}

const STORAGE_KEY = "coc-cards-collection";
const ACCOUNTS_KEY = "coc-cards-accounts";
const ACTIVE_ACCOUNT_KEY = "coc-cards-active-account";
const MAIN_ACCOUNT_KEY = "coc-cards-main-account";
const MAX_ACCOUNTS = 10;
const ONBOARDED_KEY = "coc-cards-onboarded";
const LANG_KEY = "coc-cards-lang";
const EVENT_END = new Date(2026, 7, 31, 23, 59, 59); // August 31, 2026, end of day

function daysUntil(date: Date): number {
  const ms = date.getTime() - Date.now();
  return Math.max(0, Math.ceil(ms / (1000 * 60 * 60 * 24)));
}

function makeAccountId(): string {
  return `acc-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}

// One-time migration: players who used the site before multi-account support
// get their existing collection promoted to their first account.
function loadAccounts(): Account[] {
  try {
    const raw = localStorage.getItem(ACCOUNTS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // fall through to migration
  }
  const defaultName = localStorage.getItem(LANG_KEY) === "pt" ? "Conta 1" : "Account 1";
  let legacyCollection: Collection = {};
  try {
    const legacyRaw = localStorage.getItem(STORAGE_KEY);
    legacyCollection = legacyRaw ? JSON.parse(legacyRaw) : {};
  } catch {
    // ignore corrupt legacy data
  }
  return [{ id: "account-1", name: defaultName, collection: legacyCollection }];
}

function loadActiveAccountId(accounts: Account[]): string {
  const saved = localStorage.getItem(ACTIVE_ACCOUNT_KEY);
  return saved && accounts.some((a) => a.id === saved) ? saved : accounts[0].id;
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
  const [accounts, setAccounts] = useState<Account[]>(() => loadAccounts());
  const [activeAccountId, setActiveAccountId] = useState<string>(() => loadActiveAccountId(loadAccounts()));
  const [search, setSearch] = useState("");
  const [filterMode, setFilterMode] = useState<FilterMode>("all");
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all");
  const [showShare, setShowShare] = useState(false);
  const [copied, setCopied] = useState(false);
  const [exported, setExported] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [importText, setImportText] = useState("");
  const [importError, setImportError] = useState<string | null>(null);
  const [mainAccountId, setMainAccountId] = useState<string | null>(() => localStorage.getItem(MAIN_ACCOUNT_KEY));
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [undoAction, setUndoAction] = useState<UndoAction | null>(null);
  const undoTimerRef = useRef<number | null>(null);
  const [lang, setLang] = useState<Lang>(() => {
    const saved = localStorage.getItem(LANG_KEY);
    return saved === "pt" ? "pt" : "en";
  });
  const s = STRINGS[lang];

  useEffect(() => {
    localStorage.setItem(LANG_KEY, lang);
  }, [lang]);

  const isSharedView = useMemo(() => {
    return window.location.hash.startsWith("#c=");
  }, []);

  const sharedCollection = useMemo<Collection>(() => {
    if (!isSharedView) return {};
    try {
      return decodeCollection(window.location.hash.slice(3));
    } catch {
      return {};
    }
  }, [isSharedView]);

  const daysLeft = daysUntil(EVENT_END);
  const eventEnded = Date.now() > EVENT_END.getTime();

  const activeAccount = useMemo(
    () => accounts.find((a) => a.id === activeAccountId) ?? accounts[0],
    [accounts, activeAccountId]
  );
  const collection = isSharedView ? sharedCollection : activeAccount.collection;

  useEffect(() => {
    if (!isSharedView) {
      localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
    }
  }, [accounts, isSharedView]);

  useEffect(() => {
    if (!isSharedView) {
      localStorage.setItem(ACTIVE_ACCOUNT_KEY, activeAccountId);
    }
  }, [activeAccountId, isSharedView]);

  useEffect(() => {
    if (isSharedView) return;
    if (mainAccountId && !accounts.some((a) => a.id === mainAccountId)) {
      setMainAccountId(null);
      return;
    }
    if (mainAccountId) localStorage.setItem(MAIN_ACCOUNT_KEY, mainAccountId);
    else localStorage.removeItem(MAIN_ACCOUNT_KEY);
  }, [accounts, mainAccountId, isSharedView]);

  useEffect(() => {
    if (!isSharedView && !localStorage.getItem(ONBOARDED_KEY)) {
      setShowOnboarding(true);
    }
  }, [isSharedView]);

  const dismissOnboarding = useCallback(() => {
    setShowOnboarding(false);
    localStorage.setItem(ONBOARDED_KEY, "1");
  }, []);

  const updateActiveCollection = useCallback((updater: (prev: Collection) => Collection) => {
    if (isSharedView) return;
    setAccounts((prev) =>
      prev.map((a) => (a.id === activeAccountId ? { ...a, collection: updater(a.collection) } : a))
    );
  }, [isSharedView, activeAccountId]);

  const setCardCount = useCallback((cardId: string, count: number) => {
    updateActiveCollection((prev) => {
      const next = { ...prev };
      if (count <= 0) delete next[cardId];
      else next[cardId] = count;
      return next;
    });
  }, [updateActiveCollection]);

  const toggleCard = useCallback((cardId: string) => {
    updateActiveCollection((prev) => {
      const next = { ...prev };
      const current = prev[cardId] || 0;
      if (current === 0) next[cardId] = 1;
      else delete next[cardId];
      return next;
    });
  }, [updateActiveCollection]);

  const resetCollection = useCallback(() => {
    if (Object.keys(activeAccount.collection).length === 0) return;
    setUndoAction({ type: "reset", accountId: activeAccount.id, collection: activeAccount.collection });
    setAccounts((prev) => prev.map((a) => (a.id === activeAccount.id ? { ...a, collection: {} } : a)));
    if (undoTimerRef.current) window.clearTimeout(undoTimerRef.current);
    undoTimerRef.current = window.setTimeout(() => setUndoAction(null), 5000);
  }, [activeAccount]);

  const undoLastAction = useCallback(() => {
    if (!undoAction) return;
    if (undoAction.type === "reset") {
      const { accountId, collection: snapshot } = undoAction;
      setAccounts((prev) => prev.map((a) => (a.id === accountId ? { ...a, collection: snapshot } : a)));
    } else if (undoAction.type === "deleteAccount") {
      const { account, index } = undoAction;
      setAccounts((prev) => {
        const next = [...prev];
        next.splice(index, 0, account);
        return next;
      });
    } else {
      setAccounts(undoAction.accounts);
      setActiveAccountId(undoAction.activeAccountId);
    }
    setUndoAction(null);
    if (undoTimerRef.current) window.clearTimeout(undoTimerRef.current);
  }, [undoAction]);

  const addAccount = useCallback(() => {
    setAccounts((prev) => {
      if (prev.length >= MAX_ACCOUNTS) return prev;
      const id = makeAccountId();
      const next = [...prev, { id, name: `${s.accountDefaultName} ${prev.length + 1}`, collection: {} }];
      setActiveAccountId(id);
      return next;
    });
  }, [s.accountDefaultName]);

  const toggleMainAccount = useCallback((id: string) => {
    setMainAccountId((prev) => (prev === id ? null : id));
  }, []);

  const renameAccount = useCallback((id: string, name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setAccounts((prev) => prev.map((a) => (a.id === id ? { ...a, name: trimmed } : a)));
  }, []);

  const deleteAccount = useCallback((id: string) => {
    setAccounts((prev) => {
      if (prev.length <= 1) return prev;
      const index = prev.findIndex((a) => a.id === id);
      if (index === -1) return prev;
      const account = prev[index];
      const next = prev.filter((a) => a.id !== id);
      setUndoAction({ type: "deleteAccount", account, index });
      if (undoTimerRef.current) window.clearTimeout(undoTimerRef.current);
      undoTimerRef.current = window.setTimeout(() => setUndoAction(null), 5000);
      if (activeAccountId === id) setActiveAccountId(next[0].id);
      return next;
    });
  }, [activeAccountId]);

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

  const exportAccounts = useCallback(() => {
    navigator.clipboard.writeText(JSON.stringify(accounts, null, 2));
    setExported(true);
    setTimeout(() => setExported(false), 2000);
  }, [accounts]);

  const importAccounts = useCallback(() => {
    let parsed: unknown;
    try {
      parsed = JSON.parse(importText);
    } catch {
      setImportError(s.importInvalid);
      return;
    }
    if (!isValidAccountsShape(parsed)) {
      setImportError(s.importInvalid);
      return;
    }
    const next = parsed.slice(0, MAX_ACCOUNTS);
    setUndoAction({ type: "import", accounts, activeAccountId });
    if (undoTimerRef.current) window.clearTimeout(undoTimerRef.current);
    undoTimerRef.current = window.setTimeout(() => setUndoAction(null), 5000);
    setAccounts(next);
    setActiveAccountId(next[0].id);
    setShowImport(false);
    setImportText("");
    setImportError(null);
  }, [importText, accounts, activeAccountId, s.importInvalid]);

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

  const filteredCards = useMemo(() => {
    const list = CARDS.filter((card) => {
      if (categoryFilter !== "all" && card.category !== categoryFilter) return false;
      if (search && !card.name.toLowerCase().includes(search.toLowerCase())) return false;
      const count = collection[card.id] || 0;
      if (filterMode === "collected" && count === 0) return false;
      if (filterMode === "missing" && count > 0) return false;
      return true;
    });

    if (filterMode === "missing") {
      // Surface categories closest to completion first — most actionable for the player.
      return [...list].sort((a, b) => {
        const pctA = stats.byCategory[a.category].collected / stats.byCategory[a.category].total;
        const pctB = stats.byCategory[b.category].collected / stats.byCategory[b.category].total;
        return pctB - pctA;
      });
    }

    return list;
  }, [search, filterMode, categoryFilter, collection, stats]);

  const nextReward = useMemo(() => {
    return REWARDS.find((r) => stats.collected < r.count) || null;
  }, [stats.collected]);

  const gemCost = useMemo(() => {
    const perCategory = {} as Record<CardCategory, number>;
    let total = 0;
    (Object.keys(CATEGORY_META) as CardCategory[]).forEach((cat) => {
      const missing = stats.byCategory[cat].total - stats.byCategory[cat].collected;
      const cost = missing * GEM_COST_PER_CARD[cat];
      perCategory[cat] = cost;
      total += cost;
    });
    return { perCategory, total };
  }, [stats]);

  const traderShop = useMemo(() => {
    // Trader Shop only trades duplicates of the *same* card (2-for-1, or
    // 3-for-1 for Super Troops) and never your last copy of that card.
    const perCategory = {} as Record<CardCategory, number>;
    let total = 0;
    (Object.keys(CATEGORY_META) as CardCategory[]).forEach((cat) => (perCategory[cat] = 0));
    CARDS.forEach((card) => {
      const count = collection[card.id] || 0;
      if (count <= 1) return;
      const batchSize = card.category === "super-troop" ? 3 : 2;
      const packs = Math.floor((count - 1) / batchSize);
      perCategory[card.category] += packs;
      total += packs;
    });
    return { perCategory, total };
  }, [collection]);

  const familyStats = useMemo(() => {
    if (isSharedView || accounts.length < 2) return null;
    const unionIds = new Set<string>();
    accounts.forEach((a) =>
      Object.keys(a.collection).forEach((id) => {
        if (a.collection[id] > 0) unionIds.add(id);
      })
    );
    const missing = CARDS.filter((c) => !unionIds.has(c.id));
    return { total: CARDS.length, collected: unionIds.size, missing };
  }, [accounts, isSharedView]);

  const tradeSuggestions = useMemo(() => {
    if (isSharedView || accounts.length < 2) return [];
    const result: { from: Account; to: Account; cards: Card[] }[] = [];
    for (const from of accounts) {
      for (const to of accounts) {
        if (from.id === to.id) continue;
        const cards = CARDS.filter(
          (card) => (from.collection[card.id] || 0) >= 2 && (to.collection[card.id] || 0) === 0
        );
        if (cards.length > 0) result.push({ from, to, cards });
      }
    }
    result.sort((a, b) => {
      const aToMain = a.to.id === mainAccountId ? 0 : 1;
      const bToMain = b.to.id === mainAccountId ? 0 : 1;
      return aToMain - bToMain;
    });
    return result;
  }, [accounts, isSharedView, mainAccountId]);

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
              <p className="text-xs text-white/50">
                {eventEnded
                  ? `${s.eventSubtitleActive} — ${s.eventEnded}`
                  : `${s.eventSubtitleActive} — ${daysLeft} ${daysLeft === 1 ? s.dayLeft : s.daysLeft}`}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setLang(lang === "en" ? "pt" : "en")}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition text-sm font-semibold"
                aria-label="Toggle language"
              >
                <Languages className="w-4 h-4" />
                {s.langToggle}
              </button>
              {isSharedView ? (
                <a
                  href={window.location.pathname}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition text-sm font-semibold"
                >
                  <Eye className="w-4 h-4" />
                  {s.myCollection}
                </a>
              ) : (
                <>
                  <button
                    onClick={() => setShowShare(!showShare)}
                    className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition text-sm font-semibold"
                  >
                    <Share2 className="w-4 h-4" />
                    <span className="hidden sm:inline">{s.share}</span>
                  </button>
                  <button
                    onClick={exportAccounts}
                    title={s.exportHint}
                    className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition text-sm font-semibold"
                  >
                    {exported ? <CheckCheck className="w-4 h-4" /> : <Download className="w-4 h-4" />}
                    <span className="hidden sm:inline">{exported ? s.copied : s.exportAll}</span>
                  </button>
                  <button
                    onClick={() => setShowImport(!showImport)}
                    title={s.importHint}
                    className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition text-sm font-semibold"
                  >
                    <Upload className="w-4 h-4" />
                    <span className="hidden sm:inline">{s.importAll}</span>
                  </button>
                  <button
                    onClick={resetCollection}
                    className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition text-sm font-semibold"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span className="hidden sm:inline">{s.reset}</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Account tabs */}
          {!isSharedView && (
            <AccountTabs
              accounts={accounts}
              activeId={activeAccountId}
              mainId={mainAccountId}
              s={s}
              onSelect={setActiveAccountId}
              onAdd={addAccount}
              onRename={renameAccount}
              onDelete={deleteAccount}
              onToggleMain={toggleMainAccount}
            />
          )}

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
                {copied ? s.copied : s.copy}
              </button>
            </div>
          )}

          {/* Import panel */}
          {showImport && !isSharedView && (
            <div className="mt-4 p-3 rounded-lg bg-white/5 border border-white/10">
              <p className="text-xs text-white/40 mb-2">{s.importHint}</p>
              <textarea
                value={importText}
                onChange={(e) => {
                  setImportText(e.target.value);
                  setImportError(null);
                }}
                placeholder={s.importPlaceholder}
                rows={4}
                className="w-full p-2 rounded-md bg-black/30 border border-white/10 text-xs text-white/70 outline-none focus:border-white/30 transition font-mono resize-y"
              />
              {importError && <p className="text-xs text-red-400 mt-2">{importError}</p>}
              <div className="flex items-center gap-2 mt-2">
                <button
                  onClick={importAccounts}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-sm font-semibold"
                >
                  <Upload className="w-4 h-4" />
                  {s.importAll}
                </button>
                <button
                  onClick={() => {
                    setShowImport(false);
                    setImportText("");
                    setImportError(null);
                  }}
                  className="px-3 py-1.5 rounded-md bg-white/5 hover:bg-white/10 text-white/50 text-sm font-semibold"
                >
                  {s.importCancel}
                </button>
              </div>
            </div>
          )}

          {isSharedView && (
            <div className="mt-4 flex items-center gap-2 px-4 py-2.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
              <Eye className="w-4 h-4 text-cyan-400" />
              <p className="text-sm text-cyan-300">
                {s.sharedBanner}
              </p>
            </div>
          )}
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {showOnboarding && (
          <div className="mb-6 flex items-center justify-between gap-3 px-4 py-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
            <p className="text-sm text-amber-200">
              {s.onboardingTip}
            </p>
            <button
              onClick={dismissOnboarding}
              className="shrink-0 p-1 rounded-md hover:bg-white/10 text-amber-200/70 hover:text-amber-200 transition"
              aria-label={s.dismissTip}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {eventEnded && (
          <div className="mb-6 px-4 py-3 rounded-lg bg-white/5 border border-white/10">
            <p className="text-sm text-white/60">
              {s.eventEndedBanner}
            </p>
          </div>
        )}

        {/* Controls */}
        <section className="mb-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                type="text"
                placeholder={s.searchPlaceholder}
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
                  className={`px-3 sm:px-4 py-2.5 rounded-lg text-sm font-semibold transition ${
                    filterMode === mode
                      ? "bg-white/15 text-white"
                      : "bg-white/5 text-white/50 hover:bg-white/10"
                  }`}
                >
                  {mode === "all" ? s.filterAll : mode === "collected" ? s.filterCollected : s.filterMissing}
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
              {s.allCards}
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
                  {lang === "pt" ? meta.shortPt : meta.short}
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
              <p>{s.noMatch}</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
              {filteredCards.map((card) => (
                <CardItem
                  key={card.id}
                  card={card}
                  count={collection[card.id] || 0}
                  isShared={isSharedView}
                  lang={lang}
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
                <h2 className="text-lg font-bold text-white/90">{s.collectionProgress}</h2>
                <p className="text-sm text-white/50 mt-0.5">
                  {stats.collected} {s.cardsCollectedOf} {stats.total} {s.cardsCollectedSuffix}
                </p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-black text-amber-400">
                  {Math.round((stats.collected / stats.total) * 100)}%
                </div>
                {stats.duplicates > 0 && (
                  <p className="text-xs text-white/40 mt-0.5">{stats.duplicates} {s.duplicatesForTrading}</p>
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
                  title={`${r.count}: ${lang === "pt" ? r.namePt : r.name}`}
                />
              ))}
            </div>

            {/* Category progress */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {(Object.keys(CATEGORY_META) as CardCategory[]).map((cat) => {
                const meta = CATEGORY_META[cat];
                const catStats = stats.byCategory[cat];
                const pct = catStats.total > 0 ? Math.round((catStats.collected / catStats.total) * 100) : 0;
                const complete = catStats.collected === catStats.total;
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
                        {lang === "pt" ? meta.shortPt : meta.short}
                      </span>
                      {complete && <Check className="w-4 h-4 text-green-400" />}
                    </div>
                    <div className="flex items-baseline justify-between mb-2">
                      <span className="text-2xl font-black">
                        {catStats.collected}
                        <span className="text-sm text-white/40 font-normal">/{catStats.total}</span>
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
                        <Trophy className="w-3 h-3" /> {SET_REWARDS[cat].emoji} {lang === "pt" ? SET_REWARDS[cat].namePt : SET_REWARDS[cat].name}
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
              <Sparkles className="w-4 h-4" /> {s.milestoneRewards}
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
                    <div className="text-[10px] text-white/40 leading-tight mt-0.5">{lang === "pt" ? r.namePt : r.name}</div>
                    {earned && <Check className="w-3 h-3 text-green-400 mx-auto mt-1" />}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Trader Shop packs available */}
        {!isSharedView && (
          <section className="mb-8">
            <div className="rounded-2xl bg-gradient-to-br from-amber-500/[0.08] to-transparent border border-amber-500/20 p-6">
              <h3 className="text-sm font-bold text-amber-400 mb-1 flex items-center gap-2">
                <Package className="w-4 h-4" /> {s.traderShopTitle}
              </h3>
              <p className="text-xs text-white/40 mb-4">{s.traderShopSubtitle}</p>
              {traderShop.total === 0 ? (
                <p className="text-sm text-white/40">{s.traderShopNone}</p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {(Object.keys(CATEGORY_META) as CardCategory[]).map((cat) => {
                    const meta = CATEGORY_META[cat];
                    if (traderShop.perCategory[cat] === 0) return null;
                    return (
                      <div key={cat} className="rounded-xl p-3 border border-white/5 bg-white/[0.03]">
                        <span className="text-xs font-bold flex items-center gap-1.5" style={{ color: meta.color }}>
                          {categoryIcons[cat]}
                          {lang === "pt" ? meta.shortPt : meta.short}
                        </span>
                        <div className="mt-1.5 text-lg font-black text-white">{traderShop.perCategory[cat]}</div>
                      </div>
                    );
                  })}
                  <div className="col-span-2 sm:col-span-4 flex items-center justify-between rounded-xl p-3 border border-amber-500/20 bg-amber-500/5 mt-1">
                    <span className="text-sm font-bold text-white/80">{s.gemCostTotal}</span>
                    <span className="text-xl font-black text-amber-300">{traderShop.total}</span>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Gem cost to complete collection */}
        {!isSharedView && (
          <section className="mb-8">
            <div className="rounded-2xl bg-gradient-to-br from-cyan-500/[0.08] to-transparent border border-cyan-500/20 p-6">
              <h3 className="text-sm font-bold text-cyan-400 mb-1 flex items-center gap-2">
                <Gem className="w-4 h-4" /> {s.gemCostTitle}
              </h3>
              <p className="text-xs text-white/40 mb-4">{s.gemCostSubtitle}</p>
              {gemCost.total === 0 ? (
                <p className="text-sm text-green-400 flex items-center gap-1.5">
                  <Check className="w-4 h-4" /> {s.gemCostComplete}
                </p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {(Object.keys(CATEGORY_META) as CardCategory[]).map((cat) => {
                    const meta = CATEGORY_META[cat];
                    const missing = stats.byCategory[cat].total - stats.byCategory[cat].collected;
                    return (
                      <div key={cat} className="rounded-xl p-3 border border-white/5 bg-white/[0.03]">
                        <span className="text-xs font-bold flex items-center gap-1.5" style={{ color: meta.color }}>
                          {categoryIcons[cat]}
                          {lang === "pt" ? meta.shortPt : meta.short}
                        </span>
                        <div className="mt-1.5 flex items-baseline gap-1">
                          <span className="text-lg font-black text-white">{gemCost.perCategory[cat]}</span>
                          <Gem className="w-3 h-3 text-cyan-400" />
                        </div>
                        <p className="text-[10px] text-white/40 mt-0.5">{missing} × {GEM_COST_PER_CARD[cat]}</p>
                      </div>
                    );
                  })}
                  <div className="col-span-2 sm:col-span-4 flex items-center justify-between rounded-xl p-3 border border-cyan-500/20 bg-cyan-500/5 mt-1">
                    <span className="text-sm font-bold text-white/80">{s.gemCostTotal}</span>
                    <span className="text-xl font-black text-cyan-300 flex items-center gap-1.5">
                      {gemCost.total} <Gem className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Family view: combined progress across all accounts */}
        {familyStats && (
          <section className="mb-8">
            <div className="rounded-2xl bg-gradient-to-br from-white/[0.07] to-white/[0.02] border border-white/10 p-6">
              <div className="flex items-center justify-between mb-1 flex-wrap gap-2">
                <h3 className="text-sm font-bold text-white/90 flex items-center gap-2">
                  <Users className="w-4 h-4 text-amber-400" /> {s.familyViewTitle}
                </h3>
                <span className="text-2xl font-black text-amber-400">
                  {Math.round((familyStats.collected / familyStats.total) * 100)}%
                </span>
              </div>
              <p className="text-xs text-white/40 mb-4">{s.familyViewSubtitle}</p>
              <div className="relative h-3 rounded-full bg-white/5 overflow-hidden mb-4">
                <div
                  className="absolute inset-y-0 left-0 rounded-full bg-amber-500 transition-all duration-700 ease-out"
                  style={{ width: `${(familyStats.collected / familyStats.total) * 100}%` }}
                />
              </div>
              <p className="text-xs text-white/50 mb-3">
                {familyStats.collected} {s.cardsCollectedOf} {familyStats.total} {s.cardsCollectedSuffix}
              </p>
              {familyStats.missing.length === 0 ? (
                <p className="text-sm text-green-400 flex items-center gap-1.5">
                  <Check className="w-4 h-4" /> {s.familyViewNoneMissing}
                </p>
              ) : (
                <>
                  <p className="text-xs text-white/40 mb-2">{s.familyViewMissingLabel}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {familyStats.missing.map((card) => (
                      <span
                        key={card.id}
                        className="px-2 py-1 rounded-md bg-white/5 text-white/50 text-xs font-semibold"
                      >
                        {card.name}
                      </span>
                    ))}
                  </div>
                </>
              )}
            </div>
          </section>
        )}

        {/* Trade suggestions between accounts */}
        {tradeSuggestions.length > 0 && (
          <section className="mb-8">
            <div className="rounded-2xl bg-gradient-to-br from-white/[0.07] to-white/[0.02] border border-white/10 p-6">
              <h3 className="text-sm font-bold text-white/90 mb-1 flex items-center gap-2">
                <ArrowRightLeft className="w-4 h-4 text-amber-400" /> {s.tradeSuggestionsTitle}
              </h3>
              <p className="text-xs text-white/40 mb-4">{s.tradeSuggestionsSubtitle}</p>
              <div className="space-y-3">
                {tradeSuggestions.map(({ from, to, cards }) => {
                  const isForMain = to.id === mainAccountId;
                  return (
                    <div
                      key={`${from.id}-${to.id}`}
                      className={`rounded-xl p-3 border ${
                        isForMain ? "border-amber-400/40 bg-amber-500/[0.06]" : "border-white/5 bg-white/[0.03]"
                      }`}
                    >
                      <div className="flex items-center gap-2 text-sm font-bold mb-2">
                        <span className="text-white/90">{from.name}</span>
                        <ArrowRightLeft className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span className="text-white/90 flex items-center gap-1">
                          {to.name}
                          {isForMain && <Star className="w-3 h-3 text-amber-400" fill="currentColor" />}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {cards.map((card) => (
                          <span
                            key={card.id}
                            className="px-2 py-1 rounded-md bg-amber-500/10 text-amber-300 text-xs font-semibold"
                          >
                            {card.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 mt-12">
        <div className="max-w-7xl mx-auto px-6 py-6 text-center">
          <p className="text-sm text-white/40">
            {s.footerTagline}
          </p>
          <p className="text-xs text-white/40 mt-1">
            {s.footerImagesFrom}{" "}
            <a
              href="https://clashofclans.fandom.com/wiki/Clash_of_Cards"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400/60 hover:text-cyan-400 transition underline-offset-2 hover:underline"
            >
              {s.footerWiki}
            </a>
            {s.footerDisclaimer}
          </p>
          <p className="text-xs text-white/40 mt-1">
            {s.footerMadeBy} Breno Alvim ·{" "}
            <a
              href="https://github.com/obrenoalvim/clash-cards-tracker"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400/60 hover:text-cyan-400 transition underline-offset-2 hover:underline"
            >
              {s.footerSourceCode}
            </a>
          </p>
        </div>
      </footer>

      {/* Undo toast */}
      {undoAction && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3 px-4 py-3 rounded-lg bg-[#1a1a24] border border-white/15 shadow-xl">
          <p className="text-sm text-white/80">
            {undoAction.type === "reset"
              ? s.resetToast
              : undoAction.type === "deleteAccount"
              ? s.accountDeletedToast
              : s.importedToast}
          </p>
          <button
            onClick={undoLastAction}
            className="text-sm font-semibold text-amber-300 hover:text-amber-200 transition"
          >
            {s.undo}
          </button>
        </div>
      )}
    </div>
  );
}

function AccountTabs({
  accounts,
  activeId,
  mainId,
  s,
  onSelect,
  onAdd,
  onRename,
  onDelete,
  onToggleMain,
}: {
  accounts: Account[];
  activeId: string;
  mainId: string | null;
  s: Record<string, string>;
  onSelect: (id: string) => void;
  onAdd: () => void;
  onRename: (id: string, name: string) => void;
  onDelete: (id: string) => void;
  onToggleMain: (id: string) => void;
}) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftName, setDraftName] = useState("");

  const startEditing = (account: Account) => {
    setEditingId(account.id);
    setDraftName(account.name);
  };

  const commitEditing = () => {
    if (editingId) onRename(editingId, draftName);
    setEditingId(null);
  };

  return (
    <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-1">
      <Users className="w-4 h-4 text-white/30 shrink-0" />
      {accounts.map((account) => (
        <div
          key={account.id}
          className={`group flex items-center gap-1 pl-2 pr-1.5 py-1.5 rounded-lg text-sm font-semibold whitespace-nowrap transition border ${
            account.id === activeId
              ? "bg-white/15 text-white border-transparent"
              : "bg-white/5 text-white/50 hover:bg-white/10 border-transparent"
          } ${account.id === mainId ? "border-amber-400/50" : ""}`}
        >
          <button
            onClick={() => onToggleMain(account.id)}
            aria-label={s.markAsMain}
            title={s.markAsMain}
            className={`p-0.5 transition ${
              account.id === mainId ? "text-amber-400" : "text-white/20 hover:text-amber-300"
            }`}
          >
            <Star className="w-3.5 h-3.5" fill={account.id === mainId ? "currentColor" : "none"} />
          </button>
          {editingId === account.id ? (
            <input
              autoFocus
              value={draftName}
              onChange={(e) => setDraftName(e.target.value)}
              onBlur={commitEditing}
              onKeyDown={(e) => {
                if (e.key === "Enter") commitEditing();
                if (e.key === "Escape") setEditingId(null);
              }}
              className="bg-transparent border-b border-white/30 outline-none w-24 text-sm"
            />
          ) : (
            <button
              onClick={() => onSelect(account.id)}
              onDoubleClick={() => startEditing(account)}
              title={s.renameHint}
            >
              {account.name}
            </button>
          )}
          {accounts.length > 1 && (
            <button
              onClick={() => onDelete(account.id)}
              aria-label={s.deleteAccount}
              className="opacity-0 group-hover:opacity-100 transition text-white/30 hover:text-red-400 p-0.5"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      ))}
      {accounts.length < MAX_ACCOUNTS && (
        <button
          onClick={onAdd}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-bold bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition whitespace-nowrap"
        >
          <Plus className="w-3.5 h-3.5" />
          {s.addAccount}
        </button>
      )}
    </div>
  );
}

const CardItem = memo(function CardItem({
  card,
  count,
  isShared,
  lang,
  onToggle,
  onSetCount,
  expanded,
  onExpand,
}: {
  card: Card;
  count: number;
  isShared: boolean;
  lang: Lang;
  onToggle: () => void;
  onSetCount: (n: number) => void;
  expanded: boolean;
  onExpand: () => void;
}) {
  const s = STRINGS[lang];
  const meta = CATEGORY_META[card.category];
  const rarity = RARITY_META[card.rarity];
  const has = count > 0;
  const duplicates = Math.max(0, count - 1);
  const [imgError, setImgError] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (isShared) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onToggle();
    }
  };

  return (
    <div
      onClick={isShared ? undefined : onToggle}
      onKeyDown={handleKeyDown}
      role={isShared ? undefined : "button"}
      tabIndex={isShared ? undefined : 0}
      aria-pressed={isShared ? undefined : has}
      aria-label={`${card.name}, ${has ? s.collected : s.missing}`}
      className={`relative rounded-xl border transition-all duration-300 overflow-hidden group focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 ${
        has ? "border-white/15" : "border-white/5"
      } ${expanded ? "ring-2 ring-white/30 z-10" : ""} ${isShared ? "" : "cursor-pointer active:scale-[0.98]"}`}
      style={{
        background: has
          ? `linear-gradient(135deg, ${meta.glow}, transparent)`
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
          {!imgLoaded && !imgError && (
            <div className="absolute inset-0 bg-white/5 animate-pulse" />
          )}
          {!imgError ? (
            <img
              src={card.imageUrl}
              alt={card.name}
              onLoad={() => setImgLoaded(true)}
              onError={() => setImgError(true)}
              className={`w-full h-full object-contain p-1 transition-opacity duration-300 ${
                imgLoaded ? "opacity-100" : "opacity-0"
              }`}
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
            {lang === "pt" ? rarity.labelPt : rarity.label}
          </span>
          <span className="text-[10px] text-white/40">{lang === "pt" ? meta.shortPt : meta.short}</span>
        </div>

        {/* Expand button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onExpand();
          }}
          className="w-full flex items-center justify-center gap-1 py-1 rounded-md bg-white/5 hover:bg-white/10 text-[10px] text-white/50 transition mb-2"
        >
          {expanded ? s.hide : s.info}
          <ChevronDown className={`w-3 h-3 transition-transform ${expanded ? "rotate-180" : ""}`} />
        </button>

        {expanded && (
          <>
            <p className="text-xs text-white/50 leading-relaxed mb-2 italic">
              {lang === "pt" ? card.descriptionPt : card.description}
            </p>
            <a
              href={card.wikiUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center justify-center gap-1.5 py-1.5 mb-2 rounded-md bg-white/5 hover:bg-white/10 text-[10px] text-cyan-400 transition"
            >
              <ExternalLink className="w-3 h-3" />
              {s.viewOnWiki}
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
              {has ? s.have : s.missing}
            </button>
            {has && (
              <div className="flex gap-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSetCount(count - 1);
                  }}
                  disabled={count <= 1}
                  title={count <= 1 ? s.minusDisabledTitle : undefined}
                  className="w-7 h-7 flex items-center justify-center rounded-lg bg-white/5 hover:enabled:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-white/60 text-sm font-bold transition"
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
              has ? "bg-green-500/15 text-green-400" : "bg-white/5 text-white/40"
            }`}
          >
            {has ? s.collected : s.missing}
          </div>
        )}
      </div>
    </div>
  );
});

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
