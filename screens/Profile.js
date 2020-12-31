import React, { useContext, useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import {
  Text,
  Avatar,
  ThemeProvider,
  Input,
  Button,
  Overlay,
} from "react-native-elements";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  responsiveHeight as rh,
  responsiveWidth as rw,
  responsiveFontSize as rf,
} from "react-native-responsive-dimensions";
import { Context as AuthContext } from "../contexts/AuthContext";
import { Context as ProfileContext } from "../contexts/ProfileContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import colors from "../utils/colors";
import theme from "../utils/Theme";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import * as Animatable from "react-native-animatable";
import { DotIndicator } from "react-native-indicators";
import { ScrollView } from "react-native-gesture-handler";
import ImagePicker from "react-native-image-crop-picker";

const Profile = () => {
  const { state: authState } = useContext(AuthContext);
  const {
    state: profileState,
    profileUpdate,
    profilePicUpload,
    getProfilePic,
    getProfileData,
  } = useContext(ProfileContext);
  const [view, setView] = useState("profileView");
  const [profileData, setProfileData] = useState(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    getProfileData({ id: authState.id });
  }, [view]);

  useEffect(() => {
    console.log(profileState.profilePic);
  }, [profileState.profilePic]);
  useEffect(() => {
    if (profileState.profile) {
      setProfileData({
        firstName: profileState.profile.firstName,
        lastName: profileState.profile.lastName,
        email: profileState.profile.email,
        phone: profileState.profile.phone,
      });
    }
  }, [profileState.profile]);

  const onSubmit = () => {
    profileUpdate({
      profile: profileData,
      id: authState.id,
    });
    setView("profileView");
  };

  const SubmitEligibility = () => {
    if (
      (profileData.firstName !== profileState.profile.firstName ||
      profileData.lastName !== profileState.profile.lastName ||
      profileData.email !== profileState.profile.email ||
      profileData.phone !== profileState.profile.phone) &&
      (profileData.firstName &&
      profileData.lastName &&
      profileData.email &&
      profileData.phone)
    ) {
      return true;
    } else {
      return false;
    }
  };

  const ProfilePicUpload = async ({ pickImage, openCam }) => {
    if (pickImage) {
      await ImagePicker.openPicker({
        compressImageQuality: 0.8,
        width: 300,
        height: 400,
        cropping: true,
      })
        .then((image) => {
          setVisible(false);
          profilePicUpload({ id: authState.id, path: image.path });
          console.log(image);
        })
        .then(() => getProfileData({ id: authState.id }))
        .catch((err) => console.log(err));
    }

    if (openCam) {
      ImagePicker.openCamera({
        compressImageQuality: 0.8,
        width: 300,
        height: 400,
        cropping: true,
      })
        .then((image) => {
          setVisible(false);
          profilePicUpload({ id: authState.id, path: image.path });
          console.log(image);
        })
        .then(() => getProfileData({ id: authState.id }))
        .catch((err) => console.log(err));
    }
  };

  const toggleOverlay = () => {
    setVisible(!visible);
  };
  useEffect(() => {
    console.log(authState.loading, profileState.loading);
  }, [authState.loading, profileState.loading]);

  return (
    <ThemeProvider theme={theme}>
      <SafeAreaView style={styles.container}>
        {(authState.loading ||
          profileState.loading ||
          profileData === null) && <DotIndicator color={colors.primary} />}
        {!authState.loading && !profileState.loading && (
          <>
            {view === "profileView" && profileData !== null && (
              <Animatable.View useNativeDriver={true} animation="zoomInUp">
                <MaterialCommunityIcons
                  name="account-edit"
                  onPress={() => setView("profileEdit")}
                  color={colors.primary}
                  style={{ alignSelf: "flex-end", marginRight: rw(2) }}
                  size={rf(5)}
                />
                <Avatar
                  rounded
                  source={{
                    uri: profileState.profile.profilePicUrl,
                  }}
                  icon={{
                    name: "face",
                  }}
                  size={rf(15)}
                  containerStyle={styles.avatar}
                />
                <View style={styles.profileInfo}>
                  <View style={{ flexDirection: "row", marginTop: rh(2) }}>
                    <Text style={styles.keyText}>Merchant Name: </Text>
                    <Text
                      style={styles.valueText}
                    >{`${profileData.firstName} ${profileData.lastName}`}</Text>
                  </View>
                  <View style={{ flexDirection: "row", marginTop: rh(2) }}>
                    <Text style={styles.keyText}>Phone: </Text>
                    <Text style={styles.valueText}>{profileData.phone}</Text>
                  </View>
                  <View style={{ flexDirection: "row", marginTop: rh(2) }}>
                    <Text style={styles.keyText}>Email: </Text>
                    <Text style={styles.valueText}>{profileData.email}</Text>
                  </View>
                </View>
              </Animatable.View>
            )}
            {view === "profileEdit" && (
              <Animatable.View useNativeDriver={true} animation="zoomInUp">
                <ScrollView>
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
                  <Avatar
                    rounded
                    source={{
                      uri: profileState.profile.profilePicUrl,
                    }}
                    icon={{
                      name: "face",
                    }}
                    size={rf(15)}
                    containerStyle={styles.avatar}
                  ></Avatar>
                  <Button
                    onPress={() => setVisible(true)}
                    title="Upload Picture"
                    type="clear"
                    titleStyle={{ color: colors.primary }}
                    buttonStyle={{ backgroundColor: colors.white }}
                  />
                  <View style={styles.profileInfo}>
                    <Input
                      value={profileData.firstName}
                      placeholder="First name"
                      onChangeText={(newText) =>
                        setProfileData({ ...profileData, firstName: newText })
                      }
                    ></Input>
                    <Input
                      value={profileData.lastName}
                      placeholder="Last name"
                      onChangeText={(newText) =>
                        setProfileData({ ...profileData, lastName: newText })
                      }
                    ></Input>
                    <Input
                      value={profileData.email}
                      keyboardType="email-address"
                      placeholder="email"
                      onChangeText={(newText) =>
                        setProfileData({ ...profileData, email: newText })
                      }
                    ></Input>
                    <Input
                      value={profileData.phone}
                      keyboardType="phone-pad"
                      placeholder="Phone"
                      onChangeText={(newText) =>
                        setProfileData({ ...profileData, phone: newText })
                      }
                    ></Input>
                    <Button
                      title="Submit"
                      type="solid"
                      disabled={!SubmitEligibility()}
                      disabledStyle={{ backgroundColor: colors.grey }}
                      disabledTitleStyle={{ color: colors.white }}
                      onPress={onSubmit}
                    />
                  </View>
                </ScrollView>
              </Animatable.View>
            )}
            {view === "profileEdit" && (
              <MaterialIcons
                style={styles.previewIcon}
                onPress={() => setView("profileView")}
                name="preview"
                color={colors.primary}
                size={rf(7)}
              />
            )}
          </>
        )}
      </SafeAreaView>
    </ThemeProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  avatar: {
    alignSelf: "center",
    marginTop: rh(3),
    borderWidth: rf(0.2),
    borderColor: colors.primary,
  },
  profileInfo: {
    alignSelf: "center",
    marginTop: rh(2),
    marginHorizontal: rw(2),
    elevation: 4,
  },
  keyText: {
    color: colors.accent,
  },
  valueText: {
    color: colors.primary,
  },
  previewIcon: {
    position: "absolute",
    right: rw(8),
    top: rh(80),
    overflow: "visible",
  },
});
export default Profile;
