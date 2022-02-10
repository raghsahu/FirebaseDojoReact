import React, { useState, useEffect, useRef } from "react";
import { LogBox, View, Platform } from "react-native";

LogBox.ignoreAllLogs(true);

import { APPProvider } from "./src/context/AppProvider";
import { AnalyticsProvider } from "./src/context/AnalyticsProvider";
import { LocalizatiionProvider } from "./src/context/LocalizatiionProvider";

// //PACKAGES
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import auth from "@react-native-firebase/auth";

import firebase from "@react-native-firebase/app";
import PushNotification from "react-native-push-notification";
import { FirebaseMessagingTypes } from "@react-native-firebase/messaging";
import PushNotificationIOS from "@react-native-community/push-notification-ios";

//SCREENS
import SelectLanguage from "./src/pages/SelectLanguage";
import Splash from "./src/pages/Splash";
import SignIn from "./src/pages/SignIn";
import Home from "./src/pages/Home";
import ReadBook from "./src/pages/ReadBook";
import Detail from "./src/pages/Detail";
import Libray from "./src/pages/Libray";
import Discover from "./src/pages/Discover";
import Summary from "./src/pages/Summary";
import Notification from "./src/pages/Notification";
import Search from "./src/pages/Search";
import Category from "./src/pages/Category";
import TreadingBooks from "./src/pages/TreadingBooks";
import AuthorsBooks from "./src/pages/AuthorsBooks";
import Subscription from "./src/pages/Subscription";
import ReferFriend from "./src/pages/ReferFriend";
import EditProfile from "./src/pages/EditProfile";
import MySubscription from "./src/pages/MySubscription";
import MyReview from "./src/pages/MyReviews";
import AllCategory from "./src/pages/AllCategories";
import AllAuthors from "./src/pages/AllAuthors";
import NotificationDetails from "./src/pages/NotificationDetails";
import Webview from "./src/pages/Webview";
import Feedback from "./src/pages/Feedback";
import Comments from "./src/pages/Comments";
import PdfView from "./src/pages/PdfView";
import ReferralCode from "./src/pages/ReferralCode";
import SignUp from "./src/pages/SignUp";

//TABBAR
import { Tabbar } from "./src/components";
import { ScrollView } from "react-native-gesture-handler";

const { Navigator, Screen } = createStackNavigator();
const Tab = createBottomTabNavigator();

const BottomBar = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
      tabBar={(props) => <Tabbar {...props} />}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Discover" component={Discover} />
      <Tab.Screen name="ReferFriend" component={ReferFriend} />
      <Tab.Screen name="Libray" component={Libray} />
      <Tab.Screen name="Summary" component={Summary} />
    </Tab.Navigator>
  );
};

const AppStack = () => (
  <Navigator
    screenOptions={{
      headerShown: false,
    }}
    initialRouteName={"Splash"}
  >
    <Screen name="Splash" component={Splash} />
    <Screen name="SelectLanguage" component={SelectLanguage} />
    <Screen name="Home" component={BottomBar} />
    <Screen name="Detail" component={Detail} />
    <Screen name="Summary" component={Summary} />
    <Screen name="ReadBook" component={ReadBook} />
    <Screen name="Notification" component={Notification} />
    <Screen name="Search" component={Search} />
    <Screen name="Category" component={Category} />
    <Screen name="TreadingBooks" component={TreadingBooks} />
    <Screen name="AuthorsBooks" component={AuthorsBooks} />
    <Screen name="ReferFriend" component={ReferFriend} />
    <Screen name="EditProfile" component={EditProfile} />
    <Screen name="Subscription" component={Subscription} />
    <Screen name="MySubscription" component={MySubscription} />
    <Screen name="MyReview" component={MyReview} />
    <Screen name="AllCategory" component={AllCategory} />
    <Screen name="AllAuthors" component={AllAuthors} />
    <Screen name="NotificationDetails" component={NotificationDetails} />
    <Screen name="Webview" component={Webview} />
    <Screen name="Feedback" component={Feedback} />
    <Screen name="Comments" component={Comments} />
    <Screen name="PdfView" component={PdfView} />
    <Screen name="ReferralCode" component={ReferralCode} />
  </Navigator>
);

