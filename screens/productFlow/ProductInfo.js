import React, { useContext, useEffect, useState } from "react";
import { SafeAreaView } from "react-native";
import { View, StyleSheet, Image } from "react-native";
import { Text, ThemeProvider, Divider } from "react-native-elements";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { Context as ProductContext } from "../../contexts/ProductContext";
import {
  responsiveHeight as rh,
  responsiveWidth as rw,
  responsiveFontSize as rf,
} from "react-native-responsive-dimensions";
import colors from "../../utils/colors";
import Theme from "../../utils/Theme";
import { SliderBox } from "react-native-image-slider-box";
import FastImage from 'react-native-fast-image'

const ProductInfo = ({ route }) => {
  const { state: productState } = useContext(ProductContext);
  
  if (productState.currentProduct) {
    return (
      <SafeAreaView style={styles.container}>
        <ThemeProvider theme={Theme}>
          <ScrollView>
            <View style={{ alignSelf: "center", height: rh(40) }}>
              {productState.currentProductPics.length > 0 && (
                <SliderBox
                  ImageComponent={FastImage}
                  images={productState.currentProductPics}
                  dotColor={colors.primary}
                  parentWidth={rh(40)}
                  resizeMethod={"auto"}
                  resizeMode="contain"
                  ImageComponentStyle={styles.images}
                  paginationBoxStyle={{ alignSelf: "center" }}
                />
              )}
            </View>
            <Divider
              style={{ marginTop: rh(2), backgroundColor: colors.accent }}
            />
            <View style={{ marginLeft: rw(2) }}>
              {productState.currentProduct.productDiscount !== "" && (
                <View style={styles.offertag}>
                  <Text style={styles.offerText}>{`${Math.round(
                    ((parseInt(productState.currentProduct.productPrice) -
                      parseInt(productState.currentProduct.productDiscount)) /
                      parseInt(productState.currentProduct.productPrice)) *
                      100
                  )}% off`}</Text>
                </View>
              )}

              <Text style={styles.name}>
                {`${productState.currentProduct.productName}`}
              </Text>
              <Text style={styles.cat}>
                {`Catagory: ${productState.currentProduct.productCatagory}`}
              </Text>
              <Text style={styles.cat}>
                {`Details: ${productState.currentProduct.productDetails}`}
              </Text>
              {productState.currentProduct.productDiscount !== "" && (
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
                  >{`₹ ${productState.currentProduct.productPrice}`}</Text>
                  <Text
                    style={{ ...styles.price, ...{ marginLeft: rw(2.5) } }}
                  >{`₹ ${productState.currentProduct.productDiscount}`}</Text>
                </View>
              )}
              {productState.currentProduct.productDiscount === "" && (
                <Text
                  style={styles.price}
                >{`₹ ${productState.currentProduct.productPrice}`}</Text>
              )}
              {parseInt(productState.currentProduct.productStock) > 0 && (
                <Text
                  style={styles.cat}
                >{`Stock: ${productState.currentProduct.productStock}`}</Text>
              )}
              {parseInt(productState.currentProduct.productStock) === 0 && (
                <Text style={styles.cat}>{`No available`}</Text>
              )}
            </View>
          </ScrollView>
        </ThemeProvider>
      </SafeAreaView>
    );
  } else {
    return null;
  }
};

const styles = StyleSheet.create({
  images: {
    height: rh(40),
    width: rw(95),
    borderRadius: rf(1),
  },
  container: {
    paddingTop: rh(2),
  },
  detailsContainer: {
    marginHorizontal: rw(3),
    height: rh(15),
    justifyContent: "space-between",
  },
  name: {
    fontFamily: "Helvetica",
    color: colors.primary,
    fontSize: rf(3.5),
    marginLeft: rw(3),
    marginTop: rw(1),
  },
  cat: {
    fontFamily: "Helvetica",
    color: colors.accent,
    fontSize: rf(2.7),
    marginLeft: rw(3),
    marginTop: rh(1),
  },
  price: {
    fontFamily: "Helvetica",
    color: colors.green,
    fontSize: rf(2.7),
    marginLeft: rw(3),
    marginTop: rh(1),
  },
  offertag: {
    height: rh(5),
    width: rw(20),
    backgroundColor: colors.green,
    position: "absolute",
    top: 0,
    right: 0,
    borderBottomRightRadius: rf(1),
    alignItems: "center",
    justifyContent: "center",
  },
  offerText: {
    fontSize: rf(2),
    alignSelf: "center",
    color: colors.white,
  },
});
export default ProductInfo;
