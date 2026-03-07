import { useEffect, useState } from 'react';
import { userService } from '../services/userService';
import { getErrorMessage } from '../utils/error';
import type { User } from '../types/models';

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

	return {
		users,
		loading,
		error,
		loadUsers,
	};
}