import { useState } from 'react';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { contactService } from '../services/contactService';
import { getErrorMessage } from '../utils/error';
import { buildContactPayload, validateContactForm, type ContactFormData } from '../models/contact';

type ContactFormChangeEvent = {
	target: {
		name: string;
		value: string;
	};
};

export function useContactForm() {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const isEdit = !!id;
	const [loading, setLoading] = useState(isEdit);
	const [error, setError] = useState<string | null>(null);
	const [formData, setFormData] = useState<ContactFormData>({
		name: '',
		email: '',
		phone: '',
		address: '',
	});

	const handleChange = (e: ContactFormChangeEvent) => {
		const { name, value } = e.target;
		const field = name as keyof ContactFormData;
		setFormData((prev) => ({
			...prev,
			[field]: value,
		}));
	};

	useEffect(() => {
		if (isEdit && id) {
			loadContact();
		}
	}, [id, isEdit]);

	const loadContact = async () => {
		try {
			setLoading(true);
			const contact = await contactService.getById(id!);
			if (contact) {
				setFormData({
					name: contact.name || '',
					email: contact.email || '',
					phone: contact.phone || '',
					address: contact.address || '',
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

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const validationError = validateContactForm(formData);
		if (validationError) {
			setError(validationError);
			return;
		}
		try {
			const payload = buildContactPayload(formData, 'customer');
			if (isEdit) {
				await contactService.update(id!, payload);
			} else {
				await contactService.create(payload);
			}
			navigate('/contacts');
		} catch (err) {
			setError(getErrorMessage(err));
			console.error(err);
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