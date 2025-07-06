import { MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export default function CartScreen() {
  const [cartItems, setCartItems] = useState([
    {
      id: '1',
      title: 'Pi Pizza Oven',
      subtitle: 'Estimated Ship Date: June 6th',
      fuelSource: 'Fuel Source: Wood Only',
      price: 469.99,
      quantity: 1,
      image: 'https://cdn.example.com/pizza-oven.jpg',
    },
    {
      id: '2',
      title: 'Grill Ultimate Bundle',
      subtitle: 'Add accident protection for $29.99',
      price: 549.99,
      quantity: 1,
      image: 'https://cdn.example.com/grill-bundle.jpg',
    },
    {
      id: '3',
      title: 'Starters (4 pack)',
      price: 0.0,
      quantity: 1,
      image: 'https://cdn.example.com/starters.jpg',
    },
    {
      id: '4',
      title: 'Charcoal Grill Pack',
      price: 0.0,
      quantity: 1,
      image: 'https://cdn.example.com/charcoal.jpg',
    },
  ]);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const tax = 102.0;
  const total = subtotal + tax;

  function handleQuantityChange(id, delta) {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  }

  function handleRemoveItem(id) {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Your Cart ({cartItems.length} items)</Text>

      {/* Cart Table Header */}
      <View style={styles.tableHeader}>
        <Text style={[styles.headerCell, {flex: 2.2}]}>Item</Text>
        <Text style={[styles.headerCell, {flex: 1}]}>Price</Text>
        <Text style={[styles.headerCell, {flex: 1.2}]}>Quantity</Text>
        <Text style={[styles.headerCell, {flex: 1}]}>Total</Text>
      </View>

      {cartItems.map((item) => (
        <View key={item.id} style={styles.cartItem}>
          {/* Close Icon */}
          <TouchableOpacity style={styles.closeIcon} onPress={() => handleRemoveItem(item.id)}>
            <MaterialIcons name="close" size={20} color="#888" />
          </TouchableOpacity>
          {/* Image */}
          <Image source={{ uri: item.image }} style={styles.image} />
          {/* Product Name and Subtitle */}
          <View style={styles.nameContent}>
            <Text style={styles.title}>{item.title}</Text>
            {item.subtitle && (
              <Text style={styles.subtitle}>{item.subtitle}</Text>
            )}
            {item.fuelSource && (
              <Text style={styles.fuel}>{item.fuelSource}</Text>
            )}
          </View>
          {/* Price */}
          <View style={styles.priceContent}>
            <Text style={styles.unitPrice}>${item.price.toFixed(2)}</Text>
          </View>
          {/* Quantity */}
          <View style={styles.quantityContent}>
            <View style={styles.quantityContainer}>
              <TouchableOpacity onPress={() => handleQuantityChange(item.id, -1)}>
                <Text style={styles.qtyButton}>−</Text>
              </TouchableOpacity>
              <Text style={styles.quantity}>{item.quantity}</Text>
              <TouchableOpacity onPress={() => handleQuantityChange(item.id, 1)}>
                <Text style={styles.qtyButton}>＋</Text>
              </TouchableOpacity>
            </View>
          </View>
          {/* Total */}
          <View style={styles.totalContent}>
            <Text style={styles.itemTotal}>${(item.price * item.quantity).toFixed(2)}</Text>
          </View>
        </View>
      ))}

      <View style={styles.summary}>
        <Text style={styles.line}>Subtotal: ${subtotal.toFixed(2)}</Text>
        <Text style={styles.line}>Sales Tax: ${tax.toFixed(2)}</Text>
        <TextInput placeholder="Add Coupon" style={styles.couponInput} />
        <Text style={styles.total}>Grand total: ${total.toFixed(2)}</Text>
        <Text style={styles.freeShipping}>
          Congrats, you're eligible for{' '}
          <Text style={{ fontWeight: 'bold' }}>Free Shipping</Text>
        </Text>
        <TouchableOpacity style={styles.checkoutBtn}>
          <Text style={styles.checkoutText}>Check out</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#fff' },
  header: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 16,
    position: 'relative',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingTop: 12,
    minHeight: 100,
    flexWrap: 'wrap',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  closeIcon: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 2,
    padding: 4,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    elevation: 1,
  },
  nameContent: {
    flex: 2.2,
    justifyContent: 'center',
    marginRight: 6,
    minWidth: 100,
    maxWidth: 140,
  },
  priceContent: {
    flex: 1,
    alignItems: 'center',
    minWidth: 60,
  },
  quantityContent: {
    flex: 1.2,
    alignItems: 'center',
    minWidth: 80,
  },
  totalContent: {
    flex: 1,
    alignItems: 'center',
    minWidth: 60,
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 8,
    marginRight: 10,
    marginLeft: 4,
    marginTop: 4,
    backgroundColor: '#f8f8f8',
  },
  middleContent: {
    flex: 1,
    justifyContent: 'center',
  },
  rightContent: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 80,
  },
  title: { fontWeight: '600', fontSize: 15, marginBottom: 2, flexWrap: 'wrap' },
  subtitle: { color: 'orange', fontWeight: 'bold', fontSize: 12, flexWrap: 'wrap' },
  fuel: { fontSize: 11, color: '#555', flexWrap: 'wrap' },
  unitPrice: { fontSize: 15, fontWeight: 'bold' },
  itemTotal: {
    fontSize: 13,
    color: '#333',
    fontWeight: '500',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  qtyButton: {
    fontSize: 20,
    paddingHorizontal: 8,
    color: '#000',
    fontWeight: 'bold',
  },
  quantity: {
    fontSize: 15,
    marginHorizontal: 6,
    fontWeight: '500',
    minWidth: 18,
    textAlign: 'center',
  },
  summary: {
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    paddingTop: 20,
    marginTop: 10,
  },
  line: { fontSize: 16, marginBottom: 8 },
  couponInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  total: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  freeShipping: { color: 'green', marginBottom: 20 },
  checkoutBtn: {
    backgroundColor: 'black',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  checkoutText: { color: '#fff', fontWeight: 'bold' },
  tableHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#bbb',
    marginBottom: 8,
    marginTop: 8,
    backgroundColor: '#f6f6f6',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    paddingTop: 8,
    paddingHorizontal: 4,
  },
  headerCell: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
  },
});
