import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, TrendingUp, Clock, ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { APPS, CATEGORIES } from "@/data/mock";

const RECENT = ["NoteMind", "AI productivity", "indie launches"];
const TRENDING_SEARCHES = ["AI tools", "student apps", "finance tracker", "design systems"];

export function SearchPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const results = query.length > 1
    ? APPS.filter(a =>
        a.name.toLowerCase().includes(query.toLowerCase()) ||
        a.tagline.toLowerCase().includes(query.toLowerCase()) ||
        a.category.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 5)
    : [];

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
    else setQuery("");
  }, [open]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) { e.preventDefault(); open ? onClose() : null; }
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            transition={{ duration: 0.15 }}
            className="fixed top-[15%] left-1/2 -translate-x-1/2 w-full max-w-xl z-50 glass-strong rounded-2xl border border-border/60 shadow-elevated overflow-hidden">

            {/* Input */}
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-border/40">
              <Search className="h-4 w-4 text-muted-foreground shrink-0" />
              <input ref={inputRef} value={query} onChange={e => setQuery(e.target.value)}
                placeholder="Search apps, founders, collections..."
                className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none" />
              {query && (
                <button onClick={() => setQuery("")} className="text-muted-foreground hover:text-foreground">
                  <X className="h-4 w-4" />
                </button>
              )}
              <kbd className="text-[10px] glass px-1.5 py-0.5 rounded text-muted-foreground">ESC</kbd>
            </div>

            <div className="max-h-[420px] overflow-y-auto">
              {/* Search results */}
              {results.length > 0 && (
                <div className="p-2">
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground px-3 py-1.5">Results</p>
                  {results.map(app => (
                    <Link key={app.id} to={`/explore/app/${app.id}`} onClick={onClose}>
                      <motion.div whileHover={{ x: 4 }}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-muted transition-colors">
                        <span className="text-xl">{app.icon}</span>
                        <div>
                          <p className="text-sm font-medium">{app.name}</p>
                          <p className="text-xs text-muted-foreground">{app.category} · {app.status}</p>
                        </div>
                        <ArrowRight className="h-3.5 w-3.5 text-muted-foreground ml-auto" />
                      </motion.div>
                    </Link>
                  ))}
                </div>
              )}

              {/* Empty state */}
              {query.length > 1 && results.length === 0 && (
                <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                  No results for "{query}"
                </div>
              )}

              {/* Default state */}
              {query.length <= 1 && (
                <div className="p-3 space-y-4">
                  {/* Recent */}
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground px-2 mb-2 flex items-center gap-1.5">
                      <Clock className="h-3 w-3" /> Recent searches
                    </p>
                    <div className="flex flex-wrap gap-2 px-2">
                      {RECENT.map(r => (
                        <button key={r} onClick={() => setQuery(r)}
                          className="text-xs glass px-3 py-1.5 rounded-lg text-muted-foreground hover:text-foreground transition-colors">
                          {r}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Trending */}
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground px-2 mb-2 flex items-center gap-1.5">
                      <TrendingUp className="h-3 w-3" /> Trending searches
                    </p>
                    <div className="flex flex-wrap gap-2 px-2">
                      {TRENDING_SEARCHES.map(t => (
                        <button key={t} onClick={() => setQuery(t)}
                          className="text-xs glass px-3 py-1.5 rounded-lg text-accent/80 hover:text-accent transition-colors">
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Category filter */}
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground px-2 mb-2">Browse by category</p>
                    <div className="grid grid-cols-4 gap-1.5 px-2 pb-1">
                      {CATEGORIES.slice(0, 8).map(c => (
                        <button key={c.id} onClick={() => { setQuery(c.label); }}
                          className="text-xs glass px-2 py-2 rounded-xl text-muted-foreground hover:text-foreground flex flex-col items-center gap-0.5 transition-colors">
                          <span className="text-base">{c.icon}</span>
                          <span className="text-[10px]">{c.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
