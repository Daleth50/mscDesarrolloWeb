import {
  IonBadge,
  IonButton,
  IonButtons,
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonInput,
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
import type { Product } from "domain/entities/Product";
import { cartOutline, chevronBackOutline } from "ionicons/icons";
import { useEffect, useMemo, useState } from "react";
import { useHistory, useParams } from "react-router-dom";

export function ProductsPage() {
  const { customerId } = useParams<{ customerId: string }>();
  const history = useHistory();

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
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.barcode || "").toLowerCase().includes(q),
    );
  }, [products, query]);

  const cartCount = cart?.items.reduce((sum, i) => sum + i.quantity, 0) ?? 0;

  const getItemQty = (productId: string) =>
    cart?.items.find((i) => i.productId === productId)?.quantity ?? 0;

  const handleAdd = async (product: Product) => {
    const current = getItemQty(product.id);
    const updated = await container.addToCartUseCase.execute(
      customerId,
      product.id,
      product.name,
      product.price,
      current + 1,
    );
    setCart(updated);
  };

  const handleRemove = async (product: Product) => {
    const current = getItemQty(product.id);
    if (current <= 1) {
      const updated = await container.removeFromCartUseCase.execute(customerId, product.id);
      setCart(updated);
    } else {
      const updated = await container.addToCartUseCase.execute(
        customerId,
        product.id,
        product.name,
        product.price,
        current - 1,
      );
      setCart(updated);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton onClick={() => history.goBack()}>
              <IonIcon icon={chevronBackOutline} slot="icon-only" />
            </IonButton>
          </IonButtons>
          <IonTitle>Products</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={() => history.push(`/pos/cart/${customerId}`)} disabled={cartCount === 0}>
              <IonIcon icon={cartOutline} slot="start" />
              {cartCount > 0 && <IonBadge color="danger">{cartCount}</IonBadge>}
            </IonButton>
          </IonButtons>
        </IonToolbar>
        <IonToolbar>
          <div className="ion-padding-horizontal">
            <IonInput
              value={query}
              onIonInput={(e) => setQuery(e.detail.value || "")}
              placeholder="Search by name or barcode"
              clearInput
            />
          </div>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        {filtered.length === 0 ? (
          <div className="ion-padding">
            <IonText color="medium">
              <p>No products found.</p>
            </IonText>
          </div>
        ) : (
          <IonList>
            {filtered.map((product) => {
              const qty = getItemQty(product.id);
              return (
                <IonItem key={product.id}>
                  <IonLabel>
                    <h2>{product.name}</h2>
                    <p>
                      ${product.price.toFixed(2)} &nbsp;·&nbsp; Stock: {product.stock}
                      {product.category_name ? ` · ${product.category_name}` : ""}
                    </p>
                  </IonLabel>
                  {qty > 0 ? (
                    <div slot="end" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <IonButton size="small" fill="outline" onClick={() => void handleRemove(product)}>
                        −
                      </IonButton>
                      <IonNote>{qty}</IonNote>
                      <IonButton size="small" onClick={() => void handleAdd(product)}>
                        +
                      </IonButton>
                    </div>
                  ) : (
                    <IonButton slot="end" size="small" onClick={() => void handleAdd(product)}>
                      Add
                    </IonButton>
                  )}
                </IonItem>
              );
            })}
          </IonList>
        )}

        {cartCount > 0 && (
          <IonFab vertical="bottom" horizontal="end" slot="fixed">
            <IonFabButton onClick={() => history.push(`/pos/cart/${customerId}`)}>
              <IonIcon icon={cartOutline} />
              <IonBadge color="danger" style={{ position: "absolute", top: 0, right: 0 }}>
                {cartCount}
              </IonBadge>
            </IonFabButton>
          </IonFab>
        )}
      </IonContent>
    </IonPage>
  );
}
