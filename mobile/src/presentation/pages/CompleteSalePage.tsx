import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonNote,
  IonPage,
  IonRadio,
  IonRadioGroup,
  IonSpinner,
  IonText,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { container } from "app/container";
import type { BillAccount } from "domain/entities/BillAccount";
import type { Cart } from "domain/entities/Cart";
import { checkmarkCircleOutline, chevronBackOutline } from "ionicons/icons";
import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";

type PageState = "idle" | "submitting" | "done" | "error";

export function CompleteSalePage() {
  const { customerId } = useParams<{ customerId: string }>();
  const history = useHistory();

  const [cart, setCart] = useState<Cart | null>(null);
  const [billAccounts, setBillAccounts] = useState<BillAccount[]>([]);
  const [selectedAccountId, setSelectedAccountId] = useState<string>("");
  const [pageState, setPageState] = useState<PageState>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    void container.getCartUseCase.execute(customerId).then(setCart);
    void container.getLocalBillAccountsUseCase.execute().then((accounts) => {
      setBillAccounts(accounts);
      if (accounts.length > 0) setSelectedAccountId(accounts[0].id);
    });
  }, [customerId]);

  const total = cart?.items.reduce((sum, i) => sum + i.price * i.quantity, 0) ?? 0;

  const handleConfirm = async () => {
    if (!cart || cart.items.length === 0) return;
    if (!selectedAccountId) {
      setErrorMsg("Selecciona una cuenta de cobro.");
      return;
    }

    setPageState("submitting");
    setErrorMsg("");

    try {
      await container.completeSaleUseCase.execute({
        customerId,
        items: cart.items,
        billAccountId: selectedAccountId,
        total,
      });
      await container.clearCartUseCase.execute(customerId);
      setPageState("done");
    } catch (err) {
      setPageState("error");
      setErrorMsg(err instanceof Error ? err.message : "Error desconocido");
    }
  };

  const handleGoHome = () => {
    history.replace("/tabs/customers");
  };

  if (pageState === "done") {
    return (
      <IonPage>
        <IonContent fullscreen className="ion-padding">
          <div className="screen-centered">
            <IonIcon icon={checkmarkCircleOutline} style={{ fontSize: "4rem", color: "var(--ion-color-success)" }} />
            <IonText>
              <h2>¡Venta completada!</h2>
              <p>Total: ${total.toFixed(2)}</p>
            </IonText>
            <IonButton expand="block" onClick={handleGoHome} style={{ marginTop: "1rem" }}>
              Volver a clientes
            </IonButton>
          </div>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton onClick={() => history.goBack()} disabled={pageState === "submitting"}>
              <IonIcon icon={chevronBackOutline} slot="icon-only" />
            </IonButton>
          </IonButtons>
          <IonTitle>Completar venta</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonList>
          <IonListHeader>
            <IonLabel>Resumen del pedido</IonLabel>
          </IonListHeader>
          {cart?.items.map((item) => (
            <IonItem key={item.productId}>
              <IonLabel>
                <h3>{item.productName}</h3>
                <p>
                  {item.quantity} × ${item.price.toFixed(2)}
                </p>
              </IonLabel>
              <IonNote slot="end">${(item.quantity * item.price).toFixed(2)}</IonNote>
            </IonItem>
          ))}
          <IonItem lines="none">
            <IonLabel>
              <strong>Total</strong>
            </IonLabel>
            <IonNote slot="end" color="dark" style={{ fontSize: "1.1rem", fontWeight: "bold" }}>
              ${total.toFixed(2)}
            </IonNote>
          </IonItem>
        </IonList>

        <IonList style={{ marginTop: "1rem" }}>
          <IonListHeader>
            <IonLabel>Método de pago</IonLabel>
          </IonListHeader>
          <IonRadioGroup
            value={selectedAccountId}
            onIonChange={(e) => setSelectedAccountId(e.detail.value as string)}
          >
            {billAccounts.map((account) => (
              <IonItem key={account.id}>
                <IonLabel>
                  <h3>{account.name}</h3>
                  <p>{account.type === "cash" ? "Efectivo" : "Crédito / Deuda"}</p>
                </IonLabel>
                <IonRadio slot="end" value={account.id} />
              </IonItem>
            ))}
          </IonRadioGroup>
        </IonList>

        {errorMsg ? (
          <div className="ion-padding">
            <IonText color="danger">
              <p>{errorMsg}</p>
            </IonText>
          </div>
        ) : null}

        <div className="ion-padding">
          <IonButton
            expand="block"
            onClick={() => void handleConfirm()}
            disabled={pageState === "submitting" || !selectedAccountId}
          >
            {pageState === "submitting" ? <IonSpinner name="crescent" /> : "Confirmar venta"}
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
}
