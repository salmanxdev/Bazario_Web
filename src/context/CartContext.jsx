import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { db } from "../firebase";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

const CartContext = createContext();

export const CartProvider = ({ children }) => {

    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();

    // Load cart from Firestore when user logs in
    useEffect(() => {
        if (user && user.email) {
            loadCartFromDatabase();
        } else {
            setCartItems([]);
        }
    }, [user]);

    const loadCartFromDatabase = async () => {
        try {
            setLoading(true);
            const userRef = doc(db, "users", user.email);
            const userSnap = await getDoc(userRef);

            if (userSnap.exists()) {
                const data = userSnap.data();
                setCartItems(data.cart || []);
            } else {
                setCartItems([]);
            }
        } catch (error) {
            console.error("Error loading cart:", error);
            setCartItems([]);
        } finally {
            setLoading(false);
        }
    };

    // ADD TO CART

    const addToCart = async (product) => {

        // CHECK PRODUCT EXISTS

        const existingProduct = cartItems.find(

            (item) => item.id === product.id
        );

        let updatedCart;

        // IF EXISTS

        if (existingProduct) {

            updatedCart = cartItems.map((item) =>

                item.id === product.id

                    ? {
                        ...item,
                        quantity: item.quantity + 1,
                    }

                    : item
            );

            setCartItems(updatedCart);

        } else {

            // NEW PRODUCT

            updatedCart = [

                ...cartItems,

                {
                    ...product,
                    quantity: 1,
                },
            ];

            setCartItems(updatedCart);
        }

        // Save to Firestore if user is logged in
        if (user && user.email) {
            try {
                const userRef = doc(db, "users", user.email);
                await updateDoc(userRef, {
                    cart: updatedCart,
                }).catch(async (error) => {
                    if (error.code === "not-found") {
                        await setDoc(userRef, {
                            email: user.email,
                            cart: updatedCart,
                        });
                    } else {
                        throw error;
                    }
                });
            } catch (error) {
                console.error("Error saving cart:", error);
            }
        }
    };

    // REMOVE PRODUCT

    const removeFromCart = async (id) => {

        const updatedCart = cartItems.filter(

            (item) => item.id !== id
        );

        setCartItems(updatedCart);

        // Save to Firestore if user is logged in
        if (user && user.email) {
            try {
                const userRef = doc(db, "users", user.email);
                await updateDoc(userRef, {
                    cart: updatedCart,
                });
            } catch (error) {
                console.error("Error removing from cart:", error);
            }
        }
    };

    return (

        <CartContext.Provider
            value={{
                cartItems,
                addToCart,
                removeFromCart,
                loading,
            }}
        >

            {children}

        </CartContext.Provider>
    );
};

export const useCart = () => {

    return useContext(CartContext);
};