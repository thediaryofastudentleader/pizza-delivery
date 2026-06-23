import React, { createContext, useContext, useState, useMemo, useCallback } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { motion, AnimatePresence } from "framer-motion";

// ---------- CONFIG ----------
const BASE_PRICE = 8; // dollars
const INGRED_COST = {
  "Tomato Sauce": 0.5,
  Mozzarella: 1,
  "Shredded Chicken": 1.5,
  "Sliced Mushrooms": 0.75,
  "Ground Beef": 1.25,
  Pineapple: 0.6,
  Pepperoni: 1,
};
const TAX_RATE = 0.1;

const PIZZA_MENU = [
  { id: "margherita", name: "Classic Margherita", ingredients: ["Tomato Sauce", "Mozzarella"] },
  { id: "chicken_mushroom", name: "Chicken & Mushroom", ingredients: ["Tomato Sauce", "Mozzarella", "Shredded Chicken", "Sliced Mushrooms"] },
  { id: "regina", name: "Regina", ingredients: ["Tomato Sauce", "Mozzarella", "Mushroom", "Ham"] }, // Note: Ham & Mushroom not in drawer – will be custom
  { id: "hawaiian", name: "Hawaiian", ingredients: ["Tomato Sauce", "Mozzarella", "Ham", "Pineapple"] },
  { id: "beef_feast", name: "Beef Feast", ingredients: ["Tomato Sauce", "Mozzarella", "Ground Beef"] },
];

// ---------- CONTEXT ----------
const PizzaContext = createContext();

export const PizzaProvider = ({ children }) => {
  const [appliedIngredients, setAppliedIngredients] = useState([]);
  const [showSuccessBanner, setShowSuccessBanner] = useState(false);
  const [matchedPizza, setMatchedPizza] = useState(null);
  const [customPrice, setCustomPrice] = useState(0);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", address: "" });

  // ---- Matching logic ----
  const findMatch = useCallback((ingredients) => {
    const sorted = [...ingredients].sort();
    const match = PIZZA_MENU.find((p) => {
      const menuSorted = [...p.ingredients].sort();
      return (
        menuSorted.length === sorted.length &&
        menuSorted.every((ing, i) => ing === sorted[i])
      );
    });
    return match;
  }, []);

  // Recompute match & price whenever ingredients change
  useMemo(() => {
    const match = findMatch(appliedIngredients);
    setMatchedPizza(match);
    if (match) {
      // official price: base + sum of ingredient costs (as per menu)
      const price = BASE_PRICE + match.ingredients.reduce((sum, ing) => sum + (INGRED_COST[ing] || 0), 0);
      setCustomPrice(price);
      setShowSuccessBanner(true);
    } else {
      const price =
        BASE_PRICE +
        appliedIngredients.reduce((sum, ing) => sum + (INGRED_COST[ing] || 0), 0);
      setCustomPrice(price);
      setShowSuccessBanner(false);
    }
  }, [appliedIngredients, findMatch]);

  // ---- Handlers ----
  const addIngredient = (ing) => {
    // Prevent duplicates for simplicity – you can allow multiples if desired
    if (!appliedIngredients.includes(ing)) {
      setAppliedIngredients((prev) => [...prev, ing]);
    }
  };

  const removeIngredient = (ing) => {
    setAppliedIngredients((prev) => prev.filter((i) => i !== ing));
  };

  const resetPizza = () => {
    setAppliedIngredients([]);
    setShowSuccessBanner(false);
    setMatchedPizza(null);
    setCustomPrice(0);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate order placement
    setShowCheckoutModal(true);
    // Reset after a short delay so the user sees the modal
    setTimeout(() => {
      resetPizza();
      setShowCheckoutModal(false);
      setForm({ name: "", phone: "", address: "" });
    }, 2000);
  };

  const value = {
    appliedIngredients,
    addIngredient,
    removeIngredient,
    matchedPizza,
    customPrice,
    showSuccessBanner,
    showCheckoutModal,
    form,
    setForm,
    handleSubmit,
    resetPizza,
  };

  return <PizzaContext.Provider value={value}>{children}</PizzaContext.Provider>;
};

export const usePizza = () => useContext(PizzaContext);

// ---------- COMPONENTS ----------
const IngredientIcon = ({ name, onDragStart }) => {
  const [{ isDragging }, drag] = useDrag({
    type: "INGREDIENT",
    item: { name },
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  });
  const opacity = isDragging ? 0.5 : 1;
  return (
    <div ref={drag} className="w-12 h-12 flex items-center justify-center rounded border border-gray-300 bg-white shadow m-2 transition-transform" style={{ opacity }}>
      {/* Emoji fallback – you could replace with SVGs */}
      <span className="text-2xl">{ingredientToEmoji(name)}</span>
    </div>
  );
};

