import {
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonNote,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonText,
  IonTitle,
  IonToolbar,
  type RefresherEventDetail,
} from "@ionic/react";
import { container } from "app/container";
import type { Contact } from "domain/entities/Contact";
import { cartOutline } from "ionicons/icons";
import { useEffect, useMemo, useState } from "react";
import { useHistory } from "react-router-dom";

export function CustomersTabPage() {
  const history = useHistory();
  const [customers, setCustomers] = useState<Contact[]>([]);
  const [query, setQuery] = useState("");

  const loadCustomers = async () => {
    const items = await container.getLocalCustomersUseCase.execute();
    setCustomers(items);
  };

  useEffect(() => {
    void loadCustomers();
  }, []);

  const filteredCustomers = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return customers;
    return customers.filter((c) => c.name.toLowerCase().includes(q));
  }, [customers, query]);

  const handleRefresh = async (event: CustomEvent<RefresherEventDetail>) => {
    await loadCustomers();
    event.detail.complete();
  };

  const handleSelectCustomer = (customerId: string) => {
    history.push(`/pos/products/${customerId}`);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Customers</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent />
        </IonRefresher>

        <div className="ion-padding">
          <IonItem>
            <IonLabel position="stacked">Search customer</IonLabel>
            <IonInput
              value={query}
              onIonInput={(e) => setQuery(e.detail.value || "")}
              placeholder="Search by name"
            />
          </IonItem>
        </div>

        {filteredCustomers.length === 0 ? (
          <div className="ion-padding">
            <IonText color="medium">
              <p>No local customers available.</p>
            </IonText>
          </div>
        ) : (
          <IonList inset>
            {filteredCustomers.map((customer) => (
              <IonItem
                key={customer.id}
                button
                detail
                onClick={() => handleSelectCustomer(customer.id)}
              >
                <IonLabel>
                  <h2>{customer.name}</h2>
                  <p>{customer.email || customer.phone || "No contact info"}</p>
                </IonLabel>
                <IonNote slot="end" color="primary">
                  New sale
                </IonNote>
              </IonItem>
            ))}
          </IonList>
        )}
      </IonContent>
    </IonPage>
  );
}
