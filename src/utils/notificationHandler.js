import { AsyncStorage } from 'react-native';
import { Notifications } from 'expo';

import * as Permissions from 'expo-permissions';

const NOTIFICATION_KEY = 'NOTIFICATION';
const NOTIFICATION_CHANNEL_ID = 'QUICK_REMAINDERS';

const sendNotification = () => {
  return {
    title: 'Flashcards',
    body: "👋 Forgot to study? here's a quick remainder",
    ios: {
      sound: true,
    },
    android: {
      channelId: NOTIFICATION_CHANNEL_ID,
      sticky: false,
    },
  };
};

export const setLocalNotification = () => {
  AsyncStorage.getItem(NOTIFICATION_KEY)
    .then(JSON.parse)
    .then((data) => {
      if (data === null) {
        Permissions.askAsync(Permissions.NOTIFICATIONS).then(({ status }) => {
          if (status === 'granted') {
            Notifications.cancelAllScheduledNotificationsAsync();

            let tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            tomorrow.setHours(20);
            tomorrow.setMinutes(0);

            Notifications.scheduleLocalNotificationAsync(sendNotification(), {
              time: tomorrow,
              repeat: 'day',
            });

            AsyncStorage.setItem(NOTIFICATION_KEY, JSON.stringify(true));
          }
        });
      }
    });
};
