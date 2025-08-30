import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { environment } from '../environments/environment';
import { orderApi, OrderDetails } from '../../services/apiService';

// Updated interfaces to match sample JSON
interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productPrice: number;
  productImage?: string;
  quantity: number;
}

interface OrderDetails {
  id: string;
  name: string;
  address: string;
  mobileNumber: string;
  paymentMethod: string;
  total: number;
  orderDate: string;
  orderStatus: number;
  items: OrderItem[];
  subTotal?: number;
  deliveryCharge?: number;
  discount?: number;
}

function formatOrderDate(dateString: string) {
  const date = new Date(dateString);
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  return `${days[date.getDay()]} ${date.getDate()}, ${months[date.getMonth()]} ${date.getFullYear()}`;
}

function getStatusText(status: number) {
  switch (status) {
    case 1: return 'Processing';
    case 2: return 'Shipped';
    case 3: return 'Delivered';
    case 4: return 'Cancelled';
    default: return 'Unknown';
  }
}

export default function OrderHistoryDetails() {
  const { id } = useLocalSearchParams();
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const screenWidth = Dimensions.get('window').width;
  const isMobile = screenWidth < 600;

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await orderApi.getById(id as string);
        setOrder(response.data);
      } catch (err: any) {
        setError(err.message || 'Error loading order details');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchOrder();
  }, [id]);

  return (
    <View style={{ flex: 1, backgroundColor: '#f2f6f7' }}>
      <LinearGradient
        colors={["#90F7EC", "#32CCBC"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ padding: 8, height: 53 }}
      />
      <ScrollView style={styles.checkoutParentContainer} contentContainerStyle={{ flexGrow: 1 }}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.push('/order-history')}>
          <Text style={styles.backButtonText}>{'<'} Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Order Details</Text>
        {loading ? (
          <ActivityIndicator size="large" color="#32CCBC" style={{ marginVertical: 24 }} />
        ) : error ? (
          <Text style={{ textAlign: 'center', color: 'red', marginVertical: 24 }}>{error}</Text>
        ) : order ? (
          isMobile ? (
            <>
              <View style={styles.checkoutLeftMobile}>
                <Text style={styles.sectionTitle}>Order Info</Text>
                <Text style={styles.orderId}>Order ID: <Text style={{color:'#222'}}>{order.id}</Text></Text>
                <Text style={styles.orderDate}>Date: {formatOrderDate(order.orderDate)}</Text>
                <Text style={styles.orderStatus}>Status: {getStatusText(order.orderStatus)}</Text>
                <View style={styles.divider} />
                <Text style={styles.sectionTitle}>Customer Info</Text>
                <Text style={styles.infoText}>Name: <Text style={styles.infoValue}>{order.name}</Text></Text>
                <Text style={styles.infoText}>Address: <Text style={styles.infoValue}>{order.address}</Text></Text>
                <Text style={styles.infoText}>Mobile: <Text style={styles.infoValue}>{order.mobileNumber}</Text></Text>
                <Text style={styles.infoText}>Payment: <Text style={styles.infoValue}>{order.paymentMethod === 'cod' ? 'Cash on Delivery' : order.paymentMethod}</Text></Text>
              </View>
              <View style={styles.checkoutRight}>
                <Text style={styles.sectionTitle}>Products</Text>
                {order.items.length === 0 ? (
                  <Text>No products in this order.</Text>
                ) : (
                  order.items.map((item, idx) => (
                    <View key={item.id} style={styles.productRow}>
                      <Text style={{ flex: 2 }}>{item.productName}</Text>
                      <Text style={{ flex: 1, textAlign: 'center' }}>x{item.quantity}</Text>
                      <Text style={{ flex: 1, textAlign: 'right' }}>৳{item.productPrice?.toLocaleString()}</Text>
                    </View>
                  ))
                )}
                <View style={styles.divider} />
                <View style={styles.summaryBox}><Text>Subtotal:</Text><Text>৳{order.subTotal !== undefined ? order.subTotal.toLocaleString() : '-'}</Text></View>
                <View style={styles.summaryBox}><Text>Delivery Charge:</Text><Text>৳{order.deliveryCharge !== undefined ? order.deliveryCharge.toLocaleString() : '-'}</Text></View>
                <View style={styles.summaryBox}><Text>Discount:</Text><Text>৳{order.discount !== undefined ? order.discount.toLocaleString() : '-'}</Text></View>
                <View style={[styles.summaryBox, { borderTopWidth: 1, borderTopColor: '#eee', marginTop: 8, paddingTop: 8 }]}> 
                  <Text style={{ fontWeight: 'bold' }}>Total:</Text>
                  <Text style={{ fontWeight: 'bold', color: '#32CCBC' }}>৳{order.total.toLocaleString()}</Text>
                </View>
              </View>
            </>
          ) : (
            <View style={styles.checkoutRow}>
              <View style={styles.checkoutLeft}>
                <Text style={styles.sectionTitle}>Order Info</Text>
                <Text style={styles.orderId}>Order ID: <Text style={{color:'#222'}}>{order.id}</Text></Text>
                <Text style={styles.orderDate}>Date: {formatOrderDate(order.orderDate)}</Text>
                <Text style={styles.orderStatus}>Status: {getStatusText(order.orderStatus)}</Text>
                <View style={styles.divider} />
                <Text style={styles.sectionTitle}>Customer Info</Text>
                <Text style={styles.infoText}>Name: <Text style={styles.infoValue}>{order.name}</Text></Text>
                <Text style={styles.infoText}>Address: <Text style={styles.infoValue}>{order.address}</Text></Text>
                <Text style={styles.infoText}>Mobile: <Text style={styles.infoValue}>{order.mobileNumber}</Text></Text>
                <Text style={styles.infoText}>Payment: <Text style={styles.infoValue}>{order.paymentMethod === 'cod' ? 'Cash on Delivery' : order.paymentMethod}</Text></Text>
              </View>
              <View style={styles.checkoutRight}>
                <Text style={styles.sectionTitle}>Products</Text>
                {order.items.length === 0 ? (
                  <Text>No products in this order.</Text>
                ) : (
                  order.items.map((item, idx) => (
                    <View key={item.id} style={styles.productRow}>
                      <Text style={{ flex: 2 }}>{item.productName}</Text>
                      <Text style={{ flex: 1, textAlign: 'center' }}>x{item.quantity}</Text>
                      <Text style={{ flex: 1, textAlign: 'right' }}>৳{item.productPrice?.toLocaleString()}</Text>
                    </View>
                  ))
                )}
                <View style={styles.divider} />
                <View style={styles.summaryBox}><Text>Subtotal:</Text><Text>৳{order.subTotal !== undefined ? order.subTotal.toLocaleString() : '-'}</Text></View>
                <View style={styles.summaryBox}><Text>Delivery Charge:</Text><Text>৳{order.deliveryCharge !== undefined ? order.deliveryCharge.toLocaleString() : '-'}</Text></View>
                <View style={styles.summaryBox}><Text>Discount:</Text><Text>৳{order.discount !== undefined ? order.discount.toLocaleString() : '-'}</Text></View>
                <View style={[styles.summaryBox, { borderTopWidth: 1, borderTopColor: '#eee', marginTop: 8, paddingTop: 8 }]}> 
                  <Text style={{ fontWeight: 'bold' }}>Total:</Text>
                  <Text style={{ fontWeight: 'bold', color: '#32CCBC' }}>৳{order.total.toLocaleString()}</Text>
                </View>
              </View>
            </View>
          )
        ) : null}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 8,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 8,
    marginLeft: 4,
    marginTop: 8,
  },
  backButtonText: {
    color: '#32CCBC',
    fontWeight: 'bold',
    fontSize: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#32CCBC',
    marginBottom: 18,
    textAlign: 'center',
    alignSelf: 'center',
  },
  checkoutParentContainer: {
    flexDirection: 'column',
    paddingHorizontal: 16,
    paddingTop: 16,
    flex: 1,
  },
  checkoutRow: {
    flexDirection: 'row',
    width: '100%',
  },
  checkoutLeft: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginRight: 12,
    minWidth: 100,
    padding: 12,
  },
  checkoutLeftMobile: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginRight: 12,
    minWidth: 100,
    padding: 12,
  },
  checkoutRight: {
    flex: 2,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    minWidth: 180,
  },
  orderId: {
    fontWeight: 'bold',
    fontSize: 17,
    color: '#32CCBC',
    marginBottom: 2,
  },
  orderDate: {
    color: '#888',
    fontSize: 14,
    marginBottom: 2,
  },
  orderStatus: {
    color: '#2196F3',
    fontWeight: 'bold',
    fontSize: 15,
    marginBottom: 10,
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 10,
    marginBottom: 6,
    color: '#333',
  },
  infoText: {
    fontSize: 15,
    color: '#444',
    marginBottom: 2,
  },
  infoValue: {
    fontWeight: 'bold',
    color: '#222',
  },
  productRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  divider: {
    borderBottomWidth: 1,
    borderColor: '#e0e0e0',
    marginVertical: 12,
  },
  summaryBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
});
