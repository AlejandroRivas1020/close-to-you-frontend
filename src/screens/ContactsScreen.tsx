import React from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/types';
import useContacts from '../hooks/useContacts';

type ContactsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ContactList'>;

type ContactsScreenProps = {
  navigation: ContactsScreenNavigationProp;
};

const ContactsScreen: React.FC<ContactsScreenProps> = ({ navigation }) => {
  const { contacts, loading, error, fetchContacts } = useContacts();

  const handleNavigateToCreateContact = () => {
    navigation.navigate('AddContact', {
      onContactAdded: fetchContacts,
    });
  };

  const handleNavigateToContactDetail = (id: string) => {
    navigation.navigate('ContactDetails', { contactId: id});
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return <Text>{error}</Text>;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={contacts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => handleNavigateToContactDetail(item.id)}
          >
            <View style={styles.contactCard}>
              <Image source={{ uri: item.profilePicture }} style={styles.profilePicture} />
              <View style={styles.contactInfo}>
                <Text style={styles.name}>{item.name}</Text>
                <Text>{item.contactType}</Text>
                <Text>{item.phone}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={handleNavigateToCreateContact}
      >
        <Text style={styles.buttonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  contactCard: {
    flexDirection: 'row',
    marginBottom: 16,
    padding: 10,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#ddd',
  },
  profilePicture: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 10,
  },
  contactInfo: {
    justifyContent: 'center',
  },
  name: {
    fontWeight: 'bold',
  },
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    backgroundColor: '#ff6347',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
  },
});

export default ContactsScreen;
