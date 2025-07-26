import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { environment } from './environments/environment';

interface OrderHistory {
  orderId: string;
  orderDate: string;
  orderStatus: string;
  orderTotal: string;
}

function formatOrderDate(dateString: string) {
  const date = new Date(dateString);
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  return `${days[date.getDay()]} ${date.getDate()}, ${months[date.getMonth()]} ${date.getFullYear()}`;
}

export default function OrderHistoryScreen() {
  const [orders, setOrders] = useState<OrderHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleOrderClick = (order: OrderHistory) => {
    router.push(`/order-history/${order.orderId}`);
  };

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${environment.apiUrl}/api/order-history/all`);
        if (!response.ok) {
          throw new Error('Failed to fetch order history');
        }
        const data = await response.json();
        setOrders(data);
      } catch (err: any) {
        setError(err.message || 'Error loading order history');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: '#f2f6f7' }}>
      <LinearGradient
        colors={["#90F7EC", "#32CCBC"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ padding: 8, height: 53 }}
      />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Order History</Text>
        {loading ? (
          <ActivityIndicator size="large" color="#32CCBC" style={{ marginVertical: 24 }} />
        ) : error ? (
          <Text style={{ textAlign: 'center', color: 'red', marginVertical: 24 }}>{error}</Text>
        ) : orders.length === 0 ? (
          <Text style={{ textAlign: 'center', color: '#888', marginVertical: 24 }}>No orders found.</Text>
        ) : (
          orders.map((order) => (
            <TouchableOpacity key={order.orderId} style={styles.card} onPress={() => handleOrderClick(order)}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={styles.orderId}>{order.orderId}</Text>
                <View style={styles.statusBadge}>
                  <Text style={styles.statusBadgeText}>{order.orderStatus || 'Processing'}</Text>
                </View>
              </View>
              <Text style={styles.orderDate}>{formatOrderDate(order.orderDate)}</Text>
              <View style={styles.paidTotalRow}>
                <View style={styles.pillBox}>
                  <Text style={styles.pillText}>Total: ৳{Number(order.orderTotal).toLocaleString()}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}
        <TouchableOpacity style={styles.button} onPress={() => router.push('/home')}> 
          <Text style={styles.buttonText}>Back to Home</Text>
        </TouchableOpacity>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#32CCBC',
    marginBottom: 18,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 18,
    width: '100%',
    maxWidth: 420,
    shadowColor: '#32CCBC',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
    alignSelf: 'center',
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  orderId: {
    fontWeight: 'bold',
    fontSize: 17,
    color: '#222',
  },
  statusBadge: {
    backgroundColor: '#2196F3',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 3,
    alignSelf: 'flex-start',
  },
  statusBadgeText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13,
  },
  orderDate: {
    color: '#888',
    fontSize: 14,
    marginTop: 2,
    marginBottom: 8,
  },
  accountLabel: {
    fontWeight: 'bold',
    fontSize: 15,
    marginBottom: 2,
    color: '#222',
  },
  accountValue: {
    fontWeight: 'bold',
    color: '#222',
  },
  paidTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    gap: 10,
  },
  pillBox: {
    backgroundColor: '#f6f6f6',
    borderRadius: 10,
    paddingVertical: 7,
    paddingHorizontal: 18,
    flex: 1,
    marginRight: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillText: {
    color: '#222',
    fontWeight: 'bold',
    fontSize: 15,
  },
  button: {
    backgroundColor: '#32CCBC',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 32,
    marginTop: 24,
    alignSelf: 'center',
    shadowColor: '#32CCBC',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
});
