import { alpha, createTheme } from '@mui/material/styles';

const theme = createTheme({
  shape: {
    borderRadius: 14,
  },
  typography: {
    fontFamily: 'Inter, Roboto, Arial, sans-serif',
    h3: {
      fontWeight: 700,
      letterSpacing: '-0.02em',
    },
    h4: {
      fontWeight: 700,
      letterSpacing: '-0.01em',
    },
    h5: {
      fontWeight: 700,
    },
    h6: {
      fontWeight: 700,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: (themeParam) => ({
        html: {
          height: '100%',
        },
        body: {
          minHeight: '100%',
          background: `linear-gradient(180deg, ${alpha(themeParam.palette.primary.main, 0.08)} 0%, ${themeParam.palette.background.default} 240px)`,
        },
        '#root': {
          minHeight: '100vh',
        },
      }),
    },
    MuiContainer: {
      styleOverrides: {
        maxWidthLg: {
          maxWidth: '1440px',
        },
        maxWidthXl: {
          maxWidth: '1680px',
        },
      },
    },
    MuiPaper: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: ({ theme: themeParam }) => ({
          border: `1px solid ${alpha(themeParam.palette.divider, 0.9)}`,
          boxShadow: `0 10px 30px ${alpha(themeParam.palette.common.black, 0.05)}`,
          backgroundImage: 'none',
        }),
      },
    },
    MuiCard: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: ({ theme: themeParam }) => ({
          border: `1px solid ${alpha(themeParam.palette.divider, 0.9)}`,
          boxShadow: `0 10px 24px ${alpha(themeParam.palette.common.black, 0.05)}`,
        }),
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: ({ theme: themeParam }) => ({
          backgroundColor: alpha(themeParam.palette.primary.main, 0.06),
          '& .MuiTableCell-root': {
            fontWeight: 700,
            color: themeParam.palette.text.primary,
          },
        }),
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: 10,
          paddingInline: 16,
        },
        contained: ({ theme: themeParam }) => ({
          boxShadow: `0 8px 20px ${alpha(themeParam.palette.primary.main, 0.22)}`,
        }),
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: ({ theme: themeParam }) => ({
          backgroundColor: alpha(themeParam.palette.background.paper, 0.9),
          backdropFilter: 'blur(8px)',
          borderBottom: `1px solid ${themeParam.palette.divider}`,
        }),
      },
    },
  },
});

export default theme;
