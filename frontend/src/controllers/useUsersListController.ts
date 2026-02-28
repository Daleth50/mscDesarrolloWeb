import { useEffect, useState } from 'react';
import { userService } from '../services/userService';
import { getErrorMessage } from '../utils/error';
import type { User, UUID } from '../types/models';

export function useUsersList() {
	const [users, setUsers] = useState<User[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		loadUsers();
	}, []);

	const loadUsers = async () => {
		try {
			setLoading(true);
			const data = await userService.getAll();
			setUsers(data);
			setError(null);
		} catch (err) {
			setError(getErrorMessage(err));
			console.error(err);
		} finally {
			setLoading(false);
		}
	};

	const handleDelete = async (id: UUID) => {
		if (!window.confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
			return;
		}

		try {
			await userService.delete(id);
			await loadUsers();
		} catch (err) {
			setError(getErrorMessage(err));
			console.error(err);
		}
	};

	return {
		users,
		loading,
		error,
		loadUsers,
		handleDelete,
	};
}