import React from 'react';
import { SafeAreaView } from 'react-native';
import { View, StyleSheet} from 'react-native';
import {Text} from 'react-native-elements';
import { ScrollView } from 'react-native-gesture-handler';
import {
    responsiveHeight as rh,
    responsiveWidth as rw,
    responsiveFontSize as rf,
  } from "react-native-responsive-dimensions";
  import colors from '../../utils/colors';

const StockManage = () => {
    return (
        <SafeAreaView style = {{flex:1}}>
        <ScrollView>
            <Text style = {{marginBottom: rh(1)}}>StockManage</Text>
        </ScrollView>
        </SafeAreaView>
    )
}

const styles  = StyleSheet.create({

})
export default StockManage;