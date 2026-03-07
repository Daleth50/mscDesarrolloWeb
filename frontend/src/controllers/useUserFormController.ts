import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { userService } from '../services/userService';
import { getErrorMessage } from '../utils/error';
import { buildUserPayload, validateUserForm, type UserFormData } from '../models/user';

type UserFormChangeEvent = {
	target: {
		name: string;
		value: string;
	};
};

export function useUserForm() {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const isEdit = !!id;

	const [loading, setLoading] = useState(isEdit);
	const [error, setError] = useState<string | null>(null);
	const [formData, setFormData] = useState<UserFormData>({
		first_name: '',
		last_name: '',
		email: '',
		username: '',
		password: '',
		role: 'seller',
	});

	useEffect(() => {
		if (isEdit && id) {
			loadUser();
		}
	}, [id, isEdit]);

	const loadUser = async () => {
		try {
			setLoading(true);
			const user = await userService.getById(id!);
			if (user) {
				setFormData({
					first_name: user.first_name || '',
					last_name: user.last_name || '',
					email: user.email || '',
					username: user.username || '',
					password: '',
					role: user.role as 'admin' | 'seller',
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

	const handleChange = (e: UserFormChangeEvent) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const validationError = validateUserForm(formData, isEdit);
		if (validationError) {
			setError(validationError);
			return;
		}

		try {
			setLoading(true);
			const payload = buildUserPayload(formData, isEdit);

			if (isEdit) {
				await userService.update(id!, payload);
			} else {
				await userService.create(payload);
			}
			navigate('/users');
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
		setError,
	};
}