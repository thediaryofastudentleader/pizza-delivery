import React from "react";
import { usePizza } from "../context/PizzaContext";
import { motion, AnimatePresence } from "framer-motion";

const CheckoutForm = () => {
  const { form, setForm, handleSubmit, price } = usePizza();
  const canSubmit = price > 8; // at least one topping (base price is $8)

  return (
    <AnimatePresence>
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
    </AnimatePresence>
  );
};

export default CheckoutForm;

