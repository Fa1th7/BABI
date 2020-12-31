import React, { useContext, useEffect, useState } from "react";
import { View, StyleSheet , Image} from "react-native";
import colors from "../../utils/colors";
import {
  Button,
  ThemeProvider,
  Input,
  Text,
  SocialIcon,
} from "react-native-elements";
import {
  responsiveHeight as rh,
  responsiveWidth as rw,
  responsiveFontSize as rf,
} from "react-native-responsive-dimensions";
import theme from "../../utils/Theme";
import { Context as AuthContext } from "../../contexts/AuthContext";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { DotIndicator } from "react-native-indicators";
import { SafeAreaView } from "react-native-safe-area-context";
import auth from "@react-native-firebase/auth";
import { GoogleSignin } from "react-native-google-signin";
import firestore from "@react-native-firebase/firestore";
import { ScrollView } from "react-native-gesture-handler";
const AppLogo =  require('../../assets/images/AppLogo.png')

const AuthScreen = () => {
  const {
    state: authState,
    getOtp,
    verifyOtp,
    signInWithEmail,
    signUpWithEmail,
    onGoogleButtonPress,
    onFacebookButtonPress
  } = useContext(AuthContext);
  const [loginState, setLoginState] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPass] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    console.log(authState.user);
  }, [authState.user, authState.token]);

  const EyeColorPass = () => {
    if (showPassword) {
      return colors.green;
    } else {
      return colors.grey;
    }
  };
  const EyeColorConfirmPass = () => {
    if (showConfirmPassword) {
      return colors.green;
    } else {
      return colors.grey;
    }
  };
  const EmailValidation = () => {
    if (
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
        email
      )
    ) {
      return true;
    }
  };
  const PasswordMatch = () => {
    if (password === confirmPassword) {
      return true;
    }
  };
  const PasswordStrength = () => {
    if (password.length >= 6) {
      return true;
    }
  };
  const onSignUp = () => {
    if (!EmailValidation()) {
      setErrorMessage("Please type valid email address");
    } else if (!PasswordMatch()) {
      setErrorMessage("Password mismatch");
    } else if (!PasswordStrength()) {
      setErrorMessage("Password should be more than 5 character");
    } else if (!PasswordStrength && !PasswordMatch() && !EmailValidation()) {
      setErrorMessage("Invalid email & password mismatch");
    } else {
      setErrorMessage("")
      signUpWithEmail({email: email, password: password})
      console.log("ok");
    }
  };

  const onSignIn = () => {
    if (!EmailValidation()) {
      setErrorMessage("Please type valid email address");
    }
    else {
      setErrorMessage("");
      signInWithEmail({email: email, password: password})
      console.log("ok")
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <SafeAreaView style={styles.container}>
        <ScrollView>
         <Image 
          resizeMethod = "resize"
          resizeMode = 'contain'
          style = {{height:rh(8), width: rw(100), marginVertical: rh(10)}}
         source = {AppLogo}
         />

          {loginState && (
            <>
              <Input
                style={{ flexDirection: "row" }}
                keyboardType = 'email-address'
                importantForAutofill = 'auto'
                autoCapitalize = 'none'
                autoCompleteType = 'email'
                label="Email"
                value={email}
                onChangeText={(text) => setEmail(text)}
              />
              <Input
                rightIcon={
                  <MaterialCommunityIcons
                    style={{
                      alignSelf: "flex-end",
                      justifyContent: "flex-end",
                    }}
                    name="eye-outline"
                    color={EyeColorPass()}
                    size={rf(3)}
                    onPress={() => {
                      if (showPassword) {
                        setShowPassword(false);
                      } else {
                        setShowPassword(true);
                      }
                    }}
                  />
                }
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                style={{ flexDirection: "row" }}
                label="Password"
                value={password}
                onChangeText={(text) => setPassword(text)}
              />
            </>
          )}
          {!loginState && (
            <>
              <Input
                style={{ flexDirection: "row" }}
                label="Email"
                value={email}
                onChangeText={(text) => setEmail(text)}
              />
              <Input
                rightIcon={
                  <MaterialCommunityIcons
                    style={{
                      alignSelf: "flex-end",
                      justifyContent: "flex-end",
                    }}
                    name="eye-outline"
                    color={EyeColorPass()}
                    size={rf(3)}
                    onPress={() => {
                      if (showPassword) {
                        setShowPassword(false);
                      } else {
                        setShowPassword(true);
                      }
                    }}
                  />
                }
                secureTextEntry={!showPassword}
                style={{ flexDirection: "row" }}
                label="Password"
                value={password}
                onChangeText={(text) => setPassword(text)}
              />
              <Input
                rightIcon={
                  <MaterialCommunityIcons
                    style={{
                      alignSelf: "flex-end",
                      justifyContent: "flex-end",
                    }}
                    name="eye-outline"
                    color={EyeColorConfirmPass()}
                    size={rf(3)}
                    onPress={() => {
                      if (showConfirmPassword) {
                        setShowConfirmPassword(false);
                      } else {
                        setShowConfirmPassword(true);
                      }
                    }}
                  />
                }
                secureTextEntry={!showConfirmPassword}
                style={{ flexDirection: "row" }}
                label="Confirm Password"
                value={confirmPassword}
                onChangeText={(text) => setConfirmPass(text)}
              />
            </>
          )}
          {errorMessage !== "" && (
            <Text
              style={{ alignSelf: "center", fontSize: rf(1.7), color: "red" }}
            >
              {errorMessage}
            </Text>
          )}
          {loginState && (
            <>
              <Button
              onPress = {onSignIn}
              title="Sign in" />
              <Button
                type="clear"
                buttonStyle={{
                  backgroundColor: colors.white,
                  width: rw(70),
                  padding: 0,
                }}
                onPress={() => setLoginState(false)}
                title="Sign up instead"
              />
            </>
          )}
          {!loginState && (
            <>
              <Button onPress={onSignUp} title="Sign up" />
              <Button
                type="clear"
                buttonStyle={{
                  backgroundColor: colors.white,
                  width: rw(70),
                  padding: 0,
                }}
                onPress={() => setLoginState(true)}
                title="Sign in instead"
              />
            </>
          )}
          <View style={{  flexDirection: "row", width:rw(100), alignItems:'center', justifyContent: "space-around" }}>
            <SocialIcon
              onPress={onGoogleButtonPress}
              raised={true}
              type="google"
            />
            <SocialIcon
              onPress={onFacebookButtonPress}
              raised={true}
              type="facebook"
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </ThemeProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  welcomeText: {
    fontFamily: "Helvetica",
    fontSize: rf(8),
    alignSelf: "center",
    marginVertical: rh(10),
    color: colors.primary,
  },
  loginButton: {
    backgroundColor: colors.primary,
  },
});
export default AuthScreen;
