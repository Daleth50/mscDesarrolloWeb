import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { userService } from '../services/userService';
import { getErrorMessage } from '../utils/error';
import type { User, UUID } from '../types/models';

type UserFormData = {
  first_name: string;
  last_name: string;
  email: string;
  username: string;
  password: string;
  role: 'admin' | 'seller';
};

type UserFormChangeEvent = {
  target: {
    name: string;
    value: string;
  };
};

export function useUserForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [loading, setLoading] = useState(isEdit);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<UserFormData>({
    first_name: '',
    last_name: '',
    email: '',
    username: '',
    password: '',
    role: 'seller',
  });

  useEffect(() => {
    if (isEdit && id) {
      loadUser();
    }
  }, [id, isEdit]);

  const loadUser = async () => {
    try {
      setLoading(true);
      const user = await userService.getById(id!);
      if (user) {
        setFormData({
          first_name: user.first_name || '',
          last_name: user.last_name || '',
          email: user.email || '',
          username: user.username || '',
          password: '',
          role: user.role as 'admin' | 'seller',
        });
      }
      setError(null);
    } catch (err) {
      setError(getErrorMessage(err));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: UserFormChangeEvent) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!formData.first_name.trim()) {
      setError('El nombre es requerido');
      return;
    }
    if (!formData.last_name.trim()) {
      setError('El apellido es requerido');
      return;
    }
    if (!formData.email.trim()) {
      setError('El email es requerido');
      return;
    }
    if (!formData.username.trim()) {
      setError('El usuario es requerido');
      return;
    }
    if (!isEdit && !formData.password.trim()) {
      setError('La contraseña es requerida');
      return;
    }

    try {
      setLoading(true);
      const dataToSend = isEdit && !formData.password
        ? {
            first_name: formData.first_name,
            last_name: formData.last_name,
            email: formData.email,
            username: formData.username,
            role: formData.role,
          }
        : formData;

      if (isEdit) {
        await userService.update(id!, dataToSend);
      } else {
        await userService.create(formData);
      }
      navigate('/users');
    } catch (err) {
      setError(getErrorMessage(err));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    formData,
    isEdit,
    handleChange,
    handleSubmit,
    setError,
  };
}
