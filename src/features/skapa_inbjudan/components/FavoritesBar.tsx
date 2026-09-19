// [CURRENT SUBDIRECTORY/CYCLE] | [src/features/skapa_inbjudan/4_Produce] - Named Favorites Bar Component

import React from "react";
import { Star, Trash2 } from "lucide-react";
import { FavoriteItem } from "../domain/types";

interface FavoritesBarProps {
  favorites: FavoriteItem[];
  favModalOpen: boolean;
  setFavModalOpen: (open: boolean) => void;
  newFavName: string;
  setNewFavName: (name: string) => void;
  onSaveFavorite: () => void;
  onApplyFavorite: (fav: FavoriteItem) => void;
  onRemoveFavorite: (id: string) => void;
}

export function FavoritesBar({
  favorites,
  favModalOpen,
  setFavModalOpen,
  newFavName,
  setNewFavName,
  onSaveFavorite,
  onApplyFavorite,
  onRemoveFavorite
}: FavoritesBarProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs uppercase font-semibold text-brand-ink/70 flex items-center gap-1.5">
          <Star size={14} className="text-amber-500 fill-amber-500" />
          Mina Sparade Favoritmallar
        </span>
        <button
          type="button"
          onClick={() => setFavModalOpen(true)}
          className="font-mono text-xs text-brand-accent hover:underline flex items-center gap-1 cursor-pointer font-medium"
        >
          + Spara nuvarande som ny favorit
        </button>
      </div>

      {favorites.length === 0 ? (
        <p className="font-mono text-xs text-brand-ink/40 italic bg-brand-paper/50 p-2.5 rounded-xl border border-brand-ink/5 text-center">
          Inga sparade favoritmallar än. Fyll i formuläret nedan och spara för snabb återanvändning!
        </p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {favorites.map(fav => (
            <div
              key={fav.id}
              className="inline-flex items-center gap-1.5 bg-amber-50/80 hover:bg-amber-100/80 border border-amber-200/80 rounded-xl px-3 py-1.5 transition-all text-amber-950 font-mono text-xs"
            >
              <button
                type="button"
                onClick={() => onApplyFavorite(fav)}
                className="cursor-pointer font-medium hover:underline text-left"
              >
                ★ {fav.name}
              </button>
              <button
                type="button"
                onClick={e => {
                  e.stopPropagation();
                  onRemoveFavorite(fav.id);
                }}
                className="text-amber-800/40 hover:text-amber-900 p-0.5 rounded cursor-pointer"
                title="Ta bort favorit"
              >
                <Trash2 size={12} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Save Favorite Name Modal */}
      {favModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-5 max-w-md w-full space-y-4 shadow-xl border border-brand-ink/10">
            <h3 className="font-mono text-xs uppercase font-semibold text-brand-ink flex items-center gap-2">
              <Star size={16} className="text-amber-500 fill-amber-500" />
              Spara Inbjudan som Favorit
            </h3>
            <p className="text-xs text-brand-ink/70">
              Ange ett igenkännbart namn för denna mall (t.ex. "Tisdagsgrillning" eller "Ungdomskväll"):
            </p>
            <input
              type="text"
              value={newFavName}
              onChange={e => setNewFavName(e.target.value)}
              placeholder="Namn på favoriten..."
              className="w-full px-4 py-2 bg-brand-paper border border-brand-ink/15 rounded-xl font-mono text-xs text-brand-ink focus:outline-none focus:border-brand-accent"
              autoFocus
            />
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setFavModalOpen(false)}
                className="px-4 py-2 bg-white border border-brand-ink/15 text-brand-ink rounded-xl font-mono text-xs uppercase"
              >
                Avbryt
              </button>
              <button
                type="button"
                onClick={onSaveFavorite}
                disabled={!newFavName.trim()}
                className="px-5 py-2 bg-brand-accent text-white rounded-xl font-mono text-xs uppercase font-semibold disabled:opacity-50"
              >
                Spara Favorit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
