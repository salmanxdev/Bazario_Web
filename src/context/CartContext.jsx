import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { db } from "../firebase";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

const CartContext = createContext();

export const CartProvider = ({ children }) => {

    const [cartItems, setCartItems] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();

    // Load cart and orders from Firestore when user logs in
    useEffect(() => {
        if (user && user.email) {
            loadCartFromDatabase();
            loadOrdersFromDatabase();
        } else {
            setCartItems([]);
            setOrders([]);
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

    const loadOrdersFromDatabase = async () => {
        try {
            const userRef = doc(db, "users", user.email);
            const userSnap = await getDoc(userRef);

            if (userSnap.exists()) {
                const data = userSnap.data();
                setOrders(data.orders || []);
            } else {
                setOrders([]);
            }
        } catch (error) {
            console.error("Error loading orders:", error);
            setOrders([]);
        }
    };

    // Generate unique order number
    const generateOrderNumber = () => {
        const timestamp = Date.now().toString().slice(-8);
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        return `ORD-${timestamp}-${random}`;
    };

    // ADD TO CART

    const addToCart = async (product) => {

        // CHECK IF USER IS LOGGED IN
        if (!user) {
            console.warn("User not logged in. Cannot add to cart.");
            return;
        }

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

    // PLACE ORDER
    const placeOrder = async (orderDetails) => {
        if (!user || !user.email) return null;

        try {
            const orderNumber = generateOrderNumber();
            const newOrder = {
                orderNumber,
                items: cartItems,
                totalAmount: orderDetails.totalAmount,
                status: "Confirmed",
                date: new Date().toISOString(),
                estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
                shippingAddress: orderDetails.shippingAddress,
                ...orderDetails,
            };

            const updatedOrders = [...orders, newOrder];
            setOrders(updatedOrders);

            // Save to Firestore
            const userRef = doc(db, "users", user.email);
            await updateDoc(userRef, {
                orders: updatedOrders,
                cart: [], // Clear cart after order
            }).catch(async (error) => {
                if (error.code === "not-found") {
                    await setDoc(userRef, {
                        email: user.email,
                        orders: updatedOrders,
                        cart: [],
                    });
                } else {
                    throw error;
                }
            });

            setCartItems([]); // Clear local cart
            return newOrder;
        } catch (error) {
            console.error("Error placing order:", error);
            return null;
        }
    };

    // GET ORDERS
    const getOrders = () => {
        return orders;
    };

    return (

        <CartContext.Provider
            value={{
                cartItems,
                orders,
                addToCart,
                removeFromCart,
                placeOrder,
                getOrders,
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