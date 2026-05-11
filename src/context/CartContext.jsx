import { createContext, useContext, useState } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {

    const [cartItems, setCartItems] = useState([]);

    // ADD TO CART

    const addToCart = (product) => {

        // CHECK PRODUCT EXISTS

        const existingProduct = cartItems.find(

            (item) => item.id === product.id
        );

        // IF EXISTS

        if (existingProduct) {

            const updatedCart = cartItems.map((item) =>

                item.id === product.id

                    ? {
                        ...item,
                        quantity: item.quantity + 1,
                    }

                    : item
            );

            setCartItems(updatedCart);

            return;
        }

        // NEW PRODUCT

        setCartItems([

            ...cartItems,

            {
                ...product,
                quantity: 1,
            },
        ]);
    };

    // REMOVE PRODUCT

    const removeFromCart = (id) => {

        const updatedCart = cartItems.filter(

            (item) => item.id !== id
        );

        setCartItems(updatedCart);
    };

    return (

        <CartContext.Provider
            value={{
                cartItems,
                addToCart,
                removeFromCart,
            }}
        >

            {children}

        </CartContext.Provider>
    );
};

export const useCart = () => {

    return useContext(CartContext);
};