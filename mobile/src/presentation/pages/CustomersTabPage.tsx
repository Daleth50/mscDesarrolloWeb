import { IonContent, IonPage, IonRefresher, IonRefresherContent, type RefresherEventDetail } from "@ionic/react";
import { container } from "app/container";
import type { Contact } from "domain/entities/Contact";
import { useEffect, useMemo, useState } from "react";
import { useHistory } from "react-router-dom";

function groupAlphabetically(contacts: Contact[]): [string, Contact[]][] {
  const map = new Map<string, Contact[]>();
  for (const c of contacts) {
    const letter = c.name.charAt(0).toUpperCase();
    if (!map.has(letter)) map.set(letter, []);
    map.get(letter)!.push(c);
  }
  return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));
}

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

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return customers;
    return customers.filter((c) => c.name.toLowerCase().includes(q));
  }, [customers, query]);

  const groups = useMemo(() => groupAlphabetically(filtered), [filtered]);

  const handleRefresh = async (event: CustomEvent<RefresherEventDetail>) => {
    await loadCustomers();
    event.detail.complete();
  };

  return (
    <IonPage>
      <div className="page-header">
        <div className="page-header-title">Elige un cliente</div>
      </div>

      <IonContent fullscreen>
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent />
        </IonRefresher>

        <div style={{ padding: "12px 16px" }}>
          <input
            className="search-input"
            placeholder="Buscar cliente..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          {filtered.length === 0 ? (
            <p style={{ color: "#999", fontSize: "13px" }}>No hay clientes disponibles localmente.</p>
          ) : (
            groups.map(([letter, contacts]) => (
              <div key={letter}>
                <div className="alpha-section-header">{letter}</div>
                {contacts.map((c) => (
                  <div
                    key={c.id}
                    className="customer-item"
                    onClick={() => history.push(`/pos/products/${c.id}`)}
                  >
                    {c.name}
                  </div>
                ))}
              </div>
            ))
          )}
        </div>
      </IonContent>
    </IonPage>
  );
}
