import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { RootStackParamList } from '../types/types';
import HomeScreen from '../screens/HomeScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ContactFormScreen from '../screens/ContactFormScreen';
import ContactsScreen from '../screens/ContactsScreen';
import ContactDetailsScreen from '../screens/ContactDetailsScreen';
import EditContactScreen from '../screens/EditContactScreen';

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }}/>
      <Stack.Screen name="Onboarding" component={OnboardingScreen} options={{ headerShown: false }}/>
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }}/>
      <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }}/>
      <Stack.Screen name="AddContact" component={ContactFormScreen} options={{ title: 'Add Contact' }}/>
      <Stack.Screen name="ContactList" component={ContactsScreen} options={{ headerShown: false }}/>
      <Stack.Screen name="ContactDetails" component={ContactDetailsScreen} options={{title:'Contact Details'}}/>
      <Stack.Screen name="EditContact" component={EditContactScreen} options={{title:'Edit Contact'}}/>
    </Stack.Navigator>
  );
};

export default AppNavigator;
