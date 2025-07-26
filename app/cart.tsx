import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Dimensions, Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { Product } from "./product";

export interface CartItems {
  items: Product[];
  subTotal: number;
  deliveryCharge: number;
  discount: number;
  total: number;
  paymentMethod?: string;
}

function getImageUri(base64Image?: string) {
  return `data:image/png;base64,${base64Image}`;
}

export default function CartScreen() {
  const screenWidth = Dimensions.get('window').width;
  // Use smaller image size for mobile screens
  const imageSize = screenWidth < 500 ? 60 : 100;
  // Remove item from cart
  const removeCartItem = (index: number) => {
    const updatedCart = [...addedToCart];
    updatedCart.splice(index, 1);
    setAddedToCart(updatedCart);
  };
  // Helper to update cart quantity
  const updateCartQuantity = (index: number, delta: number) => {
    const updatedCart = [...addedToCart];
    const currentQty = updatedCart[index].quantity ?? 1;
    const newQty = currentQty + delta;
    if (newQty < 1) return;
    updatedCart[index].quantity = newQty;
    setAddedToCart(updatedCart);
  };
  const [addedToCart, setAddedToCart] = useState<Product[]>([]);

  // Load cart on mount
  useEffect(() => {
    AsyncStorage.getItem("cart").then((data) => {
      if (data) setAddedToCart(JSON.parse(data));
    });
  }, []);

  // Save cartItems object whenever cart changes
  useEffect(() => {
    const subTotal = addedToCart.reduce((sum, item) => sum + (item.price ?? 0) * (item.quantity ?? 1), 0);
    const deliveryCharge = 5;
    const discount = 0;
    const total = subTotal + deliveryCharge - discount;
    const cartItems: CartItems = {
      items: addedToCart,
      subTotal,
      deliveryCharge,
      discount,
      total,
    };
    AsyncStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [addedToCart]);

  return (
    <View style={{ flex: 1, display: "flex", flexDirection: "column" }}>
      <LinearGradient
        colors={["#90F7EC", "#32CCBC"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ padding: 8, height: 53 }}
      ></LinearGradient>

      <Text style={{ textAlign: "center", fontSize: 22, fontWeight: "bold", marginVertical: 12 }}>
        Your Cart ({addedToCart.length} Items)
      </Text>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 24 }}>
        <View style={styles.container}>
          <View style={styles.cartHeader}>
            <Text style={{ flex: 2, textAlign: "left", fontWeight: "bold" }}>Item</Text>
            <Text style={{ flex: 1, textAlign: "center", fontWeight: "bold" }}>Price</Text>
            <Text style={{ flex: 1.2, textAlign: "center", minWidth: 90, fontWeight: "bold" }}>
              Quantity
            </Text>
            <Text style={{ flex: 1, textAlign: "center", fontWeight: "bold" }}>Total</Text>
            <Text style={{ flex: 0.5, textAlign: "center" }}></Text>
          </View>
          <View
            style={{
              borderBottomWidth: 1,
              borderColor: "#e0e0e0",
              marginVertical: 8,
              width: "100%",
            }}
          />
          {addedToCart.map((item, index) => (
            <View key={index} style={styles.cartItem}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <View
                  style={{ flex: 2, flexDirection: "row", alignItems: "center" }}
                >
                  {item.svgImage && (
                    <View style={{ width: imageSize, height: imageSize, marginRight: 8 }}>
                      <Image
                        source={{ uri: getImageUri(item.svgImage) }}
                        style={{ width: imageSize, height: imageSize }}
                      />
                    </View>
                  )}
                  <Text style={{ flex: 2, fontSize : 16}}>{item.name}</Text>
                </View>
                <Text style={{ flex: 1, textAlign: "center" }}>
                  ${item.price}
                </Text>
                <View
                  style={{
                    flex: 1.2,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    minWidth: 90,
                  }}
                >
                  <View style={styles.quantityContainer}>
                    <Text
                      style={styles.quatityDecreaseContent}
                      onPress={() => updateCartQuantity(index, -1)}
                    >
                      -
                    </Text>
                    <Text style={styles.quantityValueContent}>
                      {item.quantity}
                    </Text>
                    <Text
                      style={styles.quantityIncreaseContent}
                      onPress={() => updateCartQuantity(index, 1)}
                    >
                      +
                    </Text>
                  </View>
                </View>
                <Text style={{ flex: 1, textAlign: "center" }}>
                  ${(item.price ?? 0) * (item.quantity ?? 1)}
                </Text>
                <View style={{ flex: 0.5, alignItems: "center" }}>
                  <MaterialIcons
                    name="delete"
                    size={24}
                    color="#d11a2a"
                    style={{ marginLeft: 8 }}
                    onPress={() => removeCartItem(index)}
                  />
                </View>
              </View>
            </View>
          ))}
        </View>
        {/* Summary Section */}
        <View style={styles.summaryRowContainer}>
          <View style={styles.summaryInnerBox}>
            <View style={styles.summaryBox}>
              <Text style={styles.summaryLabel}>Subtotal:</Text>
              <Text style={styles.summaryValue}>
                ${addedToCart.reduce((sum, item) => sum + (item.price ?? 0) * (item.quantity ?? 1), 0).toFixed(2)}
              </Text>
            </View>
            <View style={styles.summaryBox}>
              <Text style={styles.summaryLabel}>Delivery Charge:</Text>
              <Text style={styles.summaryValue}>$5.00</Text>
            </View>
            <View style={styles.summaryBox}>
              <Text style={styles.summaryLabel}>Discount:</Text>
              <Text style={styles.summaryValue}>$0.00</Text>
            </View>
            <View style={[styles.summaryBox, { borderTopWidth: 1, borderTopColor: '#eee', marginTop: 8, paddingTop: 8 }]}> 
              <Text style={[styles.summaryLabel, { fontWeight: 'bold' }]}>Total:</Text>
              <Text style={[styles.summaryValue, { fontWeight: 'bold', color: '#32CCBC' }]}> 
                ${(addedToCart.reduce((sum, item) => sum + (item.price ?? 0) * (item.quantity ?? 1), 0) + 5).toFixed(2)}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.checkoutButtonRowContainer}>
          <View style={styles.checkoutButtonContainer}>
            <Text style={styles.checkoutButton} onPress={() => {router.push('/checkout')}}>
              Checkout
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  summaryRowContainer: {
    width: '100%',
    flexDirection: 'column',
    alignItems: 'flex-end',
    marginTop: 8,
    marginBottom: 8,
  },
  summaryInnerBox: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4,
    minWidth: 120,
    maxWidth: 140,
    alignSelf: 'flex-end',
    marginRight: '16%', // Adjust this value to match the right edge of the Total column
  },
  checkoutButtonRowContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 16,
  },
  checkoutButtonContainer: {
    alignItems: 'flex-end',
    marginTop: 12,
  },
  checkoutButton: {
    backgroundColor: '#32CCBC',
    color: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 8,
    fontWeight: 'bold',
    fontSize: 16,
    shadowColor: '#32CCBC',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  summaryBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
    marginRight: '16%',
  },
  summaryLabel: {
    fontSize: 15,
    color: '#333',
  },
  summaryValue: {
    fontSize: 15,
    color: '#333',
    fontWeight: '500',
  },
  container: {
    display: "flex",
    flexDirection: "column",
    padding: 16,
    marginTop: 8,
  },
  cartHeader: {
    display: "flex",
    flexDirection: "row",
  },
  cartItems: {
    display: "flex",
    flexDirection: "row",
  },
  cartItem: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 8,
    alignItems: "center",
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: "#F8F8F8",
    marginLeft: 8,
    marginRight: 8,
  },
  quatityDecreaseContent: {
    fontSize: 18,
    color: "red",
    fontWeight: "bold",
    marginRight: 12,
    paddingHorizontal: 4,
  },
  quantityValueContent: {
    fontSize: 16,
    marginHorizontal: 8,
  },
  quantityIncreaseContent: {
    fontSize: 18,
    color: "green",
    fontWeight: "bold",
    marginLeft: 12,
    paddingHorizontal: 4,
  },
});
