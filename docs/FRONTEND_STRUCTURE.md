# Frontend Structure

## Overview

The frontend of AppWeb POS is a Single Page Application (SPA) built with React 18 and Vite that implements a modular and scalable architecture, completely decoupled from the backend.

Main features:
- Fast development and optimized build with Vite
- Professional interface with Material UI
- SPA navigation with React Router
- State management via React Hooks
- Decoupled services to consume API

---

## Directory Structure

```
frontend/
├── src/
│   ├── index.css              # Global styles (TailwindCSS)
│   ├── main.jsx               # Entry point
│   ├── App.jsx                # Root component
│   ├── theme.js               # Material UI theme
│   │
│   ├── components/            # REUSABLE COMPONENTS
│   │   ├── common/
│   │   │   ├── Header.jsx     # Application header
│   │   │   ├── Sidebar.jsx    # Navigation sidebar
│   │   │   ├── LoadingSpinner.jsx
│   │   │   └── ErrorBoundary.jsx
│   │   │
│   │   ├── forms/             # Form components
│   │   │   ├── ProductForm.jsx
│   │   │   ├── OrderForm.jsx
│   │   │   ├── ContactForm.jsx
│   │   │   └── FormField.jsx
│   │   │
│   │   ├── tables/            # Table components
│   │   │   ├── ProductTable.jsx
│   │   │   ├── OrderTable.jsx
│   │   │   └── DataTable.jsx
│   │   │
│   │   ├── modals/            # Modal components
│   │   │   ├── ConfirmDialog.jsx
│   │   │   ├── ProductModal.jsx
│   │   │   └── OrderModal.jsx
│   │   │
│   │   └── dashboard/         # Dashboard components
│   │       ├── SalesChart.jsx
│   │       ├── StockWidget.jsx
│   │       └── ReportsCard.jsx
│   │
│   ├── pages/                 # PAGE SCREENS
│   │   ├── Dashboard.jsx      # Main dashboard
│   │   ├── Products/
│   │   │   ├── ProductList.jsx
│   │   │   ├── ProductDetail.jsx
│   │   │   └── ProductCreate.jsx
│   │   │
│   │   ├── Orders/
│   │   │   ├── OrderList.jsx
│   │   │   ├── OrderDetail.jsx
│   │   │   └── CreateOrder.jsx
│   │   │
│   │   ├── Contacts/
│   │   │   ├── ContactList.jsx
│   │   │   ├── ContactDetail.jsx
│   │   │   └── CreateContact.jsx
│   │   │
│   │   ├── POS/
│   │   │   └── POSTerminal.jsx
│   │   │
│   │   ├── Reports/
│   │   │   ├── SalesReport.jsx
│   │   │   ├── InventoryReport.jsx
│   │   │   └── FinancialReport.jsx
│   │   │
│   │   ├── Auth/
│   │   │   ├── Login.jsx
│   │   │   ├── ForgotPassword.jsx
│   │   │   └── ResetPassword.jsx
│   │   │
│   │   ├── Settings/
│   │   │   └── UserSettings.jsx
│   │   │
│   │   └── NotFound.jsx       # 404 page
│   │
│   ├── services/              # API CLIENT LAYER (Adapters)
│   │   ├── api.js            # Base HTTP client
│   │   ├── productService.js # API: Products
│   │   ├── orderService.js   # API: Orders
│   │   ├── contactService.js # API: Contacts
│   │   ├── userService.js    # API: Users
│   │   ├── posService.js     # API: POS
│   │   ├── categoryService.js # API: Categories
│   │   ├── supplierService.js # API: Suppliers
│   │   ├── purchaseService.js # API: Purchases
│   │   ├── billAccountService.js # API: Accounts receivable
│   │   └── reportService.js   # API: Reports
│   │
│   ├── context/               # STATE MANAGEMENT (Global Context)
│   │   ├── AppContext.jsx     # Main context
│   │   ├── AuthContext.jsx    # Authentication state
│   │   ├── UserContext.jsx    # User state
│   │   └── NotificationContext.jsx # Notifications state
│   │
│   ├── controllers/           # PAGE LOGIC (optional)
│   │   ├── productController.js
│   │   ├── orderController.js
│   │   └── posController.js
│   │
│   ├── models/                # DATA MODELS
│   │   ├── Product.js
│   │   ├── Order.js
│   │   ├── Contact.js
│   │   ├── User.js
│   │   └── index.js
│   │
│   ├── utils/                 # HELPER FUNCTIONS
│   │   ├── formatters.js      # Data formatting
│   │   ├── validators.js      # Data validation
│   │   ├── localStorage.js    # Local storage
│   │   ├── dateUtils.js       # Date handling
│   │   ├── numberUtils.js     # Numeric operations
│   │   └── constants.js       # Global constants
│   │
│   └── types/                 # TYPES (JSDoc, TypeScript optional)
│       ├── Product.d.js
│       ├── Order.d.js
│       └── User.d.js
│
├── public/                    # Static files
│   ├── favicon.ico
│   └── logo.png
│
├── .env.example              # Variables template
├── .env.local               # Local variables (development)
├── package.json
├── vite.config.js           # Vite configuration
└── index.html               # HTML root
```

