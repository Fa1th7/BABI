import React, { useContext, useEffect, useState } from "react";
import { View, StyleSheet, Image, RefreshControl } from "react-native";
import {
  Text,
  Button,
  ThemeProvider,
  ButtonGroup,
  Overlay,
} from "react-native-elements";
import { SafeAreaView } from "react-native-safe-area-context";
import { Context as ShopProfileContext } from "../../contexts/ShopProfileContext";
import { Context as ProductContext } from "../../contexts/ProductContext";
import {
  responsiveHeight as rh,
  responsiveWidth as rw,
  responsiveFontSize as rf,
} from "react-native-responsive-dimensions";
import colors from "../../utils/colors";
import Theme from "../../utils/Theme";
import LocationCard from "../../components/LoactionCard";
import ProductCard from "../../components/ProductCard";
import StockManage from "../productFlow/StockManage";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import openMap from "react-native-open-maps";
import useGetLocation from "../../utils/useGetLocation";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { navigate } from "../../RootNavigation";
import { useIsFocused } from "@react-navigation/native";
import * as Animatable from "react-native-animatable";
import { DotIndicator } from "react-native-indicators";
import ToggleSwitch from "toggle-switch-react-native";

const ShopInfo = ({ navigation, route }) => {
  const focused = useIsFocused();
  const { state: shopState, profileStatusUpdate } = useContext(
    ShopProfileContext
  );
  const {
    state: productState,
    getAllProdutcs,
    getSingleProduct,
    productDelete,
  } = useContext(ProductContext);
  const { location, getLocationUpdates, error, loading } = useGetLocation({
    realTime: false,
  });
  const [shopStatus, setShopStatus] = useState(shopState.currentShop.status);
  const [hideImage, setHideImage] = useState(false);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState("");
  const [visible, setVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const ReverseShopStatusDeduct = () => {
    if (shopStatus === "open") {
      return { status: true, color: colors.green };
    }
    if (shopStatus === "closed") {
      return { status: false, color: colors.grey };
    }
  };

  const StatusChange = (stat) => {
    if (stat) {
      setShopStatus("open");
      profileStatusUpdate({ id: shopState.currentShop.shopId, status: "open" });
    }
    if (!stat) {
      setShopStatus("closed");
      profileStatusUpdate({
        id: shopState.currentShop.shopId,
        status: "closed",
      });
    }
  };

  const onLongPress = (id) => {
    setSelected(id);
    setVisible(true);
  };
  const toggleOverlay = () => {
    setVisible(!visible);
    setSelected("");
  };
  const onEdit = () => {
    const selectedProductData = productState.allProducts.find((item) => {
      return item.productId === selected;
    });
    navigation.navigate("AddProduct", {
      productId: selected,
      productData: selectedProductData,
    });
    setVisible(false);
    setSelected("");
  };

  const onDelete = () => {
    productDelete({ id: selected });
    setVisible(false);
    setSelected("");
  };

  useEffect(() => {
    getLocationUpdates();
  }, []);

  const getDirStat = () => {
    if(location){
      return true
    }
    else{
      return false
    }
  }

  useEffect(() => {
    getAllProdutcs({ id: shopState.currentShop.shopId });
  }, [focused, route.params]);
  const onGetDirection = () => {
    getLocationUpdates();
    if (!loading && location.coords) {
      const directionConfig = {
        start: `${location.coords.latitude},${location.coords.longitude}`,
        end: `${shopState.currentShop.shopLocation.latitude},${shopState.currentShop.shopLocation.longitude}`,
        travelType: "drive",
        provider: "google",
      };
      openMap(directionConfig);
    }
  };
  const wait = (timeout) => {
    return new Promise((resolve) => {
      setTimeout(resolve, timeout);
    });
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getAllProdutcs({ id: shopState.currentShop.shopId });
    wait(2000).then(() => setRefreshing(false));
  }, []);
  if (shopState.loading || productState.loading) {
    return <DotIndicator color={colors.primary} />;
  } else {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <ThemeProvider theme={Theme}>
          {!hideImage && index == 0 && (
            <Animatable.View useNativeDriver={true} animation="bounceIn">
              <Image
                source={{
                  uri: shopState.currentShop.shopProfilePicUrl,
                }}
                style={styles.dp}
              />
            </Animatable.View>
          )}

          <ButtonGroup
            onPress={(selectedIndex) => setIndex(selectedIndex)}
            selectedIndex={index}
            buttons={["Profile", "Products"]}
            selectedButtonStyle={{ backgroundColor: colors.primary }}
          />
          <ScrollView
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            {index === 0 && (
              <>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    marginVertical: rh(1),
                  }}
                >
                  <Text
                    style={{
                      color: colors.grey,
                      marginLeft: 20,
                      marginRight: rw(2),
                      marginBottom: 1,
                      fontWeight: "bold",
                      fontSize: rf(2.5),
                    }}
                  >
                    Status:
                  </Text>
                  <Text
                    style={{
                      marginRight: 20,
                      color: ReverseShopStatusDeduct().color,
                    }}
                  >
                    {shopStatus}
                  </Text>
                  <ToggleSwitch
                    isOn={ReverseShopStatusDeduct().status}
                    onColor={colors.primary}
                    offColor={colors.grey}
                    onToggle={(isOn) => {
                      StatusChange(isOn);
                    }}
                  />
                </View>
                <View style={{ marginLeft: rw(4) }}>
                  <Text selectable style={styles.name}>
                    {shopState.currentShop.shopName}
                  </Text>
                  <Text style={styles.descText}>
                    {shopState.currentShop.shopDesc}
                  </Text>
                  <Text selectable style={styles.descText}>
                    {shopState.currentShop.contactNumber}
                  </Text>
                  <Text selectable style={styles.descText}>
                    {shopState.currentShop.address}
                  </Text>
                </View>
                <View>
                  <LocationCard
                    latitude={shopState.currentShop.shopLocation.latitude}
                    longitude={shopState.currentShop.shopLocation.longitude}
                  />
                </View>
                <Button
                  disabled = {!getDirStat()}
                  disabledStyle = {{backgroundColor: colors.grey}}
                  disabledTitleStyle = {{color: colors.white}}
                  onPress={onGetDirection}
                  buttonStyle={styles.getDir}
                  title="Get Direction"
                />
              </>
            )}
            {index === 1 && (
              <View style={styles.productsContainer}>
                <Overlay isVisible={visible} onBackdropPress={toggleOverlay}>
                  <View
                    style={{
                      width: rw(50),
                      height: rh(25),
                      alignItems: "center",
                      alignSelf: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Button onPress={onEdit} title={`Edit`} />

                    <Button title={`Delete`} onPress={onDelete} />
                  </View>
                </Overlay>
                <ScrollView>
                  {productState.allProducts.length > 0 &&
                    productState.allProducts.map((item) => {
                      return (
                        <ProductCard
                          picUrl={item.imageIndex1}
                          productName={item.productName}
                          productCatagory={item.productCatagory}
                          productPrice={item.productPrice}
                          inStock={item.productStock}
                          discount={item.productDiscount}
                          productQuantitiy = {item.productQuantitiy}
                          key={item.productId}
                          onPressCard={() =>
                            getSingleProduct({ id: item.productId })
                          }
                          onLongPressCard={() => onLongPress(item.productId)}
                        />
                      );
                    })}
                  <View style={{ marginTop: rh(15) }}></View>
                </ScrollView>
              </View>
            )}
          </ScrollView>
          {index === 1 && (
            <TouchableOpacity
              containerStyle={{
                position: "absolute",
                overflow: "visible",
                right: rw(5),
                bottom: rh(5),
                backgroundColor: colors.primary,
                borderRadius: rh(1),
                elevation: 8,
                width: rw(18),
                alignItems: "center",
              }}
            >
              <MaterialIcons
                onPress={() => navigate("AddProduct")}
                name="add-shopping-cart"
                size={rf(8)}
                color={colors.white}
              />
            </TouchableOpacity>
          )}
        </ThemeProvider>
      </SafeAreaView>
    );
  }
};

const styles = StyleSheet.create({
  dp: {
    height: rh(30),
    width: rw(100),
  },
  name: {
    alignSelf: "flex-start",
    marginVertical: rh(1),
    fontFamily: "Helvetica",
    color: colors.primary,
    fontSize: rf(4),
  },
  descText: {
    fontSize: rf(2.4),
    fontFamily: "Helvetica",
    marginBottom: rh(0.5),
  },
  mapContainer: {
    borderRadius: rh(40),
  },
  getDir: {
    marginBottom: rh(2),
  },
  productsContainer: {},
});
export default ShopInfo;
