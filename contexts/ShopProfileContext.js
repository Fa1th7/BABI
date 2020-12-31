import createDataContext from "../createDataContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as RootNavigation from "../RootNavigation";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import storage from "@react-native-firebase/storage";

const shopProfileReducer = (state, actions) => {
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
    case "set_all_shops":
      return {
        ...state,
        allShops: actions.payload,
      };
    case "get_current_shop":
      return {
        ...state,
        currentShop: actions.payload,
      };
    default:
      return state;
  }
};

const getAllShops = (dispatch) => {
  return async ({ id }) => {
    try {
      var shops = [];
      const shopCollection = firestore()
        .collection("shops")
        .where("userId", "==", id);
      dispatch({ type: "set_loading", payload: true });
      shopCollection
        .get()
        .then(function (querySnapshot) {
          querySnapshot.forEach(function (doc) {
            shops.push({ ...doc.data(), shopId: doc.id });
          });
        })
        .then(() => {
          dispatch({ type: "set_all_shops", payload: shops });
          dispatch({ type: "set_loading", payload: false });
        });
    } catch (err) {
      console.log(err);
      dispatch({ type: "add_error", payload: "Something Went Wrong" });
    } finally {
      console.log("done");
    }
  };
};
const getSingleShop = (dispatch) => {
  return async ({ id }) => {
    try {
      const shopCollection = firestore().collection("shops").doc(id);
      dispatch({ type: "set_loading", payload: true });
      shopCollection
        .get()
        .then((doc) => {
          dispatch({
            type: "get_current_shop",
            payload: { ...doc.data(), shopId: id },
          });
          dispatch({ type: "set_loading", payload: false });
        })
        .then(() => RootNavigation.navigate("shopInfo"));
    } catch (err) {
      console.log(err);
      dispatch({ type: "add_error", payload: "Something Went Wrong" });
    } finally {
      console.log("done");
    }
  };
};



const profileUpdate = (dispatch) => {
  return async ({ profile, id, path }) => {
    try {
      const shopCollection = firestore().collection("shops").doc(id);
      dispatch({ type: "set_loading", payload: true });
      shopCollection
        .update({
          ...profile,
        })
        .then(() => console.log("updated"))
        .then(() => {
          if (path !== "") {
            const reference = storage().ref(`/ShopProfile/${id}`);
            const pathToFile = `${path}`;
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
                  shopCollection.update({
                    shopProfilePicUrl: downloadURL,
                  });
                });
              }
            );
            task
              .then(() => {
                console.log("Image uploaded to the bucket!");
                dispatch({ type: "set_loading", payload: false });
              })
              .catch((err) => {
                console.log("cr", err);
              });
          }
        });
    } catch (err) {
      console.log(err);
      dispatch({ type: "add_error", payload: "Something Went Wrong" });
    } finally {
      RootNavigation.navigate("allShop");
    }
  };
};
const profileCreate = (dispatch) => {
  return async ({ profile, id, path }) => {
    try {
      var newShopId = "";
      const shopCollection = firestore().collection("shops");
      dispatch({ type: "set_loading", payload: true });
      shopCollection
        .add({ ...profile, userId: id })
        .then((doc) => {
          newShopId = doc.id;
        })
        .then(() => {
          if (path !== "") {
            const reference = storage().ref(`/ShopProfile/${newShopId}`);
            const pathToFile = `${path}`;
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
                  shopCollection.doc(newShopId).update({
                    shopProfilePicUrl: downloadURL,
                  });
                });
              }
            );
            task
              .then(() => {
                console.log("Image uploaded to the bucket!");
                dispatch({ type: "set_loading", payload: false });

              })
              .catch((err) => {
                console.log("cr", err);
              });
          }
        });
    } catch (err) {
      console.log(err);
      dispatch({ type: "add_error", payload: "Something Went Wrong" });
    } finally {
      RootNavigation.navigate("allShop");
      
    }
  };
};
const profileDelete = (dispatch) => {
  return async ({ id }) => {
   
    try {
      const shopCollection = firestore().collection("shops").doc(id);
      dispatch({ type: "set_loading", payload: true });
      shopCollection
        .delete()
        .then(() => console.log("deleted"))
        .then(() => {
          const reference = storage().ref(`/ShopProfile/${id}`);
          reference
            .delete()
            .then(() => {
              console.log(`file deleted`);
              dispatch({ type: "set_loading", payload: false });
            })
            .catch((er) => {
              console.log(err);
            });
        });
    } catch (err) {
      console.log(err);
      dispatch({ type: "add_error", payload: "Something Went Wrong" });
    } finally {
      console.log('done')
    }
  };
};
const profileStatusUpdate = (dispatch) => {
  return async ({ id, status }) => {
    try {
      const shopCollection = firestore().collection("shops").doc(id);
      dispatch({ type: "set_loading", payload: true });
      shopCollection
        .update({
          status,
        })
        .then(() => {
          console.log("status updated");
          dispatch({ type: "set_loading", payload: false });
        });
    } catch (err) {
      console.log(err);
      dispatch({ type: "add_error", payload: "Something Went Wrong" });
    } finally {
      console.log("done again");
    }
  };
};

export const { Provider, Context } = createDataContext(
  shopProfileReducer,
  {
    profileUpdate,
    profileCreate,
    getAllShops,
    getSingleShop,
    profileDelete,
    profileStatusUpdate,
  },
  {
    errorMessage: "",
    loading: false,
    profile: null,
    profilePic: "",
    allShops: [],
    currentShop: null,
  }
);
