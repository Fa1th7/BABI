import React, {useEffect, useState} from 'react';
import {
  Alert,
  Linking,
  PermissionsAndroid,
  Platform,
  ToastAndroid,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';

const appConfig = {
  name: 'SwaCity',
  displayName: 'Swacity',
};

export default function useGetLocation({realTime}) {
  const [location, setLocation] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  let watchId;

  useEffect(() => {
    return removeLocationUpdates;
  }, []);

  const hasLocationPermissionIOS = async () => {
    const openSetting = () => {
      Linking.openSettings().catch(() => {
        Alert.alert('Unable to open settings');
      });
    };
    const status = await Geolocation.requestAuthorization('whenInUse');

    if (status === 'granted') {
      return true;
    }

    if (status === 'denied') {
      Alert.alert('Location permission denied');
    }

    if (status === 'disabled') {
      Alert.alert(
        `Turn on Location Services to allow "${appConfig.displayName}" to determine your location.`,
        '',
        [
          {
            text: 'Go to Settings',
            onPress: openSetting,
          },
          {
            text: "Don't Use Location",
            onPress: () => {},
          },
        ],
      );
    }

    return false;
  };

  const hasLocationPermission = async () => {
    if (Platform.OS === 'ios') {
      const hasPermission = await hasLocationPermissionIOS();
      return hasPermission;
    }

    if (Platform.OS === 'android' && Platform.Version < 23) {
      return true;
    }

    const hasPermission = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );

    if (hasPermission) {
      return true;
    }

    const status = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );

    if (status === PermissionsAndroid.RESULTS.GRANTED) {
      return true;
    }

    if (status === PermissionsAndroid.RESULTS.DENIED) {
      ToastAndroid.show(
        'Location permission denied by user.',
        ToastAndroid.LONG,
      );
    } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
      ToastAndroid.show(
        'Location permission revoked by user.',
        ToastAndroid.LONG,
      );
    }

    return false;
  };

  const getLocation = async () => {
    const hasPermission = await hasLocationPermission();

    if (!hasPermission) {
      return;
    }

    setLoading(true);

    Geolocation.getCurrentPosition(
      (position) => {
        setLocation(position);
        setLoading(false);
        console.log(location)
      },
      (error) => {
        setError(error);
        setLoading(false);
        
      },
      {
        timeout: 15000,
        maximumAge: 10000,
        distanceFilter: 1,
        enableHighAccuracy: true,
      },
    );
  };

  const getLocationUpdates = async () => {
    const hasPermission = await hasLocationPermission();

    if (!hasPermission) {
      return;
    }

    // if (Platform.OS === 'android' && foregroundService) {
    //   await startForegroundService();
    // }

    watchId = Geolocation.watchPosition(
      (position) => {
        setLocation(position);
      },
      (error) => {
        setError(error);
       
      },
      {
        enableHighAccuracy: true,
        distanceFilter: 1,
        interval: 5000,
        fastestInterval: 2000,
      },
    );
  };

  const removeLocationUpdates = () => {
    if (watchId !== null) {
      Geolocation.clearWatch(watchId);
      watchId = null;
    }
  };

  return {location, loading, error, getLocation, getLocationUpdates};
}

// const startForegroundService = async () => {
//   if (Platform.Version >= 26) {
//     await VIForegroundService.createNotificationChannel({
//       id: 'locationChannel',
//       name: 'Location Tracking Channel',
//       description: 'Tracks location of user',
//       enableVibration: false,
//     });
//   }

//   return VIForegroundService.startService({
//     channelId: 'locationChannel',
//     id: 420,
//     title: appConfig.displayName,
//     text: 'Tracking location updates',
//     icon: 'ic_launcher',
//   });
// };

// stopForegroundService = () => {
//   if (foregroundService) {
//     VIForegroundService.stopService().catch((err) => err);
//   }
// };

//   render() {
//     const {
//       forceLocation,
//       highAccuracy,
//       loading,
//       location,
//       showLocationDialog,
//       significantChanges,
//       updatesEnabled,
//       foregroundService,
//     } = this.state;

//     return (
//       <View style={styles.container}>
//         <View style={styles.optionContainer}>
//           <View style={styles.option}>
//             <Text>Enable High Accuracy</Text>
//             <Switch onValueChange={this.setAccuracy} value={highAccuracy} />
//           </View>

//           {Platform.OS === 'ios' && (
//             <View style={styles.option}>
//               <Text>Use Significant Changes</Text>
//               <Switch
//                 onValueChange={this.setSignificantChange}
//                 value={significantChanges}
//               />
//             </View>
//           )}

