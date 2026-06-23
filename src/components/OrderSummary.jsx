import React from "react";
import { usePizza } from "../context/PizzaContext";

const OrderSummary = () => {
  const { appliedIngredients, matchedPizza, price, tax } = usePizza();
  const total = price + tax;
  const pizzaName = matchedPizza ? matchedPizza.name : "Custom Masterpiece";

  return (
    <div className="w-full bg-white p-4 rounded-xl shadow-md">
      <h2 className="font-bold text-lg mb-2">Order Summary</h2>
      <div className="text-sm space-y-1">
        <p>
          <span className="font-medium">Pizza:</span> {pizzaName}
        </p>
        <p>
          <span className="font-medium">Ingredients:</span>{" "}
          {appliedIngredients.length ? appliedIngredients.join(", ") : "None"}
        </p>
        <p>
          <span className="font-medium">Subtotal:</span> ${price.toFixed(2)}
        </p>
        <p>
          <span className="font-medium">Tax (10%):</span> ${tax.toFixed(2)}
        </p>
        <p className="font-bold text-base pt-2 border-t">
          Total: ${total.toFixed(2)}
        </p>
      </div>
    </div>
  );
};

export default OrderSummary;

