import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { productService } from '../services/productService';
import { getErrorMessage } from '../utils/error';
import type { Product, UUID } from '../types/models';

export function useProductsList() {
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [products, setProducts] = useState<Product[]>([]);

	useEffect(() => {
		loadProducts();
	}, []);

	const loadProducts = async () => {
		try {
			setLoading(true);
			const data = await productService.getAll();
			setProducts(data);
		} catch (err) {
			setError(getErrorMessage(err));
			console.error(err);
		} finally {
			setLoading(false);
		}
	};

	const handleView = (id: UUID) => {
		navigate(`/products/${id}`);
	};

	const handleEdit = (id: UUID) => {
		navigate(`/products/${id}/edit`);
	};

	return {
		loading,
		error,
		products,
		handleView,
		handleEdit,
	};
}