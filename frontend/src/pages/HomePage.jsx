import React from 'react';
import { Link } from 'react-router-dom';
import {
  Container,
  Box,
  Card,
  CardContent,
  CardActions,
  Button,
  Grid,
  Typography,
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import GroupIcon from '@mui/icons-material/Group';
import AssignmentIcon from '@mui/icons-material/Assignment';

export default function HomePage() {
  const modules = [
    {
      title: 'Productos',
      description: 'Gestiona tu catálogo',
      href: '/products',
      icon: ShoppingCartIcon,
      color: 'primary',
    },
    {
      title: 'Contactos',
      description: 'Administra clientes',
      href: '/contacts',
      icon: GroupIcon,
      color: 'success',
    },
    {
      title: 'Órdenes',
      description: 'Visualiza pedidos',
      href: '/orders',
      icon: AssignmentIcon,
      color: 'info',
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" sx={{ mb: 2, fontWeight: 700 }}>
          Bienvenido a AppWeb
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Sistema de gestión de productos, contactos y órdenes.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {modules.map((module) => {
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
                    color={module.color}
                    fullWidth
                  >
                    Ir
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Container>
  );
}
