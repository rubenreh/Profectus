"use client";
import { useState, useMemo } from "react";
import { FOOD_SUGGESTIONS } from "@/lib/foodDatabase";
import { useAppStore } from "@/store/appStore";
import type { MealType, Recipe, FoodItem } from "@/lib/types";
import { NutritionFactsModal } from "@/components/NutritionFactsModal";

export default function KitchenPage() {
  const foods = useAppStore((s) => s.foods);
  const cookbook = useAppStore((s) => s.cookbook);
  const addRecipe = useAppStore((s) => s.addRecipe);
  const updateRecipe = useAppStore((s) => s.updateRecipe);
  const removeRecipe = useAppStore((s) => s.removeRecipe);
  const addDiaryEntry = useAppStore((s) => s.addDiaryEntry);
  const pantry = useAppStore((s) => s.pantry);
  const addPantryItem = useAppStore((s) => s.addPantryItem);
  const updatePantryItem = useAppStore((s) => s.updatePantryItem);
  const removePantryItem = useAppStore((s) => s.removePantryItem);

  const [mealType, setMealType] = useState<MealType>("breakfast");
  const [generatedRecipes, setGeneratedRecipes] = useState<Recipe[]>([]);
  const [currentRecipeIndex, setCurrentRecipeIndex] = useState<number>(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showIntro, setShowIntro] = useState(cookbook.length === 0);
  const [showNutritionModal, setShowNutritionModal] = useState(false);
  const [selectedRecipeForNutrition, setSelectedRecipeForNutrition] = useState<Recipe | null>(null);

  // Pantry now persisted in global store
  const [draft, setDraft] = useState<{ name: string; servingSize: string; calories: number; proteinGrams: number; carbGrams: number; fatGrams: number }>(
    { name: "", servingSize: "100 g", calories: 0, proteinGrams: 0, carbGrams: 0, fatGrams: 0 }
  );

  const [showPantryModal, setShowPantryModal] = useState(false);
  const [showCookbookModal, setShowCookbookModal] = useState(false);
  const [pantryEditFood, setPantryEditFood] = useState<FoodItem | null>(null);
  const [pantryEditQty, setPantryEditQty] = useState<number>(1);

  // Show all ingredients - no filtering needed
  const allIngredients = pantry;

  const handleGenerateRecipe = async () => {
    // Auto-select from pantry - use 2-4 items for variety
    let baseIngredients: FoodItem[] = [];
    
    if (pantry.length > 0) {
      // Auto-select from pantry - use 2-4 items for variety
      const numItems = Math.min(pantry.length, Math.max(2, Math.floor(pantry.length * 0.6)));
      const shuffled = [...pantry].sort(() => Math.random() - 0.5);
      baseIngredients = shuffled.slice(0, numItems);
    } else {
      alert("Please add ingredients to your pantry first! Click 'My Pantry' to add items.");
      return;
    }

    if (baseIngredients.length === 0) {
      alert("Please add items to your pantry!");
      return;
    }

    setIsGenerating(true);
    try {
      // Generate 3-5 different meal variations
      const numVariations = Math.min(5, Math.max(3, Math.floor(baseIngredients.length * 0.8) + 1));
      const variations: Recipe[] = [];

      for (let i = 0; i < numVariations; i++) {
        // Create variations by using different combinations of ingredients
        let ingredientsToUse: FoodItem[] = [];
        
        if (i === 0) {
          // First variation: use all selected ingredients
          ingredientsToUse = [...baseIngredients];
        } else {
          // Other variations: create different combinations
          const shuffled = [...baseIngredients].sort(() => Math.random() - 0.5);
          const numItems = Math.max(2, Math.floor(baseIngredients.length * (0.6 + Math.random() * 0.3)));
          ingredientsToUse = shuffled.slice(0, numItems);
        }

        // Calculate total macros
        const totalMacros = ingredientsToUse.reduce((acc, food) => {
          acc.calories += food.calories;
          acc.protein += food.proteinGrams;
          acc.carbs += food.carbGrams;
          acc.fats += food.fatGrams;
          return acc;
        }, { calories: 0, protein: 0, carbs: 0, fats: 0 });

        // Generate cooking instructions based on ingredients
        const instructions = generateCookingInstructions(ingredientsToUse, mealType);
        const recipeName = generateRecipeName(ingredientsToUse, mealType, i);

        const newRecipe: Recipe = {
          id: `temp-${Date.now()}-${i}`,
          name: recipeName,
          mealType,
          ingredients: ingredientsToUse.map(f => ({ ...f })),
          instructions,
          calories: Math.round(totalMacros.calories),
          proteinGrams: Math.round(totalMacros.protein * 10) / 10,
          carbGrams: Math.round(totalMacros.carbs * 10) / 10,
          fatGrams: Math.round(totalMacros.fats * 10) / 10,
          servings: 1,
          createdAt: new Date().toISOString(),
        };

        variations.push(newRecipe);
      }

      setGeneratedRecipes(variations);
      setCurrentRecipeIndex(0);
      setShowIntro(false);
    } catch (error) {
      console.error("Error generating recipe:", error);
      alert("Failed to generate recipe. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveRecipe = (recipe: Recipe) => {
    if (!recipe) return;
    // Create recipe without temp id for saving
    const { id, ...recipeToSave } = recipe;
    addRecipe(recipeToSave);
    // Remove the saved recipe from the list
    const updatedRecipes = generatedRecipes.filter(r => r.id !== recipe.id);
    setGeneratedRecipes(updatedRecipes);
    // If we removed the current recipe, adjust index
    if (updatedRecipes.length > 0) {
      setCurrentRecipeIndex(prev => Math.min(prev, updatedRecipes.length - 1));
    } else {
      setCurrentRecipeIndex(0);
    }
  };

  const handleDeleteRecipe = (recipe: Recipe) => {
    const updatedRecipes = generatedRecipes.filter(r => r.id !== recipe.id);
    setGeneratedRecipes(updatedRecipes);
    if (updatedRecipes.length > 0) {
      setCurrentRecipeIndex(prev => Math.min(prev, updatedRecipes.length - 1));
    } else {
      setCurrentRecipeIndex(0);
    }
  };

  const currentRecipe = generatedRecipes[currentRecipeIndex];

  const handleAddToDiary = (recipe: Recipe) => {
    const today = new Date().toISOString().slice(0, 10);
    
    // Create a combined food item for the recipe
    const recipeFood: FoodItem = {
      id: crypto.randomUUID(),
      name: recipe.name,
      servingSize: `${recipe.servings} serving(s)`,
      calories: recipe.calories,
      proteinGrams: recipe.proteinGrams,
      carbGrams: recipe.carbGrams,
      fatGrams: recipe.fatGrams,
    };

    addDiaryEntry({
      date: today,
      meal: recipe.mealType,
      food: recipeFood,
      quantity: 1,
    });

    alert(`${recipe.name} added to your diary!`);
  };

  const handleShowNutrition = (recipe: Recipe) => {
    setSelectedRecipeForNutrition(recipe);
    setShowNutritionModal(true);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <h1 className="text-2xl font-bold">Your Kitchen</h1>

      <div className="flex w-full items-center justify-center py-4">
        <img src="/FridgeImage.png" alt="Fridge" width={360} height={360} className="opacity-90" />
      </div>

      <div className="flex gap-4">
        <button className="rounded-md bg-white/10 px-6 py-3 text-base font-medium hover:bg-white/15" onClick={() => setShowPantryModal(true)}>My Pantry</button>
        <button className="rounded-md bg-white/10 px-6 py-3 text-base font-medium hover:bg-white/15" onClick={() => setShowCookbookModal(true)}>My Cookbook</button>
      </div>

      {showIntro && (
        <div className="rounded-lg border border-cyan-500/30 bg-cyan-950/20 p-6">
          <h2 className="mb-3 text-lg font-semibold text-cyan-300">Welcome to Your Kitchen!</h2>
          <p className="text-sm text-neutral-300 mb-2">
            This is an AI agent pulling from the best recipe and bodybuilding recipe cookbooks on the planet.
          </p>
          <p className="text-sm text-neutral-300 mb-4">
            Choose the foods in your kitchen, select a meal type (breakfast, lunch, dinner, or snack), and create delicious meals with the ingredients provided.
          </p>
          <button
            onClick={() => setShowIntro(false)}
            className="rounded-md bg-cyan-500/20 px-4 py-2 text-sm text-cyan-300 hover:bg-cyan-500/25"
          >
            Get Started
          </button>
        </div>
      )}

      {/* All Ingredients Section - Full Width */}
      <div className="space-y-4 w-full animate-fadeIn">
        <h2 className="text-xl font-bold text-cyan-300">All Ingredients</h2>
        {pantry.length === 0 ? (
          <p className="text-sm text-neutral-500">No ingredients yet. Click "My Pantry" above to add items to your kitchen.</p>
        ) : (
          <div className="w-full overflow-x-auto pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            <div className="flex gap-4" style={{ width: 'max-content' }}>
                  {allIngredients.map((food, idx) => (
                    <div
                      key={food.id}
                      className="flex-shrink-0 w-[calc((100vw-8rem)/6)] md:w-[calc((100vw-12rem)/6)] lg:w-[calc((100vw-16rem)/6)] min-w-[160px] max-w-[200px] rounded-lg border border-neutral-800 bg-neutral-900 p-4 space-y-3 transition-all hover:border-neutral-700 hover:bg-neutral-800 hover:scale-105 animate-fadeIn"
                      style={{ animationDelay: `${idx * 50}ms` }}
                    >
                  <div>
                    <div className="font-semibold text-neutral-200 text-base truncate" title={food.name}>{food.name}</div>
                    <div className="text-sm text-neutral-400">{food.servingSize}</div>
                  </div>
                  <div className="flex flex-wrap gap-2 text-sm">
                    <MacroBadge label="kcal" value={food.calories} color="bg-blue-500/20 text-blue-300" />
                    <MacroBadge label="P" value={food.proteinGrams} color="bg-emerald-500/20 text-emerald-300" />
                    <MacroBadge label="C" value={food.carbGrams} color="bg-amber-500/20 text-amber-300" />
                    <MacroBadge label="F" value={food.fatGrams} color="bg-pink-500/20 text-pink-300" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Left Column: Meal Type Selection */}
        <div className="space-y-4">

          {/* Meal Type Selection */}
          <div>
            <h2 className="mb-3 text-xl font-bold text-emerald-300">Meal Type</h2>
            <select
              className="w-full rounded-md border border-neutral-800 bg-neutral-900 p-3"
              value={mealType}
              onChange={(e) => setMealType(e.target.value as MealType)}
            >
              <option value="breakfast">Breakfast</option>
              <option value="lunch">Lunch</option>
              <option value="dinner">Dinner</option>
              <option value="snack">Snack</option>
            </select>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerateRecipe}
            disabled={pantry.length === 0 || isGenerating}
            className="w-full rounded-md bg-cyan-500/20 px-4 py-3 text-sm font-medium text-cyan-300 hover:bg-cyan-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? "Generating Recipe..." : "Generate Recipe"}
          </button>
        </div>

        {/* Right Column: Generated Recipe */}
        <div className="space-y-4">
          {currentRecipe && generatedRecipes.length > 0 && (
            <div className="space-y-4 rounded-lg border border-emerald-500/30 bg-emerald-950/20 p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h2 className="mb-2 text-xl font-bold text-emerald-300">{currentRecipe.name}</h2>
                  <div className="text-sm text-neutral-400 capitalize">Meal Type: {currentRecipe.mealType}</div>
                </div>
                {generatedRecipes.length > 1 && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentRecipeIndex(prev => (prev > 0 ? prev - 1 : generatedRecipes.length - 1))}
                      className="rounded-md bg-white/10 px-3 py-1 text-sm hover:bg-white/15 disabled:opacity-50"
                      disabled={generatedRecipes.length <= 1}
                    >
                      ←
                    </button>
                    <span className="text-xs text-neutral-400">
                      {currentRecipeIndex + 1} / {generatedRecipes.length}
                    </span>
                    <button
                      onClick={() => setCurrentRecipeIndex(prev => (prev < generatedRecipes.length - 1 ? prev + 1 : 0))}
                      className="rounded-md bg-white/10 px-3 py-1 text-sm hover:bg-white/15 disabled:opacity-50"
                      disabled={generatedRecipes.length <= 1}
                    >
                      →
                    </button>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <MacroBadge label="kcal" value={currentRecipe.calories} color="bg-blue-500/20 text-blue-300" />
                <MacroBadge label="P" value={currentRecipe.proteinGrams} color="bg-emerald-500/20 text-emerald-300" />
                <MacroBadge label="C" value={currentRecipe.carbGrams} color="bg-amber-500/20 text-amber-300" />
                <MacroBadge label="F" value={currentRecipe.fatGrams} color="bg-pink-500/20 text-pink-300" />
              </div>

              <button
                onClick={() => handleShowNutrition(currentRecipe)}
                className="rounded-md bg-cyan-500/20 px-3 py-2 text-sm text-cyan-300 hover:bg-cyan-500/25"
              >
                View Full Nutrition Facts
              </button>

              <div>
                <h3 className="mb-2 text-sm font-semibold text-neutral-300">Ingredients Used:</h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-neutral-400">
                  {currentRecipe.ingredients.map((ing, i) => (
                    <li key={i}>{ing.name} ({ing.servingSize})</li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="mb-2 text-sm font-semibold text-neutral-300">Cooking Instructions:</h3>
                <ol className="list-decimal list-inside space-y-2 text-sm text-neutral-300">
                  {currentRecipe.instructions.map((step, i) => (
                    <li key={i}>{step}</li>
                  ))}
                </ol>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleSaveRecipe(currentRecipe)}
                  className="flex-1 rounded-md bg-emerald-500/20 px-4 py-2 text-sm font-medium text-emerald-300 hover:bg-emerald-500/25"
                >
                  Save to Cookbook
                </button>
                <button
                  onClick={() => handleDeleteRecipe(currentRecipe)}
                  className="rounded-md bg-red-500/20 px-4 py-2 text-sm font-medium text-red-300 hover:bg-red-500/25"
                >
                  Delete
                </button>
              </div>
            </div>
          )}

          {/* Custom meal creation moved to My Cookbook modal */}
        </div>
      </div>

      {/* Cookbook */}
      {cookbook.length > 0 && (
        <div className="space-y-4 animate-fadeIn">
          <h2 className="text-xl font-bold text-purple-300">Recent Recipes</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {cookbook.map((recipe, idx) => (
              <div
                key={recipe.id}
                className="space-y-3 rounded-lg border border-neutral-800 bg-neutral-900 p-4 transition-all hover:border-neutral-700 hover:shadow-lg hover:scale-[1.02] animate-fadeIn"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div>
                  <h3 className="font-semibold text-neutral-200">{recipe.name}</h3>
                  <div className="text-xs text-neutral-400 capitalize">{recipe.mealType}</div>
                </div>

                <div className="flex gap-2 flex-wrap">
                  <MacroBadge label="kcal" value={recipe.calories} color="bg-blue-500/20 text-blue-300" />
                  <MacroBadge label="P" value={recipe.proteinGrams} color="bg-emerald-500/20 text-emerald-300" />
                  <MacroBadge label="C" value={recipe.carbGrams} color="bg-amber-500/20 text-amber-300" />
                  <MacroBadge label="F" value={recipe.fatGrams} color="bg-pink-500/20 text-pink-300" />
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleShowNutrition(recipe)}
                    className="flex-1 rounded-md bg-cyan-500/20 px-3 py-2 text-xs text-cyan-300 hover:bg-cyan-500/25"
                  >
                    Nutrition
                  </button>
                  <button
                    onClick={() => handleAddToDiary(recipe)}
                    className="flex-1 rounded-md bg-emerald-500/20 px-3 py-2 text-xs text-emerald-300 hover:bg-emerald-500/25"
                  >
                    Add to Diary
                  </button>
                  <button
                    onClick={() => removeRecipe(recipe.id)}
                    className="rounded-md bg-red-500/20 px-3 py-2 text-xs text-red-300 hover:bg-red-500/25"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pantry Modal */}
      {showPantryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setShowPantryModal(false)}>
          <div className="w-full max-w-3xl rounded-xl border border-neutral-700 bg-neutral-900 p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">My Pantry</h2>
              <button onClick={() => setShowPantryModal(false)} className="text-neutral-400 hover:text-neutral-200">×</button>
            </div>
            <div className="relative mb-3 grid grid-cols-1 gap-2 rounded-lg border border-neutral-800 bg-neutral-950 p-3">
              <input className="rounded-md border border-neutral-800 bg-neutral-900 p-2" placeholder="Ingredient name" value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
              {/* Autocomplete suggestions */}
              {draft.name.trim().length > 0 && (
                <div className="absolute left-3 top-12 z-10 w-[calc(100%-24px)] max-w-md rounded-md border border-neutral-800 bg-neutral-900 p-2 shadow-lg">
                  {FOOD_SUGGESTIONS.filter(s => s.name.toLowerCase().includes(draft.name.toLowerCase())).slice(0,8).map((s, i) => (
                    <button key={i} className="flex w-full items-center justify-between rounded-md px-2 py-2 text-left hover:bg-neutral-800" onClick={() => {
                      setDraft({ name: s.name, servingSize: s.servingSize, calories: s.calories, proteinGrams: s.proteinGrams, carbGrams: s.carbGrams, fatGrams: s.fatGrams });
                    }}>
                      <div>
                        <div className="font-medium">{s.name}</div>
                        <div className="text-xs text-neutral-400">{s.servingSize}</div>
                      </div>
                      <div className="flex gap-2 text-xs">
                        <MacroBadge label="kcal" value={s.calories} color="bg-blue-500/20 text-blue-300" />
                        <MacroBadge label="P" value={s.proteinGrams} color="bg-emerald-500/20 text-emerald-300" />
                        <MacroBadge label="C" value={s.carbGrams} color="bg-amber-500/20 text-amber-300" />
                        <MacroBadge label="F" value={s.fatGrams} color="bg-pink-500/20 text-pink-300" />
                      </div>
                    </button>
                  ))}
                </div>
              )}
              <button
                className="rounded-md bg-white/10 px-3 py-2 text-sm hover:bg-white/15"
                onClick={() => {
                  if (!draft.name) return;
                  const newItem: FoodItem = { id: crypto.randomUUID(), ...draft } as FoodItem;
                  // If user didn't choose a suggestion, ensure sensible defaults
                  if (!newItem.servingSize) newItem.servingSize = "100 g";
                  newItem.calories = newItem.calories ?? 0;
                  newItem.proteinGrams = newItem.proteinGrams ?? 0;
                  newItem.carbGrams = newItem.carbGrams ?? 0;
                  newItem.fatGrams = newItem.fatGrams ?? 0;
                  addPantryItem({
                    name: newItem.name,
                    servingSize: newItem.servingSize,
                    calories: newItem.calories,
                    proteinGrams: newItem.proteinGrams,
                    carbGrams: newItem.carbGrams,
                    fatGrams: newItem.fatGrams,
                  });
                  setDraft({ name: "", servingSize: "100 g", calories: 0, proteinGrams: 0, carbGrams: 0, fatGrams: 0 });
                }}
              >
                Add Ingredient
              </button>
            </div>
            <div className="max-h-[50vh] space-y-2 overflow-y-auto">
              {pantry.map((item) => (
                <div key={item.id} className="flex items-center justify-between rounded-md border border-neutral-800 bg-neutral-950 p-3">
                  <div className="flex-1">
                    <div className="font-medium">{item.name}</div>
                    <div className="text-xs text-neutral-400">{item.servingSize}</div>
                  </div>
                  <div className="flex gap-2 text-xs">
                    <MacroBadge label="kcal" value={item.calories} color="bg-blue-500/20 text-blue-300" />
                    <MacroBadge label="P" value={item.proteinGrams} color="bg-emerald-500/20 text-emerald-300" />
                    <MacroBadge label="C" value={item.carbGrams} color="bg-amber-500/20 text-amber-300" />
                    <MacroBadge label="F" value={item.fatGrams} color="bg-pink-500/20 text-pink-300" />
                  </div>
                  <div className="flex gap-2">
                    <button className="rounded-md bg-white/10 px-2 py-1 text-xs hover:bg-white/15" onClick={() => { setPantryEditFood(item); setPantryEditQty(1); }}>Edit</button>
                    <button className="rounded-md bg-red-500/20 px-2 py-1 text-xs text-red-300 hover:bg-red-500/25" onClick={() => removePantryItem(item.id)}>Delete</button>
                  </div>
                </div>
              ))}
              {pantry.length === 0 && <div className="text-sm text-neutral-500">No pantry items yet.</div>}
            </div>
          </div>
        </div>
      )}

      {/* Cookbook Modal */}
      {showCookbookModal && (
        <CookbookModal pantry={pantry} onSaveRecipe={(r) => addRecipe(r)} onClose={() => setShowCookbookModal(false)} />
      )}

      {/* Pantry Edit Modal reusing NutritionFactsModal */}
      {pantryEditFood && (
        <NutritionFactsModal
          food={pantryEditFood}
          quantity={pantryEditQty}
          onQuantityChange={(q) => setPantryEditQty(q)}
          onSave={(updated) => {
            updatePantryItem(updated);
          }}
          onClose={() => setPantryEditFood(null)}
        />
      )}
      {/* Nutrition Facts Modal for Recipes */}
      {showNutritionModal && selectedRecipeForNutrition && (
        <NutritionFactsModal
          food={{
            id: selectedRecipeForNutrition.id,
            name: selectedRecipeForNutrition.name,
            servingSize: `${selectedRecipeForNutrition.servings} serving(s)`,
            calories: selectedRecipeForNutrition.calories,
            proteinGrams: selectedRecipeForNutrition.proteinGrams,
            carbGrams: selectedRecipeForNutrition.carbGrams,
            fatGrams: selectedRecipeForNutrition.fatGrams,
          }}
          quantity={1}
          onQuantityChange={() => {}}
          onSave={(updated) => {
            // Update the recipe with new nutrition values
            const updatedRecipe: Recipe = {
              ...selectedRecipeForNutrition,
              calories: updated.calories,
              proteinGrams: updated.proteinGrams,
              carbGrams: updated.carbGrams,
              fatGrams: updated.fatGrams,
            };
            updateRecipe(updatedRecipe);
            setShowNutritionModal(false);
            setSelectedRecipeForNutrition(null);
          }}
          onClose={() => {
            setShowNutritionModal(false);
            setSelectedRecipeForNutrition(null);
          }}
        />
      )}
    </div>
  );
}

function CookbookModal({ pantry, onSaveRecipe, onClose }: { pantry: FoodItem[]; onSaveRecipe: (r: Omit<Recipe, "id" | "createdAt">) => void; onClose: () => void }) {
  const cookbook = useAppStore((s) => s.cookbook);
  const updateRecipe = useAppStore((s) => s.updateRecipe);
  const removeRecipe = useAppStore((s) => s.removeRecipe);
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState<{ calories: number; proteinGrams: number; carbGrams: number; fatGrams: number }>({ calories: 0, proteinGrams: 0, carbGrams: 0, fatGrams: 0 });
  const [showBuilder, setShowBuilder] = useState(false);

  const startEdit = (id: string) => {
    const r = cookbook.find((x) => x.id === id);
    if (!r) return;
    setEditing(id);
    setDraft({ calories: r.calories, proteinGrams: r.proteinGrams, carbGrams: r.carbGrams, fatGrams: r.fatGrams });
  };

  const saveEdit = () => {
    if (!editing) return;
    const r = cookbook.find((x) => x.id === editing);
    if (!r) return;
    updateRecipe({ ...r, ...draft });
    setEditing(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
      <div className="w-full max-w-3xl rounded-xl border border-neutral-700 bg-neutral-900 p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">My Cookbook</h2>
          <div className="flex items-center gap-2">
            <button className="rounded-md bg-white/10 px-3 py-1 text-xs hover:bg-white/15" onClick={() => setShowBuilder((v) => !v)}>{showBuilder ? "Close Builder" : "Create Meal"}</button>
            <button onClick={onClose} className="text-neutral-400 hover:text-neutral-200">×</button>
          </div>
        </div>
        {showBuilder && (
          <div className="mb-4">
            <CustomMealBuilder pantry={pantry} onSaveRecipe={(r) => onSaveRecipe(r)} />
          </div>
        )}
        <div className="max-h-[60vh] space-y-3 overflow-y-auto">
          {cookbook.map((r) => (
            <div key={r.id} className="space-y-2 rounded-lg border border-neutral-800 bg-neutral-950 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold">{r.name}</div>
                  <div className="text-xs text-neutral-400 capitalize">{r.mealType}</div>
                </div>
                <div className="flex gap-2">
                  <button className="rounded-md bg-white/10 px-2 py-1 text-xs hover:bg-white/15" onClick={() => startEdit(r.id)}>Edit Macros</button>
                  <button className="rounded-md bg-red-500/20 px-2 py-1 text-xs text-red-300 hover:bg-red-500/25" onClick={() => removeRecipe(r.id)}>Delete</button>
                </div>
              </div>
              <div className="flex gap-2 text-xs">
                <span className="rounded-md bg-blue-500/20 px-2 py-1 text-blue-300">{r.calories} kcal</span>
                <span className="rounded-md bg-emerald-500/20 px-2 py-1 text-emerald-300">P {r.proteinGrams}</span>
                <span className="rounded-md bg-amber-500/20 px-2 py-1 text-amber-300">C {r.carbGrams}</span>
                <span className="rounded-md bg-pink-500/20 px-2 py-1 text-pink-300">F {r.fatGrams}</span>
              </div>
              {editing === r.id && (
                <div className="grid grid-cols-4 gap-2 text-xs">
                  <input className="rounded-md border border-neutral-800 bg-neutral-900 p-2" type="number" value={draft.calories} onChange={(e) => setDraft({ ...draft, calories: Number(e.target.value) })} />
                  <input className="rounded-md border border-neutral-800 bg-neutral-900 p-2" type="number" value={draft.proteinGrams} onChange={(e) => setDraft({ ...draft, proteinGrams: Number(e.target.value) })} />
                  <input className="rounded-md border border-neutral-800 bg-neutral-900 p-2" type="number" value={draft.carbGrams} onChange={(e) => setDraft({ ...draft, carbGrams: Number(e.target.value) })} />
                  <input className="rounded-md border border-neutral-800 bg-neutral-900 p-2" type="number" value={draft.fatGrams} onChange={(e) => setDraft({ ...draft, fatGrams: Number(e.target.value) })} />
                  <div className="col-span-4 flex gap-2">
                    <button className="rounded-md bg-emerald-500/20 px-3 py-2 text-xs text-emerald-300 hover:bg-emerald-500/25" onClick={saveEdit}>Save</button>
                    <button className="rounded-md bg-neutral-700 px-3 py-2 text-xs hover:bg-neutral-600" onClick={() => setEditing(null)}>Cancel</button>
                  </div>
                </div>
              )}
            </div>
          ))}
          {cookbook.length === 0 && <div className="text-sm text-neutral-500">No saved recipes yet.</div>}
        </div>
      </div>
    </div>
  );
}

function CustomMealBuilder({ pantry, onSaveRecipe }: { pantry: FoodItem[]; onSaveRecipe: (r: Omit<Recipe, "id" | "createdAt">) => void }) {
  const [items, setItems] = useState<{ id: string; qty: number }[]>([]);
  const [name, setName] = useState("Custom Meal");

  const addItem = (id: string) => {
    if (!id) return;
    if (items.find(i => i.id === id)) return;
    setItems([...items, { id, qty: 1 }]);
  };

  const removeItem = (id: string) => setItems(items.filter(i => i.id !== id));

  const totals = useMemo(() => {
    return items.reduce((acc, it) => {
      const f = pantry.find(p => p.id === it.id);
      if (!f) return acc;
      acc.calories += f.calories * it.qty;
      acc.protein += f.proteinGrams * it.qty;
      acc.carbs += f.carbGrams * it.qty;
      acc.fats += f.fatGrams * it.qty;
      return acc;
    }, { calories: 0, protein: 0, carbs: 0, fats: 0 });
  }, [items, pantry]);

  const handleSave = () => {
    const ingredients = items.map(it => pantry.find(p => p.id === it.id)).filter(Boolean) as FoodItem[];
    if (ingredients.length === 0) return;
    onSaveRecipe({
      name,
      mealType: "snack",
      ingredients,
      instructions: ["Combine ingredients and cook/serve as desired."],
      calories: Math.round(totals.calories),
      proteinGrams: Math.round(totals.protein * 10) / 10,
      carbGrams: Math.round(totals.carbs * 10) / 10,
      fatGrams: Math.round(totals.fats * 10) / 10,
      servings: 1,
    });
    setItems([]);
  };

  return (
    <div className="space-y-3 rounded-lg border border-neutral-800 bg-neutral-900 p-4">
      <div className="text-sm font-semibold text-neutral-300">Create Custom Meal</div>
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
        <input className="rounded-md border border-neutral-800 bg-neutral-950 p-2" placeholder="Meal name" value={name} onChange={(e) => setName(e.target.value)} />
        <select className="rounded-md border border-neutral-800 bg-neutral-950 p-2" onChange={(e) => addItem(e.target.value)} defaultValue="">
          <option value="" disabled>Add pantry item…</option>
          {pantry.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
      </div>

      <div className="space-y-2">
        {items.map(it => {
          const f = pantry.find(p => p.id === it.id)!;
          return (
            <div key={it.id} className="flex items-center justify-between rounded-md border border-neutral-800 bg-neutral-950 p-3 text-sm">
              <div className="flex-1">
                <div className="font-medium">{f.name}</div>
                <div className="text-xs text-neutral-400">{f.servingSize}</div>
              </div>
              <input type="number" min={0.1} step={0.1} className="w-24 rounded-md border border-neutral-800 bg-neutral-900 p-2 text-right" value={it.qty} onChange={(e) => setItems(items.map(x => x.id === it.id ? { ...x, qty: Number(e.target.value) } : x))} />
              <button className="ml-2 rounded-md bg-red-500/20 px-2 py-1 text-xs text-red-300 hover:bg-red-500/25" onClick={() => removeItem(it.id)}>Remove</button>
            </div>
          );
        })}
        {items.length === 0 && <div className="text-xs text-neutral-500">No items added yet.</div>}
      </div>

      <div className="flex flex-wrap items-center gap-2 text-xs">
        <MacroBadge label="kcal" value={totals.calories} color="bg-blue-500/20 text-blue-300" />
        <MacroBadge label="P" value={totals.protein} color="bg-emerald-500/20 text-emerald-300" />
        <MacroBadge label="C" value={totals.carbs} color="bg-amber-500/20 text-amber-300" />
        <MacroBadge label="F" value={totals.fats} color="bg-pink-500/20 text-pink-300" />
      </div>

      <button className="w-full rounded-md bg-emerald-500/20 px-4 py-2 text-sm font-semibold text-emerald-300 hover:bg-emerald-500/25" onClick={handleSave} disabled={items.length === 0}>Save Meal to Cookbook</button>
    </div>
  );
}

function MacroBadge({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs ${color}`}>
      <span className="opacity-80">{label}</span>
      <span className="font-semibold">{value.toFixed(value % 1 === 0 ? 0 : 1)}</span>
    </span>
  );
}

// Helper functions to generate recipe content
function generateRecipeName(ingredients: FoodItem[], mealType: MealType, variationIndex: number = 0): string {
  const mainIngredients = ingredients.map(i => i.name.split(',')[0].trim().toLowerCase());
  
  // Create more creative recipe names based on ingredients
  const proteinKeywords = ['chicken', 'turkey', 'beef', 'pork', 'fish', 'salmon', 'tuna', 'egg', 'eggs', 'tofu', 'tempeh'];
  const carbKeywords = ['rice', 'pasta', 'bread', 'potato', 'quinoa', 'oats', 'oatmeal'];
  const vegKeywords = ['broccoli', 'spinach', 'lettuce', 'tomato', 'onion', 'pepper', 'carrot', 'cucumber'];
  
  const hasProtein = mainIngredients.some(i => proteinKeywords.some(k => i.includes(k)));
  const hasCarb = mainIngredients.some(i => carbKeywords.some(k => i.includes(k)));
  const hasVeg = mainIngredients.some(i => vegKeywords.some(k => i.includes(k)));
  
  const variationSuffixes = ['', ' Deluxe', ' Supreme', ' Classic', ' Special'];
  const suffix = variationSuffixes[variationIndex] || '';
  
  if (ingredients.length === 1) {
    return `${mainIngredients[0].charAt(0).toUpperCase() + mainIngredients[0].slice(1)} Power Bowl${suffix}`;
  } else if (ingredients.length === 2) {
    return `${mainIngredients[0].charAt(0).toUpperCase() + mainIngredients[0].slice(1)} & ${mainIngredients[1].charAt(0).toUpperCase() + mainIngredients[1].slice(1)} Fusion${suffix}`;
  } else if (hasProtein && hasCarb && hasVeg) {
    return `Balanced ${mealType.charAt(0).toUpperCase() + mealType.slice(1)} Bowl${suffix}`;
  } else if (hasProtein && hasCarb) {
    return `Protein-Packed ${mealType.charAt(0).toUpperCase() + mealType.slice(1)}${suffix}`;
  } else if (hasProtein) {
    return `High-Protein ${mealType.charAt(0).toUpperCase() + mealType.slice(1)} Plate${suffix}`;
  } else {
    const first = mainIngredients[0].charAt(0).toUpperCase() + mainIngredients[0].slice(1);
    const second = mainIngredients[1]?.charAt(0).toUpperCase() + mainIngredients[1]?.slice(1) || '';
    return second ? `${first} & ${second} ${mealType.charAt(0).toUpperCase() + mealType.slice(1)}${suffix}` : `${first} Bowl${suffix}`;
  }
}

function generateCookingInstructions(ingredients: FoodItem[], mealType: MealType): string[] {
  const instructions: string[] = [];
  const ingredientNames = ingredients.map(i => i.name.split(',')[0].trim());
  const mainIngredient = ingredientNames[0];
  
  // Detect ingredient types for better instructions
  const hasProtein = ingredients.some(i => {
    const name = i.name.toLowerCase();
    return name.includes('chicken') || name.includes('turkey') || name.includes('beef') || 
           name.includes('pork') || name.includes('fish') || name.includes('salmon') || 
           name.includes('tuna') || name.includes('egg');
  });
  const hasGrains = ingredients.some(i => {
    const name = i.name.toLowerCase();
    return name.includes('rice') || name.includes('pasta') || name.includes('quinoa') || name.includes('oats');
  });
  
  if (mealType === "breakfast") {
    if (hasProtein) {
      instructions.push("Heat a non-stick pan over medium heat with a small amount of oil.");
      instructions.push(`Cook the protein component (${mainIngredient}) first until golden and cooked through.`);
      if (ingredients.length > 1) {
        instructions.push(`Add remaining ingredients and cook together for 2-3 minutes.`);
      }
      instructions.push("Season with salt, pepper, and your favorite herbs.");
      instructions.push("Serve hot for a nutritious start to your day!");
    } else {
      instructions.push("Combine all ingredients in a bowl.");
      instructions.push("Mix well until evenly distributed.");
      instructions.push("If using oats or grains, let sit for a few minutes to absorb flavors.");
      instructions.push("Enjoy your healthy breakfast!");
    }
  } else if (mealType === "lunch" || mealType === "dinner") {
    instructions.push("Prepare all ingredients: wash vegetables, cut proteins if needed, and measure grains.");
    if (hasProtein) {
      instructions.push("Cook the protein first in a pan or skillet over medium-high heat until browned.");
    }
    if (hasGrains) {
      instructions.push("If using grains, prepare according to package instructions or heat through.");
    }
    if (ingredients.length > 2) {
      instructions.push(`Combine all ingredients in a large pan or bowl and mix well.`);
    } else {
      instructions.push(`Combine ${ingredientNames.join(' and ')} together.`);
    }
    instructions.push("Adjust seasoning with salt, pepper, and herbs to taste.");
    instructions.push("Plate and serve warm. Enjoy your balanced meal!");
  } else {
    instructions.push(`Prepare your ingredients: ${ingredientNames.join(', ')}.`);
    if (ingredients.length === 1) {
      instructions.push("Portion into convenient snack-sized servings.");
    } else {
      instructions.push("Mix or combine ingredients in a bowl.");
      instructions.push("Portion into snack-sized servings for easy grab-and-go.");
    }
    instructions.push("Store in an airtight container if not consuming immediately.");
    instructions.push("Enjoy your healthy snack!");
  }
  
  return instructions;
}

