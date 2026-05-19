import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const MyCart = () => {

  const {
    cart,
    backendUrl,
    token,
    currencySymbol,
    loadUserCart
  } = useContext(AppContext);

  const navigate = useNavigate();

  const [discount, setDiscount] = useState(0);

  // CALCULATE TOTALS
  const subtotal = cart.reduce(
    (sum, item) =>
      sum + item.quantity * item.price,
    0
  );

  const total = subtotal - discount;

  // REMOVE ITEM
  const removeItem = async (drugId) => {

    try {

      const { data } = await axios.post(
        `${backendUrl}/api/user/cart/remove`,
        { drugId },
        { headers: { token } }
      );

      if (data.success) {

        await loadUserCart();

        toast.success(
          data.message ||
            "Removed from cart"
        );

      }

    } catch (error) {

      toast.error(error.message);

    }
  };

  // APPLY DISCOUNT
  const applyDiscount = () => {

    if (
      cart.some(
        (item) =>
          item.quantity > item.stock
      )
    ) {

      return toast.error(
        "Some items are out of stock!"
      );
    }

    if (discount > 0) {

      return toast.info(
        "Discount already applied"
      );
    }

    const disc = subtotal * 0.1;

    setDiscount(disc);

    toast.success(
      "10% discount applied!"
    );
  };

  // LOAD CART
  useEffect(() => {

    loadUserCart();

  }, []);

  // CHECK STOCK
  const hasOutOfStock = cart.some(
    (item) =>
      item.quantity > item.stock
  );

  return (

    <div className="max-w-4xl mx-auto my-10 px-4 sm:px-6 space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">

        <h1 className="text-2xl font-bold">

          My Cart

        </h1>

        <div className="flex gap-2">

          <button
            onClick={() =>
              navigate("/drugs")
            }
            className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
          >

            Add More

          </button>

          <button
            onClick={() =>
              navigate("/my-orders")
            }
            className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600"
          >

            Order History

          </button>

        </div>

      </div>

      {/* CART ITEMS */}
      <div className="space-y-4">

        {cart.length === 0 && (

          <p>Your cart is empty.</p>

        )}

        {cart.map((item) => {

          const isOutOfStock =
            item.quantity > item.stock;

          return (

            <div
              key={item._id}
              className="flex justify-between items-center border rounded p-4 bg-white"
            >

              <div className="flex items-center gap-4">

                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 object-contain"
                />

                <div>

                  <p className="font-medium">

                    {item.name}

                  </p>

                  <p className="text-gray-600">

                    Quantity:
                    {" "}
                    {item.quantity}

                    {" | "}

                    Unit Price:
                    {" "}
                    {currencySymbol}
                    {item.price}

                  </p>

                  <p className="text-gray-700 font-medium">

                    Total:
                    {" "}
                    {currencySymbol}
                    {item.quantity * item.price}

                  </p>

                  <p
                    className={`font-semibold ${
                      isOutOfStock
                        ? "text-red-500"
                        : "text-green-500"
                    }`}
                  >

                    {isOutOfStock
                      ? "Out of Stock"
                      : "In Stock"}

                  </p>

                </div>

              </div>

              <button
                onClick={() =>
                  removeItem(item._id)
                }
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >

                Remove

              </button>

            </div>

          );
        })}

      </div>

      {/* ORDER SUMMARY */}
      <div className="border rounded p-4 bg-white space-y-2">

        <p className="text-lg font-semibold">

          Order Summary

        </p>

        <p>

          Subtotal:
          {" "}
          {currencySymbol}
          {subtotal.toFixed(2)}

        </p>

        <p>

          Discount:
          {" "}
          {currencySymbol}
          {discount.toFixed(2)}

        </p>

        <p className="font-semibold text-lg">

          Total:
          {" "}
          {currencySymbol}
          {total.toFixed(2)}

        </p>

        <div className="flex gap-3 mt-4 flex-wrap">

          {/* DISCOUNT BUTTON */}
          <button
            onClick={applyDiscount}
            className={`px-4 py-2 rounded text-white ${
              hasOutOfStock
                ? "bg-yellow-300 cursor-not-allowed"
                : "bg-yellow-500 hover:bg-yellow-600"
            }`}
            disabled={hasOutOfStock}
          >

            Get 10% Discount

          </button>

          {/* PAYMENT BUTTON */}
          <button
            onClick={() =>
              navigate("/cart-payment", {
                state: {
                  cartItems: cart,
                  totalAmount: total,
                },
              })
            }
            className={`px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 ${
              hasOutOfStock
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
            disabled={hasOutOfStock}
          >

            Proceed To Payment

          </button>

        </div>

      </div>

    </div>

  );
};

export default MyCart;