import React, { createContext, useState, useEffect } from "react";

//PACKAGES
import axios from "axios";
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";
import moment from "moment";

export const APPContext = createContext();

export const APPProvider = (props) => {
  const user = auth().currentUser;

  const [userSubscriptionDetails, setUserSubscriptionDetails] = useState(null);
  const [isSubscribe, setSubscribe] = useState(false);
  const [RemainingDays, setReamainingDays] = useState(0);

  const currencyExchangeURL =
    "https://freecurrencyapi.net/api/v2/latest?apikey=e1ba3000-9b9f-11ec-a4b1-e7b728f84ead&base_currency=SGD";

  useEffect(() => {
    checkSubscribtion();
  }, [userSubscriptionDetails]);

  const getSubscriptionDetails = async (callback) => {
    firestore()
      .collection("subscriber")
      .doc(user.email)
      .get()
      .then((documentSnapshot) => {
        if (documentSnapshot.exists) {
          let item = documentSnapshot.data();
          setUserSubscriptionDetails(item);
          callback(true);
        } else {
          setSubscribe(false);
          callback(true);
        }
      })
      .catch((e) => {
        setSubscribe(false);
        callback(true);
      });
  };

  async function checkSubscribtion() {
    if (userSubscriptionDetails) {
      let expiry = userSubscriptionDetails.expiryDate;
      let date = moment(expiry, "YYYY-MM-DD");
      let today = moment();
      if (date.isAfter(today)) {
        let days = date.diff(today, "days");
        if (days < 0) {
          updatePaid(false);
          setSubscribe(false);
        } else if (days == 0) {
          updatePaid(true);
          setSubscribe(true);
          setReamainingDays("1");
        } else {
          updatePaid(true);
          setSubscribe(true);
          setReamainingDays(days);
        }
      } else {
        updatePaid(false);
        setSubscribe(false);
      }
    }
  }

  updatePaid = (isPaid) => {
    firestore()
      .collection("users")
      .doc(user.email)
      .update({
        isPaid: isPaid,
        language: global.language,
      })
      .then(() => {})
      .catch((error) => {
        console.log(error);
      });
  };

  const getExchangeCurrency = async () => {
    return await request(currencyExchangeURL, "get", {});
  };

  const request = async (url, method, params) => {
    try {
      //     console.log("===================")
      //     console.log("URL: ", url)
      //     console.log("METHOD: ", method)
      //     console.log("PARAMS: ", params)
      //    // console.log('Authorization', (user ? `Bearer ${user.access_token}` : ''))
      //     console.log("===================")

      if (method == "get") {
        const response = await axios.get(url, {
          params: params,
          // headers: {
          //     'Authorization': user ? `Bearer ${user.access_token}` : ''
          // },
        });

        return getResponse(response);
      }
    } catch (e) {
      console.log(e);
      return getError(e);
    }
  };

  const getResponse = (response) => {
    console.log(JSON.stringify(response.data));

    if (response.data && response.data.data) {
      let result = {
        status: true,
        data: response.data.data,
        error: "Data fetch successfully",
      };
      return result;
    } else {
      let result = {
        status: false,
        data: "",
        error: "Something went wrong!",
      };
      return result;
    }
  };

  const getError = (error) => {
    console.log("ERRO========>", JSON.stringify(error));
    var message = "";

    let data = {
      status: false,
      result: null,
      error: message,
    };
    return data;
  };

  return (
    <APPContext.Provider
      value={{
        userSubscriptionDetails,
        setUserSubscriptionDetails,
        isSubscribe,
        setSubscribe,
        getSubscriptionDetails,
        RemainingDays,
        getExchangeCurrency,
      }}
    >
      {props.children}
    </APPContext.Provider>
  );
};
