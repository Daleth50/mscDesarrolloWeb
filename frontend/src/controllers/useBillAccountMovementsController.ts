import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { billAccountService } from '../services/billAccountService';
import { getErrorMessage } from '../utils/error';
import {
  buildBillAccountMovementPayload,
  validateBillAccountMovementForm,
  type BillAccountMovementFormData,
} from '../models/billAccount';
import type { BillAccount, BillAccountMovement } from '../types/models';

const INITIAL_FORM: BillAccountMovementFormData = {
  movementType: 'in',
  amount: '',
};

export function useBillAccountMovements() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [account, setAccount] = useState<BillAccount | null>(null);
  const [movements, setMovements] = useState<BillAccountMovement[]>([]);

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [formData, setFormData] = useState<BillAccountMovementFormData>(INITIAL_FORM);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    if (!id) {
      setError('Id de cuenta no encontrado');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const [loadedAccount, loadedMovements] = await Promise.all([
        billAccountService.getById(id),
        billAccountService.getMovements(id),
      ]);
      setAccount(loadedAccount);
      setMovements(loadedMovements);
      setError(null);
    } catch (err) {
      setError(getErrorMessage(err));
      setAccount(null);
      setMovements([]);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/bill-accounts');
  };

  const openCreateDialog = () => {
    setSuccessMessage(null);
    setFormError(null);
    setFormData(INITIAL_FORM);
    setCreateDialogOpen(true);
  };

  const closeCreateDialog = () => {
    if (submitting) {
      return;
    }
    setCreateDialogOpen(false);
    setFormError(null);
  };

  const handleFormChange = (field: keyof BillAccountMovementFormData, value: string) => {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleCreateMovement = async () => {
    if (!id) {
      setFormError('Id de cuenta no encontrado');
      return;
    }

    const validationError = validateBillAccountMovementForm(formData);
    if (validationError) {
      setFormError(validationError);
      return;
    }

    try {
      setSubmitting(true);
      setFormError(null);

      const payload = buildBillAccountMovementPayload(formData);
      const response = await billAccountService.createMovement(id, payload);

      if (response?.account) {
        setAccount(response.account);
      }
      if (response?.movement) {
        setMovements((current) => [response.movement, ...current]);
      }

      setCreateDialogOpen(false);
      setSuccessMessage('Transacción registrada correctamente.');
    } catch (err) {
      setFormError(getErrorMessage(err));
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return {
    loading,
    submitting,
    error,
    successMessage,
    account,
    movements,
    createDialogOpen,
    formData,
    formError,
    handleBack,
    openCreateDialog,
    closeCreateDialog,
    handleFormChange,
    handleCreateMovement,
  };
}
