import React, { useContext, useEffect, useState } from "react";
import { View, StyleSheet, Image, Vibration } from "react-native";
import {
  Text,
  Overlay,
  Button,
  ThemeProvider,
  Input,
} from "react-native-elements";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import {
  responsiveHeight as rh,
  responsiveWidth as rw,
  responsiveFontSize as rf,
} from "react-native-responsive-dimensions";
import * as Animatable from "react-native-animatable";
import { SafeAreaView } from "react-native-safe-area-context";
import { Context as ProductContext } from "../../contexts/ProductContext";
import { Context as ShopProfileContext } from "../../contexts/ShopProfileContext";
import { Context as AuthContext } from "../../contexts/AuthContext";
import Theme from "../../utils/Theme";
import colors from "../../utils/colors";
import ImagePicker from "react-native-image-crop-picker";
import ToggleSwitch from "toggle-switch-react-native";
import QRCodeScanner from "react-native-qrcode-scanner";
import { RNCamera } from "react-native-camera";
import { DotIndicator } from "react-native-indicators";

const defaultImage =
  "https://firebasestorage.googleapis.com/v0/b/apka-dukan.appspot.com/o/ProductPic%2Fno-product-image.png?alt=media&token=1831caa9-1da8-48d6-87c2-d796a11c86bd";

