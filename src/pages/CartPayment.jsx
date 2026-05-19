import React, { useContext, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";

const CartPayment = () => {

  const navigate = useNavigate();

  const location = useLocation();

  const { currencySymbol } = useContext(AppContext);

  const { cartItems, totalAmount } =
    location.state || {};

  const [paymentMethod, setPaymentMethod] =
    useState("");

  const [upiId, setUpiId] =
    useState("");

  const [cardNumber, setCardNumber] =
    useState("");

  const [cardName, setCardName] =
    useState("");

  const [expiry, setExpiry] =
    useState("");

  const [cvv, setCvv] =
    useState("");

  const [bankName, setBankName] =
    useState("");

  const [ifsc, setIfsc] =
    useState("");

  const [processing, setProcessing] =
    useState(false);

  const [success, setSuccess] =
    useState(false);

  // VALIDATIONS
  const validatePayment = () => {

    // UPI
    if (paymentMethod === "UPI") {

      const upiRegex =
        /^[a-zA-Z0-9._-]+@[a-zA-Z]+$/;

      if (!upiRegex.test(upiId)) {

        toast.error("Enter valid UPI ID");

        return false;
      }

    }

    // CARD
    if (paymentMethod === "Card") {

      const cardRegex = /^[0-9]{16}$/;

      const cvvRegex = /^[0-9]{3}$/;

      if (!cardRegex.test(cardNumber)) {

        toast.error("Invalid Card Number");

        return false;
      }

      if (!cvvRegex.test(cvv)) {

        toast.error("Invalid CVV");

        return false;
      }

      if (!expiry) {

        toast.error("Enter Expiry Date");

        return false;
      }

    }

    // NET BANKING
    if (paymentMethod === "Net Banking") {

      const ifscRegex =
        /^[A-Z]{4}0[A-Z0-9]{6}$/;

      if (!ifscRegex.test(ifsc)) {

        toast.error("Invalid IFSC Code");

        return false;
      }

      if (!bankName) {

        toast.error("Enter Bank Name");

        return false;
      }

    }

    return true;
  };

  // HANDLE PAYMENT
  const handlePayment = () => {

    if (!paymentMethod) {

      toast.error("Select Payment Method");

      return;
    }

    if (!validatePayment()) return;

    setProcessing(true);

    setTimeout(() => {

      setProcessing(false);

      setSuccess(true);

    }, 2500);
  };

  return (

    <div className="max-w-4xl mx-auto mt-10 bg-white shadow-xl rounded-2xl p-8">

      <h1 className="text-3xl font-bold mb-6">

        Medicine Payment Gateway

      </h1>

      {/* ORDER SUMMARY */}
      <div className="bg-gray-50 rounded-xl p-5 mb-6">

        <h2 className="text-xl font-semibold mb-4">

          Order Summary

        </h2>

        <div className="space-y-3">

          {cartItems?.map((item) => (

            <div
              key={item._id}
              className="flex justify-between border-b pb-2"
            >

              <div>

                <p className="font-medium">
                  {item.name}
                </p>

                <p className="text-sm text-gray-500">
                  Qty: {item.quantity}
                </p>

              </div>

              <p className="font-medium">

                {currencySymbol}
                {item.quantity * item.price}

              </p>

            </div>

          ))}

        </div>

        <div className="flex justify-between mt-5 text-xl font-bold">

          <span>Total</span>

          <span>
            {currencySymbol}
            {totalAmount.toFixed(2)}
          </span>

        </div>

      </div>

      {/* PAYMENT METHODS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">

        <button
          onClick={() => setPaymentMethod("UPI")}
          className={`border rounded-xl p-4 ${
            paymentMethod === "UPI"
              ? "border-primary bg-blue-50"
              : "border-gray-300"
          }`}
        >

          UPI

        </button>

        <button
          onClick={() => setPaymentMethod("Card")}
          className={`border rounded-xl p-4 ${
            paymentMethod === "Card"
              ? "border-primary bg-blue-50"
              : "border-gray-300"
          }`}
        >

          Card

        </button>

        <button
          onClick={() =>
            setPaymentMethod("Net Banking")
          }
          className={`border rounded-xl p-4 ${
            paymentMethod === "Net Banking"
              ? "border-primary bg-blue-50"
              : "border-gray-300"
          }`}
        >

          Net Banking

        </button>

      </div>

      {/* UPI */}
      {paymentMethod === "UPI" && (

        <input
          type="text"
          placeholder="Enter UPI ID"
          value={upiId}
          onChange={(e) =>
            setUpiId(e.target.value)
          }
          className="w-full border rounded-lg px-4 py-3"
        />

      )}

      {/* CARD */}
      {paymentMethod === "Card" && (

        <div className="space-y-4">

          <input
            type="text"
            placeholder="Card Holder Name"
            value={cardName}
            onChange={(e) =>
              setCardName(e.target.value)
            }
            className="w-full border rounded-lg px-4 py-3"
          />

          <input
            type="text"
            placeholder="16 Digit Card Number"
            value={cardNumber}
            onChange={(e) =>
              setCardNumber(e.target.value)
            }
            className="w-full border rounded-lg px-4 py-3"
          />

          <div className="grid grid-cols-2 gap-4">

            <input
              type="text"
              placeholder="MM/YY"
              value={expiry}
              onChange={(e) =>
                setExpiry(e.target.value)
              }
              className="border rounded-lg px-4 py-3"
            />

            <input
              type="password"
              placeholder="CVV"
              value={cvv}
              onChange={(e) =>
                setCvv(e.target.value)
              }
              className="border rounded-lg px-4 py-3"
            />

          </div>

        </div>

      )}

      {/* NET BANKING */}
      {paymentMethod === "Net Banking" && (

        <div className="space-y-4">

          <input
            type="text"
            placeholder="Bank Name"
            value={bankName}
            onChange={(e) =>
              setBankName(e.target.value)
            }
            className="w-full border rounded-lg px-4 py-3"
          />

          <input
            type="text"
            placeholder="IFSC Code"
            value={ifsc}
            onChange={(e) =>
              setIfsc(
                e.target.value.toUpperCase()
              )
            }
            className="w-full border rounded-lg px-4 py-3"
          />

        </div>

      )}

      {/* PAY BUTTON */}
      <button
        onClick={handlePayment}
        className="bg-primary text-white w-full py-3 rounded-xl mt-8 text-lg font-medium"
      >

        {processing
          ? "Processing Payment..."
          : `Pay ${currencySymbol}${totalAmount.toFixed(2)}`}

      </button>

      {/* SUCCESS */}
      {success && (

        <div className="mt-8 bg-green-100 border border-green-400 text-green-700 rounded-xl p-5">

          <h2 className="text-2xl font-semibold">

            Payment Successful 🎉

          </h2>

          <p className="mt-2">

            Your medicine order has been placed successfully.

          </p>

          <p className="mt-2">

            Transaction ID:

            <span className="font-semibold ml-2">

              TXN
              {Math.floor(Math.random() * 1000000)}

            </span>

          </p>

          <button
            onClick={() =>
              navigate("/my-orders")
            }
            className="bg-green-600 text-white px-6 py-2 rounded-lg mt-5"
          >

            View Orders

          </button>

        </div>

      )}

    </div>

  );
};

export default CartPayment;