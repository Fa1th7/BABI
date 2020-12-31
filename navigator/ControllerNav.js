import React, { useContext, useEffect } from "react";
import { Text } from "react-native";
import { Context as AuthContext } from "../contexts/AuthContext";
import AuthNav from "./AuthNav";
import UserNav from "./UserNav";
import CustomerNav from "./CustomerNav";
import { createStackNavigator } from "@react-navigation/stack";
import { DotIndicator } from "react-native-indicators";
import colors from "../utils/colors";

const Stack = createStackNavigator();

const ControllerNav = () => {
  const { state: authState, cuurentAuthState, getUser } = useContext(
    AuthContext
  );
  useEffect(() => {
    cuurentAuthState();
  }, []);

  useEffect(() => {
    if (authState.authUser) {
      getUser({ uuid: authState.authUser.uid });
    }
  }, [authState.authUser]);

  if (authState.loading) {
    return <DotIndicator color={colors.primary} />;
  } else {
    return (
      <>
        <Stack.Navigator
          screenOptions={{ gestureEnabled: false }}
          headerMode="none"
        >
          {authState.authUser !== null && (
            //<Stack.Screen name="userFlow" component={UserNav} />
            <Stack.Screen name="cusFlow" component={CustomerNav} />
          )}
          {authState.authUser == null && (
            <Stack.Screen name="authFlow" component={AuthNav} />
          )}
        </Stack.Navigator>
      </>
    );
  }
};

export default ControllerNav;
