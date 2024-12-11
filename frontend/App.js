import React from "react";
import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import BottomNavigation from "./components/BottomNavigation";
import OnBoarding from "./screens/Onboarding";
import QuestionScreen from "./screens/Questions";

import { Platform } from "react-native";
import * as ScreenOrientation from "expo-screen-orientation";
if (Platform.OS !== "web") {
  ScreenOrientation.unlockAsync();
}

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="OnBoarding"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="OnBoarding" component={OnBoarding} />
        <Stack.Screen name="BottomNavigation" component={BottomNavigation} />
        <Stack.Screen name="Questions" component={QuestionScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
