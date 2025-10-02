import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function WebsiteFooter() {
  const handleNavigation = (route: string) => {
    router.push(route);
  };

  return (
    <View style={styles.footerContainer}>
      <LinearGradient
        colors={["#32CCBC", "#90F7EC"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.footerGradient}
      >
        {/* Main Footer Content */}
        <View style={styles.footerContent}>
          {/* Company Info Section */}
          <View style={styles.footerSection}>
            <View style={styles.logoContainer}>
              <MaterialIcons name="shopping-bag" size={32} color="#fff" />
              <Text style={styles.logoText}>EcbMart</Text>
            </View>
            <Text style={styles.companyDescription}>
              Your trusted online shopping destination. We provide quality products with fast delivery and excellent customer service.
            </Text>
            <View style={styles.socialLinks}>
              <TouchableOpacity style={styles.socialButton}>
                <MaterialIcons name="facebook" size={24} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialButton}>
                <MaterialIcons name="twitter" size={24} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialButton}>
                <MaterialIcons name="instagram" size={24} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialButton}>
                <MaterialIcons name="linkedin" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Quick Links Section */}
          <View style={styles.footerSection}>
            <Text style={styles.sectionTitle}>Quick Links</Text>
            <TouchableOpacity style={styles.footerLink} onPress={() => handleNavigation('/home')}>
              <MaterialIcons name="home" size={16} color="#fff" />
              <Text style={styles.linkText}>Home</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.footerLink} onPress={() => handleNavigation('/product')}>
              <MaterialIcons name="inventory" size={16} color="#fff" />
              <Text style={styles.linkText}>Products</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.footerLink} onPress={() => handleNavigation('/cart')}>
              <MaterialIcons name="shopping-cart" size={16} color="#fff" />
              <Text style={styles.linkText}>Cart</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.footerLink} onPress={() => handleNavigation('/order-history')}>
              <MaterialIcons name="history" size={16} color="#fff" />
              <Text style={styles.linkText}>Order History</Text>
            </TouchableOpacity>
          </View>

          {/* Customer Service Section */}
          <View style={styles.footerSection}>
            <Text style={styles.sectionTitle}>Customer Service</Text>
            <View style={styles.serviceItem}>
              <MaterialIcons name="local-shipping" size={16} color="#fff" />
              <Text style={styles.serviceText}>Free Delivery</Text>
            </View>
            <View style={styles.serviceItem}>
              <MaterialIcons name="security" size={16} color="#fff" />
              <Text style={styles.serviceText}>Secure Payment</Text>
            </View>
            <View style={styles.serviceItem}>
              <MaterialIcons name="support-agent" size={16} color="#fff" />
              <Text style={styles.serviceText}>24/7 Support</Text>
            </View>
            <View style={styles.serviceItem}>
              <MaterialIcons name="refresh" size={16} color="#fff" />
              <Text style={styles.serviceText}>Easy Returns</Text>
            </View>
          </View>

          {/* Contact Info Section */}
          <View style={styles.footerSection}>
            <Text style={styles.sectionTitle}>Contact Us</Text>
            <View style={styles.contactItem}>
              <MaterialIcons name="email" size={16} color="#fff" />
              <Text style={styles.contactText}>support@ecbmart.com</Text>
            </View>
            <View style={styles.contactItem}>
              <MaterialIcons name="phone" size={16} color="#fff" />
              <Text style={styles.contactText}>+1 (555) 123-4567</Text>
            </View>
            <View style={styles.contactItem}>
              <MaterialIcons name="location-on" size={16} color="#fff" />
              <Text style={styles.contactText}>123 Shopping St, City, State</Text>
            </View>
            <View style={styles.contactItem}>
              <MaterialIcons name="access-time" size={16} color="#fff" />
              <Text style={styles.contactText}>Mon-Fri: 9AM-6PM</Text>
            </View>
          </View>
        </View>

        {/* Newsletter Subscription */}
        <View style={styles.newsletterSection}>
          <Text style={styles.newsletterTitle}>Stay Updated</Text>
          <Text style={styles.newsletterSubtitle}>Subscribe to our newsletter for latest offers and updates</Text>
          <View style={styles.newsletterForm}>
            <View style={styles.emailInput}>
              <MaterialIcons name="email" size={20} color="#32CCBC" />
              <Text style={styles.emailPlaceholder}>Enter your email</Text>
            </View>
            <TouchableOpacity style={styles.subscribeButton}>
              <Text style={styles.subscribeText}>Subscribe</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Bottom Bar */}
        <View style={styles.bottomBar}>
          <Text style={styles.copyrightText}>
            © 2024 EcbMart. All rights reserved.
          </Text>
          <View style={styles.bottomLinks}>
            <TouchableOpacity>
              <Text style={styles.bottomLinkText}>Privacy Policy</Text>
            </TouchableOpacity>
            <Text style={styles.separator}>|</Text>
            <TouchableOpacity>
              <Text style={styles.bottomLinkText}>Terms of Service</Text>
            </TouchableOpacity>
            <Text style={styles.separator}>|</Text>
            <TouchableOpacity>
              <Text style={styles.bottomLinkText}>Cookie Policy</Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  footerContainer: {
    marginTop: 32,
    shadowColor: '#32CCBC',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  footerGradient: {
    paddingTop: 32,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  footerContent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  footerSection: {
    flex: 1,
    minWidth: 200,
    marginBottom: 24,
    paddingHorizontal: 8,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  companyDescription: {
    fontSize: 14,
    color: '#fff',
    lineHeight: 20,
    opacity: 0.9,
    marginBottom: 16,
  },
  socialLinks: {
    flexDirection: 'row',
    gap: 12,
  },
  socialButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  footerLink: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    paddingVertical: 4,
  },
  linkText: {
    fontSize: 14,
    color: '#fff',
    marginLeft: 8,
    opacity: 0.9,
  },
  serviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  serviceText: {
    fontSize: 14,
    color: '#fff',
    marginLeft: 8,
    opacity: 0.9,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  contactText: {
    fontSize: 14,
    color: '#fff',
    marginLeft: 8,
    opacity: 0.9,
  },
  newsletterSection: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  newsletterTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
  },
  newsletterSubtitle: {
    fontSize: 14,
    color: '#fff',
    textAlign: 'center',
    opacity: 0.9,
    marginBottom: 16,
  },
  newsletterForm: {
    flexDirection: 'row',
    gap: 12,
  },
  emailInput: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  emailPlaceholder: {
    fontSize: 14,
    color: '#999',
    marginLeft: 8,
  },
  subscribeButton: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  subscribeText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#32CCBC',
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
  },
  copyrightText: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.8,
  },
  bottomLinks: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  bottomLinkText: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.8,
  },
  separator: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.6,
  },
});
