import createDataContext from "../createDataContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as RootNavigation from "../RootNavigation";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import storage from "@react-native-firebase/storage";

const productReducer = (state, actions) => {
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
    case "set_all_products":
      return {
        ...state,
        allProducts: actions.payload,
      };
    case "get_current_product":
      return {
        ...state,
        currentProduct: actions.payload.currentProduct,
        currentProductId: actions.payload.productId,
        currentProductPics: actions.payload.currentProductPics,
      };
    default:
      return state;
  }
};

const getAllProdutcs = (dispatch) => {
  return async ({ id }) => {
    try {
      var products = [];
      const productCollection = firestore()
        .collection("products")
        .where("shopId", "==", id);
      dispatch({ type: "set_loading", payload: true });
      productCollection
        .get()
        .then(function (querySnapshot) {
          querySnapshot.forEach(function (doc) {
            products.push({ ...doc.data(), productId: doc.id });
          });
        })
        .then(() => {
          dispatch({ type: "set_all_products", payload: products });
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
const getSingleProduct = (dispatch) => {
  return async ({ id }) => {
    try {
      const images = [];
      var data = null;
      const productCollection = firestore().collection("products").doc(id);
      dispatch({ type: "set_loading", payload: true });
      productCollection
        .get()
        .then(function (doc) {
          if (doc.exists) {
            data = doc.data();
            if (data.imageIndex1) {
              images.push(data.imageIndex1);
            }
            if (data.imageIndex2) {
              images.push(data.imageIndex2);
            }
            if (data.imageIndex3) {
              images.push(data.imageIndex3);
            }
            if (data.imageIndex4) {
              images.push(data.imageIndex4);
            }
          }
        })
        .then(() => {
          if (data) {
            dispatch({
              type: "get_current_product",
              payload: {
                productId: id,
                currentProduct: data,
                currentProductPics: images,
              },
            });
            dispatch({ type: "set_loading", payload: false });
          }
        })
        .finally(() => RootNavigation.navigate("productInfo"));
    } catch (err) {
      console.log(err);
      dispatch({ type: "add_error", payload: "Something Went Wrong" });
    } finally {
      console.log("done");
    }
  };
};

const productCreate = (dispatch) => {
  return async ({
    shopId,
    userId,
    paths,
    productName,
    productCatagory,
    productDetails,
    productPrice,
    productTags,
    productDiscount,
    barCode,
    productStock,
    productQuantitiy,
    noImage,
    productType
  }) => {
    try {
      console.log(paths);
      const tags = productTags.split(",");
      var newProductId = "";
      const productCollection = firestore().collection("products");
      dispatch({ type: "set_loading", payload: true });
      productCollection
        .add({
          shopId,
          userId,
          productName,
          productCatagory,
          productDetails,
          productPrice: parseInt(productPrice),
          productTags: tags,
          productDiscount,
          productQuantitiy,
          barCode,
          productStock,
          imageIndex1: "",
          imageIndex2: "",
          imageIndex3: "",
          imageIndex4: "",
          productType
        })
        .then((doc) => {
          newProductId = doc.id;
        })
        .then(() => {
          if (paths.length > 0) {
            paths.map((item) => {
              const reference = storage().ref(
                `/ProductPic/${newProductId}-${item.imageIndex}`
              );
              const pathToFile = `${item.data}`;
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
                  task.snapshot.ref
                    .getDownloadURL()
                    .then(function (downloadURL) {
                      firestore()
                        .collection("products")
                        .doc(newProductId)
                        .update({
                          [`imageIndex${item.imageIndex}`]: downloadURL,
                        })
                        .then(() => console.log("url updated"));
                      console.log(downloadURL);
                    });
                }
              );
              task
                .then(() => {
                  console.log("Image uploaded to the bucket!");
                })
                .catch((err) => {
                  console.log("cr", err);
                });
            });
          }
          if (paths.length === 0 && noImage) {
            firestore()
              .collection("products")
              .doc(newProductId)
              .update({
                imageIndex1:
                  "https://firebasestorage.googleapis.com/v0/b/apka-dukan.appspot.com/o/ProductPic%2Fno-product-image.png?alt=media&token=1831caa9-1da8-48d6-87c2-d796a11c86bd",
              })
              .catch((err) => {
                console.log(err);
              });
          }
        })
        .then(() => {
          var products = [];
          const productCollectionTemp = firestore()
            .collection("products")
            .where("shopId", "==", shopId);
          productCollectionTemp
            .get()
            .then(function (querySnapshot) {
              querySnapshot.forEach(function (doc) {
                products.push({ ...doc.data(), productId: doc.id });
              });
            })
            .then(() => {
              dispatch({ type: "set_all_products", payload: products });
              dispatch({ type: "set_loading", payload: false });
            });
        })
        .finally(() => {
          RootNavigation.navigate("shopInfo", { ind: 1 });
        });
    } catch (err) {
      console.log(err);
      dispatch({ type: "add_error", payload: "Something Went Wrong" });
    } finally {
      console.log("Product Created");
    }
  };
};
const productDelete = (dispatch) => {
  return async ({ id }) => {
    try {
      const productCollection = firestore().collection("products").doc(id);
      dispatch({ type: "set_loading", payload: true });
      productCollection
        .get()
        .then(function (doc) {
          if (doc.exists) {
            const data = doc.data();
            if (data.imageIndex1 !== "") {
              const reference = storage().ref(`/ProductPic/${id}-1`);
              reference
                .delete()
                .then(() => {
                  console.log(`file deleted`);
                })
                .catch((er) => {
                  console.log(err);
                });
            }
            if (data.imageIndex2 !== "") {
              const reference = storage().ref(`/ProductPic/${id}-2`);
              reference
                .delete()
                .then(() => {
                  console.log(`file deleted`);
                })
                .catch((er) => {
                  console.log(err);
                });
            }
            if (data.imageIndex3 !== "") {
              const reference = storage().ref(`/ProductPic/${id}-3`);
              reference
                .delete()
                .then(() => {
                  console.log(`file deleted`);
                })
                .catch((er) => {
                  console.log(err);
                });
            }
            if (data.imageIndex4 !== "") {
              const reference = storage().ref(`/ProductPic/${id}-4`);
              reference
                .delete()
                .then(() => {
                  console.log(`file deleted`);
                })
                .catch((er) => {
                  console.log(err);
                });
            }
          }
        })
        .then(() => {
          productCollection
            .delete()
            .then(() => {
              console.log("deleted db");
              dispatch({ type: "set_loading", payload: false });
            })
            .catch((er) => console.log(er));
        });
    } catch (err) {
      console.log(err);
      dispatch({ type: "add_error", payload: "Something Went Wrong" });
    } finally {
      RootNavigation.navigate("shopInfo", { ind: 1 });
    }
  };
};

const productUpdate = (dispatch) => {
  return async ({
    shopId,
    userId,
    paths,
    productName,
    productCatagory,
    productDetails,
    productPrice,
    productTags,
    productDiscount,
    barCode,
    productStock,
    productId,
    productQuantitiy,
    noImage,
    productType
  }) => {
    try {
      const tags = productTags.split(",");
      const productCollection = firestore()
        .collection("products")
        .doc(productId);
        dispatch({ type: "set_loading", payload: true });
      productCollection
        .update({
          shopId,
          userId,
          productName,
          productCatagory,
          productDetails,
          productPrice: parseInt(productPrice),
          productTags: tags,
          productDiscount,
          productQuantitiy,
          barCode,
          productStock,
          productType
        })
        .then(() => {
          if (paths.length > 0) {
            paths.map((item) => {
              const reference = storage().ref(
                `/ProductPic/${productId}-${item.imageIndex}`
              );
              const pathToFile = `${item.data}`;
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
                  task.snapshot.ref
                    .getDownloadURL()
                    .then(function (downloadURL) {
                      firestore()
                        .collection("products")
                        .doc(productId)
                        .update({
                          [`imageIndex${item.imageIndex}`]: downloadURL,
                        })
                        .then(() => console.log("url updated"));
                      console.log(downloadURL);
                    });
                }
              );
              task
                .then(() => {
                  console.log("Image uploaded to the bucket!");
                })
                .catch((err) => {
                  console.log("cr", err);
                });
            });
          }
          if (paths.length === 0 && noImage) {
            firestore().collection("products").doc(productId).update({
              imageIndex1:
                "https://firebasestorage.googleapis.com/v0/b/apka-dukan.appspot.com/o/ProductPic%2Fno-product-image.png?alt=media&token=1831caa9-1da8-48d6-87c2-d796a11c86bd",
            });
          }
        })
        .then(() => {
          var products = [];
          const productCollectionTemp = firestore()
            .collection("products")
            .where("shopId", "==", shopId);
          productCollectionTemp
            .get()
            .then(function (querySnapshot) {
              querySnapshot.forEach(function (doc) {
                products.push({ ...doc.data(), productId: doc.id });
              });
            })
            .then(() => {
              dispatch({ type: "set_all_products", payload: products });
              dispatch({ type: "set_loading", payload: false });
            });
        })
        .finally(() => {
          RootNavigation.navigate("shopInfo", { ind: 1 });
          
        });
    } catch (err) {
      console.log(err);
      dispatch({ type: "add_error", payload: "Something Went Wrong" });
    } finally {
      console.log("done")
    }
  };
};
export const { Provider, Context } = createDataContext(
  productReducer,
  {
    productUpdate,
    productCreate,
    getAllProdutcs,
    getSingleProduct,
    productDelete,
  },
  {
    errorMessage: "",
    loading: false,
    currentProduct: null,
    currentProductId: "",
    productPic: "",
    allProducts: [],
    currentProductPics: [],
  }
);
