import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import CustomButton from '../components/CustomButton';

const HomeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>Welcome to Close To You App</Text>

      <View style={styles.containerButton}>
        <CustomButton
          title="Let's Get Started"
          onPress={() => navigation.navigate('Onboarding')}
          color="#4CAF50"
        />
        <CustomButton
          title="Login"
          onPress={() => navigation.navigate('Login')}
          color="#2196F3"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    padding: 20,
    height:'100%',
    gap:30,

  },
  containerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    padding: 20,
    width:'100%',

  },
  welcome:{
    fontSize:30,
  },
});

export default HomeScreen;

