import React, { useState, useEffect, useRef } from 'react';
import { LogBox, View } from 'react-native';

LogBox.ignoreAllLogs(true)

import { APPProvider } from './src/context/AppProvider'
import { AnalyticsProvider } from './src/context/AnalyticsProvider'
import { LocalizatiionProvider } from './src/context/LocalizatiionProvider'

// //PACKAGES
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import auth from '@react-native-firebase/auth';

//SCREENS
import SelectLanguage from './src/pages/SelectLanguage'
import Splash from './src/pages/Splash';
import SignIn from './src/pages/SignIn';
import Home from './src/pages/Home';
import ReadBook from './src/pages/ReadBook';
import Detail from './src/pages/Detail';
import Libray from './src/pages/Libray';
import Discover from './src/pages/Discover';
import Summary from './src/pages/Summary';
import Notification from './src/pages/Notification';
import Search from './src/pages/Search'
import Category from './src/pages/Category'
import TreadingBooks from './src/pages/TreadingBooks'
import AuthorsBooks from './src/pages/AuthorsBooks'
import Subscription from './src/pages/Subscription';
import ReferFriend from './src/pages/ReferFriend'
import EditProfile from './src/pages/EditProfile'
import MySubscription from './src/pages/MySubscription'
import MyReview from './src/pages/MyReviews'
import AllCategory from './src/pages/AllCategories'
import AllAuthors from './src/pages/AllAuthors'
import NotificationDetails from './src/pages/NotificationDetails'
import Webview from './src/pages/Webview';
import Feedback from './src/pages/Feedback';
import Comments from './src/pages/Comments';

//TABBAR
import { Tabbar } from './src/components'

const { Navigator, Screen } = createStackNavigator();
const Tab = createBottomTabNavigator();

const BottomBar = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
      tabBar={(props) => <Tabbar {...props} />}>
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Discover" component={Discover} />
      <Tab.Screen name="Libray" component={Libray} />
      <Tab.Screen name="Summary" component={Summary} />
    </Tab.Navigator >
  )
}

const AppStack = () => (
  <Navigator
    screenOptions={{
      headerShown: false,
    }}
    initialRouteName={"Splash"} >
    <Screen name='Splash' component={Splash} />
    <Screen name='SelectLanguage' component={SelectLanguage} />
    <Screen name='Home' component={BottomBar} />
    <Screen name='Detail' component={Detail} />
    <Screen name='Summary' component={Summary} />
    <Screen name='ReadBook' component={ReadBook} />
    <Screen name='Notification' component={Notification} />
    <Screen name='Search' component={Search} />
    <Screen name='Category' component={Category} />
    <Screen name='TreadingBooks' component={TreadingBooks} />
    <Screen name='AuthorsBooks' component={AuthorsBooks} />
    <Screen name='ReferFriend' component={ReferFriend} />
    <Screen name='EditProfile' component={EditProfile} />
    <Screen name='Subscription' component={Subscription} />
    <Screen name='MySubscription' component={MySubscription} />
    <Screen name='MyReview' component={MyReview} />
    <Screen name='AllCategory' component={AllCategory} />
    <Screen name='AllAuthors' component={AllAuthors} />
    <Screen name='NotificationDetails' component={NotificationDetails} />
    <Screen name='Webview' component={Webview} />
    <Screen name='Feedback' component={Feedback} />
    <Screen name='Comments' component={Comments} />
  </Navigator >
);

const AuthStack = () => (
  <Navigator
    screenOptions={{
      headerShown: false,
    }}
    initialRouteName={"Splash"} >
    <Screen name='Splash' component={Splash} />
    <Screen name='SelectLanguage' component={SelectLanguage} />
    <Screen name='SignIn' component={SignIn} />
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

  if (!user) {
    return (
      <LocalizatiionProvider>
        <AnalyticsProvider>
          <APPProvider>
            <NavigationContainer>
              <AuthStack />
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
          </NavigationContainer>
        </APPProvider>
      </AnalyticsProvider>
    </LocalizatiionProvider>
  );
}

export default App;

