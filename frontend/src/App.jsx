import {
  AppBar,
  Box,
  Button,
  Container,
  Toolbar,
  Typography
} from '@mui/material';
import { BrowserRouter, Link, Route, Routes, useLocation } from 'react-router-dom';
import ContactFormPage from './pages/ContactFormPage';
import ContactsPage from './pages/ContactsPage';
import SuppliersPage from './pages/SuppliersPage';
import CategoriesPage from './pages/CategoriesPage';
import HomePage from './pages/HomePage';
import OrdersPage from './pages/OrdersPage';
import OrderDetailPage from './pages/OrderDetailPage';
import PurchasesListPage from './pages/PurchasesListPage';
import PurchaseDetailPage from './pages/PurchaseDetailPage';
import PosPage from './pages/PosPage';
import PurchasesPage from './pages/PurchasesPage';
import ProductDetailPage from './pages/ProductDetailPage';
import ProductFormPage from './pages/ProductFormPage';
import ProductsPage from './pages/ProductsPage';
import UsersPage from './pages/UsersPage';
import UserFormPage from './pages/UserFormPage';
import BillAccountsPage from './pages/BillAccountsPage';
import BillAccountFormPage from './pages/BillAccountFormPage';
import BillAccountMovementsPage from './pages/BillAccountMovementsPage';
import LoginPage from './pages/LoginPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import SupplierFormPage from './pages/SupplierFormPage';
import ProtectedRoute from './components/ProtectedRoute';
import AuthStatus from './components/AuthStatus';
import RoleRoute from './components/RoleRoute';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProfilePage from './pages/ProfilePage';

const NAV_ITEMS = [
  { label: 'Inicio', to: '/' },
  { label: 'Punto de venta', to: '/pos' },
  { label: 'Ventas', to: '/orders' },
  { label: 'Compras', to: '/purchase-orders' },
  { label: 'Clientes', to: '/contacts' },
  { label: 'Productos', to: '/products' },
];

function AppLayout() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const isImmersiveRoute = location.pathname === '/pos' || location.pathname === '/purchases';

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      {/* Header */}
      <AppBar position="sticky" color="transparent" elevation={0}>
        <Container maxWidth="xl" sx={{ px: { xs: 2, md: 3 } }}>
          <Toolbar
            disableGutters
            sx={{
              minHeight: 72,
              justifyContent: 'space-between',
              gap: 1.5,
              flexWrap: 'wrap',
              py: 1,
            }}
          >
            <Link to="/" style={{ textDecoration: 'none' }}>
              <Typography
                variant="h6"
                component="h1"
                sx={{
                  fontWeight: 700,
                  color: 'primary.main',
                  fontSize: '1.3rem',
                  letterSpacing: '-0.02em',
                }}
              >
                AppWeb
              </Typography>
            </Link>
            {isAuthenticated && (
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
                {NAV_ITEMS.map((item) => (
                  <Button
                    key={item.to}
                    component={Link}
                    to={item.to}
                    color="inherit"
                    sx={{
                      textDecoration: 'none',
                      borderRadius: 2,
                      px: 1.5,
                      '&:hover': { color: 'primary.main', bgcolor: 'action.hover' },
                    }}
                  >
                    {item.label}
                  </Button>
                ))}
                <AuthStatus />
              </Box>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flex: 1,
          minHeight: 0,
          width: '100%',
          py: isImmersiveRoute ? 0 : { xs: 2, md: 4 },
          overflow: isImmersiveRoute ? 'hidden' : 'auto',
        }}
      >
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<HomePage />} />

            {/* Products */}
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/:id" element={<ProductDetailPage />} />
            <Route element={<RoleRoute allow={['admin']} />}>
              <Route path="/products/new" element={<ProductFormPage />} />
              <Route path="/products/:id/edit" element={<ProductFormPage />} />
            </Route>

            {/* Categories */}
            <Route path="/categories" element={<CategoriesPage />} />

            {/* Contacts */}
            <Route path="/contacts" element={<ContactsPage />} />
            <Route path="/contacts/new" element={<ContactFormPage />} />
            <Route path="/contacts/:id/edit" element={<ContactFormPage />} />

            {/* Suppliers */}
            <Route path="/suppliers" element={<SuppliersPage />} />
            <Route path="/suppliers/new" element={<SupplierFormPage />} />

            {/* Orders */}
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/orders/:id" element={<OrderDetailPage />} />
            <Route path="/purchase-orders" element={<PurchasesListPage />} />
            <Route path="/purchase-orders/:id" element={<PurchaseDetailPage />} />
            <Route path="/pos" element={<PosPage />} />
            <Route path="/purchases" element={<PurchasesPage />} />

            {/* Users */}
            <Route element={<RoleRoute allow={['admin']} />}>
              <Route path="/users" element={<UsersPage />} />
              <Route path="/users/new" element={<UserFormPage />} />
              <Route path="/users/:id/edit" element={<UserFormPage />} />
              <Route path="/bill-accounts" element={<BillAccountsPage />} />
              <Route path="/bill-accounts/new" element={<BillAccountFormPage />} />
              <Route path="/bill-accounts/:id/edit" element={<BillAccountFormPage />} />
              <Route path="/bill-accounts/:id/movements" element={<BillAccountMovementsPage />} />
            </Route>

            {/* Profile */}
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
        </Routes>
      </Box>

      {/* Footer */}
      <Box
        component="footer"
        sx={(theme) => ({
          boxShadow: `inset 0 1px 0 ${theme.palette.action.selected}`,
          py: 3,
          mt: 'auto',
        })}
      >
        <Container maxWidth="xl" sx={{ px: { xs: 2, md: 3 } }}>
          <Typography variant="body2" color="text.secondary" align="center">
            &copy; 2026 AppWeb. Todos los derechos reservados.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppLayout />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
