export type CategoryFormData = {
  name: string;
  ordering: number | null;
  color: string;
};

export function validateCategoryForm(formData: CategoryFormData): string | null {
  if (!formData.name.trim()) {
    return 'El nombre de la categoría es requerido';
  }
  return null;
}

export function buildCategoryPayload(formData: CategoryFormData) {
  return {
    name: formData.name.trim(),
    ordering: formData.ordering,
    color: formData.color,
  };
}
