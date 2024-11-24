import { useState, useEffect } from 'react';
import contactService from '../services/contactService';

export interface ContactDetails {
  id: string;
  name: string;
  email: string;
  phone: string;
  contactType: string;
  longitude: number;
  latitude: number;
  profilePicture: string;
}

const useContactDetails = (contactId: string) => {
  const [contactDetails, setContactDetails] = useState<ContactDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContactDetails = async () => {
      try {
        const response = await contactService.getContactById(contactId);
        setContactDetails(response);
      } catch (err) {
        setError('Failed to fetch contact details');
      } finally {
        setLoading(false);
      }
    };

    fetchContactDetails();
  }, [contactId]);

  return { contactDetails, loading, error };
};

export default useContactDetails;
