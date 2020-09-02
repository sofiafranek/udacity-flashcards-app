import { AsyncStorage } from 'react-native';
import { Notifications } from 'expo';

import * as Permissions from 'expo-permissions';

const STORAGE_KEY = 'NOTIFICATION';
const NOTIFICATION_CHANNEL_ID = 'QUICK_REMAINDERS';

export const removeNotifications = () => {
  return AsyncStorage.removeItem(STORAGE_KEY).then(
    Notifications.cancelAllScheduledNotificationsAsync
  );
};

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

const createNotificationChannel = () => {
  return {
    name: 'Daily Reminder',
    description: 'A daily remainder to keep you tracked',
    sound: true,
    priority: 'high',
  };
};

export const createLocalNotification = () => {
  AsyncStorage.getItem(STORAGE_KEY)
    .then(JSON.parse)
    .then((data) => {
      if (data === null) {
        Permissions.askAsync(Permissions.NOTIFICATIONS).then(({ status }) => {
          if (status === 'granted') {
            Notifications.createChannelAndroidAsync(
              NOTIFICATION_CHANNEL_ID,
              createNotificationChannel()
            )
              .then(() => {
                Notifications.cancelAllScheduledNotificationsAsync();

                const nextDay = new Date();

                nextDay.setDate(nextDay.getDate() + 1);
                nextDay.setHours(20);
                nextDay.setMinutes(0);

                Notifications.scheduleLocalNotificationAsync(sendNotification(), {
                  time: nextDay,
                  repeat: 'day',
                });

                AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(true));
              })
              .catch((error) => {
                console.log('error', error);
              });
          }
        });
      }
    });
};
