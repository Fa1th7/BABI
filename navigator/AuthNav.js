import { createStackNavigator } from "@react-navigation/stack";
import React, { useContext, useEffect } from "react";
import { Text } from "react-native";
import AuthScreen from "../screens/AuthFlow/AuthScreen";
import { Context as AuthContext } from "../contexts/AuthContext";
import { Context as ProfileContext } from "../contexts/ProfileContext";
import { DotIndicator } from "react-native-indicators";
import colors from "../utils/colors";

const Stack = createStackNavigator();
const Login = () => <Text>Login</Text>;
const SignUp = () => <Text>SignUp</Text>;

export default function AuthNav() {
  const { state: authState } = useContext(AuthContext);
  
  return (
    <>
      {!authState.loading && (
        <Stack.Navigator
          screenOptions={{
            gestureEnabled: false,
          }}
          headerMode="none"
        >
          <Stack.Screen
            name="Auth Screen"
            component={AuthScreen}
            options={{
              headerShown: false,
            }}
          />

          <Stack.Screen
            name="Login Screen"
            component={Login}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="SignUp Screen"
            component={SignUp}
            options={{
              headerShown: false,
            }}
          />
        </Stack.Navigator>
      )}
      {authState.loading && <DotIndicator color={colors.primary} />}
    </>
  );
}
