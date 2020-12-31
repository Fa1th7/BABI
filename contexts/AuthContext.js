import createDataContext from "../createDataContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as RootNavigation from "../RootNavigation";
import auth from "@react-native-firebase/auth";
import { GoogleSignin } from "react-native-google-signin";
import { LoginManager, AccessToken } from 'react-native-fbsdk';
import firestore from "@react-native-firebase/firestore";

const authReducer = (state, actions) => {
  switch (actions.type) {
    case "add_error":
      return { ...state, errorMessage: actions.payload };
    case "signin":
      return { ...state, errorMessage: "", token: actions.payload };
    case "get_otp":
      return { ...state, authRes: actions.payload };
    case "set_user":
      return {
        ...state,
        user: actions.payload,
      };
    case "set_id":
      return { ...state, id: actions.payload };
    case "clear_error_message":
      return { ...state, errorMessage: "" };
    case "signout":
      return { token: null, errorMessage: "" };
    case "set_loading":
      return {
        ...state,
        loading: actions.payload,
      };
    case "set_authUser":
      return {
        ...state,
        authUser: actions.payload,
      };
    default:
      return state;
  }
};

const tryLocalSignIn = (dispatch) => {
  return async () => {
    try {
      dispatch({ type: "set_loading", payload: true });
      const token = await AsyncStorage.getItem("token");
      const user = await AsyncStorage.getItem("user");
      const id = await AsyncStorage.getItem("id");
      if (token !== null && user !== null && id !== null) {
        console.log(token, user, id);
        dispatch({ type: "set_user", payload: { user: user, idToken: token } });
        dispatch({ type: "set_id", payload: id });
        dispatch({ type: "set_loading", payload: false });
        RootNavigation.navigate("userFlow");
      }
    } catch (err) {
      console.log(err);
      dispatch({ type: "add_error", payload: "Something Went Wrong" });
    } finally {
      console.log("local signed in");
    }
  };
};

const signInWithEmail = (dispatch) => {
  return async ({ email, password }) => {
    try {
      dispatch({ type: "set_loading", payload: true });
      await auth()
        .signInWithEmailAndPassword(email, password)
        .then((user) => {
          console.log(user.user);
          dispatch({ type: "set_authUser", payload: user.user });
        })
        .catch((err) => {
          console.log(err);
          dispatch({ type: "add_error", payload: err.code });
        });
    } catch (err) {
      console.log(err);
      dispatch({ type: "add_error", payload: "Something Went Wrong" });
    } finally {
      dispatch({ type: "set_loading", payload: false });
    }
  };
};

const signUpWithEmail = (dispatch) => {
  return async ({ email, password }) => {
    try {
      const usersCollection = firestore().collection("user");
      dispatch({ type: "set_loading", payload: true });
      await auth()
        .createUserWithEmailAndPassword(email, password)
        .then((user) => {
          console.log(user);
          dispatch({ type: "set_authUser", payload: user.user });
          if (user.additionalUserInfo.isNewUser) {
            usersCollection
              .add({
                firstName: "",
                lastName: "",
                email: user.user.email,
                uuid: user.user.uid,
              })
              .then(() => {
                //RootNavigation.navigate("", {});
              });
          }
        })
        .catch((err) => {
          console.log(err.code);
          dispatch({ type: "add_error", payload: err.code });
        });
    } catch (err) {
      console.log(err);
      dispatch({ type: "add_error", payload: "Something Went Wrong" });
    } finally {
      dispatch({ type: "set_loading", payload: false });
    }
  };
};
const cuurentAuthState = (dispatch) => {
  return async () => {
    try {
      dispatch({ type: "set_loading", payload: true });
      auth().onAuthStateChanged(function (user) {
        if (user) {
          dispatch({ type: "set_authUser", payload: user });
          dispatch({ type: "set_loading", payload: false });
        } else {
          dispatch({ type: "set_authUser", payload: null });
          dispatch({ type: "set_loading", payload: false });
        }
      });
    } catch (err) {
      console.log(err);
      dispatch({ type: "add_error", payload: "Something Went Wrong" });
    } finally {
      console.log("done");
    }
  };
};

const getOtp = (dispatch) => {
  return async ({ phoneNumber }) => {
    try {
      const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
      dispatch({ type: "set_loading", payload: true });
      dispatch({ type: "get_otp", payload: confirmation });
    } catch (err) {
      console.log(err);
      dispatch({ type: "add_error", payload: "Something Went Wrong" });
    } finally {
      dispatch({ type: "set_loading", payload: false });
    }
  };
};

