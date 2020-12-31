import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Profile from "../Profile";
import ShopInfo from "../merchantFlow/ShopInfo";
import ProductInfo from "../productFlow/ProductInfo";
import AddProduct from "../productFlow/AddProduct";
import AllShops from "../merchantFlow/AllShops";
import ShopCreate from "./ShopCreate";
import SetLocation from "../merchantFlow/SetLocation";
import colors from "../../utils/colors";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Fontisto from "react-native-vector-icons/Fontisto";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function ShopFlow() {
  return (
    <Stack.Navigator
      screenOptions={{
        gestureEnabled: false,
      }}
      headerMode="none"
    >
      <Stack.Screen
        name="allShop"
        component={AllShops}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="shopInfo"
        component={ShopInfo}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="ShopCreate"
        component={ShopCreate}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="SetLocation"
        component={SetLocation}
        options={{
          headerShown: false,
        }}
      />
       <Stack.Screen
        name= "productInfo"
        component={ProductInfo}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="AddProduct"
        component={AddProduct}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}

export default function MerchantNav() {
  return (
    <Tab.Navigator
      tabBarOptions={{
        activeTintColor: colors.primary,
        inactiveTintColor: colors.accent,
        labelStyle: {
          marginBottom: 2,
          fontSize: 13,
          fontFamily: "Roboto-Medium",
        },
        style: { height: 60 },
      }}
      backBehavior = 'none'
    >
      <Tab.Screen
        options={{
          tabBarIcon: ({ color, size }) => {
            return <FontAwesome name="user" color={color} size={size} />;
          },
        }}
        name="Profile"
        component={Profile}
      />
      <Tab.Screen
        options={{
          tabBarIcon: ({ color, size }) => {
            return <Fontisto name="shopping-store" color={color} size={size} />;
          },
        }}
        name="Shop Profile"
        component={ShopFlow}
      />
    </Tab.Navigator>
  );
}
