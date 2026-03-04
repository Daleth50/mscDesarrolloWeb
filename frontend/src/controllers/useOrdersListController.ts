import { useState, useEffect } from 'react';
import { orderService } from '../services/orderService';
import { getErrorMessage } from '../utils/error';
import type { Order } from '../types/models';

export function useOrdersList() {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [orders, setOrders] = useState<Order[]>([]);

	useEffect(() => {
		loadOrders();
	}, []);

	const loadOrders = async () => {
		try {
			setLoading(true);
			const data = await orderService.getSales();
			setOrders(data);
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
		orders,
	};
}