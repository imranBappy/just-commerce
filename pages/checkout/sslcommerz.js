import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { resetCart } from "~/redux/cart.slice";
import classes from "~/styles/payment.module.css";

const SslCheckout = () => {
  const cartData = useSelector((state) => state.cart);
  const settings = useSelector((state) => state.settings);
  const dispatch = useDispatch();
  const exchangeRate = settings.settingsData.currency.exchangeRate;
  const [orderData, setOrderData] = useState({});
  const sslForm = useRef();

  useEffect(() => {
    if (cartData.items.length && exchangeRate > 0) {
      const data = { cartData, exchangeRate };
      setOrderData(data);
    }
  }, [cartData, exchangeRate]);

  const submitForm = (e) => {
    e.preventDefault();
    dispatch(resetCart());
    sslForm.current.submit();
  };

  return (
    <div className="layout_top">
      <div className={classes.container}>
        <h2 className={classes.h2}>Pay Now</h2>
        <form
          action={`/api/checkout/sslcommerz`}
          method="POST"
          ref={sslForm}
          onSubmit={submitForm}
        >
          <input type="hidden" name="order" value={JSON.stringify(orderData)} />
          <button className="ssl_button" type="submit">
            Pay Now
          </button>
        </form>
      </div>
    </div>
  );
};

SslCheckout.footer = false;

export default SslCheckout;
