import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { Button, ThemeProvider } from "react-native-elements";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import colors from "../../utils/colors";
import theme from "../../utils/Theme";
import {
  responsiveHeight as rh,
  responsiveWidth as rw,
  responsiveFontSize as rf,
} from "react-native-responsive-dimensions";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Fontisto from "react-native-vector-icons/Fontisto";
import { TouchableOpacity } from "react-native-gesture-handler";
import useGetLocation from "../../utils/useGetLocation";
import { SafeAreaView } from "react-native-safe-area-context";
import { navigate } from "../../RootNavigation";

const SetLocation = () => {
  const { location, getLocationUpdates, error, loading } = useGetLocation({
    realTime: false,
  });
  const [defaultDelta, setDefaultDelta] = useState({
    latitudeDelta: 0.019,
    longitudeDelta: 0.019,
  });
  const [routeRegion, setRouteRegion] = useState({
    latitude: 22.56269,
    longitude: 88.3538,
  });
  const [currentLoc, setCurrentLoc] = useState({ lat: 0, long: 0 });
  const [shopLoc, setShopLoc] = useState({
    latitude: currentLoc.lat,
    longitude: currentLoc.long,
  });
  useEffect(() => {
    {
      if (!loading && location !== undefined) {
        setCurrentLoc({
          lat: location.coords.latitude,
          long: location.coords.longitude,
        });
        setRouteRegion({
          latitude: currentLoc.lat,
          longitude: currentLoc.long,
        });
      }
    }
    return () => null;
  }, [location]);

  useEffect(() => {
    getLocationUpdates();
  }, []);
  useEffect(() => {
    setShopLoc({ latitude: currentLoc.lat, longitude: currentLoc.long });
  }, [currentLoc]);
  useEffect(() => {
    setRouteRegion({
      latitude: shopLoc.latitude,
      longitude: shopLoc.longitude,
    });
  }, [shopLoc]);

  useEffect(() => {
    console.log(shopLoc);
  }, [shopLoc]);
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <MapView
        style={{ ...styles.map, height: rh(100), width: rw(100) }}
        provider={PROVIDER_GOOGLE}
        initialRegion={{
          ...defaultDelta,
          latitude: routeRegion.latitude,
          longitude: routeRegion.longitude,
        }}
        onRegionChangeComplete={(e) => {
          setRouteRegion({ latitude: e.latitude, longitude: e.longitude });
          setDefaultDelta({
            latitudeDelta: e.latitudeDelta,
            longitudeDelta: e.longitudeDelta,
          });
        }}
        loadingEnabled
        scrollEnabled={true}
        zoomTapEnabled={true}
        region={{
          ...defaultDelta,
          latitude: routeRegion.latitude,
          longitude: routeRegion.longitude,
        }}
      >
        <Marker.Animated
          draggable
          onDragEnd={(e) =>
            setShopLoc({
              latitude: e.nativeEvent.coordinate.latitude,
              longitude: e.nativeEvent.coordinate.longitude,
            })
          }
          coordinate={{
            latitude: shopLoc.latitude,
            longitude: shopLoc.longitude,
          }}
        >
          <Fontisto name="shopping-store" size={30} color={colors.primary} />
        </Marker.Animated>
      </MapView>
      <View
        style={{
          overflow: "visible",
          position: "absolute",
          left: rw(85),
          top: rh(80),
          backgroundColor: colors.primary,
          padding: rf(1),
          borderRadius: rh(0.5),
        }}
      >
        <MaterialIcons
          onPress={() => {
            setRouteRegion({
              latitude: currentLoc.lat,
              longitude: currentLoc.long,
            });
            setShopLoc({
              latitude: currentLoc.lat,
              longitude: currentLoc.long,
            });
          }}
          name="my-location"
          color={colors.white}
          size={rw(8)}
        />
      </View>
      <Button
        title="Set"
        type="solid"
        buttonStyle={{
          height: rh(7),
          width: rw(30),
          borderRadius: rh(1),
          backgroundColor:colors.primary
         
        }}
        containerStyle={{
          position: "absolute",
          overflow: "visible",
          left: rw(35),
          bottom: rh(3.5),
          backgroundColor:colors.white
        }}
        onPress = {() => navigate('ShopCreate', {shopLoc: shopLoc})}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  map: {
    alignSelf: "center",
  },
});
export default SetLocation;
