import { useState } from 'react';
import * as ImagePicker from 'react-native-image-picker';
import contactService from '../services/contactService';

interface ContactFormState {
  name: string;
  email: string;
  phone: string;
  contactType: 'Employee' | 'Client';
  latitude: number | null;
  longitude: number | null;
  file: any | null;
}

const useContactForm = (
  onSuccess: () => void,
  setProfileImage: React.Dispatch<React.SetStateAction<string | null>>
) => {
  const [formState, setFormState] = useState<ContactFormState>({
    name: '',
    email: '',
    phone: '',
    contactType: 'Employee',
    latitude: null,
    longitude: null,
    file: null,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (field: keyof ContactFormState, value: any) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const handleImagePick = async () => {
    const options: ImagePicker.ImageLibraryOptions = {
      mediaType: 'photo',
    };

    const result = await ImagePicker.launchImageLibrary(options);

    if (!result.didCancel && result.assets?.[0]) {
      const { uri, type, fileName } = result.assets[0];
      if (uri) {
        handleInputChange('file', { uri, type, fileName });
        setProfileImage(uri ?? null);
      } else {
        console.log('Could not get the URI of the selected image');
      }
    }
  };

  const handleTakePhoto = async () => {
    const options: ImagePicker.CameraOptions = {
      mediaType: 'photo',
    };

    const result = await ImagePicker.launchCamera(options);

    if (!result.didCancel && result.assets?.[0]) {
      const { uri, type, fileName } = result.assets[0];
      handleInputChange('file', { uri, type, fileName });
      setProfileImage(uri ?? null);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      const isSuccess = await contactService.createContact({
        ...formState,
        longitude: formState.longitude ?? 0,
        latitude: formState.latitude ?? 0,
      });

      if (isSuccess) {
        onSuccess();
      } else {
        setError('Failed to create contact.');
      }
    } catch (err) {
      setError('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return {
    formState,
    loading,
    error,
    handleInputChange,
    handleImagePick,
    handleTakePhoto,
    handleSubmit,
  };
};

export default useContactForm;
