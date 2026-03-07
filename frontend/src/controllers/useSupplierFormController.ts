import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supplierService } from '../services/supplierService';
import { getErrorMessage } from '../utils/error';
import { buildContactPayload, validateContactForm, type ContactFormData } from '../models/contact';

type SupplierFormChangeEvent = {
	target: {
		name: string;
		value: string;
	};
};

export function useSupplierForm() {
	const navigate = useNavigate();
	const [error, setError] = useState<string | null>(null);
	const [formData, setFormData] = useState<ContactFormData>({
		name: '',
		email: '',
		phone: '',
		address: '',
	});

	const handleChange = (e: SupplierFormChangeEvent) => {
		const { name, value } = e.target;
		const field = name as keyof ContactFormData;
		setFormData((prev) => ({
			...prev,
			[field]: value,
		}));
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const validationError = validateContactForm(formData);
		if (validationError) {
			setError(validationError);
			return;
		}

		try {
			await supplierService.create(buildContactPayload(formData, 'supplier'));
			navigate('/suppliers');
		} catch (err) {
			setError(getErrorMessage(err));
			console.error(err);
		}
	};

	return {
		error,
		formData,
		handleChange,
		handleSubmit,
	};
}