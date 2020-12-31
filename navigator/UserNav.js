import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { Text } from "react-native";
import MerchantNav from "../screens/merchantFlow/MerchantNav";

const Stack = createStackNavigator();
export default function UserNav() {
  return (
    <Stack.Navigator
      screenOptions={{
        gestureEnabled: false,
      }}
      headerMode="none"
    >
      <Stack.Screen
        name="MerchFlow"
        component={MerchantNav}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}
