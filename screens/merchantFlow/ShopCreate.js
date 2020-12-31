import React, { useContext, useEffect, useState } from "react";
import { View, StyleSheet, Image } from "react-native";
import {
  Text,
  Overlay,
  Button,
  Input,
  ThemeProvider,
} from "react-native-elements";
import {
  responsiveHeight as rh,
  responsiveWidth as rw,
  responsiveFontSize as rf,
} from "react-native-responsive-dimensions";
import * as Animatable from "react-native-animatable";
import { DotIndicator } from "react-native-indicators";
import DropDownPicker from "react-native-dropdown-picker";
import { ScrollView } from "react-native-gesture-handler";
import ImagePicker from "react-native-image-crop-picker";
import colors from "../../utils/colors";
import theme from "../../utils/Theme";
import { SafeAreaView } from "react-native-safe-area-context";
import LocationCard from "../../components/LoactionCard";
import { navigate } from "../../RootNavigation";
import { Context as ShopProfileContext } from "../../contexts/ShopProfileContext";
import { Context as AuthContext } from "../../contexts/AuthContext";

const ShopCreate = ({ route }) => {
  const { state: authState } = useContext(AuthContext);
  const { state: shopState, profileCreate, profileUpdate } = useContext(
    ShopProfileContext
  );
  const [visible, setVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [shopId, setShopId] = useState(null);
  const [shopLocation, setShopLocation] = useState(null);
  const [shopProfile, setShopProfile] = useState({
    shopName: "",
    address: "",
    shopDesc: "",
    contactNumber: "",
    owner: "",
    shopType: "product",
    status: "open",
    shopProfilePicUrl:
      "https://firebasestorage.googleapis.com/v0/b/apka-dukan.appspot.com/o/ShopProfile%2FshopDefault.jpg?alt=media&token=58bd1293-49c6-44fe-91ab-078ea56e7e00",
  });

  const [path, setPath] = useState("");
  const shopTypes = [
    {
      label: "Product",
      value: "product",
    },
    {
      label: "Service",
      value: "service",
    },
    {
      label: "Food",
      value: "food",
    },
  ];

  const statusValues = [
    {
      label: "Open",
      value: "open",
    },
    {
      label: "Closed",
      value: "closed",
    },
  ];

  useEffect(() => {
    if (route.params && route.params.shopLoc) {
      console.log(shopLocation, route.params.shopLoc);
      setShopLocation(route.params.shopLoc);
    }
  }, [route.params]);

  useEffect(() => {
    if (route.params && route.params.shopId) {
      setShopId(route.params.shopId);
    }
  }, [route.params]);

  useEffect(() => {
    if (route.params && route.params.profileData) {
      setEditMode(true);
      setShopProfile({
        ...shopProfile,
        shopName: route.params.profileData.shopName,
        address: route.params.profileData.address,
        shopDesc: route.params.profileData.shopDesc,
        contactNumber: route.params.profileData.contactNumber,
        owner: route.params.profileData.owner,
        shopType: route.params.profileData.shopType,
        shopProfilePicUrl: route.params.profileData.shopProfilePicUrl,
        status: route.params.profileData.status,
      });
      if (!route.params.shopLoc) {
        console.log("gg");
        setShopLocation(route.params.profileData.shopLocation);
      }
    }
  }, [route.params]);

  const ProfilePicUpload = async ({ pickImage, openCam }) => {
    if (pickImage) {
      await ImagePicker.openPicker({
        compressImageQuality: 0.8,
        width: 300,
        height: 400,
        cropping: false,
      })
        .then((image) => {
          setVisible(false);
          setPath(image.path);
          console.log(image);
        })

        .catch((err) => {
          console.log("e", err);
          setVisible(false);
        });
    }

    if (openCam) {
      ImagePicker.openCamera({
        compressImageQuality: 0.8,
        width: 300,
        height: 400,
        cropping: false,
      })
        .then((image) => {
          setVisible(false);
          setPath(image.path);
        })

        .catch((err) => {
          console.log(err);
          setVisible(false);
        });
    }
  };

  const toggleOverlay = () => {
    setVisible(!visible);
  };
  const onSubmit = () => {
    if (!editMode) {
      profileCreate({ id: authState.id, profile: {...shopProfile, shopLocation: shopLocation}, path: path });
    }

    if (editMode) {
      profileUpdate({ id: shopId, profile: {...shopProfile, shopLocation: shopLocation}, path: path });
    }
  };
  if (shopState.loading) {
    return <DotIndicator color={colors.primary} />;
  } else {
    return (
      <SafeAreaView style={styles.container}>
        <Animatable.View useNativeDriver={true} animation="zoomInUp">
          <ScrollView>
            <ThemeProvider theme={theme}>
              <Overlay isVisible={visible} onBackdropPress={toggleOverlay}>
                <View
                  style={{
                    width: rw(50),
                    height: rh(20),
                    alignItems: "center",
                    alignSelf: "center",
                    justifyContent: "center",
                  }}
                >
                  <Button
                    onPress={() => ProfilePicUpload({ openCam: true })}
                    title={`Open Camera`}
                  />

                  <Button
                    title={`Pick Image`}
                    onPress={() => ProfilePicUpload({ pickImage: true })}
                  />
                </View>
              </Overlay>
              {path !== "" && (
                <View>
                  <Image
                    source={{
                      uri: path,
                    }}
                    resizeMethod="auto"
                    resizeMode="cover"
                    style={{
                      height: rh(30),
                      borderBottomRightRadius: rh(2),
                      borderBottomLeftRadius: rh(2),
                    }}
                  />
                </View>
              )}
              {path === "" && (
                <View>
                  <Image
                    source={{
                      uri: shopProfile.shopProfilePicUrl,
                    }}
                    style={{
                      height: rh(30),
                      borderBottomRightRadius: rh(2),
                      borderBottomLeftRadius: rh(2),
                    }}
                  />
                </View>
              )}

              <Button
                onPress={() => setVisible(true)}
                buttonStyle={{ backgroundColor: colors.white, width: rw(50) }}
                type="clear"
                title="Set Shop Profile Picture"
              />
              {shopLocation && (
                <View>
                  <LocationCard
                    latitude={shopLocation.latitude}
                    longitude={shopLocation.longitude}
                  />
                </View>
              )}

              <Button
                onPress={() => navigate("SetLocation")}
                buttonStyle={{ backgroundColor: colors.white, width: rw(50) }}
                type="clear"
                title="Set shop location"
              />
              <View style={styles.profileInfo}>
                <Text
                  style={{
                    color: colors.grey,
                    marginLeft: 20,
                    marginRight: 20,
                    marginTop: 15,
                    marginBottom: 1,
                    fontWeight: "bold",
                    fontSize: rf(2.5),
                  }}
                >
                  Shop type
                </Text>
                <DropDownPicker
                  items={shopTypes}
                  defaultValue={shopProfile.shopType}
                  containerStyle={{
                    height: rh(4),
                    marginBottom: rh(3),
                    marginTop: rh(2),
                  }}
                  style={{
                    backgroundColor: colors.white,
                    borderColor: colors.white,
                    borderBottomRightRadius: 0,
                    borderBottomLeftRadius: 0,
                    elevation: 0,
                    borderBottomColor: colors.grey,
                    marginHorizontal: rw(5),
                    paddingLeft: 0,
                  }}
                  labelStyle={{ fontSize: rf(2.5), color: colors.grey }}
                  dropDownStyle={{ backgroundColor: "#fafafa" }}
                  onChangeItem={(item) =>
                    setShopProfile({ ...shopProfile, shopType: item.value })
                  }
                />
                <Input
                  value={shopProfile.shopName}
                  onChangeText={(newText) =>
                    setShopProfile({ ...shopProfile, shopName: newText })
                  }
                  label="Shop name"
                  labelStyle={{ fontSize: rf(2.5) }}
                  placeholder="Eg: Awesome Fashion Store"
                ></Input>

                <Input
                  value={shopProfile.address}
                  onChangeText={(newText) =>
                    setShopProfile({ ...shopProfile, address: newText })
                  }
                  labelStyle={{ fontSize: rf(2.5) }}
                  label="Address"
                  placeholder="Your shop address"
                ></Input>
                <Input
                  value={shopProfile.shopDesc}
                  onChangeText={(newText) =>
                    setShopProfile({ ...shopProfile, shopDesc: newText })
                  }
                  labelStyle={{ fontSize: rf(2.5) }}
                  label="Shop description"
                  placeholder="Write what you sell"
                ></Input>
                <Input
                  value={shopProfile.contactNumber}
                  onChangeText={(newText) =>
                    setShopProfile({ ...shopProfile, contactNumber: newText })
                  }
                  keyboardType="phone-pad"
                  label="Contact Number"
                  labelStyle={{ fontSize: rf(2.5) }}
                  placeholder="Give your valid contact number"
                ></Input>
                <Input
                  value={shopProfile.owner}
                  onChangeText={(newText) =>
                    setShopProfile({ ...shopProfile, owner: newText })
                  }
                  labelStyle={{ fontSize: rf(2.5) }}
                  label="Owner"
                  placeholder="Who owns the bussiness"
                ></Input>
                <Text
                  style={{
                    color: colors.grey,
                    marginLeft: 20,
                    marginRight: 20,
                    marginBottom: 1,
                    fontWeight: "bold",
                    fontSize: rf(2.5),
                  }}
                >
                  Status
                </Text>
                <DropDownPicker
                  items={statusValues}
                  defaultValue={shopProfile.status}
                  containerStyle={{
                    height: rh(4),
                    marginBottom: rh(3),
                    marginTop: rh(2),
                  }}
                  style={{
                    backgroundColor: colors.white,
                    borderColor: colors.white,
                    borderBottomRightRadius: 0,
                    borderBottomLeftRadius: 0,
                    elevation: 0,
                    borderBottomColor: colors.grey,
                    marginHorizontal: rw(5),
                    paddingLeft: 0,
                  }}
                  labelStyle={{ fontSize: rf(2.5), color: colors.grey }}
                  dropDownStyle={{ backgroundColor: "#fafafa" }}
                  onChangeItem={(item) =>
                    setShopProfile({ ...shopProfile, status: item.value })
                  }
                />
                <Button onPress={onSubmit} title="Submit" type="solid" />
              </View>
            </ThemeProvider>
          </ScrollView>
        </Animatable.View>
      </SafeAreaView>
    );
  }
};

const styles = StyleSheet.create({
  avatar: {
    alignSelf: "center",
    marginTop: rh(3),
    borderWidth: rf(0.2),
    borderColor: colors.primary,
  },
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  profileInfo: {
    marginBottom: rh(2),
  },
});
export default ShopCreate;
