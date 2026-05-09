import { IonApp } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { AppLoadingScreen } from "presentation/components/AppLoadingScreen";
import { AppStateProvider, useAppState } from "presentation/context/AppStateContext";
import { CartPage } from "presentation/pages/CartPage";
import { CompleteSalePage } from "presentation/pages/CompleteSalePage";
import { LoginPage } from "presentation/pages/LoginPage";
import { ProductsPage } from "presentation/pages/ProductsPage";
import { SyncPage } from "presentation/pages/SyncPage";
import { TabsPage } from "presentation/pages/TabsPage";
import { Redirect, Route, Switch } from "react-router-dom";

function AppRoutes() {
  const { isBootstrapping, session, isInitialSyncCompleted } = useAppState();

  if (isBootstrapping) {
    return <AppLoadingScreen />;
  }

  const loggedInTarget = isInitialSyncCompleted ? "/tabs/customers" : "/sync";

  return (
    <IonReactRouter>
      <Switch>
        <Route path="/login" exact>
          {session ? <Redirect to={loggedInTarget} /> : <LoginPage />}
        </Route>

        <Route path="/sync" exact>
          {!session ? (
            <Redirect to="/login" />
          ) : isInitialSyncCompleted ? (
            <Redirect to="/tabs/customers" />
          ) : (
            <SyncPage />
          )}
        </Route>

        <Route path="/pos/products/:customerId" exact>
          {!session ? <Redirect to="/login" /> : <ProductsPage />}
        </Route>

        <Route path="/pos/cart/:customerId" exact>
          {!session ? <Redirect to="/login" /> : <CartPage />}
        </Route>

        <Route path="/pos/complete/:customerId" exact>
          {!session ? <Redirect to="/login" /> : <CompleteSalePage />}
        </Route>

        <Route path="/tabs">
          {!session ? (
            <Redirect to="/login" />
          ) : !isInitialSyncCompleted ? (
            <Redirect to="/sync" />
          ) : (
            <TabsPage />
          )}
        </Route>

        <Route exact path="/">
          {!session ? <Redirect to="/login" /> : <Redirect to={loggedInTarget} />}
        </Route>
      </Switch>
    </IonReactRouter>
  );
}

export default function App() {
  return (
    <IonApp>
      <AppStateProvider>
        <AppRoutes />
      </AppStateProvider>
    </IonApp>
  );
}
