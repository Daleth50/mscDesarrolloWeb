import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { container } from "app/container";
import type { Cart } from "domain/entities/Cart";
import type { Product } from "domain/entities/Product";
import { useEffect, useMemo, useState } from "react";
import { useHistory, useParams } from "react-router-dom";

export function ProductsPage() {
  const { customerId } = useParams<{ customerId: string }>();
  const history = useHistory();
  const bottomOffset = "calc(56px + env(safe-area-inset-bottom, 0px))";
  const bottomContentPadding = "calc(136px + env(safe-area-inset-bottom, 0px))";

  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<Cart | null>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    void container.getLocalProductsUseCase.execute().then(setProducts);
    void container.getCartUseCase.execute(customerId).then(setCart);
  }, [customerId]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;
    return products.filter(
      (p) => p.name.toLowerCase().includes(q) || (p.barcode || "").toLowerCase().includes(q),
    );
  }, [products, query]);

  const cartCount = cart?.items.reduce((sum, i) => sum + i.quantity, 0) ?? 0;

  const getItemQty = (productId: string) =>
    cart?.items.find((i) => i.productId === productId)?.quantity ?? 0;

  const handleAdd = async (product: Product) => {
    const updated = await container.addToCartUseCase.execute(
      customerId, product.id, product.name, product.price, getItemQty(product.id) + 1,
    );
    setCart(updated);
  };

  const handleRemove = async (product: Product) => {
    const current = getItemQty(product.id);
    if (current <= 1) {
      setCart(await container.removeFromCartUseCase.execute(customerId, product.id));
    } else {
      setCart(await container.addToCartUseCase.execute(customerId, product.id, product.name, product.price, current - 1));
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/tabs/customers" text="Atrás" />
          </IonButtons>
          <IonTitle>Productos</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <div style={{ padding: "12px 16px", paddingBottom: cartCount > 0 ? bottomContentPadding : "12px" }}>
          <input
            className="search-input"
            placeholder="Buscar..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          <div className="count-badge">{filtered.length} Productos</div>

          {filtered.length === 0 ? (
            <p style={{ color: "#999", fontSize: "13px" }}>No se encontraron productos.</p>
          ) : (
            filtered.map((product) => {
              const qty = getItemQty(product.id);
              return (
                <div key={product.id} className="product-card">
                  <div className="product-card-row">
                    <div className="product-img" />
                    <div style={{ flex: 1 }}>
                      <div className="product-name">{product.name}</div>
                      {product.category_name && (
                        <div className="product-sub">{product.category_name}</div>
                      )}
                    </div>
                  </div>
                  <div className="product-meta">
                    <span className="product-code">{product.barcode || product.id.slice(0, 8)}</span>
                    <span className="product-sub" style={{ marginLeft: "8px" }}>
                      Stock: {product.stock_available}
                    </span>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <span className="product-price">${product.price.toFixed(2)}</span>
                      {qty > 0 ? (
                        <div className="qty-control">
                          <button className="qty-btn" onClick={() => void handleRemove(product)}>−</button>
                          <span className="qty-value">{qty}</span>
                          <button className="qty-btn" onClick={() => void handleAdd(product)}>+</button>
                        </div>
                      ) : (
                        <button
                          className="btn-primary"
                          style={{ width: "auto", height: "28px", padding: "0 12px", fontSize: "11px" }}
                          onClick={() => void handleAdd(product)}
                        >
                          Agregar
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </IonContent>

      {cartCount > 0 && (
        <div style={{ position: "fixed", bottom: bottomOffset, left: 0, right: 0, padding: "12px 16px", background: "#fff", borderTop: "1px solid #e0e0e0", zIndex: 10 }}>
          <button
            className="btn-primary"
            onClick={() => history.push(`/pos/cart/${customerId}`)}
          >
            Ver carrito ({cartCount})
          </button>
        </div>
      )}
    </IonPage>
  );
}
