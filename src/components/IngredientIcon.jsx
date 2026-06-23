import React from "react";
import { useDraggable } from "../hooks/useDnD";

const ingredientEmoji = (name) => {
  const map = {
    "Tomato Sauce": "🍅",
    Mozzarella: "🧀",
    "Shredded Chicken": "🍗",
    "Sliced Mushrooms": "🍄",
    "Ground Beef": "🥩",
    Pineapple: "🍍",
    Pepperoni: "🌶️",
  };
  return map[name] || "❓";
};

const IngredientIcon = ({ name }) => {
  const ref = useDraggable(name);
  return (
    <div
      ref={ref}
      className="flex items-center gap-2 p-3 mb-2 bg-white border border-gray-300 rounded-lg shadow cursor-move hover:bg-gray-50 active:scale-95 transition"
    >
      <span className="text-2xl">{ingredientEmoji(name)}</span>
      <span className="text-sm font-medium">{name}</span>
    </div>
  );
};

export default IngredientIcon;
