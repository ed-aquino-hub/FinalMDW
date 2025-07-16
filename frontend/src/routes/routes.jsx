// src/routes/routes.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Importaciones corregidas según la estructura del proyecto
import Home from '../pages/Home/Home';
import CheckoutForm from '../pages/Checkout/CheckoutForm';
import LoginForm from '../pages/Login/LoginForm';
import RegisterForm from '../pages/Register/RegisterForm';
import Cart from '../components/Cart';
import HistorialCompras from '../pages/HistorialCompras/HistorialCompras';
import CompraExitosaModal from '../components/CompraExitosaModal';
import AdminPanel from '../pages/AdminPanel/AdminPanel';
import Ventas from '../pages/Ventas/Ventas';

import PrivateRoute from '../protected/PrivateRoute';

const AppRoutes = () => (
  <Routes>
    {/* Rutas públicas */}
    <Route path="/" element={<Home />} />
    <Route path="/checkout" element={<CheckoutForm />} />
    <Route path="/login" element={<LoginForm />} />
    <Route path="/register" element={<RegisterForm />} />
    <Route path="/cart" element={<Cart />} />
    <Route path="/historial" element={<HistorialCompras />} />
    <Route path="/compra-exitosa" element={<CompraExitosaModal />} />

    {/* Rutas privadas */}
    <Route
      path="/admin"
      element={
        <PrivateRoute allowedRoles={['ADMIN']}>
          <AdminPanel />
        </PrivateRoute>
      }
    />
    <Route
      path="/ventas"
      element={
        <PrivateRoute allowedRoles={['EMPLEADO']}>
          <Ventas />
        </PrivateRoute>
      }
    />
  </Routes>
);

export default AppRoutes;
