import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from "expo-linear-gradient";
import { router } from 'expo-router';
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
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
    <View style={{ flex: 1 }}>
      <View style={styles.stickyHeaderSection}>
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
              <TouchableOpacity style={styles.signInContainer} onPress={() => router.push('/sign-in')}> 
                <MaterialIcons
                  name="person"
                  size={24}
                  style={styles.signInIcon}
                />
                <Text style={styles.signInText}>Sign in</Text>
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity
            style={styles.orderSummaryButton}
            onPress={() => router.push('/order-history')}
          >
            <Text style={styles.orderSummaryButtonText}>See Order Summary</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Website Banner */}
        <View style={styles.websiteBanner}>
            <Text style={styles.websiteBannerText}>Welcome to EcbMart! Enjoy your shopping experience.</Text>
          </View>
        <ShowProducts addedToCart={addedToCart} setAddedToCart={setAddedToCart} />
        <View style={styles.footerSection}>
          <View style={styles.footerContent}>
            {/* About/Brand Section */}
            <View style={styles.footerCol}>
              <Text style={styles.footerBrand}>EcbMart</Text>
              <Text style={styles.footerAbout}>
                Largest product search engine, maximum categorized online shopping mall and quickest home delivery system.
              </Text>
              <Text style={styles.footerFollow}>Follow Us</Text>
              <View style={styles.footerSocialRow}>
                <MaterialIcons name="facebook" size={24} style={styles.footerSocialIcon} />
                <MaterialIcons name="public" size={24} style={styles.footerSocialIcon} />
                <MaterialIcons name="ondemand-video" size={24} style={styles.footerSocialIcon} />
              </View>
            </View>
            {/* Contact Us */}
            <View style={styles.footerCol}>
              <Text style={styles.footerColTitle}>Contact Us</Text>
              <Text style={styles.footerColText}>Matikata Road, Ecb Chattar.</Text>
              <Text style={styles.footerColText}>Email: support@ecbmart.com</Text>
            </View>
            {/* Help Section */}
            <View style={styles.footerCol}>
              <Text style={styles.footerColTitle}>Let Us Help You</Text>
              <Text style={styles.footerColText}>Your Account</Text>
              <Text style={styles.footerColText}>Your Order</Text>
              <Text style={styles.footerColText}>Terms & Conditions</Text>
              <Text style={styles.footerColText}>Return & Refund Policy</Text>
              <Text style={styles.footerColText}>FAQ</Text>
            </View>
            {/* App Download Section */}
            <View style={styles.footerCol}>
              <Text style={styles.footerColTitle}>Get EcbMart App</Text>
              <View style={styles.footerAppRow}>
                <View style={styles.footerAppBadge} />
                <View style={styles.footerAppBadge} />
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
      <Text style={styles.footerCopyright}>© 2025 EcbMart.com Limited. All rights reserved.</Text>
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
  websiteBanner: {
    backgroundColor: '#fffbe6',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginTop: 8,
    marginBottom: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ffe58f',
    shadowColor: '#ffe58f',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
    height: 400,
  },
  websiteBannerText: {
    color: '#ad8b00',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  stickyHeaderSection: {
    position: 'sticky', // works on web
    top: 0,
    zIndex: 100,
    backgroundColor: 'transparent',
  },
  footerSection: {
    width: '100%',
    backgroundColor: '#181e29',
    paddingTop: 32,
    paddingBottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: 1200,
    paddingHorizontal: 24,
    marginBottom: 24,
    flexWrap: 'wrap',
  },
  footerCol: {
    flex: 1,
    minWidth: 180,
    maxWidth: 260,
    marginHorizontal: 12,
    marginBottom: 16,
  },
  footerBrand: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  footerAbout: {
    color: '#d1d5db',
    fontSize: 15,
    marginBottom: 16,
  },
  footerFollow: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  footerSocialRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  footerSocialIcon: {
    color: 'white',
    marginRight: 12,
  },
  footerColTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  footerColText: {
    color: '#d1d5db',
    fontSize: 15,
    marginBottom: 6,
  },
  footerAppRow: {
    flexDirection: 'column',
    gap: 10,
    marginTop: 8,
  },
  footerAppBadge: {
    width: 160,
    height: 44,
    backgroundColor: '#222',
    borderRadius: 8,
    marginBottom: 8,
  },
  footerDbidRow: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 16,
  },
  footerDbidBadge: {
    backgroundColor: 'white',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    minWidth: 120,
    marginBottom: 8,
  },
  footerDbidText: {
    color: '#7c3aed',
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 2,
  },
  footerDbidNumber: {
    color: '#181e29',
    fontWeight: 'bold',
    fontSize: 16,
  },
  footerCopyright: {
    color: '#b0b6c1',
    fontSize: 15,
    textAlign: 'center',
    paddingVertical: 18,
    width: '100%',
    backgroundColor: '#151922',
  },
});
