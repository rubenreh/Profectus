"use client";
import { useState } from "react";
import type { FoodItem } from "@/lib/types";

interface NutritionFactsModalProps {
  food: FoodItem;
  quantity: number;
  onSave: (food: FoodItem) => void;
  onClose: () => void;
  onQuantityChange: (qty: number) => void;
}

export function NutritionFactsModal({ food, quantity, onSave, onClose, onQuantityChange }: NutritionFactsModalProps) {
  const [edited, setEdited] = useState<FoodItem>(food);

  const handleSave = () => {
    onSave(edited);
    onClose();
  };

  const perServing = {
    calories: edited.calories,
    protein: edited.proteinGrams,
    carbs: edited.carbGrams,
    fats: edited.fatGrams,
    sugars: edited.sugarsGrams ?? 0,
    fiber: edited.fiberGrams ?? 0,
    sodium: edited.sodiumMg ?? 0,
    satFat: edited.saturatedFatGrams ?? 0,
    transFat: edited.transFatGrams ?? 0,
    cholesterol: edited.cholesterolMg ?? 0,
  };

  const totals = {
    calories: perServing.calories * quantity,
    protein: perServing.protein * quantity,
    carbs: perServing.carbs * quantity,
    fats: perServing.fats * quantity,
    sugars: perServing.sugars * quantity,
    fiber: perServing.fiber * quantity,
    sodium: perServing.sodium * quantity,
    satFat: perServing.satFat * quantity,
    transFat: perServing.transFat * quantity,
    cholesterol: perServing.cholesterol * quantity,
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
      <div className="w-full max-w-md rounded-xl border border-neutral-700 bg-neutral-900 p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">Nutrition Facts</h2>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-200">×</button>
        </div>

        <div className="mb-4 space-y-2">
          <input
            type="text"
            value={edited.name}
            onChange={(e) => setEdited({ ...edited, name: e.target.value })}
            className="w-full rounded-md border border-neutral-700 bg-neutral-950 p-2 font-semibold"
            placeholder="Food name"
          />
          <input
            type="text"
            value={edited.servingSize}
            onChange={(e) => setEdited({ ...edited, servingSize: e.target.value })}
            className="w-full rounded-md border border-neutral-700 bg-neutral-950 p-2 text-sm"
            placeholder="Serving size"
          />
          <div className="flex items-center gap-2">
            <span className="text-sm text-neutral-400">Quantity:</span>
            <input
              type="number"
              min={0.1}
              step={0.1}
              value={quantity}
              onChange={(e) => onQuantityChange(Number(e.target.value))}
              className="w-20 rounded-md border border-neutral-700 bg-neutral-950 p-2 text-sm"
            />
          </div>
        </div>

        <div className="space-y-3 rounded-lg border border-neutral-800 bg-neutral-950 p-4">
          <div className="border-b border-neutral-700 pb-2">
            <div className="mb-2 text-xs text-neutral-400">Per {edited.servingSize}</div>
            <div className="flex items-center gap-2">
              <span className="text-sm">Calories</span>
              <input
                type="number"
                value={perServing.calories}
                onChange={(e) => setEdited({ ...edited, calories: Number(e.target.value) })}
                className="w-24 rounded border border-neutral-700 bg-neutral-900 p-1 text-right"
              />
              <span className="text-sm">kcal</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex justify-between">
              <span>Total Fat</span>
              <span className="font-semibold">{perServing.fats}g</span>
            </div>
            <div className="flex justify-between">
              <input
                type="number"
                value={perServing.fats}
                onChange={(e) => setEdited({ ...edited, fatGrams: Number(e.target.value) })}
                className="w-16 rounded border border-neutral-700 bg-neutral-900 p-1 text-right"
              />
              <span>g</span>
            </div>

            <div className="flex justify-between pl-4 text-xs">
              <span>Saturated Fat</span>
              <span>{perServing.satFat}g</span>
            </div>
            <div className="flex justify-between">
              <input
                type="number"
                value={perServing.satFat}
                onChange={(e) => setEdited({ ...edited, saturatedFatGrams: Number(e.target.value) })}
                className="w-16 rounded border border-neutral-700 bg-neutral-900 p-1 text-right"
              />
              <span>g</span>
            </div>

            <div className="flex justify-between pl-4 text-xs">
              <span>Trans Fat</span>
              <span>{perServing.transFat}g</span>
            </div>
            <div className="flex justify-between">
              <input
                type="number"
                value={perServing.transFat}
                onChange={(e) => setEdited({ ...edited, transFatGrams: Number(e.target.value) })}
                className="w-16 rounded border border-neutral-700 bg-neutral-900 p-1 text-right"
              />
              <span>g</span>
            </div>

            <div className="flex justify-between">
              <span>Cholesterol</span>
              <span className="font-semibold">{perServing.cholesterol}mg</span>
            </div>
            <div className="flex justify-between">
              <input
                type="number"
                value={perServing.cholesterol}
                onChange={(e) => setEdited({ ...edited, cholesterolMg: Number(e.target.value) })}
                className="w-16 rounded border border-neutral-700 bg-neutral-900 p-1 text-right"
              />
              <span>mg</span>
            </div>

            <div className="flex justify-between">
              <span>Sodium</span>
              <span className="font-semibold">{perServing.sodium}mg</span>
            </div>
            <div className="flex justify-between">
              <input
                type="number"
                value={perServing.sodium}
                onChange={(e) => setEdited({ ...edited, sodiumMg: Number(e.target.value) })}
                className="w-16 rounded border border-neutral-700 bg-neutral-900 p-1 text-right"
              />
              <span>mg</span>
            </div>

            <div className="flex justify-between">
              <span>Total Carbs</span>
              <span className="font-semibold">{perServing.carbs}g</span>
            </div>
            <div className="flex justify-between">
              <input
                type="number"
                value={perServing.carbs}
                onChange={(e) => setEdited({ ...edited, carbGrams: Number(e.target.value) })}
                className="w-16 rounded border border-neutral-700 bg-neutral-900 p-1 text-right"
              />
              <span>g</span>
            </div>

            <div className="flex justify-between pl-4 text-xs">
              <span>Dietary Fiber</span>
              <span>{perServing.fiber}g</span>
            </div>
            <div className="flex justify-between">
              <input
                type="number"
                value={perServing.fiber}
                onChange={(e) => setEdited({ ...edited, fiberGrams: Number(e.target.value) })}
                className="w-16 rounded border border-neutral-700 bg-neutral-900 p-1 text-right"
              />
              <span>g</span>
            </div>

            <div className="flex justify-between pl-4 text-xs">
              <span>Total Sugars</span>
              <span>{perServing.sugars}g</span>
            </div>
            <div className="flex justify-between">
              <input
                type="number"
                value={perServing.sugars}
                onChange={(e) => setEdited({ ...edited, sugarsGrams: Number(e.target.value) })}
                className="w-16 rounded border border-neutral-700 bg-neutral-900 p-1 text-right"
              />
              <span>g</span>
            </div>

            <div className="flex justify-between">
              <span>Protein</span>
              <span className="font-semibold">{perServing.protein}g</span>
            </div>
            <div className="flex justify-between">
              <input
                type="number"
                value={perServing.protein}
                onChange={(e) => setEdited({ ...edited, proteinGrams: Number(e.target.value) })}
                className="w-16 rounded border border-neutral-700 bg-neutral-900 p-1 text-right"
              />
              <span>g</span>
            </div>
          </div>

          <div className="mt-4 border-t border-neutral-700 pt-3">
            <div className="mb-2 text-xs text-neutral-400">Total ({quantity} servings)</div>
            <div className="flex justify-between text-sm font-semibold">
              <span>Calories</span>
              <span>{totals.calories.toFixed(0)} kcal</span>
            </div>
            <div className="mt-2 grid grid-cols-4 gap-2 text-xs">
              <div>P: {totals.protein.toFixed(1)}g</div>
              <div>C: {totals.carbs.toFixed(1)}g</div>
              <div>F: {totals.fats.toFixed(1)}g</div>
              <div>Sugars: {totals.sugars.toFixed(1)}g</div>
            </div>
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <button
            onClick={handleSave}
            className="flex-1 rounded-md bg-cyan-500/20 px-4 py-2 text-sm font-semibold text-cyan-300 hover:bg-cyan-500/25"
          >
            Save Changes
          </button>
          <button
            onClick={onClose}
            className="rounded-md bg-neutral-700 px-4 py-2 text-sm hover:bg-neutral-600"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

