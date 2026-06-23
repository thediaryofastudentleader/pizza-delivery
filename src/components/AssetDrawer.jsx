import React from "react";
import IngredientIcon from "./IngredientIcon";   // ← default import

const AssetDrawer = () => {
  const items = [
    "Tomato Sauce",
    "Mozzarella",
    "Shredded Chicken",
    "Sliced Mushrooms",
    "Ground Beef",
    "Pineapple",
    "Pepperoni",
  ];
  return (
    <div className="space-y-1">
      <h2 className="font-bold text-lg mb-3 text-center">Ingredients</h2>
      {items.map((i) => (
        <IngredientIcon key={i} name={i} />
      ))}
    </div>
  );
};

export default AssetDrawer;
