import { useEffect, useMemo, useState } from 'react';
import { contactService } from '../services/contactService';
import { purchaseService } from '../services/purchaseService';
import { getErrorMessage } from '../utils/error';
import type { CartItem, Contact, Order, PosProduct, UUID } from '../types/models';

const DEFAULT_PAYMENT_STATUS = 'pending';

export function usePurchaseCart() {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [suppliers, setSuppliers] = useState<Contact[]>([]);
	const [products, setProducts] = useState<PosProduct[]>([]);
	const [cart, setCart] = useState<Order | null>(null);
	const [selectedSupplierId, setSelectedSupplierId] = useState<UUID | ''>('');

	const cartItems = cart?.items || [];

	const summary = useMemo(() => {
		const subtotal = cart?.subtotal || 0;
		const tax = cart?.tax || 0;
		const discount = cart?.discount || 0;
		const total = cart?.total || 0;
		return { subtotal, tax, discount, total };
	}, [cart]);

	useEffect(() => {
		loadInitialData();
	}, []);

	const loadInitialData = async () => {
		try {
			setLoading(true);
			const [suppliersData, purchaseProducts] = await Promise.all([
				contactService.getAll('supplier'),
				purchaseService.getProducts(),
			]);
			setSuppliers(suppliersData);
			setProducts(purchaseProducts);
		} catch (err) {
			setError(getErrorMessage(err));
			console.error(err);
		} finally {
			setLoading(false);
		}
	};

	const ensureCart = async () => {
		if (cart?.id) {
			return cart.id;
		}

		const created = await purchaseService.createCart({
			contact_id: selectedSupplierId || null,
			payment_status: DEFAULT_PAYMENT_STATUS,
		});
		setCart(created);
		return created.id;
	};

	const handleSelectSupplier = async (supplierId: UUID | '') => {
		setSelectedSupplierId(supplierId);

		if (!cart?.id) {
			return;
		}

		try {
			setLoading(true);
			const updated = await purchaseService.updateCart(cart.id, {
				contact_id: supplierId || null,
			});
			setCart(updated);
			setError(null);
		} catch (err) {
			setError(getErrorMessage(err));
			console.error(err);
		} finally {
			setLoading(false);
		}
	};

	const addProductToCart = async (productId: UUID, quantity: number) => {
		try {
			setLoading(true);
			const cartId = await ensureCart();
			const updated = await purchaseService.addItem(cartId, { product_id: productId, quantity });
			setCart(updated);
			setError(null);
		} catch (err) {
			setError(getErrorMessage(err));
			console.error(err);
			throw err;
		} finally {
			setLoading(false);
		}
	};

	const updateItemQuantity = async (item: CartItem, quantity: number) => {
		if (!cart?.id) {
			return;
		}

		try {
			setLoading(true);
			const updated = await purchaseService.updateItem(cart.id, item.id, { quantity });
			setCart(updated);
			setError(null);
		} catch (err) {
			setError(getErrorMessage(err));
			console.error(err);
			throw err;
		} finally {
			setLoading(false);
		}
	};

	const removeItem = async (item: CartItem) => {
		if (!cart?.id) {
			return;
		}

		try {
			setLoading(true);
			const updated = await purchaseService.removeItem(cart.id, item.id);
			setCart(updated);
			setError(null);
		} catch (err) {
			setError(getErrorMessage(err));
			console.error(err);
			throw err;
		} finally {
			setLoading(false);
		}
	};

	const completePurchase = async () => {
		if (!cart?.id) {
			throw new Error('No hay compra para completar');
		}
		const completed = await purchaseService.complete(cart.id);
		setCart(completed);
		setSelectedSupplierId('');
		return completed;
	};

	const resetCurrentPurchase = () => {
		setCart(null);
		setSelectedSupplierId('');
	};

	return {
		loading,
		error,
		suppliers,
		products,
		cart,
		cartItems,
		selectedSupplierId,
		summary,
		handleSelectSupplier,
		addProductToCart,
		updateItemQuantity,
		removeItem,
		completePurchase,
		resetCurrentPurchase,
	};
}