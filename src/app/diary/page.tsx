"use client";
import { useMemo, useState, useRef, useEffect } from "react";
import { useAppStore } from "@/store/appStore";
import type { MealType, FoodItem } from "@/lib/types";
import { FOOD_SUGGESTIONS } from "@/lib/foodDatabase";
import { NutritionFactsModal } from "@/components/NutritionFactsModal";
import { formatDate } from "@/lib/dateUtils";
import { nanoid } from "nanoid";

const MEALS: MealType[] = ["breakfast", "lunch", "dinner", "snack"];

export default function DiaryPage() {
  const foods = useAppStore((s) => s.foods);
  const diary = useAppStore((s) => s.diary);
  const addDiaryEntry = useAppStore((s) => s.addDiaryEntry);
  const updateDiaryEntry = useAppStore((s) => s.updateDiaryEntry);
  const removeDiaryEntry = useAppStore((s) => s.removeDiaryEntry);
  const addFood = useAppStore((s) => s.addFood);

  const [date, setDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [selectedEntry, setSelectedEntry] = useState<string | null>(null);
  const [activeMealSearch, setActiveMealSearch] = useState<MealType | null>(null);

  const todays = diary.filter((d) => d.date === date);

  const getMealTotal = (mealType: MealType) => {
    const mealEntries = todays.filter((d) => d.meal === mealType);
    return mealEntries.reduce(
      (acc, e) => {
        const q = e.quantity;
        acc.calories += e.food.calories * q;
        acc.protein += e.food.proteinGrams * q;
        acc.carbs += e.food.carbGrams * q;
        acc.fats += e.food.fatGrams * q;
        return acc;
      },
      { calories: 0, protein: 0, carbs: 0, fats: 0 }
    );
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Diary</h1>
        <label className="flex items-center gap-2">
          <span className="text-xs text-neutral-400">Date</span>
          <input type="date" className="rounded-md border border-neutral-800 bg-neutral-900 p-2" value={date} onChange={(e) => setDate(e.target.value)} />
        </label>
      </div>

      <div className="space-y-6">
        {MEALS.map((mealType) => {
          const mealEntries = todays.filter((t) => t.meal === mealType);
          const totals = getMealTotal(mealType);
          const mealLabel = mealType.charAt(0).toUpperCase() + mealType.slice(1);

          return (
            <div key={mealType} className="rounded-lg border border-neutral-800 bg-neutral-900 p-4 transition-all hover:border-neutral-700 animate-fadeIn">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold capitalize text-cyan-300">{mealLabel}</h2>
                  {mealEntries.length > 0 && (
                    <div className="mt-1 flex gap-3 text-xs text-neutral-400">
                      <span>{totals.calories.toFixed(0)} kcal</span>
                      <span className="text-emerald-400">P: {totals.protein.toFixed(0)}g</span>
                      <span className="text-amber-400">C: {totals.carbs.toFixed(0)}g</span>
                      <span className="text-pink-400">F: {totals.fats.toFixed(0)}g</span>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => setActiveMealSearch(mealType)}
                  className="rounded-md bg-cyan-500/20 px-4 py-2 text-sm font-medium text-cyan-300 hover:bg-cyan-500/25"
                >
                  Add Food
                </button>
              </div>
              <div className="space-y-2">
                {mealEntries.length > 0 ? (
                  mealEntries.map((e) => (
                    <EntryRow key={e.id} entryId={e.id} onEdit={() => setSelectedEntry(e.id)} />
                  ))
                ) : (
                  <div className="py-4 text-center text-sm text-neutral-500">No foods added yet</div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {selectedEntry && (
        <EditEntryModal
          entryId={selectedEntry}
          onClose={() => setSelectedEntry(null)}
          onUpdate={(entry) => {
            updateDiaryEntry(entry);
            setSelectedEntry(null);
          }}
          onRemove={(id) => {
            removeDiaryEntry(id);
            setSelectedEntry(null);
          }}
        />
      )}
      {activeMealSearch && (
        <MealSearchModal
          meal={activeMealSearch}
          date={date}
          onClose={() => setActiveMealSearch(null)}
        />
      )}
    </div>
  );
}

function MealSearchModal({
  meal,
  date,
  onClose,
}: {
  meal: MealType;
  date: string;
  onClose: () => void;
}) {
  const foods = useAppStore((s) => s.foods);
  const cookbook = useAppStore((s) => s.cookbook);
  const addDiaryEntry = useAppStore((s) => s.addDiaryEntry);
  const updateDiaryEntry = useAppStore((s) => s.updateDiaryEntry);
  const diary = useAppStore((s) => s.diary);
  const addFood = useAppStore((s) => s.addFood);

  const [query, setQuery] = useState("");
  const [quantity, setQuantity] = useState<number>(1);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showCreateFood, setShowCreateFood] = useState(false);
  const [draftFood, setDraftFood] = useState<FoodItem | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    
    // Search foods
    const userMatches = foods.filter((f) => f.name.toLowerCase().includes(q));
    
    // Search cookbook recipes
    const recipeMatches = cookbook
      .filter((r) => r.name.toLowerCase().includes(q))
      .map((r) => ({
        id: `recipe-${r.id}`,
        name: r.name,
        brand: "Recipe",
        servingSize: `${r.servings} serving(s)`,
        calories: r.calories,
        proteinGrams: r.proteinGrams,
        carbGrams: r.carbGrams,
        fatGrams: r.fatGrams,
        isRecipe: true,
      } as FoodItem & { isRecipe?: boolean }));
    
    // Search food suggestions
    const suggestionMatches = FOOD_SUGGESTIONS.filter((s) => s.name.toLowerCase().includes(q))
      .filter((s) => !foods.some((f) => f.name === s.name))
      .map((s) => ({
        id: nanoid(),
        name: s.name,
        brand: s.brand,
        servingSize: s.servingSize,
        calories: s.calories,
        proteinGrams: s.proteinGrams,
        carbGrams: s.carbGrams,
        fatGrams: s.fatGrams,
      } as FoodItem));
    
    return [...recipeMatches, ...userMatches, ...suggestionMatches].slice(0, 8);
  }, [foods, cookbook, query]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(e.target as Node) && searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAddFood = (food: FoodItem) => {
    const entryId = addDiaryEntry({ date, meal, food: { ...food }, quantity });
    setQuery("");
    setShowSuggestions(false);
    const entry = diary.find((e) => e.id === entryId) || {
      id: entryId,
      date,
      meal,
      food,
      quantity,
    };
    updateDiaryEntry(entry as any);
    onClose();
  };

  const handleSelectSuggestion = (food: FoodItem & { isRecipe?: boolean }) => {
    // If it's a recipe, add it directly
    if (food.isRecipe) {
      handleAddFood(food);
    } else {
      handleAddFood(food);
    }
  };

  const openCreateFood = () => {
    const base: FoodItem = {
      id: "temp",
      name: query.trim(),
      brand: "",
      servingSize: "100 g",
      calories: 0,
      proteinGrams: 0,
      carbGrams: 0,
      fatGrams: 0,
    } as FoodItem;
    setDraftFood(base);
    setShowCreateFood(true);
  };

  const handleCreateFoodSave = (food: FoodItem) => {
    const { id: _ignored, ...rest } = food as any;
    const newId = addFood(rest);
    const fullFood: FoodItem = { ...(rest as FoodItem), id: newId };
    handleAddFood(fullFood);
    setShowCreateFood(false);
    setDraftFood(null);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
        <div className="w-full max-w-2xl rounded-xl border border-neutral-700 bg-neutral-900 p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold capitalize">Add Food to {meal}</h2>
            <button onClick={onClose} className="text-neutral-400 hover:text-neutral-200">×</button>
          </div>

          <div className="space-y-4">
            <label className="flex flex-col gap-1 relative">
              <span className="text-xs text-neutral-400">Search Foods</span>
              <input
                ref={searchRef}
                type="text"
                autoComplete="off"
                className="rounded-md border border-neutral-800 bg-neutral-950 p-3"
                placeholder="Search foods..."
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    if (suggestions.length > 0) {
                      handleSelectSuggestion(suggestions[0]);
                    } else if (query.trim()) {
                      openCreateFood();
                    }
                  }
                }}
              />
              {(showSuggestions && (suggestions.length > 0 || query.trim())) && (
                <div ref={suggestionsRef} className="absolute left-0 top-full z-20 mt-1 w-full rounded-md border border-neutral-800 bg-neutral-900 p-2 shadow-lg max-h-64 overflow-y-auto">
                  {suggestions.map((f) => (
                    <button
                      key={f.id}
                      className="flex w-full items-center justify-between rounded-md px-3 py-2 text-left hover:bg-neutral-800 transition-colors"
                      onClick={(e) => {
                        e.preventDefault();
                        handleSelectSuggestion(f);
                      }}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="truncate font-medium">{f.name}</div>
                        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-neutral-400">
                          {f.brand && <span className={`truncate max-w-[50%] ${(f as any).isRecipe ? 'text-cyan-400 font-semibold' : ''}`}>{f.brand}</span>}
                          <span>{f.servingSize}</span>
                        </div>
                      </div>
                      <div className="flex gap-2 text-xs ml-2 flex-shrink-0">
                        <span className="rounded-md bg-neutral-800 px-2 py-0.5">{f.calories} kcal</span>
                        <span className="rounded-md bg-emerald-500/20 px-2 py-0.5 text-emerald-300">P {f.proteinGrams}g</span>
                        <span className="rounded-md bg-amber-500/20 px-2 py-0.5 text-amber-300">C {f.carbGrams}g</span>
                        <span className="rounded-md bg-pink-500/20 px-2 py-0.5 text-pink-300">F {f.fatGrams}g</span>
                      </div>
                    </button>
                  ))}
                  {query.trim() && (
                    <button
                      className="mt-1 flex w-full items-center justify-between rounded-md px-3 py-2 text-left hover:bg-neutral-800 transition-colors border-t border-neutral-800 text-sm"
                      onClick={(e) => {
                        e.preventDefault();
                        openCreateFood();
                      }}
                    >
                      <span className="text-neutral-300">Create custom food: <span className="font-semibold">{query.trim()}</span></span>
                    </button>
                  )}
                </div>
              )}
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-xs text-neutral-400">Quantity</span>
              <input type="number" min={0.1} step={0.1} className="rounded-md border border-neutral-800 bg-neutral-950 p-3" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} />
            </label>
          </div>
        </div>
      </div>

      {showCreateFood && draftFood && (
        <NutritionFactsModal
          food={draftFood}
          quantity={quantity}
          onSave={handleCreateFoodSave}
          onClose={() => {
            setShowCreateFood(false);
            setDraftFood(null);
          }}
          onQuantityChange={setQuantity}
        />
      )}
    </>
  );
}

function EntryRow({ entryId, onEdit }: { entryId: string; onEdit: () => void }) {
  const entry = useAppStore((s) => s.diary.find((d) => d.id === entryId));
  const remove = useAppStore((s) => s.removeDiaryEntry);
  if (!entry) return null;

  const f = entry.food;
  const totals = {
    calories: f.calories * entry.quantity,
    protein: f.proteinGrams * entry.quantity,
    carbs: f.carbGrams * entry.quantity,
    fats: f.fatGrams * entry.quantity,
  };

  return (
    <div className="flex items-center justify-between rounded-md border border-neutral-800 bg-neutral-900 p-3 transition-colors hover:border-neutral-700">
      <div className="min-w-0 flex-1">
        <div className="font-medium">{f.name}</div>
        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-neutral-400">×{entry.quantity}</span>
          <span className="rounded-md bg-cyan-500/20 px-2 py-0.5 text-cyan-300 font-semibold">{totals.calories.toFixed(0)} kcal</span>
          <span className="rounded-md bg-emerald-500/20 px-2 py-0.5 text-emerald-300 font-semibold">P {totals.protein.toFixed(0)}g</span>
          <span className="rounded-md bg-amber-500/20 px-2 py-0.5 text-amber-300 font-semibold">C {totals.carbs.toFixed(0)}g</span>
          <span className="rounded-md bg-pink-500/20 px-2 py-0.5 text-pink-300 font-semibold">F {totals.fats.toFixed(0)}g</span>
        </div>
      </div>
      <div className="flex items-center gap-2 ml-4">
        <button
          onClick={onEdit}
          className="rounded-md bg-cyan-500/20 px-3 py-1 text-xs text-cyan-300 hover:bg-cyan-500/25"
        >
          Edit
        </button>
        <button
          onClick={() => remove(entry.id)}
          className="rounded-md bg-red-500/20 px-3 py-1 text-xs text-red-300 hover:bg-red-500/25"
        >
          Remove
        </button>
      </div>
    </div>
  );
}

function EditEntryModal({
  entryId,
  onClose,
  onUpdate,
  onRemove,
}: {
  entryId: string;
  onClose: () => void;
  onUpdate: (entry: any) => void;
  onRemove: (id: string) => void;
}) {
  const entry = useAppStore((s) => s.diary.find((d) => d.id === entryId));
  const [quantity, setQuantity] = useState(entry?.quantity ?? 1);
  const [editedFood, setEditedFood] = useState<FoodItem>(entry?.food ?? ({} as FoodItem));

  if (!entry) return null;

  const handleSave = (food: FoodItem) => {
    onUpdate({ ...entry, food, quantity });
  };

  return (
    <NutritionFactsModal
      food={editedFood}
      quantity={quantity}
      onSave={handleSave}
      onClose={onClose}
      onQuantityChange={setQuantity}
    />
  );
}

