import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { DeliveryAddress, profileApi, UserProfile } from '../services/apiService';
import { useAuth } from './AuthContext';


export default function ProfileScreen() {
  const { isAuthenticated, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    dateOfBirth: '1990-01-15',
    gender: 'Male',
    deliveryAddresses: [
      {
        id: '1',
        street: '123 Main Street',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'United States',
        isDefault: true,
        label: 'Home'
      },
      {
        id: '2',
        street: '456 Business Ave',
        city: 'New York',
        state: 'NY',
        zipCode: '10002',
        country: 'United States',
        isDefault: false,
        label: 'Work'
      }
    ]
  });

  const [showAddAddress, setShowAddAddress] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [newAddress, setNewAddress] = useState<Omit<DeliveryAddress, 'id'>>({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    isDefault: false,
    label: ''
  });

  // Load profile data on component mount
  useEffect(() => {
    if (isAuthenticated) {
      loadProfile();
    }
  }, [isAuthenticated]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const response = await profileApi.get();
      setProfile(response.data);
    } catch (error) {
      console.error('Error loading profile:', error);
      // Keep the default profile data if API fails
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      await profileApi.update(profile);
      Alert.alert('Success', 'Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving profile:', error);
      Alert.alert('Error', 'Failed to save profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', onPress: logout }
      ]
    );
  };

  const handleAddAddress = async () => {
    if (!newAddress.street || !newAddress.city || !newAddress.state || !newAddress.zipCode || !newAddress.country) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      const response = await profileApi.addAddress(newAddress);
      const addedAddress = response.data;

      // Update local state
      if (newAddress.isDefault) {
        // Remove default from other addresses
        const updatedAddresses = profile.deliveryAddresses.map(addr => ({ ...addr, isDefault: false }));
        setProfile({
          ...profile,
          deliveryAddresses: [...updatedAddresses, addedAddress]
        });
      } else {
        setProfile({
          ...profile,
          deliveryAddresses: [...profile.deliveryAddresses, addedAddress]
        });
      }

      setNewAddress({
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
        isDefault: false,
        label: ''
      });
      setShowAddAddress(false);
      Alert.alert('Success', 'Address added successfully!');
    } catch (error) {
      console.error('Error adding address:', error);
      Alert.alert('Error', 'Failed to add address. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAddress = (addressId: string) => {
    Alert.alert(
      'Delete Address',
      'Are you sure you want to delete this address?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              await profileApi.deleteAddress(addressId);
              
              const updatedAddresses = profile.deliveryAddresses.filter(addr => addr.id !== addressId);
              // If we deleted the default address, make the first remaining address default
              if (updatedAddresses.length > 0 && !updatedAddresses.some(addr => addr.isDefault)) {
                updatedAddresses[0].isDefault = true;
              }
              setProfile({
                ...profile,
                deliveryAddresses: updatedAddresses
              });
              
              Alert.alert('Success', 'Address deleted successfully!');
            } catch (error) {
              console.error('Error deleting address:', error);
              Alert.alert('Error', 'Failed to delete address. Please try again.');
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  const handleSetDefaultAddress = async (addressId: string) => {
    try {
      setLoading(true);
      await profileApi.setDefaultAddress(addressId);
      
      const updatedAddresses = profile.deliveryAddresses.map(addr => ({
        ...addr,
        isDefault: addr.id === addressId
      }));
      setProfile({
        ...profile,
        deliveryAddresses: updatedAddresses
      });
      Alert.alert('Success', 'Default address updated!');
    } catch (error) {
      console.error('Error setting default address:', error);
      Alert.alert('Error', 'Failed to set default address. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditAddress = (address: DeliveryAddress) => {
    setNewAddress({
      street: address.street,
      city: address.city,
      state: address.state,
      zipCode: address.zipCode,
      country: address.country,
      isDefault: address.isDefault,
      label: address.label || ''
    });
    setEditingAddressId(address.id);
    setShowAddAddress(true);
  };

  const handleUpdateAddress = async () => {
    if (!newAddress.street || !newAddress.city || !newAddress.state || !newAddress.zipCode || !newAddress.country) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      const response = await profileApi.updateAddress(editingAddressId!, newAddress);
      const updatedAddress = response.data;

      const updatedAddresses = profile.deliveryAddresses.map(addr => {
        if (addr.id === editingAddressId) {
          return updatedAddress;
        }
        // If this address is being set as default, remove default from others
        if (newAddress.isDefault && addr.id !== editingAddressId) {
          return { ...addr, isDefault: false };
        }
        return addr;
      });

      setProfile({
        ...profile,
        deliveryAddresses: updatedAddresses
      });

      setNewAddress({
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
        isDefault: false,
        label: ''
      });
      setEditingAddressId(null);
      setShowAddAddress(false);
      Alert.alert('Success', 'Address updated successfully!');
    } catch (error) {
      console.error('Error updating address:', error);
      Alert.alert('Error', 'Failed to update address. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const cancelAddressForm = () => {
    setNewAddress({
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
      isDefault: false,
      label: ''
    });
    setEditingAddressId(null);
    setShowAddAddress(false);
  };

  if (!isAuthenticated) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={["#90F7EC", "#32CCBC"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <MaterialIcons
            name="arrow-back"
            size={28}
            color="#222"
            style={styles.backIcon}
            onPress={() => router.push('/home')}
          />
          <Text style={styles.headerTitle}>Profile</Text>
        </LinearGradient>
        <View style={styles.notAuthenticatedContainer}>
          <MaterialIcons name="person-off" size={80} color="#ccc" />
          <Text style={styles.notAuthenticatedTitle}>Not Signed In</Text>
          <Text style={styles.notAuthenticatedText}>
            Please sign in to view and edit your profile.
          </Text>
          <TouchableOpacity style={styles.signInButton} onPress={() => router.push('/sign-in')}>
            <Text style={styles.signInButtonText}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#90F7EC", "#32CCBC"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <MaterialIcons
          name="arrow-back"
          size={28}
          color="#222"
          style={styles.backIcon}
          onPress={() => router.push('/home')}
        />
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity onPress={() => setIsEditing(!isEditing)}>
          <MaterialIcons
            name={isEditing ? "close" : "edit"}
            size={24}
            color="#222"
          />
        </TouchableOpacity>
      </LinearGradient>

      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent}>
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#32CCBC" />
            <Text style={styles.loadingText}>Loading...</Text>
          </View>
        )}
        
        {/* Profile Picture Section */}
        <View style={styles.profilePictureSection}>
          <View style={styles.profilePictureContainer}>
            <MaterialIcons name="person" size={60} color="#32CCBC" />
          </View>
          <TouchableOpacity style={styles.changePhotoButton}>
            <MaterialIcons name="camera-alt" size={20} color="#32CCBC" />
            <Text style={styles.changePhotoText}>Change Photo</Text>
          </TouchableOpacity>
        </View>

        {/* Personal Information Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          
          <View style={styles.inputRow}>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>First Name</Text>
              <TextInput
                style={[styles.input, !isEditing && styles.inputDisabled]}
                value={profile.firstName}
                onChangeText={(text) => setProfile({...profile, firstName: text})}
                editable={isEditing}
                placeholder="Enter first name"
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Last Name</Text>
              <TextInput
                style={[styles.input, !isEditing && styles.inputDisabled]}
                value={profile.lastName}
                onChangeText={(text) => setProfile({...profile, lastName: text})}
                editable={isEditing}
                placeholder="Enter last name"
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
              style={[styles.input, !isEditing && styles.inputDisabled]}
              value={profile.email}
              onChangeText={(text) => setProfile({...profile, email: text})}
              editable={isEditing}
              placeholder="Enter email"
              keyboardType="email-address"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Phone Number</Text>
            <TextInput
              style={[styles.input, !isEditing && styles.inputDisabled]}
              value={profile.phone}
              onChangeText={(text) => setProfile({...profile, phone: text})}
              editable={isEditing}
              placeholder="Enter phone number"
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.inputRow}>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Date of Birth</Text>
              <TextInput
                style={[styles.input, !isEditing && styles.inputDisabled]}
                value={profile.dateOfBirth}
                onChangeText={(text) => setProfile({...profile, dateOfBirth: text})}
                editable={isEditing}
                placeholder="YYYY-MM-DD"
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Gender</Text>
              <TextInput
                style={[styles.input, !isEditing && styles.inputDisabled]}
                value={profile.gender}
                onChangeText={(text) => setProfile({...profile, gender: text})}
                editable={isEditing}
                placeholder="Enter gender"
              />
            </View>
          </View>
        </View>

        {/* Delivery Addresses Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Delivery Addresses</Text>
            <TouchableOpacity 
              style={styles.addButton}
              onPress={() => setShowAddAddress(true)}
            >
              <MaterialIcons name="add" size={20} color="#32CCBC" />
              <Text style={styles.addButtonText}>Add Address</Text>
            </TouchableOpacity>
          </View>

          {/* Address List */}
          {profile.deliveryAddresses.map((address, index) => (
            <View key={address.id} style={styles.addressCard}>
              <View style={styles.addressHeader}>
                <View style={styles.addressTitleRow}>
                  <Text style={styles.addressLabel}>
                    {address.label || `Address ${index + 1}`}
                  </Text>
                  {address.isDefault && (
                    <View style={styles.defaultBadge}>
                      <Text style={styles.defaultBadgeText}>Default</Text>
                    </View>
                  )}
                </View>
                <View style={styles.addressActions}>
                  <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={() => handleEditAddress(address)}
                  >
                    <MaterialIcons name="edit" size={16} color="#32CCBC" />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={() => handleDeleteAddress(address.id)}
                  >
                    <MaterialIcons name="delete" size={16} color="#FF5252" />
                  </TouchableOpacity>
                </View>
              </View>
              
              <Text style={styles.addressText}>{address.street}</Text>
              <Text style={styles.addressText}>
                {address.city}, {address.state} {address.zipCode}
              </Text>
              <Text style={styles.addressText}>{address.country}</Text>
              
              {!address.isDefault && (
                <TouchableOpacity 
                  style={styles.setDefaultButton}
                  onPress={() => handleSetDefaultAddress(address.id)}
                >
                  <Text style={styles.setDefaultButtonText}>Set as Default</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}

          {/* Add/Edit Address Form */}
          {showAddAddress && (
            <View style={styles.addressForm}>
              <Text style={styles.formTitle}>
                {editingAddressId ? 'Edit Address' : 'Add New Address'}
              </Text>
              
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Label (Optional)</Text>
                <TextInput
                  style={styles.input}
                  value={newAddress.label}
                  onChangeText={(text) => setNewAddress({...newAddress, label: text})}
                  placeholder="e.g., Home, Work, Office"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Street Address *</Text>
                <TextInput
                  style={styles.input}
                  value={newAddress.street}
                  onChangeText={(text) => setNewAddress({...newAddress, street: text})}
                  placeholder="Enter street address"
                />
              </View>

              <View style={styles.inputRow}>
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>City *</Text>
                  <TextInput
                    style={styles.input}
                    value={newAddress.city}
                    onChangeText={(text) => setNewAddress({...newAddress, city: text})}
                    placeholder="Enter city"
                  />
                </View>
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>State *</Text>
                  <TextInput
                    style={styles.input}
                    value={newAddress.state}
                    onChangeText={(text) => setNewAddress({...newAddress, state: text})}
                    placeholder="Enter state"
                  />
                </View>
              </View>

              <View style={styles.inputRow}>
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>ZIP Code *</Text>
                  <TextInput
                    style={styles.input}
                    value={newAddress.zipCode}
                    onChangeText={(text) => setNewAddress({...newAddress, zipCode: text})}
                    placeholder="Enter ZIP code"
                    keyboardType="numeric"
                  />
                </View>
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Country *</Text>
                  <TextInput
                    style={styles.input}
                    value={newAddress.country}
                    onChangeText={(text) => setNewAddress({...newAddress, country: text})}
                    placeholder="Enter country"
                  />
                </View>
              </View>

              <View style={styles.checkboxContainer}>
                <TouchableOpacity 
                  style={styles.checkbox}
                  onPress={() => setNewAddress({...newAddress, isDefault: !newAddress.isDefault})}
                >
                  <MaterialIcons 
                    name={newAddress.isDefault ? "check-box" : "check-box-outline-blank"} 
                    size={24} 
                    color="#32CCBC" 
                  />
                  <Text style={styles.checkboxText}>Set as default address</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.formButtons}>
                <TouchableOpacity style={styles.cancelFormButton} onPress={cancelAddressForm}>
                  <Text style={styles.cancelFormButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.saveFormButton} 
                  onPress={editingAddressId ? handleUpdateAddress : handleAddAddress}
                >
                  <Text style={styles.saveFormButtonText}>
                    {editingAddressId ? 'Update Address' : 'Add Address'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        {/* Action Buttons */}
        {isEditing && (
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Save Changes</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <MaterialIcons name="logout" size={20} color="#FF5252" />
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f6f7',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  backIcon: {
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222',
    flex: 1,
    textAlign: 'center',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  notAuthenticatedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  notAuthenticatedTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  notAuthenticatedText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  signInButton: {
    backgroundColor: '#32CCBC',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
  },
  signInButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  profilePictureSection: {
    alignItems: 'center',
    paddingVertical: 24,
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    shadowColor: '#32CCBC',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  profilePictureContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 3,
    borderColor: '#32CCBC',
  },
  changePhotoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#32CCBC',
  },
  changePhotoText: {
    color: '#32CCBC',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 6,
  },
  section: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 16,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#32CCBC',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#32CCBC',
    marginBottom: 16,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 12,
  },
  inputContainer: {
    flex: 1,
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  inputDisabled: {
    backgroundColor: '#f5f5f5',
    color: '#666',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginHorizontal: 16,
    marginTop: 24,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '500',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#32CCBC',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#32CCBC',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 24,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FF5252',
  },
  logoutButtonText: {
    color: '#FF5252',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#32CCBC',
  },
  addButtonText: {
    color: '#32CCBC',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  addressCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  addressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  addressTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  addressLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 8,
  },
  defaultBadge: {
    backgroundColor: '#32CCBC',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  defaultBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  addressActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 4,
  },
  addressText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  setDefaultButton: {
    alignSelf: 'flex-start',
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#32CCBC',
  },
  setDefaultButtonText: {
    color: '#32CCBC',
    fontSize: 12,
    fontWeight: '500',
  },
  addressForm: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#32CCBC',
  },
  formTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#32CCBC',
    marginBottom: 16,
  },
  checkboxContainer: {
    marginTop: 8,
    marginBottom: 16,
  },
  checkbox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 8,
  },
  formButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelFormButton: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  cancelFormButtonText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '500',
  },
  saveFormButton: {
    flex: 1,
    backgroundColor: '#32CCBC',
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  saveFormButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#32CCBC',
    fontWeight: '500',
  },
});