/* eslint-disable react-hooks/exhaustive-deps */
import React, { createContext, useContext, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* -------------------------------------------------------------------------- */
/* CONFIG                                                                     */
/* -------------------------------------------------------------------------- */

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

/* -------------------------------------------------------------------------- */
/* CONTEXT                                                                    */
/* -------------------------------------------------------------------------- */

const PizzaContext = createContext(null);

const PizzaProvider = ({ children }) => {
  const [appliedIngredients, setAppliedIngredients] = useState([]);
  const [matchedPizza, setMatchedPizza] = useState(null);
  const [price, setPrice] = useState(0);
  const [form, setForm] = useState({ name: "", phone: "", address: "" });
  const [showDispatchModal, setShowDispatchModal] = useState(false);

  // ---- helpers -----------------------------------------------------------
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

  // ---- matching & price (runs whenever ingredients change) ---------------
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

  // ---- submit handler ----------------------------------------------------
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

const usePizza = () => useContext(PizzaContext);

/* -------------------------------------------------------------------------- */
/* DRAG‑AND‑DROP UTILS (HTML5 API)                                            */
/* -------------------------------------------------------------------------- */

const DRAG_TYPE = "PIZZA_INGREDIENT";

const onDragStart = (e, name) => {
  e.dataTransfer.setData(DRAG_TYPE, name);
  e.dataTransfer.effectAllowed = "copy";
};

const onDragOver = (e) => {
  e.preventDefault();
  e.dataTransfer.dropEffect = "copy";
};

const onDrop = (e, callback) => {
  e.preventDefault();
  const name = e.dataTransfer.getData(DRAG_TYPE);
  if (name) callback(name);
};

/* -------------------------------------------------------------------------- */
/* COMPONENTS                                                                 */
/* -------------------------------------------------------------------------- */

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

const Ingredient = ({ name }) => (
  <div
    draggable
    onDragStart={(e) => onDragStart(e, name)}
    className="flex items-center gap-2 p-3 mb-2 bg-white border border-gray-300 rounded-lg shadow cursor-move hover:bg-gray-50 active:scale-95 transition"
  >
    <span className="text-2xl">{ingredientEmoji(name)}</span>
    <span className="text-sm font-medium">{name}</span>
  </div>
);

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
        <Ingredient key={i} name={i} />
      ))}
    </div>
  );
};

const Topping = ({ name, idx }) => {
  const colorMap = {
    "Shredded Chicken": "bg-amber-600",
    "Sliced Mushrooms": "bg-stone-500",
    "Ground Beef": "bg-red-900",
    Pineapple: "bg-yellow-400",
    Pepperoni: "bg-red-700",
  };
  const positions = [
    { left: "20%", top: "25%" },
    { left: "70%", top: "30%" },
    { left: "35%", top: "60%" },
    { left: "65%", top: "70%" },
    { left: "50%", top: "20%" },
    { left: "30%", top: "40%" },
    { left: "70%", top: "50%" },
    { left: "45%", top: "45%" },
  ];
  const pos = positions[idx % positions.length];
  return (
    <motion.div
      key={name + idx}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 12 }}
      className={`absolute w-6 h-6 rounded-full border border-white ${colorMap[name] || "bg-gray-400"}`}
      style={{ left: pos.left, top: pos.top }}
    />
  );
};

const PizzaCanvas = () => {
  const { appliedIngredients, addIngredient } = usePizza();
  const [isOver, setIsOver] = useState(false);

  const handleDrop = (e) => {
    setIsOver(false);
    onDrop(e, (name) => addIngredient(name));
  };

  return (
    <div
      onDragOver={(e) => {
        onDragOver(e);
        setIsOver(true);
      }}
      onDragLeave={() => setIsOver(false)}
      onDrop={handleDrop}
      className={`relative w-full h-96 rounded-2xl border-4 border-dashed transition-all duration-300 flex items-center justify-center ${
        isOver ? "border-green-500 bg-green-50" : "border-gray-300 bg-gray-100"
      }`}
    >
      <div className="relative w-72 h-72 rounded-full bg-yellow-200 shadow-inner flex items-center justify-center">
        <div className="absolute inset-0 rounded-full bg-yellow-200" />
        {appliedIngredients.includes("Tomato Sauce") && (
          <motion.div
            key="sauce"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="absolute inset-3 rounded-full bg-red-600"
          />
        )}
        {appliedIngredients.includes("Mozzarella") && (
          <motion.div
            key="cheese"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.9 }}
            className="absolute inset-5 rounded-full bg-yellow-300"
          />
        )}
        {appliedIngredients
          .filter((i) => i !== "Tomato Sauce" && i !== "Mozzarella")
          .map((name, idx) => (
            <Topping key={name + idx} name={name} idx={idx} />
          ))}
      </div>
      {appliedIngredients.length === 0 && (
        <p className="absolute bottom-4 text-gray-500 italic">Drop ingredients here</p>
      )}
    </div>
  );
};

