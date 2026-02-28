import { useEffect, useState } from 'react';
import { categoryService } from '../services/categoryService';
import { getErrorMessage } from '../utils/error';
import type { Category, UUID } from '../types/models';
import { buildCategoryPayload, validateCategoryForm, type CategoryFormData } from '../models/category';

export function useCategoriesList() {
	const [categories, setCategories] = useState<Category[]>([]);
	const [loading, setLoading] = useState(false);
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [editingCategoryId, setEditingCategoryId] = useState<UUID | null>(null);
	const [formData, setFormData] = useState<CategoryFormData>({
		name: '',
		ordering: null,
		color: '#000000',
	});

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
		setFormData({
			name: '',
			ordering: null,
			color: '#000000',
		});
		setIsModalOpen(true);
	};

	const openEditModal = (category: Category) => {
		setEditingCategoryId(category.id);
		setFormData({
			name: category.name || category.label || '',
			ordering: category.ordering ?? null,
			color: category.color ?? '#000000',
		});
		setIsModalOpen(true);
	};

	const closeModal = () => {
		setIsModalOpen(false);
		setEditingCategoryId(null);
		setFormData({
			name: '',
			ordering: null,
			color: '#000000',
		});
	};

	const handleChange = (field: keyof CategoryFormData, value: string | number | null) => {
		setFormData((prev) => ({
			...prev,
			[field]: value,
		}));
	};

	const handleSave = async () => {
		const validationError = validateCategoryForm(formData);
		if (validationError) {
			setError(validationError);
			return;
		}

		try {
			setSaving(true);
			const dataToSave = buildCategoryPayload(formData);
			if (editingCategoryId) {
				await categoryService.update(editingCategoryId, dataToSave);
			} else {
				await categoryService.create(dataToSave);
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