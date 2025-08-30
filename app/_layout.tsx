import { Slot, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { AuthProvider } from "./AuthContext";
import { CartProvider } from "./CartContext";

export default function RootLayout() {
  return (
    <AuthProvider>
      <CartProvider>
        <Slot />
      </CartProvider>
    </AuthProvider>
  );
}
