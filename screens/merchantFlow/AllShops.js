import React, { useContext, useEffect, useRef, useState } from "react";
import { View, StyleSheet } from "react-native";
import {
  Text,
  Button,
  ThemeProvider,
  Overlay,
  Image,
} from "react-native-elements";
import { DotIndicator } from "react-native-indicators";
import { SafeAreaView } from "react-native-safe-area-context";
import theme from "../../utils/Theme";
import colors from "../../utils/colors";
import {
  responsiveHeight as rh,
  responsiveWidth as rw,
  responsiveFontSize as rf,
} from "react-native-responsive-dimensions";
import { Context as ShopProfileContext } from "../../contexts/ShopProfileContext";
import { Context as AuthContext } from "../../contexts/AuthContext";
import ShopCard from "../../components/ShopCard";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import * as Animatable from "react-native-animatable";
import { useIsFocused } from "@react-navigation/native";
import Share from "react-native-share";

const AllShops = ({ navigation }) => {
  const focused = useIsFocused();
  const {
    state: shopProfileState,
    getAllShops,
    getSingleShop,
    profileDelete,
  } = useContext(ShopProfileContext);
  const { state: authState } = useContext(AuthContext);
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState("");
  const snapRef = useRef();
  const [snapImage, setSnapImage] = useState(null);

  useEffect(() => {
    if (focused === true) {
      getAllShops({ id: authState.id });
    }
  }, [focused]);

  const takeSnap = () => {
    snapRef.current.capture().then((uri) => {
      setSnapImage(uri);
    });
  };
  const onLongPress = (id) => {
    setSelected(id);
    setVisible(true);
  };
  const onShare = () => {
    takeSnap();
    console.log(snapImage)
    const options = {
      title: "Check out this shop",
      url: snapImage,
      message:"www.google.com"
    }
    Share.open(options)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        err && console.log(err);
      });

    setVisible(false);
  };
  useEffect(() => {
    console.log(shopProfileState.loading);
  }, [shopProfileState.loading]);
  const toggleOverlay = () => {
    setVisible(!visible);
    setSelected("");
  };
  const onEdit = () => {
    const selectedProfileData = shopProfileState.allShops.find((item) => {
      return item.shopId === selected;
    });
    navigation.navigate("ShopCreate", {
      shopId: selected,
      profileData: selectedProfileData,
    });
    setVisible(false);
    setSelected("");
  };
  const onDelete = () => {
    profileDelete({ id: selected });
    setVisible(false);
    setSelected("");
    getAllShops({ id: authState.id });
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ThemeProvider theme={theme}>
        {shopProfileState.loading && <DotIndicator color={colors.primary} />}
        {!shopProfileState.loading && (
          <>
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
                <Button onPress={onEdit} title={`Edit Shop`} />

                <Button title={`Delete Shop`} onPress={onDelete} />
                <Button title={`Share`} onPress={onShare} />
              </View>
            </Overlay>
            <ScrollView>
              {shopProfileState.allShops &&
                shopProfileState.allShops.map((item) => {
                  return (
                    <Animatable.View
                      key={item.shopId}
                      useNativeDriver={true}
                      animation="bounceIn"
                    >
                      <ShopCard
                        shopDp={item.shopProfilePicUrl}
                        address={item.address}
                        name={item.shopName}
                        owner={item.owner}
                        contactNumber={item.contactNumber}
                        desc={item.shopDesc}
                        onPressShopCard={() =>
                          getSingleShop({ id: item.shopId })
                        }
                        onLongPressCard={() => onLongPress(item.shopId)}
                        snapRef={snapRef}
                      />
                    </Animatable.View>
                  );
                })}
              {snapImage && (
                <Image
                  source={{ uri: snapImage }}
                  style={{
                    height: rh(60),
                    width: rw(100),
                    alignSelf: "center",
                  }}
                />
              )}
            </ScrollView>
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
                onPress={() => navigation.navigate("ShopCreate")}
                name="add-business"
                size={rf(8)}
                color={colors.white}
              />
            </TouchableOpacity>
          </>
        )}
      </ThemeProvider>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({});
export default AllShops;
