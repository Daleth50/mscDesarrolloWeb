import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { contactService } from '../services/contactService';
import { getErrorMessage } from '../utils/error';

type ContactFormData = {
  name: string;
  email: string;
  phone: string;
  address: string;
};

type ContactFormChangeEvent = {
  target: {
    name: string;
    value: string;
  };
};

export function useContactForm() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    address: '',
  });

  const handleChange = (e: ContactFormChangeEvent) => {
    const { name, value } = e.target;
    const field = name as keyof ContactFormData;
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await contactService.create(formData);
      navigate('/contacts');
    } catch (err) {
      setError(getErrorMessage(err));
      console.error(err);
    }
  };

  return {
    error,
    formData,
    handleChange,
    handleSubmit,
  };
}
