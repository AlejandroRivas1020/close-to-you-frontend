import FormData from 'form-data';
import apiCloseToYou from '../api/ApiCloseToYou';

interface ContactData {
  name: string;
  email?: string;
  phone: string;
  contactType: string;
  longitude: number;
  latitude: number;
  file?: any;
}

const contactService = {
  createContact: async (contactData: ContactData): Promise<boolean> => {
    try {
      const formData = new FormData();
      formData.append('name', contactData.name);
      formData.append('email', contactData.email || '');
      formData.append('phone', contactData.phone);
      formData.append('contactType', contactData.contactType);
      formData.append('longitude', contactData.longitude.toString());
      formData.append('latitude', contactData.latitude.toString());

      if (contactData.file) {
        formData.append('file', {
          uri: contactData.file.uri,
          type: contactData.file.type,
          name: contactData.file.fileName,
        });
      }

      await apiCloseToYou.post('/contacts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return true;
    } catch (error) {
      console.error('Error creating contact:', error);
      return false;
    }
  },

  getContacts: async () =>{
    try {
      const response = await apiCloseToYou.get('/contacts');
      return response.data;
    } catch (error) {
      console.error('Error fetching contacts:', error);
      throw error;
    }
  },

  getContactById: async (contactId: string) => {
    try {
      const response = await apiCloseToYou.get(`/contacts/${contactId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching contact details:', error);
      throw error;
    }
  },

  deleteContact: async (contactId: string): Promise<boolean> => {
    try {
      await apiCloseToYou.delete(`/contacts/${contactId}`);
      return true;
    } catch (error) {
      console.error('Error deleting contact:', error);
      return false;
    }
  },

  updateContact: async (contactId: string, contactData: ContactData): Promise<boolean> => {
    try {
      const formData = new FormData();
      formData.append('name', contactData.name);
      formData.append('email', contactData.email || '');
      formData.append('phone', contactData.phone);
      formData.append('contactType', contactData.contactType);
      formData.append('longitude', contactData.longitude.toString());
      formData.append('latitude', contactData.latitude.toString());

      if (contactData.file) {
        formData.append('file', {
          uri: contactData.file.uri,
          type: contactData.file.type,
          name: contactData.file.fileName,
        });
      }

      await apiCloseToYou.patch(`/contacts/${contactId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return true;
    } catch (error) {
      console.error('Error updating contact:', error);
      return false;
    }
  },
 };

export default contactService;
