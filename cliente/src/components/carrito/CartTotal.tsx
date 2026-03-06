import Btn1 from "../ui/Button/Btn1";
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

      <Btn1 className="buy-btn" onClick={onBuy}>
        comprar
      </Btn1>
    </div>
  );
};

export default CartTotal;
