import React from "react";
import { SafeAreaView } from "react-native";
import { View, StyleSheet } from "react-native";
import { Text, ThemeProvider } from "react-native-elements";
import { TouchableOpacity } from "react-native-gesture-handler";
import {
  responsiveHeight as rh,
  responsiveWidth as rw,
  responsiveFontSize as rf,
} from "react-native-responsive-dimensions";
import colors from "../utils/colors";
import theme from "../utils/Theme";
import FastImage from 'react-native-fast-image';
import * as Animatable from "react-native-animatable";

const ProductCard = ({
  picUrl,
  productPrice,
  productName,
  productCatagory,
  onPressCard,
  onLongPressCard,
  inStock,
  discount,
  productQuantitiy
}) => {
  return (
    <Animatable.View useNativeDriver={true} animation="bounceIn">
    <TouchableOpacity
      onPress={onPressCard}
      onLongPress={onLongPressCard}
      activeOpacity={0.8}
    >
      <SafeAreaView style={styles.container}>
        <ThemeProvider theme={theme}>
          {discount !== '' && (
            <View style={styles.offertag}>
              <Text style={styles.offerText}>{`${Math.round(
                ((parseInt(productPrice) - parseInt(discount)) /
                  parseInt(productPrice)) *
                  100
              )}% off`}</Text>
            </View>
          )}

          <FastImage
            source={{ uri: picUrl, priority: "high" }}
            style={styles.images}
            resizeMethod="auto"
          />
          <View style={styles.detailsContainer}>
            <Text style={styles.name}>{productName}</Text>
            <Text style={styles.cat}>{productCatagory}</Text>
            {discount !== '' && (
              <View style={{ flexDirection: "row" }}>
                <Text
                  style={{
                    ...styles.price,
                    ...{
                      color: colors.grey,
                      textDecorationLine: "line-through",
                      textDecorationStyle: "solid",
                    },
                  }}
                >{`₹ ${productPrice}`}</Text>
                <Text  style={{...styles.price,...{marginLeft: rw(2.5)}}}>{`₹ ${discount}`}</Text>
              </View>
            )}
            {discount === '' && (
              <View style={{ flexDirection: "row" }}>
              <Text style={styles.price}>{`₹ ${productPrice}`}</Text>
              </View>
            )}
           <Text style={{...styles.price, color: colors.grey}}>{`${productQuantitiy}`}</Text>
          </View>
        </ThemeProvider>
      </SafeAreaView>
    </TouchableOpacity>
    </Animatable.View>
  );
};

const styles = StyleSheet.create({
  images: {
    height: rh(15),
    width: rw(30),
    borderRadius: rf(0.5),
  },
  container: {
    marginVertical: rh(1),
    height: rh(18),
    width: rw(94),
    backgroundColor: colors.white,
    elevation: 4,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    borderRadius: rf(1),
    padding: rw(3),
  },
  detailsContainer: {
    marginHorizontal: rw(3),
    height: rh(15),
    justifyContent: "space-between",
  },
  name: {
    fontFamily: "Helvetica",
    color: colors.primary,
    fontSize: rf(2.6),
  },
  cat: {
    fontFamily: "Helvetica",
    color: colors.accent,
    fontSize: rf(2.5),
  },
  price: {
    fontFamily: "Helvetica",
    color: colors.green,
    fontSize: rf(2.5),
  },
  offertag: {
    height: rh(4),
    width: rw(20),
    backgroundColor: colors.green,
    position: "absolute",
    bottom: 0,
    right: 0,
    borderBottomRightRadius: rf(1),
    alignItems:'center',
    justifyContent:'center'
  },
  offerText: {
    fontSize: rf(2),
    alignSelf: "center",
    color: colors.white
  },
});
export default ProductCard;
