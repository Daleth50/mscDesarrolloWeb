import { useEffect, useState } from 'react';
import { supplierService } from '../services/supplierService';
import { getErrorMessage } from '../utils/error';
import type { Contact } from '../types/models';

export function useSuppliersList() {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [suppliers, setSuppliers] = useState<Contact[]>([]);

	useEffect(() => {
		loadSuppliers();
	}, []);

	const loadSuppliers = async () => {
		try {
			setLoading(true);
			const data = await supplierService.getAll();
			setSuppliers(data);
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
		suppliers,
	};
}