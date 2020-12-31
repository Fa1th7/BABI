import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Text } from "react-native-elements";
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";
import colors from "../utils/colors";
import {
  responsiveHeight as rh,
  responsiveWidth as rw,
  responsiveFontSize as rf,
} from "react-native-responsive-dimensions";
import Fontisto from "react-native-vector-icons/Fontisto";

const LoactionCard = ({ latitude, longitude, containerStyle }) => {
  const [defaultDelta, setDefaultDelta] = useState({
    latitudeDelta: 0.019,
    longitudeDelta: 0.019,
  });

  return (
    <View style={{...containerStyle, ...styles.map}}>
      <MapView
        style={{ height: rh(30), width: rw(80) }}
        provider={PROVIDER_GOOGLE}
        initialRegion={{
          ...defaultDelta,
          latitude: latitude,
          longitude: longitude,
        }}
        loadingEnabled
        scrollEnabled={false}
        zoomTapEnabled={false}
        region={{
          ...defaultDelta,
          latitude: latitude,
          longitude: longitude,
        }}
      >
        <Marker
          coordinate={{
            latitude: latitude,
            longitude: longitude,
          }}
        >
          <Fontisto name="shopping-store" size={30} color={colors.primary} />
        </Marker>
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  map: {
    borderWidth: rh(0.5),
    borderColor: colors.primary,
    alignSelf: "center",
    marginTop: rh(4),
  },
});
export default LoactionCard;
