import { useCart } from "../context/CartContext";
import { useState } from "react";
import { showToast } from "../utils/toast";
import { useNavigate } from "react-router-dom";

const CartPage = () => {

    const {
        cartItems,
        removeFromCart,
        placeOrder,
    } = useCart();

    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);

    // TOTAL PRICE

    const totalPrice = cartItems.reduce(

        (total, item) =>

            total + item.price * item.quantity,

        0
    );

    const handleProceedToBuy = async () => {
        if (cartItems.length === 0) {
            showToast.warning("Your cart is empty!");
            return;
        }

        setIsProcessing(true);

        try {
            const order = await placeOrder({
                totalAmount: totalPrice,
                shippingAddress: "Default Address",
            });

            if (order) {
                showToast.success(`Order placed successfully! Order #${order.orderNumber}`);
                setTimeout(() => {
                    navigate("/home");
                }, 2000);
            } else {
                showToast.error("Failed to place order. Please try again.");
            }
        } catch (error) {
            console.error("Error placing order:", error);
            showToast.error("An error occurred while placing the order.");
        } finally {
            setIsProcessing(false);
        }
    };

    return (

        <div
            className="
            w-full
            min-h-screen
            bg-[#EAEDED]
            p-[12px]
            "
        >

            {/* TITLE */}

            <h1
                className="
                text-3xl
                font-bold
                mb-6
                "
            >
                Shopping Cart
            </h1>

            {

                cartItems.length === 0

                    ? (

                        <div
                            className="
                            bg-white
                            rounded-xl
                            p-10
                            text-center
                            shadow-sm
                            "
                        >

                            <h2
                                className="
                                text-2xl
                                font-semibold
                                mb-3
                                "
                            >
                                Your Cart is Empty
                            </h2>

                            <p className="text-gray-500">

                                Add products to continue shopping.

                            </p>

                        </div>
                    )

                    : (

                        <div
                            className="
                            flex
                            flex-col
                            lg:flex-row
                            gap-5
                            items-stretch
                            "
                        >

                            {/* LEFT */}

                            <div className="flex-1 space-y-5">

                                {

                                    cartItems.map((item) => (

                                        <div
                                            key={item.id}
                                            className="
                                            bg-white
                                            rounded-2xl
                                            p-[16px]
                                            shadow-sm
                                            flex
                                            flex-col
                                            sm:flex-row
                                            gap-5
                                            items-center
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
                                                rounded-xl
                                                "
                                            />

                                            {/* INFO */}

                                            <div className="flex-1">

                                                <h2
                                                    className="
                                                    text-xl
                                                    font-semibold
                                                    mb-2
                                                    "
                                                >

                                                    {item.title}

                                                </h2>

                                                <p
                                                    className="
                                                    text-lg
                                                    font-bold
                                                    text-indigo-600
                                                    mb-2
                                                    "
                                                >

                                                    ₹ {item.price}

                                                </p>

                                                <p
                                                    className="
                                                    text-gray-500
                                                    "
                                                >

                                                    Quantity:
                                                    {" "}
                                                    {item.quantity}

                                                </p>

                                            </div>

                                            {/* REMOVE */}

                                            <button
                                                onClick={() => {
                                                    removeFromCart(item.id);
                                                    showToast.info(`${item.title} removed from cart`);
                                                }}
                                                className="
                                                bg-red-500
                                                hover:bg-red-600
                                                text-white
                                                px-5
                                                py-3
                                                rounded-xl
                                                transition
                                                "
                                            >

                                                Remove

                                            </button>

                                        </div>
                                    ))
                                }

                            </div>

                            {/* RIGHT */}

                            <div
                                className="
                                w-full
                                lg:w-[350px]
                                bg-white
                                rounded-2xl
                                p-[8px]
                                shadow-sm
                                h-full
                                "
                            >

                                <div
                                    className="
                                    w-full
                                    h-full
                                    border
                                    border-gray-200
                                    rounded-xl
                                    p-5
                                    "
                                >

                                    <h2
                                        className="
                                        text-2xl
                                        font-bold
                                        mb-6
                                        "
                                    >
                                        Price Details
                                    </h2>

                                    <div
                                        className="
                                        flex
                                        justify-between
                                        mb-4
                                        "
                                    >

                                        <p>

                                            Total Items

                                        </p>

                                        <p>

                                            {cartItems.length}

                                        </p>

                                    </div>

                                    <div
                                        className="
                                        flex
                                        justify-between
                                        mb-4
                                        "
                                    >

                                        <p>

                                            Delivery

                                        </p>

                                        <p
                                            className="
                                            text-green-600
                                            font-semibold
                                            "
                                        >

                                            FREE

                                        </p>

                                    </div>

                                    <hr className="my-4" />

                                    <div
                                        className="
                                        flex
                                        justify-between
                                        text-xl
                                        font-bold
                                        mb-6
                                        "
                                    >

                                        <p>

                                            Total

                                        </p>

                                        <p>

                                            ₹ {totalPrice}

                                        </p>

                                    </div>

                                    <button
                                        onClick={handleProceedToBuy}
                                        disabled={isProcessing}
                                        className="
                                        w-full
                                        bg-yellow-400
                                        hover:bg-yellow-500
                                        disabled:bg-gray-400
                                        disabled:cursor-not-allowed
                                        py-3
                                        rounded-xl
                                        font-semibold
                                        transition
                                        "
                                    >

                                        {isProcessing ? "Processing..." : "Proceed To Buy"}

                                    </button>

                                </div>

                            </div>

                        </div>
                    )
            }

        </div>
    );
};

export default CartPage;