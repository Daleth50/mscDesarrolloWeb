import {
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from "@ionic/react";
import { peopleOutline, settingsOutline } from "ionicons/icons";
import { CustomersTabPage } from "presentation/pages/CustomersTabPage";
import { SettingsTabPage } from "presentation/pages/SettingsTabPage";
import { Redirect, Route } from "react-router-dom";

export function TabsPage() {
  return (
    <IonTabs>
      <IonRouterOutlet>
        <Route path="/tabs/customers" component={CustomersTabPage} exact />
        <Route path="/tabs/settings" component={SettingsTabPage} exact />
        <Redirect exact from="/tabs" to="/tabs/customers" />
      </IonRouterOutlet>

      <IonTabBar slot="bottom">
        <IonTabButton tab="customers" href="/tabs/customers">
          <IonIcon icon={peopleOutline} />
          <IonLabel>Clientes</IonLabel>
        </IonTabButton>
        <IonTabButton tab="settings" href="/tabs/settings">
          <IonIcon icon={settingsOutline} />
          <IonLabel>Ajustes</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
}
