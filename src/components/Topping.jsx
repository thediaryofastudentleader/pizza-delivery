import React from "react";
import { motion } from "framer-motion";

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

export default Topping;   // ← **default export**

