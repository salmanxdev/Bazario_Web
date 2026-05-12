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

  useEffect(() => {
    if (user?.uid) {
      loadCartFromDatabase();
      loadOrdersFromDatabase();
    } else {
      setCartItems([]);
      setOrders([]);
    }
  }, [user]);

  const getUserRef = () => doc(db, "userData", user.uid);

  const loadCartFromDatabase = async () => {
    try {
      setLoading(true);
      const snap = await getDoc(getUserRef());
      setCartItems(snap.exists() ? snap.data().cart || [] : []);
    } catch (e) { console.error("Cart load error:", e); setCartItems([]); }
    finally { setLoading(false); }
  };

  const loadOrdersFromDatabase = async () => {
    try {
      const snap = await getDoc(getUserRef());
      setOrders(snap.exists() ? snap.data().orders || [] : []);
    } catch (e) { console.error("Orders load error:", e); setOrders([]); }
  };

  const saveToDb = async (data) => {
    if (!user?.uid) return;
    try {
      const ref = getUserRef();
      await updateDoc(ref, data).catch(async (err) => {
        if (err.code === "not-found") {
          await setDoc(ref, { uid: user.uid, ...data });
        } else throw err;
      });
    } catch (e) { console.error("DB save error:", e); }
  };

  const generateOrderNumber = () => {
    const ts = Date.now().toString().slice(-8);
    const rnd = Math.floor(Math.random() * 1000).toString().padStart(3, "0");
    return `ORD-${ts}-${rnd}`;
  };

  const addToCart = async (product) => {
    if (!user) return;
    const existing = cartItems.find((i) => i.id === product.id);
    let updated;
    if (existing) {
      updated = cartItems.map((i) => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
    } else {
      updated = [...cartItems, { ...product, quantity: 1 }];
    }
    setCartItems(updated);
    await saveToDb({ cart: updated });
  };

  const removeFromCart = async (id) => {
    const updated = cartItems.filter((i) => i.id !== id);
    setCartItems(updated);
    await saveToDb({ cart: updated });
  };

  const placeOrder = async (orderDetails) => {
    if (!user?.uid) return null;
    try {
      const newOrder = {
        orderNumber: generateOrderNumber(),
        items: cartItems,
        totalAmount: orderDetails.totalAmount,
        status: "Confirmed",
        date: new Date().toISOString(),
        estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
        paymentId: orderDetails.paymentId || "",
        shippingAddress: orderDetails.shippingAddress || "",
      };
      const updatedOrders = [...orders, newOrder];
      setOrders(updatedOrders);
      setCartItems([]);
      await saveToDb({ orders: updatedOrders, cart: [] });
      return newOrder;
    } catch (e) { console.error("Order error:", e); return null; }
  };

  return (
    <CartContext.Provider value={{ cartItems, orders, addToCart, removeFromCart, placeOrder, loading }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);