---

## Architecture Layers (Frontend)

### 1. Pages (Screen Layer)

Responsibility: Full page components representing screens.

Characteristics:
- Correspond to routes (React Router)
- Call services to fetch data
- Handle page-level state
- Render reusable components

Example: ProductList.jsx
```jsx
import { useState, useEffect } from 'react';
import { productService } from '../../services/productService';
import ProductTable from '../../components/tables/ProductTable';
import CreateProductForm from '../../components/forms/ProductForm';

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await productService.getAll();
      setProducts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorAlert message={error} />;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Products</h1>
      <CreateProductForm onSuccess={fetchProducts} />
      <ProductTable products={products} />
    </div>
  );
}
```

---

### 2. Components (Reusable UI)

Responsibility: Reusable components without business logic.

Characteristics:
- Props for configuration
- Callbacks for events
- Do not access services directly
- Material UI as foundation

Example: ProductForm.jsx
```jsx
import { useState } from 'react';
import { TextField, Button, Box } from '@mui/material';

export default function ProductForm({ onSubmit, initialData = {} }) {
  const [formData, setFormData] = useState(initialData);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          name="name"
          label="Name"
          value={formData.name || ''}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          name="price"
          label="Price"
          type="number"
          value={formData.price || ''}
          onChange={handleChange}
          fullWidth
        />
        <Button type="submit" variant="contained">
          Save
        </Button>
      </Box>
    </form>
  );
}
```

Component types:
- Common: Header, Sidebar, LoadingSpinner, ErrorBoundary
- Forms: ProductForm, OrderForm, ContactForm
- Tables: DataTable, ProductTable, OrderTable
- Modals: ConfirmDialog, Modal base
- Dashboard: Charts, Widgets, Cards

---

### 3. Services (API Client Layer)

Responsibility: Adapt HTTP requests to the application.

Characteristics:
- Centralize API calls
- Handle authentication (tokens)
- Transform responses
- Add necessary headers

Example: productService.js
```javascript
// src/services/productService.js
import api from './api';

export const productService = {
  getAll: async (filters = {}) => {
    const response = await api.get('/products', { params: filters });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  create: async (productData) => {
    const response = await api.post('/products', productData);
    return response.data;
  },

  update: async (id, productData) => {
    const response = await api.put(`/products/${id}`, productData);
    return response.data;
  },

  delete: async (id) => {
    await api.delete(`/products/${id}`);
  },

  getMovements: async (id) => {
    const response = await api.get(`/products/${id}/movements`);
    return response.data;
  }
};
```

