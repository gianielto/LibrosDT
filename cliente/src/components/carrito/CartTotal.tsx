import "./CartTotal.css";
interface CartTotalProps {
  total: number;
  onBuy?: () => void;
}

const CartTotal: React.FC<CartTotalProps> = ({ total, onBuy }) => {
  return (
    <div className="cart-total">
      <h2>Total</h2>

      <h1>$ {total.toFixed(2)}</h1>

      <button className="buy-btn" onClick={onBuy}>
        comprar
      </button>
    </div>
  );
};

export default CartTotal;
