import React from "react";
import { View, StyleSheet, Image } from "react-native";
import { Text, ThemeProvider } from "react-native-elements";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  responsiveHeight as rh,
  responsiveWidth as rw,
  responsiveFontSize as rf,
} from "react-native-responsive-dimensions";
import colors from "../utils/colors";
import { TouchableOpacity } from "react-native-gesture-handler";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Foundation from "react-native-vector-icons/Foundation";
import theme from "../utils/Theme";
import FastImage from 'react-native-fast-image';
import ViewShot from "react-native-view-shot";

const ShopCard = ({ shopDp, contactNumber, name, owner, address, desc, onPressShopCard, onLongPressCard, snapRef }) => {
  return (
    <ViewShot style = {{backgroundColor:'#f9faf5',}} ref= {snapRef} options={{ format: "jpg", quality: 0.9 }}>
    <TouchableOpacity style={styles.container} activeOpacity = {0.8} onLongPress = {onLongPressCard} onPress = {onPressShopCard} >
      <ThemeProvider theme={theme}>
        <View>
          <FastImage
            source={{
              uri: shopDp,
            }}
            style={styles.dp}
          />
        </View>
        <Text style={styles.name}>{name}</Text>
        <View>
          <View
            style={{
              flexDirection: "row",
              alignSelf: "center",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <MaterialIcons
              name="phone"
              size={rf(4)}
              color={colors.primary}
              style={{ marginRight: rw(2) }}
            />
            <Text style={{ fontFamily: "Helvetica" }}>
              {contactNumber}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <MaterialIcons
              name="business"
              size={rf(4)}
              color={colors.primary}
              style={{ marginRight: rw(2) }}
            />
            <Text>{address}</Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignSelf: "center",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Foundation
              name="torso-business"
              size={rf(4)}
              color={colors.primary}
              style={{ marginRight: rw(2) }}
            />
            <Text>{owner}</Text>
          </View>
          
        </View>
        <Text>{desc}</Text>
      </ThemeProvider>
    </TouchableOpacity>
    </ViewShot>
  );
};

const styles = StyleSheet.create({
  container: {
    width: rw(90),
    alignSelf: "center",
    marginTop: rh(2),
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: rw(3),
    marginBottom: rh(2),
    elevation: 4,
    paddingBottom: rh(2)
  },
  dp: {
    height: rh(30),
    width: rw(90),
    borderTopLeftRadius: rw(3),
    borderTopRightRadius: rw(3),
  },
  name: {
    alignSelf: "center",
    marginVertical: rh(1),
    fontFamily: "Helvetica",
    color: colors.primary,
    fontSize: rf(4),
  },
});
export default ShopCard;
