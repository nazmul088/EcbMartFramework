import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from '@react-native-picker/picker';
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { CartItems } from "./cart";
import { environment } from "./environments/environment";

export default function CheckoutScreen() {
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [name, setName] = useState("");
  // Removed map-related state
  const [address, setAddress] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const screenWidth = Dimensions.get("window").width;
  const isMobile = screenWidth < 600;
  const [orderSummary, setOrderSummary] = useState<CartItems>({
    subTotal: 0,
    deliveryCharge: 0,
    discount: 0,
    total: 0,
    items: [],
  });
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);


  const handleOrderButtonClick = async() => {
    if (isPlacingOrder) return;
    setIsPlacingOrder(true);
    //Need to call Backend API to place order
    if (!name || !address || !mobileNumber) {
      alert("Please fill all fields");
      setIsPlacingOrder(false);
      return;
    }
    if (orderSummary.items.length === 0) {
      alert("No products in cart");
      setIsPlacingOrder(false);
      return;
    }

    const updatedOrderSummary = {
      ...orderSummary,
      items: orderSummary.items.map((item: any) => ({
        productId: item.id,
        quantity: item.quantity,
        price: item.price,
      }))
    };

    const orderDetails = {
      name,
      address,
      mobileNumber,
      paymentMethod,
      items: updatedOrderSummary.items,
      total: updatedOrderSummary.total,
    };
    try {
      const response = await fetch(`${environment.apiUrl}/api/order/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderDetails),
      });
      if (!response.ok) {
        throw new Error('Failed to place order');
      }
      alert("Order placed successfully");
      // Clear cart after successful order
      await AsyncStorage.removeItem("cartItems");
      await AsyncStorage.removeItem("cart");
      setOrderSummary({
        subTotal: 0,
        deliveryCharge: 0,
        discount: 0,
        total: 0,
        items: [],
      });
      setIsPlacingOrder(false);
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Failed to place order. Please try again.");  
      setIsPlacingOrder(false);
  }
}

  useEffect(() => {
    AsyncStorage.getItem("cartItems").then((data) => {
      if (data) {
        const parsed = JSON.parse(data);
        setOrderSummary({
          subTotal: parsed.subTotal ?? 0,
          deliveryCharge: parsed.deliveryCharge ?? 0,
          discount: parsed.discount ?? 0,
          total: parsed.total ?? 0,
          items: parsed.items ?? [],
        });
      }
    });
  }, []);

  return (
    <View style={{ flexDirection: "column", minHeight: 100 }}>
      <LinearGradient
        colors={["#90F7EC", "#32CCBC"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ padding: 8, height: 53 }}
      ></LinearGradient>
      <ScrollView style={styles.checkoutParentContainer}>
        {isMobile ? (
          <>
            <View style={styles.checkoutRight}>
              <Text
                style={{ fontWeight: "bold", fontSize: 18, marginBottom: 12 }}
              >
                Order Summary
              </Text>
              {/* Product List */}
              <View style={{ marginBottom: 16 }}>
                {orderSummary.items.length === 0 ? (
                  <Text>No products in cart.</Text>
                ) : (
                  orderSummary.items.map((item, idx) => (
                    <View key={idx} style={styles.productRow}>
                      <Text
                        style={{
                          width: 24,
                          textAlign: "right",
                          marginRight: 8,
                        }}
                      >
                        {idx + 1}.
                      </Text>
                      <Text style={{ flex: 2 }}>{item.name}</Text>
                      <Text style={{ flex: 1, textAlign: "center" }}>
                        x{item.quantity}
                      </Text>
                      <Text style={{ flex: 1, textAlign: "right" }}>
                        ${(item.price ?? 0).toFixed(2)}
                      </Text>
                    </View>
                  ))
                )}
              </View>
              {/* Order Summary */}
              <View style={styles.summaryBox}>
                <Text>Subtotal:</Text>
                <Text>${orderSummary.subTotal.toFixed(2)}</Text>
              </View>
              <View style={styles.summaryBox}>
                <Text>Delivery Charge:</Text>
                <Text>${orderSummary.deliveryCharge.toFixed(2)}</Text>
              </View>
              <View style={styles.summaryBox}>
                <Text>Discount:</Text>
                <Text>${orderSummary.discount.toFixed(2)}</Text>
              </View>
              <View
                style={[
                  styles.summaryBox,
                  {
                    borderTopWidth: 1,
                    borderTopColor: "#eee",
                    marginTop: 8,
                    paddingTop: 8,
                  },
                ]}
              >
                <Text style={{ fontWeight: "bold" }}>Total:</Text>
                <Text style={{ fontWeight: "bold", color: "#32CCBC" }}>
                  ${orderSummary.total.toFixed(2)}
                </Text>
              </View>
            </View>
            <View style={styles.checkoutLeftMobile}>
              <Text style={styles.inputLabel}>Name</Text>
              <View style={styles.inputBoxWrapper}>
                <TextInput
                  style={styles.inputBox}
                  placeholder="Enter your name"
                  placeholderTextColor="#aaa"
                  value={name}
                  onChangeText={setName}
                />
              </View>
              <Text style={styles.inputLabel}>Delivery Address</Text>
              <View style={styles.inputBoxWrapper}>
                <TextInput
                  style={[styles.inputBox, { height: 60 }]}
                  placeholder="Enter delivery address"
                  placeholderTextColor="#aaa"
                  value={address}
                  onChangeText={setAddress}
                  multiline
                />
              </View>

              <Text style={styles.inputLabel}>Mobile Number</Text>
              <View style={styles.inputBoxWrapper}>
                <TextInput
                  style={styles.inputBox}
                  placeholder="Enter mobile number"
                  placeholderTextColor="#aaa"
                  keyboardType="phone-pad"
                  value={mobileNumber}
                  onChangeText={setMobileNumber}
                />
              </View>
              <Text style={styles.inputLabel}>Payment Method</Text>
              <View style={styles.inputBoxWrapper}>
                <View style={styles.pickerWrapper}>
                  <Picker
                    selectedValue={paymentMethod}
                    onValueChange={(itemValue) => setPaymentMethod(itemValue)}
                    style={styles.picker}
                    itemStyle={styles.pickerItem}
                    dropdownIconColor="#32CCBC"
                  >
                    <Picker.Item label="Credit/Debit Card" value="card" />
                    <Picker.Item label="Cash on Delivery" value="cod" />
                    <Picker.Item label="Mobile Banking" value="mobile_banking" />
                  </Picker>
                </View>
              </View>

            </View>
          </>
        ) : (
          <View style={styles.checkoutRow}>
            <View style={styles.checkoutLeft}>
              <Text style={styles.inputLabel}>Name</Text>
              <View style={styles.inputBoxWrapper}>
                <TextInput
                  style={styles.inputBox}
                  placeholder="Enter your name"
                  placeholderTextColor="#aaa"
                  value={name}
                  onChangeText={setName}
                />
              </View>

              <Text style={styles.inputLabel}>Mobile Number</Text>
              <View style={styles.inputBoxWrapper}>
                <TextInput
                  style={styles.inputBox}
                  placeholder="Enter mobile number"
                  placeholderTextColor="#aaa"
                  keyboardType="phone-pad"
                  value={mobileNumber}
                  onChangeText={setMobileNumber}
                  maxLength={15}
                />
              </View>
              <Text style={styles.inputLabel}>Delivery Address</Text>
              <View style={styles.inputBoxWrapper}>
                <TextInput
                  style={[styles.inputBox, { height: 60 }]}
                  placeholder="Enter delivery address"
                  placeholderTextColor="#aaa"
                  value={address}
                  onChangeText={setAddress}
                  multiline
                />
              </View>
              <Text style={styles.inputLabel}>Payment Method</Text>
              <View style={styles.inputBoxWrapper}>
                <View style={styles.pickerWrapper}>
                  <Picker
                    selectedValue={paymentMethod}
                    onValueChange={(itemValue) => setPaymentMethod(itemValue)}
                    style={styles.picker}
                    itemStyle={styles.pickerItem}
                    dropdownIconColor="#32CCBC"
                  >
                    <Picker.Item label="Credit/Debit Card" value="card" />
                    <Picker.Item label="Cash on Delivery" value="cod" />
                    <Picker.Item label="Mobile Banking" value="mobile_banking" />
                  </Picker>
                </View>
              </View>
            </View>
            <View style={styles.checkoutRight}>
              <Text
                style={{ fontWeight: "bold", fontSize: 18, marginBottom: 12 }}
              >
                Order Summary
              </Text>
              {/* Product List */}
              <View style={{ marginBottom: 16 }}>
                {orderSummary.items.length === 0 ? (
                  <Text>No products in cart.</Text>
                ) : (
                  orderSummary.items.map((item, idx) => (
                    <View key={idx} style={styles.productRow}>
                      <Text
                        style={{
                          width: 24,
                          textAlign: "right",
                          marginRight: 8,
                        }}
                      >
                        {idx + 1}.
                      </Text>
                      <Text style={{ flex: 2 }}>{item.name}</Text>
                      <Text style={{ flex: 1, textAlign: "center" }}>
                        x{item.quantity}
                      </Text>
                      <Text style={{ flex: 1, textAlign: "right" }}>
                        ${(item.price ?? 0).toFixed(2)}
                      </Text>
                    </View>
                  ))
                )}
              </View>
              {/* Order Summary */}
              <View style={styles.summaryBox}>
                <Text>Subtotal:</Text>
                <Text>${orderSummary.subTotal.toFixed(2)}</Text>
              </View>
              <View style={styles.summaryBox}>
                <Text>Delivery Charge:</Text>
                <Text>${orderSummary.deliveryCharge.toFixed(2)}</Text>
              </View>
              <View style={styles.summaryBox}>
                <Text>Discount:</Text>
                <Text>${orderSummary.discount.toFixed(2)}</Text>
              </View>
              <View
                style={[
                  styles.summaryBox,
                  {
                    borderTopWidth: 1,
                    borderTopColor: "#eee",
                    marginTop: 8,
                    paddingTop: 8,
                  },
                ]}
              >
                <Text style={{ fontWeight: "bold" }}>Total:</Text>
                <Text style={{ fontWeight: "bold", color: "#32CCBC" }}>
                  ${orderSummary.total.toFixed(2)}
                </Text>
              </View>
            </View>
          </View>
        )}

        <View style = { styles.proceedButtonRow}>
          <button
            style={styles.proceedButton}
            onClick={handleOrderButtonClick}
            disabled={isPlacingOrder}
          >
            {isPlacingOrder ? 'Processing...' : 'Proceed to Order'}
          </button>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  pickerWrapper: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#32CCBC',
    overflow: 'hidden',
    marginBottom: 0,
    shadowColor: '#32CCBC',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  picker: {
    height: 44,
    color: '#333',
    fontSize: 15,
    paddingHorizontal: 12,
    backgroundColor: 'transparent',
  },
  pickerItem: {
    fontSize: 15,
    color: '#333',
    height: 44,
    backgroundColor: 'transparent',
  },
  proceedButtonRow: {
    alignSelf: "flex-end",
    marginBottom: 24,
    marginTop: 16,
  },
  proceedButtonContainer: {
    alignItems: "flex-end",
  },
  proceedButton: {
    backgroundColor: "#32CCBC",
    color: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    fontWeight: "bold",
    fontSize: 18,
    shadowColor: "#32CCBC",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
    textAlign: "center",
    marginRight: 16,
    width: 300,
    cursor: "pointer"
  },
  inputLabel: {
    fontSize: 15,
    fontWeight: "500",
    marginBottom: 6,
    marginTop: 10,
    color: "#333",
  },
  inputBoxWrapper: {
    marginBottom: 10,
  },
  inputBox: {
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#32CCBC",
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: "#333",
    shadowColor: "#32CCBC",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  productRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  summaryBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  checkoutRow: {
    flexDirection: "row",
    width: "100%",
  },
  checkoutLeft: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    marginRight: 12,
    minWidth: 100,
    padding: 12,
  },
  checkoutLeftMobile:{
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    marginRight: 12,
    minWidth: 100,
    padding: 12,
  },
  checkoutRight: {
    flex: 2,
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    minWidth: 180,
  },
  checkoutParentContainer: {
    flexDirection: "column",
    paddingHorizontal: 16,
    paddingTop: 16,
  },
});
