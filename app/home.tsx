import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import ShowProducts, { Product } from './product';

export default function HomeScreen() {
  const [addedToCart, setAddedToCart] = useState<Product[]>([]);
  const [search, setSearch] = useState("");

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
            <MaterialIcons style={styles.cartIconStyle} name="shopping-cart" size={24} />
            <View style={styles.counterBadge}>
              <Text style={styles.counterText}>{addedToCart.length}</Text>
            </View>
          </View>
        </View>
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
});
