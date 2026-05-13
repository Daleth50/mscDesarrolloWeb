import {
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from "@ionic/react";
import {
  cashOutline,
  personOutline,
  cloudUploadOutline,
  storefrontOutline,
  swapHorizontalOutline,
} from "ionicons/icons";
import { CustomersTabPage } from "presentation/pages/CustomersTabPage";
import { PlaceholderPage } from "presentation/pages/PlaceholderPage";
import { ProfileTabPage } from "presentation/pages/ProfileTabPage";
import { UploadSyncTabPage } from "presentation/pages/UploadSyncTabPage";
import { Redirect, Route } from "react-router-dom";

export function TabsPage() {
  return (
    <IonTabs>
      <IonRouterOutlet>
        <Route path="/tabs/customers" component={CustomersTabPage} exact />
        <Route path="/tabs/returns" component={PlaceholderPage} exact />
        <Route path="/tabs/expenses" component={PlaceholderPage} exact />
        <Route path="/tabs/sync" component={UploadSyncTabPage} exact />
        <Route path="/tabs/profile" component={ProfileTabPage} exact />
        <Redirect exact from="/tabs" to="/tabs/customers" />
      </IonRouterOutlet>

      <IonTabBar slot="bottom">
        <IonTabButton tab="customers" href="/tabs/customers">
          <IonIcon icon={storefrontOutline} />
          <IonLabel>Vender</IonLabel>
        </IonTabButton>
        {/* <IonTabButton tab="returns" href="/tabs/returns">
          <IonIcon icon={swapHorizontalOutline} />
          <IonLabel>Cambios</IonLabel>
        </IonTabButton> */}
        <IonTabButton tab="expenses" href="/tabs/expenses">
          <IonIcon icon={cashOutline} />
          <IonLabel>Gastos</IonLabel>
        </IonTabButton>
        <IonTabButton tab="sync" href="/tabs/sync">
          <IonIcon icon={cloudUploadOutline} />
          <IonLabel>Sincronizar</IonLabel>
        </IonTabButton>
        <IonTabButton tab="profile" href="/tabs/profile">
          <IonIcon icon={personOutline} />
          <IonLabel>Perfil</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
}
