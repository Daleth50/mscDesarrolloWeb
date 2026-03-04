import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productService } from '../services/productService';
import { getErrorMessage } from '../utils/error';
import type { Product } from '../types/models';

export function useProductDetail() {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [product, setProduct] = useState<Product | null>(null);

	useEffect(() => {
		loadProduct();
	}, [id]);

	const loadProduct = async () => {
		if (!id) {
			setError('Id de producto no encontrado');
			setLoading(false);
			return;
		}

		try {
			setLoading(true);
			setError(null);
			const data = await productService.getById(id);
			if (!data) {
				setError('Producto no encontrado');
				setProduct(null);
			} else {
				setProduct(data);
			}
		} catch (err) {
			setError(getErrorMessage(err));
			setProduct(null);
			console.error(err);
		} finally {
			setLoading(false);
		}
	};

	const handleEdit = () => {
		if (!id) {
			setError('Id de producto no encontrado');
			return;
		}
		navigate(`/products/${id}/edit`);
	};

	const handleBack = () => {
		navigate('/products');
	};

	return {
		loading,
		error,
		product,
		handleEdit,
		handleBack,
	};
}