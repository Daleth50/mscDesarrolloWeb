import { useState } from 'react';
import { Button, Menu, MenuItem, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AuthStatus() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);

  if (!user) {
    return null;
  }

  const roleLabel = user.role === 'admin' ? 'Admin' : 'Vendedor';
  const fullName = `${user.first_name} ${user.last_name}`.trim();

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleProfile = () => {
    handleClose();
    navigate('/profile');
  };

  const handleLogout = () => {
    handleClose();
    logout();
    navigate('/login');
  };

  return (
    <>
      <Button
        color="inherit"
        onClick={handleOpen}
        sx={{
          textTransform: 'none',
          fontWeight: 500,
          '&:hover': { color: 'primary.main' },
        }}
      >
        <Typography variant="body2" color="inherit" sx={{ mr: 1 }}>
          {fullName}
        </Typography>
        <Typography
          component="span"
          variant="caption"
          sx={{
            px: 1,
            py: 0.25,
            borderRadius: 1,
            bgcolor: 'grey.100',
            color: 'text.secondary',
            fontWeight: 600,
          }}
        >
          {roleLabel}
        </Typography>
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem onClick={handleProfile}>Perfil</MenuItem>
        <MenuItem onClick={handleLogout}>Cerrar sesion</MenuItem>
      </Menu>
    </>
  );
}
