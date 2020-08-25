import React from 'react';
import { View } from 'react-native';
import 'react-native-gesture-handler';
import Constants from 'expo-constants';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { setLocalNotification } from './utils/notificationHandler';
import List from './components/List';
import AddDeck from './components/AddDeck';
import Deck from './components/Deck';
import AddCard from './components/AddCard';
import Quiz from './components/Quiz';

const AppStatusBar = () => {
  return (
    <View style={{ height: Constants.statusBarHeight }}>
      <StatusBar translucent barStyle="dark-content" />
    </View>
  );
};

const Tab = createBottomTabNavigator();

const TabNavigation = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Decks"
        component={List}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Add Deck"
        component={AddDeck}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="plus" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const Stack = createStackNavigator();

const StackNavigation = () => {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={TabNavigation} />
      <Stack.Screen name="Deck" component={Deck} options={{ title: 'View Deck' }} />
      <Stack.Screen name="AddCard" component={AddCard} options={{ title: 'Add Card' }} />
      <Stack.Screen name="Quiz" component={Quiz} options={{ title: 'Quiz Time' }} />
    </Stack.Navigator>
  );
};

const App = () => {
  setLocalNotification();

  return (
    <NavigationContainer>
      <View style={{ flex: 1 }}>
        <AppStatusBar />
        <StackNavigation />
      </View>
    </NavigationContainer>
  );
};

export default App;
