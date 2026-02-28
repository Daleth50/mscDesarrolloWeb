import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { billAccountService } from '../services/billAccountService';
import { getErrorMessage } from '../utils/error';
import {
	buildBillAccountPayload,
	validateBillAccountForm,
	type BillAccountFormData,
} from '../models/billAccount';

type BillAccountFormChangeEvent = {
	target: {
		name: string;
		value: string;
	};
};

export function useBillAccountForm() {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const isEdit = !!id;

	const [loading, setLoading] = useState(isEdit);
	const [error, setError] = useState<string | null>(null);
	const [formData, setFormData] = useState<BillAccountFormData>({
		name: '',
		type: 'cash',
		balance: '0',
	});

	useEffect(() => {
		if (isEdit && id) {
			loadBillAccount();
		}
	}, [id, isEdit]);

	const loadBillAccount = async () => {
		try {
			setLoading(true);
			const account = await billAccountService.getById(id!);
			if (account) {
				setFormData({
					name: account.name || '',
					type: account.type === 'debt' ? 'debt' : 'cash',
					balance: String(account.balance ?? 0),
				});
			}
			setError(null);
		} catch (err) {
			setError(getErrorMessage(err));
			console.error(err);
		} finally {
			setLoading(false);
		}
	};

	const handleChange = (e: BillAccountFormChangeEvent) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const validationError = validateBillAccountForm(formData);
		if (validationError) {
			setError(validationError);
			return;
		}

		try {
			setLoading(true);
			const payload = buildBillAccountPayload(formData);

			if (isEdit) {
				await billAccountService.update(id!, payload);
			} else {
				await billAccountService.create(payload);
			}
			navigate('/bill-accounts');
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
		formData,
		isEdit,
		handleChange,
		handleSubmit,
	};
}