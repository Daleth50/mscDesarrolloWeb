export type ContactFormData = {
  name: string;
  email: string;
  phone: string;
  address: string;
};

export function validateContactForm(formData: ContactFormData): string | null {
  if (!formData.name.trim()) {
    return 'El nombre es requerido';
  }
  return null;
}

export function buildContactPayload(formData: ContactFormData, kind: 'customer' | 'supplier') {
  return {
    name: formData.name.trim(),
    email: formData.email.trim(),
    phone: formData.phone.trim(),
    address: formData.address.trim(),
    kind,
  };
}
