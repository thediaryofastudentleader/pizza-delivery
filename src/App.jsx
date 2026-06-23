import React from "react";
import { PizzaProvider } from "./context/PizzaContext";
import AssetDrawer from "./components/AssetDrawer";
import PizzaCanvas from "./components/PizzaCanvas";
import SuccessBanner from "./components/SuccessBanner";
import OrderSummary from "./components/OrderSummary";
import CheckoutForm from "./components/CheckoutForm";

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
            </div>
        </PizzaProvider>
    );
}