const AuthStack = () => (
  <Navigator
    screenOptions={{
      headerShown: false,
    }}
    initialRouteName={"Splash"}
  >
    <Screen name="Splash" component={Splash} />
    <Screen name="SelectLanguage" component={SelectLanguage} />
    <Screen name="SignIn" component={SignIn} />
    <Screen name="Webview" component={Webview} />
    <Screen name="SignUp" component={SignUp} />
  </Navigator>
);

function App() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);

  if (initializing) return null;

  //firebase notification
  const getToken = () => {
    firebase
      .messaging()
      .getToken(firebase.app().options.messagingSenderId)
      .then((x) => console.log(x))
      .catch((e) => console.log(e));
  };
  const registerForRemoteMessages = () => {
    firebase
      .messaging()
      .registerDeviceForRemoteMessages()
      .then(() => {
        console.log("Registered");
        requestPermissions();
      })
      .catch((e) => console.log(e));
  };
  const requestPermissions = () => {
    firebase
      .messaging()
      .requestPermission()
      .then((status: FirebaseMessagingTypes.AuthorizationStatus) => {
        if (status === 1) {
          console.log("Authorized");
          onMessage();
        } else {
          console.log("Not authorized");
        }
      })
      .catch((e) => console.log(e));
  };
  const onMessage = () => {
    if (Platform.OS == "android") {
      firebase.messaging().onMessage(async (remoteMessage) => {
        console.log("## remote message", JSON.stringify(remoteMessage));
        showNotification(remoteMessage);
      });
    }
  };
  const showNotification = (remoteMessage: any) => {
    PushNotification.createChannel(
      {
        channelId: remoteMessage.messageId, // (required)
        channelName: `Custom channel - Counter: ${remoteMessage.messageId}`, // (required)
        channelDescription: `A custom channel to categorise your custom notifications. Updated at: ${Date.now()}`, // (optional) default: undefined.
        soundName: "default", // (optional) See `soundName` parameter of `localNotification` function
        importance: 4, // (optional) default: 4. Int value of the Android notification importance
        vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
      },
      (created) => console.log(`createChannel returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
    );

    let data;
    console.log("data_message " + remoteMessage.hasOwnProperty("data"));
    if (remoteMessage.hasOwnProperty("data") && remoteMessage.data) {
      let notification = remoteMessage.data;
      data = {
        body: notification.noti_body ? notification.noti_body : remoteMessage.notification.body,
        title: notification.noti_title ? notification.noti_title : remoteMessage.notification.title,
        image: notification.noti_image_url ? notification.noti_image_url : remoteMessage.notification.image,
      };
     // console.log("admin_data_noti" + data);
    } else {
      data = remoteMessage.notification;
    }

    PushNotification.localNotification({
      /* Android Only Properties */
      // id: "0", // (optional) Valid unique 32 bit integer specified as string. default: Autogenerated Unique ID
      vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
      priority: "high", // (optional) set notification priority, default: high
      importance: 4, // (optional) set notification importance, default: high
      /* iOS and Android properties */
      title: data.title, // (optional)
      message: data.body, // remoteMessage.data.message, // (required),
      channelId: remoteMessage.messageId,
      bigPictureUrl: data.image,
    });
  };


  getToken();
  if (Platform.OS === "ios") {
    registerForRemoteMessages();
  } else {
    onMessage();
  }

  if (!user) {
    return (
      <LocalizatiionProvider>
        <AnalyticsProvider>
          <APPProvider>
            <NavigationContainer>
              <AuthStack />
              {/* <PushController/> */}
            </NavigationContainer>
          </APPProvider>
        </AnalyticsProvider>
      </LocalizatiionProvider>
    );
  }

  return (
    <LocalizatiionProvider>
      <AnalyticsProvider>
        <APPProvider>
          <NavigationContainer>
            <AppStack />
            {/* <PushController/> */}
          </NavigationContainer>
        </APPProvider>
      </AnalyticsProvider>
    </LocalizatiionProvider>
  );
}

export default App;
