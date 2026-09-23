import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './src/screens/HomeScreen';
import AddAdScreen from './src/screens/AddAdScreen';
import AuthScreen from './src/screens/AuthScreen';
import AdminScreen from './src/screens/AdminScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'سيارتي ستور' }} />
        <Stack.Screen name="AddAd" component={AddAdScreen} options={{ title: 'إضافة إعلان جديد' }} />
        <Stack.Screen name="Auth" component={AuthScreen} options={{ title: 'تسجيل الدخول' }} />
        <Stack.Screen name="Admin" component={AdminScreen} options={{ title: 'لوحة التحكم' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
