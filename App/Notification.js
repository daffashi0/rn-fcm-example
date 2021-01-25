import React, {useEffect} from 'react';
import {Alert, View, Text} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';

// function App() {
//   useEffect(() => {
//     const unsubscribe = messaging().onMessage(async remoteMessage => {
//       Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
//     });

//     return unsubscribe;
//   }, []);
// }

const Notification = (props) => {
  useEffect(() => {
    async function checkPermission() {
      const enabled = await messaging().hasPermission();
      if (enabled) {
        getToken();
      } else {
        requestPermission();
      }
    }
    checkPermission();
    const foreground = messaging().onMessage(async (remoteMessage) => {
      Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
    });

    return foreground;
  }, []);

  //   const checkPermission = async () => {
  //     const enabled = await messaging().hasPermission();
  //     if (enabled) {
  //       getToken();
  //     } else {
  //       requestPermission();
  //     }
  //   };

  const getToken = async () => {
    let fcmToken = await AsyncStorage.getItem('fcmToken');
    if (!fcmToken) {
      fcmToken = await messaging().getToken();
      if (fcmToken) {
        // user has a device token
        await AsyncStorage.setItem('fcmToken', fcmToken);
      }
    }

    console.log('fcm token : ', fcmToken);
  };

  const requestPermission = async () => {
    try {
      await messaging().request();
      // User has authorised
      getToken();
    } catch (error) {
      // User has rejected permissions
      console.log('permission rejected');
    }
  };

  return (
    <View style={{flex: 1}}>
      <Text>Welcome to React Native!</Text>
    </View>
  );
};

export default Notification;
