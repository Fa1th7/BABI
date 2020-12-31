import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { Text } from "react-native";
import CustomerFlow from "../screens/customerFlow/CustomerFlow";

const Stack = createStackNavigator();
export default function CustomerNav() {
  return (
    <Stack.Navigator
      screenOptions={{
        gestureEnabled: false,
      }}
      headerMode="none"
    >
      <Stack.Screen
        name="MerchFlow"
        component={CustomerFlow}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}
