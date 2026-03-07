import { useEffect, useState } from 'react';
import { billAccountService } from '../services/billAccountService';
import { getErrorMessage } from '../utils/error';
import type { BillAccount } from '../types/models';

export function useBillAccountsList() {
	const [billAccounts, setBillAccounts] = useState<BillAccount[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		loadBillAccounts();
	}, []);

	const loadBillAccounts = async () => {
		try {
			setLoading(true);
			const data = await billAccountService.getAll();
			setBillAccounts(data);
			setError(null);
		} catch (err) {
			setError(getErrorMessage(err));
			console.error(err);
		} finally {
			setLoading(false);
		}
	};

	return {
		billAccounts,
		loading,
		error,
		loadBillAccounts,
	};
}