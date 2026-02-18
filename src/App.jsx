import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import ProductFormPage from './pages/ProductFormPage';
import ContactsPage from './pages/ContactsPage';
import ContactFormPage from './pages/ContactFormPage';
import OrdersPage from './pages/OrdersPage';
import OrderFormPage from './pages/OrderFormPage';
import HomePage from './pages/HomePage';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-50 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 shadow-sm">
          <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
            <Link to="/" className="text-xl font-bold text-blue-600">
              AppWeb
            </Link>
            <nav className="flex gap-4">
              <Link to="/" className="hover:text-blue-600">Inicio</Link>
              <Link to="/products" className="hover:text-blue-600">Productos</Link>
              <Link to="/contacts" className="hover:text-blue-600">Contactos</Link>
              <Link to="/orders" className="hover:text-blue-600">Órdenes</Link>
            </nav>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-6">
          <Routes>
            <Route path="/" element={<HomePage />} />
            
            {/* Products */}
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/new" element={<ProductFormPage />} />
            <Route path="/products/:id" element={<ProductDetailPage />} />
            <Route path="/products/:id/edit" element={<ProductFormPage />} />

            {/* Contacts */}
            <Route path="/contacts" element={<ContactsPage />} />
            <Route path="/contacts/new" element={<ContactFormPage />} />

            {/* Orders */}
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/orders/new" element={<OrderFormPage />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-slate-200 mt-auto">
          <div className="max-w-5xl mx-auto px-4 py-4 text-center text-slate-600 text-sm">
            <p>&copy; 2026 AppWeb. Todos los derechos reservados.</p>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
