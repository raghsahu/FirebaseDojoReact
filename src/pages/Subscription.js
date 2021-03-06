import React, { useState, useEffect, useContext } from "react";
import {
  View,
  StatusBar,
  SafeAreaView,
  ActivityIndicator,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  Platform,
} from "react-native";

//Components
import { Header, ProgressView, Text } from "../components";

//Context
import { APPContext } from "../context/AppProvider";
import { AnalyticsContext } from "../context/AnalyticsProvider";
import { LocalizatiionContext } from "../context/LocalizatiionProvider";

//IMAGES & COLORS
import { IMAGES, COLORS } from "../../assets";

//PACKAGES
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";
import * as RNIap from "react-native-iap";
import moment from "moment";
import { CommonActions } from "@react-navigation/native";
import Toast from "react-native-simple-toast";

export default function Subscription({ navigation }) {
  const user = auth().currentUser;

  const { getExchangeCurrency } = useContext(APPContext);
  const { getTranslation } = useContext(LocalizatiionContext);
  const {
    mixPanelOnSubscribe,
    mixPanelOnClickPurchaseMonthly,
    mixPanelOnClickPurchaseSixMonth,
    mixPanelOnClickPurchaseYearly,
    mixPanelOnSubscriptionCompleteMonth,
    mixPanelOnSubscriptionCompleteSixMonth,
    mixPanelOnSubscriptionCompleteYearly,
  } = useContext(AnalyticsContext);

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLoading, setLoading] = useState(true);
  const [isSubscriptionLoading, setSubscriptionLoading] = useState(false);
  const [isAlert, setAlert] = useState(false);
  const [exchangeData, setExchangeData] = useState({});
  const [isError, setIsError] = useState(false)

  //if global language english show $ price otherwise indonesian currency price Rp
  const monthlyCharge = 4.99;
  const SixMonthCharge = 17.99;
  const YearlyCharge = 28.29;

  useEffect(async () => {
    // monthly- 4.99 SGD, half-yearly- 17.99 sgd, yearly- 28.29 sgd
    const result = await getExchangeCurrency();
    setLoading(false);
    if (result.status == true) {
      //console.log('result-data '+ result.data.USD)
      if (result.data) {
        //get currency response for 1 sgd
        setExchangeData(result.data);
      } else {
        setExchangeData({});
      }
    } else {
      Toast.show(result.error);
    }
    return () => { };
  }, []);

  var purchaseUpdatedListener = null
  var purchaseErrorSubscription = null

  useEffect(() => {
    addListner()
    return () => {
      purchaseUpdatedListener?.remove();
      purchaseUpdatedListener = null;
      purchaseErrorSubscription?.remove();
      purchaseErrorSubscription = null;
      RNIap.endConnection();
    };
  }, []);

  async function addListner() {
    mixPanelOnSubscribe({ email: user.email });
    await RNIap.initConnection();

    purchaseUpdatedListener?.remove()
    purchaseUpdatedListener = RNIap.purchaseUpdatedListener((purchase) => {
      if (Platform.OS == "ios") {
        vaidateReceiptIOS(purchase);
      } else if (Platform.OS == "android") {
        validateReceiptANDROID(purchase);
      }
    });

    purchaseErrorSubscription?.remove()
    purchaseErrorSubscription = RNIap.purchaseErrorListener((error) => {
      setSubscriptionLoading(false);
      if (error.code != "E_USER_CANCELLED") {
        Alert.alert("", error.message, [
          {
            text: getTranslation("ok"),
            onPress: () => { },
          },
        ]);
      }
    });

  }

  const getPrice = (price) => {
    let temp = price.toFixed(2);
    return temp;
  };

  const vaidateReceiptIOS = async (purchase) => {
    const receiptBody = {
      "receipt-data": purchase.transactionReceipt,
      password: "9cc4938aab924c12abd96c33bcac0704",
    };

    const result = await RNIap.validateReceiptIos(receiptBody, false);
    if (result.status == 0 || result.status == 1) {
      var date = "";
      if (purchase.productId == "dojo_monthly_subscription") {
        date = moment().add(31, "days").format("YYYY-MM-DD");
      } else if (purchase.productId == "dojo_six_month_subscription") {
        date = moment().add(180, "days").format("YYYY-MM-DD");
      } else {
        date = moment().add(1, "years").format("YYYY-MM-DD");
      }

      firestore()
        .collection("subscriber")
        .doc(user.email)
        .set({
          productId: purchase.productId,
          transactionDate: purchase.transactionDate,
          transactionId: purchase.transactionId,
          transactionReceipt: purchase.transactionReceipt,
          expiryDate: date,
          email: user.email,
          device: Platform.OS,
        })
        .then(async () => {
          await RNIap.finishTransaction(purchase, true);
          setSubscriptionLoading(false);
          if (isAlert == false) {
            setAlert(true);
            if (purchase.productId == "dojo_monthly_subscription") {
              mixPanelOnSubscriptionCompleteMonth(purchase);
            } else if (purchase.productId == "dojo_six_month_subscription") {
              mixPanelOnSubscriptionCompleteSixMonth(purchase);
            } else {
              mixPanelOnSubscriptionCompleteYearly(purchase);
            }
          }
        })
        .catch((error) => {
          setSubscriptionLoading(false);
          Toast.show(error.message);
        });
    } else {
      await RNIap.finishTransaction(purchase, true)
      setSubscriptionLoading(false);
      console.log(result, isError)
      if (result.status == '21007' && isError == false) {
        setIsError(true)
      }
    }
  };

  const validateReceiptANDROID = async (purchase) => {
    if (
      purchase.purchaseStateAndroid === 1 &&
      !purchase.isAcknowledgedAndroid
    ) {
      try {
        var date = "";
        if (purchase.productId == "dojo_monthly_subscription") {
          date = moment().add(31, "days").format("YYYY-MM-DD");
        } else if (purchase.productId == "dojo_six_month_subscription") {
          date = moment().add(180, "days").format("YYYY-MM-DD");
        } else {
          date = moment().add(1, "years").format("YYYY-MM-DD");
        }

        firestore()
          .collection("subscriber")
          .doc(user.email)
          .set({
            productId: purchase.productId,
            transactionDate: purchase.transactionDate,
            transactionId: purchase.transactionId,
            purchaseToken: purchase.purchaseToken,
            expiryDate: date,
            email: user.email,
            device: Platform.OS,
          })
          .then(async () => {
            await RNIap.finishTransaction(purchase, true);
            setSubscriptionLoading(false);
            if (isAlert == false) {
              setAlert(true);
              if (purchase.productId == "dojo_monthly_subscription") {
                mixPanelOnSubscriptionCompleteMonth(purchase);
              } else if (purchase.productId == "dojo_six_month_subscription") {
                mixPanelOnSubscriptionCompleteSixMonth(purchase);
              } else {
                mixPanelOnSubscriptionCompleteYearly(purchase);
              }
            }
          })
          .catch((error) => {
            setSubscriptionLoading(false);
            Alert.alert("", error.message, [
              {
                text: getTranslation("ok"),
                onPress: () => { },
              },
            ]);
          });
      } catch (ackErr) {
        setSubscriptionLoading(false);
        console.log("ackErr", ackErr);
      }
    }
  };

  useEffect(() => {
    if (isError == true) {
      Alert.alert("", "Sandbox receipt used in production", [{
        text: getTranslation("ok"),
        onPress: () => {
          setIsError(false)
        },
      }]);
    }
  }, [isError])

  useEffect(() => {
    if (isAlert == true) {
      Alert.alert(
        getTranslation("thank_you"),
        getTranslation("your_purchase_was_successful"),
        [
          {
            text: getTranslation("ok"),
            onPress: () => {
              navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [{ name: "Splash" }],
                })
              );
            },
          },
        ]
      );
    }
  }, [isAlert]);

  const requestPurchase = async (sku) => {
    try {
      // mixPanelOnClickPurchaseMonthly({
      //     "email": user.email,
      //     "id": sku
      // })

      setSubscriptionLoading(true);
      await RNIap.getProducts([sku]);
      RNIap.requestPurchase(sku, false);
    } catch (error) {
      setSubscriptionLoading(false);
      setTimeout(() => {
        Toast.show(error.message);
        console.warn(error.code, error.message);
      }, 100);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={"dark-content"} backgroundColor={COLORS.white} />
      <Header
        onBack={() => {
          navigation.goBack();
        }}
      />
      {isLoading ? (
        <View style={{ height: 100, justifyContent: "center" }}>
          <ActivityIndicator
            style={{ alignSelf: "center" }}
            animating={true}
            color={COLORS.orange}
          />
        </View>
      ) : (
        <View style={styles.container}>
          <Image
            style={{ alignSelf: "center", width: "90%" }}
            source={IMAGES.subscription_logo}
            resizeMode="contain"
          />
          <Text
            extraStyle={{ alignSelf: "center" }}
            size={"22"}
            weight="600"
            align="center"
            color={COLORS.darkGray}
          >
            {getTranslation("choose_your_plan")}
          </Text>
          <View style={styles.priceContainer}>
            <TouchableOpacity
              style={[
                selectedIndex == 0 ? styles.priceSelected : styles.priceView,
                { marginRight: 8 },
              ]}
              onPress={() => {
                setSelectedIndex(0);
              }}
            >
              <Text
                extraStyle={{ alignSelf: "center" }}
                size={"14"}
                weight="600"
                align="center"
                color={COLORS.darkGray}
              >
                {global.language == "en"
                  ? "$ " + getPrice(exchangeData.USD * monthlyCharge)
                  : "Rp 49 000"}
              </Text>
              <Text
                extraStyle={{ alignSelf: "center", marginTop: 5 }}
                size={"13"}
                weight="400"
                align="center"
                color={COLORS.darkGray}
              >
                {getTranslation("monthly_subscription")}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                selectedIndex == 1 ? styles.priceSelected : styles.priceView,
              ]}
              onPress={() => {
                setSelectedIndex(1);
              }}
            >
              <Text
                extraStyle={{ alignSelf: "center" }}
                size={"14"}
                weight="600"
                align="center"
                color={COLORS.darkGray}
              >
                {/* {global.language == "en"
                  ? "$ 29.99"
                  : Platform.OS == "ios"
                  ? "Rp 199 000"
                  : "Rp 189 000"} */}

                {global.language == "en"
                  ? "$ " + getPrice(exchangeData.USD * SixMonthCharge)
                  : Platform.OS == "ios"
                    ? "Rp 199 000"
                    : "Rp 189 000"}
              </Text>
              <Text
                extraStyle={{ alignSelf: "center", marginTop: 5 }}
                size={"13"}
                weight="400"
                align="center"
                color={COLORS.darkGray}
              >
                {getTranslation("Monthly Subscription")}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                selectedIndex == 2 ? styles.priceSelected : styles.priceView,
                { marginLeft: 8 },
              ]}
              onPress={() => {
                setSelectedIndex(2);
              }}
            >
              <Text
                extraStyle={{ alignSelf: "center" }}
                size={"14"}
                weight="600"
                align="center"
                color={COLORS.darkGray}
              >
                {global.language == "en"
                  ? "$ " + getPrice(exchangeData.USD * YearlyCharge)
                  : "Rp 299 000"}
              </Text>
              <Text
                extraStyle={{ alignSelf: "center", marginTop: 5 }}
                size={"13"}
                weight="400"
                align="center"
                color={COLORS.darkGray}
              >
                {getTranslation("annual_subscription")}
              </Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.subscribeButton}
            onPress={() => {
              if (selectedIndex == 0) {
                requestPurchase("dojo_monthly_subscription");
                mixPanelOnClickPurchaseMonthly({
                  email: user.email,
                  id: "dojo_monthly_subscription",
                });
              } else if (selectedIndex == 1) {
                requestPurchase("dojo_six_month_subscription");
                mixPanelOnClickPurchaseSixMonth({
                  email: user.email,
                  id: "dojo_six_month_subscription",
                });
              } else if (selectedIndex == 2) {
                requestPurchase("dojo_yearly_subscription");
                mixPanelOnClickPurchaseYearly({
                  email: user.email,
                  id: "dojo_yearly_subscription",
                });
              }
            }}
          >
            <Text
              extraStyle={{ alignSelf: "center" }}
              size="17"
              weight="600"
              align="center"
              color={COLORS.white}
            >
              {getTranslation("continue")}
            </Text>
          </TouchableOpacity>
        </View>
      )}
      {isSubscriptionLoading && <ProgressView />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  priceContainer: {
    flexDirection: "row",
    marginHorizontal: 10,
    justifyContent: "space-around",
    marginVertical: 20,
  },
  priceView: {
    flex: 1.0,
    aspectRatio: 1,
    borderColor: COLORS.orange,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 3,
    shadowOpacity: 0.1,
    elevation: 3,
    padding: 3,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  priceSelected: {
    flex: 1.0,
    aspectRatio: 1,
    borderColor: COLORS.orange,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 3,
    shadowOpacity: 0.1,
    elevation: 3,
    padding: 3,
    backgroundColor: "#fff",
    justifyContent: "center",
    borderWidth: 1,
  },
  subscribeButton: {
    width: "80%",
    height: 44,
    alignSelf: "center",
    borderRadius: 10,
    backgroundColor: COLORS.orange,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
  },
  subscribeModalButton: {
    width: "85%",
    height: 44,
    alignSelf: "center",
    borderRadius: 10,
    backgroundColor: COLORS.orange,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
});
