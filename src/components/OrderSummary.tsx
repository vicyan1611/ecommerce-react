import React from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../store/hooks";

const OrderSummary: React.FC = () => {
  const navigate = useNavigate();
  const { totalItems, totalPrice } = useAppSelector((state) => state.cart);

  const shipping = totalPrice > 100 ? 0 : 10;
  const tax = totalPrice * 0.08; // 8% tax
  const finalTotal = totalPrice + shipping + tax;

  const handleProceedToCheckout = () => {
    navigate("/checkout");
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Order Summary
      </h2>

      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-gray-600">Items ({totalItems})</span>
          <span className="text-gray-800">${totalPrice.toFixed(2)}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600">Shipping</span>
          <span className="text-gray-800">
            {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600">Tax</span>
          <span className="text-gray-800">${tax.toFixed(2)}</span>
        </div>

        <div className="border-t pt-3">
          <div className="flex justify-between font-semibold text-lg">
            <span>Total</span>
            <span>${finalTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {totalPrice > 0 && (
        <div className="mt-4">
          {totalPrice < 100 && (
            <p className="text-sm text-blue-600 mb-3">
              Add ${(100 - totalPrice).toFixed(2)} more for free shipping!
            </p>
          )}

          <button
            onClick={handleProceedToCheckout}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Proceed to Checkout
          </button>
        </div>
      )}
    </div>
  );
};

export default OrderSummary;
