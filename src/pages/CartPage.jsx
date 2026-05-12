import { useCart } from "../context/CartContext";

import { useState } from "react";

import {
  Trash2,
  ShoppingBag,
  ArrowLeft,
  Plus,
  Minus,
} from "lucide-react";

import { showToast } from "../utils/toast";

import { useNavigate } from "react-router-dom";

const CartPage = () => {

  const {
    cartItems,
    removeFromCart,
  } = useCart();

  const navigate = useNavigate();

  const [isProcessing, setIsProcessing] = useState(false);

  const totalPrice = cartItems.reduce(
    (total, item) =>
      total + item.price * item.quantity,
    0
  );

  const handleProceedToBuy = () => {

    setIsProcessing(true);

    setTimeout(() => {

      setIsProcessing(false);

      showToast.success("Order placed successfully");

      navigate("/");

    }, 2000);

  };

  return (

    <div className="w-full min-h-screen bg-[#0f1111] text-white">

      {/* HEADER */}

      <div
        className="
        sticky
        top-0
        z-50
        bg-black/90
        backdrop-blur-md
        border-b
        border-zinc-800
        "
      >

        <div
          className="
          max-w-7xl
          mx-auto
          px-4
          py-4
          flex
          items-center
          justify-between
          "
        >

          <div className="flex items-center gap-4">

            <button
              onClick={() => navigate(-1)}
              className="
              w-10
              h-10
              rounded-full
              bg-zinc-900
              flex
              items-center
              justify-center
              hover:bg-zinc-800
              transition
              "
            >

              <ArrowLeft size={20} />

            </button>

            <div>

              <h1 className="text-2xl font-bold">
                Shopping Cart
              </h1>

              <p className="text-zinc-400 text-sm">
                {cartItems.length} items
              </p>

            </div>

          </div>

        </div>

      </div>

      {
        cartItems.length === 0 ? (

          <div
            className="
            flex
            flex-col
            items-center
            justify-center
            min-h-[80vh]
            px-5
            text-center
            "
          >

            <div
              className="
              w-32
              h-32
              rounded-full
              bg-zinc-900
              flex
              items-center
              justify-center
              mb-6
              "
            >

              <ShoppingBag size={60} />

            </div>

            <h2 className="text-3xl font-bold mb-3">
              Your Cart is Empty
            </h2>

            <p className="text-zinc-400 mb-8 max-w-md">
              Looks like you haven't added
              anything to your cart yet.
            </p>

            <button
              onClick={() => navigate("/")}
              className="
              bg-yellow-400
              hover:bg-yellow-500
              text-black
              font-bold
              px-8
              py-4
              rounded-2xl
              transition
              "
            >

              Continue Shopping

            </button>

          </div>

        ) : (

          <div
            className="
            max-w-7xl
            mx-auto
            grid
            lg:grid-cols-[1fr_400px]
            gap-6
            p-4
            "
          >

            {/* LEFT SIDE */}

            <div className="space-y-5">

              {
                cartItems.map((item) => (

                  <div
                    key={item.id}
                    className="
                    bg-[#1a1c1e]
                    border
                    border-zinc-800
                    rounded-3xl
                    p-4
                    flex
                    gap-5
                    hover:border-zinc-700
                    transition
                    "
                  >

                    {/* IMAGE */}

                    <img
                      src={item.image}
                      alt=""
                      className="
                      w-32
                      h-32
                      object-cover
                      rounded-2xl
                      "
                    />

                    {/* INFO */}

                    <div className="flex-1">

                      <h2
                        className="
                        text-xl
                        font-semibold
                        line-clamp-2
                        mb-2
                        "
                      >
                        {item.title}
                      </h2>

                      <p
                        className="
                        text-2xl
                        font-bold
                        text-yellow-400
                        mb-4
                        "
                      >
                        ₹ {item.price}
                      </p>

                      {/* QUANTITY */}

                      <div
                        className="
                        flex
                        items-center
                        gap-3
                        "
                      >

                        <div
                          className="
                          flex
                          items-center
                          bg-black
                          rounded-full
                          border
                          border-zinc-700
                          "
                        >

                          <button
                            className="
                            p-2
                            hover:bg-zinc-800
                            rounded-full
                            transition
                            "
                          >

                            <Minus size={16} />

                          </button>

                          <span className="px-4">
                            {item.quantity}
                          </span>

                          <button
                            className="
                            p-2
                            hover:bg-zinc-800
                            rounded-full
                            transition
                            "
                          >

                            <Plus size={16} />

                          </button>

                        </div>

                      </div>

                    </div>

                    {/* REMOVE */}

                    <button
                      onClick={() => {

                        removeFromCart(item.id);

                        showToast.info(
                          `${item.title} removed`
                        );

                      }}
                      className="
                      self-start
                      bg-red-500/20
                      hover:bg-red-500
                      text-red-400
                      hover:text-white
                      p-3
                      rounded-2xl
                      transition
                      "
                    >

                      <Trash2 size={20} />

                    </button>

                  </div>

                ))
              }

            </div>

            {/* RIGHT SIDE */}

            <div
              className="
              sticky
              top-24
              h-fit
              bg-[#1a1c1e]
              border
              border-zinc-800
              rounded-3xl
              p-6
              "
            >

              <h2
                className="
                text-2xl
                font-bold
                mb-6
                "
              >
                Order Summary
              </h2>

              {/* DETAILS */}

              <div className="space-y-4 mb-6">

                <div className="flex justify-between">

                  <span className="text-zinc-400">
                    Items
                  </span>

                  <span>
                    {cartItems.length}
                  </span>

                </div>

                <div className="flex justify-between">

                  <span className="text-zinc-400">
                    Delivery
                  </span>

                  <span className="text-green-500">
                    FREE
                  </span>

                </div>

                <div className="flex justify-between">

                  <span className="text-zinc-400">
                    Platform Fee
                  </span>

                  <span>
                    ₹ 0
                  </span>

                </div>

              </div>

              <div
                className="
                border-t
                border-zinc-800
                pt-5
                mb-6
                "
              >

                <div
                  className="
                  flex
                  justify-between
                  text-2xl
                  font-bold
                  "
                >

                  <span>Total</span>

                  <span className="text-yellow-400">
                    ₹ {totalPrice}
                  </span>

                </div>

              </div>

              {/* BUTTON */}

              <button
                onClick={handleProceedToBuy}
                disabled={isProcessing}
                className="
                w-full
                bg-yellow-400
                hover:bg-yellow-500
                disabled:bg-zinc-700
                disabled:cursor-not-allowed
                text-black
                font-bold
                py-4
                rounded-2xl
                text-lg
                transition
                "
              >

                {
                  isProcessing
                    ? "Processing..."
                    : "Proceed To Buy"
                }

              </button>

            </div>

          </div>

        )
      }

    </div>

  );

};

export default CartPage;