import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, Image } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import useEditContact from '../hooks/useEditContact';
import { useNavigation, useRoute } from '@react-navigation/native';
import CustomButton from '../components/CustomButton';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/types';

type NavigationProp = StackNavigationProp<RootStackParamList, 'EditContact'>;

const EditContactScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute();
  const { contactId } = route.params as { contactId: string };

  const [profileImage, setProfileImage] = useState<string | null>(null);

  const onSuccess = () => {
    Alert.alert('Success', 'Contact updated successfully!');
    navigation.navigate('ContactList',{refresh: true});
  };

  const {
    contactDetails,
    formState,
    error,
    handleInputChange,
    handleMapPress,
    handleSubmit,
  } = useEditContact(contactId, onSuccess, setProfileImage);

  const handleChange = (field: keyof typeof formState, value: string) => {
    handleInputChange(field, value);
  };

  if (!contactDetails) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      {profileImage && <Image source={{ uri: profileImage }} style={styles.profileImage} />}

      <Text>Name:</Text>
      <TextInput
        style={styles.input}
        value={formState.name}
        onChangeText={(text) => handleChange('name', text)}
      />

      <Text>Email:</Text>
      <TextInput
        style={styles.input}
        value={formState.email}
        onChangeText={(text) => handleChange('email', text)}
      />

      <Text>Phone:</Text>
      <TextInput
        style={styles.input}
        value={formState.phone}
        onChangeText={(text) => handleChange('phone', text)}
      />

      <Text>Location:</Text>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: formState.latitude,
          longitude: formState.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        onPress={handleMapPress}
      >
        <Marker coordinate={{ latitude: formState.latitude, longitude: formState.longitude }} />
      </MapView>

      <CustomButton
        title="Save Changes"
        onPress={handleSubmit}
        color="#4CAF50"
      />

      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-around',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
  },
  map: {
    width: '100%',
    height: 200,
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  error: {
    color: 'red',
    marginTop: 10,
  },
});

export default EditContactScreen;