//           {Platform.OS === 'android' && (
//             <>
//               <View style={styles.option}>
//                 <Text>Show Location Dialog</Text>
//                 <Switch
//                   onValueChange={this.setLocationDialog}
//                   value={showLocationDialog}
//                 />
//               </View>
//               <View style={styles.option}>
//                 <Text>Force Location Request</Text>
//                 <Switch
//                   onValueChange={this.setForceLocation}
//                   value={forceLocation}
//                 />
//               </View>
//               <View style={styles.option}>
//                 <Text>Enable Foreground Service</Text>
//                 <Switch
//                   onValueChange={this.setForegroundService}
//                   value={foregroundService}
//                 />
//               </View>
//             </>
//           )}
//         </View>
//         <View style={styles.buttonContainer}>
//           <Button
//             title='Get Location'
//             onPress={this.getLocation}
//             disabled={loading || updatesEnabled}
//           />
//           <View style={styles.buttons}>
//             <Button
//               title='Start Observing'
//               onPress={this.getLocationUpdates}
//               disabled={updatesEnabled}
//             />
//             <Button
//               title='Stop Observing'
//               onPress={this.removeLocationUpdates}
//               disabled={!updatesEnabled}
//             />
//           </View>

//           <View style={styles.result}>
//             <Text>{JSON.stringify(location, null, 4)}</Text>
//           </View>
//         </View>
//       </View>
//     );
//   }
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     backgroundColor: '#F5FCFF',
//     paddingHorizontal: 12,
//   },
//   optionContainer: {
//     paddingBottom: 24,
//   },
//   option: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingBottom: 12,
//   },
//   result: {
//     borderWidth: 1,
//     borderColor: '#666',
//     width: '100%',
//     paddingHorizontal: 16,
//   },
//   buttonContainer: {
//     alignItems: 'center',
//   },
//   buttons: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     alignItems: 'center',
//     marginVertical: 12,
//     width: '100%',
//   },
// });

// PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
//         title: 'Swacity Location Permission',
//         message: 'Swacity needs Access to you Location ' + 'so you can create routes.',
//         buttonNeutral: 'Ask Me Later',
//         buttonNegative: 'Cancel',
//         buttonPositive: 'OK',
//     },

// state = {
//     forceLocation: true,
//     highAccuracy: true,
//     loading: false,
//     showLocationDialog: true,
//     significantChanges: false,
//     updatesEnabled: false,
//     foregroundService: false,
//     location: {},
//   };

// getLocationUpdates = async () => {
//   const hasLocationPermission = await this.hasLocationPermission();

//   if (!hasLocationPermission) {
//     return;
//   }

//   if (Platform.OS === 'android' && this.state.foregroundService) {
//     await this.startForegroundService();
//   }

//   this.setState(
//     {
//       updatesEnabled: true,
//     },
//     () => {
//       this.watchId = Geolocation.watchPosition(
//         (position) => {
//           this.setState({
//             location: position,
//           });
//           console.log(position);
//         },
//         (error) => {
//           this.setState({
//             location: error,
//           });
//           console.log(error);
//         },
//         {
//           enableHighAccuracy: this.state.highAccuracy,
//           distanceFilter: 0,
//           interval: 5000,
//           fastestInterval: 2000,
//           forceRequestLocation: this.state.forceLocation,
//           showLocationDialog: this.state.showLocationDialog,
//           useSignificantChanges: this.state.significantChanges,
//         },
//       );
//     },
//   );
// };

// removeLocationUpdates = () => {
//   if (this.watchId !== null) {
//     this.stopForegroundService();
//     Geolocation.clearWatch(this.watchId);
//     this.watchId = null;
//     this.setState({
//       updatesEnabled: false,
//     });
//   }
// };

// startForegroundService = async () => {
//   if (Platform.Version >= 26) {
//     await VIForegroundService.createNotificationChannel({
//       id: 'locationChannel',
//       name: 'Location Tracking Channel',
//       description: 'Tracks location of user',
//       enableVibration: false,
//     });
//   }

//   return VIForegroundService.startService({
//     channelId: 'locationChannel',
//     id: 420,
//     title: appConfig.displayName,
//     text: 'Tracking location updates',
//     icon: 'ic_launcher',
//   });
// };

// stopForegroundService = () => {
//   if (this.state.foregroundService) {
//     VIForegroundService.stopService().catch((err) => err);
//   }
// };

/// component will unmount''''
//  removeLocationUpdates()

//   setAccuracy = (value) =>
//   this.setState({
//     highAccuracy: value,
//   });
// setSignificantChange = (value) =>
//   this.setState({
//     significantChanges: value,
//   });
// setLocationDialog = (value) =>
//   this.setState({
//     showLocationDialog: value,
//   });
// setForceLocation = (value) =>
//   this.setState({
//     forceLocation: value,
//   });
// setForegroundService = (value) =>
//   this.setState({
//     foregroundService: value,
//   });
