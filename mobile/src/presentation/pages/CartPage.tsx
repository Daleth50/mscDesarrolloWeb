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
import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";

export function CartPage() {
  const { customerId } = useParams<{ customerId: string }>();
  const history = useHistory();
  const [cart, setCart] = useState<Cart | null>(null);

  useEffect(() => {
    void container.getCartUseCase.execute(customerId).then(setCart);
  }, [customerId]);

  const subtotal = cart?.items.reduce((sum, i) => sum + i.price * i.quantity, 0) ?? 0;

  const handleRemove = async (productId: string) => {
    setCart(await container.removeFromCartUseCase.execute(customerId, productId));
  };

  const handleUpdateQty = async (productId: string, productName: string, price: number, qty: number) => {
    if (qty <= 0) {
      setCart(await container.removeFromCartUseCase.execute(customerId, productId));
    } else {
      setCart(await container.addToCartUseCase.execute(customerId, productId, productName, price, qty));
    }
  };

  const isEmpty = !cart || cart.items.length === 0;

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/tabs/customers" text="Atrás" />
          </IonButtons>
          <IonTitle>Carrito</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <div style={{ padding: "12px 16px", paddingBottom: "80px" }}>
          {isEmpty ? (
            <p style={{ color: "#999", fontSize: "13px" }}>El carrito está vacío. Agrega productos primero.</p>
          ) : (
            <>
              {cart.items.map((item) => (
                <div key={item.productId} className="cart-item-card">
                  <div className="cart-item-row">
                    <div className="product-img" />
                    <div className="cart-item-info">
                      <div className="cart-item-name">{item.productName}</div>
                      <div className="cart-item-sub">${item.price.toFixed(2)} c/u</div>
                      <span
                        className="cart-item-remove"
                        onClick={() => void handleRemove(item.productId)}
                      >
                        Eliminar
                      </span>
                    </div>
                  </div>
                  <div className="cart-item-bottom">
                    <span className="product-price">${(item.price * item.quantity).toFixed(2)}</span>
                    <div className="qty-control">
                      <button
                        className="qty-btn"
                        onClick={() => void handleUpdateQty(item.productId, item.productName, item.price, item.quantity - 1)}
                      >
                        −
                      </button>
                      <span className="qty-value">{item.quantity}</span>
                      <button
                        className="qty-btn"
                        onClick={() => void handleUpdateQty(item.productId, item.productName, item.price, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              <div className="cart-summary">
                <div className="summary-row">
                  <span>Subtotal:</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="summary-row">
                  <span>Descuento:</span>
                  <span>$0.00</span>
                </div>
                <div className="summary-total">
                  <span>Total:</span>
                  <span className="summary-total-amount">${subtotal.toFixed(2)}</span>
                </div>
              </div>
            </>
          )}
        </div>
      </IonContent>

      {!isEmpty && (
        <div className="cart-actions" style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "#fff", borderTop: "1px solid #e0e0e0", zIndex: 10 }}>
          <button className="btn-outline" style={{ flex: 1 }}>Efectivo</button>
          <button
            className="btn-primary"
            style={{ flex: 1 }}
            onClick={() => history.push(`/pos/complete/${customerId}`)}
          >
            Cobrar
          </button>
        </div>
      )}
    </IonPage>
  );
}
