// [CURRENT SUBDIRECTORY/CYCLE] | [src/features/skapa_inbjudan/4_Produce] - Favorites Sub-Hook

import { useState } from "react";
import { FavoriteItem } from "../domain/types";

interface UseInvitationFavoritesParams {
  selectedTime: string;
  locationName: string;
  selectedAreas: string[];
  selectedAudience: string[];
  selectedOrganization: string;
  organizerPersonName: string;
  activityText: string;
  isRecurring: boolean;
  hasReminder: boolean;
  reminderTime: string;
  onApply: (fav: FavoriteItem) => void;
  showToast: (msg: string, duration?: number) => void;
}

export function useInvitationFavorites({
  selectedTime,
  locationName,
  selectedAreas,
  selectedAudience,
  selectedOrganization,
  organizerPersonName,
  activityText,
  isRecurring,
  hasReminder,
  reminderTime,
  onApply,
  showToast
}: UseInvitationFavoritesParams) {
  const [favorites, setFavorites] = useState<FavoriteItem[]>(() => {
    if (typeof localStorage !== "undefined") {
      try {
        const stored = localStorage.getItem("mission_router_named_favorites");
        return stored ? JSON.parse(stored) : [];
      } catch (err) {
        console.warn("Could not parse favorites from localStorage", err);
        return [];
      }
    }
    return [];
  });

  const [favModalOpen, setFavModalOpen] = useState(false);
  const [newFavName, setNewFavName] = useState("");

  const handleSaveFavorite = () => {
    if (!newFavName.trim()) return;
    const newFav: FavoriteItem = {
      id: Date.now().toString(),
      name: newFavName.trim(),
      time: selectedTime,
      location: locationName,
      areas: selectedAreas,
      audience: selectedAudience,
      organization: selectedOrganization,
      organizerName: organizerPersonName,
      activity: activityText,
      isRecurring,
      reminderTime: hasReminder ? reminderTime : ""
    };
    const updated = [newFav, ...favorites.slice(0, 9)];
    setFavorites(updated);
    if (typeof localStorage !== "undefined") {
      localStorage.setItem("mission_router_named_favorites", JSON.stringify(updated));
    }
    setNewFavName("");
    setFavModalOpen(false);
    showToast(`Inbjudan sparades som favoriten "${newFav.name}"!`, 3000);
  };

  const handleApplyFavorite = (fav: FavoriteItem) => {
    onApply(fav);
    showToast(`Laddade in favoriten "${fav.name}"`, 2500);
  };

  const handleRemoveFavorite = (favId: string) => {
    const updated = favorites.filter(f => f.id !== favId);
    setFavorites(updated);
    if (typeof localStorage !== "undefined") {
      localStorage.setItem("mission_router_named_favorites", JSON.stringify(updated));
    }
  };

  return {
    favorites,
    favModalOpen,
    setFavModalOpen,
    newFavName,
    setNewFavName,
    handleSaveFavorite,
    handleApplyFavorite,
    handleRemoveFavorite
  };
}
