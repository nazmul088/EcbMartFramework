import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";
import { Product } from "./product";

type CartContextType = {
  addedToCart: Product[];
  setAddedToCart: React.Dispatch<React.SetStateAction<Product[]>>;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }) => {
  const [addedToCart, setAddedToCart] = useState<Product[]>([]);

  // Load cart from AsyncStorage on mount
  useEffect(() => {
    AsyncStorage.getItem("cart").then((data) => {
      if (data) setAddedToCart(JSON.parse(data));
    });
  }, []);

  // Save cart to AsyncStorage whenever it changes
  useEffect(() => {
    AsyncStorage.setItem("cart", JSON.stringify(addedToCart));
  }, [addedToCart]);

  return (
    <CartContext.Provider value={{ addedToCart, setAddedToCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};