const SuccessBanner = () => {
  const { matchedPizza, price, appliedIngredients } = usePizza();
  if (!matchedPizza || appliedIngredients.length === 0) return null;
  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -20, opacity: 0 }}
        className="mt-4 p-3 bg-green-100 text-green-800 rounded-lg text-center font-semibold"
      >
        🎉 You've built our {matchedPizza.name}! – ${price.toFixed(2)}
      </motion.div>
    </AnimatePresence>
  );
};

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
          {appliedIngredients.length
            ? appliedIngredients.join(", ")
            : "None"}
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

const CheckoutForm = () => {
  const { form, setForm, handleSubmit, price } = usePizza();
  const canSubmit = price > BASE_PRICE; // at least one topping
  return (
    <form
      onSubmit={handleSubmit}
      className="w-full bg-white p-4 rounded-xl shadow-md space-y-3"
    >
      <h2 className="font-bold text-lg">Delivery Details</h2>
      <input
        type="text"
        placeholder="Name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        required
        className="w-full p-2 border border-gray-300 rounded"
      />
      <input
        type="tel"
        placeholder="Phone"
        value={form.phone}
        onChange={(e) => setForm({ ...form, phone: e.target.value })}
        required
        className="w-full p-2 border border-gray-300 rounded"
      />
      <input
        type="text"
        placeholder="Address"
        value={form.address}
        onChange={(e) => setForm({ ...form, address: e.target.value })}
        required
        className="w-full p-2 border border-gray-300 rounded"
      />
      <button
        type="submit"
        disabled={!canSubmit}
        className="w-full py-2 bg-red-500 text-white font-semibold rounded disabled:opacity-50 hover:bg-red-600 transition"
      >
        Place Order
      </button>
    </form>
  );
};

const DispatchModal = () => {
  const { showDispatchModal } = usePizza();
  return (
    <AnimatePresence>
      {showDispatchModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.5, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.5, y: 20 }}
            className="bg-white p-6 rounded-2xl shadow-2xl text-center max-w-sm"
          >
            <div className="text-5xl mb-3">🚀</div>
            <h3 className="text-xl font-bold mb-2">Order Dispatched!</h3>
            <p className="text-gray-600">Your pizza is in the oven.</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

/* -------------------------------------------------------------------------- */
/* APP                                                                        */
/* -------------------------------------------------------------------------- */

export default function App() {
  return (
    <PizzaProvider>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 p-4">
        <header className="text-center mb-6">
          <h1 className="text-3xl font-extrabold text-red-600">🍕 Pizza Builder</h1>
          <p className="text-sm text-gray-600">
            Drag ingredients to craft your pie
          </p>
        </header>

        <main className="max-w-5xl mx-auto grid gap-4 md:grid-cols-2">
          {/* Left: Asset Drawer */}
          <section className="bg-white p-4 rounded-xl shadow-md">
            <AssetDrawer />
          </section>

          {/* Right: Pizza Canvas + Success Banner */}
          <section>
            <PizzaCanvas />
            <SuccessBanner />
          </section>

          {/* Order Summary – spans both columns */}
          <section className="md:col-span-2">
            <OrderSummary />
          </section>

          {/* Checkout Form – spans both columns */}
          <section className="md:col-span-2">
            <CheckoutForm />
          </section>
        </main>

        <DispatchModal />
      </div>
    </PizzaProvider>
  );
}

