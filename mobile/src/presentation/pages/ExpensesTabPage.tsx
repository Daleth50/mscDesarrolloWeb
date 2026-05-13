import {
  IonContent,
  IonHeader,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonTitle,
  IonToolbar,
  IonFab,
  IonFabButton,
  IonIcon,
  IonBadge,
  type RefresherEventDetail,
} from "@ionic/react";
import { addOutline } from "ionicons/icons";
import { container } from "app/container";
import type { Expense } from "domain/entities/Expense";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

import { useAppState } from "presentation/context/AppStateContext";
function formatRelativeDate(isoDate: string): string {
  const date = new Date(isoDate);
  const now = new Date();
  const seconds = (now.getTime() - date.getTime()) / 1000;

  if (seconds < 60) return "hace poco";
  if (seconds < 3600) return `hace ${Math.floor(seconds / 60)}m`;
  if (seconds < 86400) return `hace ${Math.floor(seconds / 3600)}h`;
  if (seconds < 604800) return `hace ${Math.floor(seconds / 86400)}d`;

  return date.toLocaleDateString("es-ES", { month: "short", day: "numeric" });
}

export function ExpensesTabPage() {
  const history = useHistory();
    const { syncUpdateTrigger } = useAppState();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadExpenses = async () => {
    try {
      setError("");
      const items = await container.getLocalExpensesUseCase.execute();
      setExpenses(items);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar gastos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadExpenses();
  }, [syncUpdateTrigger]);

  const handleRefresh = async (event: CustomEvent<RefresherEventDetail>) => {
    await loadExpenses();
    event.detail.complete();
  };

  const handleCreateExpense = () => {
    history.push("/expenses/create");
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Gastos</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent />
        </IonRefresher>

        {loading ? (
          <div style={{ padding: "2rem", textAlign: "center" }}>
            <p style={{ color: "#999" }}>Cargando gastos...</p>
          </div>
        ) : error ? (
          <div style={{ padding: "1rem" }}>
            <div style={{ color: "#d32f2f", fontSize: "14px", marginBottom: "1rem" }}>
              {error}
            </div>
            <button onClick={loadExpenses} style={{ padding: "0.5rem 1rem", cursor: "pointer" }}>
              Reintentar
            </button>
          </div>
        ) : expenses.length === 0 ? (
          <div style={{ padding: "2rem", textAlign: "center", color: "#999" }}>
            <p>No hay gastos registrados</p>
          </div>
        ) : (
          <div style={{ paddingBottom: "3rem" }}>
            {expenses.map((expense) => (
              <div
                key={expense.id}
                style={{
                  padding: "12px 16px",
                  borderBottom: "1px solid #eee",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "16px", fontWeight: "600" }}>
                    ${expense.amount.toFixed(2)}
                  </div>
                  {expense.note && (
                    <div style={{ fontSize: "13px", color: "#666", marginTop: "4px" }}>
                      {expense.note.length > 40
                        ? `${expense.note.substring(0, 40)}...`
                        : expense.note}
                    </div>
                  )}
                  <div style={{ fontSize: "12px", color: "#999", marginTop: "4px" }}>
                    {formatRelativeDate(expense.createdAt)}
                  </div>
                </div>
                <div style={{ marginLeft: "12px" }}>
                  <IonBadge
                    color={expense.status === "synced" ? "success" : "warning"}
                    style={{ fontSize: "11px", padding: "4px 8px" }}
                  >
                    {expense.status === "synced" ? "Sincronizado" : "Pendiente"}
                  </IonBadge>
                </div>
              </div>
            ))}
          </div>
        )}
      </IonContent>

      <IonFab vertical="bottom" horizontal="end" slot="fixed">
        <IonFabButton onClick={handleCreateExpense}>
          <IonIcon icon={addOutline} />
        </IonFabButton>
      </IonFab>
    </IonPage>
  );
}
