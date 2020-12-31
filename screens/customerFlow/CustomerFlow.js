import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import colors from "../../utils/colors";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Fontisto from "react-native-vector-icons/Fontisto";
import Profile from "../Profile";
import Home from './Home';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

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
          name="Home"
          component={Home}
        />
      </Tab.Navigator>
    );
  }