Base HTTP client:
```javascript
// src/services/api.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

---

### 4. Context (State Management)

Responsibility: Manage global application state.

Characteristics:
- React Context API
- Providers in App.jsx
- useContext to consume
- Avoid prop drilling

Example: AuthContext.jsx
```jsx
import { createContext, useContext, useState } from 'react';
import { userService } from '../services/userService';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await userService.login(email, password);
      setToken(response.token);
      localStorage.setItem('token', response.token);
      setUser(response.user);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
```

Consume in components:
```jsx
export default function Dashboard() {
  const { user } = useAuth();
  
  return <h1>Welcome, {user?.name}</h1>;
}
```

---

### 5. Utils (Helper Functions)

Responsibility: Reusable utility functions.

Examples:

```javascript
// src/utils/formatters.js
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP'
  }).format(amount);
};

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('es-CO');
};

// src/utils/validators.js
export const validateEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const validateProductForm = (data) => {
  const errors = {};
  if (!data.name) errors.name = 'Name is required';
  if (!data.price || data.price <= 0) errors.price = 'Invalid price';
  return errors;
};

// src/utils/constants.js
export const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered'
};

export const PAYMENT_METHODS = {
  CASH: 'cash',
  CARD: 'card',
  TRANSFER: 'transfer'
};
```

---

## Applied Design Patterns

### 1. Container/Presentational Pattern
```jsx
export default function ProductListContainer() {
  const [products, setProducts] = useState([]);
  
  useEffect(() => {
    productService.getAll().then(setProducts);
  }, []);
  
  return <ProductListPresentation products={products} />;
}

function ProductListPresentation({ products }) {
  return <ProductTable items={products} />;
}
```

### 2. Custom Hooks
```jsx
export function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const fetchProducts = async () => {
    setLoading(true);
    const data = await productService.getAll();
    setProducts(data);
    setLoading(false);
  };
  
  useEffect(() => {
    fetchProducts();
  }, []);
  
  return { products, loading, refetch: fetchProducts };
}

function ProductList() {
  const { products, loading } = useProducts();
}
```

### 3. Controlled Components
```jsx
const [email, setEmail] = useState('');

<input
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  placeholder="Email"
/>
```

---

## Routes (React Router)

```jsx
// App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import ProductList from './pages/Products/ProductList';
import OrderList from './pages/Orders/OrderList';
import Login from './pages/Auth/Login';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Dashboard />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/orders" element={<OrderList />} />
      </Routes>
    </BrowserRouter>
  );
}
```

---

## Theme and Styles

Material UI + TailwindCSS

```jsx
// src/theme.js
import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#dc004e' }
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif'
  }
});

// App.jsx
import { ThemeProvider } from '@mui/material/styles';

function App() {
  return (
    <ThemeProvider theme={theme}>
      {/* ... */}
    </ThemeProvider>
  );
}
```

---

## Development

Install dependencies:
```bash
cd frontend
npm install
```

Development (hot reload):
```bash
npm run dev
# Access http://127.0.0.1:5173
```

Build production:
```bash
npm run build
# Generates dist/ folder in backend/app/static/
```

Preview build:
```bash
npm run preview
```

---

## Testing (Recommended)

```bash
npm install --save-dev vitest @testing-library/react
```

```javascript
// __tests__/ProductForm.test.jsx
import { render, screen } from '@testing-library/react';
import ProductForm from '../ProductForm';

test('renders form fields', () => {
  render(<ProductForm onSubmit={() => {}} />);
  expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
});
```

---

## Implementation Checklist

When adding a new module:

- Create page in pages/
- Create service in services/
- Create components in components/
- Add route in App.jsx
- Add context if necessary
- Create helper utilities
- Document types (JSDoc or TS)
- Write tests

---

## Environment Variables

.env.local:
```env
VITE_API_URL=http://127.0.0.1:5000/api
VITE_APP_NAME=AppWeb POS
VITE_APP_VERSION=1.0.0
```

Access in components:
```jsx
const apiUrl = import.meta.env.VITE_API_URL;
```
