import React, { useState } from "react";
import { Alert, Button, StyleSheet, TextInput, View } from "react-native";
import { verifyOtp } from "../services/authApi";
import { storeToken } from "../services/authService";

const OtpScreen = ({ route, navigation }: any) => {
  const [otp, setOtp] = useState("");
  const { phoneNumber } = route.params;

  const [loading, setLoading] = useState(false);

  const handleVerifyOtp = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const res = await verifyOtp(phoneNumber, otp);
      const token = res.data.token;
      console.log(res);
      await storeToken(token);
      navigation.navigate("Home");
    } catch (err) {
      Alert.alert("Error", "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Enter OTP"
        value={otp}
        onChangeText={setOtp}
        style={styles.input}
        keyboardType="number-pad"
      />
      <Button title="Verify OTP" onPress={handleVerifyOtp} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  input: { borderWidth: 1, padding: 10, marginBottom: 10 },
});

export default OtpScreen;
