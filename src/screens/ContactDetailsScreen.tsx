import React, { useEffect, useState } from 'react';
import { View, Text, Image, TextInput, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/types';
import useContactDetails from '../hooks/useContactDetails';
import CustomButton from '../components/CustomButton';
import contactService from '../services/contactService';

type ContactDetailsScreenRouteProp = RouteProp<RootStackParamList, 'ContactDetails'>;

type ContactDetailsScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'ContactDetails'>;
  route: ContactDetailsScreenRouteProp;
};

const ContactDetailsScreen: React.FC<ContactDetailsScreenProps> = ({ route, navigation }) => {
  const { contactId } = route.params;

  const { contactDetails: initialContactDetails, loading, error } = useContactDetails(contactId);
  const [contactDetails, setContactDetails] = useState(initialContactDetails);
  const [region, setRegion] = useState({
    latitude: 6.2442,
    longitude: -75.5812,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  useEffect(() => {
    if (initialContactDetails) {
      setContactDetails(initialContactDetails);
    }
  }, [initialContactDetails]);

  useEffect(() => {
    if (contactDetails) {
      setRegion({
        latitude: contactDetails.latitude,
        longitude: contactDetails.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    }
  }, [contactDetails]);

  const handleEdit = () => {
    navigation.navigate('EditContact', {
      contactId,
      onSave: (updatedContact: typeof contactDetails) => {
        setContactDetails(updatedContact);
      },
    });
  };

  const handleDelete = async () => {
    Alert.alert(
      'Confirm Deletion',
      'Are you sure you want to delete this contact?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const success = await contactService.deleteContact(contactId);
            if (success) {
              navigation.navigate('ContactList', { refresh: true });
            } else {
              Alert.alert('Error', 'Failed to delete contact. Please try again.');
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return <Text>{error}</Text>;
  }

  if (!contactDetails) {
    return <Text>No contact details available</Text>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.profileIconContainer}>
        <Image
          source={{ uri: contactDetails.profilePicture }}
          style={styles.profileIcon}
        />
      </View>

      <View style={styles.contactTypeContainer}>
        <Text style={styles.contactTypeItem}>{contactDetails.contactType}</Text>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Name"
        value={contactDetails.name}
        editable={false}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={contactDetails.email}
        editable={false}
      />
      <TextInput
        style={styles.input}
        placeholder="Phone"
        value={contactDetails.phone}
        editable={false}
      />

      <MapView
        style={styles.map}
        region={region}
        onPress={() => {}}
      >
        {contactDetails.latitude && contactDetails.longitude && (
          <Marker
            coordinate={{
              latitude: contactDetails.latitude,
              longitude: contactDetails.longitude,
            }}
          />
        )}
      </MapView>
      <View style={styles.containerButton}>
        <CustomButton title="Edit" onPress={handleEdit} color="#2cc944" />
        <CustomButton title="Delete" onPress={handleDelete} color="#f00a19" />
      </View>
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
  input: {
    marginBottom: 12,
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#cccccc',
    backgroundColor: '#f0f0f0',
  },
  contactTypeContainer: {
    marginBottom: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    height: 250,
    marginBottom: 20,
  },
  contactTypeItem: {
    padding: 16,
    backgroundColor: 'gray',
    borderRadius: 10,
    color: 'white',
  },
  containerButton: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
});

export default ContactDetailsScreen;
