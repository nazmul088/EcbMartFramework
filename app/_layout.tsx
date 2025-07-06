import { Slot, useRouter } from "expo-router";
import React, { useState } from "react";

export default function RootLayout() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const checkAuth = async () => {
    // const token = await SecureStore.getItemAsync("authToken");
    // console.log("Token:", token);
  };
  checkAuth();

  // useEffect(() => {
  //   const checkAuth = async () => {
  //   const token = await SecureStore.getItemAsync('authToken');
  //     if (token) {
  //       router.replace('/home');
  //     }
  //     setLoading(false);
  //   };
  //   checkAuth();
  // }, []);

  // if (loading) {
  //   return (
  //     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
  //       <ActivityIndicator />
  //     </View>
  //   );
  // }

  return <Slot />;
}
