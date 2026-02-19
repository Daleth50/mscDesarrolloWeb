import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { contactService } from '../services/contactService';
import { getErrorMessage } from '../utils/error';
import type { Contact, UUID } from '../types/models';

export function useContactsList() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    try {
      setLoading(true);
      const data = await contactService.getAll();
      setContacts(data);
    } catch (err) {
      setError(getErrorMessage(err));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id: UUID) => {
    navigate(`/contacts/edit/${id}`);
  };

  const handleDelete = async (id: UUID) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este contacto?')) {
      try {
        await contactService.delete(id);
        loadContacts();
      } catch (err) {
        setError(getErrorMessage(err));
        console.error(err);
      }
    }
  };

  return {
    loading,
    error,
    contacts,
    handleEdit,
    handleDelete,
  };
}