const ingredientToEmoji = (name) => {
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

const PizzaCanvas = () => {
  const { appliedIngredients, removeIngredient } = usePizza();
  const [{ isOver }, drop] = useDrop({
    accept: "INGREDIENT",
    drop: (item) => item.name,
    collect: (monitor) => ({ isOver: monitor.isOver() }),
  });

  return (
    <div
      ref={drop}
      className={`relative w-full h-96 bg-gray-100 flex items-center justify-center rounded border-2 border-dashed border-gray-400 transition-all duration-300 ${
        isOver ? "bg-gray-200 scale-105" : ""
      }`}
    >
      {/* Base crust */}
      <div className="absolute w-[80%] h-[80%] bg-[#f5deb3] rounded-full flex items-center justify-center">
        {/* Sauce */}
        {appliedIngredients.includes("Tomato Sauce") && (
          <div className="absolute w-[75%] h-[75%] bg-red-600 opacity-90 rounded-full" />
        )}
        {/* Cheese */}
        {appliedIngredients.includes("Mozzarella") && (
          <div className="absolute w-[70%] h-[70%] bg-yellow-400 opacity-90 rounded-full" />
        )}
        {/* Toppings – simple circles */}
        {appliedIngredients
          .filter(
            (ing) =>
              ing !== "Tomato Sauce" && ing !== "Mozzarella" && ing !== "Ham" && ing !== "Mushroom"
          )
          .map((ing, idx) => {
            const colorMap = {
              "Shredded Chicken": "bg-orange-500",
              "Sliced Mushrooms": "bg-gray-600",
              "Ground Beef": "bg-brown-600",
              Pineapple: "bg-yellow-400",
              Pepperoni: "bg-red-800",
            };
            const size = 12 + idx * 4; // stagger sizes
            return (
              <div
                key={ing}
                className={`absolute w-[${size}%] h-[${size}%] ${colorMap[ing] || "bg-gray-500"] rounded-full`}
                style={{
                  left: `${50 - size / 2}%`,
                  top: `${50 - size / 2}%`,
                }}
              />
            );
          })}
      </div>
    </div>
  );
};

const SuccessBanner = () => {
  const { matchedPizza, customPrice, showSuccessBanner } = usePizza();
  if (!showSuccessBanner || !matchedPizza) return null;
  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -20, opacity: 0 }}
      className="px-4 py-2 mb-4 rounded-lg bg-green-100 text-green-800 text-center font-medium"
    >
      🎉 You've built our {matchedPizza.name}! ${customPrice.toFixed(2)}
    </motion.div>
  );
};

const OrderSummary = () => {
  const { appliedIngredients, matchedPizza, customPrice, showSuccessBanner } = usePizza();
  const subtotal = customPrice;
  const tax = (subtotal * TAX_RATE).toFixed(2);
  const total = (subtotal + parseFloat(tax)).toFixed(2);
  const name = showSuccessBanner && matchedPizza ? matchedPizza.name : "Custom Masterpizza?.name : "Custom Masterpiece";

  return (
    <div className="w-full mt-6 px-4">
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-lg font-semibold mb-2">Order Summary</h2>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Pizza:</span>
            <span className="font-medium">{name}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Ingredients:</span>
            <span>{appliedIngredients.length ? appliedIngredients.join(", ") : "None"}</span>
          </div>
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax (10%):</span>
            <span>${tax}</span>
          </div>
          <div className="flex justify-between font-bold">
            <span>Total:</span>
            <span>${total}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const CheckoutForm = () => {
  const { form, setForm, handleSubmit, showCheckoutModal } = usePizza();
  return (
    <AnimatePresence>
      {showCheckoutModal && (
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.5, opacity: 0 }}
          className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
        >
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            className="bg-white rounded-lg shadow-xl w-full max-w-sm p-6"
          >
            <h2 className="text-xl font-bold mb-4 text-center">Checkout</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Address</label>
                <input
                  type="text"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
              >
                Place Order
              </button>
            </form>
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-4 text-center text-green-600"
            >
              🚀 Your pizza is in the oven!
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const AssetDrawer = () => {
  const ingredients = [
    "Tomato Sauce",
    "Mozzarella",
    "Shredded Chicken",
    "Sliced Mushrooms",
    "Ground Beef",
    "Pineapple",
    "Pepperoni",
  ];
  return (
    <div className="space-y-2">
      <h3 className="font-semibold mb-2">Ingredients</h3>
      <div className="flex flex-wrap">
        {ingredients.map((ing) => (
          <IngredientIcon key={ing} name={ing} />
        ))}
      </div>
    </div>
  );
};

// ---------- MAIN APP ----------
export default function App() {
  return (
    <PizzaProvider>
      <div className="min-h-screen bg-gray-50 p-4">
        <header className="text-center mb-6">
          <h1 className="text-3xl font-bold">🍕 Pizza Builder</h1>
          <p className="text-gray-600">
            Drag ingredients onto the pizza to create your masterpiece!
          </p>
        </header>

        <main className="max-w-4xl mx-auto grid gap-6">
          {/* Responsive layout: stack on small, side‑by‑side on md+ */}
          <div className="md:grid md:grid-cols-[300px_1fr] gap-6">
            {/* Left: Asset Drawer */}
            <section className="bg-white rounded-lg shadow p-4">
              <AssetDrawer />
            </section>

            {/* Right: Pizza Canvas */}
            <section className="relative">
              <PizzaCanvas />
              <SuccessBanner />
            </section>
          </div>

          {/* Order Summary & Checkout (full width) */}
          <div className="bg-white rounded-lg shadow p-4">
            <OrderSummary />
          </div>

          {/* Checkout Form (always visible, but modal appears on submit) */}
          <CheckoutForm />
        </main>

        <footer className="mt-8 text-center text-sm text-gray-500">
          Built with React, Tailwind, React DnD & Framer Motion
        </footer>
      </div>
    </PizzaProvider>
  );
}
