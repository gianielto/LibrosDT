// CartItemQuantity.tsx
import React from "react";
import MensajeError from "../mensajeError/mensajeError";
import "./CartItemQuantity.css";
type Props = {
  cantidad: number;
  handleChange: (value: number) => void;
  error?: string;
  setError: (value: string) => void;
};

const CartItemQuantity: React.FC<Props> = ({ cantidad, handleChange, error, setError }) => {
  return (
    <div className="cart-quantity">
      <h3>Cantidad</h3>

      <div className="contador">
        <button
          type="button"
          onClick={() => {
            if (cantidad <= 1) {
              setError("La cantidad mínima es 1");
              return;
            }
            handleChange(-1);
          }}
        >
          -
        </button>

        <input type="number" value={cantidad} readOnly />

        <button
          type="button"
          onClick={() => {
            handleChange(1);
          }}
        >
          +
        </button>
      </div>

      {error && <MensajeError mensaje={error} onClose={() => setError("")} />}
    </div>
  );
};

export default CartItemQuantity;
