import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonNote,
  IonPage,
  IonText,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { container } from "app/container";
import type { Cart } from "domain/entities/Cart";
import { chevronBackOutline, trashOutline } from "ionicons/icons";
import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";

export function CartPage() {
  const { customerId } = useParams<{ customerId: string }>();
  const history = useHistory();
  const [cart, setCart] = useState<Cart | null>(null);

  useEffect(() => {
    void container.getCartUseCase.execute(customerId).then(setCart);
  }, [customerId]);

  const total = cart?.items.reduce((sum, i) => sum + i.price * i.quantity, 0) ?? 0;

  const handleRemove = async (productId: string) => {
    const updated = await container.removeFromCartUseCase.execute(customerId, productId);
    setCart(updated);
  };

  const handleUpdateQty = async (productId: string, productName: string, price: number, qty: number) => {
    if (qty <= 0) {
      const updated = await container.removeFromCartUseCase.execute(customerId, productId);
      setCart(updated);
    } else {
      const updated = await container.addToCartUseCase.execute(customerId, productId, productName, price, qty);
      setCart(updated);
    }
  };

  const isEmpty = !cart || cart.items.length === 0;

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton onClick={() => history.goBack()}>
              <IonIcon icon={chevronBackOutline} slot="icon-only" />
            </IonButton>
          </IonButtons>
          <IonTitle>Carrito</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        {isEmpty ? (
          <div className="ion-padding">
            <IonText color="medium">
              <p>El carrito está vacío. Agrega productos primero.</p>
            </IonText>
          </div>
        ) : (
          <>
            <IonList>
              {cart.items.map((item) => (
                <IonItem key={item.productId}>
                  <IonLabel>
                    <h2>{item.productName}</h2>
                    <p>${item.price.toFixed(2)} c/u</p>
                  </IonLabel>
                  <div slot="end" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <IonButton
                      size="small"
                      fill="outline"
                      onClick={() =>
                        void handleUpdateQty(item.productId, item.productName, item.price, item.quantity - 1)
                      }
                    >
                      −
                    </IonButton>
                    <IonNote>{item.quantity}</IonNote>
                    <IonButton
                      size="small"
                      onClick={() =>
                        void handleUpdateQty(item.productId, item.productName, item.price, item.quantity + 1)
                      }
                    >
                      +
                    </IonButton>
                    <IonButton
                      size="small"
                      fill="clear"
                      color="danger"
                      onClick={() => void handleRemove(item.productId)}
                    >
                      <IonIcon icon={trashOutline} slot="icon-only" />
                    </IonButton>
                  </div>
                </IonItem>
              ))}
            </IonList>

            <div className="ion-padding">
              <IonItem lines="none">
                <IonLabel>
                  <h2>
                    <strong>Total</strong>
                  </h2>
                </IonLabel>
                <IonNote slot="end" color="dark" style={{ fontSize: "1.2rem", fontWeight: "bold" }}>
                  ${total.toFixed(2)}
                </IonNote>
              </IonItem>

              <IonButton
                expand="block"
                style={{ marginTop: "1rem" }}
                onClick={() => history.push(`/pos/complete/${customerId}`)}
              >
                Completar venta
              </IonButton>
            </div>
          </>
        )}
      </IonContent>
    </IonPage>
  );
}
