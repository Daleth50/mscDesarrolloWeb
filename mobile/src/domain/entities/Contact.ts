export interface Contact {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  notes?: string | null;
  pendingSync?: boolean;
  geolocation?: { lat: number; lng: number } | null;
  kind: "customer" | "supplier";
}
