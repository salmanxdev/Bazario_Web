const FilterPage = () => {

    return (

        <div
            className="
            w-full
            min-h-screen
            bg-[#EAEDED]
            p-5
            flex 
            justify-center
            items-center
            "
        >

            {/* MAIN */}

            <div
                className="
                w-full
                flex
                gap-5
                "
            >

                {/* LEFT FILTER SIDEBAR */}

                <div
                    className="
                    w-[280px]
                    bg-white
                    p-5
                    rounded-md
                    shadow-sm
                    h-fit
                    "
                >

                    {/* TITLE */}

                    <h1
                        className="
                        text-2xl
                        font-bold
                        mb-6
                        "
                    >
                        Filters
                    </h1>

                    {/* CATEGORY */}

                    <div className="mb-6">

                        <h2
                            className="
                            font-bold
                            mb-3
                            "
                        >
                            Category
                        </h2>

                        <div className="space-y-2">

                            <label className="flex gap-2">

                                <input type="checkbox" />

                                Electronics

                            </label>

                            <label className="flex gap-2">

                                <input type="checkbox" />

                                Clothing

                            </label>

                            <label className="flex gap-2">

                                <input type="checkbox" />

                                Sports

                            </label>

                            <label className="flex gap-2">

                                <input type="checkbox" />

                                Beauty

                            </label>

                        </div>

                    </div>

                    {/* PRICE */}

                    <div className="mb-6">

                        <h2
                            className="
                            font-bold
                            mb-3
                            "
                        >
                            Price
                        </h2>

                        <div className="space-y-2">

                            <label className="flex gap-2">

                                <input type="radio" name="price" />

                                Under ₹500

                            </label>

                            <label className="flex gap-2">

                                <input type="radio" name="price" />

                                Under ₹1000

                            </label>

                            <label className="flex gap-2">

                                <input type="radio" name="price" />

                                Under ₹5000

                            </label>

                            <label className="flex gap-2">

                                <input type="radio" name="price" />

                                Above ₹10000

                            </label>

                        </div>

                    </div>

                    {/* BRAND */}

                    <div className="mb-6">

                        <h2
                            className="
                            font-bold
                            mb-3
                            "
                        >
                            Brand
                        </h2>

                        <div className="space-y-2">

                            <label className="flex gap-2">

                                <input type="checkbox" />

                                Apple

                            </label>

                            <label className="flex gap-2">

                                <input type="checkbox" />

                                Samsung

                            </label>

                            <label className="flex gap-2">

                                <input type="checkbox" />

                                Nike

                            </label>

                            <label className="flex gap-2">

                                <input type="checkbox" />

                                Adidas

                            </label>

                        </div>

                    </div>

                    {/* RATING */}

                    <div className="mb-6">

                        <h2
                            className="
                            font-bold
                            mb-3
                            "
                        >
                            Customer Rating
                        </h2>

                        <div className="space-y-2">

                            <label className="flex gap-2">

                                <input type="checkbox" />

                                ⭐⭐⭐⭐ & Above

                            </label>

                            <label className="flex gap-2">

                                <input type="checkbox" />

                                ⭐⭐⭐ & Above

                            </label>

                        </div>

                    </div>

                    {/* DELIVERY */}

                    <div className="mb-6">

                        <h2
                            className="
                            font-bold
                            mb-3
                            "
                        >
                            Delivery
                        </h2>

                        <div className="space-y-2">

                            <label className="flex gap-2">

                                <input type="checkbox" />

                                Free Delivery

                            </label>

                            <label className="flex gap-2">

                                <input type="checkbox" />

                                Next Day Delivery

                            </label>

                        </div>

                    </div>

                    {/* BUTTONS */}

                    <div className="flex flex-col gap-3">

                        <button
                            className="
                            bg-yellow-400
                            hover:bg-yellow-500
                            py-2
                            rounded-md
                            font-semibold
                            "
                        >
                            Apply Filters
                        </button>

                        <button
                            className="
                            bg-gray-200
                            hover:bg-gray-300
                            py-2
                            rounded-md
                            "
                        >
                            Reset
                        </button>

                    </div>

                </div>

                {/* RIGHT CONTENT */}

                <div
                    className="
                    flex-1
                    bg-white
                    rounded-md
                    p-5
                    "
                >

                    <h1
                        className="
                        text-2xl
                        font-bold
                        mb-4
                        "
                    >
                        Filtered Products
                    </h1>

                    <p className="text-gray-500">

                        Products will appear here after filtering.

                    </p>

                </div>

            </div>

        </div>
    );
};

export default FilterPage;