import colors from "./colors";
import {
    responsiveHeight as rh,
    responsiveWidth as rw,
    responsiveFontSize as rf,
  } from "react-native-responsive-dimensions";
const theme = {
  Button: {
    buttonStyle: {
      backgroundColor: colors.primary,
      width: rw(30),
      alignSelf: 'center',
      marginTop: rh(2)
    },
    titleStyle:{
        fontSize: rf(2)
    }
  },
  Input:{
    containerStyle:{
        width: rw(95),
        alignSelf: 'center',
    }
  },
  Text:{
    style:{
      fontSize:rf(2.5),
      fontFamily: "Helvetica"

    }
  }
};
export default theme;
