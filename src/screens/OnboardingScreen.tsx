import React from 'react';
import { Text, StyleSheet } from 'react-native';
import Onboarding from 'react-native-onboarding-swiper';

const OnboardingScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  return (
    <Onboarding
      pages={[
        {
          backgroundColor: '#fff',
          image: <Text style={styles.imageText}>1</Text>,
          title: 'Welcome to Our App!',
          subtitle: 'This app helps you manage your contacts in a simple and efficient way.',
        },
        {
          backgroundColor: '#fff',
          image: <Text style={styles.imageText}>2</Text>,
          title: 'Manage Your Contacts',
          subtitle: 'Easily add, edit, and delete your contacts whenever you need.',
        },
        {
          backgroundColor: '#fff',
          image: <Text style={styles.imageText}>3</Text>,
          title: 'Stay Connected',
          subtitle: 'Communicate and stay in touch with your contacts directly from the app.',
        },
      ]}
      onSkip={() => navigation.replace('Home')}
      onDone={() => navigation.replace('Home')}
    />
  );
};

const styles = StyleSheet.create({
  imageText: {
    fontSize: 100,
    color: '#ccc',
  },
});

export default OnboardingScreen;