const AddProduct = ({ route }) => {
  const { state: productState, productCreate, productUpdate } = useContext(
    ProductContext
  );
  const { state: shopProfileState } = useContext(ShopProfileContext);
  const { state: authState } = useContext(AuthContext);
  const [images, setImages] = useState({
    image1: defaultImage,
    image2: defaultImage,
    image3: defaultImage,
    image4: defaultImage,
  });
  const [noImage, setNoImage] = useState(true);
  const [visible1, setVisible1] = useState(false);
  const [visible2, setVisible2] = useState(false);
  const [visible3, setVisible3] = useState(false);
  const [visible4, setVisible4] = useState(false);
  const [discountState, setDiscountState] = useState(false);
  const [barcodeState, setBarcodeState] = useState(false);
  const [productName, setProductName] = useState("");
  const [productCatagory, setProductCatagory] = useState("");
  const [productDetails, setProductDetails] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productDiscount, setProductDiscount] = useState("");
  const [productStock, setProductStock] = useState("");
  const [productTags, setProductTags] = useState("");
  const [productQuantitiy, setProductQuantitiy] = useState("");
  const [barCode, setBarCode] = useState("");
  const [imageIndex1, setImageIndex1] =  useState(defaultImage)
  const [imageIndex2, setImageIndex2] =  useState(defaultImage)
  const [imageIndex3, setImageIndex3] =  useState(defaultImage)
  const [imageIndex4, setImageIndex4] =  useState(defaultImage)

  useEffect(() => {
    if (barCode) {
      Vibration.vibrate();
    }
  }, [barCode]);
  

  useEffect(() => {
    if (route.params && route.params.productData) {
      console.log(route.params.productData.imageIndex1);
      console.log(route.params.productData.imageIndex2);
      console.log(route.params.productData.imageIndex3);
      console.log(route.params.productData.imageIndex4);
      setProductName(route.params.productData.productName);
      setProductCatagory(route.params.productData.productCatagory);
      setProductDetails(route.params.productData.productDetails);
      setProductPrice(route.params.productData.productPrice.toString());
      setProductDiscount(route.params.productData.productDiscount);
      setProductTags(route.params.productData.productTags.join(","));
      setProductStock(route.params.productData.productStock.toString());
      setProductQuantitiy(route.params.productData.productQuantitiy)
      setBarCode(route.params.productData.barCode);
      if (route.params.productData.imageIndex1 !== '' && route.params.productData.imageIndex1 !== defaultImage ) {
        setImageIndex1(route.params.productData.imageIndex1)
        setImages({ ...images, image1: route.params.productData.imageIndex1 });
      }
      setImages({ ...images, image1: route.params.productData.imageIndex1 });
      if (route.params.productData.imageIndex2 !== '' && route.params.productData.imageIndex2 !== defaultImage ) {
        setImageIndex2(route.params.productData.imageIndex2)
        setImages({
          ...images,
          image2: route.params.productData.imageIndex2,
        });
      }
      if (route.params.productData.imageIndex3) {
        setImageIndex3(route.params.productData.imageIndex3)
        setImages({
          ...images,
          image3: route.params.productData.imageIndex3,
        });
      }
      if (route.params.productData.imageIndex4) {
        setImageIndex4(route.params.productData.imageIndex4)
        setImages({
          ...images,
          image4: route.params.productData.imageIndex4,
        });
      }
    }
  }, [route.params]);
  useEffect(() => {
    console.log(images);
    if (
      images.image1 !== defaultImage &&
      images.image2 !== defaultImage &&
      images.image3 !== defaultImage &&
      images.image4 !== defaultImage
    ) {
      setNoImage(false);
    }
  }, [images]);

  useEffect(() => {
    console.log('ii', imageIndex1)
    console.log('ii', imageIndex2)
    console.log('ii', imageIndex3)
    console.log('ii', imageIndex4)
    setImages({image1: imageIndex1, image2: imageIndex2, image3: imageIndex3, image4: imageIndex4})
  },[imageIndex1, imageIndex2, imageIndex3, imageIndex4])

  useEffect(() => {
    if (productDiscount) {
      setDiscountState(true);
    }
  }, [productDiscount]);

  const onSubmit = () => {
    const paths = [];
    if (route.params) {
      if (
        images.image1 !== defaultImage &&
        images.image1 !== route.params.productData.imageIndex1
      ) {
        paths.push({ imageIndex: 1, data: images.image1 });
      }
      if (
        images.image2 !== defaultImage &&
        images.image2 !== route.params.productData.imageIndex2
      ) {
        paths.push({ imageIndex: 2, data: images.image2 });
      }
      if (
        images.image3 !== defaultImage &&
        images.image3 !== route.params.productData.imageIndex3
      ) {
        paths.push({ imageIndex: 3, data: images.image3 });
      }
      if (
        images.image4 !== defaultImage &&
        images.image4 !== route.params.productData.imageIndex4
      ) {
        paths.push({ imageIndex: 4, data: images.image4 });
      }
    }
    if (!route.params) {
      if (images.image1 !== defaultImage) {
        paths.push({ imageIndex: 1, data: images.image1 });
      }
      if (images.image2 !== defaultImage) {
        paths.push({ imageIndex: 2, data: images.image2 });
      }
      if (images.image3 !== defaultImage) {
        paths.push({ imageIndex: 3, data: images.image3 });
      }
      if (images.image4 !== defaultImage) {
        paths.push({ imageIndex: 4, data: images.image4 });
      }
    }
    if (!route.params) {
      productCreate({
        shopId: shopProfileState.currentShop.shopId,
        userId: authState.id,
        paths: paths,
        productName: productName,
        productCatagory: productCatagory,
        productDetails: productDetails,
        productPrice: productPrice,
        productTags: productTags,
        productDiscount: productDiscount,
        barCode: barCode,
        productStock: productStock,
        productQuantitiy: productQuantitiy,
        noImage,
        productType: shopProfileState.currentShop.shopType
      });
    }
    if (route.params) {
      productUpdate({
        shopId: shopProfileState.currentShop.shopId,
        userId: authState.id,
        paths: paths,
        productName: productName,
        productCatagory: productCatagory,
        productDetails: productDetails,
        productPrice: productPrice,
        productTags: productTags,
        productDiscount: productDiscount,
        barCode: barCode,
        productStock: productStock,
        productQuantitiy: productQuantitiy,
        noImage,
        productId: route.params.productId,
        productType: shopProfileState.currentShop.shopType
      });
    }
  };

  const PicUpload1 = async ({ pickImage, openCam }) => {
    if (pickImage) {
      await ImagePicker.openPicker({
        compressImageQuality: 0.8,
        width: 300,
        height: 400,
        cropping: true,
      })
        .then((image) => {
          setVisible1(false);
          setImages({ ...images, image1: image.path });

          console.log(image);
        })
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
          setVisible1(false);
          setImages({ ...images, image1: image.path });

          console.log(image);
        })
        .catch((err) => console.log(err));
    }
  };
  const PicUpload2 = async ({ pickImage, openCam }) => {
    if (pickImage) {
      await ImagePicker.openPicker({
        compressImageQuality: 0.8,
        width: 300,
        height: 400,
        cropping: true,
      })
        .then((image) => {
          setVisible2(false);
          setImages({ ...images, image2: image.path });

          console.log(image);
        })
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
          setVisible2(false);
          setImages({ ...images, image2: image.path });

          console.log(image);
        })
        .catch((err) => console.log(err));
    }
  };

  const PicUpload3 = async ({ pickImage, openCam }) => {
    if (pickImage) {
      await ImagePicker.openPicker({
        compressImageQuality: 0.8,
        width: 300,
        height: 400,
        cropping: true,
      })
        .then((image) => {
          setVisible3(false);
          setImages({ ...images, image3: image.path });

          console.log(image);
        })
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
          setVisible3(false);
          setImages({ ...images, image3: image.path });

          console.log(image);
        })
        .catch((err) => console.log(err));
    }
  };

  const PicUpload4 = async ({ pickImage, openCam }) => {
    if (pickImage) {
      await ImagePicker.openPicker({
        compressImageQuality: 0.8,
        width: 300,
        height: 400,
        cropping: true,
      })
        .then((image) => {
          setVisible4(false);
          setImages({ ...images, image4: image.path });

          console.log(image);
        })
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
          setVisible4(false);
          setImages({ ...images, image4: image.path });

          console.log(image);
        })
        .catch((err) => console.log(err));
    }
  };
  const toggleOverlay1 = () => {
    setVisible1(!visible1);
  };
  const toggleOverlay2 = () => {
    setVisible2(!visible2);
  };
  const toggleOverlay3 = () => {
    setVisible3(!visible3);
  };
  const toggleOverlay4 = () => {
    setVisible4(!visible4);
  };
  if (productState.loading) {
    return <DotIndicator color={colors.primary} />;
  }

  else {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <ThemeProvider theme={Theme}>
          <Overlay isVisible={visible1} onBackdropPress={toggleOverlay1}>
            <View
              style={{
                width: rw(50),
                height: rh(25),
                alignItems: "center",
                alignSelf: "center",
                justifyContent: "center",
              }}
            >
              <Button
                onPress={() => PicUpload1({ openCam: true })}
                title={`Open Camera`}
              />
  
              <Button
                title={`Pick Image`}
                onPress={() => PicUpload1({ pickImage: true })}
              />
              {images.image1 !== defaultImage && (
                <Button
                  title={`Clear Image`}
                  onPress={() => {
                    setVisible1(false);
                    setImages({ ...images, image1: defaultImage });
                  }}
                />
              )}
            </View>
          </Overlay>
          <Overlay isVisible={visible2} onBackdropPress={toggleOverlay2}>
            <View
              style={{
                width: rw(50),
                height: rh(25),
                alignItems: "center",
                alignSelf: "center",
                justifyContent: "center",
              }}
            >
              <Button
                onPress={() => PicUpload2({ openCam: true })}
                title={`Open Camera`}
              />
  
              <Button
                title={`Pick Image`}
                onPress={() => PicUpload2({ pickImage: true })}
              />
              {images.image2 !== defaultImage && (
                <Button
                  title={`Clear Image`}
                  onPress={() => {
                    setVisible2(false);
                    setImages({ ...images, image2: defaultImage });
                  }}
                />
              )}
            </View>
          </Overlay>
          <Overlay isVisible={visible3} onBackdropPress={toggleOverlay3}>
            <View
              style={{
                width: rw(50),
                height: rh(25),
                alignItems: "center",
                alignSelf: "center",
                justifyContent: "center",
              }}
            >
              <Button
                onPress={() => PicUpload3({ openCam: true })}
                title={`Open Camera`}
              />
  
              <Button
                title={`Pick Image`}
                onPress={() => PicUpload3({ pickImage: true })}
              />
              {images.image3 !== defaultImage && (
                <Button
                  title={`Clear Image`}
                  onPress={() => {
                    setVisible3(false);
                    setImages({ ...images, image3: defaultImage });
                  }}
                />
              )}
            </View>
          </Overlay>
          <Overlay isVisible={visible4} onBackdropPress={toggleOverlay4}>
            <View
              style={{
                width: rw(50),
                height: rh(25),
                alignItems: "center",
                alignSelf: "center",
                justifyContent: "center",
              }}
            >
              <Button
                onPress={() => PicUpload4({ openCam: true })}
                title={`Open Camera`}
              />
  
              <Button
                title={`Pick Image`}
                onPress={() => PicUpload4({ pickImage: true })}
              />
              {images.image4 !== defaultImage && (
                <Button
                  title={`Clear Image`}
                  onPress={() => {
                    setVisible4(false);
                    setImages({ ...images, image4: defaultImage });
                  }}
                />
              )}
            </View>
          </Overlay>
          <View style={{ height: rh(21), margin: rh(1) }}>
            <ScrollView horizontal>
              <View>
                <TouchableOpacity
                  style={{ marginRight: rh(0.5) }}
                  onPress={() => setVisible1(true)}
                >
                  <Image
                    source={{
                      uri: images.image1,
                    }}
                    style={styles.productImage}
                  />
                </TouchableOpacity>
              </View>
              {images.image1 !== defaultImage && (
                <TouchableOpacity
                  onPress={() => setVisible2(true)}
                  style={{ marginRight: rh(0.5) }}
                >
                  <Image
                    source={{
                      uri: images.image2,
                    }}
                    style={styles.productImage}
                  />
                </TouchableOpacity>
              )}
              {images.image2 !== defaultImage && (
                <TouchableOpacity
                  onPress={() => setVisible3(true)}
                  style={{ marginRight: rh(0.5) }}
                >
                  <Image
                    source={{
                      uri: images.image3,
                    }}
                    style={styles.productImage}
                  />
                </TouchableOpacity>
              )}
              {images.image3 !== defaultImage && (
                <TouchableOpacity
                  onPress={() => setVisible4(true)}
                  style={{ marginRight: rh(0.5) }}
                >
                  <Image
                    source={{
                      uri: images.image4,
                    }}
                    style={styles.productImage}
                  />
                </TouchableOpacity>
              )}
            </ScrollView>
          </View>
          <ScrollView>
            <Input
              label="Product Name"
              placeholder="Eg: X brand shoe"
              value={productName}
              onChangeText={(text) => setProductName(text)}
            />
            <Input
              label="Product Catagory"
              placeholder="Eg: Shoe, Book etc"
              value={productCatagory}
              onChangeText={(text) => setProductCatagory(text)}
            />
            <Input
              label="Product Details"
              placeholder="Eg: Size, Color "
              value={productDetails}
              onChangeText={(text) => setProductDetails(text)}
            />
            <Input
              label="Product Price"
              keyboardType="number-pad"
              placeholder="Eg: ₹700 (Just the number)"
              value={productPrice}
              onChangeText={(text) => setProductPrice(text)}
            />
            <Input
              label="Quantity"
              placeholder="Eg: 1kg, 1 piece"
              value={productQuantitiy}
              onChangeText={(text) => setProductQuantitiy(text)}
            />
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: rh(2),
              }}
            >
              <Text
                style={{
                  color: colors.grey,
                  marginLeft: 20,
                  marginRight: 20,
                  marginBottom: 1,
                  fontWeight: "bold",
                  fontSize: rf(2.5),
                }}
              >
                Add discount
              </Text>
              <ToggleSwitch
                isOn={discountState}
                onColor={colors.primary}
                offColor={colors.grey}
                onToggle={(isOn) => {
                  setDiscountState(isOn);
                  if (!isOn) {
                    setProductDiscount("");
                  }
                }}
              />
            </View>
            {discountState && (
              <Animatable.View useNativeDriver={true} animation="bounceIn">
                <Input
                  label="Product discount"
                  keyboardType="number-pad"
                  placeholder="Your selling discounted price"
                  value={productDiscount}
                  onChangeText={(text) => setProductDiscount(text)}
                />
              </Animatable.View>
            )}
  
            <Input
              label="Product Tags"
              placeholder="Eg: shoe, footwear, x brand"
              value={productTags}
              onChangeText={(text) => setProductTags(text)}
            />
            <Input
              label="Stock number"
              placeholder="Eg:4 (Just write the number)"
              keyboardType="number-pad"
              value={productStock}
              onChangeText={(text) => setProductStock(text)}
            />
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: rh(2),
              }}
            >
              <Text
                style={{
                  color: colors.grey,
                  marginLeft: 20,
                  marginRight: 20,
                  marginBottom: 1,
                  fontWeight: "bold",
                  fontSize: rf(2.5),
                }}
              >
                Open Barcode Scanner
              </Text>
              <ToggleSwitch
                isOn={barcodeState}
                onColor={colors.primary}
                offColor={colors.grey}
                onToggle={(isOn) => setBarcodeState(isOn)}
              />
            </View>
            <Input
              label="Barcode/QrCode"
              placeholder="Eg:for failed scan type the barcode"
              keyboardType="number-pad"
              value={barCode}
              onChangeText={(text) => setBarCode(text)}
            />
            {barcodeState && (
              <Animatable.View useNativeDriver={true} animation="bounceIn">
                <QRCodeScanner
                  cameraProps={{
                    onBarCodeRead: (eg) => {
                      if (eg.data) {
                        setBarCode(eg.data);
                        setBarcodeState(false);
                      }
                    },
                    autoFocus: "on",
                  }}
                  cameraStyle={{ height: rh(80) }}
                  fadeIn={true}
                  onRead={(e) => {
                    setBarCode(e.data);
                    setBarcodeState(false);
                  }}
                  flashMode={RNCamera.Constants.FlashMode.auto}
                  topContent={
                    <Text style={styles.centerText}>
                      Scan your prduct Barcode or QR code to use stock feature
                    </Text>
                  }
                  bottomContent={
                    <TouchableOpacity
                      onPress={() => setBarcodeState(false)}
                      style={styles.buttonTouchable}
                    >
                      <Text style={styles.buttonText}>Done</Text>
                    </TouchableOpacity>
                  }
                />
              </Animatable.View>
            )}
  
            <Text
              style={{ marginHorizontal: rw(4) }}
            >{`(Please provide valid tags for search needs)`}</Text>
            <Button
              onPress={onSubmit}
              title="Submit"
              containerStyle={{ marginBottom: rh(2) }}
            />
          </ScrollView>
        </ThemeProvider>
      </SafeAreaView>
    );
  
  }
 };

const styles = StyleSheet.create({
  productImage: {
    height: rh(20),
    width: rw(30),
    borderWidth: rh(0.2),
    borderColor: colors.accent,
  },
  centerText: {
    flex: 1,
    fontSize: 18,
    padding: 32,
    color: "#777",
  },
  textBold: {
    fontWeight: "500",
    color: "#000",
  },
  buttonText: {
    fontSize: 21,
    color: "rgb(0,122,255)",
  },
  buttonTouchable: {
    padding: 16,
  },
});
export default AddProduct;
