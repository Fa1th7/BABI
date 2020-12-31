import createDataContext from "../createDataContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as RootNavigation from "../RootNavigation";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import storage from "@react-native-firebase/storage";

const profileReducer = (state, actions) => {
  switch (actions.type) {
    case "add_error":
      return { ...state, errorMessage: actions.payload };
    case "set_profile_data":
      return {
        ...state,
        profile: actions.payload,
      };
    case "clear_error_message":
      return { ...state, errorMessage: "" };
    case "set_dp":
      return { ...state, profilePic: actions.payload };
    case "set_loading":
      return {
        ...state,
        loading: actions.payload,
      };
    default:
      return state;
  }
};

const getProfileData = (dispatch) => {
  return async ({ id }) => {
    try {
      const usersCollection = firestore().collection("user").doc(id);
      dispatch({ type: "set_loading", payload: true });
      if (id) {
        usersCollection
          .get()
          .then(function (doc) {
            if (doc.exists) {
              dispatch({ type: "set_profile_data", payload: doc.data() });
            } else {
              // doc.data() will be undefined in this case
              console.log("No such document!");
            }
          })
          .then(() => {
            dispatch({ type: "set_loading", payload: false });
          });
      }
    } catch (err) {
      console.log(err);
      dispatch({ type: "add_error", payload: "Something Went Wrong" });
    } finally {
      console.log("profile fetched");
    }
  };
};
const profilePicUpload = (dispatch) => {
  return async ({ id, path }) => {
    dispatch({ type: "set_loading", payload: true });
    try {
      const usersCollection = firestore().collection("user").doc(id);
      const reference = storage().ref(`/ProfilePic/${id}`);
      const pathToFile = `${path}`;
      console.log(pathToFile);
      const task = reference.putFile(pathToFile);
      task.on(
        "state_changed",
        (taskSnapshot) => {
          console.log(
            `${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`
          );
        },
        function (err) {
          console.log(err);
        },
        function () {
          task.snapshot.ref.getDownloadURL().then(function (downloadURL) {
            usersCollection.update({
              profilePicUrl: downloadURL,
            });
          });
        }
      );
      task.then(() => {
        console.log("Image uploaded to the bucket!");
      });
    } catch (err) {
      console.log(err);
      dispatch({ type: "add_error", payload: "Something Went Wrong" });
    } finally {
      dispatch({ type: "set_loading", payload: false });
    }
  };
};

const profileUpdate = (dispatch) => {
  return async ({ profile, id }) => {
    dispatch({ type: "set_loading", payload: true });
    try {
      const usersCollection = firestore().collection("user").doc(id);
      usersCollection
        .update({
          ...profile,
        })
        .then(() => console.log("updated"));
    } catch (err) {
      console.log(err);
      dispatch({ type: "add_error", payload: "Something Went Wrong" });
    } finally {
      dispatch({ type: "set_loading", payload: false });
    }
  };
};
const getProfilePic = (dispatch) => {
  return async ({ id }) => {
    dispatch({ type: "set_loading", payload: true });
    try {
      console.log(id);
      const url = await storage().ref(`/ProfilePic/${id}`).getDownloadURL();
      dispatch({ type: "set_dp", payload: url });
    } catch (err) {
      console.log(err);
      dispatch({ type: "add_error", payload: "Something Went Wrong" });
    } finally {
      dispatch({ type: "set_loading", payload: false });
    }
  };
};

export const { Provider, Context } = createDataContext(
  profileReducer,
  { getProfileData, profileUpdate, profilePicUpload, getProfilePic },
  { errorMessage: "", loading: false, profile: null, profilePic: "" }
);
