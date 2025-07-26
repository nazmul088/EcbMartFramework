import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from "expo-linear-gradient";
import { router } from 'expo-router';
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import type { Product } from './product';
import ShowProducts from './product';

export default function HomeScreen() {
  const [addedToCart, setAddedToCart] = useState<Product[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
  AsyncStorage.getItem("cart").then((data) => {
    if (data) setAddedToCart(JSON.parse(data));
  });
}, []);

useEffect(() => {
  AsyncStorage.setItem("cart", JSON.stringify(addedToCart));
}, [addedToCart]);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#90F7EC", "#32CCBC"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerSection}
      >
        <View style={styles.headerRow}>
          <TextInput
            style={styles.searchBox}
            placeholder="Search products..."
            placeholderTextColor="black"
            value={search}
            onChangeText={setSearch}
          />
          <View style={styles.contentFlow}>
            <MaterialIcons
              style={styles.cartIconStyle}
              name="shopping-cart"
              size={24}
              onPress={() => router.push('/cart')}
            />
            <View style={styles.counterBadge}>
              <Text style={styles.counterText}>{addedToCart.length}</Text>
            </View>
          </View>
        </View>
        <TouchableOpacity
          style={styles.orderSummaryButton}
          onPress={() => router.push('/order-history')}
        >
          <Text style={styles.orderSummaryButtonText}>See Order Summary</Text>
        </TouchableOpacity>
      </LinearGradient>
      <ShowProducts addedToCart={addedToCart} setAddedToCart={setAddedToCart} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  headerSection: {
    padding: 8,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    gap: 8,
  },
  contentFlow: {
    flexDirection: 'row',
  },
  cartIconStyle: {
    color: 'red',
    marginRight: 10,
    cursor: "pointer"
  },
  counterBadge: {
    position: 'absolute',
    top: -6,
    left: 15,
    backgroundColor: 'white',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 3,
    borderWidth: 1,
    borderColor: '#32CCBC',
  },
  counterText: {
    color: '#32CCBC',
    fontWeight: 'bold',
    fontSize: 10,
  },
  searchBox: {
    backgroundColor: 'white',
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 8,
    fontSize: 16,
    color: '#32CCBC',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#32CCBC',
    minWidth: 120,
    flex: 1,
    marginLeft: 12,
  },
  orderSummaryButton: {
    backgroundColor: '#32CCBC',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 24,
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 4,
    shadowColor: '#32CCBC',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  orderSummaryButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
});
