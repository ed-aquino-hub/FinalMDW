import React, { useState, useEffect } from 'react';
import { useUser } from '../../context/UserContext';
import { useCart } from '../../context/CartContext';


const CheckoutForm = ({ onNext, onBack }) => {
  const { user } = useUser();
  const { cart, clearCart } = useCart();

  const [entrega, setEntrega] = useState('delivery');
  const [direccion, setDireccion] = useState('');
  const [pago, setPago] = useState('efectivo');
  const [mostrarModal, setMostrarModal] = useState(false);
  

  useEffect(() => {
    if (user?.direccion) {
      setDireccion(user.direccion);
    }
  }, [user]);

  const total = cart.reduce((sum, item) => sum + item.precio * item.cantidad, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (entrega === 'delivery' && direccion.trim() === '') {
      alert('Por favor ingresa una dirección para delivery.');
      return;
    }

    const ventaData = {
      clienteId: user.id,
      direccion,
      formaEntrega: entrega,
      tipoPago: pago,
      total,
      detalles: cart.map(item => ({
        productoId: item.id,
        cantidad: item.cantidad,
        precioUnitario: item.precio
      }))
    };

    try {
      const res = await fetch('http://localhost:8080/api/ventas/registrar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(ventaData)
      });

      if (res.ok) {
        clearCart(); // limpia el carrito

        onNext({
          nombre: user.nombre || user.email,
          direccion,
          entrega,
          pago,
          total: ventaData.total
        });
      } else {
        const err = await res.text();
        console.error('Error en el backend:', err);
        alert('Hubo un error al registrar tu pedido.');
      }
    } catch (error) {
      console.error('Error de red:', error);
      alert('No se pudo conectar con el servidor.');
    }
  };

  return (
    <div className="modal-checkout">
      <h2>Detalles de Entrega y Pago</h2>
      <form onSubmit={handleSubmit}>
        <label>Método de Entrega:</label><br />
        <select value={entrega} onChange={(e) => setEntrega(e.target.value)}>
          <option value="delivery">Delivery</option>
          <option value="recojo">Recojo en tienda</option>
        </select><br />

        {entrega === 'delivery' && (
          <>
            <label>Dirección de entrega:</label><br />
            <input
              type="text"
              placeholder="Dirección exacta"
              value={direccion}
              onChange={(e) => setDireccion(e.target.value)}
            /><br />
          </>
        )}

        <label>Método de Pago:</label><br />
        <select value={pago} onChange={(e) => setPago(e.target.value)}>
          <option value="efectivo">Efectivo</option>
          <option value="tarjeta">Tarjeta</option>
          <option value="yape">Yape</option>
          <option value="plin">Plin</option>
        </select><br />

        <div className="form-actions">
          <button type="button" onClick={onBack}>Atrás</button>
          <button type="submit">Confirmar Pedido</button>
        </div>
      </form>
    </div>
  );
};

export default CheckoutForm;
