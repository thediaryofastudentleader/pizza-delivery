import React, { createContext, useContext, useState, useMemo } from "react";

const PizzaContext = createContext(null);

/* ---------- CONFIG ---------- */
const BASE_PRICE = 8; // dollars
const TAX_RATE = 0.1;
const INGREDIENT_COST = {
  "Tomato Sauce": 0.5,
  Mozzarella: 1,
  "Shredded Chicken": 1.5,
  "Sliced Mushrooms": 0.75,
  "Ground Beef": 1.25,
  Pineapple: 0.6,
  Pepperoni: 1,
};

const PIZZA_MENU = [
  { id: "margherita", name: "Classic Margherita", ingredients: ["Tomato Sauce", "Mozzarella"] },
  { id: "chicken_mushroom", name: "Chicken & Mushroom", ingredients: ["Tomato Sauce", "Mozzarella", "Shredded Chicken", "Sliced Mushrooms"] },
  { id: "regina", name: "Regina", ingredients: ["Tomato Sauce", "Mozzarella", "Mushroom", "Ham"] },
  { id: "hawaiian", name: "Hawaiian", ingredients: ["Tomato Sauce", "Mozzarella", "Ham", "Pineapple"] },
  { id: "beef_feast", name: "Beef Feast", ingredients: ["Tomato Sauce", "Mozzarella", "Ground Beef"] },
];

export const PizzaProvider = ({ children }) => {
  const [appliedIngredients, setAppliedIngredients] = useState([]);
  const [matchedPizza, setMatchedPizza] = useState(null);
  const [price, setPrice] = useState(0);
  const [form, setForm] = useState({ name: "", phone: "", address: "" });
  const [showDispatchModal, setShowDispatchModal] = useState(false);

  const addIngredient = (ing) => {
    setAppliedIngredients((prev) =>
      prev.includes(ing) ? prev : [...prev, ing]
    );
  };

  const removeIngredient = (ing) => {
    setAppliedIngredients((prev) => prev.filter((i) => i !== ing));
  };

  const reset = () => {
    setAppliedIngredients([]);
    setMatchedPizza(null);
    setPrice(0);
    setForm({ name: "", phone: "", address: "" });
  };

  // ---- Matching & price (runs whenever ingredients change) ----
  useMemo(() => {
    const sorted = [...appliedIngredients].sort();
    const match = PIZZA_MENU.find((p) => {
      const m = [...p.ingredients].sort();
      return (
        m.length === sorted.length &&
        m.every((v, i) => v === sorted[i])
      );
    });
    setMatchedPizza(match);
    const total =
      BASE_PRICE +
      appliedIngredients.reduce(
        (sum, ing) => sum + (INGREDIENT_COST[ing] || 0),
        0
      );
    setPrice(total);
  }, [appliedIngredients]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowDispatchModal(true);
    setTimeout(() => {
      reset();
      setShowDispatchModal(false);
    }, 2500);
  };

  const value = {
    appliedIngredients,
    addIngredient,
    removeIngredient,
    matchedPizza,
    price,
    tax: price * TAX_RATE,
    form,
    setForm,
    handleSubmit,
    showDispatchModal,
  };

  return <PizzaContext.Provider value={value}>{children}</PizzaContext.Provider>;
};

export const usePizza = () => useContext(PizzaContext);
