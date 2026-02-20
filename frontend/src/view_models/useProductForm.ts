import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { productService } from '../services/productService';
import { categoryService } from '../services/categoryService';
import { getErrorMessage } from '../utils/error';
import type { Category, UUID } from '../types/models';

type ProductFormData = {
  name: string;
  sku: string;
  price: number;
  cost: number;
  tax_rate: number;
  category_id: UUID;
};

type ProductFormChangeEvent = {
  target: {
    name: string;
    value: string;
  };
};

const numericFields = new Set<keyof ProductFormData>([
  'price',
  'cost',
  'tax_rate',
]);

export function useProductForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [savingCategory, setSavingCategory] = useState(false);
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    sku: '',
    price: 0,
    cost: 0,
    tax_rate: 0,
    category_id: '',
  });

  useEffect(() => {
    loadPage();
  }, [id]);

  const loadPage = async () => {
    try {
      setLoading(true);

      const cats = await categoryService.getAll();
      setCategories(cats);

      if (isEdit) {
        if (!id) {
          setError('Id de producto no encontrado');
          return;
        }
        const product = await productService.getById(id);
        if (product) {
          setFormData({
            name: product.name || '',
            sku: product.sku || '',
            price: product.price || 0,
            cost: product.cost || 0,
            tax_rate: product.tax_rate || 0,
            category_id: product.category_id || '',
          });
        }
      }

      setError(null);
    } catch (err) {
      setError(getErrorMessage(err));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: ProductFormChangeEvent) => {
    const { name, value } = e.target;
    const field = name as keyof ProductFormData;
    const nextValue = numericFields.has(field) ? Number(value) : value;

    setFormData(prev => ({
      ...prev,
      [field]: nextValue,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      let result;
      if (isEdit) {
        if (!id) {
          setError('Id de producto no encontrado');
          return;
        }
        result = await productService.update(id, formData);
      } else {
        result = await productService.create(formData);
      }
      navigate(`/products/${result.id}`);
    } catch (err) {
      setError(getErrorMessage(err));
      console.error(err);
    }
  };

  const openCategoryModal = () => {
    setNewCategoryName('');
    setCategoryModalOpen(true);
  };

  const closeCategoryModal = () => {
    setCategoryModalOpen(false);
    setNewCategoryName('');
  };

  const handleNewCategoryChange = (value: string) => {
    setNewCategoryName(value);
  };

  const handleCreateCategory = async () => {
    const name = newCategoryName.trim();
    if (!name) {
      setError('El nombre de la categoría es requerido');
      return;
    }

    try {
      setSavingCategory(true);
      const createdCategory = await categoryService.create({ name });
      const cats = await categoryService.getAll();
      setCategories(cats);
      setFormData(prev => ({
        ...prev,
        category_id: createdCategory.id,
      }));
      closeCategoryModal();
      setError(null);
    } catch (err) {
      setError(getErrorMessage(err));
      console.error(err);
    } finally {
      setSavingCategory(false);
    }
  };

  return {
    categories,
    loading,
    error,
    formData,
    isEdit,
    categoryModalOpen,
    newCategoryName,
    savingCategory,
    handleChange,
    handleSubmit,
    openCategoryModal,
    closeCategoryModal,
    handleNewCategoryChange,
    handleCreateCategory,
  };
}
