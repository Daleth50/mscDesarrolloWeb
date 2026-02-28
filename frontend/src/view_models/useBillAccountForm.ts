import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { billAccountService } from '../services/billAccountService';
import { getErrorMessage } from '../utils/error';

type BillAccountType = 'cash' | 'debt';

type BillAccountFormData = {
  name: string;
  type: BillAccountType;
  balance: string;
};

type BillAccountFormChangeEvent = {
  target: {
    name: string;
    value: string;
  };
};

export function useBillAccountForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [loading, setLoading] = useState(isEdit);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<BillAccountFormData>({
    name: '',
    type: 'cash',
    balance: '0',
  });

  useEffect(() => {
    if (isEdit && id) {
      loadBillAccount();
    }
  }, [id, isEdit]);

  const loadBillAccount = async () => {
    try {
      setLoading(true);
      const account = await billAccountService.getById(id!);
      if (account) {
        setFormData({
          name: account.name || '',
          type: account.type === 'debt' ? 'debt' : 'cash',
          balance: String(account.balance ?? 0),
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

  const handleChange = (e: BillAccountFormChangeEvent) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setError('El nombre es requerido');
      return;
    }
    if (!['cash', 'debt'].includes(formData.type)) {
      setError("El tipo debe ser 'cash' o 'debt'");
      return;
    }
    if (Number.isNaN(Number(formData.balance))) {
      setError('El balance debe ser un número válido');
      return;
    }

    try {
      setLoading(true);
      const payload = {
        name: formData.name.trim(),
        type: formData.type,
        balance: Number(formData.balance),
      };

      if (isEdit) {
        await billAccountService.update(id!, payload);
      } else {
        await billAccountService.create(payload);
      }
      navigate('/bill-accounts');
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
  };
}
