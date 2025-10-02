import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from "expo-linear-gradient";
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from "react";
import { Animated, Dimensions, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useAuth } from './AuthContext';
import WebsiteBanner from './components/WebsiteBanner';
import WebsiteFooter from './components/WebsiteFooter';
import type { Product } from './product';
import ShowProducts from './product';

export default function HomeScreen() {
  const [addedToCart, setAddedToCart] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  
  const screenWidth = Dimensions.get('window').width;
  const drawerWidth = screenWidth * 0.2; // Reduced from 0.8 to 0.7 (70% of screen width)
  const drawerAnimation = useRef(new Animated.Value(-drawerWidth)).current;

  useEffect(() => {
  AsyncStorage.getItem("cart").then((data) => {
    if (data) setAddedToCart(JSON.parse(data));
  });
}, []);

useEffect(() => {
  AsyncStorage.setItem("cart", JSON.stringify(addedToCart));
}, [addedToCart]);

  const handleAuthAction = () => {
    if (isAuthenticated) {
      logout();
    } else {
      router.push('/sign-in');
    }
  };

  const toggleDrawer = () => {
    console.log('Toggle drawer clicked, current state:', isDrawerOpen);
    console.log('Drawer width:', drawerWidth);
    console.log('Screen width:', screenWidth);
    if (isDrawerOpen) {
      Animated.timing(drawerAnimation, {
        toValue: -drawerWidth,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(drawerAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
    setIsDrawerOpen(!isDrawerOpen);
  };

  const closeDrawer = () => {
    Animated.timing(drawerAnimation, {
      toValue: -drawerWidth,
      duration: 300,
      useNativeDriver: true,
    }).start();
    setIsDrawerOpen(false);
  };

  const handleDrawerNavigation = (route: string) => {
    closeDrawer();
    router.push(route);
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Navigation Drawer - moved to top for better z-index */}
      <Animated.View
        style={[
          styles.drawer,
          {
            width: drawerWidth,
            transform: [{ translateX: drawerAnimation }],
          },
        ]}
      >
        <LinearGradient
          colors={["#90F7EC", "#32CCBC"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.drawerHeader}
        >
          <Text style={styles.drawerTitle}>Menu</Text>
          <MaterialIcons
            name="close"
            size={24}
            color="#222"
            onPress={closeDrawer}
            style={styles.closeIcon}
          />
        </LinearGradient>

        <ScrollView style={styles.drawerContent}>
          <TouchableOpacity
            style={styles.drawerItem}
            onPress={() => handleDrawerNavigation('/home')}
          >
            <MaterialIcons name="home" size={24} color="#32CCBC" />
            <Text style={styles.drawerItemText}>Home</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.drawerItem}
            onPress={() => handleDrawerNavigation('/cart')}
          >
            <MaterialIcons name="shopping-cart" size={24} color="#32CCBC" />
            <Text style={styles.drawerItemText}>Cart ({addedToCart.length})</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.drawerItem}
            onPress={() => handleDrawerNavigation('/order-history')}
          >
            <MaterialIcons name="history" size={24} color="#32CCBC" />
            <Text style={styles.drawerItemText}>Order History</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.drawerItem}
            onPress={() => handleDrawerNavigation('/product')}
          >
            <MaterialIcons name="inventory" size={24} color="#32CCBC" />
            <Text style={styles.drawerItemText}>Products</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.drawerItem}
            onPress={handleAuthAction}
          >
            <MaterialIcons
              name={isAuthenticated ? "logout" : "person"}
              size={24}
              color="#32CCBC"
            />
            <Text style={styles.drawerItemText}>
              {isAuthenticated ? "Logout" : "Sign In"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.drawerItem}
            onPress={() => handleDrawerNavigation('/checkout')}
          >
            <MaterialIcons name="payment" size={24} color="#32CCBC" />
            <Text style={styles.drawerItemText}>Checkout</Text>
          </TouchableOpacity>
        </ScrollView>
      </Animated.View>

      {/* Drawer Overlay */}
      {isDrawerOpen && (
        <TouchableOpacity
          style={styles.drawerOverlay}
          activeOpacity={1}
          onPress={closeDrawer}
        />
      )}

      <View style={styles.stickyHeaderSection}>
        <LinearGradient
          colors={["#90F7EC", "#32CCBC"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerSection}
        >
          <View style={styles.headerRow}>
            <MaterialIcons
              name={isDrawerOpen ? "close" : "menu"}
              size={28}
              color="#222"
              style={styles.menuIcon}
              onPress={toggleDrawer}
            />
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
              <TouchableOpacity style={styles.signInContainer} onPress={handleAuthAction}> 
                <MaterialIcons
                  name={isAuthenticated ? "logout" : "person"}
                  size={24}
                  style={styles.signInIcon}
                />
                <Text style={styles.signInText}>
                  {isAuthenticated ? "Logout" : "Sign in"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <WebsiteBanner />
        <ShowProducts addedToCart={addedToCart} setAddedToCart={setAddedToCart} />
        <WebsiteFooter />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#f7f7f7',
    paddingBottom: 24,
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
    color: 'black',
    marginRight: 10,
    marginTop: 4,
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
    marginTop: 4,
  },
  counterText: {
    color: '#32CCBC',
    fontWeight: 'bold',
    fontSize: 10,
  },
  menuIcon: {
    marginRight: 8,
    marginLeft: 4,
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
    marginLeft: 8,
  },
  signInContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  signInIcon: {
    color: '#222',
    marginRight: 4,
  },
  signInText: {
    color: '#222',
    fontSize: 18,
    fontWeight: '400',
  },
  stickyHeaderSection: {
    position: 'sticky', // works on web
    top: 0,
    zIndex: 100,
    backgroundColor: 'transparent',
  },
  drawerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 998,
  },
  drawer: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    backgroundColor: '#fff',
    zIndex: 999,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
    borderRightWidth: 2,
    borderRightColor: '#32CCBC',
  },
  drawerHeader: {
    padding: 20,
    paddingTop: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  drawerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#222',
  },
  closeIcon: {
    padding: 4,
  },
  drawerContent: {
    flex: 1,
    paddingTop: 20,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  drawerItemText: {
    fontSize: 18,
    color: '#333',
    marginLeft: 16,
    fontWeight: '500',
  },
});
