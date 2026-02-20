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
import ProductDetailPage from './pages/ProductDetailPage';
import ProductFormPage from './pages/ProductFormPage';
import ProductsPage from './pages/ProductsPage';

const StyledFooter = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderTop: `1px solid ${theme.palette.divider}`,
  marginTop: 'auto',
  padding: theme.spacing(3, 0),
}));

function App() {
  return (
    <BrowserRouter>
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
              <Box sx={{ display: 'flex', gap: 3 }}>
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
                  to="/orders"
                  color="inherit"
                  sx={{
                    textDecoration: 'none',
                    '&:hover': { color: 'primary.main' },
                  }}
                >
                  Ventas
                </Button>
              </Box>
            </Toolbar>
          </Container>
        </AppBar>

        {/* Main content */}
        <Box component="main" sx={{ flex: 1 }}>
          <Container maxWidth="lg" sx={{ py: 6 }}>
            <Routes>
              <Route path="/" element={<HomePage />} />

              {/* Products */}
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/products/new" element={<ProductFormPage />} />
              <Route path="/products/:id" element={<ProductDetailPage />} />
              <Route path="/products/:id/edit" element={<ProductFormPage />} />

              {/* Categories */}
              <Route path="/categories" element={<CategoriesPage />} />

              {/* Contacts */}
              <Route path="/contacts" element={<ContactsPage />} />
              <Route path="/contacts/new" element={<ContactFormPage />} />

              {/* Orders */}
              <Route path="/orders" element={<OrdersPage />} />
              <Route path="/orders/new" element={<OrderFormPage />} />
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
    </BrowserRouter>
  );
}

export default App;
