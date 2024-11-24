import { useState, useEffect, useCallback } from 'react';
import contactService from '../services/contactService';

interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  contactType: string;
  longitude: number;
  latitude: number;
  profilePicture: string;
}

const useContacts = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchContacts = useCallback(async () => {  // Hacemos que fetchContacts sea un callback
    setLoading(true);
    setError(null);
    try {
      const data = await contactService.getContacts();
      setContacts(data);
    } catch (err) {
      setError('Error fetching contacts. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, []);  // `fetchContacts` no depende de ninguna variable, por eso se pone un array vacío

  // Usamos `useEffect` solo para la carga inicial de los contactos
  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);  // Esto ejecuta `fetchContacts` al inicio

  return { contacts, loading, error, fetchContacts };  // Devolvemos la función `fetchContacts` para usarla afuera
};

export default useContacts;
