import { useState, useEffect, type ChangeEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productService } from '../services/productService';
import { getErrorMessage } from '../utils/error';
import type {
	Product,
	ProductInventoryMovement,
	ProductInventoryMovementsResponse,
} from '../types/models';

const DEFAULT_MOVEMENTS_ROWS_PER_PAGE = 10;

export function useProductDetail() {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);
	const [movementsLoading, setMovementsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [product, setProduct] = useState<Product | null>(null);
	const [movements, setMovements] = useState<ProductInventoryMovement[]>([]);
	const [movementsError, setMovementsError] = useState<string | null>(null);
	const [movementsPage, setMovementsPage] = useState(0);
	const [movementsRowsPerPage, setMovementsRowsPerPage] = useState(DEFAULT_MOVEMENTS_ROWS_PER_PAGE);
	const [movementsTotal, setMovementsTotal] = useState(0);

	useEffect(() => {
		loadProduct();
	}, [id]);

	useEffect(() => {
		setMovementsPage(0);
		setMovementsRowsPerPage(DEFAULT_MOVEMENTS_ROWS_PER_PAGE);
		setMovementsTotal(0);
	}, [id]);

	useEffect(() => {
		loadMovements();
	}, [id, movementsPage, movementsRowsPerPage]);

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

	const loadMovements = async () => {
		if (!id) {
			setMovements([]);
			setMovementsError(null);
			setMovementsTotal(0);
			setMovementsLoading(false);
			return;
		}

		try {
			setMovementsLoading(true);
			setMovementsError(null);

			const response = await productService.getMovements(id, {
				page: movementsPage + 1,
				perPage: movementsRowsPerPage,
			}) as ProductInventoryMovementsResponse;

			const responseItems = Array.isArray(response?.items) ? response.items : [];
			const totalItems = Number(response?.pagination?.total_items ?? responseItems.length);

			setMovements(responseItems);
			setMovementsTotal(Number.isFinite(totalItems) ? totalItems : responseItems.length);
		} catch (movementError) {
			setMovements([]);
			setMovementsTotal(0);
			setMovementsError(getErrorMessage(movementError));
			console.error(movementError);
		} finally {
			setMovementsLoading(false);
		}
	};

	const handleMovementsPageChange = (_event: unknown, newPage: number) => {
		setMovementsPage(newPage);
	};

	const handleMovementsRowsPerPageChange = (event: ChangeEvent<HTMLInputElement>) => {
		const nextRows = Number(event.target.value);
		setMovementsRowsPerPage(Number.isFinite(nextRows) && nextRows > 0 ? nextRows : DEFAULT_MOVEMENTS_ROWS_PER_PAGE);
		setMovementsPage(0);
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
		movementsLoading,
		error,
		product,
		movements,
		movementsError,
		movementsPage,
		movementsRowsPerPage,
		movementsTotal,
		handleMovementsPageChange,
		handleMovementsRowsPerPageChange,
		handleEdit,
		handleBack,
	};
}