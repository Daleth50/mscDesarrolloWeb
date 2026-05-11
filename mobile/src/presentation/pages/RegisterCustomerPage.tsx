import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton } from "@ionic/react";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import { container } from "app/container";

export function RegisterCustomerPage() {
  const history = useHistory();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) return;
    setIsSaving(true);
    try {
      // try to capture current geolocation (best-effort)
      const getPosition = () =>
        new Promise<{ lat: number; lng: number } | null>((resolve) => {
          if (!navigator || !navigator.geolocation) return resolve(null);
          navigator.geolocation.getCurrentPosition(
            (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
            () => resolve(null),
            { timeout: 5000 },
          );
        });

      const geolocation = await getPosition();

      await container.addLocalCustomerUseCase.execute({
        name: name.trim(),
        phone: phone.trim() || null,
        email: email.trim() || null,
        address: address.trim() || null,
        notes: notes.trim() || null,
        geolocation: geolocation,
        kind: "customer",
      } as any);

      history.replace("/tabs/customers");
    } catch (err) {
      // fallback: console log
      // In-app alert could be added
      // eslint-disable-next-line no-console
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton onClick={() => history.goBack()}>Atrás</IonButton>
          </IonButtons>
          <IonTitle>Nuevo cliente</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <div style={{ padding: 16, maxWidth: 520 }}>
          <div>
            <div className="field-label">Nombre *</div>
            <input className="field-input" value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div style={{ marginTop: 12 }}>
            <div className="field-label">Teléfono</div>
            <input className="field-input" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>

          <div style={{ marginTop: 12 }}>
            <div className="field-label">Email</div>
            <input className="field-input" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          <div style={{ marginTop: 12 }}>
            <div className="field-label">Dirección</div>
            <input className="field-input" value={address} onChange={(e) => setAddress(e.target.value)} />
          </div>

          <div style={{ marginTop: 12 }}>
            <div className="field-label">Notas</div>
            <textarea className="field-input" value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>

          <div style={{ marginTop: 18 }}>
            <button className="btn-primary" onClick={() => void handleSave()} disabled={isSaving || !name.trim()}>
              {isSaving ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
}
