import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supplierService } from '../services/supplierService';
import { getErrorMessage } from '../utils/error';

type SupplierFormData = {
  name: string;
  email: string;
  phone: string;
  address: string;
};

type SupplierFormChangeEvent = {
  target: {
    name: string;
    value: string;
  };
};

export function useSupplierForm() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<SupplierFormData>({
    name: '',
    email: '',
    phone: '',
    address: '',
  });

  const handleChange = (e: SupplierFormChangeEvent) => {
    const { name, value } = e.target;
    const field = name as keyof SupplierFormData;
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await supplierService.create(formData);
      navigate('/suppliers');
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
