import { useEffect, useState } from 'react';
import { categoryService } from '../services/categoryService';
import { getErrorMessage } from '../utils/error';
import type { Category, UUID } from '../types/models';

type CategoryFormData = {
  name: string;
};

export function useCategoriesList() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<UUID | null>(null);
  const [formData, setFormData] = useState<CategoryFormData>({ name: '' });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await categoryService.getAll();
      setCategories(data);
      setError(null);
    } catch (err) {
      setError(getErrorMessage(err));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingCategoryId(null);
    setFormData({ name: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (category: Category) => {
    setEditingCategoryId(category.id);
    setFormData({ name: category.name || category.label || '' });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCategoryId(null);
    setFormData({ name: '' });
  };

  const handleChange = (value: string) => {
    setFormData({ name: value });
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      if (editingCategoryId) {
        await categoryService.update(editingCategoryId, formData);
      } else {
        await categoryService.create(formData);
      }
      await loadCategories();
      closeModal();
    } catch (err) {
      setError(getErrorMessage(err));
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: UUID) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar esta categoría?')) {
      return;
    }

    try {
      await categoryService.delete(id);
      await loadCategories();
    } catch (err) {
      setError(getErrorMessage(err));
      console.error(err);
    }
  };

  return {
    categories,
    loading,
    saving,
    error,
    isModalOpen,
    editingCategoryId,
    formData,
    openCreateModal,
    openEditModal,
    closeModal,
    handleChange,
    handleSave,
    handleDelete,
  };
}
