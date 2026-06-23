import React from "react";
import { usePizza } from "../context/PizzaContext";
import { motion, AnimatePresence } from "framer-motion";

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

export default SuccessBanner;

