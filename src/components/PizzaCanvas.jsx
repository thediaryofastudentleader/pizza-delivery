import React, { useState } from "react";
import { useDropzone } from "../hooks/useDnD";
import { usePizza } from "../context/PizzaContext";
import Topping from "./Topping";
import { motion } from "framer-motion";

const PizzaCanvas = () => {
  const { appliedIngredients, addIngredient } = usePizza();
  const [isOver, setIsOver] = useState(false);
  const dropRef = useDropzone((name) => {
    setIsOver(false);
    addIngredient(name);
  });

  return (
    <div
      ref={dropRef}
      onDragOver={(e) => {
        e.preventDefault();
        setIsOver(true);
      }}
      onDragLeave={() => setIsOver(false)}
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

export default PizzaCanvas;
