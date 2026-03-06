import { useState, useEffect } from 'react';
import { orderService } from '../services/orderService';
import { getErrorMessage } from '../utils/error';
import type { Order } from '../types/models';

export function usePurchasesList() {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [purchases, setPurchases] = useState<Order[]>([]);

	useEffect(() => {
		loadPurchases();
	}, []);

	const loadPurchases = async () => {
		try {
			setLoading(true);
			const data = await orderService.getPurchases();
			setPurchases(data);
			setError(null);
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
		purchases,
	};
}
