import { useState, useEffect } from 'react';
import contactService from '../services/contactService';

interface FormState {
  name: string;
  email?: string;
  phone: string;
  latitude: number;
  longitude: number;
}

const useEditContact = (contactId: string, onSuccess: () => void, setProfileImage: (image: string | null) => void) => {
  const [contactDetails, setContactDetails] = useState<any | null>(null);
  const [formState, setFormState] = useState<FormState>({
    name: '',
    email: '',
    phone: '',
    latitude: 6.2442,
    longitude: -75.5812,
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContactDetails = async () => {
      try {
        const contact = await contactService.getContactById(contactId);
        setContactDetails(contact);
        setFormState({
          name: contact.name,
          email: contact.email || '',
          phone: contact.phone,
          latitude: contact.latitude,
          longitude: contact.longitude,
        });
        setProfileImage(contact.profilePicture);
      } catch (err) {
        setError('Error fetching contact details');
      }
    };

    fetchContactDetails();
  }, [contactId, setProfileImage]);

  const handleInputChange = (field: string, value: string) => {
    setFormState((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  const handleMapPress = (e: any) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    handleInputChange('latitude', latitude);
    handleInputChange('longitude', longitude);
  };

  const handleSubmit = async () => {
    try {
      const updated = await contactService.updateContact(contactId, {
        name: formState.name,
        email: formState.email,
        phone: formState.phone,
        contactType: 'Employee',
        longitude: parseFloat(formState.longitude.toString()),
        latitude: parseFloat(formState.latitude.toString()),
      });

      if (updated) {
        onSuccess();
      } else {
        setError('Error updating contact');
      }
    } catch (err) {
      setError('Error updating contact');
    }
  };

  return {
    contactDetails,
    formState,
    error,
    handleInputChange,
    handleMapPress,
    handleSubmit,
  };
};

export default useEditContact;