const getUser = (dispatch) => {
  return async ({ uuid }) => {
    try {
      const usersCollection = firestore()
        .collection("user")
        .where("uuid", "==", uuid);
      dispatch({ type: "set_loading", payload: true });
      usersCollection
        .get()
        .then(function (querySnapshot) {
          querySnapshot.forEach(function (doc) {
            // doc.data() is never undefined for query doc snapshots
            dispatch({ type: "set_id", payload: doc.id });
            dispatch({ type: "set_user", payload: doc.data() });
            dispatch({ type: "set_loading", payload: false });
          });
        })
        .catch(function (error) {
          console.log("Error getting documents: ", error);
        });
    } catch (err) {
      console.log(err);
      dispatch({ type: "add_error", payload: "Something Went Wrong" });
    } finally {
      console.log("done");
    }
  };
};
const verifyOtp = (dispatch) => {
  return async ({ code, authRes }) => {
    try {
      dispatch({ type: "set_loading", payload: true });
      const res = await authRes.confirm(code);
      console.log(res);
    } catch (err) {
      console.log(err);
      dispatch({ type: "add_error", payload: "Something Went Wrong" });
    } finally {
      dispatch({ type: "set_loading", payload: false });
    }
  };
};
const onGoogleButtonPress = (dispatch) => {
  return async () => {
    try {
      const { idToken } = await GoogleSignin.signIn();
      const usersCollection = firestore().collection("user");
      // Create a Google credential with the token
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);

      // Sign-in the user with the credential
      dispatch({ type: "set_loading", payload: true });
      await auth()
        .signInWithCredential(googleCredential)
        .then((user) => {
          console.log(user);
          dispatch({ type: "set_authUser", payload: user.user });
          if (user.additionalUserInfo.isNewUser) {
            usersCollection.add({
              firstName: user.additionalUserInfo.profile.given_name,
              lastName: user.additionalUserInfo.profile.family_name,
              profilePicUrl: user.user.photoURL,
              email: user.user.email,
              uuid: user.user.uid,
            });
          }
        })
        .then(() => {
          dispatch({ type: "set_loading", payload: false });
        })
        .catch((err) => console.log(err));
    } catch (err) {
      console.log(err);
      dispatch({ type: "add_error", payload: "Something Went Wrong" });
    } finally {
      console.log("done");
    }
  };
};


const onFacebookButtonPress = (dispatch) => {
  return async () => {
    try {
      const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);
      if (result.isCancelled) {
        throw 'User cancelled the login process';
      }
      const data = await AccessToken.getCurrentAccessToken();
      if (!data) {
        throw 'Something went wrong obtaining access token';
      }
      const usersCollection = firestore().collection("user");
      // Create a Google credential with the token
      const facebookCredential = auth.FacebookAuthProvider.credential(data.accessToken);

      // Sign-in the user with the credential
      dispatch({ type: "set_loading", payload: true });
      await auth()
        .signInWithCredential(facebookCredential)
        .then((user) => {
          console.log(user);
          dispatch({ type: "set_authUser", payload: user.user });
          if (user.additionalUserInfo.isNewUser) {
            usersCollection.add({
              firstName: user.additionalUserInfo.profile.first_name,
              lastName: `${user.additionalUserInfo.profile.middle_name} ${user.additionalUserInfo.profile.last_name}`,
              profilePicUrl: user.user.photoURL,
              email: user.user.email,
              uuid: user.user.uid,
            });
         }
        })
        .then(() => {
          dispatch({ type: "set_loading", payload: false });
        })
        .catch((err) => console.log(err));
    } catch (err) {
      console.log(err);
      dispatch({ type: "add_error", payload: "Something Went Wrong" });
    } finally {
      console.log("done");
    }
  };
};

export const { Provider, Context } = createDataContext(
  authReducer,
  {
    getOtp,
    verifyOtp,
    onGoogleButtonPress,
    tryLocalSignIn,
    signInWithEmail,
    signUpWithEmail,
    cuurentAuthState,
    getUser,
    onFacebookButtonPress
  },
  {
    token: null,
    loading: false,
    errorMessage: "",
    user: null,
    authRes: null,
    id: "",
    authUser: null,
  }
);
