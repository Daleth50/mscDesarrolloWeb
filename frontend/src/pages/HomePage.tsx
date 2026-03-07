import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Container,
  Box,
  Card,
  CardContent,
  CardActions,
  Button,
  Grid,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import GroupIcon from '@mui/icons-material/Group';
import AssignmentIcon from '@mui/icons-material/Assignment';
import SearchIcon from '@mui/icons-material/Search';
import CategoryIcon from '@mui/icons-material/Category';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import AssessmentIcon from '@mui/icons-material/Assessment';
import { useAuth } from '../context/AuthContext';

export default function HomePage() {
  const { canManageUsers } = useAuth();
  const [search, setSearch] = useState('');

  const modules = [
    {
      title: 'Punto de venta',
      description: 'Registra ventas rápidas',
      href: '/pos',
      icon: ShoppingCartIcon,
      color: 'primary',
    },
    {
      title: 'Categorías',
      description: 'Organiza tus productos',
      href: '/categories',
      icon: CategoryIcon,
      color: 'secondary',
    },
    {
      title: 'Ventas',
      description: 'Visualiza pedidos',
      href: '/orders',
      icon: AssignmentIcon,
      color: 'info',
    },

    {
      title: 'Clientes',
      description: 'Administra clientes',
      href: '/contacts',
      icon: GroupIcon,
      color: 'success',
    },
  ];

  if (canManageUsers) {
    modules.push({
      title: 'Proveedores',
      description: 'Administra proveedores',
      href: '/suppliers',
      icon: SearchIcon,
      color: 'warning',
    });
    modules.push({
      title: 'Compras',
      description: 'Visualiza compras registradas',
      href: '/purchase-orders',
      icon: AssignmentIcon,
      color: 'info',
    });
    modules.push({
      title: 'Comprar',
      description: 'Registra compras a proveedores',
      href: '/purchases',
      icon: Inventory2Icon,
      color: 'primary',
    });
    modules.push({
      title: 'Usuarios',
      description: 'Administra cuentas del sistema',
      href: '/users',
      icon: ManageAccountsIcon,
      color: 'error',
    });
    modules.push({
      title: 'Cuentas banco',
      description: 'Administra cuentas bancarias',
      href: '/bill-accounts',
      icon: AccountBalanceIcon,
      color: 'secondary',
    });
    modules.push({
      title: 'Reportes',
      description: 'Analiza ventas, compras y rendimiento',
      href: '/reports',
      icon: AssessmentIcon,
      color: 'info',
    });
  }

  const normalizedQuery = search.trim().toLowerCase();
  const filteredModules = useMemo(() => {
    if (!normalizedQuery) {
      return modules;
    }

    return modules.filter((module) => {
      const searchableText = `${module.title} ${module.description}`.toLowerCase();
      return searchableText.includes(normalizedQuery);
    });
  }, [modules, normalizedQuery]);

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', md: 'center' },
            flexDirection: { xs: 'column', md: 'row' },
            gap: 2,
          }}
        >
          <Box>
            <Typography variant="h3" component="h1" sx={{ mb: 1, fontWeight: 700 }}>
              Bienvenido a AppWeb
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Selecciona un módulo para gestionar la operación del sistema.
            </Typography>
          </Box>

          <TextField
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar módulo"
            size="small"
            sx={{ minWidth: { xs: '100%', md: 320 } }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
        </Box>
      </Box>

      <Grid container spacing={3}>
        {filteredModules.map((module) => {
          const IconComponent = module.icon;
          return (
            <Grid item xs={12} sm={6} md={4} key={module.title}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 3,
                  },
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <IconComponent sx={{ fontSize: 32, color: module.color, mr: 1 }} />
                    <Typography variant="h6" component="h3">
                      {module.title}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {module.description}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    component={Link}
                    to={module.href}
                    variant="contained"
                    color={module.color as any}
                    fullWidth
                  >
                    Ir
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          );
        })}

        {filteredModules.length === 0 && (
          <Grid item xs={12}>
            <Typography color="text.secondary">No se encontraron módulos para tu búsqueda.</Typography>
          </Grid>
        )}
      </Grid>
    </Container>
  );
}
