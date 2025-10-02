import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function WebsiteBanner() {
  return (
    <View style={styles.bannerContainer}>
      <LinearGradient
        colors={["#32CCBC", "#90F7EC", "#32CCBC"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.bannerGradient}
      >
        <View style={styles.bannerContent}>
          <View style={styles.bannerTextContainer}>
            <Text style={styles.bannerTitle}>Welcome to EcbMart</Text>
            <Text style={styles.bannerSubtitle}>Your Ultimate Shopping Destination</Text>
            <Text style={styles.bannerDescription}>
              Discover amazing products at unbeatable prices. Fast delivery, secure payments, and exceptional customer service.
            </Text>
            <View style={styles.bannerFeatures}>
              <View style={styles.featureItem}>
                <MaterialIcons name="local-shipping" size={20} color="#fff" />
                <Text style={styles.featureText}>Free Delivery</Text>
              </View>
              <View style={styles.featureItem}>
                <MaterialIcons name="security" size={20} color="#fff" />
                <Text style={styles.featureText}>Secure Payment</Text>
              </View>
              <View style={styles.featureItem}>
                <MaterialIcons name="support-agent" size={20} color="#fff" />
                <Text style={styles.featureText}>24/7 Support</Text>
              </View>
            </View>
          </View>
          <View style={styles.bannerIconContainer}>
            <MaterialIcons name="shopping-bag" size={80} color="#fff" style={styles.bannerIcon} />
            <View style={styles.bannerBadge}>
              <Text style={styles.badgeText}>NEW</Text>
            </View>
          </View>
        </View>
        <View style={styles.bannerBottom}>
          <View style={styles.bannerStats}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>10K+</Text>
              <Text style={styles.statLabel}>Happy Customers</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>5K+</Text>
              <Text style={styles.statLabel}>Products</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>99%</Text>
              <Text style={styles.statLabel}>Satisfaction</Text>
            </View>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  bannerContainer: {
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#32CCBC',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  bannerGradient: {
    padding: 24,
    minHeight: 280,
  },
  bannerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flex: 1,
  },
  bannerTextContainer: {
    flex: 1,
    paddingRight: 16,
  },
  bannerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  bannerSubtitle: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 12,
    opacity: 0.9,
    fontWeight: '500',
  },
  bannerDescription: {
    fontSize: 14,
    color: '#fff',
    lineHeight: 20,
    marginBottom: 20,
    opacity: 0.8,
  },
  bannerFeatures: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 8,
  },
  featureText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 6,
  },
  bannerIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  bannerIcon: {
    opacity: 0.8,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  bannerBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#FF6B6B',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  bannerBottom: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
  },
  bannerStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  statLabel: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.8,
    marginTop: 4,
    textAlign: 'center',
  },
});
