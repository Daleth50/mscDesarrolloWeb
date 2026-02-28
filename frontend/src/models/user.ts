export type UserFormData = {
  first_name: string;
  last_name: string;
  email: string;
  username: string;
  password: string;
  role: 'admin' | 'seller';
};

export function validateUserForm(formData: UserFormData, isEdit: boolean): string | null {
  if (!formData.first_name.trim()) return 'El nombre es requerido';
  if (!formData.last_name.trim()) return 'El apellido es requerido';
  if (!formData.email.trim()) return 'El email es requerido';
  if (!formData.username.trim()) return 'El usuario es requerido';
  if (!isEdit && !formData.password.trim()) return 'La contraseña es requerida';
  return null;
}

export function buildUserPayload(formData: UserFormData, isEdit: boolean) {
  if (isEdit && !formData.password) {
    return {
      first_name: formData.first_name,
      last_name: formData.last_name,
      email: formData.email,
      username: formData.username,
      role: formData.role,
    };
  }
  return formData;
}
