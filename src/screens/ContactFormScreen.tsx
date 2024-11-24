import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  Image,
  TouchableOpacity,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import useContactForm from '../hooks/useContactForm';
import usePermissions from '../hooks/usePermissions';
import CustomButton from '../components/CustomButton';
import { RootStackParamList } from '../types/types';
import { StackScreenProps } from '@react-navigation/stack';

type ContactFormScreenProps = StackScreenProps<RootStackParamList, 'AddContact'>;

const ContactFormScreen: React.FC<ContactFormScreenProps> = ({ navigation, route }) => {
  const [region, setRegion] = useState({
    latitude: 6.2442,
    longitude: -75.5812,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const [profileImage, setProfileImage] = useState<string | null>(null);

  const {
    formState,
    error,
    handleInputChange,
    handleTakePhoto,
    handleSubmit,
    handleImagePick,
  } = useContactForm(
    async () => {
      Alert.alert('Success', 'Contact created successfully!');
      // Obtener el callback configurado como parámetro en la navegación
      const callback = route.params?.onContactAdded;
      if (callback) {
        callback();
      }
      navigation.goBack();
    },
    setProfileImage
  );

  const { requestLocationPermission, requestCameraPermission } = usePermissions();

  useEffect(() => {
    const initializeLocation = async () => {
      const granted = await requestLocationPermission();
      if (!granted) {
        Alert.alert(
          'Permission Denied',
          'Location permission is required to use the map. Please enable it in settings.'
        );
      }
    };
    initializeLocation();

    const callback = () => {
      console.log('Contact added callback triggered');
    };

    navigation.setParams({
      onContactAdded: callback,
    });
  }, [navigation ,requestLocationPermission]);

  const handleMapPress = (e: any) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    handleInputChange('latitude', latitude);
    handleInputChange('longitude', longitude);
    setRegion({ ...region, latitude, longitude });
  };

  const handleTakePhotoWithPermission = async () => {
    const granted = await requestCameraPermission();
    if (granted) {
      handleTakePhoto();
    } else {
      Alert.alert('Permission Denied', 'Camera permission is required to take a photo.');
    }
  };

  const handleImagePickWithPermission = async () => {
    const granted = await requestCameraPermission();
    if (granted) {
      handleImagePick();
    } else {
      Alert.alert('Permission Denied', 'Permission is required to pick an image.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileIconContainer}>
        <Image
          source={profileImage ? { uri: profileImage } : require('../assets/default-profile.png')}
          style={styles.profileIcon}
        />
      </View>

      <View style={styles.imagePickContainer}>
        <CustomButton title="Pick Image" onPress={handleImagePickWithPermission} color="#4CAF50" />
        <CustomButton title="Take Photo" onPress={handleTakePhotoWithPermission} color="#2196F3" />
      </View>

      <TextInput
        style={styles.input}
        placeholder="Name"
        value={formState.name}
        onChangeText={(text) => handleInputChange('name', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={formState.email}
        onChangeText={(text) => handleInputChange('email', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Phone"
        value={formState.phone}
        onChangeText={(text) => handleInputChange('phone', text)}
      />

      <View style={styles.contactTypeContainer}>
        <TouchableOpacity
          style={[
            styles.tag,
            formState.contactType === 'Employee' && styles.tagSelected,
          ]}
          onPress={() => handleInputChange('contactType', 'Employee')}
        >
          <Text>Employee</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tag,
            formState.contactType === 'Client' && styles.tagSelected,
          ]}
          onPress={() => handleInputChange('contactType', 'Client')}
        >
          <Text>Client</Text>
        </TouchableOpacity>
      </View>

      {formState.latitude && formState.longitude && (
        <Text>
          Selected Location: {formState.latitude.toFixed(4)}, {formState.longitude.toFixed(4)}
        </Text>
      )}

      <MapView
        style={styles.map}
        region={region}
        onPress={handleMapPress}
      >
        {formState.latitude && formState.longitude && (
          <Marker
            coordinate={{
              latitude: formState.latitude,
              longitude: formState.longitude,
            }}
          />
        )}
      </MapView>

      {error && <Text style={styles.error}>{error}</Text>}

      <CustomButton title="Save" onPress={handleSubmit} color="#FF5722" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    justifyContent: 'space-around',
    padding: 10,
    height: '100%',
    width: '100%',
  },
  profileIconContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  profileIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderColor: '#CCCCCC',
    borderWidth: 2,
  },
  imagePickContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  input: {
    marginBottom: 12,
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#cccccc',
  },
  contactTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  tag: {
    padding: 10,
    borderColor: '#cccccc',
  },
  tagSelected: {
    backgroundColor: '#2196F3',
    borderRadius: 10,
    color: '#FFFFFF',
  },
  map: {
    height: 250,
    marginBottom: 20,
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 20,
  },
});

export default ContactFormScreen;
