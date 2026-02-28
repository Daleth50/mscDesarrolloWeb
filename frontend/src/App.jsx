import {
  AppBar,
  Box,
  Button,
  Container,
  Toolbar,
  Typography
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import ContactFormPage from './pages/ContactFormPage';
import ContactsPage from './pages/ContactsPage';
import CategoriesPage from './pages/CategoriesPage';
import HomePage from './pages/HomePage';
import OrderFormPage from './pages/OrderFormPage';
import OrdersPage from './pages/OrdersPage';
import PosPage from './pages/PosPage';
import ProductDetailPage from './pages/ProductDetailPage';
import ProductFormPage from './pages/ProductFormPage';
import ProductsPage from './pages/ProductsPage';
import UsersPage from './pages/UsersPage';
import UserFormPage from './pages/UserFormPage';
import LoginPage from './pages/LoginPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import ProtectedRoute from './components/ProtectedRoute';
import AuthStatus from './components/AuthStatus';
import RoleRoute from './components/RoleRoute';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProfilePage from './pages/ProfilePage';

const StyledFooter = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderTop: `1px solid ${theme.palette.divider}`,
  marginTop: 'auto',
  padding: theme.spacing(3, 0),
}));

function AppLayout() {
  const { isAuthenticated, canManageUsers } = useAuth();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Header */}
      <AppBar position="static" color="default" elevation={1}>
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ justifyContent: 'space-between', gap: 2 }}>
            <Link to="/" style={{ textDecoration: 'none' }}>
              <Typography
                variant="h6"
                component="h1"
                sx={{
                  fontWeight: 700,
                  color: 'primary.main',
                  fontSize: '1.25rem',
                }}
              >
                AppWeb
              </Typography>
            </Link>
            {isAuthenticated && (
              <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
                <Button
                  component={Link}
                  to="/"
                  color="inherit"
                  sx={{
                    textDecoration: 'none',
                    '&:hover': { color: 'primary.main' },
                  }}
                >
                  Inicio
                </Button>
                <Button
                  component={Link}
                  to="/products"
                  color="inherit"
                  sx={{
                    textDecoration: 'none',
                    '&:hover': { color: 'primary.main' },
                  }}
                >
                  Productos
                </Button>
                <Button
                  component={Link}
                  to="/categories"
                  color="inherit"
                  sx={{
                    textDecoration: 'none',
                    '&:hover': { color: 'primary.main' },
                  }}
                >
                  Categorías
                </Button>
                <Button
                  component={Link}
                  to="/contacts"
                  color="inherit"
                  sx={{
                    textDecoration: 'none',
                    '&:hover': { color: 'primary.main' },
                  }}
                >
                  Contactos
                </Button>
                <Button
                  component={Link}
                  to="/pos"
                  color="inherit"
                  sx={{
                    textDecoration: 'none',
                    '&:hover': { color: 'primary.main' },
                  }}
                >
                  Punto de venta
                </Button>
                <Button
                  component={Link}
                  to="/orders"
                  color="inherit"
                  sx={{
                    textDecoration: 'none',
                    '&:hover': { color: 'primary.main' },
                  }}
                >
                  Ventas
                </Button>
                {canManageUsers && (
                  <Button
                    component={Link}
                    to="/users"
                    color="inherit"
                    sx={{
                      textDecoration: 'none',
                      '&:hover': { color: 'primary.main' },
                    }}
                  >
                    Usuarios
                  </Button>
                )}
                <AuthStatus />
              </Box>
            )}
          </Toolbar>
        </Container>
      </AppBar>

        {/* Main content */}
        <Box component="main" sx={{ flex: 1 }}>
          <Container maxWidth="lg" sx={{ py: 6 }}>
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

                {/* Orders */}
                <Route path="/orders" element={<OrdersPage />} />
                <Route path="/orders/new" element={<OrderFormPage />} />
                <Route path="/pos" element={<PosPage />} />

                {/* Users */}
                <Route element={<RoleRoute allow={['admin']} />}>
                  <Route path="/users" element={<UsersPage />} />
                  <Route path="/users/new" element={<UserFormPage />} />
                  <Route path="/users/:id/edit" element={<UserFormPage />} />
                </Route>

                {/* Profile */}
                <Route path="/profile" element={<ProfilePage />} />
              </Route>
            </Routes>
          </Container>
        </Box>

        {/* Footer */}
        <StyledFooter component="footer">
          <Container maxWidth="lg">
            <Typography variant="body2" color="textSecondary" align="center">
              &copy; 2026 AppWeb. Todos los derechos reservados.
            </Typography>
          </Container>
        </StyledFooter>
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
