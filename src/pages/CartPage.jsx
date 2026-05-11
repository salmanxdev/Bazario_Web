return (

    <div
        className="
        w-full
        h-screen
        bg-[#EAEDED]
        flex
        flex-col
        overflow-hidden
        "
    >

        {/* HEADER */}

        <div
            className="
            p-4
            bg-white
            shadow-sm
            border-b
            "
        >

            <h1
                className="
                text-3xl
                font-bold
                "
            >
                Shopping Cart
            </h1>

        </div>

        {

            cartItems.length === 0

                ? (

                    <div
                        className="
                        flex-1
                        flex
                        items-center
                        justify-center
                        p-5
                        "
                    >

                        <div
                            className="
                            bg-white
                            rounded-2xl
                            p-10
                            text-center
                            shadow-sm
                            w-full
                            max-w-lg
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

                    </div>

                )

                : (

                    <>

                        {/* SCROLLABLE PRODUCTS */}

                        <div
                            className="
                            flex-1
                            overflow-y-auto
                            p-4
                            space-y-4
                            "
                        >

                            {

                                cartItems.map((item) => (

                                    <div
                                        key={item.id}
                                        className="
                                        bg-white
                                        rounded-2xl
                                        p-4
                                        shadow-sm
                                        flex
                                        gap-4
                                        items-center
                                        "
                                    >

                                        {/* IMAGE */}

                                        <img
                                            src={item.image}
                                            alt=""
                                            className="
                                            w-28
                                            h-28
                                            object-cover
                                            rounded-xl
                                            border
                                            "
                                        />

                                        {/* INFO */}

                                        <div className="flex-1">

                                            <h2
                                                className="
                                                text-lg
                                                font-semibold
                                                mb-2
                                                line-clamp-2
                                                "
                                            >
                                                {item.title}
                                            </h2>

                                            <p
                                                className="
                                                text-xl
                                                font-bold
                                                text-indigo-600
                                                mb-2
                                                "
                                            >
                                                ₹ {item.price}
                                            </p>

                                            <p className="text-gray-500">
                                                Quantity: {item.quantity}
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
                                            px-4
                                            py-2
                                            rounded-xl
                                            transition
                                            "
                                        >
                                            Remove
                                        </button>

                                    </div>

                                ))
                            }

                            {/* EXTRA SPACE FOR BOTTOM PANEL */}

                            <div className="h-40"></div>

                        </div>

                        {/* FIXED BOTTOM PRICE PANEL */}

                        <div
                            className="
                            bg-white
                            border-t
                            shadow-[0_-2px_10px_rgba(0,0,0,0.08)]
                            p-5
                            rounded-t-3xl
                            "
                        >

                            <h2
                                className="
                                text-2xl
                                font-bold
                                mb-5
                                "
                            >
                                Price Details
                            </h2>

                            <div
                                className="
                                flex
                                justify-between
                                mb-3
                                text-gray-600
                                "
                            >

                                <p>Total Items</p>

                                <p>{cartItems.length}</p>

                            </div>

                            <div
                                className="
                                flex
                                justify-between
                                mb-4
                                text-gray-600
                                "
                            >

                                <p>Delivery</p>

                                <p className="text-green-600 font-semibold">
                                    FREE
                                </p>

                            </div>

                            <hr className="my-4" />

                            <div
                                className="
                                flex
                                justify-between
                                text-2xl
                                font-bold
                                mb-5
                                "
                            >

                                <p>Total</p>

                                <p>₹ {totalPrice}</p>

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
                                py-4
                                rounded-2xl
                                font-bold
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

                    </>

                )
        }

    </div>

);